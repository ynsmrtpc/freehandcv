import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConfirmProvider } from "@/components/ui/ConfirmProvider";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { getSiteSettings } from "@/server/content/siteSettings";
import "../globals.css";

// Atkinson Hyperlegible Next: drawn for low-vision readers; many users read on small phones.
const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f3f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
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
  const [t, { global }] = await Promise.all([getTranslations({ locale, namespace: "Meta" }), getSiteSettings(locale)]);
  const { google, bing, yandex } = global.verification;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: `%s | ${t("siteName")}` },
    description: t("defaultDescription"),
    applicationName: t("siteName"),
    openGraph: { siteName: t("siteName"), type: "website", locale },
    twitter: { card: "summary_large_image" },
    // Ownership tags for search consoles, entered in the admin panel (plan 7.3).
    verification: {
      google: google || undefined,
      yandex: yandex || undefined,
      other: bing ? { "msvalidate.01": bing } : undefined,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    // When Arabic (wave 2) is added, dir will be derived from the locale (plan 8.2).
    // suppressHydrationWarning: next-themes adds the theme class to <html> before first paint.
    <html lang={locale} dir="ltr" className={bodyFont.variable} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">
        <ThemeProvider>
          <NextIntlClientProvider><ConfirmProvider>{children}</ConfirmProvider></NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
