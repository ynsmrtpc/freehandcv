import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import NextLink from "next/link";

export type CtaContent = { title: string; text: string; button: { label: string; href: string } };

// The page's close: a solid field of ballpoint ink, no ornament.
export function Cta({ content }: { content: CtaContent }) {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-8 rounded-2xl bg-primary px-6 py-12 text-white sm:px-12 sm:py-16 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-[2.6rem]">{content.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/90">{content.text}</p>
        </div>
        <NextLink
          href={content.button.href || "#"}
          className="group inline-flex h-13 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-white px-7 text-[17px] font-bold text-primary-dark transition-colors duration-200 hover:bg-primary-soft active:scale-[0.97] md:self-auto"
        >
          {content.button.label}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
        </NextLink>
      </Reveal>
    </section>
  );
}
