import { ArrowRight, ShieldCheck } from "lucide-react";
import { TemplatePreview } from "@/components/resume/TemplatePreview";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import type { TemplateId } from "@/lib/resume/schema";
import { FEATURED_TEMPLATES, SYSTEM_TEMPLATE_LIST, SYSTEM_TEMPLATES } from "@/lib/resume/design";
import { Section, SectionHeader } from "./shared";

export type TemplateShowcaseContent = {
  eyebrow: string;
  title: string;
  description: string;
  cardButton: string;
  atsLabel: (score: number) => string;
  /** Text of the "see all {n} templates" link. */
  viewAll: (n: number) => string;
  names: Record<TemplateId, string>;
  locale: "tr" | "en";
};

// In phase 1 the list comes from the `templates` table, ranked by usage and rating (plan 6.3/4).
// For now: the featured system templates; thumbnails are rendered by the real resume renderer.
export function TemplateShowcase({ content }: { content: TemplateShowcaseContent }) {
  return (
    <Section>
      <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
      <Stagger as="ul" className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {FEATURED_TEMPLATES.map((id, i) => (
          <StaggerItem as="li" key={id} index={i}>
            <Link
              href="/create-resume"
              className="group block rounded-2xl border border-border bg-surface p-2.5 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated"
            >
              <div className="relative overflow-hidden rounded-lg ring-1 ring-black/5">
                <TemplatePreview templateId={id} locale={content.locale} initialScale={0.42} />
                <span className="absolute inset-x-2 bottom-2 flex translate-y-2 items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-semibold text-white opacity-0 shadow-elevated transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {content.cardButton}
                  <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-1.5 pt-3 pb-1">
                <span className="text-sm font-semibold text-foreground">{content.names[id]}</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-accent">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  {content.atsLabel(SYSTEM_TEMPLATES[id].ats)}
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="mt-10 text-center">
        <Link
          href="/create-resume"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {content.viewAll(SYSTEM_TEMPLATE_LIST.length)}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      </p>
    </Section>
  );
}
