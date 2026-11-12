"use client";

import { useLocale, useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { useEditor } from "@/client/editor/store";
import { emptyResume } from "@/lib/resume/schema";

/**
 * A first-time guest opens on the built-in sample. Say so, and offer a blank start or an example
 * close to their job, inline rather than in a modal: the sample itself is still worth reading.
 * Disappears on the first edit.
 */
export function SampleNotice() {
  const t = useTranslations("Editor.sample");
  const locale = useLocale();
  const untouched = useEditor((s) => s.untouchedSample);
  if (!untouched) return null;

  return (
    <section aria-labelledby="sample-notice-title" className="rounded-xl border border-border-strong bg-surface p-4 sm:p-5">
      <h2 id="sample-notice-title" className="text-lg font-bold text-foreground">
        {t("title")}
      </h2>
      <p className="mt-1.5 leading-relaxed text-muted">{t("text")}</p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={() => useEditor.getState().replace(emptyResume(locale))}
          className={buttonClass("primary", "md")}
        >
          {t("blank")}
        </button>
        <Link href="/resume-examples" className={buttonClass("secondary", "md")}>
          {t("examples")}
        </Link>
      </div>
      <button
        type="button"
        onClick={() => useEditor.getState().dismissSample()}
        className="mt-3 min-h-11 text-[15px] font-semibold text-primary-text underline underline-offset-4 pointer-fine:min-h-0"
      >
        {t("keep")}
      </button>
    </section>
  );
}
