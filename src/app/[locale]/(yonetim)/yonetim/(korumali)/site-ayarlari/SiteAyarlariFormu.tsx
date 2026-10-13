"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { SemaFormu, yolAnahtari, type Hatalar } from "@/bilesenler/yonetim/SemaFormu";
import { cn } from "@/ortak/cn";
import { dilAyarSemasi, genelAyarSemasi, type DilAyarlari, type GenelAyarlar } from "@/ortak/siteAyarlari";
import { siteAyarlariKaydetEylemi } from "./eylemler";

type Deger = { genel: GenelAyarlar; ceviriler: Record<string, DilAyarlari> };
const DIL_ADI: Record<string, string> = { tr: "Türkçe", en: "English" };

export function SiteAyarlariFormu({ baslangic, diller }: { baslangic: Deger; diller: string[] }) {
  const router = useRouter();
  const [deger, setDeger] = useState(baslangic);
  const [dil, setDil] = useState(diller[0]);
  const [hatalar, setHatalar] = useState<Hatalar>({});
  const [mesaj, setMesaj] = useState<{ tur: "iyi" | "hata"; metin: string } | null>(null);
  const [bekliyor, gecis] = useTransition();
  const kirli = JSON.stringify(deger) !== JSON.stringify(baslangic);

  const kaydet = () =>
    gecis(async () => {
      const s = await siteAyarlariKaydetEylemi(deger);
      if (s.tamam) {
        setHatalar({});
        setMesaj({ tur: "iyi", metin: "Kaydedildi. Değişiklikler sitede hemen görünür." });
        router.refresh();
      } else {
        setHatalar(Object.fromEntries((s.sorunlar ?? []).map((x) => [yolAnahtari(x.yol), x.mesaj])));
        setMesaj({ tur: "hata", metin: s.hata });
      }
    });

  const altHatalar = (onek: string) =>
    Object.fromEntries(
      Object.entries(hatalar)
        .filter(([k]) => k.startsWith(onek + "."))
        .map(([k, v]) => [k.slice(onek.length + 1), v]),
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-5 sm:p-8">
      {mesaj && (
        <p
          role={mesaj.tur === "hata" ? "alert" : "status"}
          className={cn(
            "rounded-xl px-4 py-3 text-sm font-medium",
            mesaj.tur === "hata" ? "bg-hata-acik text-hata" : "bg-vurgu-acik text-vurgu",
          )}
        >
          {mesaj.metin}
        </p>
      )}

      <section className="rounded-2xl border border-cizgi bg-yuzey p-5 shadow-kart">
        <h2 className="mb-4 font-bold text-metin">Genel</h2>
        <SemaFormu
          sema={genelAyarSemasi}
          deger={deger.genel}
          degistir={(d) => setDeger({ ...deger, genel: d as GenelAyarlar })}
          hatalar={altHatalar("genel")}
        />
      </section>

      <section className="rounded-2xl border border-cizgi bg-yuzey p-5 shadow-kart">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-bold text-metin">Dile bağlı</h2>
          <div role="tablist" className="flex rounded-lg border border-cizgi p-0.5">
            {diller.map((d) => (
              <button
                key={d}
                role="tab"
                type="button"
                aria-selected={dil === d}
                onClick={() => setDil(d)}
                className={cn(
                  "h-8 rounded-md px-3 text-sm font-semibold",
                  dil === d ? "bg-yuzey-2 text-metin" : "text-soluk hover:text-metin",
                  Object.keys(hatalar).some((k) => k.startsWith(`ceviriler.${d}.`)) && "text-hata",
                )}
              >
                {DIL_ADI[d] ?? d}
              </button>
            ))}
          </div>
        </div>
        <SemaFormu
          key={dil}
          sema={dilAyarSemasi}
          deger={deger.ceviriler[dil]}
          degistir={(d) => setDeger({ ...deger, ceviriler: { ...deger.ceviriler, [dil]: d as DilAyarlari } })}
          hatalar={altHatalar(`ceviriler.${dil}`)}
        />
      </section>

      <div className="sticky bottom-0 -mx-5 flex justify-end gap-2 border-t border-cizgi bg-zemin/90 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <button type="button" disabled={!kirli || bekliyor} onClick={() => setDeger(baslangic)} className={butonSinifi("hayalet", "kucuk")}>
          Değişiklikleri geri al
        </button>
        <button type="button" disabled={!kirli || bekliyor} onClick={kaydet} className={butonSinifi("ana", "kucuk")}>
          Kaydet
        </button>
      </div>
    </div>
  );
}
