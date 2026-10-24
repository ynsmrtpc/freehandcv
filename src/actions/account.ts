"use server";

// Account page actions (plan 9 /hesap): username, closing the account. The user id comes from the
// session; the typed e-mail is a confirmation step against mistakes, not authorization.
import { AdminAccountError, closeAccount, setUsername, UsernameInvalidError, UsernameTakenError } from "@/server/account";
import type { UsernameProblem } from "@/lib/username";
import { updateTag } from "next/cache";
import { getSession } from "@/server/authz";
import { TEMPLATES_TAG } from "@/server/templates";

export async function closeAccountAction(
  confirmEmail: string,
): Promise<{ ok: true } | { ok: false; reason: "unauthenticated" | "mismatch" | "admin" | "error" }> {
  const session = await getSession();
  if (!session) return { ok: false, reason: "unauthenticated" };
  if (String(confirmEmail).trim().toLowerCase() !== session.user.email.toLowerCase()) return { ok: false, reason: "mismatch" };
  try {
    await closeAccount(session.user.id);
    updateTag(TEMPLATES_TAG);
    return { ok: true };
  } catch (error) {
    if (error instanceof AdminAccountError) return { ok: false, reason: "admin" };
    console.error(error);
    return { ok: false, reason: "error" };
  }
}

export async function setUsernameAction(
  username: string,
): Promise<{ ok: true; username: string } | { ok: false; reason: "unauthenticated" | "taken" | UsernameProblem | "error" }> {
  const session = await getSession();
  if (!session) return { ok: false, reason: "unauthenticated" };
  try {
    const saved = await setUsername(session.user.id, String(username));
    // The username is shown on public templates and is the profile address.
    updateTag(TEMPLATES_TAG);
    return { ok: true, username: saved };
  } catch (error) {
    if (error instanceof UsernameTakenError) return { ok: false, reason: "taken" };
    if (error instanceof UsernameInvalidError) return { ok: false, reason: error.problem };
    console.error(error);
    return { ok: false, reason: "error" };
  }
}
