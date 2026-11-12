import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { blockListSchema, type Block } from "@/lib/blocks";
import { migrateLegacyBlocks } from "@/lib/legacyContent";
import { db } from "../db";
import { auditLog, pages, pageVersions, user } from "../db/schema";

export const HOME_SLUG = "home";
export const pageTag = (locale: string, slug: string) => `page:${locale}:${slug}`;
export const PUBLISHED_PAGES_TAG = "pages:published";

/** Parses stored blocks (legacy Turkish keys included); invalid content yields an empty list. */
export function parseBlocks(raw: unknown): Block[] {
  const parsed = blockListSchema.safeParse(migrateLegacyBlocks(raw));
  return parsed.success ? (parsed.data as Block[]) : [];
}

/** The sitemap uses indexable pages; navigation can also include published noindex legal pages. */
export async function getPublishedPages(includeNoIndex = false): Promise<{ locale: string; slug: string; updatedAt: string }[]> {
  "use cache";
  cacheTag(PUBLISHED_PAGES_TAG);
  try {
    const rows = await db
      .select({ locale: pages.locale, slug: pages.slug, updatedAt: pages.updatedAt })
      .from(pages)
      .where(and(eq(pages.status, "published"), includeNoIndex ? undefined : eq(pages.indexable, true)));
    return rows.map((p) => ({ ...p, updatedAt: p.updatedAt.toISOString() }));
  } catch (error) {
    console.error("getPublishedPages: database unreachable", error);
    cacheLife("seconds");
    return [];
  }
}

export type PublishedPage = {
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  indexable: boolean;
  blocks: Block[];
};

/**
 * The page visitors see (published_blocks). Cached; "Publish" refreshes only this page's tag
 * (plan 7.2). If the database is unreachable (e.g. the Docker build stage) it returns null with a
 * short lifetime, so the page is regenerated with real content on the first request.
 */
export async function getPublishedPage(locale: string, slug: string): Promise<PublishedPage | null> {
  "use cache";
  cacheTag(pageTag(locale, slug));
  try {
    const [p] = await db
      .select({
        title: pages.title,
        metaTitle: pages.metaTitle,
        metaDescription: pages.metaDescription,
        indexable: pages.indexable,
        blocks: pages.publishedBlocks,
      })
      .from(pages)
      .where(and(eq(pages.locale, locale), eq(pages.slug, slug), eq(pages.status, "published")))
      .limit(1);
    if (!p?.blocks) return null;
    return { ...p, blocks: parseBlocks(p.blocks) };
  } catch (error) {
    console.error("getPublishedPage: database unreachable", error);
    cacheLife("seconds");
    return null;
  }
}

export type GuideSummary = {
  locale: string;
  slug: string;
  title: string;
  description: string | null;
  translationGroup: string | null;
  updatedAt: string;
};

/** Published guides of every locale (/rehber: links, sitemap, hreflang via translation_group). */
export async function getPublishedGuides(): Promise<GuideSummary[]> {
  "use cache";
  cacheTag(PUBLISHED_PAGES_TAG);
  try {
    const rows = await db
      .select({
        locale: pages.locale,
        slug: pages.slug,
        title: pages.title,
        description: pages.metaDescription,
        translationGroup: pages.translationGroup,
        updatedAt: pages.updatedAt,
      })
      .from(pages)
      .where(and(eq(pages.kind, "guide"), eq(pages.status, "published"), eq(pages.indexable, true)))
      .orderBy(pages.title);
    return rows.map((r) => ({ ...r, updatedAt: r.updatedAt.toISOString() }));
  } catch (error) {
    console.error("getPublishedGuides: database unreachable", error);
    cacheLife("seconds");
    return [];
  }
}

/** A published guide; static and legal pages never resolve under /rehber. */
export async function getPublishedGuide(locale: string, slug: string): Promise<(PublishedPage & { updatedAt: string }) | null> {
  "use cache";
  cacheTag(pageTag(locale, slug));
  try {
    const [p] = await db
      .select({
        title: pages.title,
        metaTitle: pages.metaTitle,
        metaDescription: pages.metaDescription,
        indexable: pages.indexable,
        blocks: pages.publishedBlocks,
        updatedAt: pages.updatedAt,
      })
      .from(pages)
      .where(and(eq(pages.locale, locale), eq(pages.slug, slug), eq(pages.kind, "guide"), eq(pages.status, "published")))
      .limit(1);
    if (!p?.blocks) return null;
    return { ...p, blocks: parseBlocks(p.blocks), updatedAt: p.updatedAt.toISOString() };
  } catch (error) {
    console.error("getPublishedGuide: database unreachable", error);
    cacheLife("seconds");
    return null;
  }
}

