import "server-only";
import { and, asc, eq, inArray, isNotNull, isNull, lt, ne } from "drizzle-orm";
import { normalizeUsername, usernameProblem, type UsernameProblem } from "@/lib/username";
import { db } from "./db";
import {
  account,
  auditLog,
  consents,
  resumes,
  resumeVersions,
  session,
  siteReviews,
  templateFavorites,
  templates,
  twoFactor,
  user,
} from "./db/schema";

// The account page's data rights (plan 9 /hesap, 13; KVKK): download everything as JSON, close the
// account. Closing anonymises the user row instead of deleting it, so consent records and the audit
// log keep pointing at an anonymous id (plan 5: "kişisel alanlar anonimleştirilir").

/** Trash lifetime (plan 5): deleted resumes are removed for good after this many days. */
export const TRASH_DAYS = 30;

/** Sign-in methods linked to the user: "credential" (e-mail + password), "google". */
export async function getSignInMethods(userId: string) {
  const rows = await db.select({ provider: account.providerId }).from(account).where(eq(account.userId, userId));
  return rows.map((r) => r.provider);
}

/** Everything stored about the user, in one JSON document. Secrets (password hash, tokens) are left out. */
export async function exportAccountData(userId: string) {
  const [u] = await db
    .select({
      email: user.email,
      name: user.name,
      username: user.username,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      uiLocale: user.uiLocale,
      employerSharing: user.employerSharing,
      sharedResumeId: user.sharedResumeId,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!u) return null;
  const [linked, resumeRows, consentRows, reviewRows, templateRows] = await Promise.all([
    db.select({ provider: account.providerId, createdAt: account.createdAt }).from(account).where(eq(account.userId, userId)),
    db
      .select({
        id: resumes.id,
        title: resumes.title,
        content: resumes.content,
        createdAt: resumes.createdAt,
        updatedAt: resumes.updatedAt,
        deletedAt: resumes.deletedAt,
      })
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(asc(resumes.createdAt)),
    db
      .select({ kind: consents.kind, granted: consents.granted, textVersion: consents.textVersion, source: consents.source, createdAt: consents.createdAt })
      .from(consents)
      .where(eq(consents.userId, userId))
      .orderBy(asc(consents.createdAt)),
    db
      .select({
        rating: siteReviews.rating,
        body: siteReviews.body,
        occupation: siteReviews.occupation,
        displayAllowed: siteReviews.displayAllowed,
        approved: siteReviews.approved,
        createdAt: siteReviews.createdAt,
      })
      .from(siteReviews)
      .where(eq(siteReviews.userId, userId)),
    db
      .select({
        name: templates.name,
        description: templates.description,
        definition: templates.definition,
        version: templates.version,
        visibility: templates.visibility,
        createdAt: templates.createdAt,
        updatedAt: templates.updatedAt,
      })
      .from(templates)
      .where(and(eq(templates.ownerId, userId), isNull(templates.deletedAt)))
      .orderBy(asc(templates.createdAt)),
  ]);
  const versions = resumeRows.length
    ? await db
        .select({
          resumeId: resumeVersions.resumeId,
          kind: resumeVersions.kind,
          label: resumeVersions.label,
          content: resumeVersions.content,
          createdAt: resumeVersions.createdAt,
        })
        .from(resumeVersions)
        .where(inArray(resumeVersions.resumeId, resumeRows.map((r) => r.id)))
        .orderBy(asc(resumeVersions.createdAt))
    : [];
  return {
    exportedAt: new Date().toISOString(),
    profile: { ...u, signInMethods: linked },
    resumes: resumeRows.map((r) => ({
      ...r,
      versions: versions
        .filter((v) => v.resumeId === r.id)
        .map((v) => ({ kind: v.kind, label: v.label, content: v.content, createdAt: v.createdAt })),
    })),
    consents: consentRows,
    reviews: reviewRows,
    templates: templateRows,
  };
}

export class UsernameTakenError extends Error {}
export class UsernameInvalidError extends Error {
  constructor(public problem: UsernameProblem) {
    super(problem);
  }
}

/** Sets the username (plan 5); unique regardless of case, because it is stored lowercase. */
export async function setUsername(userId: string, raw: string) {
  const username = normalizeUsername(raw);
  const problem = usernameProblem(username);
  if (problem) throw new UsernameInvalidError(problem);
  const taken = await db.$count(user, and(eq(user.username, username), ne(user.id, userId)));
  if (taken) throw new UsernameTakenError();
  try {
    await db.update(user).set({ username }).where(eq(user.id, userId));
  } catch (e) {
    // Two people claiming the same name at once: the unique index decides.
    if ((e as { code?: string }).code === "23505" || (e as { cause?: { code?: string } }).cause?.code === "23505")
      throw new UsernameTakenError();
    throw e;
  }
  return username;
}

export class AdminAccountError extends Error {}

/**
 * Closes the account: resumes and their versions are deleted, reviews are detached, sign-in methods
 * and sessions are removed and the user row is anonymised. An active employer-sharing consent is
 * recorded as withdrawn. Admin accounts must be demoted first (the panel must keep an owner).
 */
export async function closeAccount(userId: string) {
  await db.transaction(async (tx) => {
    const [u] = await tx
      .select({ role: user.role, employerSharing: user.employerSharing })
      .from(user)
      .where(eq(user.id, userId))
      .for("update");
    if (!u) return;
    if (u.role !== "user") throw new AdminAccountError();
    await tx.delete(resumes).where(eq(resumes.userId, userId));
    await tx.update(siteReviews).set({ userId: null }).where(eq(siteReviews.userId, userId));
    // Templates leave the gallery and can no longer be applied; resumes using them keep their copy.
    await tx
      .update(templates)
      .set({ deletedAt: new Date(), visibility: "private" })
      .where(and(eq(templates.ownerId, userId), isNull(templates.deletedAt)));
    await tx.delete(templateFavorites).where(eq(templateFavorites.userId, userId));
    if (u.employerSharing)
      await tx.insert(consents).values({
        userId,
        kind: "employer_sharing",
        granted: false,
        textVersion: "account-closed",
        source: "dashboard",
      });
    await tx.delete(session).where(eq(session.userId, userId));
    await tx.delete(account).where(eq(account.userId, userId));
    await tx.delete(twoFactor).where(eq(twoFactor.userId, userId));
    await tx
      .update(user)
      .set({
        name: "",
        email: `closed-${userId}@deleted.invalid`,
        emailVerified: false,
        image: null,
        username: null,
        twoFactorEnabled: false,
        employerSharing: false,
        sharedResumeId: null,
      })
      .where(eq(user.id, userId));
    await tx.insert(auditLog).values({ userId, action: "close_account", targetType: "user", targetId: userId });
  });
}

/** Removes resumes that have been in the trash longer than TRASH_DAYS (versions go with them). */
export async function purgeTrash(now = new Date()) {
  const cutoff = new Date(now.getTime() - TRASH_DAYS * 24 * 60 * 60 * 1000);
  const removed = await db
    .delete(resumes)
    .where(and(isNotNull(resumes.deletedAt), lt(resumes.deletedAt, cutoff)))
    .returning({ id: resumes.id });
  return removed.length;
}
