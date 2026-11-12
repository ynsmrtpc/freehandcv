import { Prose } from "@/components/site/Prose";
import { Section } from "./shared";
import { guideSectionId } from "@/lib/guides";

// Long-form guide text (plan 6.2 /rehber): sections with an h2 heading each. Rendered without
// reveal animations: a reader scrolling through an article should never wait for text to appear.
export function Article({ content, readingIndex }: { content: { sections: { heading: string; body: string }[] }; readingIndex?: number }) {
  if (readingIndex !== undefined) return (
    <div className="space-y-10 py-8 sm:space-y-12 sm:py-10">
      {content.sections.map((section, index) => (
        <section key={index} aria-labelledby={section.heading ? guideSectionId(readingIndex, index) : undefined}>
          {section.heading && <h2 id={guideSectionId(readingIndex, index)} tabIndex={-1} className="mb-4 text-2xl leading-snug font-bold tracking-tight text-pretty text-foreground">{section.heading}</h2>}
          <Prose text={section.body} />
        </section>
      ))}
    </div>
  );
  return (
    <Section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-12">
        {content.sections.map((s, i) => (
          <section key={i}>
            {s.heading && <h2 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">{s.heading}</h2>}
            <div className="mt-4">
              <Prose text={s.body} />
            </div>
          </section>
        ))}
      </div>
    </Section>
  );
}
