"use server";

// Server Actions for account resumes. The user id is always read from the session;
// an id sent by the client is never trusted (plan 5, 13).
import { z } from "zod";
import {
  duplicateResume,
  saveResume,
  createResume,
  deleteResume,
  ResumeNotFoundError,
  ResumeConflictError,
  ResumeTooLargeError,
  ResumeLimitError,
  listVersions,
  createVersion,
  restoreVersion,
  VERSION_LABEL_MAX,
} from "@/server/resumes";
import type { ResumeData } from "@/lib/resume/schema";
import { getSession } from "@/server/authz";

export type ResumeActionError = "unauthenticated" | "not_found" | "conflict" | "too_large" | "limit" | "error";

export type ResumeActionResult<T = object> =
  | ({ ok: true } & T)
  | { ok: false; reason: ResumeActionError; serverVersion?: number };

const idSchema = z.uuid();

async function currentUserId() {
  const session = await getSession();
  return session?.user.id ?? null;
}

function toError(e: unknown): ResumeActionResult<never> {
  if (e instanceof ResumeNotFoundError || e instanceof z.ZodError) return { ok: false, reason: "not_found" };
  if (e instanceof ResumeConflictError) return { ok: false, reason: "conflict", serverVersion: e.serverVersion };
  if (e instanceof ResumeTooLargeError) return { ok: false, reason: "too_large" };
  if (e instanceof ResumeLimitError) return { ok: false, reason: "limit" };
  console.error(e);
  return { ok: false, reason: "error" };
}

export async function createResumeAction(data: unknown): Promise<ResumeActionResult<{ id: string }>> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    return { ok: true, id: await createResume(userId, data) };
  } catch (e) {
    return toError(e);
  }
}

export async function saveResumeAction(
  id: string,
  data: unknown,
  version: number,
): Promise<ResumeActionResult<{ version: number }>> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    return { ok: true, version: await saveResume(idSchema.parse(id), userId, data, z.int().min(0).parse(version)) };
  } catch (e) {
    return toError(e);
  }
}

export async function duplicateResumeAction(id: string): Promise<ResumeActionResult<{ id: string }>> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    return { ok: true, id: await duplicateResume(idSchema.parse(id), userId) };
  } catch (e) {
    return toError(e);
  }
}

export async function deleteResumeAction(id: string): Promise<ResumeActionResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    await deleteResume(idSchema.parse(id), userId);
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}

export type ResumeVersionItem = { id: string; kind: "auto" | "manual" | "pdf"; label: string | null; createdAt: string };

export async function listVersionsAction(resumeId: string): Promise<ResumeActionResult<{ versions: ResumeVersionItem[] }>> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    return { ok: true, versions: await listVersions(idSchema.parse(resumeId), userId) };
  } catch (e) {
    return toError(e);
  }
}

export async function createVersionAction(
  resumeId: string,
  data: unknown,
  kind: "manual" | "pdf",
  label?: string,
): Promise<ResumeActionResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    await createVersion(
      idSchema.parse(resumeId),
      userId,
      data,
      z.enum(["manual", "pdf"]).parse(kind),
      z.string().max(VERSION_LABEL_MAX).optional().parse(label),
    );
    return { ok: true };
  } catch (e) {
    return toError(e);
  }
}

/** `current` is what the editor shows now; it is kept as a version before the restored one is returned. */
export async function restoreVersionAction(
  resumeId: string,
  versionId: string,
  current: unknown,
): Promise<ResumeActionResult<{ data: ResumeData }>> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, reason: "unauthenticated" };
  try {
    return { ok: true, data: await restoreVersion(idSchema.parse(resumeId), idSchema.parse(versionId), userId, current) };
  } catch (e) {
    return toError(e);
  }
}
