"use client";

import { useConfirm } from "@/components/ui/ConfirmProvider";

import { Copy, FilePlus2, Loader2, PencilLine, Plus, Sparkles, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { ScaledPaper } from "@/components/resume/ScaledPaper";
import { RowMenu } from "@/components/editor/ui";
import { UserMenu } from "@/components/account/UserMenu";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { duplicateResumeAction, createResumeAction, deleteResumeAction, type ResumeActionResult } from "@/actions/resume";
import { Link, useRouter } from "@/i18n/navigation";
import { GUEST_STORAGE_KEY } from "@/client/editor/store";
import { sampleResume } from "@/lib/resume/sample";
import { emptyResume, normalizeResume, type ResumeData } from "@/lib/resume/schema";
import { resumeDefinition } from "@/lib/resume/design";
import { TrashList, type TrashItem } from "./TrashList";
import { SharingCard } from "./SharingCard";

type ResumeCard = { id: string; title: string; content: unknown; updatedAt: string };

/** A guest resume in the browser that is still the untouched sample is not worth importing. */
function isUntouchedSample(data: ResumeData) {
  const strip = (x: ResumeData) => JSON.stringify({ ...x, settings: { ...x.settings, hiddenSections: [] } });
  return ["tr", "en"].some((locale) => strip(sampleResume(locale)) === strip(data));
}

let importStarted = false;

export function DashboardView({
  resumes,
  sharing,
  trash,
}: {
  resumes: ResumeCard[];
  sharing: { enabled: boolean; resumeId: string | null };
  trash: TrashItem[];
}) {
  const confirm = useConfirm();
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleResult = (s: ResumeActionResult, successText?: string) => {
    if (s.ok) {
      if (successText) setMessage({ kind: "success", text: successText });
      return true;
    }
    setMessage({ kind: "error", text: s.reason === "limit" ? t("limit") : t("error") });
    return false;
  };

  // Plan 10: a resume prepared as a guest is imported into the account after sign-in (once).
  useEffect(() => {
    if (importStarted) return;
    importStarted = true;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(GUEST_STORAGE_KEY);
    } catch {}
    if (!raw) return;
    let data: ResumeData;
    try {
      data = normalizeResume(JSON.parse(raw));
    } catch {
      return;
    }
    if (isUntouchedSample(data)) {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      return;
    }
    void createResumeAction(data).then((s) => {
      if (s.ok) {
        localStorage.removeItem(GUEST_STORAGE_KEY);
        setMessage({ kind: "success", text: t("imported") });
        router.refresh();
      }
    });
  }, [router, t]);

  useEffect(() => {
    if (!menuOpen) return;
    menuRef.current?.querySelector<HTMLButtonElement>("[data-create-option]")?.focus();
    const onOutsideClick = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenuOpen(false);
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      menuRef.current?.querySelector<HTMLButtonElement>("[aria-expanded]")?.focus();
    };
    document.addEventListener("click", onOutsideClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const create = (data: ResumeData) =>
    startTransition(async () => {
      setMenuOpen(false);
      const s = await createResumeAction(data);
      if (handleResult(s) && s.ok) router.push({ pathname: "/resume/[id]", params: { id: s.id } });
    });

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
          <div className="ms-auto">
            <UserMenu />
          </div>
        </div>
      </header>
      <DashboardNav current="resumes" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
            <p className="mt-1 text-muted">{t("subtitle", { n: resumes.length })}</p>
          </div>
          <div ref={menuRef} className="relative" hidden={resumes.length === 0}>
            <button
              type="button"
              aria-expanded={menuOpen}
              disabled={pending}
              onClick={() => setMenuOpen((m) => !m)}
              className={buttonClass("primary", "md")}
            >
              {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {t("new")}
            </button>
            {menuOpen && (
              <div className="absolute end-0 top-13 z-20 w-56 rounded-xl border border-border bg-surface p-1.5 shadow-elevated">
                <button
                  type="button"
                  data-create-option
                  onClick={() => create(sampleResume(locale))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-foreground hover:bg-surface-2"
                >
                  <Sparkles className="size-4 text-muted" />
                  {t("newFromExample")}
                </button>
                <button
                  type="button"
                  onClick={() => create(emptyResume(locale))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-foreground hover:bg-surface-2"
                >
                  <FilePlus2 className="size-4 text-muted" />
                  {t("newBlank")}
                </button>
              </div>
            )}
          </div>
        </div>

        {message && (
          <p
            role={message.kind === "error" ? "alert" : "status"}
            className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${message.kind === "error" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent"}`}
          >
            {message.text}
          </p>
        )}

        {resumes.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border-strong p-12 text-center">
            <p className="text-muted">{t("empty")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" disabled={pending} onClick={() => create(sampleResume(locale))} className={buttonClass("primary", "md")}>
                <Sparkles className="size-4" />
                {t("newFromExample")}
              </button>
              <button type="button" disabled={pending} onClick={() => create(emptyResume(locale))} className={buttonClass("secondary", "md")}>
                {t("newBlank")}
              </button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3" aria-busy={pending}>
            {resumes.map((r) => {
              const data = normalizeResume(r.content);
              return (
                <li key={r.id} className="min-w-0 rounded-xl border border-border bg-surface p-4">
                  <Link href={{ pathname: "/resume/[id]", params: { id: r.id } }} className="block rounded-lg">
                    <div
                      aria-hidden
                      inert
                      className="pointer-events-none isolate aspect-[210/297] w-full overflow-hidden rounded-md bg-paper"
                    >
                      <ScaledPaper initialScale={0.25}>
                        <ResumeDocument data={data} definition={resumeDefinition(data)} noLinks embedded />
                      </ScaledPaper>
                    </div>
                    <p className="mt-4 truncate text-lg font-semibold text-foreground" title={r.title}>{r.title}</p>
                    <p className="mt-1 text-sm text-muted">{t("updated", { time: formatDate(r.updatedAt) })}</p>
                  </Link>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <Link href={{ pathname: "/resume/[id]", params: { id: r.id } }} className={buttonClass("secondary", "md")} aria-label={`${t("edit")}: ${r.title}`}>
                      <PencilLine className="size-4" aria-hidden />
                      {t("edit")}
                    </Link>
                    <RowMenu label={t("actions", { name: r.title })} items={[
                      { label: t("duplicate"), icon: <Copy />, disabled: pending, onSelect: () => startTransition(async () => {
                          if (handleResult(await duplicateResumeAction(r.id))) router.refresh();
                        }) },
                      { label: t("delete"), icon: <Trash2 />, danger: true, disabled: pending, onSelect: async () => {
                        if (await confirm(t("deleteConfirm", { name: r.title }), { danger: true })) startTransition(async () => {
                          if (handleResult(await deleteResumeAction(r.id))) router.refresh();
                        });
                      } },
                    ]} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Optional and secondary: below the user's own resumes, never in front of them. */}
        <SharingCard initial={sharing} resumes={resumes.map((r) => ({ id: r.id, title: r.title }))} />
        <TrashList items={trash} />
      </main>
    </div>
  );
}
