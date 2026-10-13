"use server";

import { z } from "zod";
import { roles } from "@/server/db/schema";
import { changeRole, LastAdminError } from "@/server/admin/users";
import { AuthorizationError, requireAdmin } from "@/server/authz";

export async function changeRoleAction(targetId: string, role: string) {
  try {
    // Granting roles is admin-only (plan 5: editors cannot change settings or roles).
    const actor = await requireAdmin(["admin"]);
    if (actor.id === targetId) return { ok: false as const, error: "Kendi rolünü değiştiremezsin." };
    await changeRole(z.string().min(1).parse(targetId), z.enum(roles).parse(role), actor.id);
    return { ok: true as const };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false as const, error: "Rolleri yalnız yöneticiler değiştirebilir." };
    if (error instanceof LastAdminError) return { ok: false as const, error: "Son yöneticinin yetkisi alınamaz." };
    console.error(error);
    return { ok: false as const, error: "Beklenmeyen bir hata oluştu." };
  }
}
