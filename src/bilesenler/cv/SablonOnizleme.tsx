// Şablon küçük resmi: örnek CV, şablonun tanımıyla gerçek çizim motorundan (CvBelge) basılır ve
// kutuya ölçeklenir. Böylece her yeni şablon (kullanıcı şablonları dahil) elle çizilmiş bir
// önizleme gerektirmez. Dekoratiftir: ekran okuyucudan ve klavyeden gizlenir, bağlantı içermez
// (bir <a> ya da <button> içinde durur). Hook kullanmaz; sunucuda da istemcide de çizilir.
import { cn } from "@/ortak/cn";
import { ornekCv } from "@/ortak/cv/ornek";
import type { CvVerisi, SablonKimligi } from "@/ortak/cv/sema";
import { SISTEM_SABLONLARI } from "@/ortak/cv/tasarim";
import { CvBelge } from "./CvBelge";
import { cvFontSiniflari } from "./cvFontlari";
import { OlcekliKagit } from "./OlcekliKagit";

/** Fotoğraflı şablonlar fotoğrafsız görünmesin diye yer tutucu bir siluet. */
const ORNEK_FOTO =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#dfe5ec"/><circle cx="60" cy="48" r="21" fill="#a7b4c3"/><path d="M20 120c3-25 20-39 40-39s37 14 40 39z" fill="#a7b4c3"/></svg>',
  );

const onbellek = new Map<string, CvVerisi>();

function ornekVeri(kimlik: SablonKimligi, dil: string): CvVerisi {
  const anahtar = `${kimlik}:${dil}`;
  const kayitli = onbellek.get(anahtar);
  if (kayitli) return kayitli;
  const v = ornekCv(dil);
  v.ayarlar.sablon = kimlik;
  v.ayarlar.renk = SISTEM_SABLONLARI[kimlik].tanim.renkler.vurgu;
  v.ayarlar.foto = true;
  v.kisisel.foto = ORNEK_FOTO;
  onbellek.set(anahtar, v);
  return v;
}

export function SablonOnizleme({
  kimlik,
  dil,
  ilkOlcek = 0.2,
  className,
}: {
  kimlik: SablonKimligi;
  dil: string;
  /** Sunucu HTML'indeki ölçek; tarayıcıda kutu genişliğine göre düzeltilir. */
  ilkOlcek?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      inert
      data-nosnippet
      className={cn(
        "pointer-events-none aspect-[210/297] w-full overflow-hidden bg-white select-none",
        cvFontSiniflari,
        className,
      )}
    >
      <OlcekliKagit ilkOlcek={ilkOlcek}>
        <CvBelge veri={ornekVeri(kimlik, dil)} tanim={SISTEM_SABLONLARI[kimlik].tanim} baglantisiz />
      </OlcekliKagit>
    </div>
  );
}
