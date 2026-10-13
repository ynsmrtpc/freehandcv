"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";
import { setSharingAction } from "@/actions/sharing";
import { cn } from "@/lib/cn";

type SharingState = { enabled: boolean; resumeId: string | null };

/**
 * Explicit consent for employer sharing (KVKK): off by default, the person turns it on themselves and
 * can turn it off any time. Every change is written permanently to the consents table on the server.
 */
export function SharingCard({
  initial,
  resumes,
}: {
  initial: SharingState;
  resumes: { id: string; title: string }[];
}) {
  const t = useTranslations("Consent");
  const [state, setState] = useState(initial);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const switchId = useId();

  const save = (next: SharingState) => {
    const previous = state;
    setState(next);
    startTransition(async () => {
      const s = await setSharingAction(next.enabled, next.resumeId, "dashboard");
      if (s.ok) setMessage({ kind: "success", text: t("saved") });
      else {
        setState(previous);
        setMessage({ kind: "error", text: t("error") });
      }
    });
  };

  return (
    <section className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6" aria-labelledby={`${switchId}-title`}>
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary-text">
          <BriefcaseBusiness className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id={`${switchId}-title`} className="font-bold text-foreground">
              {t("cardTitle")}
            </h2>
            <button
              type="button"
              role="switch"
              aria-checked={state.enabled}
              aria-labelledby={`${switchId}-title`}
              disabled={pending}
              onClick={() => save({ enabled: !state.enabled, resumeId: state.resumeId })}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60",
                state.enabled ? "bg-accent" : "bg-border-strong",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-5 rounded-full bg-white shadow transition-[inset-inline-start] duration-200",
                  state.enabled ? "start-6" : "start-1",
                )}
              />
            </button>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{t("cardDescription")}</p>
          <p className={cn("mt-3 text-sm font-semibold", state.enabled ? "text-accent" : "text-muted")} aria-live="polite">
            {state.enabled ? t("cardOn") : t("cardOff")}
          </p>

          {state.enabled && resumes.length > 0 && (
            <label className="mt-4 block max-w-sm text-[13px] font-semibold text-foreground">
              {t("resumeSelect")}
              <select
                value={state.resumeId ?? ""}
                disabled={pending}
                onChange={(e) => save({ enabled: true, resumeId: e.target.value || null })}
                className="mt-1.5 block h-10 w-full rounded-lg border border-border-strong bg-surface px-3 text-sm font-normal text-foreground"
              >
                <option value="">{t("mostRecent")}</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </label>
          )}
          <p className="mt-3 text-xs text-muted">{t("withdrawNote")}</p>
          {message && (
            <p role={message.kind === "error" ? "alert" : "status"} className={cn("mt-2 text-xs font-medium", message.kind === "error" ? "text-danger" : "text-accent")}>
              {message.text}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
