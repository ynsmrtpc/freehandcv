"use server";
import { adminContent as ADMIN_CONTENT, formatAdminContent } from "@/lib/adminContent";


import { updateTag } from "next/cache";
import { z } from "zod";
import { dismissReports, setTemplatesFeatured, setTemplatesHidden } from "@/server/admin/templates";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import { TEMPLATES_TAG } from "@/server/templates";

type Result = { ok: true; message?: string } | { ok: false; error: string };
const ids = z.array(z.uuid()).min(1).max(500);

async function run(fn: (actorId: string) => Promise<string>): Promise<Result> {
  try {
    const actor = await requireAdmin();
    const message = await fn(actor.id);
    updateTag(TEMPLATES_TAG);
    return { ok: true, message };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, error: ADMIN_CONTENT.examplesActionsError106 };
    console.error(error);
    return { ok: false, error: ADMIN_CONTENT.examplesActionsError111 };
  }
}

export async function hideTemplatesAction(list: string[]) {
  return run(async (actor) => formatAdminContent(ADMIN_CONTENT.templatesActionsMessage333, {value0: await setTemplatesHidden(ids.parse(list), true, actor)}));
}

export async function restoreTemplatesAction(list: string[]) {
  return run(async (actor) => formatAdminContent(ADMIN_CONTENT.templatesActionsMessage334, {value0: await setTemplatesHidden(ids.parse(list), false, actor)}));
}

export async function dismissReportsAction(list: string[]) {
  return run(async (actor) => formatAdminContent(ADMIN_CONTENT.templatesActionsMessage335, {value0: await dismissReports(ids.parse(list), actor)}));
}

export async function featureTemplatesAction(list: string[]) {
  return run(async (actor) => {
    const n = await setTemplatesFeatured(ids.parse(list), true, actor);
    return n ? formatAdminContent(ADMIN_CONTENT.templatesActionsMessage336, {value0: n}) : ADMIN_CONTENT.templatesActionsLabel337;
  });
}

export async function unfeatureTemplatesAction(list: string[]) {
  return run(async (actor) => formatAdminContent(ADMIN_CONTENT.templatesActionsMessage338, {value0: await setTemplatesFeatured(ids.parse(list), false, actor)}));
}
