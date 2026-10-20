import { Prose } from "@/components/site/Prose";
import { Section } from "./shared";

// Long-form guide text (plan 6.2 /rehber): sections with an h2 heading each. Rendered without
// reveal animations: a reader scrolling through an article should never wait for text to appear.
export function Article({ content }: { content: { sections: { heading: string; body: string }[] } }) {
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
