"use client";

import { Maximize2, Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { CvBelge } from "@/bilesenler/cv/CvBelge";
import { useEditor } from "@/istemci/editor/depo";
import { cn } from "@/ortak/cn";
import { KAGIT_OLCULERI, sistemTanimi } from "@/ortak/cv/tasarim";
import { IkonButon } from "./ui";

type Blok = { el: Element; ust: Element };

/**
 * Yazdırmada bölünmeyen bloklar: kısa kayıtlar, maddeler, liste öğeleri ve "başlık + ilk blok".
 * Sayfa sınırına denk gelen blok, yazdırmadaki gibi bir sonraki sayfaya itilmiş sayılır.
 */
function bolunmezBloklar(kok: Element): Blok[] {
  const l: Blok[] = [];
  kok.querySelectorAll(".cv-bolum").forEach((b) => {
    const parcalar: Element[] = [];
    Array.from(b.children).forEach((c) => {
      if (c.tagName === "H2") return;
      if (c.classList.contains("cv-kalem") && !c.classList.contains("kisa")) {
        parcalar.push(c.querySelector(".cv-kalem-ust") ?? c);
        c.querySelectorAll(":scope > p, :scope > ul > li").forEach((x) => parcalar.push(x));
      } else if (c.matches(".cv-liste, .cv-referanslar, .cv-yet-izgara, .cv-yet-akis, .cv-ozet")) {
        Array.from(c.children).forEach((x) => parcalar.push(x));
      } else if (c.matches(".cv-yetenek")) {
        c.querySelectorAll("dd").forEach((x) => parcalar.push(x));
      } else parcalar.push(c);
    });
    const h2 = b.querySelector(":scope > h2");
    parcalar.forEach((p, i) => l.push({ el: p, ust: i === 0 && h2 ? h2 : p }));
    if (!parcalar.length && h2) l.push({ el: h2, ust: h2 });
  });
  return l;
}

export function Onizleme() {
  const t = useTranslations("Editor");
  const dil = useLocale();
  const veri = useEditor((d) => d.veri)!;
  const tanim = sistemTanimi(veri.ayarlar.sablon);
  const kagit = KAGIT_OLCULERI[veri.ayarlar.kagit];

  const tuvalRef = useRef<HTMLDivElement>(null);
  const sayfaRef = useRef<HTMLDivElement>(null);
  const [olcek, setOlcek] = useState<{ kip: "sigdir" | "elle"; deger: number }>({ kip: "sigdir", deger: 1 });
  const [kirilmalar, setKirilmalar] = useState<number[]>([]);
  const sayfaSayisi = useEditor((d) => d.sayfaSayisi);

  // Ekrana sığdır: kâğıt genişliği (96 dpi'da mm → px) tuval genişliğine oranlanır.
  const sigdir = useCallback(() => {
    const tuval = tuvalRef.current;
    if (!tuval) return;
    const kagitPx = (kagit.genislik * 96) / 25.4;
    const deger = Math.max(0.3, Math.min(1.25, (tuval.clientWidth - 48) / kagitPx));
    setOlcek((o) => (o.kip === "sigdir" ? { kip: "sigdir", deger } : o));
  }, [kagit.genislik]);

  useEffect(() => {
    sigdir();
    const tuval = tuvalRef.current;
    if (!tuval) return;
    const g = new ResizeObserver(sigdir);
    g.observe(tuval);
    return () => g.disconnect();
  }, [sigdir]);

  const olc = useCallback(() => {
    const sayfa = sayfaRef.current;
    const cv = sayfa?.querySelector<HTMLElement>(".cv");
    const icerik = sayfa?.querySelector(".cv-icerik");
    if (!sayfa || !cv || !icerik) return;
    cv.style.minHeight = "";
    const pxMm = sayfa.getBoundingClientRect().width / kagit.genislik;
    if (!pxMm) return;
    const icerikY = kagit.yukseklik - tanim.kenarBosluk.ust - tanim.kenarBosluk.alt;
    const kok = icerik.getBoundingClientRect().top;
    const mm = (y: number) => (y - kok) / pxMm;
    const yeni: number[] = [];
    let kayma = 0;
    let sinir = icerikY;
    const ana = icerik.querySelector(".cv-ana") ?? icerik;
    for (const b of bolunmezBloklar(ana)) {
      const ust = mm(b.ust.getBoundingClientRect().top);
      const alt = mm(b.el.getBoundingClientRect().bottom);
      while (alt + kayma > sinir + 0.3) {
        if (ust + kayma < sinir && alt - ust < icerikY) {
          yeni.push(ust);
          kayma += sinir - (ust + kayma);
        } else yeni.push(sinir - kayma);
        sinir += icerikY;
      }
    }
    const toplam = mm(icerik.getBoundingClientRect().bottom) + kayma;
    const sayi = Math.max(1, yeni.length + 1, Math.ceil((toplam - 0.5) / icerikY));
    // Kayan blokların bıraktığı boşluk kadar sayfa uzar; son sayfa ekranda tam görünsün.
    cv.style.minHeight = `${sayi * kagit.yukseklik}mm`;
    setKirilmalar(yeni);
    if (useEditor.getState().sayfaSayisi !== sayi) useEditor.setState({ sayfaSayisi: sayi });
  }, [kagit, tanim]);

  useLayoutEffect(() => {
    olc();
  }, [veri, olcek.deger, olc]);

  useEffect(() => {
    document.fonts?.ready.then(olc);
  }, [olc]);

  const zoom = (fark: number) =>
    setOlcek((o) => ({ kip: "elle", deger: Math.max(0.3, Math.min(2, +(o.deger + fark).toFixed(2))) }));

  return (
    <div className="onizleme-kok flex h-full min-h-0 flex-col">
      <div className="onizleme-cubuk flex h-12 shrink-0 items-center justify-between gap-2 border-b border-cizgi bg-yuzey px-3">
        <p className={cn("text-[13px] font-medium", sayfaSayisi > 2 ? "text-uyari" : "text-soluk")} aria-live="polite">
          {t("sayfa.bilgi", { kagit: veri.ayarlar.kagit, n: sayfaSayisi })}
          {sayfaSayisi > 2 && <span className="hidden sm:inline"> — {t("sayfa.uzun")}</span>}
        </p>
        <div className="flex items-center gap-0.5">
          <IkonButon etiket={t("arac.uzaklas")} onClick={() => zoom(-0.1)}>
            <Minus className="size-4" />
          </IkonButon>
          <span className="w-12 text-center text-[13px] font-medium text-soluk tabular-nums">
            {new Intl.NumberFormat(dil, { style: "percent" }).format(olcek.deger)}
          </span>
          <IkonButon etiket={t("arac.yakinlas")} onClick={() => zoom(0.1)}>
            <Plus className="size-4" />
          </IkonButon>
          <IkonButon
            etiket={t("arac.sigdir")}
            aria-pressed={olcek.kip === "sigdir"}
            onClick={() => {
              setOlcek({ kip: "sigdir", deger: olcek.deger });
              requestAnimationFrame(sigdir);
            }}
          >
            <Maximize2 className="size-4" />
          </IkonButon>
        </div>
      </div>

      <div ref={tuvalRef} className="onizleme-tuval min-h-0 flex-1 overflow-auto bg-[#dfe3ea] dark:bg-[#0a0f1a]">
        <div className="yazdir-alani mx-auto w-fit p-6" style={{ zoom: olcek.deger }}>
          <div ref={sayfaRef} className="relative bg-white shadow-kagit">
            <CvBelge veri={veri} tanim={tanim} />
            <div className="sayfa-kilavuzu pointer-events-none absolute inset-0" aria-hidden>
              {kirilmalar.map((y, i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 border-t-2 border-dashed border-ana/60"
                  style={{ top: `${(tanim.kenarBosluk.ust + y).toFixed(1)}mm` }}
                >
                  <span className="absolute end-1 -top-[1.6em] rounded bg-ana px-1.5 py-0.5 font-sans text-[11px] font-semibold text-white">
                    {t("sayfa.sonraki", { n: i + 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
