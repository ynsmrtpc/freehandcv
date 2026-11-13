import "server-only";
import { and, desc, eq, inArray, isNotNull, isNull, ne, or, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { atsScore } from "@/lib/resume/checks";
import { designSchema, switchTemplateColor, systemDefinition, type DesignDefinition } from "@/lib/resume/design";
import { sampleResume } from "@/lib/resume/sample";
import type { ResumeSettings } from "@/lib/resume/schema";
import type { TemplateRef } from "@/lib/templates";
import { db } from "./db";
import { templateReports, resumes, templateFavorites, templates, user } from "./db/schema";
import { createResume, getResume, saveResume } from "./resumes";

// User templates (plan 11). Access is decided here, never on screen: a template id coming from the
// client is only trusted after `usable()` (plan 11.2). Delete = deleted_at (like resumes).

export const TEMPLATE_MAX_COUNT = 50;
export const TEMPLATE_NAME_MAX = 60;
export const TEMPLATE_DESCRIPTION_MAX = 300;

export type Visibility = "private" | "unlisted" | "public";
export type TemplateSnapshot = NonNullable<ResumeSettings["customTemplate"]>;

export class TemplateNotFoundError extends Error {}
export class TemplateLimitError extends Error {}
/** Making a template public needs a username: it is shown as the owner in the gallery (plan 11.2). */
export class UsernameRequiredError extends Error {}

export const templateInputSchema = z.object({
  name: z.string().trim().min(1).max(TEMPLATE_NAME_MAX),
  description: z.string().trim().max(TEMPLATE_DESCRIPTION_MAX).default(""),
  definition: designSchema,
});
export type TemplateInput = z.input<typeof templateInputSchema>;

const live = isNull(templates.deletedAt);
const ownedBy = (id: string, userId: string) => and(eq(templates.id, id), eq(templates.ownerId, userId), live);
/** The plan 11.2 rule: mine, or shared (unlisted/public) and active. */
const usable = (userId: string) =>
  and(
    live,
    or(
      eq(templates.ownerId, userId),
      and(inArray(templates.visibility, ["unlisted", "public"]), eq(templates.status, "active")),
    ),
  );

const summary = {
  id: templates.id,
  name: templates.name,
  description: templates.description,
  definition: templates.definition,
  version: templates.version,
  visibility: templates.visibility,
  status: templates.status,
  atsScore: templates.atsScore,
  usageCount: templates.usageCount,
  ratingSum: templates.ratingSum,
  ratingCount: templates.ratingCount,
  updatedAt: templates.updatedAt,
};

function parse<T extends { definition: unknown }>(row: T) {
  return { ...row, definition: designSchema.parse(row.definition) };
}

export async function listOwnTemplates(userId: string) {
  const rows = await db
    .select(summary)
    .from(templates)
    .where(and(eq(templates.ownerId, userId), live))
    .orderBy(desc(templates.updatedAt))
    .limit(TEMPLATE_MAX_COUNT);
  return rows.map(parse);
}

export async function getOwnTemplate(id: string, userId: string) {
  const [row] = await db
    .select({ ...summary, sourceTemplateId: templates.sourceTemplateId })
    .from(templates)
    .where(ownedBy(id, userId))
    .limit(1);
  if (!row) throw new TemplateNotFoundError();
  return parse(row);
}

export async function createTemplate(userId: string, raw: unknown, sourceTemplateId?: string) {
  const input = templateInputSchema.parse(raw);
  const n = await db.$count(templates, and(eq(templates.ownerId, userId), live));
  if (n >= TEMPLATE_MAX_COUNT) throw new TemplateLimitError();
  const [row] = await db
    .insert(templates)
    .values({
      ownerId: userId,
      name: input.name,
      description: input.description || null,
      definition: input.definition,
      atsScore: atsScore(input.definition),
      sourceTemplateId,
    })
    .returning({ id: templates.id });
  return row.id;
}

/** Every saved change is a new version; resumes using the template see "a new version is available". */
export async function updateTemplate(id: string, userId: string, raw: unknown) {
  const input = templateInputSchema.parse(raw);
  const [row] = await db
    .update(templates)
    .set({
      name: input.name,
      description: input.description || null,
      definition: input.definition,
      atsScore: atsScore(input.definition),
      version: sql`${templates.version} + 1`,
    })
    .where(ownedBy(id, userId))
    .returning({ version: templates.version });
  if (!row) throw new TemplateNotFoundError();
  return row.version;
}

/** Resumes keep their copy of the definition (plan 11.2); only new applications stop. */
export async function deleteTemplate(id: string, userId: string) {
  const r = await db
    .update(templates)
    .set({ deletedAt: new Date() })
    .where(ownedBy(id, userId))
    .returning({ id: templates.id });
  if (!r.length) throw new TemplateNotFoundError();
}

export async function setTemplateVisibility(id: string, userId: string, visibility: Visibility) {
  if (visibility === "public") {
    const [owner] = await db.select({ username: user.username }).from(user).where(eq(user.id, userId)).limit(1);
    if (!owner?.username) throw new UsernameRequiredError();
  }
  const r = await db
    .update(templates)
    .set({
      visibility,
      // The first time it goes public is its gallery date ("newest" sort).
      ...(visibility === "public" ? { publishedAt: sql`coalesce(${templates.publishedAt}, now())` } : {}),
    })
    .where(ownedBy(id, userId))
    .returning({ id: templates.id });
  if (!r.length) throw new TemplateNotFoundError();
}

async function getUsable(id: string, userId: string) {
  const [row] = await db
    .select({ id: templates.id, name: templates.name, version: templates.version, definition: templates.definition })
    .from(templates)
    .where(and(eq(templates.id, id), usable(userId)))
    .limit(1);
  if (!row) throw new TemplateNotFoundError();
  return { ...row, definition: designSchema.parse(row.definition) as DesignDefinition };
}

/**
 * The copy a resume stores when the template is applied (plan 11.2). With `resumeId`, the resume's
 * template reference is updated too (for "new version available"). Usage counts once per resume.
 */
export async function applyTemplate(templateId: string, userId: string, resumeId?: string): Promise<TemplateSnapshot> {
  const t = await getUsable(templateId, userId);
  await db.transaction(async (tx) => {
    let counted = true;
    if (resumeId) {
      const [previous] = await tx
        .select({ templateId: resumes.templateId })
        .from(resumes)
        .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId), isNull(resumes.deletedAt)))
        .for("update");
      counted = !!previous && previous.templateId !== t.id;
      if (previous)
        await tx
          .update(resumes)
          .set({ templateId: t.id })
          .where(eq(resumes.id, resumeId));
    }
    if (counted)
      await tx
        .update(templates)
        .set({ usageCount: sql`${templates.usageCount} + 1` })
        .where(eq(templates.id, t.id));
  });
  return { id: t.id, version: t.version, name: t.name.slice(0, TEMPLATE_NAME_MAX), definition: t.definition };
}

