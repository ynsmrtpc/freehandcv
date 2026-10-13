import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing, type Dil } from "@/i18n/routing";
import { cvListesi } from "@/sunucu/cvler";
import { oturumGetir } from "@/sunucu/yetki";
import { PanelGovdesi } from "./PanelGovdesi";

export async function generateMetadata({ params }: PageProps<"/[locale]/panel">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Panel" });
  return { title: t("meta") };
}

export default async function Panel({ params }: PageProps<"/[locale]/panel">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <Suspense fallback={null}>
      <Liste dil={locale} />
    </Suspense>
  );
}

// Oturum istek zamanında okunur (Cache Components) — bu yüzden Suspense içinde.
async function Liste({ dil }: { dil: Dil }) {
  const oturum = await oturumGetir();
  if (!oturum) redirect({ href: { pathname: "/giris", query: { sonra: getPathname({ href: "/panel", locale: dil }) } }, locale: dil });
  const liste = await cvListesi(oturum!.user.id);
  return (
    <PanelGovdesi
      cvler={liste.map((c) => ({ id: c.id, baslik: c.baslik, icerik: c.icerik, guncelleme: c.guncelleme.toISOString() }))}
    />
  );
}
