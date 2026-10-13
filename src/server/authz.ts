import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import type { Role } from "./db/schema";

/**
 * The signed-in session or null. Read at request time; call inside Suspense.
 * Layout and page calling it in the same request share a single query.
 */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export type AdminStatus =
  | { status: "signed-out" }
  | { status: "forbidden" }
  | { status: "two-factor-required" }
  | { status: "ok"; user: { id: string; name: string; email: string; role: Role } };

/**
 * Authorization check for the admin area (plan 7.5). Every Server Action also calls this;
 * the layout alone is not trusted.
 */
export async function adminStatus(): Promise<AdminStatus> {
  const session = await getSession();
  if (!session) return { status: "signed-out" };
  const role = session.user.role as Role;
  if (role !== "admin" && role !== "editor") return { status: "forbidden" };
  if (!session.user.twoFactorEnabled) return { status: "two-factor-required" };
  return {
    status: "ok",
    user: {
      id: session.user.id,
      name: session.user.name || session.user.email,
      email: session.user.email,
      role,
    },
  };
}

export class AuthorizationError extends Error {}

/** Called at the start of Server Actions: throws when unauthorized, otherwise returns the user. */
export async function requireAdmin(roles: readonly Role[] = ["admin", "editor"]) {
  const s = await adminStatus();
  if (s.status !== "ok" || !roles.includes(s.user.role)) throw new AuthorizationError("Unauthorized");
  return s.user;
}
