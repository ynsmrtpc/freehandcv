import { ArrowRight, Clock3 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type BlockContext } from "@/blocks/BlockRenderer";
import { ReadingLayout } from "./ReadingLayout";
import { Link } from "@/i18n/navigation";
import type { Block } from "@/lib/blocks";
import { guideReadingMinutes } from "@/lib/guides";

/** Shared by the published guide and CMS preview; content stays in the block editor. */
export function GuideReader({
  blocks,
  context,
  title,
  updatedAt,
  related = [],
  preview = false,
}: {
  blocks: Block[];
  context?: BlockContext;
  title?: string;
  updatedAt?: string;
  related?: { slug: string; title: string; description?: string | null }[];
  preview?: boolean;
}) {
  const t = useTranslations("Guides");
  const locale = useLocale();
  return (
    <ReadingLayout
      blocks={blocks}
      context={context}
      title={title}
      preview={preview}
      contentsLabel={t("contents")}
      metadata={
        <>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-4" aria-hidden />
            {t("readingTime", { minutes: guideReadingMinutes(blocks) })}
          </span>
          {updatedAt && (
            <time dateTime={updatedAt}>
              {t("updated", {
                date: new Date(updatedAt).toLocaleDateString(locale, {
                  dateStyle: "long",
                  timeZone: "Europe/Istanbul",
                }),
              })}
            </time>
          )}
        </>
      }
      outlineFooter={
        <Link
          href="/guides"
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-text"
        >
          {t("all")}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </Link>
      }
      footer={
        related.length > 0 ? (
          <nav
            aria-labelledby="related-guides"
            className="border-t border-border py-8"
          >
            <h2
              id="related-guides"
              className="text-2xl font-bold text-foreground"
            >
              {t("related")}
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {related.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={{
                      pathname: "/guides/[topic]",
                      params: { topic: guide.slug },
                    }}
                    className="group flex items-center justify-between gap-4 rounded-md py-4 text-base font-semibold text-foreground transition-colors hover:text-primary-text"
                  >
                    {guide.title}
                    <ArrowRight
                      className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 rtl:rotate-180"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : undefined
      }
    />
  );
}
