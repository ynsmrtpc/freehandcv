import { cn } from "@/ortak/cn";

/** Kalem ucu + sayfa işareti ve yazı. İşaret tek renkli SVG; temaya göre currentColor. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[17px] font-bold tracking-tight", className)}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-ana" />
        <path
          d="M10 22.5 20.6 11.9a2.1 2.1 0 0 1 3 3L13 25.5l-4 1 1-4Z"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M9 9.5h8M9 13.5h5" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-metin">
        Freehand<span className="text-ana-metin">CV</span>
      </span>
    </span>
  );
}
