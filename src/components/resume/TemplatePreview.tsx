// Template thumbnail: the sample resume is drawn by the real rendering engine (ResumeDocument) with
// the template's definition and scaled to the box. So no new template (user templates included)
// needs a hand-drawn preview. Decorative: hidden from screen readers and the keyboard, with no
// links (it sits inside an <a> or <button>). Uses no hooks; renders on server and client.
import { cn } from "@/lib/cn";
import { sampleResume } from "@/lib/resume/sample";
import type { ResumeData, TemplateId } from "@/lib/resume/schema";
import { SYSTEM_TEMPLATES, type DesignDefinition } from "@/lib/resume/design";
import { ResumeDocument } from "./ResumeDocument";
import { resumeFontClasses } from "./resumeFonts";
import { ScaledPaper } from "./ScaledPaper";

/** A placeholder silhouette so templates with a photo don't look photo-less. */
const SAMPLE_PHOTO =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" fill="#dfe5ec"/><circle cx="60" cy="48" r="21" fill="#a7b4c3"/><path d="M20 120c3-25 20-39 40-39s37 14 40 39z" fill="#a7b4c3"/></svg>',
  );

const cache = new Map<string, ResumeData>();

function sampleData(templateId: TemplateId, locale: string): ResumeData {
  const key = `${templateId}:${locale}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const v = sampleResume(locale);
  v.settings.template = templateId;
  v.settings.color = SYSTEM_TEMPLATES[templateId].definition.colors.accent;
  v.settings.showPhoto = true;
  v.personal.photo = SAMPLE_PHOTO;
  cache.set(key, v);
  return v;
}

export function TemplatePreview({
  templateId,
  locale,
  initialScale = 0.2,
  className,
}: {
  templateId: TemplateId;
  locale: string;
  /** Scale in the server HTML; corrected to the box width in the browser. */
  initialScale?: number;
  className?: string;
}) {
  return (
    <ResumeThumbnail
      data={sampleData(templateId, locale)}
      definition={SYSTEM_TEMPLATES[templateId].definition}
      initialScale={initialScale}
      className={className}
    />
  );
}

/**
 * The first page of a resume as a decorative thumbnail (template cards, example cards). Hidden from
 * screen readers, search snippets and the keyboard; the card around it carries the accessible name.
 */
export function ResumeThumbnail({
  data,
  definition,
  initialScale = 0.2,
  className,
}: {
  data: ResumeData;
  definition: DesignDefinition;
  initialScale?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      inert
      data-nosnippet
      className={cn(
        "pointer-events-none aspect-[210/297] w-full overflow-hidden bg-white select-none",
        resumeFontClasses,
        className,
      )}
    >
      <ScaledPaper initialScale={initialScale}>
        <ResumeDocument data={data} definition={definition} noLinks decorative />
      </ScaledPaper>
    </div>
  );
}
