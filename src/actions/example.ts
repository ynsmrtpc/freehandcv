"use server";

// "Start from this example" (plan 6.4). Signed in: a new resume is created in the account.
// Guest: the content is returned and the editor keeps it in the browser.
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { exampleSlugSchema } from "@/lib/examples";
import type { ResumeData } from "@/lib/resume/schema";
import { getSession } from "@/server/authz";
import { startFromExample } from "@/server/content/examples";
import { createResume, ResumeLimitError } from "@/server/resumes";

export type StartFromExampleResult =
  | { ok: true; kind: "account"; id: string }
  | { ok: true; kind: "guest"; data: ResumeData }
  | { ok: false; reason: "not_found" | "limit" | "error" };

export async function startFromExampleAction(locale: string, slug: string): Promise<StartFromExampleResult> {
  const parsed = exampleSlugSchema.safeParse(slug);
  if (!hasLocale(routing.locales, locale) || !parsed.success) return { ok: false, reason: "not_found" };
  try {
    const example = await startFromExample(locale, parsed.data);
    if (!example) return { ok: false, reason: "not_found" };
    const session = await getSession();
    if (!session) return { ok: true, kind: "guest", data: example.content };
    return { ok: true, kind: "account", id: await createResume(session.user.id, example.content, example.id) };
  } catch (error) {
    if (error instanceof ResumeLimitError) return { ok: false, reason: "limit" };
    console.error(error);
    return { ok: false, reason: "error" };
  }
}
