import { ShieldCheck, Star, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { DefinitionPreview } from "@/components/resume/TemplatePreview";
import { Link } from "@/i18n/navigation";
import type { DesignDefinition } from "@/lib/resume/design";
import { hasSidebar } from "@/lib/resume/design";
import { templateSlug, type TemplateRef } from "@/lib/templates";

/** One template in the gallery, on a profile or under "similar templates" (system and community alike). */
export type GalleryItem = {
  ref: TemplateRef;
  name: string;
  description: string;
  /** Null for system templates (shown as FreehandCV). */
  ownerUsername: string | null;
  definition: DesignDefinition;
  ats: number;
  usage: number;
  ratingAverage: number | null;
  ratingCount: number;
  /** Ranking score (Bayesian average, plan 11.3). */
  score: number;
  publishedAt: string | null;
};

export const itemKey = (item: GalleryItem) => `${item.ref.kind}:${item.ref.id}`;
export const itemSlug = (item: GalleryItem) => templateSlug(item.ref, item.name);
export const itemFacts = (item: GalleryItem) => ({
  photo: item.definition.header.photo !== "none",
  twoColumn: hasSidebar(item.definition),
});

export function TemplateCard({ item, locale }: { item: GalleryItem; locale: string }) {
  const t = useTranslations("Templates.gallery");
  return (
    <Link
      href={{ pathname: "/resume-templates/[slug]", params: { slug: itemSlug(item) } }}
      className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-3 shadow-card transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-elevated"
    >
      <div className="overflow-hidden rounded-lg ring-1 ring-black/5">
        <DefinitionPreview definition={item.definition} locale={locale} initialScale={0.3} />
      </div>
      <span className="mt-3 block truncate font-semibold text-foreground group-hover:text-primary-text">{item.name}</span>
      <span className="mt-0.5 block truncate text-xs text-muted">
        {item.ownerUsername ? `@${item.ownerUsername}` : t("official")}
      </span>
      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1 font-medium text-accent">
          <ShieldCheck className="size-3.5" aria-hidden />
          {t("ats", { score: item.ats })}
        </span>
        {item.ratingAverage !== null && (
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-current text-warning" aria-hidden />
            {t("rating", { average: item.ratingAverage.toFixed(1), count: item.ratingCount })}
          </span>
        )}
        {item.usage > 0 && (
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {t("usage", { n: item.usage })}
          </span>
        )}
      </span>
    </Link>
  );
}
