"use client";

import { CheckCircle2, FileDown, ShieldCheck } from "lucide-react";
import { PaperStack, usePaperStack } from "@/components/motion/PaperStack";
import { TemplatePreview } from "@/components/resume/TemplatePreview";
import { cn } from "@/lib/cn";
import type { TemplateId } from "@/lib/resume/schema";
import { FEATURED_TEMPLATES } from "@/lib/resume/design";

const INTERVAL_MS = 4000;

type Props = {
  locale: "tr" | "en";
  names: Record<TemplateId, string>;
  labels: { template: string; atsFriendly: string; pdfReady: string; checksPassed: string };
};

/** Preview that cycles through templates on its own; the buttons below also select one manually. */
export function HeroPreview({ locale, names, labels }: Props) {
  const { index, previous, mounted, show, pauseProps } = usePaperStack(FEATURED_TEMPLATES.length, INTERVAL_MS);

  return (
    <div className="relative mx-auto w-full max-w-[420px]" {...pauseProps}>
      <PaperStack
        index={index}
        previous={previous}
        mounted={mounted}
        slides={FEATURED_TEMPLATES.map((id) => ({
          key: id,
          node: <TemplatePreview templateId={id} locale={locale} initialScale={0.53} />,
        }))}
      />

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
