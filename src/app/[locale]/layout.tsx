import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { TemaSaglayici } from "@/bilesenler/TemaSaglayici";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/ortak/site";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("varsayilanBaslik"), template: `%s | ${t("siteAdi")}` },
    description: t("varsayilanAciklama"),
    applicationName: t("siteAdi"),
    openGraph: { siteName: t("siteAdi"), type: "website", locale },
    twitter: { card: "summary_large_image" },
  };
}

export default async function KokLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    // Arapça (dalga 2) eklendiğinde dir dilden türetilecek (plan 8.2).
    // suppressHydrationWarning: next-themes, ilk boyamadan önce <html>'e tema sınıfını ekler.
    <html lang={locale} dir="ltr" className={jakarta.variable} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">
        <TemaSaglayici>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </TemaSaglayici>
      </body>
    </html>
  );
}
