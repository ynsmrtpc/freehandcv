// Renders a page's block list (plan 7.1). The same component is used on the public page (server)
// and in the admin panel's live preview (client), so its only hook is useTranslations (next-intl
// works in both). UI labels (template names, preview badges) come from the messages; content
// comes from the block.
import { useLocale, useTranslations } from "next-intl";
import type { Block } from "@/lib/blocks";
import { cn } from "@/lib/cn";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/resume/schema";
import { richTextParts } from "@/lib/resume/utils";
import { Steps } from "./Steps";
import { Donation } from "./Donation";
import { Cta } from "./Cta";
import { Hero } from "./Hero";
import { Comparison } from "./Comparison";
import { Features } from "./Features";
import { TemplateShowcase } from "./TemplateShowcase";
import { PageTitle } from "./PageTitle";
import { Faq } from "./Faq";
import { RichText } from "./RichText";
import { Article } from "./Article";
import { ExampleShowcase, type ShowcaseItem } from "./ExampleShowcase";
import { Reviews, type ReviewItem } from "./Reviews";

function Highlighted({ text }: { text: string }) {
  return (
    <>
      {richTextParts(text).map((p, i) =>
        p.bold ? (
          <span
            key={i}
            className="bg-gradient-to-r from-primary to-[#7c3aed] bg-clip-text text-transparent dark:from-[#93c5fd] dark:to-[#c4b5fd]"
          >
            {p.text}
          </span>
        ) : (
          p.text
        ),
      )}
    </>
  );
}

/** Site data a block receives from outside (passed as a prop so the client preview can render it too). */
export type BlockContext = {
  donationUrl?: string;
  reviews?: ReviewItem[];
  /** Published examples for the showcase, and how many are published in total. */
  examples?: { items: ShowcaseItem[]; total: number };
};

function BlockContent({ block, context, preview }: { block: Block; context: BlockContext; preview: boolean }) {
  const t = useTranslations("Landing");
  const tTemplates = useTranslations("Templates");
  const locale = useLocale() === "tr" ? "tr" : "en";
  const names = Object.fromEntries(
    TEMPLATE_IDS.map((id) => [id, tTemplates(`names.${id}` as never)]),
  ) as Record<TemplateId, string>;
  const descriptions = Object.fromEntries(
    TEMPLATE_IDS.map((id) => [id, tTemplates(`descriptions.${id}` as never)]),
  ) as Record<TemplateId, string>;
  const tExamples = useTranslations("Examples");
  const stackLabels = {
    picker: t("showcase.picker"),
    previous: t("showcase.previous"),
    next: t("showcase.next"),
  };

  switch (block.type) {
    case "hero":
      return (
        <Hero
          content={{
            ...block.content,
            title: <Highlighted text={block.content.title} />,
            preview: {
              locale,
              names,
              labels: {
                template: t("hero.template"),
                atsFriendly: t("hero.atsFriendly"),
                pdfReady: t("hero.pdfReady"),
                checksPassed: t("hero.checksPassed"),
              },
            },
          }}
        />
      );
    case "page_title":
      return <PageTitle content={block.content} />;
    case "template_showcase":
      return (
        <TemplateShowcase
          content={{
            ...block.content,
            names,
            locale,
            descriptions,
            labels: stackLabels,
            atsLabel: (score) => t("templates.atsScore", { score }),
            viewAll: (n) => t("templates.viewAll", { n }),
          }}
        />
      );
    case "example_showcase": {
      const items = (context.examples?.items ?? []).slice(0, Number(block.content.count));
      // Without published examples the block shows nothing (a note in the admin preview).
      if (!items.length)
        return preview ? <p className="px-4 py-10 text-center text-sm text-muted">{t("examples.previewEmpty")}</p> : null;
      return (
        <ExampleShowcase
          content={{
            ...block.content,
            items,
            itemLink: t("examples.cardButton"),
            viewAll: t("examples.viewAll", { n: context.examples?.total ?? items.length }),
            labels: stackLabels,
            categoryName: (id) => tExamples(`categories.${id}.name` as never),
            levelName: (id) => tExamples(`levels.${id}` as never),
          }}
        />
      );
    }
    case "steps":
      return <Steps content={block.content} />;
    case "comparison":
      return <Comparison content={block.content} />;
    case "features":
      return <Features content={block.content} />;
    case "faq":
      return <Faq content={block.content} />;
    case "cta":
      return <Cta content={block.content} />;
    case "donation":
      return <Donation content={block.content} href={context.donationUrl} />;
    case "reviews": {
      const items = (context.reviews ?? []).slice(0, Number(block.content.count));
      // No placeholder or invented reviews: without approved ones the block shows nothing (a note in the admin preview).
      if (!items.length)
        return preview ? <p className="px-4 py-10 text-center text-sm text-muted">{t("reviews.previewEmpty")}</p> : null;
      return (
        <Reviews
          content={{
            ...block.content,
            items,
            anonymous: t("reviews.anonymous"),
            ratingLabel: (n) => t("reviews.rating", { n }),
          }}
        />
      );
    }
    case "article":
      return <Article content={block.content} />;
    case "rich_text":
      return <RichText content={block.content} />;
  }
}

export function BlockRenderer({
  blocks,
  preview = false,
  context = {},
}: {
  blocks: Block[];
  preview?: boolean;
  context?: BlockContext;
}) {
  return (
    <>
      {blocks
        .filter((b) => b.settings.visible || preview)
        .map((b) => (
          <div
            key={b.id}
            id={b.settings.anchor || undefined}
            data-block={b.id}
            className={cn(
              b.settings.background === "subtle" && "bg-surface-2/50",
              b.settings.hideOnMobile && "max-sm:hidden",
              preview && !b.settings.visible && "opacity-40",
            )}
          >
            <BlockContent block={b} context={context} preview={preview} />
          </div>
        ))}
    </>
  );
}
