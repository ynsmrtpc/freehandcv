import { Check, X } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "./shared";

export type ComparisonContent = {
  eyebrow: string;
  title: string;
  description: string;
  featureHeader: string;
  othersHeader: string;
  usHeader: string;
  rows: { feature: string; others: string; us: string }[];
};

// Plan 6.3/3: "Elsewhere / Here" — no brand names are given.
export function Comparison({ content }: { content: ComparisonContent }) {
  return (
    <Section>
      <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
      {/* The table does not fit on narrow screens: each row becomes a card. */}
      <Reveal className="mx-auto mt-12 max-w-3xl space-y-3 sm:hidden">
        {content.rows.map((row) => (
          <div key={row.feature} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
            <p className="font-semibold text-foreground">{row.feature}</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted">
              <X className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={2.5} aria-hidden />
              <span>
                <span className="sr-only">{content.othersHeader}: </span>
                {row.others}
              </span>
            </p>
            <p className="mt-2 flex items-start gap-2 rounded-lg bg-primary-soft px-2.5 py-2 text-sm font-semibold text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.75} aria-hidden />
              <span>
                <span className="sr-only">{content.usHeader}: </span>
                {row.us}
              </span>
            </p>
          </div>
        ))}
      </Reveal>
      <Reveal className="mx-auto mt-14 hidden max-w-3xl sm:block">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <table className="w-full border-collapse text-start text-[15px]">
            <caption className="sr-only">{content.title}</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="w-[34%] px-4 py-4 text-start text-sm font-semibold text-muted sm:px-6">
                  {content.featureHeader}
                </th>
                <th scope="col" className="px-4 py-4 text-start text-sm font-semibold text-muted sm:px-6">
                  {content.othersHeader}
                </th>
                <th scope="col" className="bg-primary-soft px-4 py-4 text-start text-sm font-bold text-primary-text sm:px-6">
                  {content.usHeader}
                </th>
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row) => (
                <tr key={row.feature} className="border-b border-border last:border-0">
                  <th scope="row" className="px-4 py-4 text-start font-semibold text-foreground sm:px-6">
                    {row.feature}
                  </th>
                  <td className="px-4 py-4 text-muted sm:px-6">
                    <span className="flex items-start gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-danger" strokeWidth={2.5} aria-hidden />
                      {row.others}
                    </span>
                  </td>
                  <td className="bg-primary-soft/60 px-4 py-4 font-semibold text-foreground sm:px-6">
                    <span className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.75} aria-hidden />
                      {row.us}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
