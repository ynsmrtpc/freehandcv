"use client";

import { Copy, FilePlus2, FileText, Heart, Loader2, PenLine } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  copyTemplateAction,
  setFavoriteAction,
  startWithTemplateAction,
  templatePageStateAction,
  type TemplateActionError,
} from "@/actions/template";
import { authClient } from "@/client/auth";
import { buttonClass } from "@/components/ui/Button";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { TEMPLATE_PARAM, type TemplateRef } from "@/lib/templates";

type PageState = { favorite: boolean; resumes: { id: string; title: string }[] };

/**
 * The template page's one primary action, "Use this template", plus favorite and copy-and-edit.
 * The session is read on the client so the page itself stays static (plan 6.1). Guests can start
 * with official templates right away; community templates need an account (plan 11.2).
 */
export function TemplateActions({ templateRef }: { templateRef: TemplateRef }) {
  const t = useTranslations("Templates.detail");
  const locale = useLocale();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const userTemplateId = templateRef.kind === "user" ? templateRef.id : null;
  const [state, setState] = useState<PageState | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<TemplateActionError | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const path = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => "/",
  );

  const signedIn = !!session;
  useEffect(() => {
    if (!signedIn) return;
    let cancelled = false;
    void templatePageStateAction(userTemplateId).then((r) => !cancelled && r.ok && setState(r));
    return () => {
      cancelled = true;
    };
  }, [signedIn, userTemplateId]);

  const start = async (resumeId?: string) => {
    setBusy(resumeId ?? "new");
    setError(null);
    const r = await startWithTemplateAction(templateRef, locale, resumeId);
    if (r.ok) return router.push({ pathname: "/resume/[id]", params: { id: r.resumeId } });
    setBusy(null);
    setError(r.reason);
  };

  const copy = async () => {
    if (!userTemplateId) return;
    setBusy("copy");
    const r = await copyTemplateAction(userTemplateId);
    if (r.ok) return router.push({ pathname: "/template-editor/[id]", params: { id: r.id } });
    setBusy(null);
    setError(r.reason);
  };

  const toggleFavorite = async () => {
    if (!userTemplateId || !state) return;
    const favorite = !state.favorite;
    setState({ ...state, favorite });
    const r = await setFavoriteAction(userTemplateId, favorite);
    if (!r.ok) {
      setState({ ...state, favorite: !favorite });
      setError(r.reason);
    }
  };

  const signInHref = { pathname: "/sign-in" as const, query: { next: path } };
  const secondary = buttonClass("secondary", "md");

  if (isPending) return <div className="h-12" aria-hidden />;

  if (!signedIn)
    return (
      <div className="flex flex-wrap items-center gap-3">
        {templateRef.kind === "system" ? (
          <Link href={{ pathname: "/create-resume", query: { [TEMPLATE_PARAM]: templateRef.id } }} className={buttonClass("primary", "lg")}>
            <PenLine className="size-5" aria-hidden />
            {t("use")}
          </Link>
        ) : (
          <>
            <Link href={signInHref} className={buttonClass("primary", "lg")}>
              <PenLine className="size-5" aria-hidden />
              {t("use")}
            </Link>
            <p className="w-full text-sm text-muted">{t("signInToUse")}</p>
          </>
        )}
      </div>
    );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={buttonClass("primary", "lg")}
          disabled={!state || !!busy}
          onClick={() => (state?.resumes.length ? dialogRef.current?.showModal() : void start())}
        >
          {busy === "new" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <PenLine className="size-5" aria-hidden />}
          {t("use")}
        </button>
        {userTemplateId ? (
          <>
            <button
              type="button"
              aria-pressed={!!state?.favorite}
              disabled={!state}
              onClick={() => void toggleFavorite()}
              className={secondary}
            >
              <Heart className={cn("size-4", state?.favorite && "fill-current text-danger")} aria-hidden />
              {state?.favorite ? t("favorited") : t("favorite")}
            </button>
            <button type="button" disabled={!!busy} onClick={() => void copy()} className={secondary}>
              {busy === "copy" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              {t("copy")}
            </button>
          </>
        ) : (
          templateRef.kind === "system" && (
            <Link href={{ pathname: "/template-editor/new", query: { from: templateRef.id } }} className={secondary}>
              <Copy className="size-4" aria-hidden />
              {t("copy")}
            </Link>
          )
        )}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {t(`errors.${error}`)}
        </p>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="use-template-title"
        className="m-auto w-[min(480px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-6 text-foreground shadow-elevated backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <h2 id="use-template-title" className="text-lg font-bold">
          {t("chooseTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted">{t("chooseDescription")}</p>
        <ul className="mt-4 max-h-72 space-y-1.5 overflow-y-auto">
          <li>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => void start()}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border-strong px-3 py-2.5 text-start text-sm font-semibold hover:border-primary hover:text-primary-text"
            >
              {busy === "new" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <FilePlus2 className="size-4" aria-hidden />}
              {t("newResume")}
            </button>
          </li>
          {state?.resumes.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                disabled={!!busy}
                onClick={() => void start(r.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-start text-sm hover:border-border-strong hover:bg-surface-2"
              >
                {busy === r.id ? (
                  <Loader2 className="size-4 shrink-0 animate-spin text-muted" aria-hidden />
                ) : (
                  <FileText className="size-4 shrink-0 text-muted" aria-hidden />
                )}
                <span className="truncate">{r.title}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={() => dialogRef.current?.close()} className={buttonClass("ghost", "sm")}>
            {t("cancel")}
          </button>
        </div>
      </dialog>
    </div>
  );
}
