"use client";

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
  /** Short promise stamped on the paper's corner (e.g. "100% free · no sign-up"). */
  stamp?: string;
};

/** The real resume paper, cycling through templates on its own; the row below also selects one. */
export function HeroPreview({ locale, names, labels, stamp }: Props) {
  const { index, previous, mounted, show, pauseProps } = usePaperStack(FEATURED_TEMPLATES.length, INTERVAL_MS);

  return (
    <div className="relative mx-auto w-full max-w-[440px]" {...pauseProps}>
      <PaperStack
        index={index}
        previous={previous}
        mounted={mounted}
        slides={FEATURED_TEMPLATES.map((id) => ({
          key: id,
          node: <TemplatePreview templateId={id} locale={locale} initialScale={0.55} />,
        }))}
      />

      {/* An approval stamp pressed onto the paper's corner. */}
      {stamp && (
        <p className="absolute end-3 top-[58%] z-10 max-w-[11rem] -rotate-[7deg] rounded-md border-2 border-accent bg-paper/90 px-3 py-1.5 text-center text-sm leading-snug font-extrabold tracking-wide text-accent outline outline-1 outline-offset-2 outline-accent/60 sm:-end-6">
          {stamp}
        </p>
      )}

      {/* Template switcher: ruled boxes like a form; wraps to a second row instead of scrolling. */}
      <div
        role="group"
        aria-label={labels.template}
        className="mt-6 flex flex-wrap overflow-hidden rounded-lg border-s border-t border-border-strong bg-surface"
      >
        {FEATURED_TEMPLATES.map((id, i) => (
          <button
            key={id}
            type="button"
            aria-pressed={i === index}
            onClick={() => show(i)}
            className={cn(
              "relative h-11 grow basis-1/4 border-e border-b border-border-strong px-3 text-sm font-semibold whitespace-nowrap transition-colors duration-200",
              i === index ? "bg-primary-soft text-primary-text" : "text-muted hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {names[id]}
            {i === index && <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-primary-text" />}
          </button>
        ))}
      </div>
    </div>
  );
}
