"use client";

// Zod şemasından form üretir (plan 7.1: "yönetim paneli formu bu şemadan otomatik üretilir").
// Etiket ve görünüm bilgisi şemadaki `.meta()` alanından (AlanMeta) okunur.
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import type { z } from "zod";
import { Girdi, IkonButon, MetinAlani, Onay } from "@/bilesenler/editor/ui";
import type { AlanMeta } from "@/ortak/bloklar";
import { cn } from "@/ortak/cn";

type Yol = (string | number)[];
export type Hatalar = Record<string, string>;
export const yolAnahtari = (yol: Yol) => yol.join(".");

type Tanim = { type: string; shape?: Record<string, z.ZodType>; element?: z.ZodType; entries?: Record<string, string> };

function tanim(s: z.ZodType): Tanim {
  const d = (s as unknown as { def: Tanim & { innerType?: z.ZodType } }).def;
  if (d.type === "optional" || d.type === "default" || d.type === "nullable") return tanim(d.innerType!);
  if (d.type === "object") return { type: "object", shape: (s as unknown as z.ZodObject).shape as Record<string, z.ZodType> };
  if (d.type === "array") return { type: "array", element: (s as unknown as z.ZodArray<z.ZodType>).element };
  return d;
}

function meta(s: z.ZodType): AlanMeta {
  return ((s as unknown as { meta: () => AlanMeta | undefined }).meta?.() ?? { etiket: "" }) as AlanMeta;
}

function tasi<T>(l: T[], i: number, yon: -1 | 1): T[] {
  const y = [...l];
  const j = i + yon;
  if (j < 0 || j >= y.length) return y;
  [y[i], y[j]] = [y[j], y[i]];
  return y;
}

function HataMetni({ hata }: { hata?: string }) {
  return hata ? (
    <p role="alert" className="mt-1 text-xs font-medium text-hata">
      {hata}
    </p>
  ) : null;
}

