"use server";
import { getTranslations } from "next-intl/server";

import { z } from "zod";
import { getPathname } from "@/i18n/navigation";
import { auth } from "@/server/auth";
import { roles } from "@/server/db/schema";
import { emailConfigured } from "@/server/email";
import {
  changeRole,
  createUser,
  deleteUsers,
  EmailTakenError,
  getUserEmail,
  LastAdminError,
  logPasswordResetSent,
  revokeSessions,
  SelfActionError,
  setPassword,
  setSuspended,
  StaffAccountError,
  updateUserProfile,
} from "@/server/admin/users";
import { AuthorizationError, requireAdmin } from "@/server/authz";

export type ActionResult = { ok: true; message?: string; id?: string } | { ok: false; error: string };

const ids = z.array(z.string().min(1)).min(1).max(200);

/** Every user operation is admin-only (plan 5: editors manage content, not people). */
async function run(fn: (actorId: string) => Promise<ActionResult>): Promise<ActionResult> {
  const t_ = await getTranslations("Admin.users");
  try {
    const actor = await requireAdmin(["admin"]);
    return await fn(actor.id);
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, error: t_("onlyAdministratorsCanManageUsers") };
    if (error instanceof LastAdminError) return { ok: false, error: t_("theLastAdministratorCannotBeDemotedOr") };
    if (error instanceof SelfActionError) return { ok: false, error: t_("youCannotPerformThisActionOnYour") };
    if (error instanceof StaffAccountError)
      return { ok: false, error: t_("demoteAdministratorsAndEditorsToUserBefore") };
    if (error instanceof EmailTakenError) return { ok: false, error: t_("anotherAccountUsesThisEmail") };
    if (error instanceof z.ZodError) return { ok: false, error: t_("checkTheFieldsAValidEmailAnd") };
    console.error(error);
    return { ok: false, error: t_("anUnexpectedErrorOccurred") };
  }
}

export async function changeRoleAction(targetId: string, role: string) {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    if (actorId === targetId) throw new SelfActionError();
    await changeRole(z.string().min(1).parse(targetId), z.enum(roles).parse(role), actorId);
    return { ok: true, message: t_("roleUpdated") };
  });
}

export async function createUserAction(input: { email: string; name: string; password: string; role: string }) {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    const id = await createUser({ ...input, role: z.enum(roles).parse(input.role) }, actorId);
    return { ok: true, message: t_("accountCreated2"), id };
  });
}

export async function updateUserAction(id: string, input: { name: string; email: string }) {
  return run(async (actorId) => {
    await updateUserProfile(z.string().min(1).parse(id), input, actorId);
    return { ok: true, message: "Profil kaydedildi." };
  });
}

export async function setPasswordAction(id: string, password: string) {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    await setPassword(z.string().min(1).parse(id), password, actorId);
    return { ok: true, message: t_("newPasswordSavedAllSessionsWereClosed") };
  });
}

export async function sendResetLinkAction(id: string) {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    const email = await getUserEmail(z.string().min(1).parse(id));
    if (!email) return { ok: false, error: t_("userNotFound") };
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: getPathname({ href: "/reset-password", locale: "tr" }) },
    });
    if (!emailConfigured())
      return {
        ok: false,
        error:
          process.env.NODE_ENV === "production"
            ? t_("emailDeliveryIsNotConfiguredNoLink")
            : t_("emailDeliveryIsNotConfiguredTheDevelopment"),
      };
    await logPasswordResetSent(id, actorId);
    return { ok: true, message: t_("resetSent", {email}) };
  });
}

export async function revokeSessionsAction(id: string) {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    await revokeSessions(z.string().min(1).parse(id), actorId);
    return { ok: true, message: t_("allSessionsClosed") };
  });
}

export async function suspendUsersAction(list: string[], reason = "") {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    const parsed = ids.parse(list);
    await setSuspended(parsed, true, actorId, reason);
    return { ok: true, message: parsed.length === 1 ? t_("accountSuspended") : t_("suspendedCount", {count: parsed.length}) };
  });
}

export async function restoreUsersAction(list: string[]) {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    const parsed = ids.parse(list);
    await setSuspended(parsed, false, actorId);
    return { ok: true, message: parsed.length === 1 ? t_("accountRestored") : t_("restoredCount", {count: parsed.length}) };
  });
}

export async function deleteUsersAction(list: string[]) {
  const t_ = await getTranslations("Admin.users");
  return run(async (actorId) => {
    const parsed = ids.parse(list);
    await deleteUsers(parsed, actorId);
    return { ok: true, message: parsed.length === 1 ? "Hesap silindi." : t_("deletedCount", {count: parsed.length}) };
  });
}
