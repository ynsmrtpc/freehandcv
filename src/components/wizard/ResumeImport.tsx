"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  FileText,
  FileUp,
  FolderGit2,
  Layers,
  Loader2,
  Search,
  Unplug,
  Upload,
  X,
} from "lucide-react";
import { Link, getPathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buttonClass } from "@/components/ui/Button";
import { adminInputClass } from "@/components/admin/forms";
import { Logo } from "@/components/site/Logo";
import { UserMenu } from "@/components/account/UserMenu";
import { cn } from "@/lib/cn";
import { emptyResume, type ResumeData } from "@/lib/resume/schema";
import { mergeLinkedInCsv, resumeFromText } from "@/lib/resume/import";
import { pdfText } from "@/client/pdfImport";
import { appendGithubProjectsAction, githubProjectsAction } from "@/actions/github";
import { canvaDesignsAction, canvaDisconnectAction } from "@/actions/canva";
import type { CanvaDesign } from "@/server/canva";
import { ResumeWizard } from "./ResumeWizard";

type Repo = {
  id: number;
  name: string;
  description: string;
  link: string;
  technologies: string;
};

type Props = {
  signedIn: boolean;
  githubConfigured: boolean;
  githubConnected: boolean;
  canva: { enabled: boolean; connected: boolean; name: string };
  initialSource?: Source;
  initialCanvaError?: string;
  resumes: { id: string; title: string }[];
  ai: { enabled: boolean; provider: string; remaining: number };
};

type Source = "file" | "canva" | "github";

