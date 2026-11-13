// Adds the guide drafts under content/guides/<locale>/ to the database as DRAFT pages (kind "guide").
// An admin publishes them from the page editor. Existing pages (same locale + slug) are left
// untouched, so panel edits are never overwritten. Safe to run again.
// Usage: bun run content:seed-guides          validate and insert missing drafts
//        bun run content:seed-guides --check  validate only (no database)
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { guideBlocks, type GuideDraft } from "../content/guides/define";
import { blockListSchema } from "../src/lib/blocks";
import { exampleSlugSchema } from "../src/lib/examples";

const LOCALES = ["tr", "en"] as const;
const EDITOR_HREF = { tr: "/cv-olustur", en: "/en/create-resume" } as const;
/** Slugs already used by static pages share the same (locale, slug) key in the pages table. */
const RESERVED = new Set(["home", "is-it-free", "support", "privacy"]);
const checkOnly = process.argv.includes("--check");

const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

async function main() {
  const root = path.resolve("content/guides");
  const drafts: { locale: (typeof LOCALES)[number]; file: string; draft: GuideDraft }[] = [];
  for (const locale of LOCALES) {
    let files: string[] = [];
    try {
      files = readdirSync(path.join(root, locale)).filter((f) => f.endsWith(".ts"));
    } catch {
      continue;
    }
    for (const file of files.sort()) {
      const mod = await import(pathToFileURL(path.join(root, locale, file)).href);
      drafts.push({ locale, file, draft: mod.default as GuideDraft });
    }
  }

  let failed = false;
  const valid: ((typeof drafts)[number] & { blocks: ReturnType<typeof guideBlocks> })[] = [];
  for (const d of drafts) {
    const g = d.draft;
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!exampleSlugSchema.safeParse(g.slug).success) errors.push("invalid slug");
    if (RESERVED.has(g.slug)) errors.push("slug is reserved by a static page");
    if (d.file !== `${g.slug}.ts`) errors.push(`file name must be ${g.slug}.ts`);
    const blocks = guideBlocks(g, EDITOR_HREF[d.locale]);
    const parsed = blockListSchema.safeParse(blocks);
    if (!parsed.success) errors.push(...parsed.error.issues.map((i) => `block ${i.path.join(".")}: ${i.message}`));
    if (g.metaTitle.length > 60) warnings.push(`metaTitle ${g.metaTitle.length} > 60 chars`);
    if (g.metaDescription.length > 155) warnings.push(`metaDescription ${g.metaDescription.length} > 155 chars`);
    const n = words(g.sections.map((s) => `${s.heading} ${s.body}`).join(" "));
    if (n < 900 || n > 1600) warnings.push(`article has ${n} words (target 900–1600)`);
    if (g.faq.length < 3) warnings.push("fewer than 3 FAQ items");
    const status = errors.length ? "ERROR" : warnings.length ? "warn " : "ok   ";
    console.log(`${status} ${d.locale}/${g.slug} (${n} words)${[...errors, ...warnings].map((m) => `\n        - ${m}`).join("")}`);
    if (errors.length) failed = true;
    else valid.push({ ...d, blocks });
  }
  console.log(`${drafts.length} drafts, ${valid.length} valid`);
  if (failed) process.exitCode = 1;
  if (checkOnly || failed) return;

  const { and, eq } = await import("drizzle-orm");
  const { db } = await import("../src/server/db");
  const { pages } = await import("../src/server/db/schema");
  let added = 0;
  for (const { locale, draft, blocks } of valid) {
    const [existing] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(and(eq(pages.locale, locale), eq(pages.slug, draft.slug)))
      .limit(1);
    if (existing) continue;
    await db.insert(pages).values({
      slug: draft.slug,
      kind: "guide",
      locale,
      translationGroup: randomUUID(),
      title: draft.title,
      metaTitle: draft.metaTitle,
      metaDescription: draft.metaDescription,
      status: "draft",
      draftBlocks: blocks,
      publishedBlocks: null,
    });
    added++;
    console.log(`added ${locale}/${draft.slug} (draft)`);
  }
  console.log(`${added} added, ${valid.length - added} already in the database`);
}

main().then(
  () => process.exit(process.exitCode ?? 0),
  (error) => {
    console.error(error);
    process.exit(1);
  },
);
