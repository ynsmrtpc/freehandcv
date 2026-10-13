"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { localeSettingsSchema, globalSettingsSchema } from "@/lib/siteSettings";
import { SITE_SETTINGS_TAG, saveSiteSettings } from "@/server/content/siteSettings";
import { AuthorizationError, requireAdmin } from "@/server/authz";

const inputSchema = z.object({
  global: globalSettingsSchema,
  translations: z.record(z.enum(routing.locales), localeSettingsSchema),
});

export async function saveSiteSettingsAction(raw: unknown) {
  try {
    // Site-wide settings are admin-only (editors edit content but cannot change settings — plan 5).
    const user = await requireAdmin(["admin"]);
    const input = inputSchema.safeParse(raw);
    if (!input.success)
      return {
        ok: false as const,
        error: "Bazı alanlar hatalı.",
        issues: input.error.issues.map((i) => ({ path: i.path as (string | number)[], message: i.message })),
      };
    await saveSiteSettings(input.data.global, input.data.translations, user.id);
    updateTag(SITE_SETTINGS_TAG);
    return { ok: true as const };
  } catch (error) {
    if (error instanceof AuthorizationError) return { ok: false as const, error: "Site ayarlarını yalnız yöneticiler değiştirebilir." };
    console.error(error);
    return { ok: false as const, error: "Beklenmeyen bir hata oluştu." };
  }
}
