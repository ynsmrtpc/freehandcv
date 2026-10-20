"use client";

import { RotateCcw, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { restoreResumeAction } from "@/actions/resume";
import { buttonClass } from "@/components/ui/Button";
import { useRouter } from "@/i18n/navigation";

export type TrashItem = { id: string; title: string; deletedAt: string };

/** Deleted resumes stay here for 30 days and can be restored (plan 5); then the purge job removes them. */
export function TrashList({ items }: { items: TrashItem[] }) {
  const t = useTranslations("Dashboard.trash");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  if (!items.length) return null;

  const purgeDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(new Date(iso).getTime() + 30 * 864e5));

  return (
    <details className="mt-12 rounded-2xl border border-border bg-surface shadow-card">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-4 text-sm font-semibold text-foreground">
        <Trash2 className="size-4 text-muted" />
        {t("title", { n: items.length })}
      </summary>
      <div className="border-t border-border px-5 py-4">
        <p className="text-sm text-muted">{t("description")}</p>
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
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    const res = await restoreResumeAction(r.id);
                    if (res.ok) {
                      setError("");
                      router.refresh();
                    } else setError(t(res.reason === "limit" ? "limit" : "error"));
                  })
                }
                className={buttonClass("ghost", "sm", "shrink-0")}
              >
                <RotateCcw className="size-4" />
                {t("restore")}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
