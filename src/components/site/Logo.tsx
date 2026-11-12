import { cn } from "@/lib/cn";

/**
 * A form checkbox ticked freehand in ballpoint ink: the tick overshoots the box, as a real one does.
 * Box follows the text colour, tick follows the ink token, so both themes work.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[19px] font-extrabold tracking-[-0.02em]", className)}>
      <svg viewBox="0 0 32 32" className="size-8 overflow-visible" aria-hidden>
        <rect x="3.5" y="7.5" width="21" height="21" rx="3" fill="none" stroke="currentColor" strokeWidth="2.25" className="text-foreground" />
        <path
          d="M8.2 18.6c2.1 1.2 3.8 3 5.2 5.4C16.6 15.4 21.8 8.6 29 3.6"
          className="ink-stroke"
          style={{ strokeWidth: 3.2 }}
        />
      </svg>
      <span className="text-foreground">
        Freehand<span className="text-primary-text">CV</span>
      </span>
    </span>
  );
}
