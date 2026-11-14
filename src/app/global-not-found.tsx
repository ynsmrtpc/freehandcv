import { headers } from "next/headers";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@/components/ThemeProvider";
import { routing } from "@/i18n/routing";
import { bodyFont } from "@/lib/fonts";
import NotFound from "./[locale]/not-found";
import "./globals.css";

// A routing error must wait for its locale header before sending a complete 404 document.
export const instant = false;

// Routing-level 404s bypass the dynamic root layout. Supply its font, theme and locale
// explicitly so missing resources return both HTTP 404 and complete translated HTML.
export default async function GlobalNotFound() {
  const requested = (await headers()).get("x-next-intl-locale");
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../../messages/${locale}/Site.json`)).default;
  return (
    <html lang={locale} dir="ltr" className={bodyFont.variable} suppressHydrationWarning>
      <body className="min-h-dvh font-sans antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={{ Site: messages }} timeZone="Europe/Istanbul" formats={{}} now={new Date(0)}>
            <NotFound />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
