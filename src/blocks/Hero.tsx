import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import type { TemplateId } from "@/lib/resume/schema";
import { buttonClass } from "@/components/ui/Button";
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
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden px-4 pt-10 pb-20 sm:px-6 sm:pt-16 lg:pb-28">
      {/* Background: fine grid + primary-colour glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)] [background-size:44px_44px] opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.18),transparent)] dark:bg-[radial-gradient(closest-side,rgb(59_130_246/0.22),transparent)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="text-center lg:text-start">
          <Reveal mode="load">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-[13px] font-semibold text-foreground shadow-card backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {content.badge}
            </p>
          </Reveal>

          <h1 className="mt-6 text-[2.6rem] leading-[1.08] font-extrabold tracking-tight text-balance text-foreground sm:text-6xl lg:text-[4rem]">
            {content.title}
          </h1>

          <Reveal mode="load" delay={0.08}>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted lg:mx-0">
              {content.subtitle}
            </p>
          </Reveal>

          <Reveal mode="load" delay={0.16}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <NextLink href={content.primaryButton.href || "#"} className={buttonClass("primary", "lg", "group w-full sm:w-auto")}>
                {content.primaryButton.label}
                <ArrowRight className="size-[18px] transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180" />
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

          <Reveal mode="load" delay={0.24}>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted lg:justify-start">
              {content.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-1.5">
                  <Check className="size-4 text-accent" strokeWidth={2.5} aria-hidden />
                  {bullet}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal mode="load" delay={0.12} className="px-6 sm:px-10 lg:px-4">
          <HeroPreview {...content.preview} />
        </Reveal>
      </div>
    </section>
  );
}
