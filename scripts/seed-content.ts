// Writes the initial content to the database: landing (tr, en), the other static pages and the
// site settings row. Existing rows are left untouched; safe to run again. Usage: pnpm content:seed
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "../src/server/db";
import { pages, siteSettings } from "../src/server/db/schema";
import { HOME_SLUG } from "../src/server/content/pages";
import { defaultLandingBlocks } from "../src/lib/defaultContent";
import { seedPages } from "./seed-pages";
import en from "../messages/en";
import tr from "../messages/tr";

async function main() {
  const group = randomUUID();
  for (const locale of ["tr", "en"] as const) {
    const existing = await db
      .select({ id: pages.id })
      .from(pages)
      .where(and(eq(pages.locale, locale), eq(pages.slug, HOME_SLUG)))
      .limit(1);
    if (existing.length) {
      console.log(`home (${locale}) already exists, skipped`);
      continue;
    }
    const meta = (locale === "tr" ? tr : en).Meta;
    const blocks = defaultLandingBlocks(locale);
    await db.insert(pages).values({
      slug: HOME_SLUG,
      kind: "static",
      locale,
      translationGroup: group,
      title: meta.defaultTitle,
      metaTitle: meta.defaultTitle,
      metaDescription: meta.defaultDescription,
      status: "published",
      draftBlocks: blocks,
      publishedBlocks: blocks,
    });
    console.log(`home (${locale}) added`);
  }
  // Other static pages: each slug's locales share one translation group.
  const groups = new Map<string, string>();
  for (const locale of ["tr", "en"] as const) {
    for (const p of seedPages(locale)) {
      const existing = await db
        .select({ id: pages.id })
        .from(pages)
        .where(and(eq(pages.locale, locale), eq(pages.slug, p.slug)))
        .limit(1);
      if (existing.length) {
        console.log(`${p.slug} (${locale}) already exists, skipped`);
        continue;
      }
      if (!groups.has(p.slug)) groups.set(p.slug, randomUUID());
      await db.insert(pages).values({
        slug: p.slug,
        kind: p.kind,
        locale,
        translationGroup: groups.get(p.slug),
        title: p.title,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        status: p.publish ? "published" : "draft",
        indexable: p.publish,
        draftBlocks: p.blocks,
        publishedBlocks: p.publish ? p.blocks : null,
      });
      console.log(`${p.slug} (${locale}) added${p.publish ? "" : " — DRAFT, not published"}`);
    }
  }
  await db.insert(siteSettings).values({ id: 1 }).onConflictDoNothing();
  console.log("site settings row ready");
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
