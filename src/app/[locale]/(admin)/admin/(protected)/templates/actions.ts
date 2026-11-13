"use server";

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
    if (error instanceof AuthorizationError) return { ok: false, error: "Bu işlem için yetkin yok. Yeniden giriş yap." };
    console.error(error);
    return { ok: false, error: "Beklenmeyen bir hata oluştu." };
  }
}

export async function hideTemplatesAction(list: string[]) {
  return run(async (actor) => `${await setTemplatesHidden(ids.parse(list), true, actor)} şablon gizlendi; açık şikâyetleri kapatıldı.`);
}

export async function restoreTemplatesAction(list: string[]) {
  return run(async (actor) => `${await setTemplatesHidden(ids.parse(list), false, actor)} şablon yeniden açıldı.`);
}

export async function dismissReportsAction(list: string[]) {
  return run(async (actor) => `${await dismissReports(ids.parse(list), actor)} şikâyet kapatıldı; şablon yerinde kaldı.`);
}

export async function featureTemplatesAction(list: string[]) {
  return run(async (actor) => {
    const n = await setTemplatesFeatured(ids.parse(list), true, actor);
    return n ? `${n} şablon öne çıkarıldı; galeride resmi şablonlardan hemen sonra görünür.` : "Yalnızca galerideki (herkese açık, gizlenmemiş) şablonlar öne çıkarılabilir.";
  });
}

export async function unfeatureTemplatesAction(list: string[]) {
  return run(async (actor) => `${await setTemplatesFeatured(ids.parse(list), false, actor)} şablonun öne çıkarma işareti kaldırıldı.`);
}
