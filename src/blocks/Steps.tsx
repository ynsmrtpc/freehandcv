import { FileDown, LayoutTemplate, PenLine } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "./shared";

export type StepsContent = {
  eyebrow: string;
  title: string;
  items: { title: string; text: string }[];
};

const ICONS = [PenLine, LayoutTemplate, FileDown];

export function Steps({ content }: { content: StepsContent }) {
  return (
    <Section>
      <SectionHeader eyebrow={content.eyebrow} title={content.title} />
      <Stagger as="ol" className="relative mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
        {/* Line connecting the steps (desktop) */}
        <li aria-hidden className="pointer-events-none absolute inset-x-[16%] top-7 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent md:block" />
        {content.items.map((step, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <StaggerItem as="li" key={step.title} index={i} className="relative text-center">
              <div className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-border bg-surface text-primary-text shadow-card">
                <Icon className="size-6" aria-hidden />
                <span className="absolute -end-2 -top-2 grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-white tabular-nums">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs leading-relaxed text-muted">{step.text}</p>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
