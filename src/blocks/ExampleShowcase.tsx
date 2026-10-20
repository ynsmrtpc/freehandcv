import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { ResumeThumbnail } from "@/components/resume/TemplatePreview";
import { Link } from "@/i18n/navigation";
import { systemDefinition } from "@/lib/resume/design";
import type { ResumeData } from "@/lib/resume/schema";
import { cardRowClass, cardRowItemClass, Section, SectionHeader } from "./shared";

export type ShowcaseItem = { slug: string; title: string; occupation: string; content: ResumeData };

export type ExampleShowcaseContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: ShowcaseItem[];
  cardButton: string;
  /** Text of the "see all {n} examples" link. */
  viewAll: string;
};

// Published example resumes on the landing (plan 6.3 "Popüler CV örnekleri"): each card draws the
// example's real resume with the rendering engine and opens its page.
export function ExampleShowcase({ content }: { content: ExampleShowcaseContent }) {
  return (
    <Section>
      <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
      <Stagger as="ul" className={`mt-14 ${cardRowClass}`}>
        {content.items.map((e, i) => (
          <StaggerItem as="li" key={e.slug} index={i % 6} className={cardRowItemClass}>
            <Link
              href={{ pathname: "/resume-examples/[slug]", params: { slug: e.slug } }}
              className="group block rounded-2xl border border-border bg-surface p-2 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated"
            >
              <div className="relative overflow-hidden rounded-lg ring-1 ring-black/5">
                <ResumeThumbnail data={e.content} definition={systemDefinition(e.content.settings.template)} initialScale={0.24} />
                <span className="absolute inset-x-2 bottom-2 flex translate-y-2 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-white opacity-0 shadow-elevated transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {content.cardButton}
                  <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
                </span>
              </div>
              <span className="block px-1.5 pt-3 pb-1 text-sm font-semibold text-foreground">{e.occupation}</span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="mt-10 text-center">
        <Link
          href="/resume-examples"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {content.viewAll}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      </p>
    </Section>
  );
}
