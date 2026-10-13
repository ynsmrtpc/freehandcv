import { useLocale, useTranslations } from "next-intl";
import { Suspense } from "react";
import { HareketSaglayici } from "@/bilesenler/hareket/HareketSaglayici";
import { AltBilgi } from "@/bilesenler/site/AltBilgi";
import { GoogleTekDokunus } from "@/bilesenler/hesap/GoogleTekDokunus";
import { DuyuruCubugu } from "@/bilesenler/site/DuyuruCubugu";
import { getPathname } from "@/i18n/navigation";
import type { Dil } from "@/i18n/routing";
import { SiteBasligi } from "@/bilesenler/site/SiteBasligi";

export default function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  const t = useTranslations("Site");
  const dil = useLocale();

  return (
    <HareketSaglayici>
      <a
        href="#icerik"
        className="sr-only z-50 rounded-lg bg-ana px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        {t("icerigeGec")}
      </a>
      <DuyuruCubugu dil={dil} />
      {/* Dil seçici useParams okur; Cache Components'ta Suspense içinde olmalı. */}
      <Suspense fallback={<div className="h-16" />}>
        <SiteBasligi />
      </Suspense>
      <main id="icerik">{children}</main>
      <AltBilgi />
      <GoogleTekDokunus donus={getPathname({ href: "/panel", locale: dil as Dil })} />
    </HareketSaglayici>
  );
}
