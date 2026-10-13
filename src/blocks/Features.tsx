import { History, Languages, Lock, ScanSearch, ShieldCheck, Smartphone } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { Section, SectionHeader } from "./shared";

export type FeaturesContent = {
  eyebrow: string;
  title: string;
  items: { title: string; text: string }[];
};

const ICONS = [ScanSearch, ShieldCheck, History, Languages, Lock, Smartphone];

// Bento grid: the first two cards are wide (2 columns at lg), the rest single.
export function Features({ content }: { content: FeaturesContent }) {
  return (
    <Section>
      <SectionHeader eyebrow={content.eyebrow} title={content.title} />
      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          const wide = i < 2;
          return (
            <StaggerItem
              key={item.title}
              index={i % 4}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card transition-[border-color,box-shadow] duration-300 hover:border-border-strong hover:shadow-elevated",
                wide && "lg:col-span-2 lg:p-8",
              )}
            >
              {wide && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-16 -top-16 size-48 rounded-full bg-[radial-gradient(closest-side,rgb(37_99_235/0.12),transparent)] transition-transform duration-500 group-hover:scale-125"
                />
              )}
              <div className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary-text">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className={cn("mt-5 font-bold text-foreground", wide ? "text-xl" : "text-lg")}>{item.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
