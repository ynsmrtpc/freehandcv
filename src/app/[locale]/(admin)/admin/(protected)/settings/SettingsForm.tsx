"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { InlineNotice, type Notice } from "@/components/admin/forms";
import { SchemaForm, pathKey, type FieldErrors } from "@/components/admin/SchemaForm";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { localeSettingsSchema, globalSettingsSchema, type LocaleSettings, type GlobalSettings } from "@/lib/siteSettings";
import { saveSiteSettingsAction } from "./actions";

type Value = { global: GlobalSettings; translations: Record<string, LocaleSettings> };
const LOCALE_NAMES: Record<string, string> = { tr: "Türkçe", en: "İngilizce" };

const g = globalSettingsSchema.shape;
const l = localeSettingsSchema.shape;

/** Each section edits one slice of the settings; the schema's own group label becomes the section title. */
const GLOBAL_SECTIONS = [
  { id: "contact", title: "İletişim", description: "Alt bilgide ve yasal sayfalarda görünen adres.", schema: z.object({ contactEmail: g.contactEmail }), key: null },
  { id: "social", title: "Sosyal bağlantılar", description: "Boş bırakılan bağlantı alt bilgide gösterilmez.", schema: z.object(g.social.shape), key: "social" },
  { id: "donation", title: "Bağış", description: "Buy Me a Coffee, GitHub Sponsors gibi bir bağış sayfası.", schema: z.object(g.donation.shape), key: "donation" },
  {
    id: "verification",
    title: "Arama motorları",
    description: "Search Console ve benzerlerinin site sahipliği doğrulaması. Yalnız kodu yapıştır.",
    schema: z.object(g.verification.shape),
    key: "verification",
  },
] as const;

const LOCALE_SECTIONS = [
  { id: "announcement", title: "Duyuru çubuğu", description: "Sitenin en üstünde ince bir şerit; kısa tut.", schema: z.object(l.announcement.shape), key: "announcement" },
  {
    id: "footer",
    title: "Alt bilgi",
    description: "Boş bırakılan alanlarda varsayılan metin kullanılır.",
    schema: z.object({ footerTagline: l.footerTagline, donationLabel: l.donationLabel }),
    key: null,
  },
] as const;

