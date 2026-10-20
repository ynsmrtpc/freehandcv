"use server";

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
  updateExampleMeta,
} from "@/server/content/examples";

const metaSchema = z.object({
  slug: exampleSlugSchema,
  title: z.string().trim().min(1, "Başlık boş olamaz").max(120),
  occupation: z.string().trim().min(1, "Meslek boş olamaz").max(80),
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
  if (error instanceof AuthorizationError) return { ok: false, error: "Bu işlem için yetkin yok. Yeniden giriş yap." };
  if (error instanceof z.ZodError) return { ok: false, error: "Bazı alanlar hatalı: " + error.issues.map((i) => i.path.join(".")).join(", ") };
  if (error instanceof ExampleSlugTakenError) return { ok: false, error: "Bu dilde aynı adresli bir örnek zaten var." };
  if (error instanceof ExampleSlugLockedError)
    return { ok: false, error: "Yayındaki örneğin adresi ve dili değiştirilemez; önce yayından kaldır." };
  if (error instanceof ExampleNotFoundError) return { ok: false, error: "Örnek bulunamadı." };
  console.error(error);
  return { ok: false, error: "Beklenmeyen bir hata oluştu." };
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
