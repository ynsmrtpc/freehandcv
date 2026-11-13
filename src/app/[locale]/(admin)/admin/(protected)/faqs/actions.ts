"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import { deleteFaqs, FAQS_TAG, faqInputSchema, importFaqsFromPages, saveFaq, setFaqsActive } from "@/server/content/faqs";

type Result = { ok: true; message?: string; id?: string } | { ok: false; error: string; issues?: Record<string, string> };
const ids = z.array(z.uuid()).min(1).max(500);

function fail(error: unknown): Result {
  if (error instanceof AuthorizationError) return { ok: false, error: "Bu işlem için yetkin yok. Yeniden giriş yap." };
  if (error instanceof z.ZodError)
    return { ok: false, error: "Bazı alanlar hatalı.", issues: Object.fromEntries(error.issues.map((i) => [String(i.path[0]), i.message])) };
  console.error(error);
  return { ok: false, error: "Beklenmeyen bir hata oluştu." };
}

export async function saveFaqAction(id: string | null, raw: unknown): Promise<Result> {
  try {
    const user = await requireAdmin();
    const saved = await saveFaq(id ? z.uuid().parse(id) : null, faqInputSchema.parse(raw), user.id);
    updateTag(FAQS_TAG);
    return { ok: true, message: "Soru kaydedildi.", id: saved };
  } catch (error) {
    return fail(error);
  }
}

export async function publishFaqsAction(list: string[]): Promise<Result> {
  try {
    const user = await requireAdmin();
    const n = await setFaqsActive(ids.parse(list), true, user.id);
    updateTag(FAQS_TAG);
    return { ok: true, message: `${n} soru yayına alındı.` };
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
    return { ok: true, message: n ? `${n} soru sayfalardan havuza aktarıldı.` : "Aktarılacak yeni soru yok; sayfalardaki sorular zaten havuzda." };
  } catch (error) {
    return fail(error);
  }
}
