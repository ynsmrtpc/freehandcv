import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { defaultLandingBlocks } from "@/lib/defaultContent";
import { HOME_SLUG, getPublishedPage } from "@/server/content/pages";

async function getHomePage(locale: "tr" | "en") {
  const page = await getPublishedPage(locale, HOME_SLUG);
  return page ?? { title: null, metaTitle: null, metaDescription: null, indexable: true, blocks: defaultLandingBlocks(locale) };
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, page] = await Promise.all([getTranslations({ locale, namespace: "Meta" }), getHomePage(locale)]);
  return {
    title: { absolute: page.metaTitle || t("defaultTitle") },
    description: page.metaDescription || t("defaultDescription"),
    alternates: alternates("/", locale),
    robots: page.indexable ? undefined : { index: false },
  };
}

// Landing blocks are edited and published from the admin panel (plan 6.3, 7). Without a
// published record in the database, the default blocks are shown.
export default async function Landing({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const page = await getHomePage(locale);

  return (
    <>
      <JsonLd
        data={{
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
        data={{ "@context": "https://schema.org", "@type": "Organization", name: "FreehandCV", url: SITE_URL }}
      />
      <BlockRenderer blocks={page.blocks} />
    </>
  );
}
