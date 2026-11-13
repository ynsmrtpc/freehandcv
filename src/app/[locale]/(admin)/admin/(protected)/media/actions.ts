"use server";

import { z } from "zod";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import { deleteMedia, mediaKeys, mediaUsage, updateAltText } from "@/server/media";

type Result = { ok: true; message?: string } | { ok: false; error: string };
const ids = z.array(z.uuid()).min(1).max(500);

function fail(error: unknown): Result {
  if (error instanceof AuthorizationError) return { ok: false, error: "Bu işlem için yetkin yok. Yeniden giriş yap." };
  console.error(error);
  return { ok: false, error: "Beklenmeyen bir hata oluştu." };
}

export async function updateAltTextAction(id: string, altText: string): Promise<Result> {
  try {
    const user = await requireAdmin();
    await updateAltText(z.uuid().parse(id), z.string().max(300).parse(altText), user.id);
    return { ok: true, message: "Alternatif metin kaydedildi." };
  } catch (error) {
    return fail(error);
  }
}

/** Deletes files; refuses while a selected file is still referenced by a page or the settings. */
export async function deleteMediaAction(list: string[]): Promise<Result> {
  try {
    const user = await requireAdmin();
    const parsed = ids.parse(list);
    const usage = await mediaUsage(await mediaKeys(parsed));
    const used = Object.values(usage).filter((u) => u.length).length;
    if (used) return { ok: false, error: `${used} dosya hâlâ bir sayfada ya da site ayarlarında kullanılıyor; önce oradan kaldır.` };
    const n = await deleteMedia(parsed, user.id);
    return { ok: true, message: `${n} dosya silindi.` };
  } catch (error) {
    return fail(error);
  }
}
