import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import type { TemplateId } from "@/lib/resume/schema";
import { buttonClass } from "@/components/ui/Button";
import { InkTick } from "@/components/ui/InkMark";
import NextLink from "next/link";
import { HeroPreview } from "./HeroPreview";

export type HeroContent = {
  badge: string;
  title: React.ReactNode;
  subtitle: string;
  primaryButton: { label: string; href: string };
  secondaryButton: { label: string; href: string };
  bullets: string[];
  preview: {
    locale: "tr" | "en";
    names: Record<TemplateId, string>;
    labels: { template: string; atsFriendly: string; pdfReady: string; checksPassed: string };
  };
};

// The title (LCP element) renders without animation; only supporting elements reveal.
// Composition: the statement on the left, the real resume paper lying on the desk on the right.
// The CMS badge is stored but not rendered: the ruled, ticked lines already make that promise.
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="overflow-x-clip px-4 pt-8 pb-16 sm:px-6 sm:pt-14 lg:pb-24">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="min-w-0">
          <h1 className="text-[2.75rem] leading-[1.04] font-extrabold tracking-[-0.03em] text-balance text-foreground sm:text-6xl lg:text-[4.25rem]">
            {content.title}
          </h1>

          <Reveal mode="load" delay={0.08}>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-pretty text-muted sm:text-xl">
              {content.subtitle}
            </p>
          </Reveal>

          <Reveal mode="load" delay={0.16}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NextLink href={content.primaryButton.href || "#"} className={buttonClass("primary", "lg", "group w-full sm:w-auto")}>
                {content.primaryButton.label}
                <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </NextLink>
              {content.secondaryButton.label && (
                <NextLink
                  href={content.secondaryButton.href || "#"}
                  className={buttonClass("secondary", "lg", "w-full sm:w-auto")}
                >
                  {content.secondaryButton.label}
                </NextLink>
              )}
            </div>
          </Reveal>

          {/* Plain statements, ruled like lines on a form and ticked in ink. */}
          <Reveal mode="load" delay={0.24}>
            <ul className="mt-10 max-w-md border-t border-border-strong">
              {content.bullets.map((bullet, i) => (
                <li
                  key={bullet}
                  className="flex items-center gap-3 border-b border-border py-2.5 text-[17px] font-semibold text-foreground"
                >
                  <InkTick className="text-xl" draw delay={0.6 + i * 0.18} />
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal mode="load" delay={0.12} className="px-2 sm:px-10 lg:px-0">
          <HeroPreview {...content.preview} />
        </Reveal>
      </div>
    </section>
  );
}
