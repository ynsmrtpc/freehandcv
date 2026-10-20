import { Quote, Star } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import { Section, SectionHeader } from "./shared";

export type ReviewItem = { id: string; rating: number; body: string; occupation: string | null; name: string | null };

export type ReviewsContent = {
  eyebrow: string;
  title: string;
  items: ReviewItem[];
  anonymous: string;
  ratingLabel: (n: number) => string;
};

// Only real reviews reach this component (allowed by the author, approved in the admin panel).
export function Reviews({ content }: { content: ReviewsContent }) {
  return (
    <Section>
      <SectionHeader eyebrow={content.eyebrow} title={content.title} />
      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((r, i) => (
          <StaggerItem
            key={r.id}
            index={i % 3}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-card"
          >
            <figure className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span className="flex gap-0.5" role="img" aria-label={content.ratingLabel(r.rating)}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      aria-hidden
                      className={cn("size-4", n <= r.rating ? "fill-warning text-warning" : "text-border-strong")}
                    />
                  ))}
                </span>
                <Quote className="size-5 text-primary-text/30" aria-hidden />
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-foreground">{r.body}</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold text-foreground">{r.name || content.anonymous}</span>
                {r.occupation && <span className="text-muted"> · {r.occupation}</span>}
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
