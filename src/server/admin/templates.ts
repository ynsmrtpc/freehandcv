import "server-only";
import { and, count, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { db } from "../db";
import { auditLog, templateReports, templates, user } from "../db/schema";

export const MODERATION_FILTERS = ["reported", "public", "unlisted", "hidden"] as const;
export type ModerationFilter = (typeof MODERATION_FILTERS)[number];

const openReports = db
  .select({ templateId: templateReports.templateId, n: count().as("n") })
  .from(templateReports)
  .where(eq(templateReports.status, "open"))
  .groupBy(templateReports.templateId)
  .as("open_reports");

/**
 * Community templates for moderation. Private templates are never listed unless someone reported
 * them while they were shared (the owner's private work is not the team's business).
 */
export async function listTemplatesForAdmin({ filter, search }: { filter?: ModerationFilter; search?: string }) {
  const reportCount = sql<number>`coalesce(${openReports.n}, 0)`.mapWith(Number);
  return db
    .select({
      id: templates.id,
      name: templates.name,
      visibility: templates.visibility,
      status: templates.status,
      usageCount: templates.usageCount,
      updatedAt: templates.updatedAt,
      ownerUsername: user.username,
      ownerEmail: user.email,
      ownerId: templates.ownerId,
      openReports: reportCount,
    })
    .from(templates)
    .innerJoin(user, eq(user.id, templates.ownerId))
    .leftJoin(openReports, eq(openReports.templateId, templates.id))
    .where(
      and(
        isNull(templates.deletedAt),
        eq(templates.official, false),
        or(inArray(templates.visibility, ["public", "unlisted"]), sql`${openReports.n} > 0`),
        filter === "reported" ? sql`${openReports.n} > 0` : undefined,
        filter === "public" ? and(eq(templates.visibility, "public"), eq(templates.status, "active")) : undefined,
        filter === "unlisted" ? eq(templates.visibility, "unlisted") : undefined,
        filter === "hidden" ? eq(templates.status, "hidden") : undefined,
        search ? or(ilike(templates.name, `%${search}%`), ilike(user.username, `%${search}%`)) : undefined,
      ),
    )
    .orderBy(desc(reportCount), desc(templates.updatedAt))
    .limit(500);
}

export async function countOpenReports() {
  const [r] = await db.select({ n: count() }).from(templateReports).where(eq(templateReports.status, "open"));
  return r.n;
}

export async function getTemplateForModeration(id: string) {
  const [t] = await db
    .select({
      id: templates.id,
      name: templates.name,
      description: templates.description,
      definition: templates.definition,
      visibility: templates.visibility,
      status: templates.status,
      usageCount: templates.usageCount,
      createdAt: templates.createdAt,
      updatedAt: templates.updatedAt,
      ownerId: templates.ownerId,
      ownerUsername: user.username,
      ownerEmail: user.email,
    })
    .from(templates)
    .innerJoin(user, eq(user.id, templates.ownerId))
    .where(and(eq(templates.id, id), isNull(templates.deletedAt), eq(templates.official, false)));
  if (!t) return null;
  const reports = await db
    .select({
      id: templateReports.id,
      reason: templateReports.reason,
      details: templateReports.details,
      status: templateReports.status,
      createdAt: templateReports.createdAt,
      reporter: user.username,
      reporterEmail: user.email,
    })
    .from(templateReports)
    .leftJoin(user, eq(user.id, templateReports.userId))
    .where(eq(templateReports.templateId, id))
    .orderBy(desc(templateReports.createdAt));
  // Never moderate private work that was not reported.
  if (t.visibility === "private" && !reports.length) return null;
  return { ...t, reports };
}

/** Hides templates from the gallery and their pages, or brings them back. Closes their open reports when hiding. */
export async function setTemplatesHidden(ids: string[], hidden: boolean, actorId: string) {
  return db.transaction(async (tx) => {
    const rows = await tx
      .update(templates)
      .set({ status: hidden ? "hidden" : "active" })
      .where(and(inArray(templates.id, ids), eq(templates.official, false)))
      .returning({ id: templates.id });
    if (hidden && rows.length)
      await tx.update(templateReports).set({ status: "closed" }).where(and(inArray(templateReports.templateId, ids), eq(templateReports.status, "open")));
    if (rows.length)
      await tx
        .insert(auditLog)
        .values(rows.map((r) => ({ userId: actorId, action: hidden ? "hide_template" : "restore_template", targetType: "template", targetId: r.id })));
    return rows.length;
  });
}

/** Closes the open reports without hiding the template ("no action needed"). */
export async function dismissReports(templateIds: string[], actorId: string) {
  const rows = await db
    .update(templateReports)
    .set({ status: "closed" })
    .where(and(inArray(templateReports.templateId, templateIds), eq(templateReports.status, "open")))
    .returning({ templateId: templateReports.templateId });
  const touched = [...new Set(rows.map((r) => r.templateId))];
  if (touched.length)
    await db.insert(auditLog).values(touched.map((id) => ({ userId: actorId, action: "dismiss_reports", targetType: "template", targetId: id })));
  return rows.length;
}