/** Back to a system template: the resume no longer references a user template. */
export async function clearResumeTemplate(resumeId: string, userId: string) {
  await db
    .update(resumes)
    .set({ templateId: null })
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));
}

/** Newer version of an applied template, if the user may still use it. */
export async function templateUpdate(templateId: string, version: number, userId: string) {
  const t = await getUsable(templateId, userId).catch((e) => {
    if (e instanceof TemplateNotFoundError) return null;
    throw e;
  });
  return t && t.version > version ? { version: t.version } : null;
}

/** Copy and edit (plan 11.2): a private copy in my account that remembers where it came from. */
export async function copyTemplate(id: string, userId: string) {
  const t = await getUsable(id, userId);
  return createTemplate(
    userId,
    { name: t.name.slice(0, TEMPLATE_NAME_MAX), description: "", definition: t.definition },
    t.id,
  );
}

/* ---------------- Using a template from its page ---------------- */

/**
 * "Use this template" (plan 11.2): applies a system or user template to one of my resumes, or to a
 * new resume started from the sample. Returns the resume id to open in the editor.
 */
export async function startWithTemplate(userId: string, ref: TemplateRef, locale: string, resumeId?: string) {
  // Checked before a new resume is created, so a refused template leaves nothing behind.
  if (ref.kind === "user") await getUsable(ref.id, userId);
  const id = resumeId ?? (await createResume(userId, sampleResume(locale)));
  const resume = await getResume(id, userId);
  const data = resume.content;
  if (ref.kind === "system") {
    await clearResumeTemplate(id, userId);
    switchTemplateColor(data, systemDefinition(ref.id));
    data.settings.template = ref.id;
    data.settings.customTemplate = null;
  } else {
    const snapshot = await applyTemplate(ref.id, userId, id);
    switchTemplateColor(data, snapshot.definition);
    data.settings.customTemplate = snapshot;
  }
  await saveResume(id, userId, data, resume.version);
  return id;
}

/* ---------------- Favorites ---------------- */

/** Favorites of templates I may use; my own templates are not favorited (they are already mine). */
export async function setFavorite(userId: string, templateId: string, favorite: boolean) {
  if (!favorite) {
    await db
      .delete(templateFavorites)
      .where(and(eq(templateFavorites.userId, userId), eq(templateFavorites.templateId, templateId)));
    return;
  }
  const [t] = await db
    .select({ ownerId: templates.ownerId })
    .from(templates)
    .where(and(eq(templates.id, templateId), usable(userId)))
    .limit(1);
  if (!t) throw new TemplateNotFoundError();
  if (t.ownerId === userId) return;
  await db.insert(templateFavorites).values({ userId, templateId }).onConflictDoNothing();
}

export async function isFavorite(userId: string, templateId: string) {
  return (
    (await db.$count(templateFavorites, and(eq(templateFavorites.userId, userId), eq(templateFavorites.templateId, templateId)))) > 0
  );
}

