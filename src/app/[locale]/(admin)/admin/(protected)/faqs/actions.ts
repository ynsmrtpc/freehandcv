"use server";
import { adminContent as ADMIN_CONTENT, formatAdminContent } from "@/lib/adminContent";


import { updateTag } from "next/cache";
import { z } from "zod";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import { deleteFaqs, FAQS_TAG, faqInputSchema, importFaqsFromPages, saveFaq, setFaqsActive } from "@/server/content/faqs";

type Result = { ok: true; message?: string; id?: string } | { ok: false; error: string; issues?: Record<string, string> };
const ids = z.array(z.uuid()).min(1).max(500);

function fail(error: unknown): Result {
  if (error instanceof AuthorizationError) return { ok: false, error: ADMIN_CONTENT.examplesActionsError106 };
  if (error instanceof z.ZodError)
    return { ok: false, error: ADMIN_CONTENT.faqsActionsError169, issues: Object.fromEntries(error.issues.map((i) => [String(i.path[0]), i.message])) };
  console.error(error);
  return { ok: false, error: ADMIN_CONTENT.examplesActionsError111 };
}

export async function saveFaqAction(id: string | null, raw: unknown): Promise<Result> {
  try {
    const user = await requireAdmin();
    const saved = await saveFaq(id ? z.uuid().parse(id) : null, faqInputSchema.parse(raw), user.id);
    updateTag(FAQS_TAG);
    return { ok: true, message: ADMIN_CONTENT.faqsActionsMessage170, id: saved };
  } catch (error) {
    return fail(error);
  }
}

export async function publishFaqsAction(list: string[]): Promise<Result> {
  try {
    const user = await requireAdmin();
    const n = await setFaqsActive(ids.parse(list), true, user.id);
    updateTag(FAQS_TAG);
    return { ok: true, message: formatAdminContent(ADMIN_CONTENT.faqsActionsMessage171, {value0: n}) };
  } catch (error) {
    return fail(error);
  }
}

export async function unpublishFaqsAction(list: string[]): Promise<Result> {
  try {
    const user = await requireAdmin();
    const n = await setFaqsActive(ids.parse(list), false, user.id);
    updateTag(FAQS_TAG);
    return { ok: true, message: `${n} soru gizlendi.` };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteFaqsAction(list: string[]): Promise<Result> {
  try {
    const user = await requireAdmin();
    const n = await deleteFaqs(ids.parse(list), user.id);
    updateTag(FAQS_TAG);
    return { ok: true, message: `${n} soru silindi.` };
  } catch (error) {
    return fail(error);
  }
}

export async function importFaqsAction(): Promise<Result> {
  try {
    const user = await requireAdmin();
    const n = await importFaqsFromPages(user.id);
    updateTag(FAQS_TAG);
    return { ok: true, message: n ? formatAdminContent(ADMIN_CONTENT.faqsActionsMessage172, {value0: n}) : ADMIN_CONTENT.faqsActionsLabel173 };
  } catch (error) {
    return fail(error);
  }
}
