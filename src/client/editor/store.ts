"use client";

// Editor state (plan section 4: Zustand). There are two storage sources:
// - guest: data lives in the browser's localStorage (plan 10),
// - account: changes are written to the server after 1 s; a version mismatch reports a conflict,
//   and when offline it waits and retries once the connection is back (plan 12).
import { create } from "zustand";
import { saveResumeAction } from "@/actions/resume";
import { sampleResume } from "@/lib/resume/sample";
import { normalizeResume, type ResumeData } from "@/lib/resume/schema";

export const GUEST_STORAGE_KEY = "freehandcv:guest-resume:v1";
/** Key used before the English rename; read once, migrated to GUEST_STORAGE_KEY and removed. */
const LEGACY_GUEST_STORAGE_KEY = "freehandcv:misafir-cv:v1";
const HISTORY_LIMIT = 80;
/** Consecutive changes within this window count as one undo step (not every keystroke). */
const MERGE_MS = 700;
const GUEST_DELAY = 400;
const ACCOUNT_DELAY = 1000;

export type StorageSource = { kind: "guest" } | { kind: "account"; id: string; version: number };

export type SaveStatus =
  | { kind: "idle" }
  | { kind: "pending" }
  | { kind: "saving" }
  | { kind: "saved"; at: number }
  | { kind: "error"; reason: "storage" | "network" | "tooLarge" | "session" }
  | { kind: "conflict"; serverVersion: number };

type EditorStore = {
  data: ResumeData | null;
  source: StorageSource;
  past: ResumeData[];
  future: ResumeData[];
  lastChange: number;
  saveStatus: SaveStatus;
  /** Approximate page count measured by the preview (used by the checks; not part of history). */
  pageCount: number;
  /** Guest: loads from the browser; without saved data starts with the sample in the UI locale. */
  startGuest: (uiLocale: string) => void;
  /** Account: starts with the resume from the server. */
  startAccount: (id: string, data: ResumeData, version: number) => void;
  /** Takes a function that edits a draft; works on a copy and pushes the old state to history. */
  update: (recipe: (draft: ResumeData) => void, merge?: boolean) => void;
  /** Replaces the whole resume (load sample, import JSON, start blank). */
  replace: (data: unknown) => void;
  undo: () => void;
  redo: () => void;
  /** On conflict, "keep mine": overwrites the server version. */
  keepMine: () => void;
  /** Writes a pending save right away (when the tab closes). */
  saveNow: () => void;
};

const RESET = { past: [], future: [], lastChange: 0, saveStatus: { kind: "idle" } as SaveStatus, pageCount: 1 };

/** Moves guest data saved under the legacy key to the current key (converted to the English shape). */
function migrateGuestStorage() {
  try {
    const legacy = localStorage.getItem(LEGACY_GUEST_STORAGE_KEY);
    if (legacy === null) return;
    if (localStorage.getItem(GUEST_STORAGE_KEY) === null) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(normalizeResume(JSON.parse(legacy))));
    }
    localStorage.removeItem(LEGACY_GUEST_STORAGE_KEY);
  } catch {
    // broken or inaccessible storage: leave it as is
  }
}

export const useEditor = create<EditorStore>((set, get) => ({
  data: null,
  source: { kind: "guest" },
  ...RESET,

  startGuest(uiLocale) {
    const { data, source } = get();
    if (data && source.kind === "guest") return;
    if (data) get().saveNow(); // don't lose the previous resume's pending save
    let loaded: ResumeData | null = null;
    try {
      migrateGuestStorage();
      const raw = localStorage.getItem(GUEST_STORAGE_KEY);
      if (raw) loaded = normalizeResume(JSON.parse(raw));
    } catch {
      // broken or inaccessible storage: fall back to the sample
    }
    set({ ...RESET, data: loaded ?? sampleResume(uiLocale), source: { kind: "guest" } });
  },

  startAccount(id, data, version) {
    const s = get().source;
    if (s.kind === "account" && s.id === id && get().data) return;
    if (get().data) get().saveNow();
    dirty = false;
    set({ ...RESET, data, source: { kind: "account", id, version } });
  },

  update(recipe, merge = true) {
    const { data, past, lastChange } = get();
    if (!data) return;
    const draft = structuredClone(data);
    recipe(draft);
    const now = Date.now();
    const newStep = !merge || now - lastChange > MERGE_MS;
    set({
      data: draft,
      past: newStep ? [...past, data].slice(-HISTORY_LIMIT) : past,
      future: [],
      lastChange: merge ? now : 0,
    });
  },

  replace(input) {
    const { data, past } = get();
    set({
      data: normalizeResume(input),
      past: data ? [...past, data].slice(-HISTORY_LIMIT) : past,
      future: [],
      lastChange: 0,
    });
  },

  undo() {
    const { data, past, future } = get();
    if (!data || !past.length) return;
    set({ data: past[past.length - 1], past: past.slice(0, -1), future: [data, ...future], lastChange: 0 });
  },

  redo() {
    const { data, past, future } = get();
    if (!data || !future.length) return;
    set({ data: future[0], past: [...past, data], future: future.slice(1), lastChange: 0 });
  },

  keepMine() {
    const { source, saveStatus } = get();
    if (source.kind !== "account" || saveStatus.kind !== "conflict") return;
    dirty = true;
    set({ source: { ...source, version: saveStatus.serverVersion }, saveStatus: { kind: "pending" } });
    void writeToAccount();
  },

  saveNow() {
    clearTimeout(timer);
    if (get().source.kind === "guest") writeToGuest();
    else void writeToAccount();
  },
}));

