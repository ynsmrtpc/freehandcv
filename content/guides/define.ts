// Draft guides kept in the repository (plan 6.2 /rehber/[konu]). `pnpm content:seed-guides` adds the
// ones missing from the database as DRAFT pages of kind "guide"; an admin reviews them in the page
// editor and publishes. Edits made in the panel are never overwritten.
// Rules for writers:
// - Written for the Turkish job market (plan 8.3): Turkish hiring practice, Kariyer.net/LinkedIn reality,
//   KVKK-aware advice (no T.C. kimlik no, medeni hal, açık adres on a resume).
// - Accurate and honest: no invented statistics or studies ("araştırmalara göre %75…"). If a number is
//   not verifiable, leave it out. No law/article numbers unless certain.
// - Useful, specific, scannable: short paragraphs, "- " lists, **bold** for key terms, concrete examples.
// - 900–1600 words in the article; FAQ answers 1–3 sentences each.
// - Link to the editor (/cv-olustur) only through the final call to action.
import { DEFAULT_BLOCK_SETTINGS, type Block } from "@/lib/blocks";

export type GuideDraft = {
  /** URL slug under /rehber, Turkish ASCII words with hyphens (e.g. "cv-nasil-hazirlanir"). Never changes after publishing. */
  slug: string;
  /** Page h1 and admin title, e.g. "CV Nasıl Hazırlanır? Adım Adım Rehber". */
  title: string;
  /** ≤ 60 characters. */
  metaTitle: string;
  /** ≤ 155 characters. */
  metaDescription: string;
  /** Small label above the h1, e.g. "Rehber". */
  eyebrow: string;
  /** 1–3 sentences under the h1: what the reader will learn. */
  intro: string;
  /** The article: each section gets an h2. Body: blank line = paragraph, "- " lines = list, **bold**. */
  sections: { heading: string; body: string }[];
  /** 3–6 questions people actually search; becomes FAQPage structured data. */
  faq: { question: string; answer: string }[];
  /** Final call to action (button goes to the editor). */
  cta: { title: string; text: string; buttonLabel: string };
};

export const defineGuide = (draft: GuideDraft) => draft;

const settings = (extra: Partial<Block["settings"]> = {}) => ({ ...DEFAULT_BLOCK_SETTINGS, ...extra });

/** The page's blocks, in the order the guide page shows them. */
export function guideBlocks(g: GuideDraft, editorHref: string): Block[] {
  return [
    { id: "title", type: "page_title", settings: settings(), content: { eyebrow: g.eyebrow, title: g.title, description: g.intro } },
    { id: "article", type: "article", settings: settings(), content: { sections: g.sections } },
    ...(g.faq.length
      ? [
          {
            id: "faq",
            type: "faq",
            settings: settings({ anchor: "faq" }),
            content: { eyebrow: "", title: "Sık sorulan sorular", items: g.faq },
          } as Block,
        ]
      : []),
    {
      id: "cta",
      type: "cta",
      settings: settings(),
      content: { title: g.cta.title, text: g.cta.text, button: { label: g.cta.buttonLabel, href: editorHref } },
    },
  ];
}
