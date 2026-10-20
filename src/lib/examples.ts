// Example resume categories and the guide text format (plan 5, 6.2). Category slugs are public URLs
// (/cv-ornekleri/saglik) and never change after launch; their names and intros live in
// messages/<locale>/Examples.json. Example slugs always end in "-cv-ornegi" / "-resume", so they
// never collide with a category under the same path segment.
import { z } from "zod";
import type { Locale } from "@/i18n/routing";

export const EXAMPLE_CATEGORIES = [
  { id: "technology", slug: { tr: "bilisim", en: "technology" } },
  { id: "healthcare", slug: { tr: "saglik", en: "healthcare" } },
  { id: "education", slug: { tr: "egitim", en: "education" } },
  { id: "finance", slug: { tr: "finans-muhasebe", en: "finance-accounting" } },
  { id: "sales-marketing", slug: { tr: "satis-pazarlama", en: "sales-marketing" } },
  { id: "engineering", slug: { tr: "muhendislik", en: "engineering" } },
  { id: "operations", slug: { tr: "lojistik-uretim", en: "logistics-manufacturing" } },
  { id: "hospitality", slug: { tr: "turizm-hizmet", en: "hospitality-service" } },
  { id: "administration", slug: { tr: "idari-isler-ik", en: "administration-hr" } },
  { id: "design-media", slug: { tr: "tasarim-medya", en: "design-media" } },
  { id: "law-public", slug: { tr: "hukuk-kamu", en: "law-public-sector" } },
] as const;

export type ExampleCategoryId = (typeof EXAMPLE_CATEGORIES)[number]["id"];
export const EXAMPLE_CATEGORY_IDS = EXAMPLE_CATEGORIES.map((c) => c.id) as [ExampleCategoryId, ...ExampleCategoryId[]];

export const categoryBySlug = (locale: Locale, slug: string) =>
  EXAMPLE_CATEGORIES.find((c) => c.slug[locale] === slug);
export const categorySlug = (locale: Locale, id: string) =>
  EXAMPLE_CATEGORIES.find((c) => c.id === id)?.slug[locale];

export const EXPERIENCE_LEVELS = ["entry", "mid", "senior"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

/**
 * The "writing a resume in this occupation" text on an example page (400–800 words, plan 6.4).
 * Body format: a blank line starts a paragraph, lines starting with "- " form a list, **bold**.
 */
export const exampleGuideSchema = z.object({
  intro: z.string().max(2000),
  sections: z.array(z.object({ heading: z.string().max(160), body: z.string().max(6000) })).max(12),
});
export type ExampleGuide = z.infer<typeof exampleGuideSchema>;

export const EMPTY_GUIDE: ExampleGuide = { intro: "", sections: [] };

/** Example slugs: lower-case ASCII words joined by hyphens. */
export const exampleSlugSchema = z
  .string()
  .min(3)
  .max(120)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

/** Rough word count of a guide (the page should reach 400+ words to avoid thin content). */
export function guideWordCount(g: ExampleGuide) {
  const text = [g.intro, ...g.sections.flatMap((s) => [s.heading, s.body])].join(" ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}
