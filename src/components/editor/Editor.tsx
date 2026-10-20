"use client";

import {
  Check,
  ChevronDown,
  CloudOff,
  CloudUpload,
  Loader2,
  Download,
  Eye,
  FileJson,
  FilePlus2,
  FileUp,
  History,
  PencilLine,
  Redo2,
  Sparkles,
  Undo2,
} from "lucide-react";
import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { createVersionAction } from "@/actions/resume";
import { GoogleOneTap } from "@/components/account/GoogleOneTap";
import { UserMenu } from "@/components/account/UserMenu";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { getPathname, Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { authClient } from "@/client/auth";
import { useEditor } from "@/client/editor/store";
import { cn } from "@/lib/cn";
import { sampleResume } from "@/lib/resume/sample";
import { emptyResume, type ResumeData } from "@/lib/resume/schema";
import { fileName } from "@/lib/resume/utils";
import { ContentPanel } from "./ContentPanel";
import { ChecksPanel, useChecks } from "./ChecksPanel";
import { GuestDownloadDialog, GuestNotice } from "./GuestNotice";
import { Preview } from "./Preview";
import { DesignPanel } from "./DesignPanel";
import { IconButton } from "./ui";
import { VersionsDialog } from "./VersionsDialog";
import { ReviewPrompt, shouldAskForReview } from "./ReviewPrompt";
import "./editor.css";

const TABS = ["content", "design", "checks"] as const;
type Tab = (typeof TABS)[number];
const PDF_HINT_KEY = "freehandcv:hide-pdf-hint";
/** Key used before the English rename; still honoured so the choice isn't lost. */
const LEGACY_PDF_HINT_KEY = "freehandcv:pdf-ipucu-gizle";

export type AccountResume = { id: string; data: ResumeData; version: number };

/** With `account` the resume opens from the account and saves to the server; without it, guest mode. */
export function Editor({ account }: { account?: AccountResume }) {
  const t = useTranslations("Editor");
  const locale = useLocale();
  const source = useEditor((s) => s.source);
  const ready = account ? source.kind === "account" && source.id === account.id : source.kind === "guest";
  const data = useEditor((s) => (ready ? s.data : null));
  const [tab, setTab] = useState<Tab>("content");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [toast, setToast] = useState<{ text: string; id: number } | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [guestDownloadOpen, setGuestDownloadOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    if (account) useEditor.getState().startAccount(account.id, account.data, account.version);
    else useEditor.getState().startGuest(locale);
  }, [account, locale]);

  // A signed-in user opening the guest editor goes to their dashboard (resumes live in the account;
  // a guest resume left in the browser is moved to the account there).
  const session = authClient.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!account && session.data) {
      useEditor.getState().saveNow();
      router.replace("/dashboard");
    }
  }, [account, session.data, router]);

  const notify = useCallback((text: string) => setToast({ text, id: Date.now() }), []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const print = useCallback(() => {
    const { data: v, source } = useEditor.getState();
    // Account resumes keep what was downloaded as a PDF version (identical repeats are skipped on the server).
    if (v && source.kind === "account") void createVersionAction(source.id, v, "pdf").catch(() => {});
    const previousTitle = document.title;
    document.title = fileName(v?.personal.name ?? ""); // browsers suggest the PDF file name from the title
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    document.fonts.ready.then(() => window.print());
  }, []);

  // Print hint (can be dismissed for good), then the browser's print dialog.
  const printWithHint = useCallback(
    (direct = false) => {
      let hidden = false;
      try {
        hidden = localStorage.getItem(PDF_HINT_KEY) === "1" || localStorage.getItem(LEGACY_PDF_HINT_KEY) === "1";
      } catch {}
      if (hidden || direct) print();
      else setPdfOpen(true);
    },
    [print],
  );

  // The PDF is made on the server and downloaded as a file; if that fails, the browser's print dialog is the fallback.
  const [pdfBusy, setPdfBusy] = useState(false);
  const savePdf = useCallback(async () => {
    const { data: v, source } = useEditor.getState();
    if (!v || pdfBusy) return;
    setPdfBusy(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, data: v }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const a = document.createElement("a");
      a.href = URL.createObjectURL(await res.blob());
      a.download = fileName(v.personal.name, "pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      if (source.kind === "account") void createVersionAction(source.id, v, "pdf").catch(() => {});
      if (shouldAskForReview()) setReviewOpen(true);
    } catch {
      notify(t("toast.pdfFallback"));
      printWithHint();
    } finally {
      setPdfBusy(false);
    }
  }, [locale, notify, pdfBusy, printWithHint, t]);

  // Guests see the sign-in/sharing info on every download; "Download without signing in" is always there.
  const downloadPdf = useCallback(
    (direct = false) => {
      if (!account && !direct) setGuestDownloadOpen(true);
      else void savePdf();
    },
    [account, savePdf],
  );

  // Shortcuts: Ctrl+Z / Ctrl+Shift+Z (Ctrl+Y) undo/redo, Ctrl+P PDF.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        useEditor.getState().undo();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        useEditor.getState().redo();
      } else if (k === "p") {
        e.preventDefault();
        downloadPdf(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [downloadPdf]);

  if (!data)
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-muted" role="status">
        {t("loading")}
      </div>
    );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* The @page size comes from the resume's paper setting. */}
        <style>{`@page { size: ${data.settings.paper === "Letter" ? "letter" : "A4"}; margin: 0; }`}</style>
        <div className="editor-shell flex h-dvh flex-col bg-background">
          <TopBar
            notify={notify}
            downloadPdf={() => downloadPdf()}
            pdfBusy={pdfBusy}
            openVersions={() => setVersionsOpen(true)}
          />
          {!account && <GuestNotice />}

          <div className="editor-workspace grid min-h-0 flex-1 lg:grid-cols-[minmax(380px,460px)_1fr]">
            <section
              className={cn(
                "editor-panel flex min-h-0 flex-col border-e border-border bg-background",
                view === "preview" && "max-lg:hidden",
              )}
            >
              <div role="tablist" aria-label={t("meta")} className="flex shrink-0 gap-1 border-b border-border bg-surface px-3">
                {TABS.map((s) => (
                  <TabButton key={s} tab={s} selected={tab === s} select={setTab} />
                ))}
              </div>
              <div
                role="tabpanel"
                id={`panel-${tab}`}
                aria-labelledby={`tab-${tab}`}
                className="min-h-0 flex-1 overflow-y-auto"
              >
                {tab === "content" && <ContentPanel notify={notify} />}
                {tab === "design" && <DesignPanel />}
                {tab === "checks" && <ChecksPanel />}
              </div>
            </section>
            <section className={cn("editor-preview min-h-0", view === "edit" && "max-lg:hidden")}>
              <Preview />
            </section>
          </div>

          {/* Mobile: edit / preview toggle */}
          <div className="flex shrink-0 gap-2 border-t border-border bg-surface p-2 lg:hidden">
            {(["edit", "preview"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => setView(v)}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold",
                  view === v ? "bg-primary text-white" : "text-muted hover:bg-surface-2",
                )}
              >
                {v === "edit" ? <PencilLine className="size-4" /> : <Eye className="size-4" />}
                {t(`toolbar.${v}`)}
              </button>
            ))}
          </div>

          <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center lg:bottom-6">
            <AnimatePresence>
              {toast && (
                <m.p
                  key={toast.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                  className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-elevated"
                >
                  {toast.text}
                </m.p>
              )}
            </AnimatePresence>
          </div>

          <PdfDialog open={pdfOpen} onClose={() => setPdfOpen(false)} onContinue={print} />
          <ConflictDialog />
          <ReviewPrompt open={reviewOpen} onClose={() => setReviewOpen(false)} notify={notify} />
          {account && (
            <VersionsDialog
              resumeId={account.id}
              open={versionsOpen}
              onClose={() => setVersionsOpen(false)}
              notify={notify}
            />
          )}
          {!account && (
            <GuestDownloadDialog
              open={guestDownloadOpen}
              onClose={() => setGuestDownloadOpen(false)}
              onDownloadWithoutSignIn={() => void savePdf()}
            />
          )}
          {!account && <GoogleOneTap returnTo={getPathname({ href: "/dashboard", locale: locale as Locale })} />}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}

