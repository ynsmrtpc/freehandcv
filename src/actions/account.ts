"use server";

// Closing an account (plan 9 /hesap). The user id comes from the session; the typed e-mail is a
// confirmation step against mistakes, not authorization.
import { AdminAccountError, closeAccount } from "@/server/account";
import { getSession } from "@/server/authz";

export async function closeAccountAction(
  confirmEmail: string,
): Promise<{ ok: true } | { ok: false; reason: "unauthenticated" | "mismatch" | "admin" | "error" }> {
  const session = await getSession();
  if (!session) return { ok: false, reason: "unauthenticated" };
  if (String(confirmEmail).trim().toLowerCase() !== session.user.email.toLowerCase()) return { ok: false, reason: "mismatch" };
  try {
    await closeAccount(session.user.id);
    return { ok: true };
  } catch (error) {
    if (error instanceof AdminAccountError) return { ok: false, reason: "admin" };
    console.error(error);
    return { ok: false, reason: "error" };
  }
}
