import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import NextLink from "next/link";
import { buttonClass } from "@/components/ui/Button";

export type CtaContent = { title: string; text: string; button: { label: string; href: string } };

// The page's close: the last line of the form, ruled off like a signature row. The hero keeps the
// page's one primary action, so this link is a quiet secondary.
export function Cta({ content, reading = false }: { content: CtaContent; reading?: boolean }) {
  if (reading) return (
    <section className="border-t border-border py-8">
      <h2 className="text-2xl font-bold text-foreground">{content.title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{content.text}</p>
      <NextLink href={content.button.href || "#"} className={buttonClass("secondary", "md", "mt-5 max-sm:w-full")}>
        {content.button.label}<ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
      </NextLink>
    </section>
  );
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-8 border-t-2 border-foreground pt-10 sm:pt-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl leading-tight font-extrabold tracking-[-0.02em] text-balance text-foreground sm:text-[2.6rem]">{content.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">{content.text}</p>
        </div>
        <NextLink href={content.button.href || "#"} className={buttonClass("secondary", "lg", "group shrink-0 self-start md:self-auto max-sm:w-full")}>
          {content.button.label}
          <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden />
        </NextLink>
      </Reveal>
    </section>
  );
}
