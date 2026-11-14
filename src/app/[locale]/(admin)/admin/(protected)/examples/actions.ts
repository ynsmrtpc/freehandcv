"use server";
import { adminContent as ADMIN_CONTENT, formatAdminContent } from "@/lib/adminContent";


// Example resume admin actions. Every action checks authorization itself (plan 7.5) and validates its input.
import { updateTag } from "next/cache";
import { z } from "zod";
import { EXAMPLE_CATEGORY_IDS, EXPERIENCE_LEVELS, exampleGuideSchema, exampleSlugSchema } from "@/lib/examples";
import { sampleResume } from "@/lib/resume/sample";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import {
  createExample,
  exampleTag,
  ExampleNotFoundError,
  EXAMPLES_TAG,
  ExampleSlugLockedError,
  ExampleSlugTakenError,
  setExampleActive,
  setExamplesActive,
  deleteExamples,
  updateExampleMeta,
} from "@/server/content/examples";

const metaSchema = z.object({
  slug: exampleSlugSchema,
  title: z.string().trim().min(1, ADMIN_CONTENT.examplesActionsLabel104).max(120),
  occupation: z.string().trim().min(1, ADMIN_CONTENT.examplesActionsLabel105).max(80),
  category: z.enum(EXAMPLE_CATEGORY_IDS),
  locale: z.enum(["tr", "en"]),
  experienceLevel: z.enum(EXPERIENCE_LEVELS),
  metaTitle: z.string().trim().max(70, "En fazla 70 karakter"),
  metaDescription: z.string().trim().max(170, "En fazla 170 karakter"),
  guide: exampleGuideSchema,
  sortOrder: z.int().min(0).max(10_000),
});

export type ExampleActionResult = { ok: true; id?: string } | { ok: false; error: string };

function errorResult(error: unknown): ExampleActionResult {
  if (error instanceof AuthorizationError) return { ok: false, error: ADMIN_CONTENT.examplesActionsError106 };
  if (error instanceof z.ZodError) return { ok: false, error: ADMIN_CONTENT.examplesActionsLabel107 + error.issues.map((i) => i.path.join(".")).join(", ") };
  if (error instanceof ExampleSlugTakenError) return { ok: false, error: ADMIN_CONTENT.examplesActionsError108 };
  if (error instanceof ExampleSlugLockedError)
    return { ok: false, error: ADMIN_CONTENT.examplesActionsError109 };
  if (error instanceof ExampleNotFoundError) return { ok: false, error: ADMIN_CONTENT.examplesActionsError110 };
  console.error(error);
  return { ok: false, error: ADMIN_CONTENT.examplesActionsError111 };
}

export async function createExampleAction(raw: unknown): Promise<ExampleActionResult> {
  try {
    const user = await requireAdmin();
    const meta = metaSchema.parse(raw);
    const content = sampleResume(meta.locale);
    content.personal.title = meta.occupation;
    return { ok: true, id: await createExample(meta, content, user.id) };
  } catch (error) {
    return errorResult(error);
  }
}

export async function updateExampleMetaAction(id: string, raw: unknown): Promise<ExampleActionResult> {
  try {
    const user = await requireAdmin();
    const meta = metaSchema.parse(raw);
    await updateExampleMeta(z.uuid().parse(id), meta, user.id);
    updateTag(EXAMPLES_TAG);
    updateTag(exampleTag(meta.locale, meta.slug));
    return { ok: true };
  } catch (error) {
    return errorResult(error);
  }
}

export async function setExampleActiveAction(id: string, active: boolean): Promise<ExampleActionResult> {
  try {
    const user = await requireAdmin();
    const before = await setExampleActive(z.uuid().parse(id), z.boolean().parse(active), user.id);
    updateTag(EXAMPLES_TAG);
    updateTag(exampleTag(before.locale, before.slug));
    return { ok: true };
  } catch (error) {
    return errorResult(error);
  }
}

type BulkResult = { ok: true; message?: string } | { ok: false; error: string };
const idList = z.array(z.uuid()).min(1).max(500);

async function setActive(ids: string[], active: boolean): Promise<BulkResult> {
  try {
    const user = await requireAdmin();
    const rows = await setExamplesActive(idList.parse(ids), active, user.id);
    for (const r of rows) updateTag(exampleTag(r.locale, r.slug));
    updateTag(EXAMPLES_TAG);
    const verb = active ? ADMIN_CONTENT.examplesActionsLabel112 : ADMIN_CONTENT.examplesActionsLabel113;
    return { ok: true, message: rows.length ? formatAdminContent(ADMIN_CONTENT.examplesActionsMessage114, {value0: rows.length,value1: verb}) : formatAdminContent(ADMIN_CONTENT.examplesActionsMessage117, {value0: active ? ADMIN_CONTENT.examplesActionsLabel115 : ADMIN_CONTENT.examplesActionsLabel116}) };
  } catch (error) {
    const r = errorResult(error);
    return r.ok ? { ok: true } : r;
  }
}

export async function publishExamplesAction(ids: string[]) {
  return setActive(ids, true);
}

export async function unpublishExamplesAction(ids: string[]) {
  return setActive(ids, false);
}

export async function deleteExamplesAction(ids: string[]): Promise<BulkResult> {
  try {
    const user = await requireAdmin(["admin"]);
    const rows = await deleteExamples(idList.parse(ids), user.id);
    for (const r of rows) updateTag(exampleTag(r.locale, r.slug));
    updateTag(EXAMPLES_TAG);
    return { ok: true, message: formatAdminContent(ADMIN_CONTENT.examplesActionsMessage118, {value0: rows.length}) };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, error: ADMIN_CONTENT.examplesActionsError119 };
    const r = errorResult(error);
    return r.ok ? { ok: true } : r;
  }
}
