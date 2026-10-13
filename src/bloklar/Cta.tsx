import { ArrowRight } from "lucide-react";
import { Belir } from "@/bilesenler/hareket/Belir";
import NextLink from "next/link";

export type CtaIcerik = { baslik: string; metin: string; buton: { metin: string; baglanti: string } };

export function Cta({ icerik }: { icerik: CtaIcerik }) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Belir className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ana px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.18)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_100%,#000,transparent)] [background-size:22px_22px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.25),transparent)]"
        />
        <h2 className="relative text-3xl font-bold tracking-tight text-balance sm:text-4xl">{icerik.baslik}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">{icerik.metin}</p>
        <NextLink
          href={icerik.buton.baglanti || "#"}
          className="group relative mt-9 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 font-semibold text-ana-koyu shadow-yuksek transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          {icerik.buton.metin}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180" />
        </NextLink>
      </Belir>
    </section>
  );
}