export function ResumeImport(props: Props) {
  const t = useTranslations("Import"),
    locale = useLocale() as Locale,
    router = useRouter();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canvaErrorText = useCallback(
    (code: string) =>
      t.has(`canvaErrors.${code}` as never)
        ? t(`canvaErrors.${code}` as never)
        : t("canvaErrors.failed"),
    [t],
  );

  const [source, setSource] = useState<Source>(props.initialSource ?? "file");
  const [dragging, setDragging] = useState(false);
  const [fileNames, setFileNames] = useState("");
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [text, setText] = useState(""),
    [csv, setCsv] = useState<ResumeData | null>(null),
    [draft, setDraft] = useState<ResumeData | null>(null),
    [pending, setPending] = useState(false),
    [error, setError] = useState(() =>
      props.initialCanvaError ? canvaErrorText(props.initialCanvaError) : "",
    );

  // Canva state
  const [canvaConnected, setCanvaConnected] = useState(props.canva.connected);
  const [canvaName, setCanvaName] = useState(props.canva.name);
  const [canvaQuery, setCanvaQuery] = useState("");
  const [designs, setDesigns] = useState<CanvaDesign[]>([]);
  const [canvaContinuation, setCanvaContinuation] = useState<string | null>(null);
  const [canvaLoaded, setCanvaLoaded] = useState(false);
  const [canvaLoading, setCanvaLoading] = useState(false);
  const [importingDesignId, setImportingDesignId] = useState<string | null>(null);

  // GitHub state
  const [repos, setRepos] = useState<Repo[]>([]),
    [page, setPage] = useState(1),
    [selected, setSelected] = useState<number[]>([]),
    [resumeId, setResumeId] = useState(props.resumes[0]?.id ?? "");

  const loadDesigns = useCallback(
    async (opts?: { continuation?: string; query?: string }) => {
      setCanvaLoading(true);
      setError("");
      const result = await canvaDesignsAction({
        continuation: opts?.continuation,
        query: opts?.query,
      }).catch(() => ({ ok: false as const, error: "failed" }));
      setCanvaLoading(false);
      if (!result.ok) {
        if (result.error === "not_connected") setCanvaConnected(false);
        setError(canvaErrorText(result.error));
        return;
      }
      setDesigns((prev) => (opts?.continuation ? [...prev, ...result.items] : result.items));
      setCanvaContinuation(result.continuation);
      setCanvaLoaded(true);
    },
    [canvaErrorText],
  );

  // Automatically list designs when opening the Canva tab while connected.
  useEffect(() => {
    if (
      source !== "canva" ||
      !props.signedIn ||
      !props.canva.enabled ||
      !canvaConnected ||
      canvaLoaded
    )
      return;
    let cancelled = false;
    void canvaDesignsAction({})
      .catch(() => ({ ok: false as const, error: "failed" }))
      .then((result) => {
        if (cancelled) return;
        if (!result.ok) {
          if (result.error === "not_connected") setCanvaConnected(false);
          setError(canvaErrorText(result.error));
          return;
        }
        setDesigns(result.items);
        setCanvaContinuation(result.continuation);
        setCanvaLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [source, props.signedIn, props.canva.enabled, canvaConnected, canvaLoaded, canvaErrorText]);

  async function processFiles(files: File[]) {
    if (!files.length) return;
    setPending(true);
    setError("");
    setCsv(null);
    setText("");
    setFileNames("");
    try {
      if (files.length > 5) throw new Error("too_large");
      let content = "",
        mapped = emptyResume(locale),
        hasCsv = false;
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) throw new Error("too_large");
        if (/\.csv$/i.test(file.name)) {
          mapped = mergeLinkedInCsv(mapped, await file.text());
          hasCsv = true;
        } else if (/\.pdf$/i.test(file.name)) {
          content += (await pdfText(file)) + "\n";
        } else if (/\.txt$/i.test(file.name)) {
          content += (await file.text()) + "\n";
        } else {
          throw new Error("invalid_file");
        }
      }
      if (content.length > 50_000) throw new Error("too_large");
      if (hasCsv && content.trim()) throw new Error("invalid_file");
      setFileNames(files.map((file) => file.name).join(", "));
      setText(content);
      if (hasCsv) setCsv(mapped);
    } catch (failure) {
      setError(failure instanceof Error && failure.message === "no_text" ? t("noText") : t("error"));
    } finally {
      setPending(false);
    }
  }

  async function importCanvaDesign(design: CanvaDesign) {
    setImportingDesignId(design.id);
    setError("");
    try {
      const response = await fetch(`/api/canva/designs/${encodeURIComponent(design.id)}/pdf`, {
        cache: "no-store",
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        if (response.status === 401) setCanvaConnected(false);
        setError(canvaErrorText(body?.error ?? "export_failed"));
        return;
      }
      const blob = await response.blob();
      const file = new File([blob], `${design.id}.pdf`, { type: "application/pdf" });
      const extracted = await pdfText(file);
      setDraft(resumeFromText(extracted, locale));
    } catch (failure) {
      setError(failure instanceof Error && failure.message === "no_text" ? t("noText") : canvaErrorText("export_failed"));
    } finally {
      setImportingDesignId(null);
    }
  }

  async function loadRepositories(next: number) {
    setPending(true);
    setError("");
    const result = await githubProjectsAction(next).catch(() => ({ ok: false as const }));
    setPending(false);
    if (!result.ok) return setError(t("githubError"));
    setRepos(result.items);
    setPage(next);
    setSelected([]);
  }

  const sources: { value: Source; title: string; hint: string; icon: typeof FileUp }[] = [
    { value: "file", title: t("fileSource"), hint: t("fileSourceHint"), icon: FileUp },
    { value: "canva", title: t("canvaSource"), hint: t("canvaSourceHint"), icon: Layers },
    { value: "github", title: t("githubTitle"), hint: t("githubSourceHint"), icon: FolderGit2 },
  ];

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(iso));

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
          {props.signedIn && (
            <div className="ms-auto">
              <UserMenu />
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-7 px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-muted hover:text-foreground pointer-fine:min-h-9"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {t("back")}
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("meta")}</h1>
          <p className="mt-1 max-w-2xl leading-relaxed text-muted">{t("description")}</p>
        </div>

        <fieldset>
          <legend className="mb-3 text-[15px] font-semibold text-foreground">{t("source")}</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {sources.map(({ value, title, hint, icon: Icon }) => {
              const active = source === value;
              return (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors sm:p-5",
                    active
                      ? "border-primary bg-primary-soft"
                      : "border-border bg-surface hover:border-border-strong",
                  )}
                >
                  <input
                    type="radio"
                    name="import-source"
                    checked={active}
                    onChange={() => {
                      setSource(value);
                      setError("");
                    }}
                    className="mt-1 size-4 accent-primary"
                  />
                  <span className="min-w-0">
                    <span className={cn("flex items-center gap-2 font-bold", active ? "text-primary-text" : "text-foreground")}>
                      <Icon className="size-4 shrink-0" aria-hidden />
                      <span>{title}</span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{hint}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {source === "file" && (
          <section className="rounded-xl border border-border bg-surface">
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t("file")}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t("fileHint")}</p>
              </div>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  if (hydrated && !pending) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  if (!hydrated || pending) return;
                  void processFiles([...event.dataTransfer.files]);
                }}
                className={cn(
                  "rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors",
                  dragging
                    ? "border-primary bg-primary-soft"
                    : "border-border-strong bg-surface-2/40 hover:border-primary/60",
                )}
              >
                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  type="file"
                  accept=".pdf,.txt,.csv,text/plain,text/csv,application/pdf"
                  multiple
                  disabled={pending || !hydrated}
                  className="sr-only"
                  onChange={(event) => {
                    const files = [...(event.target.files ?? [])];
                    event.target.value = "";
                    void processFiles(files);
                  }}
                />
                <label
                  htmlFor={fileInputId}
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  {pending ? (
                    <Loader2 className="size-7 animate-spin text-primary-text motion-reduce:animate-none" aria-hidden />
                  ) : (
                    <Upload className="size-7 text-primary-text" aria-hidden />
                  )}
                  <span className="font-semibold text-foreground">
                    {fileNames ? t("fileDropReplace") : t("fileDropTitle")}
                  </span>
                  <span className="text-sm text-muted">PDF, TXT, CSV</span>
                </label>
              </div>

              {fileNames && (
                <div
                  role="status"
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    <div className="min-w-0">
                      <p className="break-words font-semibold text-foreground">{fileNames}</p>
                      <p className="text-sm text-muted">{csv ? t("csvReady") : t("fileReady")}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={buttonClass("ghost", "sm")}
                    onClick={() => {
                      setFileNames("");
                      setText("");
                      setCsv(null);
                      setError("");
                    }}
                  >
                    <X className="size-4" aria-hidden />
                    {t("fileClear")}
                  </button>
                </div>
              )}

              <p className="text-sm leading-relaxed text-muted">{t("reviewNote")}</p>
              {error && (
                <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[15px] font-medium text-danger">
                  {error}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border px-5 py-3 sm:px-6">
              <button
                type="button"
                disabled={pending || (!csv && !text.trim())}
                className={buttonClass("primary", "md")}
                onClick={() => {
                  try {
                    setDraft(csv ?? resumeFromText(text, locale));
                  } catch {
                    setError(t("error"));
                  }
                }}
              >
                {t("review")}
              </button>
            </div>
          </section>
        )}

        {source === "canva" && (
          <section className="rounded-xl border border-border bg-surface">
            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-2xl">
                  <h2 className="text-xl font-bold text-foreground">{t("canvaTitle")}</h2>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{t("canvaDescription")}</p>
                </div>
                {props.signedIn && props.canva.enabled && canvaConnected && (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 px-2.5 py-1 text-sm font-medium text-accent">
                      <span className="size-1.5 rounded-full bg-accent" aria-hidden />
                      {canvaName ? t("canvaConnectedAs", { name: canvaName }) : t("canvaConnected")}
                    </span>
                    <button
                      type="button"
                      className={buttonClass("ghost", "sm")}
                      onClick={async () => {
                        await canvaDisconnectAction();
                        setCanvaConnected(false);
                        setCanvaName("");
                        setDesigns([]);
                        setCanvaLoaded(false);
                        setCanvaContinuation(null);
                      }}
                    >
                      <Unplug className="size-4" aria-hidden />
                      {t("canvaDisconnect")}
                    </button>
                  </div>
                )}
              </div>

              {!props.signedIn ? (
                <div className="rounded-xl border border-border bg-surface-2/40 p-5">
                  <Link
                    href={{
                      pathname: "/sign-in",
                      query: { next: `${getPathname({ locale, href: "/resume-import" })}?source=canva` },
                    }}
                    className={buttonClass("primary", "md")}
                  >
                    {t("githubSignIn")}
                  </Link>
                </div>
              ) : !props.canva.enabled ? (
                <div className="space-y-4 rounded-xl border border-dashed border-border-strong p-6">
                  <p className="text-[15px] leading-relaxed text-muted">{t("canvaUnavailable")}</p>
                  <button
                    type="button"
                    className={buttonClass("secondary", "sm")}
                    onClick={() => {
                      setSource("file");
                      setError("");
                    }}
                  >
                    <FileUp className="size-4" aria-hidden />
                    {t("fileSource")}
                  </button>
                </div>
              ) : !canvaConnected ? (
                <div className="flex flex-col items-start gap-4 rounded-xl border border-dashed border-border-strong p-6">
                  <p className="max-w-xl text-[15px] leading-relaxed text-muted">{t("canvaSourceHint")}</p>
                  <a
                    href={`/api/canva/connect?locale=${encodeURIComponent(locale)}`}
                    className={buttonClass("primary", "md")}
                  >
                    <Layers className="size-4" aria-hidden />
                    {t("canvaConnect")}
                  </a>
                </div>
              ) : (
                <div className="space-y-5">
                  <form
                    className="flex flex-wrap gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void loadDesigns({ query: canvaQuery });
                    }}
                  >
                    <label className="sr-only" htmlFor="canva-search">
                      {t("canvaSearch")}
                    </label>
                    <input
                      id="canva-search"
                      type="search"
                      value={canvaQuery}
                      onChange={(event) => setCanvaQuery(event.target.value)}
                      placeholder={t("canvaSearchPlaceholder")}
                      className={cn(adminInputClass, "min-w-0 flex-1")}
                    />
                    <button
                      type="submit"
                      disabled={canvaLoading}
                      className={buttonClass("secondary", "md")}
                    >
                      {canvaLoading ? (
                        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                      ) : (
                        <Search className="size-4" aria-hidden />
                      )}
                      {t("canvaSearch")}
                    </button>
                  </form>

                  {canvaLoading && !designs.length ? (
                    <p role="status" className="flex items-center gap-2 py-6 text-sm text-muted">
                      <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                      {t("canvaLoading")}
                    </p>
                  ) : !designs.length && canvaLoaded ? (
                    <div className="rounded-xl border border-dashed border-border-strong p-8 text-center text-muted">
                      {t("canvaEmpty")}
                    </div>
                  ) : (
                    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {designs.map((design) => {
                        const busy = importingDesignId === design.id;
                        const title = design.title || t("canvaUntitled");
                        return (
                          <li
                            key={design.id}
                            className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface"
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden border-b border-border bg-desk">
                              {design.thumbnail ? (
                                // External signed Canva CDN thumbnail; unoptimized to avoid server proxy.
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={design.thumbnail.url}
                                  alt=""
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <div className="grid h-full place-items-center text-muted">
                                  <FileText className="size-8" aria-hidden />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col p-4">
                              <h3 className="truncate font-bold text-foreground" title={title}>
                                {title}
                              </h3>
                              <p className="mt-1 text-sm text-muted">
                                {[
                                  design.pageCount ? t("canvaPages", { count: design.pageCount }) : null,
                                  design.updatedAt ? formatDate(design.updatedAt) : null,
                                ]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                              <div className="mt-4 flex flex-wrap items-center gap-2 pt-2">
                                <button
                                  type="button"
                                  disabled={!!importingDesignId}
                                  className={buttonClass("primary", "sm", "flex-1")}
                                  onClick={() => void importCanvaDesign(design)}
                                >
                                  {busy && (
                                    <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                                  )}
                                  {busy ? t("canvaImporting") : t("canvaImportDesign")}
                                </button>
                                {design.editUrl && (
                                  <a
                                    href={design.editUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${t("canvaOpenInCanva")}: ${title}`}
                                    className={buttonClass("ghost", "sm", "px-2.5")}
                                  >
                                    <ExternalLink className="size-4" aria-hidden />
                                  </a>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {canvaContinuation && (
                    <button
                      type="button"
                      disabled={canvaLoading}
                      className={buttonClass("secondary", "md", "w-full")}
                      onClick={() => void loadDesigns({ continuation: canvaContinuation, query: canvaQuery })}
                    >
                      {canvaLoading && (
                        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
                      )}
                      {t("canvaLoadMore")}
                    </button>
                  )}
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[15px] font-medium text-danger">
                  {error}
                </p>
              )}
            </div>
          </section>
        )}

        {source === "github" && (
          <section className="rounded-xl border border-border bg-surface">
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{t("githubTitle")}</h2>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{t("githubDescription")}</p>
              </div>
              {!props.signedIn ? (
                <Link
                  href={{
                    pathname: "/sign-in",
                    query: { next: getPathname({ locale, href: "/resume-import" }) },
                  }}
                  className={buttonClass("secondary")}
                >
                  {t("githubSignIn")}
                </Link>
              ) : !props.githubConfigured ? (
                <p className="text-muted">{t("githubUnavailable")}</p>
              ) : !props.githubConnected ? (
                <Link href="/account" className={buttonClass("secondary")}>
                  {t("manageConnections")}
                </Link>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      className={buttonClass("secondary", "sm")}
                      disabled={pending}
                      onClick={() => loadRepositories(1)}
                    >
                      {pending && <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />}
                      {repos.length ? t("githubReload") : t("githubLoad")}
                    </button>
                    {selected.length > 0 && (
                      <span className="text-sm font-semibold text-primary-text">
                        {t("githubSelectedCount", { count: selected.length })}
                      </span>
                    )}
                  </div>
                  {repos.length > 0 && (
                    <ul className="divide-y divide-border rounded-lg border border-border">
                      {repos.map((repo) => (
                        <li key={repo.id}>
                          <label className="flex min-h-11 cursor-pointer gap-3 px-4 py-3.5 hover:bg-surface-2/50">
                            <input
                              type="checkbox"
                              className="mt-1 size-4 accent-primary"
                              checked={selected.includes(repo.id)}
                              onChange={(event) =>
                                setSelected((ids) =>
                                  event.target.checked
                                    ? [...ids, repo.id]
                                    : ids.filter((id) => id !== repo.id),
                                )
                              }
                            />
                            <span className="min-w-0">
                              <strong className="block break-words text-foreground">{repo.name}</strong>
                              {repo.description && (
                                <span className="mt-0.5 block text-sm text-muted">{repo.description}</span>
                              )}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                  {repos.length === 50 && (
                    <button
                      type="button"
                      className={buttonClass("secondary", "sm")}
                      disabled={pending}
                      onClick={() => loadRepositories(page + 1)}
                    >
                      {t("githubNext")}
                    </button>
                  )}
                  {props.resumes.length ? (
                    <div className="flex flex-wrap items-end gap-3 pt-2">
                      <label className="min-w-56 flex-1 text-[15px] font-semibold text-foreground">
                        {t("resume")}
                        <select
                          value={resumeId}
                          onChange={(event) => setResumeId(event.target.value)}
                          className={cn(adminInputClass, "mt-1.5")}
                        >
                          {props.resumes.map((resume) => (
                            <option key={resume.id} value={resume.id}>
                              {resume.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        className={buttonClass("primary", "md")}
                        disabled={pending || !selected.length || selected.length > 20}
                        onClick={async () => {
                          setPending(true);
                          const result = await appendGithubProjectsAction(resumeId, selected, page).catch(() => ({
                            ok: false as const,
                          }));
                          setPending(false);
                          if (result.ok)
                            router.push({ pathname: "/resume/[id]", params: { id: result.id } });
                          else setError(t("githubError"));
                        }}
                      >
                        {t("githubAdd")}
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted">{t("noResumes")}</p>
                  )}
                </div>
              )}
              {error && (
                <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-[15px] font-medium text-danger">
                  {error}
                </p>
              )}
            </div>
          </section>
        )}

        <p className="border-t border-border pt-5 text-sm text-muted">
          {t("connectionsNote")}{" "}
          <Link href="/account" className="font-semibold text-primary-text hover:underline">
            {t("manageConnections")}
          </Link>
        </p>

        {draft && (
          <ResumeWizard
            signedIn={props.signedIn}
            ai={props.ai}
            initialData={draft}
            onClose={() => setDraft(null)}
          />
        )}
      </main>
    </div>
  );
}
