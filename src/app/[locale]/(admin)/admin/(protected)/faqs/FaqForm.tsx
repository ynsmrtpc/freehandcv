"use client";

import { useId, useState } from "react";
import { adminInputClass, InlineNotice, TextField, useAction } from "@/components/admin/forms";
import { buttonClass } from "@/components/ui/Button";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { importFaqsAction, saveFaqAction } from "./actions";

type Value = { locale: "tr" | "en"; question: string; answer: string; category: string; sortOrder: number; active: boolean };

export function FaqForm({ id, initial, categories }: { id: string | null; initial: Value; categories: string[] }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [issues, setIssues] = useState<Record<string, string>>({});
  const { notice, setNotice, pending, run } = useAction();
  const answerId = useId();
  const listId = useId();

  return (
    <form
      className="max-w-2xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setIssues({});
        run(
          async () => {
            const r = await saveFaqAction(id, v);
            if (!r.ok && r.issues) setIssues(r.issues);
            return r;
          },
          (r) => {
            if (!id && "id" in r && r.id) router.replace({ pathname: "/admin/faqs/[id]", params: { id: String(r.id) } });
          },
        );
      }}
      onChange={() => notice?.kind === "success" && setNotice(null)}
    >
      <fieldset>
        <legend className="text-[15px] font-semibold text-foreground">Dil</legend>
        <div className="mt-1.5 flex gap-1.5">
          {(["tr", "en"] as const).map((l) => (
            <label
              key={l}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-semibold",
                v.locale === l ? "border-primary bg-primary-soft text-primary-text" : "border-border bg-surface text-foreground",
              )}
            >
              <input type="radio" name="locale" className="sr-only" checked={v.locale === l} onChange={() => setV({ ...v, locale: l })} />
              {l === "tr" ? "Türkçe" : "İngilizce"}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <TextField label="Soru" required maxLength={300} value={v.question} onChange={(e) => setV({ ...v, question: e.target.value })} />
        {issues.question && <p role="alert" className="mt-1 text-sm font-medium text-danger">{issues.question}</p>}
      </div>

      <div>
        <label htmlFor={answerId} className="block text-[15px] font-semibold text-foreground">
          Cevap
        </label>
        <textarea
          id={answerId}
          required
          maxLength={4000}
          rows={6}
          value={v.answer}
          onChange={(e) => setV({ ...v, answer: e.target.value })}
          className={cn(adminInputClass, "mt-1.5 h-auto py-2.5 leading-relaxed")}
        />
        <p className="mt-1.5 text-sm text-muted">Düz metin. Kısa ve doğrudan yaz; ilk cümle soruyu cevaplasın.</p>
        {issues.answer && <p role="alert" className="mt-1 text-sm font-medium text-danger">{issues.answer}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <div>
          <TextField
            label="Kategori"
            required
            list={listId}
            value={v.category}
            onChange={(e) => setV({ ...v, category: e.target.value.toLowerCase() })}
            hint="Küçük harf, rakam ve -. SSS bloğuna aynısını yazarsın (ör. genel)."
          />
          <datalist id={listId}>
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {issues.category && <p role="alert" className="mt-1 text-sm font-medium text-danger">{issues.category}</p>}
        </div>
        <TextField
          label="Sıra"
          type="number"
          min={0}
          max={10000}
          value={v.sortOrder}
          onChange={(e) => setV({ ...v, sortOrder: Math.max(0, Math.round(Number(e.target.value) || 0)) })}
          hint="Küçük önce gelir."
        />
      </div>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-foreground">
        <input type="checkbox" className="size-[18px] accent-[var(--primary)]" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} />
        Yayında (gizliyse hiçbir sayfada görünmez)
      </label>

      <InlineNotice notice={notice} />
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {id ? "Kaydet" : "Soruyu ekle"}
      </button>
    </form>
  );
}

export function ImportFaqsButton() {
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-3 border-b border-border pb-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-[15px] text-muted">Sayfalardaki SSS bloklarına elle yazılmış sorular havuza kopyalanır; havuzda olanlar atlanır.</p>
        <button type="button" disabled={pending} onClick={() => run(importFaqsAction)} className={buttonClass("secondary", "sm")}>
          Sayfalardan aktar
        </button>
      </div>
      <InlineNotice notice={notice} />
    </div>
  );
}
