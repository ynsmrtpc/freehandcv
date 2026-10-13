import { Reveal } from "@/components/motion/Reveal";

// Intro for pages other than the landing; holds the page's single h1 (plan 6.4).
export function PageTitle({ content }: { content: { eyebrow: string; title: string; description: string } }) {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-8 sm:px-6 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.14),transparent)]"
      />
      <div className="mx-auto max-w-3xl text-center">
        {content.eyebrow && (
          <Reveal mode="load">
            <p className="text-sm font-semibold tracking-wide text-primary-text uppercase">{content.eyebrow}</p>
          </Reveal>
        )}
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">{content.title}</h1>
        {content.description && (
          <Reveal mode="load" delay={0.08}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{content.description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
