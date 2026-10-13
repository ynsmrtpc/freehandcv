"use client";

import { CheckCircle2, FileDown, ShieldCheck } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { TemplatePreview } from "@/components/resume/TemplatePreview";
import { cn } from "@/lib/cn";
import type { TemplateId } from "@/lib/resume/schema";
import { FEATURED_TEMPLATES } from "@/lib/resume/design";

const INTERVAL_MS = 3600;

type Props = {
  locale: "tr" | "en";
  names: Record<TemplateId, string>;
  labels: { template: string; atsFriendly: string; pdfReady: string; checksPassed: string };
};

/** Preview that cycles through templates on its own; the buttons below also select one manually. */
export function HeroPreview({ locale, names, labels }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const template = FEATURED_TEMPLATES[index];

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % FEATURED_TEMPLATES.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused]);

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

        <div className="relative overflow-hidden rounded-xl shadow-paper ring-1 ring-black/5">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={template}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01, y: -6, transition: { duration: 0.25 } }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <TemplatePreview templateId={template} locale={locale} initialScale={0.53} />
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating badges */}
      <m.div
        aria-hidden
        className="absolute -start-4 top-[27%] flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-[13px] font-semibold text-foreground shadow-elevated ring-1 ring-border sm:-start-10"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck className="size-4 text-accent" />
        {labels.atsFriendly}
      </m.div>
      <m.div
        aria-hidden
        className="absolute -end-3 top-[46%] flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-[13px] font-semibold text-foreground shadow-elevated ring-1 ring-border sm:-end-8"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <CheckCircle2 className="size-4 text-accent" />
        {labels.checksPassed}
      </m.div>
      <m.div
        aria-hidden
        className="absolute bottom-[14%] -start-2 flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-[13px] font-semibold text-white shadow-elevated sm:-start-6"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
      >
        <FileDown className="size-4" />
        {labels.pdfReady}
      </m.div>

      {/* Template picker */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label={labels.template}>
        {FEATURED_TEMPLATES.map((id, i) => (
          <button
            key={id}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
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
