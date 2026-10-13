import "server-only";
import { and, count, desc, eq, ilike, isNull, ne, or, sql } from "drizzle-orm";
import { db } from "../db";
import { auditLog, resumes, roles, user, type Role } from "../db/schema";

/** User list for the admin area. Resume content is never returned (plan 7.3, KVKK). */
export async function listUsers(search = "", page = 0, pageSize = 50) {
  const condition = search
    ? or(ilike(user.email, `%${search}%`), ilike(user.name, `%${search}%`), ilike(user.username, `%${search}%`))
    : undefined;
  const resumeCounts = db
    .select({ userId: resumes.userId, n: count().as("n") })
    .from(resumes)
    .where(isNull(resumes.deletedAt))
    .groupBy(resumes.userId)
    .as("resume_counts");
  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        emailVerified: user.emailVerified,
        employerSharing: user.employerSharing,
        createdAt: user.createdAt,
        resumeCount: sql<number>`coalesce(${resumeCounts.n}, 0)`.mapWith(Number),
      })
      .from(user)
      .leftJoin(resumeCounts, eq(resumeCounts.userId, user.id))
      .where(condition)
      .orderBy(desc(user.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db.select({ n: count() }).from(user).where(condition),
  ]);
  return { rows, total: total.n };
}

export class LastAdminError extends Error {}

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
        .where(and(eq(user.role, "admin"), ne(user.id, targetId)));
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
