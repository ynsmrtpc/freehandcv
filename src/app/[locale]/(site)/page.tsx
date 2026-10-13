import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/bilesenler/JsonLd";
import { Adimlar } from "@/bloklar/Adimlar";
import { Cta } from "@/bloklar/Cta";
import { Hero } from "@/bloklar/Hero";
import { Karsilastirma } from "@/bloklar/Karsilastirma";
import { Ozellikler } from "@/bloklar/Ozellikler";
import { SablonVitrini } from "@/bloklar/SablonVitrini";
import { Sss } from "@/bloklar/Sss";
import { routing } from "@/i18n/routing";
import { alternatifler } from "@/ortak/seo";
import { SITE_URL } from "@/ortak/site";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: { absolute: t("varsayilanBaslik") },
    alternates: alternatifler("/", locale),
  };
}

// Bloklar şimdilik çeviri dosyasından beslenir. Faz 1'de aynı bloklar `sayfalar.yayindaki_bloklar`
// listesinden, yönetim panelinde belirlenen sırayla çizilir (plan 6.3, 7.1).
export default async function Landing({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, { Landing: L }] = await Promise.all([
    getTranslations({ locale, namespace: "Landing" }),
    getMessages({ locale }),
  ]);
  const adlar = L.sablonlar.adlar;

  return (
    <>
      <JsonLd
        veri={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "FreehandCV",
          url: SITE_URL,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          inLanguage: locale,
          offers: { "@type": "Offer", price: 0, priceCurrency: "TRY" },
        }}
      />
      <JsonLd
        veri={{ "@context": "https://schema.org", "@type": "Organization", name: "FreehandCV", url: SITE_URL }}
      />

      <Hero
        icerik={{
          rozet: t("hero.rozet"),
          baslik: t.rich("hero.baslik", {
            vurgu: (parca) => (
              <span className="bg-gradient-to-r from-ana to-[#7c3aed] bg-clip-text text-transparent dark:from-[#93c5fd] dark:to-[#c4b5fd]">
                {parca}
              </span>
            ),
          }),
          altBaslik: t("hero.altBaslik"),
          anaButon: t("hero.anaButon"),
          ikincilButon: t("hero.ikincilButon"),
          maddeler: L.hero.maddeler,
          onizleme: {
            dil: locale,
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
      <SablonVitrini
        icerik={{
          ust: t("sablonlar.ust"),
          baslik: t("sablonlar.baslik"),
          aciklama: t("sablonlar.aciklama"),
          sec: t("sablonlar.sec"),
          atsEtiketi: (puan) => t("sablonlar.ats", { puan }),
          adlar,
          dil: locale,
        }}
      />
      <Adimlar icerik={L.adimlar} />
      <Karsilastirma icerik={L.karsilastirma} />
      <Ozellikler icerik={L.ozellikler} />
      <Sss icerik={L.sss} />
      <Cta icerik={L.cta} />
    </>
  );
}
