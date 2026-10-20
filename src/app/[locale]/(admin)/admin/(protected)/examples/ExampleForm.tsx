"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/Button";
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

const input =
  "mt-1.5 block w-full rounded-lg border border-border-strong bg-surface px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-surface-2 disabled:text-muted";

function Label({ text, hint, children }: { text: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {text}
      {children}
      {hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}
    </label>
  );
}

/** Page details and the occupation guide. The resume itself is edited in the CV editor. */
export function ExampleForm({ id, initial, slugLocked }: { id?: string; initial: ExampleFormValues; slugLocked: boolean }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof ExampleFormValues>(k: K, value: ExampleFormValues[K]) => {
    setSaved(false);
    setV((x) => ({ ...x, [k]: value }));
  };
  const setSections = (sections: ExampleGuide["sections"]) => set("guide", { ...v.guide, sections });
  const words = guideWordCount(v.guide);

  const submit = () =>
    startTransition(async () => {
      const r = id ? await updateExampleMetaAction(id, v) : await createExampleAction(v);
      if (!r.ok) return setError(r.error);
      setError("");
      if (!id && r.id) router.push({ pathname: "/admin/examples/[id]", params: { id: r.id } });
      else {
        setSaved(true);
        router.refresh();
      }
    });

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <section className="grid gap-5 rounded-2xl border border-border bg-surface p-6 shadow-card sm:grid-cols-2">
        <Label text="Sayfa başlığı (h1)" hint="Örn. Hemşire CV Örneği">
          <input className={cn(input, "h-10")} value={v.title} onChange={(e) => set("title", e.target.value)} required />
        </Label>
        <Label text="Meslek" hint="“Hemşire CV'si yazarken” başlığında kullanılır">
          <input className={cn(input, "h-10")} value={v.occupation} onChange={(e) => set("occupation", e.target.value)} required />
        </Label>
        <Label
          text="Adres (slug)"
          hint={slugLocked ? "Yayındaki örneğin adresi değiştirilemez." : "Türkçe: …-cv-ornegi, İngilizce: …-resume. Yayınlandıktan sonra değişmez."}
        >
          <input
            className={cn(input, "h-10 font-mono")}
            value={v.slug}
            disabled={slugLocked}
            onChange={(e) => set("slug", e.target.value.toLowerCase())}
            required
          />
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <Label text="Dil">
            <select
              className={cn(input, "h-10")}
              value={v.locale}
              disabled={slugLocked}
              onChange={(e) => set("locale", e.target.value as "tr" | "en")}
            >
              <option value="tr">Türkçe</option>
              <option value="en">İngilizce</option>
            </select>
          </Label>
          <Label text="Seviye">
            <select
              className={cn(input, "h-10")}
              value={v.experienceLevel}
              onChange={(e) => set("experienceLevel", e.target.value as ExampleFormValues["experienceLevel"])}
            >
              {EXPERIENCE_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {LEVEL_NAMES[l]}
                </option>
              ))}
            </select>
          </Label>
        </div>
        <Label text="Kategori">
          <select className={cn(input, "h-10")} value={v.category} onChange={(e) => set("category", e.target.value)}>
            {EXAMPLE_CATEGORY_IDS.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_NAMES[c]}
              </option>
            ))}
          </select>
        </Label>
        <Label text="Sıra" hint="Küçük sayı önce gelir; eşitse en çok kullanılan önce">
          <input
            type="number"
            min={0}
            className={cn(input, "h-10")}
            value={v.sortOrder}
            onChange={(e) => set("sortOrder", Math.max(0, Number(e.target.value) || 0))}
          />
        </Label>
        <Label text={`Meta başlık (${v.metaTitle.length}/60)`}>
          <input className={cn(input, "h-10")} value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
        </Label>
        <Label text={`Meta açıklama (${v.metaDescription.length}/155)`}>
          <textarea
            rows={2}
            className={cn(input, "py-2")}
            value={v.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
          />
        </Label>
      </section>

      <section className="space-y-5 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">Meslek rehberi</h2>
          <span className={cn("text-sm tabular-nums", words < 400 || words > 800 ? "text-warning" : "text-muted")}>
            {words} kelime (hedef 400–800)
          </span>
        </div>
        <p className="text-xs text-muted">Boş satır yeni paragraf, “- ” ile başlayan satırlar liste, **iki yıldız** kalın.</p>
        <Label text="Giriş" hint="Başlığın altında görünür; meta açıklama boşsa ilk 155 karakteri kullanılır">
          <textarea
            rows={3}
            className={cn(input, "py-2")}
            value={v.guide.intro}
            onChange={(e) => set("guide", { ...v.guide, intro: e.target.value })}
          />
        </Label>
        {v.guide.sections.map((s, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label text={`Bölüm ${i + 1} başlığı`}>
                  <input
                    className={cn(input, "h-10")}
                    value={s.heading}
                    onChange={(e) => setSections(v.guide.sections.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)))}
                  />
                </Label>
              </div>
              <button
                type="button"
                aria-label="Yukarı taşı"
                disabled={i === 0}
                onClick={() => {
                  const l = [...v.guide.sections];
                  [l[i - 1], l[i]] = [l[i], l[i - 1]];
                  setSections(l);
                }}
                className={buttonClass("ghost", "sm", "px-2")}
              >
                <ArrowUp className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Aşağı taşı"
                disabled={i === v.guide.sections.length - 1}
                onClick={() => {
                  const l = [...v.guide.sections];
                  [l[i + 1], l[i]] = [l[i], l[i + 1]];
                  setSections(l);
                }}
                className={buttonClass("ghost", "sm", "px-2")}
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Bölümü sil"
                onClick={() => confirm("Bölüm silinsin mi?") && setSections(v.guide.sections.filter((_, j) => j !== i))}
                className={buttonClass("ghost", "sm", "px-2 text-danger")}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <textarea
              rows={6}
              aria-label={`Bölüm ${i + 1} metni`}
              className={cn(input, "mt-3 py-2")}
              value={s.body}
              onChange={(e) => setSections(v.guide.sections.map((x, j) => (j === i ? { ...x, body: e.target.value } : x)))}
            />
          </div>
        ))}
        <button
          type="button"
          disabled={v.guide.sections.length >= 12}
          onClick={() => setSections([...v.guide.sections, { heading: "", body: "" }])}
          className={buttonClass("secondary", "sm")}
        >
          <Plus className="size-4" />
          Bölüm ekle
        </button>
      </section>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
          {id ? "Kaydet" : "Oluştur"}
        </button>
        {saved && <span className="text-sm text-accent">Kaydedildi</span>}
        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
