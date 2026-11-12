import { ChevronDown, List } from "lucide-react";
import type { ReactNode } from "react";
import { BlockRenderer, type BlockContext } from "@/blocks/BlockRenderer";
import { PageTitle } from "@/blocks/PageTitle";
import type { Block } from "@/lib/blocks";
import { cn } from "@/lib/cn";
import { guideOutline } from "@/lib/guides";

/** Consistent paper, measure, and navigation for CMS documents and guides. */
export function ReadingLayout({
  blocks,
  context,
  title,
  preview = false,
  contentsLabel,
  metadata,
  footer,
  outlineFooter,
}: {
  blocks: Block[];
  context?: BlockContext;
  title?: string;
  preview?: boolean;
  contentsLabel: string;
  metadata?: ReactNode;
  footer?: ReactNode;
  outlineFooter?: ReactNode;
}) {
  const outline = guideOutline(blocks, preview);
  const links = (
    <ul className="space-y-1">
      {outline.map((item) => (
        <li key={item.id} className={cn(item.mobileHidden && "max-sm:hidden")}>
          <a
            href={`#${item.id}`}
            className="block rounded-md px-3 py-2.5 text-sm leading-snug text-muted transition-colors hover:bg-surface-2 hover:text-primary-text focus-visible:text-primary-text"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8 lg:pb-24">
      {outline.length > 0 && (
        <details className="group mb-4 rounded-lg border border-border bg-surface lg:hidden">
          <summary className="flex min-h-12 list-none items-center gap-2 px-4 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            <List className="size-4 text-primary-text" aria-hidden />
            {contentsLabel}
            <ChevronDown
              className="ms-auto size-4 text-muted transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <nav
            aria-label={contentsLabel}
            className="border-t border-border p-2"
          >
            {links}
          </nav>
        </details>
      )}
      <div
        className={cn(
          "grid items-start gap-8",
          outline.length > 0 && "lg:grid-cols-[minmax(0,1fr)_240px] xl:gap-12",
        )}
      >
        <div className="min-w-0 rounded-xl border border-border bg-surface px-5 pt-6 pb-2 sm:px-8 sm:pt-8">
          {metadata && (
            <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
              {metadata}
            </div>
          )}
          {title &&
            !blocks.some(
              (b) => b.type === "page_title" && (b.settings.visible || preview),
            ) && (
              <PageTitle
                reading
                content={{ title, eyebrow: "", description: "" }}
              />
            )}
          <BlockRenderer
            blocks={blocks}
            context={context}
            reading
            preview={preview}
          />
          {footer}
        </div>
        {outline.length > 0 && (
          <aside className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto lg:block">
            <nav aria-labelledby="reading-contents-title">
              <h2
                id="reading-contents-title"
                className="mb-3 border-b border-border pb-3 text-base font-bold text-foreground"
              >
                {contentsLabel}
              </h2>
              {links}
              {outlineFooter}
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
