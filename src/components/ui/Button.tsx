import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "border border-border-strong bg-surface text-foreground hover:border-foreground/40 hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface-2 hover:text-foreground",
};

// md and lg meet the 44px touch target; sm is for dense desktop toolbars only.
const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-13 px-7 text-[17px]",
};

/** Shared classes for buttons and button-styled links. */
export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-lg font-bold whitespace-nowrap",
    "transition-[background-color,color,transform,box-shadow] duration-200 active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    extra,
  );
}