export function SettingsForm({ initial, locales }: { initial: Value; locales: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [locale, setLocale] = useState(locales[0]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(initial);

  // Leaving with unsaved changes asks first.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const save = () =>
    startTransition(async () => {
      const r = await saveSiteSettingsAction(value);
      if (r.ok) {
        setErrors({});
        setNotice({ kind: "success", text: "Kaydedildi. Değişiklikler sitede hemen görünür." });
        router.refresh();
      } else {
        const next = Object.fromEntries((r.issues ?? []).map((i) => [pathKey(i.path), i.message]));
        setErrors(next);
        setNotice({ kind: "error", text: "Bazı alanlar hatalı; kırmızı başlıklı bölüme bak." });
        // A wrong value in another language tab switches to it; then the first message comes into view.
        const lc = Object.keys(next).find((k) => k.startsWith("translations."))?.split(".")[1];
        if (lc && !Object.keys(next).some((k) => k.startsWith("global.") || k.startsWith(`translations.${locale}.`))) setLocale(lc);
        requestAnimationFrame(() => document.querySelector("#settings-form [role=alert]")?.scrollIntoView({ block: "center", behavior: "smooth" }));
      }
    });

  const nested = (prefix: string) =>
    Object.fromEntries(
      Object.entries(errors)
        .filter(([k]) => k.startsWith(prefix + "."))
        .map(([k, v]) => [k.slice(prefix.length + 1), v]),
    );
  const globalErrors = nested("global");
  const localeErrors = nested(`translations.${locale}`);
  /** Errors that belong to one section: under its key, or (for unkeyed sections) its own fields. */
  const sectionErrors = (all: FieldErrors, s: { key: string | null; schema: z.ZodObject }) => {
    const prefixes = s.key ? [`${s.key}.`] : Object.keys(s.schema.shape);
    return Object.fromEntries(Object.entries(all).filter(([k]) => prefixes.some((p) => k === p || k.startsWith(p.endsWith(".") ? p : `${p}.`))));
  };
  const localeHasError = (lc: string) => Object.keys(errors).some((k) => k.startsWith(`translations.${lc}.`));

  const section = (s: { id: string; title: string; description: string }, body: React.ReactNode, hasError: boolean) => (
    <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="grid scroll-mt-24 gap-x-10 gap-y-4 border-b border-border py-8 last:border-0 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <div>
        <h3 id={`${s.id}-title`} className={cn("text-lg font-bold", hasError ? "text-danger" : "text-foreground")}>
          {s.title}
        </h3>
        <p className="mt-1 text-[15px] leading-relaxed text-muted">{s.description}</p>
      </div>
      <div className="min-w-0 max-w-xl">{body}</div>
    </section>
  );

  return (
    <div id="settings-form" className="mx-auto max-w-6xl px-4 sm:px-8">
      <nav aria-label="Ayar bölümleri" className="flex flex-wrap gap-x-5 gap-y-2 border-b border-border py-4 text-[15px]">
        {[...GLOBAL_SECTIONS, ...LOCALE_SECTIONS].map((s) => (
          <a key={s.id} href={`#${s.id}`} className="font-semibold text-primary-text hover:underline">
            {s.title}
          </a>
        ))}
      </nav>

      <h2 className="sr-only">Tüm dillerde geçerli</h2>
      {GLOBAL_SECTIONS.map((s) => {
        const errs = sectionErrors(globalErrors, s);
        return section(
          s,
          <SchemaForm
            schema={s.schema}
            value={s.key ? value.global[s.key] : value.global}
            path={s.key ? [s.key] : []}
            errors={errs}
            onChange={(v) => setValue({ ...value, global: (s.key ? { ...value.global, [s.key]: v } : { ...value.global, ...(v as object) }) as GlobalSettings })}
          />,
          Object.keys(errs).length > 0,
        );
      })}

      <div className="flex flex-wrap items-center justify-between gap-3 border-y-2 border-foreground py-4">
        <h2 className="text-lg font-bold text-foreground">Dile bağlı metinler</h2>
        <div role="tablist" aria-label="Dil" className="flex gap-1">
          {locales.map((lc) => (
            <button
              key={lc}
              role="tab"
              type="button"
              aria-selected={locale === lc}
              onClick={() => setLocale(lc)}
              className={cn(
                "min-h-11 rounded-md border px-3 text-sm font-semibold pointer-fine:min-h-9",
                locale === lc ? "border-primary bg-primary-soft text-primary-text" : "border-border bg-surface text-foreground hover:border-border-strong",
                localeHasError(lc) && "border-danger text-danger",
              )}
            >
              {LOCALE_NAMES[lc] ?? lc}
            </button>
          ))}
        </div>
      </div>
      {LOCALE_SECTIONS.map((s) => {
        const current = value.translations[locale];
        const errs = sectionErrors(localeErrors, s);
        return section(
          s,
          <SchemaForm
            key={`${s.id}-${locale}`}
            schema={s.schema}
            value={s.key ? current[s.key] : current}
            path={s.key ? [s.key] : []}
            errors={errs}
            onChange={(v) =>
              setValue({
                ...value,
                translations: { ...value.translations, [locale]: (s.key ? { ...current, [s.key]: v } : { ...current, ...(v as object) }) as LocaleSettings },
              })
            }
          />,
          Object.keys(errs).length > 0,
        );
      })}

      <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-border-strong bg-surface px-4 py-3 sm:-mx-8 sm:px-8">
        <div className="me-auto min-w-0">
          {notice ? <InlineNotice notice={notice} /> : <p className="text-[15px] text-muted">{dirty ? "Kaydedilmemiş değişiklikler var." : "Tüm değişiklikler kaydedildi."}</p>}
        </div>
        <button type="button" disabled={!dirty || pending} onClick={() => (setValue(initial), setErrors({}), setNotice(null))} className={buttonClass("ghost", "sm")}>
          Geri al
        </button>
        <button type="button" disabled={!dirty || pending} onClick={save} className={buttonClass("primary", "sm")}>
          Kaydet
        </button>
      </div>
    </div>
  );
}
