"use server";

// Autosave of an example resume's content from the editor (admin panel). Authorization is checked
// here, never assumed from the page the editor runs on (plan 7.5).
import { updateTag } from "next/cache";
import { z } from "zod";
import { normalizeResume } from "@/lib/resume/schema";
import { AuthorizationError, requireAdmin } from "@/server/authz";
import { exampleTag, ExampleNotFoundError, EXAMPLES_TAG, saveExampleContent } from "@/server/content/examples";
import { RESUME_MAX_BYTES } from "@/server/resumes";

export async function saveExampleContentAction(
  id: string,
  data: unknown,
): Promise<{ ok: true } | { ok: false; reason: "unauthenticated" | "not_found" | "too_large" | "error" }> {
  try {
    await requireAdmin();
    const content = normalizeResume(data);
    if (JSON.stringify(content).length > RESUME_MAX_BYTES) return { ok: false, reason: "too_large" };
    const saved = await saveExampleContent(z.uuid().parse(id), content);
    updateTag(EXAMPLES_TAG);
    updateTag(exampleTag(saved.locale, saved.slug));
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof ExampleNotFoundError || error instanceof z.ZodError) return { ok: false, reason: "not_found" };
    console.error(error);
    return { ok: false, reason: "error" };
  }
}
