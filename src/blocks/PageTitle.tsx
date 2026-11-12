import { Reveal } from "@/components/motion/Reveal";

// Intro for pages other than the landing; holds the page's single h1 (plan 6.4).
// The CMS eyebrow is stored but not rendered: the heading carries its own weight.
export function PageTitle({ content }: { content: { eyebrow: string; title: string; description: string } }) {
  return (
    <section className="px-4 pt-14 pb-8 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-6xl border-b border-border-strong pb-10">
        <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-[-0.025em] text-balance text-foreground sm:text-[3.25rem]">
          {content.title}
        </h1>
        {content.description && (
          <Reveal mode="load" delay={0.08}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{content.description}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
