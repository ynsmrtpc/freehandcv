import "server-only";
import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { EMPTY_GUIDE, exampleGuideSchema, type ExampleGuide } from "@/lib/examples";
import { normalizeResume, type ResumeData } from "@/lib/resume/schema";
import { db } from "../db";
import { auditLog, exampleResumes } from "../db/schema";

// Example resumes (plan 5, 6.2): public SEO pages and "start from this example". Only active rows
// are public; drafts written by the seed script stay inactive until an admin publishes them.

export const EXAMPLES_TAG = "examples";
export const exampleTag = (locale: string, slug: string) => `example:${locale}:${slug}`;

export function parseGuide(raw: unknown): ExampleGuide {
  const parsed = exampleGuideSchema.safeParse(raw);
  return parsed.success ? parsed.data : EMPTY_GUIDE;
}

export type ExampleSummary = {
  slug: string;
  title: string;
  occupation: string;
  category: string;
  experienceLevel: string | null;
  updatedAt: string;
};

const summaryColumns = {
  slug: exampleResumes.slug,
  title: exampleResumes.title,
  occupation: exampleResumes.occupation,
  category: exampleResumes.category,
  experienceLevel: exampleResumes.experienceLevel,
  updatedAt: exampleResumes.updatedAt,
};

/** Active examples of a locale, most used first (lists, category pages, sitemap). */
export async function getPublishedExamples(locale: string): Promise<ExampleSummary[]> {
  "use cache";
  cacheTag(EXAMPLES_TAG);
  try {
    const rows = await db
      .select(summaryColumns)
      .from(exampleResumes)
      .where(and(eq(exampleResumes.locale, locale), eq(exampleResumes.active, true)))
      .orderBy(asc(exampleResumes.sortOrder), desc(exampleResumes.usageCount), asc(exampleResumes.occupation));
    return rows.map((r) => ({ ...r, updatedAt: r.updatedAt.toISOString() }));
  } catch (error) {
    console.error("getPublishedExamples: database unreachable", error);
    cacheLife("seconds");
    return [];
  }
}

export type ShowcaseExample = {
  slug: string;
  title: string;
  occupation: string;
  category: string;
  experienceLevel: string | null;
  /** Meta description, or the start of the guide intro. */
  summary: string;
  content: ResumeData;
};

/** The landing's example showcase: the first examples in list order, with content for the thumbnails. */
export async function getShowcaseExamples(locale: string, limit: number): Promise<ShowcaseExample[]> {
  "use cache";
  cacheTag(EXAMPLES_TAG);
  try {
    const rows = await db
      .select({
        slug: exampleResumes.slug,
        title: exampleResumes.title,
        occupation: exampleResumes.occupation,
        category: exampleResumes.category,
        experienceLevel: exampleResumes.experienceLevel,
        metaDescription: exampleResumes.metaDescription,
        guide: exampleResumes.guide,
        content: exampleResumes.content,
      })
      .from(exampleResumes)
      .where(and(eq(exampleResumes.locale, locale), eq(exampleResumes.active, true)))
      .orderBy(asc(exampleResumes.sortOrder), desc(exampleResumes.usageCount), asc(exampleResumes.occupation))
      .limit(limit);
    return rows.map(({ metaDescription, guide, ...r }) => ({
      ...r,
      summary: metaDescription || parseGuide(guide).intro,
      content: normalizeResume(r.content),
    }));
  } catch (error) {
    console.error("getShowcaseExamples: database unreachable", error);
    cacheLife("seconds");
    return [];
  }
}

export type PublishedExample = ExampleSummary & {
  content: ResumeData;
  metaTitle: string | null;
  metaDescription: string | null;
  guide: ExampleGuide;
};