/* ---------------- Admin (uncached; the caller checks authorization) ---------------- */

export async function listPages() {
  return db
    .select({
      id: pages.id,
      slug: pages.slug,
      locale: pages.locale,
      kind: pages.kind,
      title: pages.title,
      status: pages.status,
      updatedAt: pages.updatedAt,
      isPublished: sql<boolean>`${pages.publishedBlocks} is not null`,
      hasUnpublishedChanges: sql<boolean>`${pages.draftBlocks} is distinct from ${pages.publishedBlocks}`,
    })
    .from(pages)
    .orderBy(pages.kind, pages.slug, pages.locale);
}

export async function getPageForAdmin(id: string) {
  const [p] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  return p ?? null;
}

export class VersionConflictError extends Error {}

export type PageMeta = { title: string; metaTitle: string; metaDescription: string; indexable: boolean };

/** Saves the draft. Throws VersionConflictError if `version` differs (someone else changed it). */
export async function saveDraft(
  id: string,
  blocks: Block[],
  meta: PageMeta,
  expectedVersion: number,
  userId: string,
) {
  return db.transaction(async (tx) => {
    const [before] = await tx.select().from(pages).where(eq(pages.id, id)).for("update");
    if (!before) throw new Error("Page not found");
    if (before.version !== expectedVersion) throw new VersionConflictError();
    const [after] = await tx
      .update(pages)
      .set({ draftBlocks: blocks, ...meta, version: before.version + 1, updatedById: userId })
      .where(eq(pages.id, id))
      .returning();
    await tx.insert(auditLog).values({
      userId,
      action: "save_draft",
      targetType: "page",
      targetId: id,
      before: { blocks: before.draftBlocks, title: before.title },
      after: { blocks, title: meta.title },
    });
    return after;
  });
}

/** Copies the draft to the published version and records it in the history. Returns what the cache tag needs. */
export async function publishPage(id: string, userId: string) {
  return db.transaction(async (tx) => {
    const [p] = await tx.select().from(pages).where(eq(pages.id, id)).for("update");
    if (!p) throw new Error("Page not found");
    await tx
      .update(pages)
      .set({ publishedBlocks: p.draftBlocks, status: "published", updatedById: userId })
      .where(eq(pages.id, id));
    await tx.insert(pageVersions).values({
      pageId: id,
      blocks: p.draftBlocks,
      meta: { title: p.title, metaTitle: p.metaTitle, metaDescription: p.metaDescription, indexable: p.indexable },
      publishedById: userId,
    });
    await tx.insert(auditLog).values({
      userId,
      action: "publish",
      targetType: "page",
      targetId: id,
      before: { blocks: p.publishedBlocks },
      after: { blocks: p.draftBlocks },
    });
    return { locale: p.locale, slug: p.slug };
  });
}

export async function listPageVersions(pageId: string) {
  return db
    .select({
      id: pageVersions.id,
      createdAt: pageVersions.createdAt,
      publishedBy: user.name,
      publishedByEmail: user.email,
    })
    .from(pageVersions)
    .leftJoin(user, eq(user.id, pageVersions.publishedById))
    .where(eq(pageVersions.pageId, pageId))
    .orderBy(desc(pageVersions.createdAt))
    .limit(30);
}

/** Restores an old published version into the draft (does not publish; an admin reviews and publishes). */
export async function restoreVersionToDraft(versionId: string, userId: string) {
  return db.transaction(async (tx) => {
    const [v] = await tx.select().from(pageVersions).where(eq(pageVersions.id, versionId)).limit(1);
    if (!v) throw new Error("Version not found");
    const [p] = await tx.select().from(pages).where(eq(pages.id, v.pageId)).for("update");
    // Old versions may still hold Turkish-keyed blocks; the draft always gets the English shape.
    const blocks = migrateLegacyBlocks(v.blocks);
    await tx
      .update(pages)
      .set({ draftBlocks: blocks, version: p.version + 1, updatedById: userId })
      .where(eq(pages.id, v.pageId));
    await tx.insert(auditLog).values({
      userId,
      action: "restore_version",
      targetType: "page",
      targetId: v.pageId,
      before: { blocks: p.draftBlocks },
      after: { blocks, versionId },
    });
    return v.pageId;
  });
}

export async function listAuditLog(limit = 100) {
  return db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      targetType: auditLog.targetType,
      targetId: auditLog.targetId,
      createdAt: auditLog.createdAt,
      userName: user.name,
      userEmail: user.email,
    })
    .from(auditLog)
    .leftJoin(user, eq(user.id, auditLog.userId))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}
