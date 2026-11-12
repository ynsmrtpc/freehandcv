import type { Block } from "./blocks";

export const guideBlockId = (index: number) => `guide-block-${index + 1}`;
export const guideSectionId = (blockIndex: number, sectionIndex: number) => `${guideBlockId(blockIndex)}-section-${sectionIndex + 1}`;

/** The outline and the renderer share IDs, including repeated headings and multiple article blocks. */
export function guideOutline(blocks: Block[], preview = false) {
  return blocks.flatMap((block, index) => {
    if (!block.settings.visible && !preview) return [];
    const mobileHidden = block.settings.hideOnMobile;
    if (block.type === "article") return block.content.sections.flatMap((section, sectionIndex) =>
      section.heading ? [{ id: guideSectionId(index, sectionIndex), title: section.heading, mobileHidden }] : [],
    );
    if ((block.type === "faq" || block.type === "rich_text" || block.type === "donation") && block.content.title) {
      return [{ id: block.settings.anchor || guideBlockId(index), title: block.content.title, mobileHidden }];
    }
    return [];
  });
}

export function guideReadingMinutes(blocks: Block[]) {
  const text = blocks.filter((b) => b.settings.visible).flatMap((block) => {
    switch (block.type) {
      case "page_title": return [block.content.title, block.content.description];
      case "article": return block.content.sections.flatMap((s) => [s.heading, s.body]);
      case "rich_text": return [block.content.title, block.content.text];
      case "faq": return block.content.items.flatMap((q) => [q.question, q.answer]);
      default: return [];
    }
  }).join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length / 200));
}
