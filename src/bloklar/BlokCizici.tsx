// Sayfanın blok listesini çizer (plan 7.1). Hem herkese açık sayfada (sunucu) hem yönetim
// panelinin canlı önizlemesinde (istemci) aynı bileşen kullanılır; bu yüzden hook olarak yalnız
// useTranslations kullanır (next-intl ikisinde de çalışır). Arayüz etiketleri (şablon adları,
// önizleme rozetleri) çeviri dosyasından, içerik bloktan gelir.
import { useLocale, useTranslations } from "next-intl";
import type { Blok } from "@/ortak/bloklar";
import { cn } from "@/ortak/cn";
import { SABLON_KIMLIKLERI, type SablonKimligi } from "@/ortak/cv/sema";
import { zenginParcalar } from "@/ortak/cv/yardimci";
import { Adimlar } from "./Adimlar";
import { Bagis } from "./Bagis";
import { Cta } from "./Cta";
import { Hero } from "./Hero";
import { Karsilastirma } from "./Karsilastirma";
import { Ozellikler } from "./Ozellikler";
import { SablonVitrini } from "./SablonVitrini";
import { SayfaBasligi } from "./SayfaBasligi";
import { Sss } from "./Sss";
import { ZenginMetin } from "./ZenginMetin";

function Vurgulu({ metin }: { metin: string }) {
  return (
    <>
      {zenginParcalar(metin).map((p, i) =>
        p.kalin ? (
          <span
            key={i}
            className="bg-gradient-to-r from-ana to-[#7c3aed] bg-clip-text text-transparent dark:from-[#93c5fd] dark:to-[#c4b5fd]"
          >
            {p.metin}
          </span>
        ) : (
          p.metin
        ),
      )}
    </>
  );
}

/** Bloğun dışarıdan aldığı site verisi (istemci önizlemesinde de çizilebilsin diye prop ile). */
export type BlokBaglami = { bagisBaglantisi?: string };

function BlokIcerigi({ blok, baglam }: { blok: Blok; baglam: BlokBaglami }) {
  const t = useTranslations("Landing");
  const dil = useLocale() === "tr" ? "tr" : "en";
  const adlar = Object.fromEntries(
    SABLON_KIMLIKLERI.map((k) => [k, t(`sablonlar.adlar.${k}` as never)]),
  ) as Record<SablonKimligi, string>;

  switch (blok.tur) {
    case "hero":
      return (
        <Hero
          icerik={{
            ...blok.icerik,
            baslik: <Vurgulu metin={blok.icerik.baslik} />,
            onizleme: {
              dil,
              adlar,
              etiketler: {
                sablon: t("hero.sablon"),
                atsUyumlu: t("hero.atsUyumlu"),
                pdfHazir: t("hero.pdfHazir"),
                ikKontrolu: t("hero.ikKontrolu"),
              },
            },
          }}
        />
      );
    case "sayfa_basligi":
      return <SayfaBasligi icerik={blok.icerik} />;
    case "sablon_vitrini":
      return (
        <SablonVitrini
          icerik={{
            ...blok.icerik,
            adlar,
            dil,
            atsEtiketi: (puan) => t("sablonlar.ats", { puan }),
            tumu: (n) => t("sablonlar.tumu", { n }),
          }}
        />
      );
    case "adimlar":
      return <Adimlar icerik={blok.icerik} />;
    case "karsilastirma":
      return <Karsilastirma icerik={blok.icerik} />;
    case "ozellikler":
      return <Ozellikler icerik={blok.icerik} />;
    case "sss":
      return <Sss icerik={blok.icerik} />;
    case "cta":
      return <Cta icerik={blok.icerik} />;
    case "bagis":
      return <Bagis icerik={blok.icerik} baglanti={baglam.bagisBaglantisi} />;
    case "zengin_metin":
      return <ZenginMetin icerik={blok.icerik} />;
  }
}

export function BlokCizici({
  bloklar,
  onizleme = false,
  baglam = {},
}: {
  bloklar: Blok[];
  onizleme?: boolean;
  baglam?: BlokBaglami;
}) {
  return (
    <>
      {bloklar
        .filter((b) => b.ayarlar.gorunur || onizleme)
        .map((b) => (
          <div
            key={b.id}
            id={b.ayarlar.capa || undefined}
            data-blok={b.id}
            className={cn(
              b.ayarlar.arkaPlan === "hafif" && "bg-yuzey-2/50",
              b.ayarlar.mobildeGizle && "max-sm:hidden",
              onizleme && !b.ayarlar.gorunur && "opacity-40",
            )}
          >
            <BlokIcerigi blok={b} baglam={baglam} />
          </div>
        ))}
    </>
  );
}
