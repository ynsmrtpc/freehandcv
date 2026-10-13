import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { alternatifler, tamAdres } from "@/ortak/seo";

// Yayındaki sabit site sayfaları. Faz 1'de örnek CV'ler, şablonlar ve rehberler
// veritabanından eklenir (lastmod gerçek güncelleme tarihi olacak). Sayfa hazır
// olmadan buraya eklenmez; site haritasında 404 olmamalı.
const SABIT_YOLLAR = ["/"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return SABIT_YOLLAR.flatMap((yol) =>
    routing.locales.map((dil) => ({
      url: tamAdres(yol, dil),
      alternates: {
        languages: alternatifler(yol, dil)?.languages as Record<string, string>,
      },
    })),
  );
}
