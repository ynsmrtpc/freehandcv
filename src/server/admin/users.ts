import "server-only";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { and, count, desc, eq, ilike, inArray, isNull, max, ne, notInArray, notLike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { closeAccount } from "../account";
import { db } from "../db";
import { account, auditLog, resumes, roles, session, templates, user, type Role } from "../db/schema";

// Closed accounts keep an anonymised row (KVKK); they are not listed.
const CLOSED_EMAIL = "closed-%@deleted.invalid";
export const USER_STATUSES = ["active", "suspended", "no-2fa"] as const;
export type UserStatusFilter = (typeof USER_STATUSES)[number];

export class LastAdminError extends Error {}
export class SelfActionError extends Error {}
export class StaffAccountError extends Error {}
export class EmailTakenError extends Error {}

/** User list for the admin area. Resume content is never returned (plan 7.3, KVKK). */
export async function listUsers({
  search = "",
  role,
  status,
  page = 0,
  pageSize = 50,
}: { search?: string; role?: Role; status?: UserStatusFilter; page?: number; pageSize?: number } = {}) {
  const condition = and(
    notLike(user.email, CLOSED_EMAIL),
    search
      ? or(ilike(user.email, `%${search}%`), ilike(user.name, `%${search}%`), ilike(user.username, `%${search}%`))
      : undefined,
    role ? eq(user.role, role) : undefined,
    status === "suspended" ? eq(user.banned, true) : status === "active" ? eq(user.banned, false) : undefined,
    status === "no-2fa" ? and(ne(user.role, "user"), or(isNull(user.twoFactorEnabled), eq(user.twoFactorEnabled, false))) : undefined,
  );
  const resumeCounts = db
    .select({ userId: resumes.userId, n: count().as("n") })
    .from(resumes)
    .where(isNull(resumes.deletedAt))
    .groupBy(resumes.userId)
    .as("resume_counts");
  const lastSeen = db
    .select({ userId: session.userId, at: max(session.updatedAt).as("at") })
    .from(session)
    .groupBy(session.userId)
    .as("last_seen");
  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        banned: user.banned,
        twoFactorEnabled: user.twoFactorEnabled,
        emailVerified: user.emailVerified,
        employerSharing: user.employerSharing,
        createdAt: user.createdAt,
        lastSeenAt: lastSeen.at,
        resumeCount: sql<number>`coalesce(${resumeCounts.n}, 0)`.mapWith(Number),
      })
      .from(user)
      .leftJoin(resumeCounts, eq(resumeCounts.userId, user.id))
      .leftJoin(lastSeen, eq(lastSeen.userId, user.id))
      .where(condition)
      .orderBy(desc(user.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db.select({ n: count() }).from(user).where(condition),
  ]);
  return { rows, total: total.n };
}

