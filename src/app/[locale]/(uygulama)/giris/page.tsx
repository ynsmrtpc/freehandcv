import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { GirisFormu } from "@/bilesenler/hesap/GirisFormu";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: PageProps<"/[locale]/giris">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Hesap" });
  return { title: t("girisMeta") };
}

// Dönüş adresi (?sonra=) arama parametresinden okunduğu için Suspense içinde.
export default function Sayfa() {
  return (
    <Suspense>
      <GirisFormu mod="giris" />
    </Suspense>
  );
}
