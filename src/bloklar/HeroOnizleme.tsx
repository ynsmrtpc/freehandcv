"use client";

import { CheckCircle2, FileDown, ShieldCheck } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { MiniCv, SABLONLAR, type SablonKimligi } from "@/bilesenler/cv-onizleme/MiniCv";
import { cn } from "@/ortak/cn";

const SURE_MS = 3600;

type Props = {
  dil: "tr" | "en";
  adlar: Record<SablonKimligi, string>;
  etiketler: { sablon: string; atsUyumlu: string; pdfHazir: string; ikKontrolu: string };
};

/** Şablonlar arasında kendiliğinden dönen önizleme; alttaki düğmelerle elle de seçilir. */
export function HeroOnizleme({ dil, adlar, etiketler }: Props) {
  const [sira, setSira] = useState(0);
  const [durdu, setDurdu] = useState(false);
  const sablon = SABLONLAR[sira];

  useEffect(() => {
    if (durdu) return;
    const zamanlayici = setInterval(() => setSira((s) => (s + 1) % SABLONLAR.length), SURE_MS);
    return () => clearInterval(zamanlayici);
  }, [durdu]);

  return (
    <div
      className="relative mx-auto w-full max-w-[420px]"
      onMouseEnter={() => setDurdu(true)}
      onMouseLeave={() => setDurdu(false)}
      onFocus={() => setDurdu(true)}
      onBlur={() => setDurdu(false)}
    >
      {/* Arkadaki kâğıt yığını */}
      <div aria-hidden className="absolute inset-x-6 top-6 bottom-10 rotate-[-5deg] rounded-xl bg-yuzey-2 shadow-yuksek ring-1 ring-cizgi" />
      <div aria-hidden className="absolute inset-x-3 top-3 bottom-8 rotate-[3deg] rounded-xl bg-yuzey shadow-yuksek ring-1 ring-cizgi" />

      <div className="relative overflow-hidden rounded-xl shadow-kagit ring-1 ring-black/5">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.div
            key={sablon}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.01, y: -6, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <MiniCv sablon={sablon} dil={dil} />
          </m.div>
        </AnimatePresence>
      </div>

      {/* Yüzen rozetler */}
      <m.div
        aria-hidden
        className="absolute -start-4 top-[27%] flex items-center gap-2 rounded-xl bg-yuzey px-3 py-2 text-[13px] font-semibold text-metin shadow-yuksek ring-1 ring-cizgi sm:-start-10"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ShieldCheck className="size-4 text-vurgu" />
        {etiketler.atsUyumlu}
      </m.div>
      <m.div
        aria-hidden
        className="absolute -end-3 top-[46%] flex items-center gap-2 rounded-xl bg-yuzey px-3 py-2 text-[13px] font-semibold text-metin shadow-yuksek ring-1 ring-cizgi sm:-end-8"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <CheckCircle2 className="size-4 text-vurgu" />
        {etiketler.ikKontrolu}
      </m.div>
      <m.div
        aria-hidden
        className="absolute bottom-[14%] -start-2 flex items-center gap-2 rounded-xl bg-ana px-3 py-2 text-[13px] font-semibold text-white shadow-yuksek sm:-start-6"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.6 }}
      >
        <FileDown className="size-4" />
        {etiketler.pdfHazir}
      </m.div>

      {/* Şablon seçici */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label={etiketler.sablon}>
        {SABLONLAR.map((s, i) => (
          <button
            key={s}
            type="button"
            aria-pressed={i === sira}
            onClick={() => setSira(i)}
            className={cn(
              "h-9 rounded-full px-3.5 text-xs font-semibold transition-colors duration-200",
              i === sira ? "bg-ana text-white" : "text-soluk hover:bg-yuzey-2 hover:text-metin",
            )}
          >
            {adlar[s]}
          </button>
        ))}
      </div>
    </div>
  );
}
