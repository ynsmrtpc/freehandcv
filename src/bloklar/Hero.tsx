import { ArrowRight, Check } from "lucide-react";
import { Belir } from "@/bilesenler/hareket/Belir";
import type { SablonKimligi } from "@/bilesenler/cv-onizleme/MiniCv";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { Link } from "@/i18n/navigation";
import { HeroOnizleme } from "./HeroOnizleme";

export type HeroIcerik = {
  rozet: string;
  baslik: React.ReactNode;
  altBaslik: string;
  anaButon: string;
  ikincilButon: string;
  maddeler: string[];
  onizleme: {
    dil: "tr" | "en";
    adlar: Record<SablonKimligi, string>;
    etiketler: { sablon: string; atsUyumlu: string; pdfHazir: string; ikKontrolu: string };
  };
};

// Başlık (LCP öğesi) animasyonsuz basılır; yalnız destekleyici öğeler belirir.
export function Hero({ icerik }: { icerik: HeroIcerik }) {
  return (
    <section className="relative overflow-hidden px-4 pt-10 pb-20 sm:px-6 sm:pt-16 lg:pb-28">
      {/* Zemin: ince ızgara + ana renk ışıması */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--cizgi)_1px,transparent_1px),linear-gradient(to_bottom,var(--cizgi)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)] [background-size:44px_44px] opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.18),transparent)] dark:bg-[radial-gradient(closest-side,rgb(59_130_246/0.22),transparent)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="text-center lg:text-start">
          <Belir mod="yukle">
            <p className="inline-flex items-center gap-2 rounded-full border border-cizgi bg-yuzey/70 px-3 py-1.5 text-[13px] font-semibold text-metin shadow-kart backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-vurgu opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-vurgu" />
              </span>
              {icerik.rozet}
            </p>
          </Belir>

          <h1 className="mt-6 text-[2.6rem] leading-[1.08] font-extrabold tracking-tight text-balance text-metin sm:text-6xl lg:text-[4rem]">
            {icerik.baslik}
          </h1>

          <Belir mod="yukle" gecikme={0.08}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-soluk lg:mx-0">
              {icerik.altBaslik}
            </p>
          </Belir>

          <Belir mod="yukle" gecikme={0.16}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/cv-olustur" className={butonSinifi("ana", "buyuk", "group w-full sm:w-auto")}>
                {icerik.anaButon}
                <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180" />
              </Link>
              <Link
                href={{ pathname: "/", hash: "sablonlar" }}
                className={butonSinifi("ikincil", "buyuk", "w-full sm:w-auto")}
              >
                {icerik.ikincilButon}
              </Link>
            </div>
          </Belir>

          <Belir mod="yukle" gecikme={0.24}>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-soluk lg:justify-start">
              {icerik.maddeler.map((md) => (
                <li key={md} className="flex items-center gap-1.5">
                  <Check className="size-4 text-vurgu" strokeWidth={2.5} aria-hidden />
                  {md}
                </li>
              ))}
            </ul>
          </Belir>
        </div>

        <Belir mod="yukle" gecikme={0.12} className="px-6 sm:px-10 lg:px-4">
          <HeroOnizleme {...icerik.onizleme} />
        </Belir>
      </div>
    </section>
  );
}