export function SemaFormu({
  sema,
  deger,
  degistir,
  hatalar = {},
  yol = [],
}: {
  sema: z.ZodType;
  deger: unknown;
  degistir: (d: unknown) => void;
  hatalar?: Hatalar;
  yol?: Yol;
}) {
  const t = tanim(sema);
  const m = meta(sema);
  const hata = hatalar[yolAnahtari(yol)];
  const id = useId();

  if (t.type === "object") {
    const nesne = (deger ?? {}) as Record<string, unknown>;
    const icerik = (
      <div className="grid gap-4">
        {Object.entries(t.shape!).map(([k, alt]) => (
          <SemaFormu
            key={k}
            sema={alt}
            deger={nesne[k]}
            degistir={(d) => degistir({ ...nesne, [k]: d })}
            hatalar={hatalar}
            yol={[...yol, k]}
          />
        ))}
      </div>
    );
    // Kök nesne ve dizi öğeleri çerçevesiz; adlandırılmış alt nesneler (ör. buton) gruplanır.
    if (!m.etiket) return icerik;
    return (
      <fieldset className="rounded-xl border border-cizgi p-4">
        <legend className="px-1.5 text-[13px] font-semibold text-metin">{m.etiket}</legend>
        {icerik}
      </fieldset>
    );
  }

  if (t.type === "array") {
    const liste = Array.isArray(deger) ? deger : [];
    const ogeTanimi = tanim(t.element!);
    const ilkel = ogeTanimi.type !== "object";
    return (
      <div>
        <p className="mb-1.5 text-[13px] font-semibold text-metin">{m.etiket}</p>
        {m.ipucu && <p className="-mt-1 mb-2 text-xs text-soluk">{m.ipucu}</p>}
        <div className="space-y-2">
          {liste.map((oge, i) =>
            ilkel ? (
              <div key={i} className="flex gap-1">
                <Girdi
                  aria-label={`${m.etiket} ${i + 1}`}
                  value={String(oge ?? "")}
                  onChange={(e) => degistir(liste.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <ListeAraclari liste={liste} i={i} degistir={degistir} etiket={`${m.etiket} ${i + 1}`} />
              </div>
            ) : (
              <DiziOgesi
                key={i}
                baslik={String((oge as Record<string, unknown>)?.[m.ozetAlani ?? ""] ?? "") || `${m.etiket} ${i + 1}`}
                araclar={<ListeAraclari liste={liste} i={i} degistir={degistir} etiket={`${m.etiket} ${i + 1}`} />}
                hataVar={Object.keys(hatalar).some((h) => h.startsWith(yolAnahtari([...yol, i]) + "."))}
              >
                <SemaFormu
                  sema={t.element!}
                  deger={oge}
                  degistir={(d) => degistir(liste.map((x, j) => (j === i ? d : x)))}
                  hatalar={hatalar}
                  yol={[...yol, i]}
                />
              </DiziOgesi>
            ),
          )}
        </div>
        <button
          type="button"
          onClick={() => degistir([...liste, bosOge(t.element!)])}
          className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-ana-metin hover:bg-ana-acik"
        >
          <Plus className="size-4" />
          Ekle
        </button>
        <HataMetni hata={hata} />
      </div>
    );
  }

  if (t.type === "boolean")
    return <Onay etiket={m.etiket} checked={!!deger} onChange={(d) => degistir(d)} />;

  if (t.type === "enum") {
    const secenekler = Object.values(t.entries ?? {});
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-metin">
          {m.etiket}
        </label>
        <select
          id={id}
          value={String(deger ?? "")}
          onChange={(e) => degistir(e.target.value)}
          className="h-10 w-full rounded-lg border border-cizgi-guclu bg-yuzey px-3 text-[15px] text-metin"
        >
          {secenekler.map((s) => (
            <option key={s} value={s}>
              {m.secenekEtiketleri?.[s] ?? s}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // metin
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-metin">
        {m.etiket}
      </label>
      {m.gorunum === "uzun" ? (
        <MetinAlani
          id={id}
          rows={3}
          value={String(deger ?? "")}
          aria-invalid={!!hata}
          onChange={(e) => degistir(e.target.value)}
        />
      ) : (
        <Girdi
          id={id}
          value={String(deger ?? "")}
          aria-invalid={!!hata}
          className={cn(hata && "border-hata")}
          onChange={(e) => degistir(e.target.value)}
        />
      )}
      {m.ipucu && <p className="mt-1 text-xs text-soluk">{m.ipucu}</p>}
      <HataMetni hata={hata} />
    </div>
  );
}

function bosOge(s: z.ZodType): unknown {
  const t = tanim(s);
  if (t.type === "object") return Object.fromEntries(Object.entries(t.shape!).map(([k, a]) => [k, bosOge(a)]));
  if (t.type === "array") return [];
  if (t.type === "boolean") return false;
  return "";
}

function ListeAraclari({
  liste,
  i,
  degistir,
  etiket,
}: {
  liste: unknown[];
  i: number;
  degistir: (d: unknown) => void;
  etiket: string;
}) {
  return (
    <span className="flex shrink-0 items-center">
      <IkonButon etiket={`Yukarı: ${etiket}`} disabled={i === 0} onClick={() => degistir(tasi(liste, i, -1))}>
        <ChevronUp className="size-4" />
      </IkonButon>
      <IkonButon etiket={`Aşağı: ${etiket}`} disabled={i === liste.length - 1} onClick={() => degistir(tasi(liste, i, 1))}>
        <ChevronDown className="size-4" />
      </IkonButon>
      <IkonButon etiket={`Sil: ${etiket}`} tehlike onClick={() => degistir(liste.filter((_, j) => j !== i))}>
        <Trash2 className="size-4" />
      </IkonButon>
    </span>
  );
}

function DiziOgesi({
  baslik,
  araclar,
  hataVar,
  children,
}: {
  baslik: string;
  araclar: React.ReactNode;
  hataVar: boolean;
  children: React.ReactNode;
}) {
  const [acik, setAcik] = useState(false);
  return (
    <div className={cn("rounded-lg border bg-zemin/60", hataVar ? "border-hata" : "border-cizgi")}>
      <div className="flex min-h-11 items-center pe-1">
        <button
          type="button"
          aria-expanded={acik || hataVar}
          onClick={() => setAcik(!acik)}
          className="flex min-h-11 min-w-0 flex-1 items-center gap-2 ps-3 text-start text-sm font-semibold text-metin"
        >
          <ChevronDown className={cn("size-3.5 shrink-0 text-soluk transition-transform", !(acik || hataVar) && "-rotate-90")} />
          <span className="truncate">{baslik}</span>
        </button>
        {araclar}
      </div>
      {(acik || hataVar) && <div className="border-t border-cizgi p-3">{children}</div>}
    </div>
  );
}
