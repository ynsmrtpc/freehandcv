"use server";
import { z } from "zod";
import { getSession } from "@/server/authz";
import { AiError, generateDraft } from "@/server/ai";

export async function generateDraftAction(input: unknown) {
  const session = await getSession();
  if (!session?.user.emailVerified) return { ok: false as const, reason: "unverified" };
  try { return { ok: true as const, data: await generateDraft(session.user.id, input) }; }
  catch (error) { return { ok: false as const, reason: error instanceof AiError ? error.code : error instanceof z.ZodError ? "invalid" : "failed" }; }
}
