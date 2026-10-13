import { Belir } from "@/bilesenler/hareket/Belir";
import { paragraflar, zenginParcalar } from "@/ortak/cv/yardimci";
import { Bolum } from "./ortak";

// Basit metin bloğu: boş satır yeni paragraf, **kalın**. Tiptap tabanlı zengin metin (başlık,
// liste, görsel, tablo) rehber sayfalarıyla birlikte gelir (plan 4, 7.1).
export function ZenginMetin({ icerik }: { icerik: { baslik: string; metin: string } }) {
  return (
    <Bolum>
      <Belir className="mx-auto max-w-3xl">
        {icerik.baslik && <h2 className="text-3xl font-bold tracking-tight text-balance text-metin">{icerik.baslik}</h2>}
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-soluk">
          {paragraflar(icerik.metin).map((p, i) => (
            <p key={i}>
              {zenginParcalar(p).map((x, j) => (x.kalin ? <strong key={j} className="text-metin">{x.metin}</strong> : x.metin))}
            </p>
          ))}
        </div>
      </Belir>
    </Bolum>
  );
}
