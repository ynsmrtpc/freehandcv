"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { purgeTrashAction, restoreResumeAction, type ResumeActionResult } from "@/actions/resume";
import { buttonClass } from "@/components/ui/Button";
import { useRouter } from "@/i18n/navigation";

export type TrashItem = { id: string; title: string; deletedAt: string };

/**
 * Deleted resumes stay here for 30 days and can be restored (plan 5); then the purge job removes them.
 * The user can also remove one resume, or the whole trash, for good before that.
 */
export function TrashList({ items }: { items: TrashItem[] }) {
  const t = useTranslations("Dashboard.trash");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  if (!items.length) return null;

  const purgeDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(new Date(iso).getTime() + 30 * 864e5));

  const run = (action: () => Promise<ResumeActionResult>, errorKey: "error" | "purgeError") =>
    startTransition(async () => {
      const res = await action();
      if (res.ok) {
        setError("");
        router.refresh();
      } else setError(t(res.reason === "limit" ? "limit" : errorKey));
    });

  return (
    <details className="mt-12 rounded-2xl border border-border bg-surface shadow-card">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-sm font-semibold text-foreground">
        <Trash2 className="size-4 text-muted" />
        {t("title", { n: items.length })}
      </summary>
      <div className="border-t border-border px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">{t("description")}</p>
          <button
            type="button"
            disabled={pending}
            onClick={() => confirm(t("emptyConfirm", { n: items.length })) && run(() => purgeTrashAction(), "purgeError")}
            className={buttonClass("ghost", "sm", "shrink-0 text-danger")}
          >
            <Trash2 className="size-4" />
            {t("empty")}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm font-medium text-danger">
            {error}
          </p>
        )}
        <ul className="mt-3 divide-y divide-border">
          {items.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0">
                <span className="block truncate font-medium text-foreground">{r.title}</span>
                <span className="text-xs text-muted">{t("purgeOn", { date: purgeDate(r.deletedAt) })}</span>
              </span>
              <span className="flex shrink-0 gap-1">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => restoreResumeAction(r.id), "error")}
                  className={buttonClass("ghost", "sm")}
                >
                  <RotateCcw className="size-4" />
                  {t("restore")}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  aria-label={`${t("purge")}: ${r.title}`}
                  onClick={() =>
                    confirm(t("purgeConfirm", { name: r.title })) && run(() => purgeTrashAction(r.id), "purgeError")
                  }
                  className={buttonClass("ghost", "sm", "text-danger")}
                >
                  <Trash2 className="size-4" />
                  <span className="max-sm:sr-only">{t("purge")}</span>
                </button>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
