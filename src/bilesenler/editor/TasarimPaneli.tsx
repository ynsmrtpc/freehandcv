"use client";

import { Check, Pipette, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useEffect, useRef, useState } from "react";
import { SablonOnizleme } from "@/bilesenler/cv/SablonOnizleme";
import { useEditor } from "@/istemci/editor/depo";
import { cn } from "@/ortak/cn";
import { CV_DILLERI } from "@/ortak/cv/basliklar";
import { ARALIKLAR, BOYUTLAR, KAGITLAR, type SablonKimligi } from "@/ortak/cv/sema";
import {
  FONTLAR,
  SISTEM_SABLON_LISTESI,
  SISTEM_SABLONLARI,
  VURGU_RENKLERI,
  kenarliMi,
  type FontKimligi,
  type SistemSablonu,
} from "@/ortak/cv/tasarim";
import { Onay, Segment } from "./ui";

function Baslik({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-xs font-bold tracking-wider text-soluk uppercase">{children}</h3>;
}

const secimSinifi =
  "h-10 w-full rounded-lg border border-cizgi-guclu bg-yuzey px-3 text-[15px] text-metin outline-none focus:border-ana focus:ring-4 focus:ring-ana/15";

export function TasarimPaneli() {
  const t = useTranslations("Editor.tasarim");
  const a = useEditor((d) => d.veri!.ayarlar);
  const degistir = useEditor((d) => d.degistir);
  const ayarla = <K extends keyof typeof a>(k: K, d: (typeof a)[K]) => degistir((v) => void (v.ayarlar[k] = d), false);

  const sablon = SISTEM_SABLONLARI[a.sablon];
  const tekRenk = sablon.tanim.tekRenk;
  const ozelRenk = !VURGU_RENKLERI.some((r) => r.toLowerCase() === a.renk.toLowerCase());

  return (
    <div className="space-y-8 p-4 sm:p-5">
      <SablonSecici secili={a.sablon} dil={a.dil === "tr" ? "tr" : "en"} />

      <section>
        <Baslik>{t("renk")}</Baslik>
        <div className={cn("flex flex-wrap items-center gap-2", tekRenk && "pointer-events-none opacity-40")}>
          {VURGU_RENKLERI.map((r) => {
            const secili = r.toLowerCase() === a.renk.toLowerCase();
            return (
              <button
                key={r}
                type="button"
                aria-pressed={secili}
                aria-label={r}
                onClick={() => ayarla("renk", r)}
                className={cn(
                  "grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-yuzey transition-shadow",
                  secili ? "ring-2 ring-ana" : "hover:ring-2 hover:ring-cizgi-guclu",
                )}
                style={{ background: r }}
              >
                {secili && <Check className="size-4 text-white" strokeWidth={3} />}
              </button>
            );
          })}
          <label
            className={cn(
              "relative grid size-9 cursor-pointer place-items-center rounded-full border border-dashed border-cizgi-guclu text-soluk ring-offset-2 ring-offset-yuzey hover:text-metin",
              ozelRenk && "border-solid ring-2 ring-ana",
            )}
            style={ozelRenk ? { background: a.renk, color: "#fff" } : undefined}
            title={t("ozelRenk")}
          >
            <Pipette className="size-4" />
            <input
              type="color"
              aria-label={t("ozelRenk")}
              className="absolute inset-0 cursor-pointer opacity-0"
              value={a.renk}
              onChange={(e) => {
                const d = e.target.value;
                degistir((v) => void (v.ayarlar.renk = d));
              }}
            />
          </label>
        </div>
        {tekRenk && <p className="mt-2 text-[13px] text-soluk">{t("tekRenk")}</p>}
      </section>

      <section className="space-y-4">
        <Baslik>{t("yazi")}</Baslik>
        <div>
          <label htmlFor="ayar-font" className="mb-1.5 block text-[13px] font-semibold text-metin">
            {t("font")}
          </label>
          <select
            id="ayar-font"
            className={secimSinifi}
            value={a.font}
            onChange={(e) => ayarla("font", e.target.value)}
          >
            <option value="">{t("fontVarsayilan", { ad: FONTLAR[sablon.tanim.yazi.font].ad })}</option>
            {(Object.keys(FONTLAR) as FontKimligi[]).map((f) => (
              <option key={f} value={f}>
                {FONTLAR[f].ad}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          <Segment
            etiket={t("boyut")}
            deger={a.boyut}
            secenekler={BOYUTLAR.map((b) => ({ deger: b, ad: t(`boyutlar.${b}`) }))}
            onChange={(d) => ayarla("boyut", d)}
          />
          <Segment
            etiket={t("aralik")}
            deger={a.aralik}
            secenekler={ARALIKLAR.map((b) => ({ deger: b, ad: t(`araliklar.${b}`) }))}
            onChange={(d) => ayarla("aralik", d)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <Baslik>{t("belge")}</Baslik>
        <div>
          <label htmlFor="ayar-dil" className="mb-1.5 block text-[13px] font-semibold text-metin">
            {t("cvDili")}
          </label>
          <select id="ayar-dil" className={secimSinifi} value={a.dil} onChange={(e) => ayarla("dil", e.target.value)}>
            {Object.entries(CV_DILLERI).map(([k, d]) => (
              <option key={k} value={k}>
                {d.ad}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-relaxed text-soluk">{t("cvDiliIpucu")}</p>
        </div>
        <div>
          <Segment
            etiket={t("kagit")}
            deger={a.kagit}
            secenekler={KAGITLAR.map((k) => ({ deger: k, ad: k }))}
            onChange={(d) => ayarla("kagit", d)}
          />
          <p className="mt-1.5 text-xs text-soluk">{t("kagitIpucu")}</p>
        </div>
        <div>
          <p className="text-[13px] font-semibold text-metin">{t("foto")}</p>
          <Onay
            etiket={sablon.tanim.ustBilgi.foto === "yok" ? t("fotoYok") : t("fotoGoster")}
            checked={a.foto && sablon.tanim.ustBilgi.foto !== "yok"}
            disabled={sablon.tanim.ustBilgi.foto === "yok"}
            onChange={(d) => ayarla("foto", d)}
          />
        </div>
      </section>
    </div>
  );
}

const FILTRELER = {
  tumu: () => true,
  ats: (s: SistemSablonu) => s.ats === 5,
  foto: (s: SistemSablonu) => s.tanim.ustBilgi.foto !== "yok",
  ikiSutun: (s: SistemSablonu) => kenarliMi(s.tanim),
} as const;
type Filtre = keyof typeof FILTRELER;

// Küçük resimler yalnız şablon ve dil değişince yeniden çizilir (editör her tuşta yeniden çizer).
const KucukResim = memo(SablonOnizleme);

/**
 * Şablon seçici: gerçek çizim motorundan küçük resimler, kaydırılabilir ızgara ve filtreler.
 * Şablon değişince CV hâlâ önceki şablonun varsayılan rengindeyse yeni şablonun rengine geçer;
 * kullanıcının kendi seçtiği renk korunur.
 */
function SablonSecici({ secili, dil }: { secili: SablonKimligi; dil: "tr" | "en" }) {
  const t = useTranslations("Editor.tasarim");
  const adlar = useTranslations("Landing.sablonlar.adlar");
  const degistir = useEditor((d) => d.degistir);
  const [filtre, setFiltre] = useState<Filtre>("tumu");
  const izgaraRef = useRef<HTMLUListElement>(null);
  const liste = SISTEM_SABLON_LISTESI.filter(FILTRELER[filtre]);

  // Açılışta seçili şablon görünür olsun (yalnız ızgara kayar, panel değil).
  useEffect(() => {
    const izgara = izgaraRef.current;
    const el = izgara?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (izgara && el) izgara.scrollTop = el.offsetTop - izgara.offsetTop - 8;
  }, []);

  const sec = (kimlik: SablonKimligi) =>
    degistir((v) => {
      const onceki = SISTEM_SABLONLARI[v.ayarlar.sablon].tanim;
      const yeni = SISTEM_SABLONLARI[kimlik].tanim;
      const varsayilanda = onceki.tekRenk || v.ayarlar.renk.toLowerCase() === onceki.renkler.vurgu.toLowerCase();
      if (varsayilanda && !yeni.tekRenk) v.ayarlar.renk = yeni.renkler.vurgu;
      v.ayarlar.sablon = kimlik;
    }, false);

  return (
    <section>
      <Baslik>{t("sablon")}</Baslik>
      <div role="group" aria-label={t("filtre.etiket")} className="mb-3 flex flex-wrap gap-1.5">
        {(Object.keys(FILTRELER) as Filtre[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={f === filtre}
            onClick={() => setFiltre(f)}
            className={cn(
              "h-8 rounded-full border px-3 text-xs font-semibold transition-colors",
              f === filtre
                ? "border-ana bg-ana text-white"
                : "border-cizgi bg-yuzey text-soluk hover:border-cizgi-guclu hover:text-metin",
            )}
          >
            {t(`filtre.${f}`)}
            <span className={cn("ms-1 tabular-nums", f === filtre ? "text-white/80" : "text-soluk/80")}>
              {SISTEM_SABLON_LISTESI.filter(FILTRELER[f]).length}
            </span>
          </button>
        ))}
      </div>
      <ul
        ref={izgaraRef}
        className="-mx-1 grid max-h-[min(36rem,62vh)] grid-cols-2 gap-2.5 overflow-y-auto overscroll-contain px-1 py-1 min-[420px]:grid-cols-3"
      >
        {liste.map((s) => {
          const seciliMi = s.kimlik === secili;
          return (
            <li key={s.kimlik}>
              <button
                type="button"
                aria-pressed={seciliMi}
                onClick={() => sec(s.kimlik)}
                className={cn(
                  "group relative block w-full rounded-xl border-2 bg-yuzey p-1.5 text-start transition-[border-color,box-shadow]",
                  seciliMi ? "border-ana shadow-yuksek" : "border-cizgi hover:border-cizgi-guclu",
                )}
              >
                <div className="overflow-hidden rounded-md ring-1 ring-black/5">
                  <KucukResim kimlik={s.kimlik} dil={dil} ilkOlcek={0.16} />
                </div>
                <span className="mt-1.5 block truncate px-0.5 text-xs font-semibold text-metin">{adlar(s.kimlik)}</span>
                <span className="flex items-center gap-1 px-0.5 pb-0.5 text-[11px] font-medium text-vurgu">
                  <ShieldCheck className="size-3" aria-hidden />
                  {t("ats", { puan: s.ats })}
                </span>
                {seciliMi && (
                  <span className="absolute end-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-ana text-white shadow-kart">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[13px] leading-relaxed text-soluk">
        <span className="font-semibold text-metin">{adlar(secili)}:</span> {t(`aciklamalar.${secili}`)}
      </p>
    </section>
  );
}
