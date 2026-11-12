import { Heart } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "./shared";
import { buttonClass } from "@/components/ui/Button";

// Donation call (plan 7.6). The link comes from site settings; without one the button is hidden.
export function Donation({
  content,
  href,
  reading = false,
}: {
  content: { title: string; text: string; buttonLabel: string };
  href?: string;
  reading?: boolean;
}) {
  if (reading)
    return (
      <section className="border-t border-border py-8">
        <h2 className="text-2xl font-bold text-foreground">{content.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {content.text}
        </p>
        {href && content.buttonLabel && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("primary", "md", "mt-5 max-sm:w-full")}
          >
            <Heart className="size-4" aria-hidden />
            {content.buttonLabel}
          </a>
        )}
      </section>
    );
  return (
    <Section>
      <Reveal className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-8 text-center shadow-card sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-danger-soft text-danger">
          <Heart className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
          {content.title}
        </h2>
        <p className="mt-3 leading-relaxed text-pretty text-muted">
          {content.text}
        </p>
        {href && content.buttonLabel && (
          <a
            href={href}
            target="_blank"
            rel="noopener"
            className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-foreground px-6 font-semibold text-background transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <Heart className="size-4" aria-hidden />
            {content.buttonLabel}
          </a>
        )}
      </Reveal>
    </Section>
  );
}
