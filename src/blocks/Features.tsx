import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { InkTick } from "@/components/ui/InkMark";
import { Section, SectionHeader } from "./shared";

export type FeaturesContent = {
  eyebrow: string;
  title: string;
  items: { title: string; text: string }[];
};

// A ruled list, like the lines of a form: each feature is a ticked line with its explanation.
export function Features({ content }: { content: FeaturesContent }) {
  return (
    <Section>
      <SectionHeader title={content.title} />
      <Stagger as="ul" className="mt-12 grid border-t border-border-strong sm:grid-cols-2 sm:gap-x-12">
        {content.items.map((item, i) => (
          <StaggerItem as="li" key={item.title} index={i % 2} className="flex gap-4 border-b border-border py-6">
            <InkTick className="mt-0.5 text-2xl" />
            <div>
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-1.5 max-w-prose leading-relaxed text-muted">{item.text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
