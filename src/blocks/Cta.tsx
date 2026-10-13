import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import NextLink from "next/link";

export type CtaContent = { title: string; text: string; button: { label: string; href: string } };

export function Cta({ content }: { content: CtaContent }) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.18)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_100%,#000,transparent)] [background-size:22px_22px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.25),transparent)]"
        />
        <h2 className="relative text-3xl font-bold tracking-tight text-balance sm:text-4xl">{content.title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">{content.text}</p>
        <NextLink
          href={content.button.href || "#"}
          className="group relative mt-9 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 font-semibold text-primary-dark shadow-elevated transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          {content.button.label}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180" />
        </NextLink>
      </Reveal>
    </section>
  );
}
