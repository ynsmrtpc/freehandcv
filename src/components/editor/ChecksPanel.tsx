"use client";

import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useEditor } from "@/client/editor/store";
import { cn } from "@/lib/cn";
import { runChecks, checkScore, type CheckResult } from "@/lib/resume/checks";
import { resumeDefinition } from "@/lib/resume/design";

export function useChecks() {
  const data = useEditor((s) => s.data);
  const pageCount = useEditor((s) => s.pageCount);
  return useMemo(() => {
    if (!data) return null;
    const results = runChecks(data, resumeDefinition(data), pageCount);
    return { results, ...checkScore(results) };
  }, [data, pageCount]);
}

const ICON = { good: CheckCircle2, warning: AlertTriangle, info: Info };
const COLOR = { good: "text-accent", warning: "text-warning", info: "text-primary-text" };

export function ChecksPanel() {
  const t = useTranslations("Checks");
  const checks = useChecks();
  if (!checks) return null;
  const { results, score, passed, total } = checks;
  const verdict = score >= 90 ? "ready" : score >= 70 ? "good" : "needsWork";
  const circumference = 2 * Math.PI * 30;

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-card">
        <div className="relative size-18 shrink-0">
          <svg viewBox="0 0 72 72" className="size-full -rotate-90" aria-hidden>
            <circle cx="36" cy="36" r="30" fill="none" strokeWidth="7" className="stroke-surface-2" />
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - score / 100)}
              className={cn("transition-[stroke-dashoffset] duration-500", score >= 80 ? "stroke-accent" : "stroke-warning")}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-xl font-bold text-foreground tabular-nums">{score}</span>
        </div>
        <div>
          <h3 className="font-bold text-foreground">{t(verdict)}</h3>
          <p className="mt-1 text-[13px] text-muted">{t("scoreSummary", { passed, total })}</p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface shadow-card">
        {results.map((r) => (
          <CheckRow key={r.id} r={r} />
        ))}
      </ul>

      <div className="mt-4 rounded-xl bg-primary-soft p-4">
        <h3 className="text-sm font-bold text-primary-text">{t("guideTitle")}</h3>
        <ul className="mt-2 list-disc space-y-1.5 ps-5 text-[13px] leading-relaxed text-foreground">
          {(t.raw("guide") as string[]).map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CheckRow({ r }: { r: CheckResult }) {
  const t = useTranslations("Checks");
  const Icon = ICON[r.status];
  return (
    <li className="flex gap-3 px-4 py-3">
      <Icon className={cn("mt-0.5 size-[18px] shrink-0", COLOR[r.status])} aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          <span className="sr-only">{t(`statusLabel.${r.status}`)}: </span>
          {t(`${r.id}.title` as never, r.values as never)}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
          {t(`${r.id}.${r.key}` as never, r.values as never)}
        </p>
      </div>
    </li>
  );
}
