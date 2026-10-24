import "server-only";
import { and, desc, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { z } from "zod";
import { atsScore } from "@/lib/resume/checks";
import { designSchema, type DesignDefinition } from "@/lib/resume/design";
import type { ResumeSettings } from "@/lib/resume/schema";
import { db } from "./db";
import { resumes, templates, user } from "./db/schema";

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
