import { cn } from "@/lib/cn";

/**
 * A folded resume sheet with a freehand signature. Paper follows the text color;
 * the signature uses the same semantic ink token as the rest of the product.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[19px] font-extrabold tracking-[-0.02em]", className)}>
      <svg viewBox="0 0 32 32" className="size-8 overflow-visible" aria-hidden>
        <path d="M7 3h12l6 6v20H7V3Zm12 0v7h6M11 14h9M11 18h7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" className="text-foreground" />
        <path
          d="M3 25c4-5 7-5 6-1s4-1 5-1c-1 4 6 1 14-2"
          className="ink-stroke"
          style={{ strokeWidth: 2.8 }}
        />
      </svg>
      <span className="text-foreground">
        Freehand<span className="text-primary-text">CV</span>
      </span>
    </span>
  );
}
