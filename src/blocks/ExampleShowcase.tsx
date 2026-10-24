import { ResumeThumbnail } from "@/components/resume/TemplatePreview";
import { resumeDefinition } from "@/lib/resume/design";
import type { ResumeData } from "@/lib/resume/schema";
import { StackShowcase, type StackShowcaseContent } from "./StackShowcase";

export type ShowcaseItem = {
  slug: string;
  title: string;
  occupation: string;
  category: string;
  experienceLevel: string | null;
  summary: string;
  content: ResumeData;
};

export type ExampleShowcaseContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: ShowcaseItem[];
  itemLink: string;
  viewAll: string;
  categoryName: (id: string) => string;
  levelName: (id: string) => string;
  labels: StackShowcaseContent["labels"];
};

// Published example resumes on the landing (plan 6.3 "Popüler CV örnekleri"): the stack turns through
// the examples' real resumes; the side text tells which occupation it is and links to its page.
export function ExampleShowcase({ content }: { content: ExampleShowcaseContent }) {
  return (
    <StackShowcase
      side="left"
      content={{
        eyebrow: content.eyebrow,
        title: content.title,
        description: content.description,
        itemLink: content.itemLink,
        viewAll: { label: content.viewAll, href: "/resume-examples" },
        labels: content.labels,
        items: content.items.map((e) => ({
          key: e.slug,
          name: e.occupation,
          summary: e.summary,
          badges: [
            { label: content.categoryName(e.category) },
            ...(e.experienceLevel ? [{ label: content.levelName(e.experienceLevel) }] : []),
          ],
          href: { pathname: "/resume-examples/[slug]", params: { slug: e.slug } },
          thumbnail: (
            <ResumeThumbnail data={e.content} definition={resumeDefinition(e.content)} initialScale={0.58} />
          ),
        })),
      }}
    />
  );
}
