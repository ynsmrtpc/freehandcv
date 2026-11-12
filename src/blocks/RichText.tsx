import { Reveal } from "@/components/motion/Reveal";
import { paragraphs, richTextParts } from "@/lib/resume/utils";
import { Section } from "./shared";
import { Prose } from "@/components/site/Prose";

// Simple text block: a blank line starts a new paragraph, **bold**. Tiptap-based rich text
// (headings, lists, images, tables) arrives with the guide pages (plan 4, 7.1).
export function RichText({ content, reading = false }: { content: { title: string; text: string }; reading?: boolean }) {
  if (reading) return (
    <section className="py-8">
      {content.title && <h2 className="mb-4 text-2xl font-bold text-foreground">{content.title}</h2>}
      <Prose text={content.text} />
    </section>
  );
  return (
    <Section className="py-12 sm:py-16">
      <Reveal className="mx-auto max-w-3xl">
        {content.title && <h2 className="text-3xl font-bold tracking-tight text-balance text-foreground">{content.title}</h2>}
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
          {paragraphs(content.text).map((p, i) => (
            <p key={i}>
              {richTextParts(p).map((x, j) => (x.bold ? <strong key={j} className="text-foreground">{x.text}</strong> : x.text))}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