/** My favorites that I can still use (hidden or deleted ones drop out). */
export async function listFavoriteTemplates(userId: string) {
  const rows = await db
    .select({ ...summary, ownerUsername: user.username })
    .from(templateFavorites)
    .innerJoin(templates, eq(templates.id, templateFavorites.templateId))
    .leftJoin(user, eq(user.id, templates.ownerId))
    .where(and(eq(templateFavorites.userId, userId), usable(userId), ne(templates.ownerId, userId)))
    .orderBy(desc(templateFavorites.createdAt))
    .limit(TEMPLATE_MAX_COUNT);
  return rows.map(parse);
}

/* ---------------- Public pages (cached) ---------------- */

/** Tag of everything public about user templates: gallery, template pages, profiles. */
export const TEMPLATES_TAG = "templates";

export type SharedTemplate = {
  id: string;
  name: string;
  description: string | null;
  definition: DesignDefinition;
  visibility: Visibility;
  atsScore: number;
  usageCount: number;
  ratingSum: number;
  ratingCount: number;
  ownerUsername: string | null;
  /** Featured by the team (the `official` column); shown first in the gallery. */
  featured: boolean;
  publishedAt: string | null;
  updatedAt: string;
};

const shared = {
  id: templates.id,
  name: templates.name,
  description: templates.description,
  definition: templates.definition,
  visibility: templates.visibility,
  atsScore: templates.atsScore,
  usageCount: templates.usageCount,
  ratingSum: templates.ratingSum,
  ratingCount: templates.ratingCount,
  ownerUsername: user.username,
  featured: templates.official,
  publishedAt: templates.publishedAt,
  updatedAt: templates.updatedAt,
};
const visible = (...visibility: Visibility[]) =>
  and(live, eq(templates.status, "active"), inArray(templates.visibility, visibility));

function toShared(row: {
  definition: unknown;
  atsScore: number | null;
  publishedAt: Date | null;
  updatedAt: Date;
} & Omit<SharedTemplate, "definition" | "atsScore" | "publishedAt" | "updatedAt">): SharedTemplate | null {
  const definition = designSchema.safeParse(row.definition);
  if (!definition.success) return null;
  return {
    ...row,
    definition: definition.data,
    atsScore: row.atsScore ?? atsScore(definition.data),
    publishedAt: row.publishedAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

const GALLERY_LIMIT = 500;

/** The community part of the gallery (plan 11.4): public, active templates whose owner has a username. */
export async function getPublicTemplates(): Promise<SharedTemplate[]> {
  "use cache";
  cacheTag(TEMPLATES_TAG);
  try {
    const rows = await db
      .select(shared)
      .from(templates)
      .innerJoin(user, eq(user.id, templates.ownerId))
      .where(and(visible("public"), isNotNull(user.username)))
      .orderBy(desc(templates.official), desc(templates.usageCount), desc(templates.publishedAt))
      .limit(GALLERY_LIMIT);
    return rows.map(toShared).filter((t) => t !== null);
  } catch (error) {
    console.error("getPublicTemplates: database unreachable", error);
    cacheLife("seconds");
    return [];
  }
}

/** A template page: public ones are indexed, unlisted ones open only for those with the link. */
export async function getSharedTemplate(id: string): Promise<SharedTemplate | null> {
  "use cache";
  cacheTag(TEMPLATES_TAG);
  const [row] = await db
    .select(shared)
    .from(templates)
    .leftJoin(user, eq(user.id, templates.ownerId))
    .where(and(eq(templates.id, id), visible("public", "unlisted")))
    .limit(1);
  return row ? toShared(row) : null;
}

/** A profile page (plan 6.2 /kullanici/[kullanici-adi]): the owner's public templates only, never resumes. */
export async function getProfile(username: string) {
  "use cache";
  cacheTag(TEMPLATES_TAG);
  const [owner] = await db.select({ id: user.id, username: user.username }).from(user).where(eq(user.username, username)).limit(1);
  if (!owner) return null;
  const rows = await db
    .select(shared)
    .from(templates)
    .innerJoin(user, eq(user.id, templates.ownerId))
    .where(and(eq(templates.ownerId, owner.id), visible("public")))
    .orderBy(desc(templates.publishedAt))
    .limit(TEMPLATE_MAX_COUNT);
  return { username: owner.username!, templates: rows.map(toShared).filter((t) => t !== null) };
}

export const REPORT_REASONS = ["inappropriate", "copyright", "spam", "other"] as const;
export type ReportReason = (typeof REPORT_REASONS)[number];

/**
 * A signed-in user reports a shared template (plan 11.5). One open report per person and template;
 * reporting again is accepted silently. Own templates cannot be reported.
 */
export async function reportTemplate(userId: string, templateId: string, reason: ReportReason, details: string) {
  const [t] = await db
    .select({ ownerId: templates.ownerId })
    .from(templates)
    .where(and(eq(templates.id, templateId), visible("public", "unlisted")));
  if (!t || t.ownerId === userId) throw new TemplateNotFoundError();
  const [existing] = await db
    .select({ id: templateReports.id })
    .from(templateReports)
    .where(and(eq(templateReports.templateId, templateId), eq(templateReports.userId, userId), eq(templateReports.status, "open")));
  if (existing) return;
  await db.insert(templateReports).values({ templateId, userId, reason, details: details.trim().slice(0, 1000) || null });
}
