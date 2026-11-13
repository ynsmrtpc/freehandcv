// Adds the example resume drafts under content/examples/<locale>/ to the database as inactive rows
// (an admin publishes them in the panel). Existing rows (same locale + slug) are left untouched,
// so edits made in the panel are never overwritten. Safe to run again.
// Usage: bun run content:seed-examples          validate and insert missing drafts
//        bun run content:seed-examples --check  validate only (no database)
import "dotenv/config";
import { readdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ExampleDraft } from "../content/examples/define";
import { EXAMPLE_CATEGORY_IDS, exampleGuideSchema, exampleSlugSchema, guideWordCount } from "../src/lib/examples";
import { normalizeResume } from "../src/lib/resume/schema";

const LOCALES = ["tr", "en"] as const;
const SLUG_SUFFIX = { tr: "-cv-ornegi", en: "-resume" } as const;
const checkOnly = process.argv.includes("--check");

type Loaded = { locale: (typeof LOCALES)[number]; file: string; draft: ExampleDraft };

async function load(): Promise<Loaded[]> {
  const root = path.resolve("content/examples");
  const out: Loaded[] = [];
  for (const locale of LOCALES) {
    let files: string[] = [];
    try {
      files = readdirSync(path.join(root, locale)).filter((f) => f.endsWith(".ts"));
    } catch {
      continue;
    }
    for (const file of files.sort()) {
      const mod = await import(pathToFileURL(path.join(root, locale, file)).href);
      out.push({ locale, file, draft: mod.default as ExampleDraft });
    }
  }
  return out;
}

/** Problems that block seeding; warnings are printed but allowed. */
function validate({ locale, file, draft }: Loaded) {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!exampleSlugSchema.safeParse(draft.slug).success) errors.push("invalid slug");
  if (!draft.slug.endsWith(SLUG_SUFFIX[locale])) errors.push(`slug must end in ${SLUG_SUFFIX[locale]}`);
  if (file !== `${draft.slug}.ts`) errors.push(`file name must be ${draft.slug}.ts`);
  if (!(EXAMPLE_CATEGORY_IDS as readonly string[]).includes(draft.category)) errors.push("unknown category");
  if (!exampleGuideSchema.safeParse(draft.guide).success) errors.push("invalid guide");
  if (draft.content.settings?.locale !== locale) errors.push(`content.settings.locale must be "${locale}"`);
  if (draft.metaTitle.length > 60) warnings.push(`metaTitle ${draft.metaTitle.length} > 60 chars`);
  if (draft.metaDescription.length > 155) warnings.push(`metaDescription ${draft.metaDescription.length} > 155 chars`);
  const words = guideWordCount(draft.guide);
  if (words < 400 || words > 800) warnings.push(`guide has ${words} words (target 400–800)`);
  const data = normalizeResume(draft.content);
  if (!data.personal.name || !data.summary || !data.experience.length) errors.push("resume needs a name, summary and experience");
  return { errors, warnings, words, data };
}

async function main() {
  const drafts = await load();
  const seen = new Set<string>();
  let failed = false;
  const valid: (Loaded & { data: ReturnType<typeof normalizeResume> })[] = [];
  for (const d of drafts) {
    const { errors, warnings, words, data } = validate(d);
    const key = `${d.locale}/${d.draft.slug}`;
    if (seen.has(key)) errors.push("duplicate slug");
    seen.add(key);
    const status = errors.length ? "ERROR" : warnings.length ? "warn " : "ok   ";
    console.log(`${status} ${key} (${words} words)${[...errors, ...warnings].map((m) => `\n        - ${m}`).join("")}`);
    if (errors.length) failed = true;
    else valid.push({ ...d, data });
  }
  console.log(`${drafts.length} drafts, ${valid.length} valid`);
  if (failed) process.exitCode = 1;
  if (checkOnly || failed) return;

  const { and, eq } = await import("drizzle-orm");
  const { db } = await import("../src/server/db");
  const { exampleResumes } = await import("../src/server/db/schema");
  let added = 0;
  for (const { locale, draft, data } of valid) {
    const [existing] = await db
      .select({ id: exampleResumes.id })
      .from(exampleResumes)
      .where(and(eq(exampleResumes.locale, locale), eq(exampleResumes.slug, draft.slug)))
      .limit(1);
    if (existing) continue;
    await db.insert(exampleResumes).values({
      slug: draft.slug,
      title: draft.title,
      occupation: draft.occupation,
      category: draft.category,
      locale,
      market: locale === "tr" ? "tr-TR" : "en-US",
      experienceLevel: draft.experienceLevel,
      content: data,
      metaTitle: draft.metaTitle,
      metaDescription: draft.metaDescription,
      guide: draft.guide,
      active: false,
    });
    added++;
    console.log(`added ${locale}/${draft.slug} (inactive)`);
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
