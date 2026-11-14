"use server";
import { adminContent as ADMIN_CONTENT, formatAdminContent } from "@/lib/adminContent";


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
  unpublishPages,
  deletePages,
  HomePageError,
} from "@/server/content/pages";
import { AuthorizationError, requireAdmin } from "@/server/authz";

const metaSchema = z.object({
  title: z.string().trim().min(1, ADMIN_CONTENT.examplesActionsLabel104).max(120),
  metaTitle: z.string().trim().max(70, "En fazla 70 karakter"),
  metaDescription: z.string().trim().max(170, "En fazla 170 karakter"),
  indexable: z.boolean(),
});

export type ActionResult =
  | { ok: true; version?: number }
  | { ok: false; error: string; issues?: { path: (string | number)[]; message: string }[] };

function errorResult(error: unknown): ActionResult {
  if (error instanceof AuthorizationError) return { ok: false, error: ADMIN_CONTENT.examplesActionsError106 };
  if (error instanceof VersionConflictError)
    return { ok: false, error: ADMIN_CONTENT.pagesActionsError257 };
  console.error(error);
  return { ok: false, error: ADMIN_CONTENT.examplesActionsError111 };
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
      return { ok: false, error: ADMIN_CONTENT.faqsActionsError169, issues };
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

type BulkResult = { ok: true; message?: string } | { ok: false; error: string };
const idList = z.array(z.uuid()).min(1).max(200);

function bulkError(error: unknown): BulkResult {
  if (error instanceof HomePageError) return { ok: false, error: ADMIN_CONTENT.pagesActionsError258 };
  const r = errorResult(error);
  return r.ok ? { ok: false, error: ADMIN_CONTENT.examplesActionsError111 } : { ok: false, error: r.error };
}

export async function publishPagesAction(ids: string[]): Promise<BulkResult> {
  try {
    const user = await requireAdmin();
    const list = idList.parse(ids);
    for (const id of list) {
      const { locale, slug } = await publishPage(id, user.id);
      updateTag(pageTag(locale, slug));
    }
    updateTag(PUBLISHED_PAGES_TAG);
    return { ok: true, message: formatAdminContent(ADMIN_CONTENT.pagesActionsMessage259, {value0: list.length}) };
  } catch (error) {
    return bulkError(error);
  }
}

export async function unpublishPagesAction(ids: string[]): Promise<BulkResult> {
  try {
    const user = await requireAdmin();
    const rows = await unpublishPages(idList.parse(ids), user.id);
    for (const r of rows) updateTag(pageTag(r.locale, r.slug));
    updateTag(PUBLISHED_PAGES_TAG);
    return { ok: true, message: rows.length ? formatAdminContent(ADMIN_CONTENT.pagesActionsMessage260, {value0: rows.length}) : ADMIN_CONTENT.pagesActionsLabel261 };
  } catch (error) {
    return bulkError(error);
  }
}

export async function deletePagesAction(ids: string[]): Promise<BulkResult> {
  try {
    // Deleting is admin-only; editors can unpublish.
    const user = await requireAdmin(["admin"]);
    const rows = await deletePages(idList.parse(ids), user.id);
    for (const r of rows) updateTag(pageTag(r.locale, r.slug));
    updateTag(PUBLISHED_PAGES_TAG);
    return { ok: true, message: `${rows.length} sayfa silindi.` };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, error: ADMIN_CONTENT.pagesActionsError262 };
    return bulkError(error);
  }
}