function TabButton({ tab, selected, select }: { tab: Tab; selected: boolean; select: (t: Tab) => void }) {
  const t = useTranslations("Editor");
  const checks = useChecks();
  return (
    <button
      type="button"
      role="tab"
      id={`tab-${tab}`}
      aria-selected={selected}
      aria-controls={`panel-${tab}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => select(tab)}
      onKeyDown={(e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const i = TABS.indexOf(tab);
        const forward = (e.key === "ArrowRight") !== (document.dir === "rtl");
        const next = TABS[(i + (forward ? 1 : -1) + TABS.length) % TABS.length];
        select(next);
        document.getElementById(`tab-${next}`)?.focus();
      }}
      className={cn(
        "relative flex h-12 items-center gap-2 px-3 text-sm font-semibold transition-colors",
        selected ? "text-foreground" : "text-muted hover:text-foreground",
      )}
    >
      {t(`tabs.${tab}`)}
      {tab === "checks" && checks && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
            checks.score >= 80 ? "bg-accent-soft text-accent" : "bg-[#fef3c7] text-warning dark:bg-[#3a2a05]",
          )}
        >
          {checks.score}
        </span>
      )}
      {selected && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
    </button>
  );
}

function TopBar({
  notify,
  downloadPdf,
  pdfBusy,
  openVersions,
}: {
  notify: (text: string) => void;
  downloadPdf: () => void;
  pdfBusy: boolean;
  openVersions: () => void;
}) {
  const t = useTranslations("Editor");
  const locale = useLocale();
  const saveStatus = useEditor((s) => s.saveStatus);
  const canUndo = useEditor((s) => s.past.length > 0);
  const canRedo = useEditor((s) => s.future.length > 0);
  const { undo, redo, replace } = useEditor.getState();
  const jsonRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => menuRef.current?.removeAttribute("open");

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current?.open && !menuRef.current.contains(e.target as Node)) closeMenu();
    };
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("click", onOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const downloadJson = () => {
    const v = useEditor.getState().data!;
    const blob = new Blob([JSON.stringify(v, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName(v.personal.name, "json");
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    notify(t("toast.jsonDownloaded"));
  };

  const source = useEditor((s) => s.source);
  const isAccount = source.kind === "account";
  const time =
    saveStatus.kind === "saved"
      ? new Date(saveStatus.at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
      : "";

  const menuItem =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-foreground hover:bg-surface-2";

  return (
    <header className="editor-chrome flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 sm:px-4">
      <Link href="/" aria-label={t("toolbar.home")} className="me-1 rounded-lg">
        <Logo className="[&>span:last-child]:max-sm:hidden" />
      </Link>

      <div className="ms-1 hidden items-center gap-1.5 text-xs text-muted md:flex" aria-live="polite">
        {saveStatus.kind === "error" ? (
          <span className="flex items-center gap-1.5 font-medium text-danger">
            <CloudOff className="size-3.5" />
            {isAccount && saveStatus.reason !== "storage" ? t(`save.${saveStatus.reason}`) : t("save.error")}
          </span>
        ) : saveStatus.kind === "saving" ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="size-3.5 animate-spin" />
            {t("save.saving")}
          </span>
        ) : saveStatus.kind === "pending" ? (
          <span>{t("save.pending")}</span>
        ) : saveStatus.kind === "saved" ? (
          <span className="flex items-center gap-1.5" title={isAccount ? undefined : t("save.guest")}>
            <Check className="size-3.5 text-accent" />
            {isAccount ? t("save.savedToAccount", { time }) : t("save.saved", { time })}
          </span>
        ) : saveStatus.kind === "conflict" ? null : (
          <span>{isAccount ? "" : t("save.guest")}</span>
        )}
      </div>

      <div className="ms-auto flex items-center gap-1">
        <IconButton label={t("toolbar.undo")} disabled={!canUndo} onClick={undo} className="size-9">
          <Undo2 className="size-[18px]" />
        </IconButton>
        <IconButton label={t("toolbar.redo")} disabled={!canRedo} onClick={redo} className="size-9">
          <Redo2 className="size-[18px]" />
        </IconButton>

        <details ref={menuRef} className="relative">
          <summary className="flex h-9 list-none items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-foreground hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
            {t("toolbar.file")}
            <ChevronDown className="size-3.5 text-muted" />
          </summary>
          <div className="absolute end-0 top-11 z-40 w-60 rounded-xl border border-border bg-surface p-1.5 shadow-elevated">
            <button type="button" className={menuItem} onClick={() => (closeMenu(), downloadJson())}>
              <FileJson className="size-4 text-muted" />
              {t("toolbar.exportJson")}
            </button>
            <button type="button" className={menuItem} onClick={() => (closeMenu(), jsonRef.current?.click())}>
              <FileUp className="size-4 text-muted" />
              {t("toolbar.importJson")}
            </button>
            {isAccount && (
              <button type="button" className={menuItem} onClick={() => (closeMenu(), openVersions())}>
                <History className="size-4 text-muted" />
                {t("toolbar.versions")}
              </button>
            )}
            <div className="my-1 h-px bg-border" />
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                closeMenu();
                if (confirm(t("confirm.loadSample"))) {
                  replace(sampleResume(locale));
                  notify(t("toast.loaded"));
                }
              }}
            >
              <Sparkles className="size-4 text-muted" />
              {t("toolbar.loadSample")}
            </button>
            <button
              type="button"
              className={menuItem}
              onClick={() => {
                closeMenu();
                if (confirm(t("confirm.startBlank"))) replace(emptyResume(locale));
              }}
            >
              <FilePlus2 className="size-4 text-muted" />
              {t("toolbar.startBlank")}
            </button>
          </div>
        </details>
        <input
          ref={jsonRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            file
              .text()
              .then((text) => {
                const v = JSON.parse(text);
                // Older exports use Turkish keys ("kisisel"); normalizeResume converts them.
                if (!v || typeof v !== "object" || !("personal" in v || "kisisel" in v)) throw new Error("format");
                replace(v);
                notify(t("toast.loaded"));
              })
              .catch(() => notify(t("toast.invalidJson")));
          }}
        />

        {!isAccount && (
          <Link
            href={{ pathname: "/sign-in", query: { next: getPathname({ href: "/dashboard", locale: locale as Locale }) } }}
            className={buttonClass("secondary", "sm", "ms-1 max-md:hidden")}
          >
            <CloudUpload className="size-4" />
            {t("toolbar.saveToAccount")}
          </Link>
        )}
        <button
          type="button"
          onClick={downloadPdf}
          disabled={pdfBusy}
          aria-busy={pdfBusy}
          className={buttonClass("primary", "sm", "ms-1")}
        >
          {pdfBusy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          <span className="max-sm:sr-only">{pdfBusy ? t("toolbar.pdfPreparing") : t("toolbar.pdf")}</span>
        </button>
        <UserMenu showSignIn={false} className="ms-1" />
      </div>
    </header>
  );
}

function PdfDialog({ open, onClose, onContinue }: { open: boolean; onClose: () => void; onContinue: () => void }) {
  const t = useTranslations("Editor.pdf");
  const ref = useRef<HTMLDialogElement>(null);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const finish = (proceed: boolean) => {
    if (dontShow) {
      try {
        localStorage.setItem(PDF_HINT_KEY, "1");
      } catch {}
    }
    onClose();
    if (proceed) setTimeout(onContinue, 80);
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-6 text-foreground shadow-elevated backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <h2 className="text-lg font-bold">{t("title")}</h2>
      <p className="mt-2 text-sm text-muted">{t("description")}</p>
      <ol className="mt-3 list-decimal space-y-1.5 ps-5 text-sm">
        <li>{t("step1")}</li>
        <li>{t("step2")}</li>
        <li>{t("step3")}</li>
      </ol>
      <label className="mt-4 flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} className="size-4 accent-[var(--primary)]" />
        {t("dontShowAgain")}
      </label>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={() => finish(false)} className={buttonClass("ghost", "sm")}>
          {t("cancel")}
        </button>
        <button type="button" onClick={() => finish(true)} className={buttonClass("primary", "sm")} autoFocus>
          {t("continue")}
        </button>
      </div>
    </dialog>
  );
}

function ConflictDialog() {
  const t = useTranslations("Editor.conflict");
  const saveStatus = useEditor((s) => s.saveStatus);
  const ref = useRef<HTMLDialogElement>(null);
  const open = saveStatus.kind === "conflict";
  useEffect(() => {
    const d = ref.current;
    if (open && d && !d.open) d.showModal();
    if (!open && d?.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => e.preventDefault()}
      className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-6 text-foreground shadow-elevated backdrop:bg-black/50"
    >
      <h2 className="text-lg font-bold">{t("title")}</h2>
      <p className="mt-2 text-sm text-muted">{t("description")}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => window.location.reload()} className={buttonClass("secondary", "sm")}>
          {t("reload")}
        </button>
        <button type="button" onClick={() => useEditor.getState().keepMine()} className={buttonClass("primary", "sm")}>
          {t("keepMine")}
        </button>
      </div>
    </dialog>
  );
}
