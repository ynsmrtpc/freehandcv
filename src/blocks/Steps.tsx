import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Section, SectionHeader } from "./shared";

export type StepsContent = {
  eyebrow: string;
  title: string;
  items: { title: string; text: string }[];
};

// Numbered because the order matters: write, pick a template, download.
export function Steps({ content }: { content: StepsContent }) {
  return (
    <Section>
      <SectionHeader title={content.title} />
      <Stagger as="ol" className="mt-12 grid gap-x-10 md:grid-cols-3">
        {content.items.map((step, i) => (
          <StaggerItem as="li" key={step.title} index={i} className="border-t-2 border-foreground py-6">
            <span className="block text-5xl leading-none font-extrabold text-primary-text tabular-nums">{i + 1}</span>
            <h3 className="mt-4 text-xl font-bold text-foreground">{step.title}</h3>
            <p className="mt-2 max-w-xs leading-relaxed text-muted">{step.text}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
