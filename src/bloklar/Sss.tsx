import { Plus } from "lucide-react";
import { Belir } from "@/bilesenler/hareket/Belir";
import { JsonLd } from "@/bilesenler/JsonLd";
import { Bolum, BolumBasligi } from "./ortak";

export type SssIcerik = {
  ust: string;
  baslik: string;
  liste: { soru: string; cevap: string }[];
};

// Yerel <details>: JS gerekmez, klavye ve ekran okuyucuyla kendiliğinden çalışır.
// FAQPage yapılandırılmış verisi aynı listeden üretilir (plan 6.4).
export function Sss({ icerik }: { icerik: SssIcerik }) {
  return (
    <Bolum id="sss">
      <JsonLd
        veri={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: icerik.liste.map((s) => ({
            "@type": "Question",
            name: s.soru,
            acceptedAnswer: { "@type": "Answer", text: s.cevap },
          })),
        }}
      />
      <BolumBasligi ust={icerik.ust} baslik={icerik.baslik} />
      <Belir className="mx-auto mt-12 max-w-3xl divide-y divide-cizgi rounded-2xl border border-cizgi bg-yuzey shadow-kart">
        {icerik.liste.map((s, i) => (
          <details key={s.soru} className="group px-5 sm:px-6" open={i === 0}>
            <summary className="flex min-h-16 list-none items-center justify-between gap-4 py-4 text-start font-semibold text-metin [&::-webkit-details-marker]:hidden">
              {s.soru}
              <Plus
                className="size-5 shrink-0 text-soluk transition-transform duration-200 group-open:rotate-45"
                aria-hidden
              />
            </summary>
            <p className="pb-5 leading-relaxed text-soluk">{s.cevap}</p>
          </details>
        ))}
      </Belir>
    </Bolum>
  );
}
