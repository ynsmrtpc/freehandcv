import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "./shared";

export type ComparisonContent = {
  eyebrow: string;
  title: string;
  description: string;
  featureHeader: string;
  usHeader: string;
  rows: { feature: string; us: string }[];
};

// Plan 6.3/3: what FreehandCV gives, as a ruled form register. It states only our own terms: no
// column of claims about other sites (older CMS content may still carry one; it is not rendered).
export function Comparison({ content }: { content: ComparisonContent }) {
  return (
    <Section>
      <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
      <Reveal className="mx-auto mt-12 max-w-3xl sm:mt-14">
        <dl className="border-y border-border-strong">
          <div className="hidden border-b border-border py-3 text-sm font-semibold text-muted sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
            <dt>{content.featureHeader}</dt>
            <dd>{content.usHeader}</dd>
          </div>
          {content.rows.map((row) => (
            <div key={row.feature} className="grid gap-1 border-b border-border py-4 last:border-0 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
              <dt className="text-[15px] text-muted">{row.feature}</dt>
              <dd className="flex items-start gap-2 text-base font-semibold text-foreground">
                <Check className="mt-0.5 size-[18px] shrink-0 text-accent" strokeWidth={2.75} aria-hidden />
                {row.us}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
