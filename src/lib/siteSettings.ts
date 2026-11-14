import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
// Site settings (plan 5: site_settings, 7.3). `settings` is locale-independent, `translations` is per locale.
import { z } from "zod";
import type { FieldMeta } from "./blocks";

const m = <T extends z.ZodType>(s: T, meta: FieldMeta) => s.meta(meta as Record<string, unknown>);
const url = (label: string) =>
  m(
    z
      .string()
      .max(300)
      .refine((v) => !v || /^https:\/\//.test(v), ADMIN_CONTENT.siteSettingsLabel437),
    { label, display: "link" },
  );

// Only the token itself (letters, digits, - and _), never a whole <meta> tag.
const token = z.string().trim().max(100).regex(/^[\w-]*$/, ADMIN_CONTENT.siteSettingsLabel438);

export const globalSettingsSchema = z.object({
  contactEmail: m(z.union([z.literal(""), z.email(ADMIN_CONTENT.siteSettingsLabel439)]), { label: ADMIN_CONTENT.siteSettingsLabel440 }),
  social: m(
    z.object({
      linkedin: url("LinkedIn"),
      x: url("X (Twitter)"),
      instagram: url("Instagram"),
      github: url("GitHub"),
    }),
    { label: ADMIN_CONTENT.settingsSettingsFormTitle295 },
  ),
  donation: m(
    z.object({
      enabled: m(z.boolean(), { label: ADMIN_CONTENT.siteSettingsLabel441 }),
      url: url(ADMIN_CONTENT.siteSettingsLabel442),
    }),
    { label: ADMIN_CONTENT.settingsSettingsFormTitle297, hint: ADMIN_CONTENT.siteSettingsHint443 },
  ),
  verification: m(
    z.object({
      google: m(token, { label: ADMIN_CONTENT.siteSettingsLabel444, hint: ADMIN_CONTENT.siteSettingsHint445 }),
      bing: m(token, { label: ADMIN_CONTENT.siteSettingsLabel446, hint: ADMIN_CONTENT.siteSettingsHint447 }),
      yandex: m(token, { label: ADMIN_CONTENT.siteSettingsLabel448, hint: ADMIN_CONTENT.siteSettingsHint449 }),
    }),
    { label: ADMIN_CONTENT.siteSettingsLabel450 },
  ),
});

export const localeSettingsSchema = z.object({
  announcement: m(
    z.object({
      enabled: m(z.boolean(), { label: ADMIN_CONTENT.siteSettingsLabel451 }),
      text: m(z.string().max(160), { label: ADMIN_CONTENT.blocksRichText435 }),
      href: m(
        z
          .string()
          .max(300)
          .refine((v) => !v || /^(\/|https:\/\/)/.test(v), ADMIN_CONTENT.siteSettingsLabel452),
        { label: ADMIN_CONTENT.siteSettingsLabel453, display: "link" },
      ),
    }),
    { label: ADMIN_CONTENT.settingsSettingsFormTitle300, hint: ADMIN_CONTENT.siteSettingsHint454 },
  ),
  footerTagline: m(z.string().max(240), { label: ADMIN_CONTENT.siteSettingsLabel455, display: "long", hint: ADMIN_CONTENT.siteSettingsHint456 }),
  donationLabel: m(z.string().max(80), { label: ADMIN_CONTENT.siteSettingsLabel457, hint: ADMIN_CONTENT.siteSettingsHint458 }),
});

export type GlobalSettings = z.infer<typeof globalSettingsSchema>;
export type LocaleSettings = z.infer<typeof localeSettingsSchema>;

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  contactEmail: "support@freehandcv.com",
  social: { linkedin: "", x: "", instagram: "", github: "" },
  donation: { enabled: false, url: "" },
  verification: { google: "", bing: "", yandex: "" },
};
export const DEFAULT_LOCALE_SETTINGS: LocaleSettings = {
  announcement: { enabled: false, text: "", href: "" },
  footerTagline: "",
  donationLabel: "",
};

/** Fits the raw database value to the schema; an invalid value falls back to the defaults. */
export function resolveGlobalSettings(raw: unknown): GlobalSettings {
  const s = globalSettingsSchema.safeParse({ ...DEFAULT_GLOBAL_SETTINGS, ...(raw as object) });
  return s.success ? s.data : DEFAULT_GLOBAL_SETTINGS;
}
export function resolveLocaleSettings(raw: unknown): LocaleSettings {
  const s = localeSettingsSchema.safeParse({ ...DEFAULT_LOCALE_SETTINGS, ...(raw as object) });
  return s.success ? s.data : DEFAULT_LOCALE_SETTINGS;
}
