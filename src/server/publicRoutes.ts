import "server-only";
import { and, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import { categoryBySlug } from "@/lib/examples";
import { parseTemplateSlug } from "@/lib/templates";
import { designSchema } from "@/lib/resume/designSchema";
import { normalizeUsername } from "@/lib/username";
import type { Locale } from "@/i18n/routing";
import { db } from "./db";
import { exampleResumes, pages, templates, user } from "./db/schema";

/** Runs before streaming. Do not cache misses: publishing must make a URL available immediately. */
export async function publicResourceExists(pathname: string): Promise<boolean> {
  const match = /^\/(tr|en)\/(guides|resume-examples|resume-templates|users)\/([^/]+)\/?$/.exec(pathname);
  if (!match) return true;
  const [, language, kind, encoded] = match;
  const locale = language as Locale;
  let slug: string;
  try {
    slug = decodeURIComponent(encoded);
  } catch {
    return false;
  }
  if (kind === "resume-examples") {
    if (categoryBySlug(locale, slug)) return true;
    const rows = await db.select({ id: exampleResumes.id }).from(exampleResumes)
      .where(and(eq(exampleResumes.locale, locale), eq(exampleResumes.slug, slug), eq(exampleResumes.active, true))).limit(1);
    return rows.length > 0;
  }
  if (kind === "guides") {
    const rows = await db.select({ id: pages.id }).from(pages)
      .where(and(eq(pages.locale, locale), eq(pages.slug, slug), eq(pages.kind, "guide"), eq(pages.status, "published"), isNotNull(pages.publishedBlocks))).limit(1);
    return rows.length > 0;
  }
  if (kind === "users") {
    const rows = await db.select({ id: user.id }).from(user).where(eq(user.username, normalizeUsername(slug))).limit(1);
    return rows.length > 0;
  }
  const ref = parseTemplateSlug(slug);
  if (!ref) return false;
  if (ref.kind === "system") return true;
  const rows = await db.select({ definition: templates.definition }).from(templates)
    .where(and(eq(templates.id, ref.id), isNull(templates.deletedAt), eq(templates.status, "active"), inArray(templates.visibility, ["public", "unlisted"]))).limit(1);
  return rows.length > 0 && designSchema.safeParse(rows[0].definition).success;
}
