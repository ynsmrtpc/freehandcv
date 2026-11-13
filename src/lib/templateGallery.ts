// Gallery items (plan 11.4): system templates and public community templates in one shape.
import type { GalleryItem } from "@/components/templates/TemplateCard";
import { SYSTEM_TEMPLATE_LIST } from "./resume/design";
import type { TemplateId } from "./resume/schema";
import { bayesianRating, ratingMean } from "./templates";
import type { SharedTemplate } from "@/server/templates";

export function systemGalleryItems(text: { names: Record<TemplateId, string>; descriptions: Record<TemplateId, string> }) {
  return SYSTEM_TEMPLATE_LIST.map(
    (s): GalleryItem => ({
      ref: { kind: "system", id: s.id },
      name: text.names[s.id],
      description: text.descriptions[s.id],
      ownerUsername: null,
      definition: s.definition,
      ats: s.ats,
      usage: 0,
      ratingAverage: null,
      ratingCount: 0,
      score: 0,
      publishedAt: null,
    }),
  );
}

/** `all` is every public template, so the rating mean is the same on every page. */
export function communityGalleryItems(list: SharedTemplate[], all: SharedTemplate[] = list) {
  const mean = ratingMean(all);
  return list.map(
    (t): GalleryItem => ({
      ref: { kind: "user", id: t.id },
      featured: t.featured,
      name: t.name,
      description: t.description ?? "",
      ownerUsername: t.ownerUsername,
      definition: t.definition,
      ats: t.atsScore,
      usage: t.usageCount,
      ratingAverage: t.ratingCount ? t.ratingSum / t.ratingCount : null,
      ratingCount: t.ratingCount,
      score: bayesianRating(t.ratingSum, t.ratingCount, mean),
      publishedAt: t.publishedAt,
    }),
  );
}
