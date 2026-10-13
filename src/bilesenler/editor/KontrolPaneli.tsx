"use client";

import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useEditor } from "@/istemci/editor/depo";
import { cn } from "@/ortak/cn";
import { kontroller, kontrolPuani, type KontrolSonucu } from "@/ortak/cv/kontroller";
import { sistemTanimi } from "@/ortak/cv/tasarim";

export function useKontrol() {
  const veri = useEditor((d) => d.veri);
  const sayfa = useEditor((d) => d.sayfaSayisi);
  return useMemo(() => {
    if (!veri) return null;
    const sonuclar = kontroller(veri, sistemTanimi(veri.ayarlar.sablon), sayfa);
    return { sonuclar, ...kontrolPuani(sonuclar) };
  }, [veri, sayfa]);
}

const IKON = { iyi: CheckCircle2, uyari: AlertTriangle, bilgi: Info };
const RENK = { iyi: "text-vurgu", uyari: "text-uyari", bilgi: "text-ana-metin" };

export function KontrolPaneli() {
  const t = useTranslations("Kontrol");
  const k = useKontrol();
  if (!k) return null;
  const { sonuclar, puan, iyi, toplam } = k;
  const durum = puan >= 90 ? "hazir" : puan >= 70 ? "iyiDurumda" : "gelistir";
  const cevre = 2 * Math.PI * 30;

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-center gap-4 rounded-xl border border-cizgi bg-yuzey p-4 shadow-kart">
        <div className="relative size-18 shrink-0">
          <svg viewBox="0 0 72 72" className="size-full -rotate-90" aria-hidden>
            <circle cx="36" cy="36" r="30" fill="none" strokeWidth="7" className="stroke-yuzey-2" />
            <circle
              cx="36"
              cy="36"
              r="30"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={cevre}
              strokeDashoffset={cevre * (1 - puan / 100)}
              className={cn("transition-[stroke-dashoffset] duration-500", puan >= 80 ? "stroke-vurgu" : "stroke-uyari")}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-xl font-bold text-metin tabular-nums">{puan}</span>
        </div>
        <div>
          <h3 className="font-bold text-metin">{t(durum)}</h3>
          <p className="mt-1 text-[13px] text-soluk">{t("puanOzeti", { iyi, toplam })}</p>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-cizgi rounded-xl border border-cizgi bg-yuzey shadow-kart">
        {sonuclar.map((s) => (
          <KontrolSatiri key={s.kimlik} s={s} />
        ))}
      </ul>

      <div className="mt-4 rounded-xl bg-ana-acik p-4">
        <h3 className="text-sm font-bold text-ana-metin">{t("rehberBaslik")}</h3>
        <ul className="mt-2 list-disc space-y-1.5 ps-5 text-[13px] leading-relaxed text-metin">
          {(t.raw("rehber") as string[]).map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KontrolSatiri({ s }: { s: KontrolSonucu }) {
  const t = useTranslations("Kontrol");
  const Ikon = IKON[s.durum];
  return (
    <li className="flex gap-3 px-4 py-3">
      <Ikon className={cn("mt-0.5 size-[18px] shrink-0", RENK[s.durum])} aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-metin">
          <span className="sr-only">{s.durum}: </span>
          {t(`${s.kimlik}.baslik` as never, s.degerler as never)}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-soluk">
          {t(`${s.kimlik}.${s.anahtar}` as never, s.degerler as never)}
        </p>
      </div>
    </li>
  );
}
