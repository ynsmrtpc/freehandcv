import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
// Block-based page content (plan 7.1). Every block type has a Zod schema; the admin form is
// generated from it (`meta` labels). A new block type = one schema + one component.
// "How it looks" lives in code (src/blocks), "what it says / in which order" in the database (pages.draft_blocks).
import { z } from "zod";

/** Field info read by the form generator. */
export type FieldMeta = {
  label: string;
  hint?: string;
  /** long: multi-line text; link: address field */
  display?: "long" | "link";
  /** Field shown in the collapsed header of array items. */
  summaryField?: string;
  optionLabels?: Record<string, string>;
};

const m = <T extends z.ZodType>(s: T, meta: FieldMeta) => s.meta(meta as Record<string, unknown>);

const text = (label: string, hint?: string) => m(z.string().max(300), { label, hint });
const longText = (label: string, hint?: string) => m(z.string().max(4000), { label, hint, display: "long" });
const link = (label: string) =>
  m(
    z
      .string()
      .max(500)
      .refine((v) => !v || /^(\/|#|https?:\/\/|mailto:)/.test(v), ADMIN_CONTENT.blocksLabel388),
    { label, display: "link", hint: ADMIN_CONTENT.blocksHint389 },
  );

const button = (label: string) => m(z.object({ label: text("Metin"), href: link(ADMIN_CONTENT.blocksLabel390) }), { label });

const sectionHeading = {
  eyebrow: text(ADMIN_CONTENT.blocksLabel391, ADMIN_CONTENT.blocksLabel392),
  title: text(ADMIN_CONTENT.blocksLabel393),
};

export const blockSettingsSchema = z.object({
  visible: m(z.boolean(), { label: ADMIN_CONTENT.blocksLabel394 }),
  hideOnMobile: m(z.boolean(), { label: ADMIN_CONTENT.blocksLabel395 }),
  background: m(z.enum(["none", "subtle"]), {
    label: ADMIN_CONTENT.blocksLabel396,
    optionLabels: { none: "Yok", subtle: "Hafif gri" },
  }),
  anchor: m(
    z
      .string()
      .max(40)
      .regex(/^[a-z0-9-]*$/, ADMIN_CONTENT.blocksLabel397),
    { label: ADMIN_CONTENT.blocksLabel398, hint: ADMIN_CONTENT.blocksHint399 },
  ),
});
export type BlockSettings = z.infer<typeof blockSettingsSchema>;

export const BLOCK_SCHEMAS = {
  hero: z.object({
    badge: text("Rozet"),
    title: text(ADMIN_CONTENT.blocksLabel400, ADMIN_CONTENT.blocksLabel401),
    subtitle: longText(ADMIN_CONTENT.blocksLabel402),
    primaryButton: button("Ana buton"),
    secondaryButton: button(ADMIN_CONTENT.blocksLabel403),
    bullets: m(z.array(text("Madde")).max(5), { label: ADMIN_CONTENT.blocksLabel404 }),
  }),
  page_title: z.object({
    eyebrow: text(ADMIN_CONTENT.blocksLabel391),
    title: text(ADMIN_CONTENT.blocksLabel400, ADMIN_CONTENT.blocksLabel405),
    description: longText(ADMIN_CONTENT.templatesIdPageContent327),
  }),
  template_showcase: z.object({
    ...sectionHeading,
    description: longText(ADMIN_CONTENT.templatesIdPageContent327),
    cardButton: text(ADMIN_CONTENT.blocksLabel406),
  }),
  example_showcase: z.object({
    ...sectionHeading,
    description: longText(ADMIN_CONTENT.templatesIdPageContent327),
    count: m(z.enum(["6", "4", "8"]), {
      label: ADMIN_CONTENT.blocksLabel407,
      hint: ADMIN_CONTENT.blocksHint408,
    }),
  }),
  steps: z.object({
    ...sectionHeading,
    items: m(z.array(z.object({ title: text(ADMIN_CONTENT.blocksLabel393), text: longText("Metin") })).max(6), {
      label: ADMIN_CONTENT.blocksLabel409,
      summaryField: "title",
    }),
  }),
  comparison: z.object({
    ...sectionHeading,
    description: longText(ADMIN_CONTENT.templatesIdPageContent327),
    featureHeader: text(ADMIN_CONTENT.blocksLabel410),
    usHeader: text(ADMIN_CONTENT.blocksLabel411),
    rows: m(
      z.array(z.object({ feature: text(ADMIN_CONTENT.blocksLabel412), us: text("FreehandCV'de") })).max(12),
      { label: ADMIN_CONTENT.blocksLabel413, summaryField: "feature" },
    ),
  }),
  features: z.object({
    ...sectionHeading,
    items: m(z.array(z.object({ title: text(ADMIN_CONTENT.blocksLabel393), text: longText("Metin") })).max(12), {
      label: ADMIN_CONTENT.blocksLabel414,
      summaryField: "title",
      hint: ADMIN_CONTENT.blocksHint415,
    }),
  }),
  faq: z.object({
    ...sectionHeading,
    // Optional so blocks saved before the FAQ pool keep validating.
    category: m(z.string().max(40).default(""), {
      label: ADMIN_CONTENT.blocksLabel416,
      hint: ADMIN_CONTENT.blocksHint417,
    }),
    items: m(z.array(z.object({ question: text("Soru"), answer: longText("Cevap") })).max(30), {
      label: ADMIN_CONTENT.faqsPageLabel184,
      summaryField: "question",
      hint: ADMIN_CONTENT.blocksHint418,
    }),
  }),
  cta: z.object({ title: text(ADMIN_CONTENT.blocksLabel393), text: longText("Metin"), button: button("Buton") }),
  donation: z.object({
    title: text(ADMIN_CONTENT.blocksLabel393),
    text: longText("Metin"),
    buttonLabel: text("Buton metni", ADMIN_CONTENT.blocksLabel419),
  }),
  reviews: z.object({
    ...sectionHeading,
    count: m(z.enum(["3", "6", "9"]), {
      label: ADMIN_CONTENT.blocksLabel420,
      hint: ADMIN_CONTENT.blocksHint421,
    }),
  }),
  article: z.object({
    sections: m(
      z
        .array(
          z.object({
            heading: text(ADMIN_CONTENT.blocksLabel422),
            body: longText("Metin", ADMIN_CONTENT.blocksLabel423),
          }),
        )
        .max(20),
      { label: ADMIN_CONTENT.blocksLabel424, summaryField: "heading" },
    ),
  }),
  rich_text: z.object({
    title: text(ADMIN_CONTENT.blocksLabel425),
    text: longText("Metin", ADMIN_CONTENT.blocksLabel426),
  }),
} as const;

export type BlockType = keyof typeof BLOCK_SCHEMAS;
export const BLOCK_TYPES = Object.keys(BLOCK_SCHEMAS) as BlockType[];

export const BLOCK_NAMES: Record<BlockType, string> = {
  hero: ADMIN_CONTENT.blocksHero427,
  page_title: ADMIN_CONTENT.examplesExampleFormLabel56,
  template_showcase: ADMIN_CONTENT.blocksTemplateShowcase428,
  example_showcase: ADMIN_CONTENT.blocksExampleShowcase429,
  steps: ADMIN_CONTENT.blocksLabel409,
  comparison: ADMIN_CONTENT.blocksComparison430,
  features: ADMIN_CONTENT.blocksFeatures431,
  faq: ADMIN_CONTENT.auditLogAuditLogTableFaq43,
  cta: ADMIN_CONTENT.blocksCta432,
  donation: ADMIN_CONTENT.blocksDonation433,
  reviews: ADMIN_CONTENT.blocksReviews434,
  rich_text: ADMIN_CONTENT.blocksRichText435,
  article: ADMIN_CONTENT.blocksArticle436,
};

export type Block = {
  [T in BlockType]: { id: string; type: T; settings: BlockSettings; content: z.infer<(typeof BLOCK_SCHEMAS)[T]> };
}[BlockType];

export const blockSchema = z.discriminatedUnion(
  "type",
  BLOCK_TYPES.map((type) =>
    z.object({
      id: z.string().min(1).max(40),
      type: z.literal(type),
      settings: blockSettingsSchema,
      content: BLOCK_SCHEMAS[type],
    }),
  ) as unknown as [z.ZodObject, ...z.ZodObject[]],
);
export const blockListSchema = z.array(blockSchema).max(40);

export const DEFAULT_BLOCK_SETTINGS: BlockSettings = { visible: true, hideOnMobile: false, background: "none", anchor: "" };

/** Builds empty content from a schema (when adding a new block). */
export function emptyValue(schema: z.ZodType): unknown {
  const def = (schema as unknown as { def: { type: string } }).def;
  switch (def.type) {
    case "object": {
      const shape = (schema as unknown as z.ZodObject).shape;
      return Object.fromEntries(Object.entries(shape).map(([k, s]) => [k, emptyValue(s as z.ZodType)]));
    }
    case "array":
      return [];
    case "boolean":
      return false;
    case "number":
      return 0;
    case "enum":
      return (schema as unknown as z.ZodEnum).options[0];
    case "pipe":
    case "optional":
    case "default":
      return emptyValue((def as unknown as { innerType?: z.ZodType; in?: z.ZodType }).innerType ?? (def as unknown as { in: z.ZodType }).in);
    default:
      return "";
  }
}

export function newBlock<T extends BlockType>(type: T): Block {
  return {
    id: Math.random().toString(36).slice(2, 10),
    type,
    settings: { ...DEFAULT_BLOCK_SETTINGS },
    content: emptyValue(BLOCK_SCHEMAS[type]),
  } as Block;
}
