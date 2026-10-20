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

