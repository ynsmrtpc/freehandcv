"use client";

import { Check, Pipette, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { MiniCv } from "@/bilesenler/cv-onizleme/MiniCv";
import { useEditor } from "@/istemci/editor/depo";
import { cn } from "@/ortak/cn";
import { CV_DILLERI } from "@/ortak/cv/basliklar";
import { ARALIKLAR, BOYUTLAR, KAGITLAR, SABLON_KIMLIKLERI } from "@/ortak/cv/sema";
import { FONTLAR, SISTEM_SABLONLARI, VURGU_RENKLERI, type FontKimligi } from "@/ortak/cv/tasarim";
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
      <section>
        <Baslik>{t("sablon")}</Baslik>
        <div className="grid grid-cols-3 gap-2.5">
          {SABLON_KIMLIKLERI.map((s) => {
            const secili = s === a.sablon;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={secili}
                onClick={() => ayarla("sablon", s)}
                className={cn(
                  "group relative rounded-xl border-2 bg-yuzey p-1.5 text-start transition-[border-color,box-shadow]",
                  secili ? "border-ana shadow-yuksek" : "border-cizgi hover:border-cizgi-guclu",
                )}
              >
                <div className="overflow-hidden rounded-md ring-1 ring-black/5">
                  <MiniCv sablon={s} dil={a.dil === "tr" ? "tr" : "en"} />
                </div>
                <span className="mt-1.5 block truncate px-0.5 text-xs font-semibold text-metin">
                  {/* Şablon adları landing ile aynı */}
                  <SablonAdi kimlik={s} />
                </span>
                <span className="flex items-center gap-1 px-0.5 pb-0.5 text-[11px] font-medium text-vurgu">
                  <ShieldCheck className="size-3" aria-hidden />
                  {t("ats", { puan: SISTEM_SABLONLARI[s].ats })}
                </span>
                {secili && (
                  <span className="absolute end-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-ana text-white shadow-kart">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-soluk">{t(`aciklamalar.${a.sablon}`)}</p>
      </section>

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

function SablonAdi({ kimlik }: { kimlik: (typeof SABLON_KIMLIKLERI)[number] }) {
  const t = useTranslations("Landing.sablonlar.adlar");
  return <>{t(kimlik)}</>;
}
