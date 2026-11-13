"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useEffect, useId, useMemo, useState, useTransition } from "react";
import { adminInputClass, InlineNotice, type Notice } from "@/components/admin/forms";
import { FormSection } from "@/components/admin/kit";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { useRouter } from "@/i18n/navigation";
import { EXAMPLE_CATEGORY_IDS, EXPERIENCE_LEVELS, guideWordCount, type ExampleGuide } from "@/lib/examples";
import { cn } from "@/lib/cn";
import { createExampleAction, updateExampleMetaAction } from "./actions";
import { CATEGORY_NAMES, LEVEL_NAMES } from "./labels";

export type ExampleFormValues = {
  slug: string;
  title: string;
  occupation: string;
  category: string;
  locale: "tr" | "en";
  experienceLevel: "entry" | "mid" | "senior";
  metaTitle: string;
  metaDescription: string;
  guide: ExampleGuide;
  sortOrder: number;
};

// Grows with its text (field-sizing), so long guide sections are read without an inner scrollbar.
const textareaClass = cn(adminInputClass, "h-auto min-h-24 py-2 leading-relaxed field-sizing-content");

/** Label, control and hint, linked by ids. The control is rendered by the caller with the given id. */
function Field({
  label,
  hint,
  counter,
  className,
  children,
}: {
  label: string;
  hint?: string;
  counter?: { value: number; limit: number };
  className?: string;
  children: (props: { id: string; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="flex justify-between gap-3 text-[15px] font-semibold text-foreground">
        {label}
        {counter && (
          <span className={cn("font-medium tabular-nums", counter.value > counter.limit ? "text-danger" : "text-muted")}>
            {counter.value}/{counter.limit}
          </span>
        )}
      </label>
      <div className="mt-1.5">{children({ id, "aria-describedby": hint ? `${id}-hint` : undefined })}</div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

/** Page details and the occupation guide. The resume itself is edited in the CV editor. */
export function ExampleForm({ id, initial, slugLocked }: { id?: string; initial: ExampleFormValues; slugLocked: boolean }) {
  const confirm = useConfirm();
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const dirty = useMemo(() => JSON.stringify(v) !== JSON.stringify(initial), [v, initial]);

  const set = <K extends keyof ExampleFormValues>(k: K, value: ExampleFormValues[K]) => {
    setNotice(null);
    setV((x) => ({ ...x, [k]: value }));
  };
  const setSections = (sections: ExampleGuide["sections"]) => set("guide", { ...v.guide, sections });
  const setSection = (i: number, patch: Partial<ExampleGuide["sections"][number]>) =>
    setSections(v.guide.sections.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const swap = (i: number, j: number) => {
    const l = [...v.guide.sections];
    [l[i], l[j]] = [l[j], l[i]];
    setSections(l);
  };
  const words = guideWordCount(v.guide);

  // Warn when leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const submit = () =>
    startTransition(async () => {
      const r = id ? await updateExampleMetaAction(id, v) : await createExampleAction(v);
      if (!r.ok) return setNotice({ kind: "error", text: r.error });
      if (!id && r.id) router.push({ pathname: "/admin/examples/[id]", params: { id: r.id } });
      else {
        setNotice({ kind: "success", text: "Kaydedildi." });
        router.refresh();
      }
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <FormSection id="page" title="Sayfa" description="Örnek sayfasının başlığı, adresi ve listede nerede duracağı.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Sayfa başlığı" hint="Sayfanın ana başlığı. Örn. Hemşire CV Örneği">
            {(p) => <input {...p} className={adminInputClass} value={v.title} onChange={(e) => set("title", e.target.value)} required />}
          </Field>
          <Field label="Meslek" hint="Rehberde “Hemşire CV'si yazarken” gibi başlıklarda kullanılır.">
            {(p) => <input {...p} className={adminInputClass} value={v.occupation} onChange={(e) => set("occupation", e.target.value)} required />}
          </Field>
          <Field
            label="Adres (slug)"
            className="sm:col-span-2"
            hint={slugLocked ? "Yayındaki örneğin adresi değiştirilemez; eski bağlantılar kırılır." : "Türkçe: …-cv-ornegi, İngilizce: …-resume. Yayınlandıktan sonra değişmez."}
          >
            {(p) => (
              <input
                {...p}
                className={cn(adminInputClass, "font-mono disabled:bg-surface-2")}
                value={v.slug}
                disabled={slugLocked}
                onChange={(e) => set("slug", e.target.value.toLowerCase())}
                required
              />
            )}
          </Field>
          <Field label="Dil" hint={slugLocked ? "Yayındaki örneğin dili değiştirilemez." : undefined}>
            {(p) => (
              <select {...p} className={cn(adminInputClass, "disabled:bg-surface-2")} value={v.locale} disabled={slugLocked} onChange={(e) => set("locale", e.target.value as "tr" | "en")}>
                <option value="tr">Türkçe</option>
                <option value="en">İngilizce</option>
              </select>
            )}
          </Field>
          <Field label="Deneyim seviyesi">
            {(p) => (
              <select {...p} className={adminInputClass} value={v.experienceLevel} onChange={(e) => set("experienceLevel", e.target.value as ExampleFormValues["experienceLevel"])}>
                {EXPERIENCE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {LEVEL_NAMES[l]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Kategori">
            {(p) => (
              <select {...p} className={adminInputClass} value={v.category} onChange={(e) => set("category", e.target.value)}>
                {EXAMPLE_CATEGORY_IDS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_NAMES[c]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Sıra" hint="Küçük sayı önce gelir; eşitse en çok kullanılan önce.">
            {(p) => (
              <input
                {...p}
                type="number"
                min={0}
                className={cn(adminInputClass, "tabular-nums")}
                value={v.sortOrder}
                onChange={(e) => set("sortOrder", Math.max(0, Number(e.target.value) || 0))}
              />
            )}
          </Field>
        </div>
      </FormSection>

      <FormSection id="seo" title="Arama motorları" description="Arama sonuçlarında görünen başlık ve açıklama. Boş kalırsa sayfa başlığı ve rehber girişi kullanılır.">
        <div className="space-y-5">
          <Field label="SEO başlığı" counter={{ value: v.metaTitle.length, limit: 60 }}>
            {(p) => <input {...p} className={adminInputClass} value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />}
          </Field>
          <Field label="SEO açıklaması" counter={{ value: v.metaDescription.length, limit: 155 }}>
            {(p) => <textarea {...p} rows={3} className={textareaClass} value={v.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} />}
          </Field>
        </div>
      </FormSection>

      <FormSection
        id="guide"
        title="Meslek rehberi"
        description={
          <>
            Örnek CV&apos;nin altında görünen yazı. Boş satır yeni paragraf, “- ” ile başlayan satırlar liste, **iki yıldız** kalın.
            <span className={cn("mt-2 block font-semibold tabular-nums", words < 400 || words > 800 ? "text-warning" : "text-foreground")}>
              {words} kelime · hedef 400–800
            </span>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Giriş" hint="Başlığın altında görünür; SEO açıklaması boşsa ilk 155 karakteri kullanılır.">
            {(p) => <textarea {...p} rows={4} className={textareaClass} value={v.guide.intro} onChange={(e) => set("guide", { ...v.guide, intro: e.target.value })} />}
          </Field>

          <ol className="space-y-4">
            {v.guide.sections.map((s, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-end gap-1">
                  <Field label={`Bölüm ${i + 1} başlığı`} className="min-w-0 flex-1">
                    {(p) => <input {...p} className={adminInputClass} value={s.heading} onChange={(e) => setSection(i, { heading: e.target.value })} />}
                  </Field>
                  <button type="button" aria-label={`Bölüm ${i + 1}: yukarı taşı`} disabled={i === 0} onClick={() => swap(i, i - 1)} className={buttonClass("ghost", "sm", "px-2.5")}>
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Bölüm ${i + 1}: aşağı taşı`}
                    disabled={i === v.guide.sections.length - 1}
                    onClick={() => swap(i, i + 1)}
                    className={buttonClass("ghost", "sm", "px-2.5")}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Bölüm ${i + 1}: sil`}
                    onClick={async () =>
                      (await confirm(`“${s.heading || `Bölüm ${i + 1}`}” bölümü silinsin mi?`, { danger: true })) && setSections(v.guide.sections.filter((_, j) => j !== i))
                    }
                    className={buttonClass("ghost", "sm", "px-2.5 text-danger hover:bg-danger-soft")}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <textarea
                  rows={7}
                  aria-label={`Bölüm ${i + 1} metni`}
                  className={cn(textareaClass, "mt-3")}
                  value={s.body}
                  onChange={(e) => setSection(i, { body: e.target.value })}
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            disabled={v.guide.sections.length >= 12}
            onClick={() => setSections([...v.guide.sections, { heading: "", body: "" }])}
            className={buttonClass("secondary", "sm")}
          >
            <Plus className="size-4" />
            Bölüm ekle
          </button>
          {v.guide.sections.length >= 12 && <p className="text-sm text-muted">En fazla 12 bölüm eklenebilir.</p>}
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-20 -mx-4 flex flex-wrap items-center gap-3 border-t border-border-strong bg-surface px-4 py-3 sm:-mx-8 sm:px-8">
        <div className="me-auto min-w-0">
          {notice ? (
            <InlineNotice notice={notice} />
          ) : (
            <p className="text-[15px] text-muted">{!id ? "Yeni örnek taslak olarak oluşturulur." : dirty ? "Kaydedilmemiş değişiklikler var." : "Tüm değişiklikler kaydedildi."}</p>
          )}
        </div>
        {id && (
          <button type="button" disabled={!dirty || pending} onClick={() => (setV(initial), setNotice(null))} className={buttonClass("ghost", "sm")}>
            Geri al
          </button>
        )}
        <button type="submit" disabled={pending || (!!id && !dirty)} className={buttonClass("primary", "sm")}>
          {id ? "Kaydet" : "Oluştur"}
        </button>
      </div>
    </form>
  );
}
