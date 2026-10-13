import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { CmsPage, cmsMetadata } from "@/components/site/CmsPage";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/is-it-free">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return cmsMetadata("/is-it-free", locale);
}

export default async function Page({ params }: PageProps<"/[locale]/is-it-free">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <CmsPage href="/is-it-free" locale={locale} />;
}
