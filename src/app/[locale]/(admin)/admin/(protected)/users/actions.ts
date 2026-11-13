"use server";

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
  try {
    const actor = await requireAdmin(["admin"]);
    return await fn(actor.id);
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false, error: "Kullanıcıları yalnız yöneticiler yönetebilir." };
    if (error instanceof LastAdminError) return { ok: false, error: "Son yöneticinin yetkisi alınamaz ya da hesabı askıya alınamaz." };
    if (error instanceof SelfActionError) return { ok: false, error: "Bu işlemi kendi hesabına uygulayamazsın." };
    if (error instanceof StaffAccountError)
      return { ok: false, error: "Yönetici ve editör hesapları silinemez; önce rolünü “Kullanıcı” yap." };
    if (error instanceof EmailTakenError) return { ok: false, error: "Bu e-posta adresiyle başka bir hesap var." };
    if (error instanceof z.ZodError) return { ok: false, error: "Bazı alanlar hatalı: e-posta geçerli olmalı, şifre 10–128 karakter." };
    console.error(error);
    return { ok: false, error: "Beklenmeyen bir hata oluştu." };
  }
}

export async function changeRoleAction(targetId: string, role: string) {
  return run(async (actorId) => {
    if (actorId === targetId) throw new SelfActionError();
    await changeRole(z.string().min(1).parse(targetId), z.enum(roles).parse(role), actorId);
    return { ok: true, message: "Rol güncellendi." };
  });
}

export async function createUserAction(input: { email: string; name: string; password: string; role: string }) {
  return run(async (actorId) => {
    const id = await createUser({ ...input, role: z.enum(roles).parse(input.role) }, actorId);
    return { ok: true, message: "Hesap oluşturuldu.", id };
  });
}

export async function updateUserAction(id: string, input: { name: string; email: string }) {
  return run(async (actorId) => {
    await updateUserProfile(z.string().min(1).parse(id), input, actorId);
    return { ok: true, message: "Profil kaydedildi." };
  });
}

export async function setPasswordAction(id: string, password: string) {
  return run(async (actorId) => {
    await setPassword(z.string().min(1).parse(id), password, actorId);
    return { ok: true, message: "Yeni şifre kaydedildi; kişinin tüm oturumları kapatıldı." };
  });
}

export async function sendResetLinkAction(id: string) {
  return run(async (actorId) => {
    const email = await getUserEmail(z.string().min(1).parse(id));
    if (!email) return { ok: false, error: "Kullanıcı bulunamadı." };
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: getPathname({ href: "/reset-password", locale: "tr" }) },
    });
    if (!emailConfigured())
      return {
        ok: false,
        error:
          process.env.NODE_ENV === "production"
            ? "E-posta gönderimi ayarlı değil (RESEND_API_KEY, EMAIL_FROM); bağlantı gönderilmedi. Bunun yerine yeni şifre belirleyebilirsin."
            : "E-posta gönderimi ayarlı değil; bağlantı gönderilmedi, geliştirme sunucusunun terminaline yazıldı.",
      };
    await logPasswordResetSent(id, actorId);
    return { ok: true, message: `Şifre sıfırlama bağlantısı ${email} adresine gönderildi.` };
  });
}

export async function revokeSessionsAction(id: string) {
  return run(async (actorId) => {
    await revokeSessions(z.string().min(1).parse(id), actorId);
    return { ok: true, message: "Tüm oturumlar kapatıldı." };
  });
}

export async function suspendUsersAction(list: string[], reason = "") {
  return run(async (actorId) => {
    const parsed = ids.parse(list);
    await setSuspended(parsed, true, actorId, reason);
    return { ok: true, message: parsed.length === 1 ? "Hesap askıya alındı." : `${parsed.length} hesap askıya alındı.` };
  });
}

export async function restoreUsersAction(list: string[]) {
  return run(async (actorId) => {
    const parsed = ids.parse(list);
    await setSuspended(parsed, false, actorId);
    return { ok: true, message: parsed.length === 1 ? "Hesap yeniden açıldı." : `${parsed.length} hesap yeniden açıldı.` };
  });
}

export async function deleteUsersAction(list: string[]) {
  return run(async (actorId) => {
    const parsed = ids.parse(list);
    await deleteUsers(parsed, actorId);
    return { ok: true, message: parsed.length === 1 ? "Hesap silindi." : `${parsed.length} hesap silindi.` };
  });
}
