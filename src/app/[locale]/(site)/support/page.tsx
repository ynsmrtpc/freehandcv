import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { CmsPage, cmsMetadata } from "@/components/site/CmsPage";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/support">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return cmsMetadata("/support", locale);
}

export default async function Page({ params }: PageProps<"/[locale]/support">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <CmsPage href="/support" locale={locale} />;
}
