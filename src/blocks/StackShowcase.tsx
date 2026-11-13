"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PaperStack, usePaperStack } from "@/components/motion/PaperStack";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { Section } from "./shared";

type Href = React.ComponentProps<typeof Link>["href"];

export type StackItem = {
  key: string;
  name: string;
  summary: string;
  badges: { label: string; icon?: ReactNode }[];
  href: Href;
  /** The resume drawn by the rendering engine (server-rendered, passed in). */
  thumbnail: ReactNode;
};

export type StackShowcaseContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: StackItem[];
  /** Text of the button on the current item ("View example", "Start with this template"). */
  itemLink: string;
  viewAll: { label: string; href: Href };
  labels: { picker: string; previous: string; next: string };
};

const INTERVAL_MS = 4500;

/**
 * Landing showcase shared by resume examples and templates: a stack of papers that turns on its own
 * next to the current item's name, badges and summary. `side` puts the stack left or right on wide
 * screens; on phones the order is heading → stack → details.
 */
export function StackShowcase({ content, side }: { content: StackShowcaseContent; side: "left" | "right" }) {
  const { items } = content;
  const { index, previous, mounted, show, pauseProps } = usePaperStack(items.length, INTERVAL_MS);
  const current = items[index];
  const textCol = side === "left" ? "lg:col-start-2" : "lg:col-start-1";
  const stackCol = side === "left" ? "lg:col-start-1" : "lg:col-start-2";

  return (
    <Section>
      <div
        className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-2 lg:grid-rows-[auto_1fr]"
        aria-roledescription="carousel"
        {...pauseProps}
      >
        <Reveal className={cn("max-w-xl lg:row-start-1 lg:self-end", textCol)}>
          <h2 className="text-3xl leading-tight font-extrabold tracking-[-0.02em] text-balance text-foreground sm:text-[2.6rem]">{content.title}</h2>
          {content.description && <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">{content.description}</p>}
        </Reveal>

        <div className={cn("mx-auto w-full max-w-[460px] lg:row-span-2 lg:row-start-1", stackCol)}>
          <PaperStack
            index={index}
            previous={previous}
            mounted={mounted}
            slides={items.map((it) => ({ key: it.key, node: it.thumbnail }))}
          />
        </div>

        <div className={cn("max-w-xl lg:row-start-2 lg:self-start", textCol)}>
          <div aria-live="polite" className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <h3 className="text-xl font-bold text-foreground">{current.name}</h3>
            {current.badges.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {current.badges.map((b) => (
                  <li
                    key={b.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold text-foreground"
                  >
                    {b.icon}
                    {b.label}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 line-clamp-4 leading-relaxed text-muted">{current.summary}</p>
            <Link href={current.href} className={buttonClass("secondary", "sm", "mt-5")}>
              {content.itemLink}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </div>

          <div className="mt-5 flex items-start gap-2">
            <button
              type="button"
              aria-label={content.labels.previous}
              onClick={() => show(index - 1)}
              className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-2 pointer-fine:size-9"
            >
              <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
            </button>
            <div role="group" aria-label={content.labels.picker} className="flex flex-1 flex-wrap gap-1.5">
              {items.map((it, i) => (
                <button
                  key={it.key}
                  type="button"
                  aria-pressed={i === index}
                  onClick={() => show(i)}
                  className={cn(
                    "min-h-11 rounded-md border px-3.5 text-sm font-semibold transition-colors duration-200 pointer-fine:min-h-9",
                    i === index ? "border-primary bg-primary-soft text-primary-text" : "border-transparent text-muted hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  {it.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={content.labels.next}
              onClick={() => show(index + 1)}
              className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-2 pointer-fine:size-9"
            >
              <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
            </button>
          </div>

          <p className="mt-6">
            <Link
              href={content.viewAll.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {content.viewAll.label}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </Section>
  );
}
