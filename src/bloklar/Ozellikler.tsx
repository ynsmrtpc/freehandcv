import { History, Languages, Lock, ScanSearch, ShieldCheck, Smartphone } from "lucide-react";
import { Kademeli, KademeliOge } from "@/bilesenler/hareket/Belir";
import { cn } from "@/ortak/cn";
import { Bolum, BolumBasligi } from "./ortak";

export type OzelliklerIcerik = {
  ust: string;
  baslik: string;
  liste: { baslik: string; metin: string }[];
};

const IKONLAR = [ScanSearch, ShieldCheck, History, Languages, Lock, Smartphone];

// Bento ızgara: ilk iki kart geniş (lg'de 2 sütun), kalanlar tek.
export function Ozellikler({ icerik }: { icerik: OzelliklerIcerik }) {
  return (
    <Bolum className="bg-yuzey-2/50">
      <BolumBasligi ust={icerik.ust} baslik={icerik.baslik} />
      <Kademeli className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {icerik.liste.map((o, i) => {
          const Ikon = IKONLAR[i % IKONLAR.length];
          const genis = i < 2;
          return (
            <KademeliOge
              key={o.baslik}
              sira={i % 4}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-cizgi bg-yuzey p-6 shadow-kart transition-[border-color,box-shadow] duration-300 hover:border-cizgi-guclu hover:shadow-yuksek",
                genis && "lg:col-span-2 lg:p-8",
              )}
            >
              {genis && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-16 -top-16 size-48 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.12),transparent)] transition-transform duration-500 group-hover:scale-125"
                />
              )}
              <div className="grid size-11 place-items-center rounded-xl bg-ana-acik text-ana-metin">
                <Ikon className="size-5" aria-hidden />
              </div>
              <h3 className={cn("mt-5 font-bold text-metin", genis ? "text-xl" : "text-lg")}>{o.baslik}</h3>
              <p className="mt-2 leading-relaxed text-soluk">{o.metin}</p>
            </KademeliOge>
          );
        })}
      </Kademeli>
    </Bolum>
  );
}
