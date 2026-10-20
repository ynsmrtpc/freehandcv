"use client";

import { CheckCircle2, FileDown, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TemplatePreview } from "@/components/resume/TemplatePreview";
import { cn } from "@/lib/cn";
import type { TemplateId } from "@/lib/resume/schema";
import { FEATURED_TEMPLATES } from "@/lib/resume/design";

const INTERVAL_MS = 4000;
const COUNT = FEATURED_TEMPLATES.length;

type Props = {
  locale: "tr" | "en";
  names: Record<TemplateId, string>;
  labels: { template: string; atsFriendly: string; pdfReady: string; checksPassed: string };
};

/**
 * Preview that cycles through templates on its own; the buttons below also select one manually.
 * Smoothness: previews are mounted once and kept (the current one and the next are ready before they
 * show), and switching only changes opacity/scale (CSS, compositor). The incoming preview fades in on
 * top while the previous one stays fully opaque underneath, so two resumes never show through each other.
 */
export function HeroPreview({ locale, names, labels }: Props) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [mounted, setMounted] = useState<ReadonlySet<number>>(() => new Set([0, 1 % COUNT]));
  const [paused, setPaused] = useState(false);

  const show = useCallback(
    (next: number) => {
      if (next === index) return;
      setPrevious(index);
      setIndex(next);
      // Mount the next one too, so it is laid out before its turn.
      setMounted((m) => (m.has(next) && m.has((next + 1) % COUNT) ? m : new Set([...m, next, (next + 1) % COUNT])));
    },
    [index],
  );

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => show((index + 1) % COUNT), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [paused, index, show]);

  return (
    <div
      className="relative mx-auto w-full max-w-[420px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Paper stack behind: positioned against the paper only (however many rows the picker below wraps to). */}
      <div className="relative">
        <div aria-hidden className="absolute inset-x-6 top-6 -bottom-4 rotate-[-5deg] rounded-xl bg-surface-2 shadow-elevated ring-1 ring-border" />
        <div aria-hidden className="absolute inset-x-3 top-3 -bottom-2 rotate-[3deg] rounded-xl bg-surface shadow-elevated ring-1 ring-border" />

        <div className="relative isolate aspect-[210/297] overflow-hidden rounded-xl bg-white shadow-paper ring-1 ring-black/5">
          {FEATURED_TEMPLATES.map((id, i) =>
            mounted.has(i) ? (
              <div
                key={id}
                className={cn(
                  "hero-slide absolute inset-0",
                  i === index ? "z-20 scale-100 opacity-100" : i === previous ? "z-10 scale-100 opacity-100" : "z-0 scale-[0.985] opacity-0",
                )}
              >
                <TemplatePreview templateId={id} locale={locale} initialScale={0.53} />
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* Floating badges: kept to the paper's edges (mostly outside it) so they cover little text. */}
      <div
        aria-hidden
        className="float absolute top-[16%] -start-6 hidden items-center gap-2 rounded-xl bg-surface px-3 py-2 text-[13px] font-semibold text-foreground shadow-elevated ring-1 ring-border sm:flex sm:-start-24"
        style={{ "--duration": "5s" } as React.CSSProperties}
      >
        <ShieldCheck className="size-4 text-accent" />
        {labels.atsFriendly}
      </div>
      <div
        aria-hidden
        className="float absolute top-[50%] -end-6 hidden items-center gap-2 rounded-xl bg-surface px-3 py-2 text-[13px] font-semibold text-foreground shadow-elevated ring-1 ring-border sm:flex sm:-end-24"
        style={{ "--duration": "6s", "--delay": "0.8s", "--float": "6px" } as React.CSSProperties}
      >
        <CheckCircle2 className="size-4 text-accent" />
        {labels.checksPassed}
      </div>
      <div
        aria-hidden
        className="float absolute bottom-[12%] -start-2 flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-[13px] font-semibold text-white shadow-elevated sm:-start-12"
        style={{ "--duration": "5.5s", "--delay": "1.6s", "--float": "-5px" } as React.CSSProperties}
      >
        <FileDown className="size-4" />
        {labels.pdfReady}
      </div>

      {/* Template picker */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label={labels.template}>
        {FEATURED_TEMPLATES.map((id, i) => (
          <button
            key={id}
            type="button"
            aria-pressed={i === index}
            onClick={() => show(i)}
            className={cn(
              "h-9 rounded-full px-3.5 text-xs font-semibold transition-colors duration-200",
              i === index ? "bg-primary text-white" : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {names[id]}
          </button>
        ))}
      </div>
    </div>
  );
}
