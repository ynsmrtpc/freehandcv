"use server";

// Server Actions for user templates (plan 11). The user id is always read from the session; a template
// id from the client is trusted only after the access check in src/server/templates.ts.
import { z } from "zod";
import { getSession } from "@/server/authz";
import {
  applyTemplate,
  clearResumeTemplate,
  copyTemplate,
  createTemplate,
  deleteTemplate,
  listOwnTemplates,
  setTemplateVisibility,
  templateUpdate,
  updateTemplate,
  TemplateLimitError,
  TemplateNotFoundError,
  UsernameRequiredError,
  type TemplateSnapshot,
} from "@/server/templates";

export type TemplateActionError = "unauthenticated" | "not_found" | "invalid" | "limit" | "username_required" | "error";
export type TemplateActionResult<T = object> = ({ ok: true } & T) | { ok: false; reason: TemplateActionError };

const idSchema = z.uuid();
const visibilitySchema = z.enum(["private", "unlisted", "public"]);

async function currentUserId() {
  const session = await getSession();
  return session?.user.id ?? null;
}

function toError(e: unknown): TemplateActionResult<never> {
  if (e instanceof TemplateNotFoundError) return { ok: false, reason: "not_found" };
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

export async function listOwnTemplatesAction() {
  return run(async (userId) => ({ templates: await listOwnTemplates(userId) }));
}

export async function createTemplateAction(input: unknown) {
  return run(async (userId) => ({ id: await createTemplate(userId, input) }));
}

export async function updateTemplateAction(id: string, input: unknown) {
  return run(async (userId) => ({ version: await updateTemplate(idSchema.parse(id), userId, input) }));
}

export async function deleteTemplateAction(id: string) {
  return run(async (userId) => {
    await deleteTemplate(idSchema.parse(id), userId);
    return {};
  });
}

export async function setTemplateVisibilityAction(id: string, visibility: unknown) {
  return run(async (userId) => {
    await setTemplateVisibility(idSchema.parse(id), userId, visibilitySchema.parse(visibility));
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
