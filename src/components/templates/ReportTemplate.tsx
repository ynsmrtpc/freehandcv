"use client";

import { ChevronDown, Flag } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";
import { reportTemplateAction } from "@/actions/template";
import { authClient } from "@/client/auth";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

const REASONS = ["inappropriate", "copyright", "spam", "other"] as const;

/** A quiet disclosure under a community template's details; the report goes to the admin queue. */
export function ReportTemplate({ templateId }: { templateId: string }) {
  const t = useTranslations("Templates.detail.report");
  const { data: session } = authClient.useSession();
  const [reason, setReason] = useState<(typeof REASONS)[number]>("inappropriate");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [pending, startTransition] = useTransition();
  const detailsId = useId();

  return (
    <details className="group mt-8 border-t border-border pt-4">
      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-[15px] font-medium text-muted hover:text-foreground [&::-webkit-details-marker]:hidden">
        <Flag className="size-4" aria-hidden />
        {t("title")}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-3 space-y-4">
        <p className="text-[15px] leading-relaxed text-muted">{t("intro")}</p>
        {!session ? (
          <Link href="/sign-in" className="font-semibold text-primary-text underline underline-offset-4">
            {t("signIn")}
          </Link>
        ) : state === "sent" ? (
          <p role="status" className="rounded-lg bg-accent-soft px-3 py-2 text-[15px] font-medium text-accent">
            {t("sent")}
          </p>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              startTransition(async () => {
                const r = await reportTemplateAction({ templateId, reason, details });
                setState(r.ok ? "sent" : "error");
              });
            }}
          >
            <fieldset>
              <legend className="text-[15px] font-semibold text-foreground">{t("reason")}</legend>
              <div className="mt-1.5 space-y-1">
                {REASONS.map((r) => (
                  <label key={r} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-foreground">
                    <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="size-[18px] accent-[var(--primary)]" />
                    {t(`reasons.${r}`)}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor={detailsId} className="block text-[15px] font-semibold text-foreground">
                {t("details")}
              </label>
              <textarea
                id={detailsId}
                rows={3}
                maxLength={1000}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-base text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
            {state === "error" && (
              <p role="alert" className="text-[15px] font-medium text-danger">
                {t("error")}
              </p>
            )}
            <button type="submit" disabled={pending} className={buttonClass("secondary", "sm")}>
              {t("submit")}
            </button>
          </form>
        )}
      </div>
    </details>
  );
}
