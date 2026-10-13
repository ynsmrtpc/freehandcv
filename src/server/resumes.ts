import "server-only";
import { and, desc, eq, isNull } from "drizzle-orm";
import { normalizeResume, type ResumeData } from "@/lib/resume/schema";
import { db } from "./db";
import { resumes } from "./db/schema";

// Resumes in an account (plan 5). Rule: every query is filtered by `user_id = signed-in user`;
// ownership is checked here, not in the UI. Delete = trash (deleted_at is set).

/** Photos stay in the JSON as data URLs until they move to R2; the size limit is for that. */
export const RESUME_MAX_BYTES = 1_500_000;
export const RESUME_MAX_COUNT = 100;

export class ResumeNotFoundError extends Error {}
export class ResumeConflictError extends Error {
  constructor(public serverVersion: number) {
    super("Version conflict");
  }
}
export class ResumeTooLargeError extends Error {}
export class ResumeLimitError extends Error {}

function validate(raw: unknown): ResumeData {
  const data = normalizeResume(raw);
  if (JSON.stringify(data).length > RESUME_MAX_BYTES) throw new ResumeTooLargeError();
  return data;
}

// Fallback title is stored data shown in the dashboard; kept as before.
const makeTitle = (d: ResumeData) =>
  [d.personal.name, d.personal.title].filter(Boolean).join(" — ").slice(0, 120) || "Adsız CV";

const ownedBy = (id: string, userId: string) =>
  and(eq(resumes.id, id), eq(resumes.userId, userId), isNull(resumes.deletedAt));

export async function listResumes(userId: string) {
  return db
    .select({ id: resumes.id, title: resumes.title, content: resumes.content, updatedAt: resumes.updatedAt })
    .from(resumes)
    .where(and(eq(resumes.userId, userId), isNull(resumes.deletedAt)))
    .orderBy(desc(resumes.updatedAt))
    .limit(RESUME_MAX_COUNT);
}

export async function getResume(id: string, userId: string) {
  const [resume] = await db.select().from(resumes).where(ownedBy(id, userId)).limit(1);
  if (!resume) throw new ResumeNotFoundError();
  return { ...resume, content: normalizeResume(resume.content) };
}

export async function createResume(userId: string, raw: unknown) {
  const data = validate(raw);
  const n = await db.$count(resumes, and(eq(resumes.userId, userId), isNull(resumes.deletedAt)));
  if (n >= RESUME_MAX_COUNT) throw new ResumeLimitError();
  const [resume] = await db
    .insert(resumes)
    .values({
      userId,
      title: makeTitle(data),
      content: data,
      locale: data.settings.locale,
      market: data.settings.locale === "tr" ? "tr-TR" : "en-US",
    })
    .returning({ id: resumes.id });
  return resume.id;
}

/** Optimistic locking (plan 12): the request carries `version`; if the server's differs, throws ResumeConflictError. */
export async function saveResume(id: string, userId: string, raw: unknown, expectedVersion: number) {
  const data = validate(raw);
  const [updated] = await db
    .update(resumes)
    .set({
      content: data,
      title: makeTitle(data),
      locale: data.settings.locale,
      version: expectedVersion + 1,
    })
    .where(and(ownedBy(id, userId), eq(resumes.version, expectedVersion)))
    .returning({ version: resumes.version });
  if (updated) return updated.version;
  const [current] = await db.select({ version: resumes.version }).from(resumes).where(ownedBy(id, userId)).limit(1);
  if (!current) throw new ResumeNotFoundError();
  throw new ResumeConflictError(current.version);
}

export async function duplicateResume(id: string, userId: string) {
  const resume = await getResume(id, userId);
  return createResume(userId, resume.content);
}

export async function deleteResume(id: string, userId: string) {
  const r = await db
    .update(resumes)
    .set({ deletedAt: new Date() })
    .where(ownedBy(id, userId))
    .returning({ id: resumes.id });
  if (!r.length) throw new ResumeNotFoundError();
}
