import { notFound } from "next/navigation";
import { z } from "zod";
import { blokListesiSemasi, type Blok } from "@/ortak/bloklar";
import { sayfaSurumListesi, sayfaYonetim } from "@/sunucu/icerik/sayfalar";
import { SayfaDuzenleyici } from "./SayfaDuzenleyici";

export default async function SayfaDuzenle({ params }: PageProps<"/[locale]/yonetim/sayfalar/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const [s, surumler] = await Promise.all([sayfaYonetim(id), sayfaSurumListesi(id)]);
  if (!s) notFound();
  const bloklar = blokListesiSemasi.safeParse(s.bloklar);

  return (
    <SayfaDuzenleyici
      // Kaydedilen her yeni sürümde düzenleyici sunucu verisiyle yeniden kurulur.
      key={s.surum}
      sayfa={{
        id: s.id,
        slug: s.slug,
        dil: s.dil,
        surum: s.surum,
        meta: {
          baslik: s.baslik,
          metaBaslik: s.metaBaslik ?? "",
          metaAciklama: s.metaAciklama ?? "",
          indeks: s.indeks,
        },
        bloklar: bloklar.success ? (bloklar.data as Blok[]) : [],
        yayindaFarkli: JSON.stringify(s.bloklar) !== JSON.stringify(s.yayindakiBloklar),
      }}
      surumler={surumler.map((v) => ({
        id: v.id,
        zaman: v.olusturma.toISOString(),
        kisi: v.yayinlayan || v.yayinlayanEposta || "—",
      }))}
    />
  );
}
