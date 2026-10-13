import { FileDown, LayoutTemplate, PenLine } from "lucide-react";
import { Kademeli, KademeliOge } from "@/bilesenler/hareket/Belir";
import { Bolum, BolumBasligi } from "./ortak";

export type AdimlarIcerik = {
  ust: string;
  baslik: string;
  liste: { baslik: string; metin: string }[];
};

const IKONLAR = [PenLine, LayoutTemplate, FileDown];

export function Adimlar({ icerik }: { icerik: AdimlarIcerik }) {
  return (
    <Bolum>
      <BolumBasligi ust={icerik.ust} baslik={icerik.baslik} />
      <Kademeli as="ol" className="relative mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
        {/* Adımları bağlayan çizgi (masaüstü) */}
        <li aria-hidden className="pointer-events-none absolute inset-x-[16%] top-7 hidden h-px bg-gradient-to-r from-transparent via-cizgi-guclu to-transparent md:block" />
        {icerik.liste.map((a, i) => {
          const Ikon = IKONLAR[i % IKONLAR.length];
          return (
            <KademeliOge as="li" key={a.baslik} sira={i} className="relative text-center">
              <div className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-cizgi bg-yuzey text-ana-metin shadow-kart">
                <Ikon className="size-6" aria-hidden />
                <span className="absolute -end-2 -top-2 grid size-6 place-items-center rounded-full bg-ana text-xs font-bold text-white tabular-nums">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-metin">{a.baslik}</h3>
              <p className="mx-auto mt-2 max-w-xs leading-relaxed text-soluk">{a.metin}</p>
            </KademeliOge>
          );
        })}
      </Kademeli>
    </Bolum>
  );
}
