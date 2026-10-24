import { ShieldCheck } from "lucide-react";
import { TemplatePreview } from "@/components/resume/TemplatePreview";
import type { TemplateId } from "@/lib/resume/schema";
import { FEATURED_TEMPLATES, SYSTEM_TEMPLATE_LIST, SYSTEM_TEMPLATES } from "@/lib/resume/design";
import { StackShowcase, type StackShowcaseContent } from "./StackShowcase";

export type TemplateShowcaseContent = {
  eyebrow: string;
  title: string;
  description: string;
  cardButton: string;
  atsLabel: (score: number) => string;
  /** Text of the "see all {n} templates" link. */
  viewAll: (n: number) => string;
  names: Record<TemplateId, string>;
  descriptions: Record<TemplateId, string>;
  locale: "tr" | "en";
  labels: StackShowcaseContent["labels"];
};

// The featured system templates; each links to its template page, "see all" to the gallery.
// Previews are rendered by the real resume renderer.
export function TemplateShowcase({ content }: { content: TemplateShowcaseContent }) {
  return (
    <StackShowcase
      side="right"
      content={{
        eyebrow: content.eyebrow,
        title: content.title,
        description: content.description,
        itemLink: content.cardButton,
        viewAll: { label: content.viewAll(SYSTEM_TEMPLATE_LIST.length), href: "/resume-templates" },
        labels: content.labels,
        items: FEATURED_TEMPLATES.map((id) => ({
          key: id,
          name: content.names[id],
          summary: content.descriptions[id],
          badges: [{ label: content.atsLabel(SYSTEM_TEMPLATES[id].ats), icon: <ShieldCheck className="size-3.5 text-accent" aria-hidden /> }],
          href: { pathname: "/resume-templates/[slug]", params: { slug: id } },
          thumbnail: <TemplatePreview templateId={id} locale={content.locale} initialScale={0.58} />,
        })),
      }}
    />
  );
}
