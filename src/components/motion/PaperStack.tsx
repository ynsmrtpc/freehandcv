"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * State of an auto-advancing stack: which slide shows, which one stays opaque underneath while the
 * next fades in, and which ones are mounted (the current one and the next, so a slide is laid out
 * before its turn). Auto-advance pauses while `paused`, and never runs with prefers-reduced-motion.
 */
export function usePaperStack(count: number, intervalMs: number) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [mounted, setMounted] = useState<ReadonlySet<number>>(() => new Set([0, 1 % count]));
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);

  const show = useCallback(
    (next: number) => {
      const n = ((next % count) + count) % count;
      if (n === index) return;
      setPrevious(index);
      setIndex(n);
      setMounted((m) => (m.has(n) && m.has((n + 1) % count) ? m : new Set([...m, n, (n + 1) % count])));
    },
    [index, count],
  );

  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const timer = setTimeout(() => show(index + 1), intervalMs);
    return () => clearTimeout(timer);
  }, [paused, reduceMotion, index, count, intervalMs, show]);

  /** Spread on the element that should pause the rotation while hovered or focused. */
  const pauseProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  return { index, previous, mounted, show, pauseProps };
}

/**
 * Sheets of paper stacked behind the current slide. Switching only changes opacity/scale (CSS
 * `.hero-slide`, compositor): the incoming slide fades in on top while the previous one stays fully
 * opaque underneath, so two resumes never show through each other.
 */
export function PaperStack({
  slides,
  index,
  previous,
  mounted,
  className,
}: {
  slides: { key: string; node: ReactNode }[];
  index: number;
  previous: number | null;
  mounted: ReadonlySet<number>;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div aria-hidden className="absolute inset-x-6 top-6 -bottom-4 rotate-[-5deg] rounded-xl bg-surface-2 shadow-elevated ring-1 ring-border" />
      <div aria-hidden className="absolute inset-x-3 top-3 -bottom-2 rotate-[3deg] rounded-xl bg-surface shadow-elevated ring-1 ring-border" />
      <div className="relative isolate aspect-[210/297] overflow-hidden rounded-xl bg-white shadow-paper ring-1 ring-black/5">
        {slides.map((s, i) =>
          mounted.has(i) ? (
            <div
              key={s.key}
              aria-hidden={i !== index}
              className={cn(
                "hero-slide absolute inset-0",
                i === index ? "z-20 scale-100 opacity-100" : i === previous ? "z-10 scale-100 opacity-100" : "z-0 scale-[0.985] opacity-0",
              )}
            >
              {s.node}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
