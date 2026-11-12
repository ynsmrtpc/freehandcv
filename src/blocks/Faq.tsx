import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { Section, SectionHeader } from "./shared";
import { cn } from "@/lib/cn";

export type FaqContent = {
  eyebrow: string;
  title: string;
  items: { question: string; answer: string }[];
};

// Native <details>: no JS needed; works with keyboard and screen readers out of the box.
// FAQPage structured data is generated from the same list (plan 6.4).
export function Faq({ content, reading = false }: { content: FaqContent; reading?: boolean }) {
  const Wrapper = reading ? "section" : Section;
  const List = reading ? "div" : Reveal;
  return (
    <Wrapper className={reading ? "border-t border-border py-8" : undefined}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      {reading ? <h2 className="text-2xl font-bold text-foreground">{content.title}</h2> : <SectionHeader eyebrow={content.eyebrow} title={content.title} />}
      <List className={cn("divide-y divide-border", reading ? "mt-4" : "mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-surface shadow-card")}>
        {content.items.map((item, i) => (
          <details key={item.question} className={cn("group", !reading && "px-5 sm:px-6")} open={i === 0}>
            <summary className="flex min-h-16 list-none items-center justify-between gap-4 py-4 text-start font-semibold text-foreground [&::-webkit-details-marker]:hidden">
              {item.question}
              <Plus
                className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="pb-5 leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </List>
    </Wrapper>
  );
}
