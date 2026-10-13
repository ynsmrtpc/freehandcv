import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/ortak/site";

// Uygulama yolları taranmaz (plan 6.1). Yerelleştirilmiş karşılıkları da kapatılır.
const UYGULAMA_YOLLARI = ["/cv-olustur", "/yonetim", "/giris", "/kayit", "/panel"] as const;
// Henüz rota tanımı olmayan, Faz 2'de gelecek uygulama yolları.
const SONRAKI_YOLLAR = ["/cv/", "/en/cv/", "/yazdir/", "/hesap", "/sablon-editoru/"];

export default function robots(): MetadataRoute.Robots {
  const kapali = new Set<string>(["/api/", ...SONRAKI_YOLLAR]);
  for (const yol of UYGULAMA_YOLLARI)
    for (const locale of routing.locales) kapali.add(getPathname({ href: yol, locale }));

  return {
    rules: { userAgent: "*", allow: "/", disallow: [...kapali] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
