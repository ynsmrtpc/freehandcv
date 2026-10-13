import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlokCizici } from "@/bloklar/BlokCizici";
import type { Dil } from "@/i18n/routing";
import { CMS_SAYFALARI, type CmsSayfaHref } from "@/ortak/cmsSayfalari";
import { alternatifler } from "@/ortak/seo";
import { yayindakiSayfa } from "@/sunucu/icerik/sayfalar";
import { siteAyarlariGetir } from "@/sunucu/icerik/siteAyarlari";

const slugBul = (href: CmsSayfaHref) => CMS_SAYFALARI.find((s) => s.href === href)!.slug;

export async function cmsMetadata(href: CmsSayfaHref, dil: Dil): Promise<Metadata> {
  const s = await yayindakiSayfa(dil, slugBul(href));
  if (!s) return {};
  return {
    title: s.metaBaslik || s.baslik,
    description: s.metaAciklama || undefined,
    alternates: alternatifler(href, dil),
    robots: s.indeks ? undefined : { index: false },
  };
}

/** Yayında değilse 404 (taslak sayfa ziyaretçiye görünmez). */
export async function CmsSayfasi({ href, dil }: { href: CmsSayfaHref; dil: Dil }) {
  const [s, ayar] = await Promise.all([yayindakiSayfa(dil, slugBul(href)), siteAyarlariGetir(dil)]);
  if (!s) notFound();
  return (
    <BlokCizici
      bloklar={s.bloklar}
      baglam={{ bagisBaglantisi: ayar.genel.bagis.aktif ? ayar.genel.bagis.baglanti : undefined }}
    />
  );
}
