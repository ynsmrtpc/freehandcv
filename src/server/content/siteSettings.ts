import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { migrateLegacySiteSettings } from "@/lib/legacyContent";
import {
  resolveLocaleSettings,
  resolveGlobalSettings,
  DEFAULT_LOCALE_SETTINGS,
  DEFAULT_GLOBAL_SETTINGS,
  type LocaleSettings,
  type GlobalSettings,
} from "@/lib/siteSettings";
import { db } from "../db";
import { auditLog, siteSettings } from "../db/schema";

export const SITE_SETTINGS_TAG = "site-settings";

/** Reads the single row, converting legacy Turkish keys if the data has not been converted yet. */
async function readRow() {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  if (!row) return null;
  const { settings, translations } = migrateLegacySiteSettings(row);
  return { ...row, settings, translations: (translations ?? {}) as Record<string, unknown> };
}

/** Settings read by the public site (cached). */
export async function getSiteSettings(locale: string): Promise<{ global: GlobalSettings; localized: LocaleSettings }> {
  "use cache";
  cacheTag(SITE_SETTINGS_TAG);
  try {
    const row = await readRow();
    return {
      global: resolveGlobalSettings(row?.settings),
      localized: resolveLocaleSettings(row?.translations[locale]),
    };
  } catch (error) {
    console.error("getSiteSettings: database unreachable", error);
    // Database fallbacks use "minutes", not "seconds": "seconds" is excluded from prerenders, so a
    // build without a database (the Docker image) failed on content read outside <Suspense> (root
    // layout metadata, Footer). "minutes" is prerendered and revalidates a minute later at runtime.
    cacheLife("minutes");
    return { global: DEFAULT_GLOBAL_SETTINGS, localized: DEFAULT_LOCALE_SETTINGS };
  }
}

export async function getSiteSettingsForAdmin() {
  const row = await readRow();
  return {
    global: resolveGlobalSettings(row?.settings),
    translations: Object.fromEntries(
      Object.entries(row?.translations ?? {}).map(([locale, v]) => [locale, resolveLocaleSettings(v)]),
    ) as Record<string, LocaleSettings>,
    version: row?.version ?? 0,
  };
}

export async function saveSiteSettings(
  global: GlobalSettings,
  translations: Record<string, LocaleSettings>,
  userId: string,
) {
  await db.transaction(async (tx) => {
    const [before] = await tx.select().from(siteSettings).where(eq(siteSettings.id, 1)).for("update");
    await tx
      .insert(siteSettings)
      .values({ id: 1, settings: global, translations, updatedById: userId })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: { settings: global, translations, updatedById: userId, version: (before?.version ?? 0) + 1 },
      });
    await tx.insert(auditLog).values({
      userId,
      action: "update_site_settings",
      targetType: "site_settings",
      before: before ? { settings: before.settings, translations: before.translations } : null,
      after: { settings: global, translations },
    });
  });
}
