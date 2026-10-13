// Reveal wrappers. The animation lives in CSS (globals.css: .reveal-on-load, .reveal-on-scroll),
// so this is a server component and ships no JS to the client.
import { cn } from "@/lib/cn";

type BaseProps = { children: React.ReactNode; className?: string };

/**
 * mode="scroll" (default): reveals when it enters the viewport.
 * mode="load": reveals on page load; for above-the-fold elements. `delay` is in seconds.
 */
export function Reveal({
  children,
  className,
  mode = "scroll",
  delay = 0,
}: BaseProps & { mode?: "scroll" | "load"; delay?: number }) {
  return (
    <div
      className={cn(mode === "load" ? "reveal-on-load" : "reveal-on-scroll", className)}
      style={delay ? ({ "--delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/** Staggered list container; wrap its items in `StaggerItem`. */
export function Stagger({ children, className, as: Tag = "div" }: BaseProps & { as?: "div" | "ul" | "ol" }) {
  return <Tag className={className}>{children}</Tag>;
}

/** `index`: position in the grid; items in the same row reveal slightly apart. */
export function StaggerItem({
  children,
  className,
  as: Tag = "div",
  index = 0,
}: BaseProps & { as?: "div" | "li"; index?: number }) {
  return (
    <Tag className={cn("reveal-on-scroll", className)} style={{ "--i": index } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
