import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Footer } from "@/components/site/Footer";
import { GoogleOneTap } from "@/components/account/GoogleOneTap";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { SiteHeaderContainer } from "@/components/site/SiteHeaderContainer";

export default function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  const t = useTranslations("Site");
  const locale = useLocale();

  return (
    <MotionProvider>
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("skipToContent")}
      </a>
      <AnnouncementBar locale={locale} />
      {/* The language switcher reads useParams; with Cache Components it must sit inside Suspense. */}
      <Suspense fallback={<div className="h-16" />}>
        <SiteHeaderContainer />
      </Suspense>
      <main id="main-content">{children}</main>
      <Footer />
      <GoogleOneTap returnTo={getPathname({ href: "/dashboard", locale: locale as Locale })} />
    </MotionProvider>
  );
}
