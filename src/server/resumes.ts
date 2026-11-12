import "server-only";
import { and, desc, eq, isNotNull, isNull, notInArray, sql } from "drizzle-orm";
import { normalizeResume, type ResumeData } from "@/lib/resume/schema";
import { db, type Db } from "./db";
import { resumes, resumeVersions } from "./db/schema";

// Resumes in an account (plan 5). Rule: every query is filtered by `user_id = signed-in user`;
// ownership is checked here, not in the UI. Delete = trash (deleted_at is set).

/** Photos stay in the JSON as data URLs until they move to R2; the size limit is for that. */
export const RESUME_MAX_BYTES = 1_500_000;
export const RESUME_MAX_COUNT = 100;

/** Version policy (plan 5): an automatic version at most every 10 minutes, the last 50 kept; manual and PDF versions are permanent. */
export const AUTO_VERSION_INTERVAL_MS = 10 * 60 * 1000;
export const AUTO_VERSION_KEEP = 50;
export const VERSION_LABEL_MAX = 80;
const VERSION_LIST_LIMIT = 200;

export type VersionKind = "auto" | "manual" | "pdf";
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

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

async function assertOwned(tx: Tx, id: string, userId: string) {
  const [r] = await tx.select({ id: resumes.id }).from(resumes).where(ownedBy(id, userId)).limit(1);
  if (!r) throw new ResumeNotFoundError();
}

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

export async function createResume(userId: string, raw: unknown, sourceExampleId?: string) {
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
      sourceExampleId,
    })
    .returning({ id: resumes.id });
  return resume.id;
}

/**
 * Optimistic locking (plan 12): the request carries `version`; if the server's differs, throws
 * ResumeConflictError. The content being replaced becomes an automatic version (throttled).
 */
export async function saveResume(id: string, userId: string, raw: unknown, expectedVersion: number) {
  const data = validate(raw);
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({ content: resumes.content, version: resumes.version })
      .from(resumes)
      .where(ownedBy(id, userId))
      .for("update");
    if (!current) throw new ResumeNotFoundError();
    if (current.version !== expectedVersion) throw new ResumeConflictError(current.version);
    await recordVersion(tx, id, current.content, "auto", { throttle: true });
    const [updated] = await tx
      .update(resumes)
      .set({
        content: data,
        title: makeTitle(data),
        locale: data.settings.locale,
        version: expectedVersion + 1,
      })
      .where(eq(resumes.id, id))
      .returning({ version: resumes.version });
    return updated.version;
  });
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

/** The trash (plan 5): deleted resumes, newest first; the purge job removes them after 30 days. */
export async function listTrash(userId: string) {
  return db
    .select({ id: resumes.id, title: resumes.title, deletedAt: resumes.deletedAt })
    .from(resumes)
    .where(and(eq(resumes.userId, userId), isNotNull(resumes.deletedAt)))
    .orderBy(desc(resumes.deletedAt))
    .limit(RESUME_MAX_COUNT);
}

export async function restoreResume(id: string, userId: string) {
  const n = await db.$count(resumes, and(eq(resumes.userId, userId), isNull(resumes.deletedAt)));
  if (n >= RESUME_MAX_COUNT) throw new ResumeLimitError();
  const r = await db
    .update(resumes)
    .set({ deletedAt: null })
    .where(and(eq(resumes.id, id), eq(resumes.userId, userId), isNotNull(resumes.deletedAt)))
    .returning({ id: resumes.id });
  if (!r.length) throw new ResumeNotFoundError();
}

/**
 * Removes trashed resumes for good before the 30-day purge: the one with `id`, or the whole trash.
 * Only resumes already in the trash are touched; their versions go with them (cascade).
 */
export async function purgeTrashedResumes(userId: string, id?: string) {
  const removed = await db
    .delete(resumes)
    .where(and(eq(resumes.userId, userId), isNotNull(resumes.deletedAt), id ? eq(resumes.id, id) : undefined))
    .returning({ id: resumes.id });
  if (id && !removed.length) throw new ResumeNotFoundError();
  return removed.length;
}

