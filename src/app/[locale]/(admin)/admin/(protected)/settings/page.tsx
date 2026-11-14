import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { AdminPageHeader } from "@/components/admin/kit";
import { routing } from "@/i18n/routing";
import { DEFAULT_LOCALE_SETTINGS } from "@/lib/siteSettings";
import { getSiteSettingsForAdmin } from "@/server/content/siteSettings";
import { SettingsForm } from "./SettingsForm";

export default async function SiteSettings() {
  const s = await getSiteSettingsForAdmin();
  const translations = Object.fromEntries(routing.locales.map((l) => [l, s.translations[l] ?? DEFAULT_LOCALE_SETTINGS]));
  return (
    <>
      <AdminPageHeader title={ADMIN_CONTENT.auditLogAuditLogTableSiteSettings39} description={ADMIN_CONTENT.settingsPageDescription310} />
      <SettingsForm initial={{ global: s.global, translations }} locales={[...routing.locales]} />
    </>
  );
}
