"use server";

// Server Actions for user templates (plan 11). The user id is always read from the session; a template
// id from the client is trusted only after the access check in src/server/templates.ts.
import { updateTag } from "next/cache";
import { z } from "zod";
import { TEMPLATE_IDS } from "@/lib/resume/schema";
import { getSession } from "@/server/authz";
import { listResumes, ResumeLimitError, ResumeNotFoundError } from "@/server/resumes";
import {
  applyTemplate,
  clearResumeTemplate,
  copyTemplate,
  createTemplate,
  deleteTemplate,
  isFavorite,
  listFavoriteTemplates,
  listOwnTemplates,
  setFavorite,
  startWithTemplate,
  TEMPLATES_TAG,
  setTemplateVisibility,
  templateUpdate,
  updateTemplate,
  TemplateLimitError,
  TemplateNotFoundError,
  UsernameRequiredError,
  type TemplateSnapshot,
  REPORT_REASONS,
  reportTemplate,
} from "@/server/templates";

export type TemplateActionError =
  | "unauthenticated"
  | "not_found"
  | "invalid"
  | "limit"
  | "resume_limit"
  | "username_required"
  | "error";
export type TemplateActionResult<T = object> = ({ ok: true } & T) | { ok: false; reason: TemplateActionError };

const idSchema = z.uuid();
const visibilitySchema = z.enum(["private", "unlisted", "public"]);

async function currentUserId() {
  const session = await getSession();
  return session?.user.id ?? null;
}

function toError(e: unknown): TemplateActionResult<never> {
  if (e instanceof TemplateNotFoundError || e instanceof ResumeNotFoundError) return { ok: false, reason: "not_found" };
  if (e instanceof ResumeLimitError) return { ok: false, reason: "resume_limit" };
  if (e instanceof z.ZodError) return { ok: false, reason: "invalid" };
  if (e instanceof TemplateLimitError) return { ok: false, reason: "limit" };
  if (e instanceof UsernameRequiredError) return { ok: false, reason: "username_required" };
  console.error(e);
  return { ok: false, reason: "error" };
}

async function run<T extends object>(fn: (userId: string) => Promise<T>): Promise<TemplateActionResult<T>> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    return { ok: true, ...(await fn(userId)) };
  } catch (e) {
    return toError(e);
  }
}

export type OwnTemplateItem = Awaited<ReturnType<typeof listOwnTemplates>>[number];

export type FavoriteTemplateItem = Awaited<ReturnType<typeof listFavoriteTemplates>>[number];

/** What the editor's "My templates" offers: my own templates and my favorites. */
export async function listPickerTemplatesAction() {
  return run(async (userId) => {
    const [own, favorites] = await Promise.all([listOwnTemplates(userId), listFavoriteTemplates(userId)]);
    return { own, favorites };
  });
}

export async function createTemplateAction(input: unknown) {
  return run(async (userId) => ({ id: await createTemplate(userId, input) }));
}

export async function updateTemplateAction(id: string, input: unknown) {
  return run(async (userId) => {
    const version = await updateTemplate(idSchema.parse(id), userId, input);
    updateTag(TEMPLATES_TAG);
    return { version };
  });
}

export async function deleteTemplateAction(id: string) {
  return run(async (userId) => {
    await deleteTemplate(idSchema.parse(id), userId);
    updateTag(TEMPLATES_TAG);
    return {};
  });
}

export async function setTemplateVisibilityAction(id: string, visibility: unknown) {
  return run(async (userId) => {
    await setTemplateVisibility(idSchema.parse(id), userId, visibilitySchema.parse(visibility));
    updateTag(TEMPLATES_TAG);
    return {};
  });
}

export async function copyTemplateAction(id: string) {
  return run(async (userId) => ({ id: await copyTemplate(idSchema.parse(id), userId) }));
}

/** `resumeId` is the account resume being edited (absent in the guest editor). */
export async function applyTemplateAction(
  templateId: string,
  resumeId?: string,
): Promise<TemplateActionResult<{ template: TemplateSnapshot }>> {
  return run(async (userId) => ({
    template: await applyTemplate(
      idSchema.parse(templateId),
      userId,
      resumeId === undefined ? undefined : idSchema.parse(resumeId),
    ),
  }));
}

export async function clearResumeTemplateAction(resumeId: string) {
  return run(async (userId) => {
    await clearResumeTemplate(idSchema.parse(resumeId), userId);
    return {};
  });
}

export async function templateUpdateAction(templateId: string, version: number) {
  return run(async (userId) => ({
    update: await templateUpdate(idSchema.parse(templateId), z.int().min(1).parse(version), userId),
  }));
}

export async function setFavoriteAction(templateId: string, favorite: boolean) {
  return run(async (userId) => {
    await setFavorite(userId, idSchema.parse(templateId), z.boolean().parse(favorite));
    return {};
  });
}

const refSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("system"), id: z.enum(TEMPLATE_IDS) }),
  z.object({ kind: z.literal("user"), id: z.uuid() }),
]);

/** What a template page shows to the signed-in visitor: favorite state and resumes to apply it to. */
export async function templatePageStateAction(templateId: string | null) {
  return run(async (userId) => {
    const [resumes, favorite] = await Promise.all([
      listResumes(userId),
      templateId ? isFavorite(userId, idSchema.parse(templateId)) : false,
    ]);
    return { favorite, resumes: resumes.map((r) => ({ id: r.id, title: r.title })) };
  });
}

/** "Use this template": on one of my resumes, or (without `resumeId`) on a new one. */
export async function startWithTemplateAction(ref: unknown, locale: string, resumeId?: string) {
  return run(async (userId) => ({
    resumeId: await startWithTemplate(
      userId,
      refSchema.parse(ref),
      z.enum(["tr", "en"]).catch("tr").parse(locale),
      resumeId === undefined ? undefined : idSchema.parse(resumeId),
    ),
  }));
}

const reportSchema = z.object({
  templateId: idSchema,
  reason: z.enum(REPORT_REASONS),
  details: z.string().max(1000),
});

/** Reports a shared template to the team (plan 11.5). */
export async function reportTemplateAction(raw: unknown): Promise<TemplateActionResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  const input = reportSchema.safeParse(raw);
  if (!input.success) return { ok: false, reason: "invalid" };
  try {
    await reportTemplate(userId, input.data.templateId, input.data.reason, input.data.details);
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}
