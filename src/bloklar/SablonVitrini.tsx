import { ArrowRight, ShieldCheck } from "lucide-react";
import { SablonOnizleme } from "@/bilesenler/cv/SablonOnizleme";
import { Kademeli, KademeliOge } from "@/bilesenler/hareket/Belir";
import { Link } from "@/i18n/navigation";
import type { SablonKimligi } from "@/ortak/cv/sema";
import { ONE_CIKAN_SABLONLAR, SISTEM_SABLON_LISTESI, SISTEM_SABLONLARI } from "@/ortak/cv/tasarim";
import { Bolum, BolumBasligi } from "./ortak";

export type SablonVitriniIcerik = {
  ust: string;
  baslik: string;
  aciklama: string;
  sec: string;
  atsEtiketi: (puan: number) => string;
  /** "{n} şablonun hepsini gör" bağlantısının metni. */
  tumu: (n: number) => string;
  adlar: Record<SablonKimligi, string>;
  dil: "tr" | "en";
};

// Faz 1'de liste `sablonlar` tablosundan kullanım ve puana göre gelir (plan 6.3/4).
// Şimdilik öne çıkan sistem şablonları; küçük resimler gerçek çizim motorundan basılır.
export function SablonVitrini({ icerik }: { icerik: SablonVitriniIcerik }) {
  return (
    <Bolum>
      <BolumBasligi ust={icerik.ust} baslik={icerik.baslik} aciklama={icerik.aciklama} />
      <Kademeli as="ul" className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {ONE_CIKAN_SABLONLAR.map((s, i) => (
          <KademeliOge as="li" key={s} sira={i}>
            <Link
              href="/cv-olustur"
              className="group block rounded-2xl border border-cizgi bg-yuzey p-2.5 shadow-kart transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-cizgi-guclu hover:shadow-yuksek"
            >
              <div className="relative overflow-hidden rounded-lg ring-1 ring-black/5">
                <SablonOnizleme kimlik={s} dil={icerik.dil} ilkOlcek={0.42} />
                <span className="absolute inset-x-2 bottom-2 flex translate-y-2 items-center justify-center gap-1.5 rounded-lg bg-ana py-2 text-xs font-semibold text-white opacity-0 shadow-yuksek transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {icerik.sec}
                  <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 px-1.5 pt-3 pb-1">
                <span className="text-sm font-semibold text-metin">{icerik.adlar[s]}</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-vurgu">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  {icerik.atsEtiketi(SISTEM_SABLONLARI[s].ats)}
                </span>
              </div>
            </Link>
          </KademeliOge>
        ))}
      </Kademeli>
      <p className="mt-10 text-center">
        <Link
          href="/cv-olustur"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ana underline-offset-4 hover:underline"
        >
          {icerik.tumu(SISTEM_SABLON_LISTESI.length)}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      </p>
    </Bolum>
  );
}
