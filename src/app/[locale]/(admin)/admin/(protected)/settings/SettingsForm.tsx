"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/Button";
import { SchemaForm, pathKey, type FieldErrors } from "@/components/admin/SchemaForm";
import { cn } from "@/lib/cn";
import { localeSettingsSchema, globalSettingsSchema, type LocaleSettings, type GlobalSettings } from "@/lib/siteSettings";
import { saveSiteSettingsAction } from "./actions";

type Value = { global: GlobalSettings; translations: Record<string, LocaleSettings> };
type Notice = { kind: "success" | "error"; text: string };
const LOCALE_NAMES: Record<string, string> = { tr: "Türkçe", en: "English" };

export function SettingsForm({ initial, locales }: { initial: Value; locales: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [locale, setLocale] = useState(locales[0]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, startTransition] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(initial);

  const save = () =>
    startTransition(async () => {
      const r = await saveSiteSettingsAction(value);
      if (r.ok) {
        setErrors({});
        setNotice({ kind: "success", text: "Kaydedildi. Değişiklikler sitede hemen görünür." });
        router.refresh();
      } else {
        setErrors(Object.fromEntries((r.issues ?? []).map((i) => [pathKey(i.path), i.message])));
        setNotice({ kind: "error", text: r.error });
      }
    });

  const nestedErrors = (prefix: string) =>
    Object.fromEntries(
      Object.entries(errors)
        .filter(([k]) => k.startsWith(prefix + "."))
        .map(([k, v]) => [k.slice(prefix.length + 1), v]),
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-5 sm:p-8">
      {notice && (
        <p
          role={notice.kind === "error" ? "alert" : "status"}
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium",
            notice.kind === "error" ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent",
          )}
        >
          {notice.text}
        </p>
      )}

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <h2 className="mb-4 font-bold text-foreground">Genel</h2>
        <SchemaForm
          schema={globalSettingsSchema}
          value={value.global}
          onChange={(v) => setValue({ ...value, global: v as GlobalSettings })}
          errors={nestedErrors("global")}
        />
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-bold text-foreground">Dile bağlı</h2>
          <div role="tablist" className="flex rounded-lg border border-border p-0.5">
            {locales.map((l) => (
              <button
                key={l}
                role="tab"
                type="button"
                aria-selected={locale === l}
                onClick={() => setLocale(l)}
                className={cn(
                  "h-8 rounded-md px-3 text-sm font-semibold",
                  locale === l ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground",
                  Object.keys(errors).some((k) => k.startsWith(`translations.${l}.`)) && "text-danger",
                )}
              >
                {LOCALE_NAMES[l] ?? l}
              </button>
            ))}
          </div>
        </div>
        <SchemaForm
          key={locale}
          schema={localeSettingsSchema}
          value={value.translations[locale]}
          onChange={(v) => setValue({ ...value, translations: { ...value.translations, [locale]: v as LocaleSettings } })}
          errors={nestedErrors(`translations.${locale}`)}
        />
      </section>

      <div className="sticky bottom-0 -mx-5 flex justify-end gap-2 border-t border-border bg-background/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <button type="button" disabled={!dirty || pending} onClick={() => setValue(initial)} className={buttonClass("ghost", "sm")}>
          Değişiklikleri geri al
        </button>
        <button type="button" disabled={!dirty || pending} onClick={save} className={buttonClass("primary", "sm")}>
          Kaydet
        </button>
      </div>
    </div>
  );
}
