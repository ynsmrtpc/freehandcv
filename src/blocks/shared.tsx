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

/**
 * Title + description. The CMS still stores an eyebrow per block; it is not rendered: the heading
 * carries its own weight.
 */
export function SectionHeader({
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", centered && "mx-auto text-center")}>
      <h2 className="text-3xl leading-tight font-extrabold tracking-[-0.02em] text-balance text-foreground sm:text-[2.6rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted">{description}</p>
      )}
    </Reveal>
  );
}