/* ---------------- Autosave ---------------- */

let timer: ReturnType<typeof setTimeout> | undefined;
let dirty = false;
let writing = false;

function writeToGuest() {
  const { data, source } = useEditor.getState();
  if (!dirty || !data || source.kind !== "guest") return;
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
    dirty = false;
    useEditor.setState({ saveStatus: { kind: "saved", at: Date.now() } });
  } catch {
    useEditor.setState({ saveStatus: { kind: "error", reason: "storage" } });
  }
}

async function writeToAccount() {
  const state = useEditor.getState();
  if (state.source.kind !== "account" || !state.data || state.saveStatus.kind === "conflict" || !dirty) return;
  if (writing) {
    // A change arriving during a write is written once that finishes.
    clearTimeout(timer);
    timer = setTimeout(() => void writeToAccount(), 300);
    return;
  }
  const { id, version } = state.source;
  const sent = state.data;
  writing = true;
  dirty = false;
  useEditor.setState({ saveStatus: { kind: "saving" } });
  try {
    const r = await saveResumeAction(id, sent, version);
    const s = useEditor.getState().source;
    if (s.kind !== "account" || s.id !== id) return; // another resume was opened meanwhile
    if (r.ok) {
      const changed = useEditor.getState().data !== sent;
      if (changed) dirty = true;
      useEditor.setState({
        source: { ...s, version: r.version },
        saveStatus: changed ? { kind: "pending" } : { kind: "saved", at: Date.now() },
      });
      if (changed) timer = setTimeout(() => void writeToAccount(), ACCOUNT_DELAY);
    } else {
      dirty = true;
      useEditor.setState({
        saveStatus:
          r.reason === "conflict"
            ? { kind: "conflict", serverVersion: r.serverVersion ?? version }
            : {
                kind: "error",
                reason: r.reason === "too_large" ? "tooLarge" : r.reason === "unauthenticated" ? "session" : "network",
              },
      });
    }
  } catch {
    dirty = true;
    useEditor.setState({ saveStatus: { kind: "error", reason: "network" } });
  } finally {
    writing = false;
  }
}

if (typeof window !== "undefined") {
  // Runs on import so every reader of GUEST_STORAGE_KEY (editor, dashboard) sees migrated data.
  migrateGuestStorage();
  useEditor.subscribe((state, prev) => {
    // Only content changes on the same resume trigger a save (not opening a new one).
    if (!state.data || state.data === prev.data || !prev.data) return;
    if (state.source.kind !== prev.source.kind) return;
    if (state.source.kind === "account" && prev.source.kind === "account" && state.source.id !== prev.source.id) return;
    dirty = true;
    clearTimeout(timer);
    if (state.source.kind === "guest") {
      timer = setTimeout(writeToGuest, GUEST_DELAY);
    } else if (state.saveStatus.kind !== "conflict") {
      if (state.saveStatus.kind !== "saving") useEditor.setState({ saveStatus: { kind: "pending" } });
      timer = setTimeout(() => void writeToAccount(), ACCOUNT_DELAY);
    }
  });
  const onLeave = () => useEditor.getState().saveNow();
  window.addEventListener("pagehide", onLeave);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && onLeave());
  window.addEventListener("online", () => {
    if (useEditor.getState().saveStatus.kind === "error") useEditor.getState().saveNow();
  });
}
