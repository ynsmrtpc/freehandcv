import { Belir } from "@/bilesenler/hareket/Belir";

// Landing dışındaki sayfaların girişi; sayfanın tek h1'i buradadır (plan 6.4).
export function SayfaBasligi({ icerik }: { icerik: { ust: string; baslik: string; aciklama: string } }) {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-8 sm:px-6 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.14),transparent)]"
      />
      <div className="mx-auto max-w-3xl text-center">
        {icerik.ust && (
          <Belir mod="yukle">
            <p className="text-sm font-semibold tracking-wide text-ana-metin uppercase">{icerik.ust}</p>
          </Belir>
        )}
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-metin sm:text-5xl">{icerik.baslik}</h1>
        {icerik.aciklama && (
          <Belir mod="yukle" gecikme={0.08}>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-soluk">{icerik.aciklama}</p>
          </Belir>
        )}
      </div>
    </section>
  );
}
