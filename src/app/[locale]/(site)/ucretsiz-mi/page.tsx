import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { CmsSayfasi, cmsMetadata } from "@/bilesenler/site/CmsSayfasi";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/ucretsiz-mi">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return cmsMetadata("/ucretsiz-mi", locale);
}

export default async function Sayfa({ params }: PageProps<"/[locale]/ucretsiz-mi">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <CmsSayfasi href="/ucretsiz-mi" dil={locale} />;
}
