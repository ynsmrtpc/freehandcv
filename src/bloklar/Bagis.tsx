import { Heart } from "lucide-react";
import { Belir } from "@/bilesenler/hareket/Belir";
import { Bolum } from "./ortak";

// Bağış çağrısı (plan 7.6). Bağlantı site ayarlarından gelir; tanımlı değilse düğme gösterilmez.
export function Bagis({
  icerik,
  baglanti,
}: {
  icerik: { baslik: string; metin: string; buton: string };
  baglanti?: string;
}) {
  return (
    <Bolum>
      <Belir className="mx-auto max-w-2xl rounded-3xl border border-cizgi bg-yuzey p-8 text-center shadow-kart sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-hata-acik text-hata">
          <Heart className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-balance text-metin sm:text-3xl">{icerik.baslik}</h2>
        <p className="mt-3 leading-relaxed text-pretty text-soluk">{icerik.metin}</p>
        {baglanti && icerik.buton && (
          <a
            href={baglanti}
            target="_blank"
            rel="noopener"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-metin px-6 font-semibold text-zemin transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <Heart className="size-4" aria-hidden />
            {icerik.buton}
          </a>
        )}
      </Belir>
    </Bolum>
  );
}