/** One user's record for the detail page: profile, access and counts — never resume content. */
export async function getUserForAdmin(id: string) {
  const [u] = await db
    .select({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      banned: user.banned,
      bannedAt: user.bannedAt,
      banReason: user.banReason,
      twoFactorEnabled: user.twoFactorEnabled,
      emailVerified: user.emailVerified,
      employerSharing: user.employerSharing,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(and(eq(user.id, id), notLike(user.email, CLOSED_EMAIL)));
  if (!u) return null;
  const [[resumeCount], [templateCount], sessions, methods, history] = await Promise.all([
    db.select({ n: count() }).from(resumes).where(and(eq(resumes.userId, id), isNull(resumes.deletedAt))),
    db.select({ n: count() }).from(templates).where(and(eq(templates.ownerId, id), isNull(templates.deletedAt))),
    db
      .select({ id: session.id, updatedAt: session.updatedAt, userAgent: session.userAgent, ipAddress: session.ipAddress })
      .from(session)
      .where(eq(session.userId, id))
      .orderBy(desc(session.updatedAt)),
    db.select({ providerId: account.providerId }).from(account).where(eq(account.userId, id)),
    db
      .select({ id: auditLog.id, action: auditLog.action, createdAt: auditLog.createdAt, actorId: auditLog.userId })
      .from(auditLog)
      .where(and(eq(auditLog.targetType, "user"), eq(auditLog.targetId, id)))
      .orderBy(desc(auditLog.createdAt))
      .limit(20),
  ]);
  return {
    ...u,
    resumeCount: resumeCount.n,
    templateCount: templateCount.n,
    sessions,
    signInMethods: methods.map((m) => m.providerId),
    history,
  };
}

const emailSchema = z.email().transform((e) => e.trim().toLowerCase());
const passwordSchema = z.string().min(10).max(128);

async function log(actorId: string, action: string, targetId: string, before?: unknown, after?: unknown) {
  await db.insert(auditLog).values({ userId: actorId, action, targetType: "user", targetId, before: before ?? null, after: after ?? null });
}

/** Creates an email/password account. The person can change the password after signing in. */
export async function createUser(
  input: { email: string; name: string; password: string; role: Role },
  actorId: string,
) {
  const email = emailSchema.parse(input.email);
  const password = passwordSchema.parse(input.password);
  const role = z.enum(roles).parse(input.role);
  const [taken] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
  if (taken) throw new EmailTakenError();
  const id = randomUUID();
  const hashed = await hashPassword(password);
  await db.transaction(async (tx) => {
    await tx.insert(user).values({ id, email, name: input.name.trim().slice(0, 100), emailVerified: true, role });
    await tx.insert(account).values({ id: randomUUID(), userId: id, providerId: "credential", accountId: id, password: hashed });
    await tx.insert(auditLog).values({ userId: actorId, action: "create_user", targetType: "user", targetId: id, after: { email, role } });
  });
  return id;
}

export async function updateUserProfile(id: string, input: { name: string; email: string }, actorId: string) {
  const email = emailSchema.parse(input.email);
  const name = input.name.trim().slice(0, 100);
  const [before] = await db.select({ name: user.name, email: user.email }).from(user).where(eq(user.id, id));
  if (!before) throw new Error("User not found");
  if (email !== before.email) {
    const [taken] = await db.select({ id: user.id }).from(user).where(and(eq(user.email, email), ne(user.id, id)));
    if (taken) throw new EmailTakenError();
  }
  await db.update(user).set({ name, email, ...(email !== before.email ? { emailVerified: false } : {}) }).where(eq(user.id, id));
  await log(actorId, "update_user", id, before, { name, email });
}

export async function changeRole(targetId: string, newRole: Role, actorId: string) {
  if (!roles.includes(newRole)) throw new Error("Invalid role");
  await db.transaction(async (tx) => {
    const [before] = await tx.select({ role: user.role }).from(user).where(eq(user.id, targetId)).for("update");
    if (!before) throw new Error("User not found");
    // The last admin cannot be demoted (the panel must never be left without an owner).
    if (before.role === "admin" && newRole !== "admin") {
      const [others] = await tx
        .select({ n: count() })
        .from(user)
        .where(and(eq(user.role, "admin"), ne(user.id, targetId), eq(user.banned, false)));
      if (others.n === 0) throw new LastAdminError();
    }
    await tx.update(user).set({ role: newRole }).where(eq(user.id, targetId));
    await tx.insert(auditLog).values({
      userId: actorId,
      action: "change_role",
      targetType: "user",
      targetId,
      before: { role: before.role },
      after: { role: newRole },
    });
  });
}

/** Suspends or restores accounts. Suspension signs the person out everywhere. */
export async function setSuspended(ids: string[], suspended: boolean, actorId: string, reason = "") {
  if (ids.includes(actorId)) throw new SelfActionError();
  await db.transaction(async (tx) => {
    if (suspended) {
      const [admins] = await tx
        .select({ n: count() })
        .from(user)
        .where(and(eq(user.role, "admin"), eq(user.banned, false), notInArray(user.id, ids)));
      const [targetsIncludeAdmin] = await tx
        .select({ n: count() })
        .from(user)
        .where(and(inArray(user.id, ids), eq(user.role, "admin")));
      if (targetsIncludeAdmin.n > 0 && admins.n === 0) throw new LastAdminError();
    }
    await tx
      .update(user)
      .set(suspended ? { banned: true, bannedAt: new Date(), banReason: reason.slice(0, 300) || null } : { banned: false, bannedAt: null, banReason: null })
      .where(inArray(user.id, ids));
    if (suspended) await tx.delete(session).where(inArray(session.userId, ids));
    await tx.insert(auditLog).values(
      ids.map((targetId) => ({
        userId: actorId,
        action: suspended ? "suspend_user" : "restore_user",
        targetType: "user",
        targetId,
        after: suspended && reason ? { reason } : null,
      })),
    );
  });
}

/** Sets a new password and signs the person out of every device. */
export async function setPassword(id: string, password: string, actorId: string) {
  const hashed = await hashPassword(passwordSchema.parse(password));
  await db.transaction(async (tx) => {
    const [credential] = await tx
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, id), eq(account.providerId, "credential")));
    if (credential) await tx.update(account).set({ password: hashed }).where(eq(account.id, credential.id));
    // A Google-only account gains an email/password sign-in method.
    else await tx.insert(account).values({ id: randomUUID(), userId: id, providerId: "credential", accountId: id, password: hashed });
    await tx.delete(session).where(eq(session.userId, id));
    await tx.insert(auditLog).values({ userId: actorId, action: "set_password", targetType: "user", targetId: id });
  });
}

export async function revokeSessions(id: string, actorId: string) {
  await db.delete(session).where(eq(session.userId, id));
  await log(actorId, "revoke_sessions", id);
}

export async function logPasswordResetSent(id: string, actorId: string) {
  await log(actorId, "send_password_reset", id);
}

/**
 * Closes accounts the same way people close their own (resumes deleted, row anonymised — KVKK).
 * Staff accounts must be demoted first, so the panel is never left without an owner by accident.
 */
export async function deleteUsers(ids: string[], actorId: string) {
  if (ids.includes(actorId)) throw new SelfActionError();
  const staff = await db.select({ id: user.id }).from(user).where(and(inArray(user.id, ids), ne(user.role, "user")));
  if (staff.length) throw new StaffAccountError();
  for (const id of ids) {
    await closeAccount(id);
    await log(actorId, "delete_user", id);
  }
}

export async function getUserEmail(id: string) {
  const [u] = await db.select({ email: user.email }).from(user).where(eq(user.id, id));
  return u?.email ?? null;
}
