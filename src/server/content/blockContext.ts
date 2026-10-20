import "server-only";
import type { BlockContext } from "@/blocks/BlockRenderer";
import type { Block } from "@/lib/blocks";
import { getApprovedReviews } from "../reviews";
import { getPublishedExamples, getShowcaseExamples } from "./examples";

/** Site data the page's blocks need (all cached); only what the blocks on the page actually use. */
export async function loadBlockContext(blocks: Block[], locale: string): Promise<BlockContext> {
  const showcase = blocks.filter((b) => b.type === "example_showcase");
  const showcaseMax = Math.max(0, ...showcase.map((b) => Number(b.content.count)));
  const [reviews, items, all] = await Promise.all([
    blocks.some((b) => b.type === "reviews") ? getApprovedReviews() : undefined,
    showcaseMax ? getShowcaseExamples(locale, showcaseMax) : undefined,
    showcaseMax ? getPublishedExamples(locale) : undefined,
  ]);
  return { reviews, examples: items ? { items, total: all?.length ?? items.length } : undefined };
}
