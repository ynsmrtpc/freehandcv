import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { CmsPage, cmsMetadata } from "@/components/site/CmsPage";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return cmsMetadata("/privacy", locale);
}

export default async function Page({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <CmsPage href="/privacy" locale={locale} />;
}
