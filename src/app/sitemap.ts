import type { MetadataRoute } from "next";
import { routing, type Dil } from "@/i18n/routing";
import { CMS_SAYFALARI } from "@/ortak/cmsSayfalari";
import { alternatifler, tamAdres } from "@/ortak/seo";
import { ANA_SAYFA, yayindakiSayfalar } from "@/sunucu/icerik/sayfalar";

// Yalnız yayındaki ve indekslenen sayfalar; lastmod gerçek güncelleme tarihi (plan 6.4).
// Örnek CV'ler, şablonlar ve rehberler eklendikçe buraya katılır.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const yayinda = await yayindakiSayfalar();
  const yollar = [{ href: "/" as const, slug: ANA_SAYFA }, ...CMS_SAYFALARI];

  return yollar.flatMap(({ href, slug }) => {
    const kayitlar = yayinda.filter((s) => s.slug === slug);
    // Veritabanına ulaşılamazsa ana sayfa yine de listelenir.
    const diller = (kayitlar.length ? kayitlar.map((k) => k.dil) : slug === ANA_SAYFA ? routing.locales : []) as Dil[];
    return diller.map((dil) => ({
      url: tamAdres(href, dil),
      lastModified: kayitlar.find((k) => k.dil === dil)?.guncelleme,
      alternates: { languages: alternatifler(href, dil, diller)?.languages as Record<string, string> },
    }));
  });
}
