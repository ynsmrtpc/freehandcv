import { Megaphone } from "lucide-react";
import NextLink from "next/link";
import { siteAyarlariGetir } from "@/sunucu/icerik/siteAyarlari";

// Site ayarlarından (yönetim paneli) açılıp kapatılan ince şerit (plan 7.3).
export async function DuyuruCubugu({ dil }: { dil: string }) {
  const { dil: a } = await siteAyarlariGetir(dil);
  if (!a.duyuru.aktif || !a.duyuru.metin) return null;
  const icerik = (
    <>
      <Megaphone className="size-4 shrink-0" aria-hidden />
      <span>{a.duyuru.metin}</span>
    </>
  );
  const sinif = "flex items-center justify-center gap-2 px-4 py-2 text-center text-sm font-medium";
  return (
    <div className="bg-ana text-white">
      {a.duyuru.baglanti ? (
        <NextLink href={a.duyuru.baglanti} className={`${sinif} underline-offset-4 hover:underline`}>
          {icerik}
        </NextLink>
      ) : (
        <p className={sinif}>{icerik}</p>
      )}
    </div>
  );
}
