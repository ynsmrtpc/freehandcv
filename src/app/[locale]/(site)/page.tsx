import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/bilesenler/JsonLd";
import { BlokCizici } from "@/bloklar/BlokCizici";
import { routing } from "@/i18n/routing";
import { alternatifler } from "@/ortak/seo";
import { SITE_URL } from "@/ortak/site";
import { varsayilanLandingBloklari } from "@/ortak/varsayilanIcerik";
import { ANA_SAYFA, yayindakiSayfa } from "@/sunucu/icerik/sayfalar";

async function sayfaGetir(locale: "tr" | "en") {
  const s = await yayindakiSayfa(locale, ANA_SAYFA);
  return s ?? { baslik: null, metaBaslik: null, metaAciklama: null, indeks: true, bloklar: varsayilanLandingBloklari(locale) };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, s] = await Promise.all([getTranslations({ locale, namespace: "Meta" }), sayfaGetir(locale)]);
  return {
    title: { absolute: s.metaBaslik || t("varsayilanBaslik") },
    description: s.metaAciklama || t("varsayilanAciklama"),
    alternates: alternatifler("/", locale),
    robots: s.indeks ? undefined : { index: false },
  };
}

// Landing blokları yönetim panelinden düzenlenir ve yayınlanır (plan 6.3, 7). Veritabanında
// yayında kayıt yoksa başlangıç blokları gösterilir.
export default async function Landing({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const s = await sayfaGetir(locale);

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
      <BlokCizici bloklar={s.bloklar} />
    </>
  );
}
