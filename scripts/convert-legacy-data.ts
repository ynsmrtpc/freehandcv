// One-off conversion of JSON data written with the original Turkish keys to the English shapes in
// docs/GLOSSARY.md: page blocks, page version blocks and meta, site settings and resume content.
// Runs in a single transaction and only updates rows whose JSON actually changes, keeping their
// `updated_at` so sitemaps and resume lists are not disturbed. Safe to run again.
// Usage: pnpm data:convert-legacy
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/server/db";
import { pageVersions, pages, resumeVersions, resumes, siteSettings } from "../src/server/db/schema";
import { migrateLegacyBlocks, migrateLegacyPageMeta, migrateLegacySiteSettings } from "../src/lib/legacyContent";
import { migrateLegacyResume } from "../src/lib/resume/legacy";

const changed = (before: unknown, after: unknown) => JSON.stringify(before) !== JSON.stringify(after);

async function main() {
  const counts = await db.transaction(async (tx) => {
    const c = { pages: 0, pageVersions: 0, siteSettings: 0, resumes: 0, resumeVersions: 0 };

    for (const row of await tx.select().from(pages)) {
      const draftBlocks = migrateLegacyBlocks(row.draftBlocks);
      const publishedBlocks = row.publishedBlocks == null ? row.publishedBlocks : migrateLegacyBlocks(row.publishedBlocks);
      if (!changed(row.draftBlocks, draftBlocks) && !changed(row.publishedBlocks, publishedBlocks)) continue;
      await tx
        .update(pages)
        .set({ draftBlocks, publishedBlocks, updatedAt: row.updatedAt })
        .where(eq(pages.id, row.id));
      c.pages++;
    }

    for (const row of await tx.select().from(pageVersions)) {
      const blocks = migrateLegacyBlocks(row.blocks);
      const meta = row.meta == null ? row.meta : migrateLegacyPageMeta(row.meta);
      if (!changed(row.blocks, blocks) && !changed(row.meta, meta)) continue;
      await tx.update(pageVersions).set({ blocks, meta }).where(eq(pageVersions.id, row.id));
      c.pageVersions++;
    }

    for (const row of await tx.select().from(siteSettings)) {
      const next = migrateLegacySiteSettings({ settings: row.settings, translations: row.translations });
      if (!changed(row.settings, next.settings) && !changed(row.translations, next.translations)) continue;
      await tx
        .update(siteSettings)
        .set({ settings: next.settings, translations: next.translations, updatedAt: row.updatedAt })
        .where(eq(siteSettings.id, row.id));
      c.siteSettings++;
    }

    for (const row of await tx.select({ id: resumes.id, content: resumes.content, updatedAt: resumes.updatedAt }).from(resumes)) {
      const content = migrateLegacyResume(row.content);
      if (!changed(row.content, content)) continue;
      await tx.update(resumes).set({ content, updatedAt: row.updatedAt }).where(eq(resumes.id, row.id));
      c.resumes++;
    }

    for (const row of await tx.select({ id: resumeVersions.id, content: resumeVersions.content }).from(resumeVersions)) {
      const content = migrateLegacyResume(row.content);
      if (!changed(row.content, content)) continue;
      await tx.update(resumeVersions).set({ content }).where(eq(resumeVersions.id, row.id));
      c.resumeVersions++;
    }

    return c;
  });

  console.log("Converted rows:");
  for (const [table, n] of Object.entries(counts)) console.log(`  ${table}: ${n}`);
}

main().then(
  () => process.exit(0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
