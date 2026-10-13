"use server";

// Page editor actions. Every action checks authorization itself (plan 7.5: the layout alone is
// not trusted) and validates its input with Zod.
import { updateTag } from "next/cache";
import { z } from "zod";
import { blockListSchema, type Block } from "@/lib/blocks";
import {
  PUBLISHED_PAGES_TAG,
  pageTag,
  restoreVersionToDraft,
  VersionConflictError,
  saveDraft,
  publishPage,
} from "@/server/content/pages";
import { AuthorizationError, requireAdmin } from "@/server/authz";

const metaSchema = z.object({
  title: z.string().trim().min(1, "Başlık boş olamaz").max(120),
  metaTitle: z.string().trim().max(70, "En fazla 70 karakter"),
  metaDescription: z.string().trim().max(170, "En fazla 170 karakter"),
  indexable: z.boolean(),
});

export type ActionResult =
  | { ok: true; version?: number }
  | { ok: false; error: string; issues?: { path: (string | number)[]; message: string }[] };

function errorResult(error: unknown): ActionResult {
  if (error instanceof AuthorizationError) return { ok: false, error: "Bu işlem için yetkin yok. Yeniden giriş yap." };
  if (error instanceof VersionConflictError)
    return { ok: false, error: "Sayfa başka bir sekmede ya da başka biri tarafından değiştirilmiş. Sayfayı yenile." };
  console.error(error);
  return { ok: false, error: "Beklenmeyen bir hata oluştu." };
}

export async function saveDraftAction(
  id: string,
  rawBlocks: unknown,
  rawMeta: unknown,
  version: number,
): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    const blocks = blockListSchema.safeParse(rawBlocks);
    const meta = metaSchema.safeParse(rawMeta);
    if (!blocks.success || !meta.success) {
      const issues = [
        ...(blocks.error?.issues.map((i) => ({ path: ["blocks", ...(i.path as (string | number)[])], message: i.message })) ?? []),
        ...(meta.error?.issues.map((i) => ({ path: ["meta", ...(i.path as (string | number)[])], message: i.message })) ?? []),
      ];
      return { ok: false, error: "Bazı alanlar hatalı.", issues };
    }
    const saved = await saveDraft(id, blocks.data as Block[], meta.data, version, user.id);
    return { ok: true, version: saved.version };
  } catch (error) {
    return errorResult(error);
  }
}

export async function publishAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    const { locale, slug } = await publishPage(id, user.id);
    // Only this page's cache is refreshed; the next visitor sees the new content.
    updateTag(pageTag(locale, slug));
    updateTag(PUBLISHED_PAGES_TAG);
    return { ok: true };
  } catch (error) {
    return errorResult(error);
  }
}

export async function restoreVersionAction(versionId: string): Promise<ActionResult> {
  try {
    const user = await requireAdmin();
    await restoreVersionToDraft(z.uuid().parse(versionId), user.id);
    return { ok: true };
  } catch (error) {
    return errorResult(error);
  }
}
