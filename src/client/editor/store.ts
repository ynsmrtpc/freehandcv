"use client";

// Editor state (plan section 4: Zustand). There are two storage sources:
// - guest: data lives in the browser's localStorage (plan 10),
// - account: changes are written to the server after 1 s; a version mismatch reports a conflict,
//   and when offline it waits and retries once the connection is back (plan 12),
// - example: an example resume edited in the admin panel; written after 1 s, last write wins.
import { create } from "zustand";
import { saveExampleContentAction } from "@/actions/exampleContent";
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

export type StorageSource =
  | { kind: "guest" }
  | { kind: "account"; id: string; version: number }
  | { kind: "example"; id: string };

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
  /** Guest opened on the built-in sample and has not changed it yet (the editor offers a blank start). */
  untouchedSample: boolean;
  /** Counts whole-resume loads (start, sample, import, blank) so panels can reset their open/closed state. */
  loads: number;
  /** Keeps the sample and hides the offer. */
  dismissSample: () => void;
  /** Guest: loads from the browser; without saved data starts with the sample in the UI locale. */
  startGuest: (uiLocale: string) => void;
  /** Account: starts with the resume from the server. */
  startAccount: (id: string, data: ResumeData, version: number) => void;
  /** Admin panel: edits an example resume. */
  startExample: (id: string, data: ResumeData) => void;
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

const RESET = {
  past: [],
  future: [],
  lastChange: 0,
  saveStatus: { kind: "idle" } as SaveStatus,
  pageCount: 1,
  untouchedSample: false,
};

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
  loads: 0,
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
    set({ ...RESET, data: loaded ?? sampleResume(uiLocale), source: { kind: "guest" }, untouchedSample: !loaded, loads: get().loads + 1 });
  },

  startAccount(id, data, version) {
    const s = get().source;
    if (s.kind === "account" && s.id === id && get().data) return;
    if (get().data) get().saveNow();
    dirty = false;
    set({ ...RESET, data, source: { kind: "account", id, version }, loads: get().loads + 1 });
  },

  startExample(id, data) {
    const s = get().source;
    if (s.kind === "example" && s.id === id && get().data) return;
    if (get().data) get().saveNow();
    dirty = false;
    set({ ...RESET, data, source: { kind: "example", id }, loads: get().loads + 1 });
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
      untouchedSample: false,
    });
  },

  replace(input) {
    const { data, past } = get();
    set({
      data: normalizeResume(input),
      past: data ? [...past, data].slice(-HISTORY_LIMIT) : past,
      future: [],
      lastChange: 0,
      untouchedSample: false,
      loads: get().loads + 1,
    });
  },

  dismissSample() {
    set({ untouchedSample: false });
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
    const kind = get().source.kind;
    if (kind === "guest") writeToGuest();
    else if (kind === "example") void writeToExample();
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

async function writeToExample() {
  const { source, data } = useEditor.getState();
  if (source.kind !== "example" || !data || !dirty) return;
  if (writing) {
    clearTimeout(timer);
    timer = setTimeout(() => void writeToExample(), 300);
    return;
  }
  writing = true;
  dirty = false;
  useEditor.setState({ saveStatus: { kind: "saving" } });
  try {
    const r = await saveExampleContentAction(source.id, data);
    const s = useEditor.getState();
    if (s.source.kind !== "example" || s.source.id !== source.id) return;
    if (r.ok) {
      const changed = s.data !== data;
      if (changed) {
        dirty = true;
        timer = setTimeout(() => void writeToExample(), ACCOUNT_DELAY);
      }
      useEditor.setState({ saveStatus: changed ? { kind: "pending" } : { kind: "saved", at: Date.now() } });
    } else {
      dirty = true;
      useEditor.setState({
        saveStatus: {
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
    if (state.source.kind !== "guest" && prev.source.kind !== "guest" && state.source.id !== prev.source.id) return;
    dirty = true;
    clearTimeout(timer);
    if (state.source.kind === "guest") {
      timer = setTimeout(writeToGuest, GUEST_DELAY);
    } else if (state.source.kind === "example") {
      if (state.saveStatus.kind !== "saving") useEditor.setState({ saveStatus: { kind: "pending" } });
      timer = setTimeout(() => void writeToExample(), ACCOUNT_DELAY);
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