/* ---------------- Versions ---------------- */

/**
 * Inserts a version. Unless `always`, it is skipped when the newest version of the same kind holds
 * this exact content (repeated PDF downloads), or, with `throttle`, when that one is under 10 minutes
 * old. Automatic versions beyond the newest 50 are deleted.
 */
async function recordVersion(
  tx: Tx,
  resumeId: string,
  content: unknown,
  kind: VersionKind,
  options: { label?: string | null; always?: boolean; throttle?: boolean } = {},
) {
  if (!options.always) {
    const [latest] = await tx
      .select({
        createdAt: resumeVersions.createdAt,
        same: sql<boolean>`${resumeVersions.content} = ${JSON.stringify(content)}::jsonb`,
      })
      .from(resumeVersions)
      .where(and(eq(resumeVersions.resumeId, resumeId), eq(resumeVersions.kind, kind)))
      .orderBy(desc(resumeVersions.createdAt))
      .limit(1);
    if (latest?.same) return;
    if (latest && options.throttle && Date.now() - latest.createdAt.getTime() < AUTO_VERSION_INTERVAL_MS) return;
  }
  await tx.insert(resumeVersions).values({ resumeId, content, kind, label: options.label ?? null });
  if (kind !== "auto") return;
  const newest = tx
    .select({ id: resumeVersions.id })
    .from(resumeVersions)
    .where(and(eq(resumeVersions.resumeId, resumeId), eq(resumeVersions.kind, "auto")))
    .orderBy(desc(resumeVersions.createdAt))
    .limit(AUTO_VERSION_KEEP);
  await tx
    .delete(resumeVersions)
    .where(
      and(eq(resumeVersions.resumeId, resumeId), eq(resumeVersions.kind, "auto"), notInArray(resumeVersions.id, newest)),
    );
}

/** Newest first, without content (it can be large). */
export async function listVersions(resumeId: string, userId: string) {
  return db.transaction(async (tx) => {
    await assertOwned(tx, resumeId, userId);
    const rows = await tx
      .select({
        id: resumeVersions.id,
        kind: resumeVersions.kind,
        label: resumeVersions.label,
        createdAt: resumeVersions.createdAt,
      })
      .from(resumeVersions)
      .where(eq(resumeVersions.resumeId, resumeId))
      .orderBy(desc(resumeVersions.createdAt))
      .limit(VERSION_LIST_LIMIT);
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  });
}

/** Stores what the editor shows right now: a manual version (always kept, optionally named) or a PDF version. */
export async function createVersion(
  resumeId: string,
  userId: string,
  raw: unknown,
  kind: "manual" | "pdf",
  label?: string,
) {
  const data = validate(raw);
  await db.transaction(async (tx) => {
    await assertOwned(tx, resumeId, userId);
    await recordVersion(tx, resumeId, data, kind, {
      label: kind === "manual" ? label?.trim().slice(0, VERSION_LABEL_MAX) || null : null,
      always: kind === "manual",
    });
  });
}

/**
 * Returns a version's content for the editor to load. The editor's current content is stored first
 * as an automatic version, so restoring never loses the state it replaces.
 */
export async function restoreVersion(resumeId: string, versionId: string, userId: string, currentRaw: unknown) {
  const current = validate(currentRaw);
  return db.transaction(async (tx) => {
    await assertOwned(tx, resumeId, userId);
    const [v] = await tx
      .select({ content: resumeVersions.content })
      .from(resumeVersions)
      .where(and(eq(resumeVersions.id, versionId), eq(resumeVersions.resumeId, resumeId)))
      .limit(1);
    if (!v) throw new ResumeNotFoundError();
    await recordVersion(tx, resumeId, current, "auto");
    return normalizeResume(v.content);
  });
}
