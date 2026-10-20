import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/** Section wrapper: shared width, vertical rhythm and anchor id. */
export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("px-4 py-20 sm:px-6 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/** Eyebrow + title + description. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", centered && "mx-auto text-center")}>
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide text-primary-text uppercase">{eyebrow}</p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">{description}</p>
      )}
    </Reveal>
  );
}

/**
 * One row of resume cards (template and example showcases): six side by side on wide screens; on
 * narrower ones the same row scrolls sideways with snapping instead of wrapping into more rows.
 */
export const cardRowClass =
  "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0 lg:pb-0";
export const cardRowItemClass = "w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-auto";
