import { cn } from "@/lib/cn";

// The freehand mark: ballpoint strokes drawn by hand, the product's one signature move.
// Strokes are visible by default; `.ink-draw` draws them in once where motion is allowed.

/** A hand-drawn ink underline beneath inline text. */
export function InkUnderline({
  children,
  draw = false,
  delay,
}: {
  children: React.ReactNode;
  draw?: boolean;
  delay?: number;
}) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-[-0.06em] -bottom-[0.12em] h-[0.26em] w-[calc(100%+0.12em)] overflow-visible"
      >
        <path
          d="M3 9.6C34 6.2 71 4.9 109 5.6c33 .6 61 2.1 88 3.6"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
          className={cn("ink-stroke", draw && "ink-draw")}
          style={{ strokeWidth: "max(3px, 0.075em)", ...(delay !== undefined && { "--delay": `${delay}s` }) } as React.CSSProperties}
        />
      </svg>
    </span>
  );
}

/** A hand-drawn ink tick, sized by font size (1em). */
export function InkTick({ className, draw = false, delay }: { className?: string; draw?: boolean; delay?: number }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("size-[1em] shrink-0 overflow-visible", className)}>
      <path
        d="M3.8 13.4c2.3 1.3 4.1 3.1 5.6 5.6 2.6-6.1 6.3-11 11-14.8"
        pathLength={1}
        className={cn("ink-stroke", draw && "ink-draw")}
        style={{ strokeWidth: 2.6, ...(delay !== undefined && { "--delay": `${delay}s` }) } as React.CSSProperties}
      />
    </svg>
  );
}
