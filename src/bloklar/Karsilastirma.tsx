import { Check, X } from "lucide-react";
import { Belir } from "@/bilesenler/hareket/Belir";
import { Bolum, BolumBasligi } from "./ortak";

export type KarsilastirmaIcerik = {
  ust: string;
  baslik: string;
  aciklama: string;
  konu: string;
  diger: string;
  biz: string;
  satirlar: { konu: string; diger: string; biz: string }[];
};

// Plan 6.3/3: "Diğer sitelerde / Burada" — marka adı verilmez.
export function Karsilastirma({ icerik }: { icerik: KarsilastirmaIcerik }) {
  return (
    <Bolum id="karsilastirma">
      <BolumBasligi ust={icerik.ust} baslik={icerik.baslik} aciklama={icerik.aciklama} />
      {/* Dar ekranda tablo sığmaz: her satır bir kart olur. */}
      <Belir className="mx-auto mt-12 max-w-3xl space-y-3 sm:hidden">
        {icerik.satirlar.map((s) => (
          <div key={s.konu} className="rounded-2xl border border-cizgi bg-yuzey p-4 shadow-kart">
            <p className="font-semibold text-metin">{s.konu}</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-soluk">
              <X className="mt-0.5 size-4 shrink-0 text-hata" strokeWidth={2.5} aria-hidden />
              <span>
                <span className="sr-only">{icerik.diger}: </span>
                {s.diger}
              </span>
            </p>
            <p className="mt-2 flex items-start gap-2 rounded-lg bg-ana-acik px-2.5 py-2 text-sm font-semibold text-metin">
              <Check className="mt-0.5 size-4 shrink-0 text-vurgu" strokeWidth={2.75} aria-hidden />
              <span>
                <span className="sr-only">{icerik.biz}: </span>
                {s.biz}
              </span>
            </p>
          </div>
        ))}
      </Belir>
      <Belir className="mx-auto mt-14 hidden max-w-3xl sm:block">
        <div className="overflow-hidden rounded-2xl border border-cizgi bg-yuzey shadow-kart">
          <table className="w-full border-collapse text-start text-[15px]">
            <caption className="sr-only">{icerik.baslik}</caption>
            <thead>
              <tr className="border-b border-cizgi">
                <th scope="col" className="w-[34%] px-4 py-4 text-start text-sm font-semibold text-soluk sm:px-6">
                  {icerik.konu}
                </th>
                <th scope="col" className="px-4 py-4 text-start text-sm font-semibold text-soluk sm:px-6">
                  {icerik.diger}
                </th>
                <th scope="col" className="bg-ana-acik px-4 py-4 text-start text-sm font-bold text-ana-metin sm:px-6">
                  {icerik.biz}
                </th>
              </tr>
            </thead>
            <tbody>
              {icerik.satirlar.map((s) => (
                <tr key={s.konu} className="border-b border-cizgi last:border-0">
                  <th scope="row" className="px-4 py-4 text-start font-semibold text-metin sm:px-6">
                    {s.konu}
                  </th>
                  <td className="px-4 py-4 text-soluk sm:px-6">
                    <span className="flex items-start gap-2">
                      <X className="mt-0.5 size-4 shrink-0 text-hata" strokeWidth={2.5} aria-hidden />
                      {s.diger}
                    </span>
                  </td>
                  <td className="bg-ana-acik/60 px-4 py-4 font-semibold text-metin sm:px-6">
                    <span className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-vurgu" strokeWidth={2.75} aria-hidden />
                      {s.biz}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Belir>
    </Bolum>
  );
}
