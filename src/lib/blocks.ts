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
      .refine((v) => !v || /^(\/|#|https?:\/\/|mailto:)/.test(v), "Bağlantı /, #, https:// ya da mailto: ile başlamalı"),
    { label, display: "link", hint: "Örn. /cv-olustur, /en/create-resume, #faq" },
  );

const button = (label: string) => m(z.object({ label: text("Metin"), href: link("Bağlantı") }), { label });

const sectionHeading = {
  eyebrow: text("Üst etiket", "Başlığın üstündeki küçük renkli yazı"),
  title: text("Başlık"),
};

export const blockSettingsSchema = z.object({
  visible: m(z.boolean(), { label: "Görünür" }),
  hideOnMobile: m(z.boolean(), { label: "Mobilde gizle" }),
  background: m(z.enum(["none", "subtle"]), {
    label: "Arka plan",
    optionLabels: { none: "Yok", subtle: "Hafif gri" },
  }),
  anchor: m(
    z
      .string()
      .max(40)
      .regex(/^[a-z0-9-]*$/, "Yalnız küçük harf, rakam ve tire"),
    { label: "Bağlantı çapası", hint: "İngilizce yaz, tüm dillerde aynı olsun. Örn. faq → sayfa/#faq" },
  ),
});
export type BlockSettings = z.infer<typeof blockSettingsSchema>;

export const BLOCK_SCHEMAS = {
  hero: z.object({
    badge: text("Rozet"),
    title: text("Başlık (h1)", "**iki yıldız** arasındaki kelimeler renkli vurgulanır"),
    subtitle: longText("Alt başlık"),
    primaryButton: button("Ana buton"),
    secondaryButton: button("İkincil buton"),
    bullets: m(z.array(text("Madde")).max(5), { label: "Onay maddeleri" }),
  }),
  page_title: z.object({
    eyebrow: text("Üst etiket"),
    title: text("Başlık (h1)", "Sayfanın tek h1 başlığı; landing'de hero kullanılır"),
    description: longText("Açıklama"),
  }),
  template_showcase: z.object({
    ...sectionHeading,
    description: longText("Açıklama"),
    cardButton: text("Kart düğmesi"),
  }),
  example_showcase: z.object({
    ...sectionHeading,
    description: longText("Açıklama"),
    count: m(z.enum(["6", "4", "8"]), {
      label: "Kaç örnek",
      hint: "Yayındaki örnekler, örnek listesindeki sırayla (sıra → en çok kullanılan); hiç yoksa blok görünmez",
    }),
  }),
  steps: z.object({
    ...sectionHeading,
    items: m(z.array(z.object({ title: text("Başlık"), text: longText("Metin") })).max(6), {
      label: "Adımlar",
      summaryField: "title",
    }),
  }),
  comparison: z.object({
    ...sectionHeading,
    description: longText("Açıklama"),
    featureHeader: text("1. sütun başlığı"),
    usHeader: text("2. sütun başlığı (FreehandCV)"),
    rows: m(
      z.array(z.object({ feature: text("Özellik"), us: text("FreehandCV'de") })).max(12),
      { label: "Satırlar", summaryField: "feature" },
    ),
  }),
  features: z.object({
    ...sectionHeading,
    items: m(z.array(z.object({ title: text("Başlık"), text: longText("Metin") })).max(12), {
      label: "Özellik kartları",
      summaryField: "title",
      hint: "İlk iki kart geniş gösterilir",
    }),
  }),
  faq: z.object({
    ...sectionHeading,
    // Optional so blocks saved before the FAQ pool keep validating.
    category: m(z.string().max(40).default(""), {
      label: "SSS kategorisi",
      hint: "Doluysa sorular Yönetim > SSS havuzundan bu kategoriden gelir ve aşağıdaki liste kullanılmaz (ör. genel)",
    }),
    items: m(z.array(z.object({ question: text("Soru"), answer: longText("Cevap") })).max(30), {
      label: "Sorular",
      summaryField: "question",
      hint: "FAQPage yapılandırılmış verisi bu listeden üretilir",
    }),
  }),
  cta: z.object({ title: text("Başlık"), text: longText("Metin"), button: button("Buton") }),
  donation: z.object({
    title: text("Başlık"),
    text: longText("Metin"),
    buttonLabel: text("Buton metni", "Bağlantı site ayarlarındaki bağış adresidir"),
  }),
  reviews: z.object({
    ...sectionHeading,
    count: m(z.enum(["3", "6", "9"]), {
      label: "En fazla kaç yorum",
      hint: "Yalnız yazarın izin verdiği ve yönetimde onaylanan gerçek yorumlar; hiç yoksa blok görünmez",
    }),
  }),
  article: z.object({
    sections: m(
      z
        .array(
          z.object({
            heading: text("Bölüm başlığı (h2)"),
            body: longText("Metin", "Boş satır yeni paragraf, “- ” ile başlayan satırlar liste, **kalın**"),
          }),
        )
        .max(20),
      { label: "Bölümler", summaryField: "heading" },
    ),
  }),
  rich_text: z.object({
    title: text("Başlık (h2)"),
    text: longText("Metin", "Boş satır yeni paragraf; **kalın**"),
  }),
} as const;

export type BlockType = keyof typeof BLOCK_SCHEMAS;
export const BLOCK_TYPES = Object.keys(BLOCK_SCHEMAS) as BlockType[];

export const BLOCK_NAMES: Record<BlockType, string> = {
  hero: "Hero (sayfa girişi)",
  page_title: "Sayfa başlığı",
  template_showcase: "Şablon vitrini",
  example_showcase: "CV örnekleri vitrini",
  steps: "Adımlar",
  comparison: "Karşılaştırma tablosu",
  features: "Özellikler",
  faq: "SSS",
  cta: "Son çağrı (CTA)",
  donation: "Bağış çağrısı",
  reviews: "Kullanıcı yorumları",
  rich_text: "Metin",
  article: "Makale (rehber metni)",
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