export async function getPublishedExample(locale: string, slug: string): Promise<PublishedExample | null> {
  "use cache";
  cacheTag(EXAMPLES_TAG, exampleTag(locale, slug));
  try {
    const [row] = await db
      .select({
        ...summaryColumns,
        content: exampleResumes.content,
        metaTitle: exampleResumes.metaTitle,
        metaDescription: exampleResumes.metaDescription,
        guide: exampleResumes.guide,
      })
      .from(exampleResumes)
      .where(and(eq(exampleResumes.locale, locale), eq(exampleResumes.slug, slug), eq(exampleResumes.active, true)))
      .limit(1);
    if (!row) return null;
    return {
      ...row,
      updatedAt: row.updatedAt.toISOString(),
      content: normalizeResume(row.content),
      guide: parseGuide(row.guide),
    };
  } catch (error) {
    console.error("getPublishedExample: database unreachable", error);
    cacheLife("seconds");
    return null;
  }
}

/** Content for "start from this example"; counts the use (most-used ordering). Not cached. */
export async function startFromExample(locale: string, slug: string): Promise<{ id: string; content: ResumeData } | null> {
  const [row] = await db
    .update(exampleResumes)
    .set({ usageCount: sql`${exampleResumes.usageCount} + 1`, updatedAt: sql`${exampleResumes.updatedAt}` })
    .where(and(eq(exampleResumes.locale, locale), eq(exampleResumes.slug, slug), eq(exampleResumes.active, true)))
    .returning({ id: exampleResumes.id, content: exampleResumes.content });
  return row ? { id: row.id, content: normalizeResume(row.content) } : null;
}

/* ---------------- Admin (uncached; the caller checks authorization) ---------------- */

export async function listExamplesForAdmin() {
  return db
    .select({
      id: exampleResumes.id,
      slug: exampleResumes.slug,
      title: exampleResumes.title,
      occupation: exampleResumes.occupation,
      category: exampleResumes.category,
      locale: exampleResumes.locale,
      experienceLevel: exampleResumes.experienceLevel,
      usageCount: exampleResumes.usageCount,
      active: exampleResumes.active,
      guide: exampleResumes.guide,
      updatedAt: exampleResumes.updatedAt,
    })
    .from(exampleResumes)
    .orderBy(asc(exampleResumes.locale), asc(exampleResumes.category), asc(exampleResumes.occupation));
}

export async function getExampleForAdmin(id: string) {
  const [row] = await db.select().from(exampleResumes).where(eq(exampleResumes.id, id)).limit(1);
  if (!row) return null;
  return { ...row, content: normalizeResume(row.content), guide: parseGuide(row.guide) };
}

export type ExampleMeta = {
  slug: string;
  title: string;
  occupation: string;
  category: string;
  locale: "tr" | "en";
  experienceLevel: "entry" | "mid" | "senior";
  metaTitle: string;
  metaDescription: string;
  guide: ExampleGuide;
  sortOrder: number;
};

export class ExampleSlugTakenError extends Error {}
/** A published example's URL is public; changing it would break links (plan 6.4: slugs stay fixed). */
export class ExampleSlugLockedError extends Error {}
export class ExampleNotFoundError extends Error {}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function assertSlugFree(tx: Tx, locale: string, slug: string, exceptId?: string) {
  const [clash] = await tx
    .select({ id: exampleResumes.id })
    .from(exampleResumes)
    .where(
      and(eq(exampleResumes.locale, locale), eq(exampleResumes.slug, slug), exceptId ? ne(exampleResumes.id, exceptId) : undefined),
    )
    .limit(1);
  if (clash) throw new ExampleSlugTakenError();
}

const metaValues = (m: ExampleMeta) => ({
  ...m,
  market: m.locale === "tr" ? "tr-TR" : "en-US",
  metaTitle: m.metaTitle || null,
  metaDescription: m.metaDescription || null,
});

/** A new example starts inactive with the sample resume of its locale. */
export async function createExample(meta: ExampleMeta, content: ResumeData, actorId: string) {
  return db.transaction(async (tx) => {
    await assertSlugFree(tx, meta.locale, meta.slug);
    const [{ id }] = await tx
      .insert(exampleResumes)
      .values({ ...metaValues(meta), content, active: false })
      .returning({ id: exampleResumes.id });
    await tx.insert(auditLog).values({
      userId: actorId,
      action: "create_example",
      targetType: "example_resume",
      targetId: id,
      after: { slug: meta.slug, locale: meta.locale },
    });
    return id;
  });
}

