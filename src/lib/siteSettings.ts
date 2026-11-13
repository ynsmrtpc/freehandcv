// Site settings (plan 5: site_settings, 7.3). `settings` is locale-independent, `translations` is per locale.
import { z } from "zod";
import type { FieldMeta } from "./blocks";

const m = <T extends z.ZodType>(s: T, meta: FieldMeta) => s.meta(meta as Record<string, unknown>);
const url = (label: string) =>
  m(
    z
      .string()
      .max(300)
      .refine((v) => !v || /^https:\/\//.test(v), "https:// ile başlamalı"),
    { label, display: "link" },
  );

// Only the token itself (letters, digits, - and _), never a whole <meta> tag.
const token = z.string().trim().max(100).regex(/^[\w-]*$/, "Yalnız kodu yapıştır (harf, rakam, - ve _)");

export const globalSettingsSchema = z.object({
  contactEmail: m(z.union([z.literal(""), z.email("Geçerli bir e-posta gir")]), { label: "İletişim e-postası" }),
  social: m(
    z.object({
      linkedin: url("LinkedIn"),
      x: url("X (Twitter)"),
      instagram: url("Instagram"),
      github: url("GitHub"),
    }),
    { label: "Sosyal bağlantılar" },
  ),
  donation: m(
    z.object({
      enabled: m(z.boolean(), { label: "Bağış bağlantısını göster" }),
      url: url("Bağış sayfası adresi"),
    }),
    { label: "Bağış", hint: "Buy Me a Coffee, GitHub Sponsors vb." },
  ),
  verification: m(
    z.object({
      google: m(token, { label: "Google Search Console", hint: "google-site-verification etiketindeki content değeri" }),
      bing: m(token, { label: "Bing Webmaster Tools", hint: "msvalidate.01 etiketindeki content değeri" }),
      yandex: m(token, { label: "Yandex Webmaster", hint: "yandex-verification etiketindeki content değeri" }),
    }),
    { label: "Arama motoru doğrulaması" },
  ),
});

export const localeSettingsSchema = z.object({
  announcement: m(
    z.object({
      enabled: m(z.boolean(), { label: "Duyuru çubuğunu göster" }),
      text: m(z.string().max(160), { label: "Metin" }),
      href: m(
        z
          .string()
          .max(300)
          .refine((v) => !v || /^(\/|https:\/\/)/.test(v), "/ ya da https:// ile başlamalı"),
        { label: "Bağlantı (isteğe bağlı)", display: "link" },
      ),
    }),
    { label: "Duyuru çubuğu", hint: "Sitenin en üstünde ince bir şerit" },
  ),
  footerTagline: m(z.string().max(240), { label: "Alt bilgi sloganı", display: "long", hint: "Boşsa varsayılan metin" }),
  donationLabel: m(z.string().max(80), { label: "Bağış bağlantısı metni", hint: "Örn. Beğendiysen destek ol" }),
});

export type GlobalSettings = z.infer<typeof globalSettingsSchema>;
export type LocaleSettings = z.infer<typeof localeSettingsSchema>;

export const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  contactEmail: "",
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
