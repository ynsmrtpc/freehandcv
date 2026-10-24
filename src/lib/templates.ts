// Shared helpers for template pages (plan 6.2 /cv-sablonlari/[slug], 11.3–11.4).
import { TEMPLATE_IDS, type TemplateId } from "./resume/schema";

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const TURKISH: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };

/** Lowercase ASCII words joined by "-" (Turkish letters transliterated). */
export function slugify(text: string, max = 50) {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[çğıöşüâîû]/g, (c) => TURKISH[c])
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, max)
    .replace(/^-+|-+$/g, "");
}

/**
 * System templates live at their id (/cv-sablonlari/modern); user templates at name + full id
 * (/cv-sablonlari/sade-mavi-<uuid>). The full id keeps links to unlisted templates unguessable.
 */
export type TemplateRef = { kind: "system"; id: TemplateId } | { kind: "user"; id: string };

export function templateSlug(ref: TemplateRef, name = "") {
  if (ref.kind === "system") return ref.id;
  const words = slugify(name);
  return words ? `${words}-${ref.id}` : ref.id;
}

export function parseTemplateSlug(slug: string): TemplateRef | null {
  if ((TEMPLATE_IDS as readonly string[]).includes(slug)) return { kind: "system", id: slug as TemplateId };
  const id = UUID.exec(slug)?.[0];
  return id ? { kind: "user", id } : null;
}

/** Weight of the overall mean in the Bayesian average (plan 11.3: C ≈ 10). */
export const RATING_PRIOR_WEIGHT = 10;

/**
 * Ranking score (plan 11.3): one 5-star vote does not beat 200 votes averaging 4.7.
 * `mean` is the average over all rated templates.
 */
export function bayesianRating(sum: number, count: number, mean: number) {
  return (RATING_PRIOR_WEIGHT * mean + sum) / (RATING_PRIOR_WEIGHT + count);
}

/** Mean used when nothing has been rated yet (neutral: neither helps nor hurts). */
const DEFAULT_RATING_MEAN = 4;

/** The plan 11.3 `m`: the average rating over all rated templates. */
export function ratingMean(templates: { ratingSum: number; ratingCount: number }[]) {
  const count = templates.reduce((n, t) => n + t.ratingCount, 0);
  return count ? templates.reduce((n, t) => n + t.ratingSum, 0) / count : DEFAULT_RATING_MEAN;
}

/** Query parameter of /cv-olustur that starts the editor in an official template (?sablon=modern). */
export const TEMPLATE_PARAM = "sablon";