export async function updateExampleMeta(id: string, meta: ExampleMeta, actorId: string) {
  await db.transaction(async (tx) => {
    const [before] = await tx
      .select({ slug: exampleResumes.slug, locale: exampleResumes.locale, active: exampleResumes.active })
      .from(exampleResumes)
      .where(eq(exampleResumes.id, id))
      .for("update");
    if (!before) throw new ExampleNotFoundError();
    if (before.active && (before.slug !== meta.slug || before.locale !== meta.locale)) throw new ExampleSlugLockedError();
    await assertSlugFree(tx, meta.locale, meta.slug, id);
    await tx.update(exampleResumes).set(metaValues(meta)).where(eq(exampleResumes.id, id));
    await tx.insert(auditLog).values({
      userId: actorId,
      action: "update_example",
      targetType: "example_resume",
      targetId: id,
      before: { slug: before.slug },
      after: { slug: meta.slug },
    });
  });
}

/** The resume itself, autosaved from the editor (not written to the audit log: it changes every second). */
export async function saveExampleContent(id: string, content: ResumeData) {
  const r = await db.update(exampleResumes).set({ content }).where(eq(exampleResumes.id, id)).returning({
    locale: exampleResumes.locale,
    slug: exampleResumes.slug,
  });
  if (!r.length) throw new ExampleNotFoundError();
  return r[0];
}

export async function setExampleActive(id: string, active: boolean, actorId: string) {
  return db.transaction(async (tx) => {
    const [before] = await tx
      .select({ active: exampleResumes.active, locale: exampleResumes.locale, slug: exampleResumes.slug })
      .from(exampleResumes)
      .where(eq(exampleResumes.id, id))
      .for("update");
    if (!before) throw new ExampleNotFoundError();
    if (before.active !== active) {
      await tx.update(exampleResumes).set({ active }).where(eq(exampleResumes.id, id));
      await tx.insert(auditLog).values({
        userId: actorId,
        action: active ? "publish_example" : "unpublish_example",
        targetType: "example_resume",
        targetId: id,
        before: { active: before.active },
        after: { active },
      });
    }
    return before;
  });
}

/** Publishes or unpublishes several examples. Returns locale/slug pairs for the cache tags. */
export async function setExamplesActive(ids: string[], active: boolean, actorId: string) {
  return db.transaction(async (tx) => {
    const rows = await tx
      .update(exampleResumes)
      .set({ active })
      .where(and(inArray(exampleResumes.id, ids), ne(exampleResumes.active, active)))
      .returning({ id: exampleResumes.id, locale: exampleResumes.locale, slug: exampleResumes.slug });
    if (rows.length)
      await tx.insert(auditLog).values(
        rows.map((r) => ({
          userId: actorId,
          action: active ? "publish_example" : "unpublish_example",
          targetType: "example_resume",
          targetId: r.id,
          before: { active: !active },
          after: { active },
        })),
      );
    return rows;
  });
}

/** Deletes examples. Resumes started from one keep their content (the source link is cleared). */
export async function deleteExamples(ids: string[], actorId: string) {
  return db.transaction(async (tx) => {
    const rows = await tx
      .delete(exampleResumes)
      .where(inArray(exampleResumes.id, ids))
      .returning({ id: exampleResumes.id, locale: exampleResumes.locale, slug: exampleResumes.slug, title: exampleResumes.title });
    if (rows.length)
      await tx.insert(auditLog).values(
        rows.map((r) => ({ userId: actorId, action: "delete_example", targetType: "example_resume", targetId: r.id, before: { slug: r.slug, locale: r.locale, title: r.title } })),
      );
    return rows;
  });
}
