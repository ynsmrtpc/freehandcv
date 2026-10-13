// Converts CMS JSON written with the original Turkish keys (blocks, site settings, page version
// meta) to the English shapes in docs/GLOSSARY.md. Used on read, so a database that has not been
// converted yet still renders, and by scripts/convert-legacy-data.ts. Every function is
// idempotent: English input comes back unchanged (a new object with equal content).

type Json = Record<string, unknown>;

/** New key, or [new key, transform applied to the value]. */
type KeyMap = Record<string, string | [string, (value: unknown) => unknown]>;

const isObject = (v: unknown): v is Json => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Renames the keys in `map` (old → new) and keeps key order. When both the old and the new key
 * exist, the old one is a leftover and the English value wins. Transforms also run on values
 * that are already under the new key, so nested legacy data inside English keys is converted too.
 */
function renameKeys(value: unknown, map: KeyMap): unknown {
  if (!isObject(value)) return value;
  const transforms = new Map<string, (v: unknown) => unknown>();
  for (const rule of Object.values(map)) if (typeof rule !== "string") transforms.set(rule[0], rule[1]);

  const out: Json = {};
  for (const [key, v] of Object.entries(value)) {
    const rule = Object.hasOwn(map, key) ? map[key] : undefined;
    const newKey = rule === undefined ? key : typeof rule === "string" ? rule : rule[0];
    if (newKey !== key && Object.hasOwn(value, newKey)) continue;
    const transform = transforms.get(newKey);
    out[newKey] = transform ? transform(v) : v;
  }
  return out;
}

const mapList = (map: KeyMap) => (v: unknown) => (Array.isArray(v) ? v.map((x) => renameKeys(x, map)) : v);
const mapObject = (map: KeyMap) => (v: unknown) => renameKeys(v, map);

/* ---------------- Blocks ---------------- */

const BLOCK_TYPE_MAP: Record<string, string> = {
  sayfa_basligi: "page_title",
  sablon_vitrini: "template_showcase",
  adimlar: "steps",
  karsilastirma: "comparison",
  ozellikler: "features",
  sss: "faq",
  bagis: "donation",
  zengin_metin: "rich_text",
};

const BACKGROUND_MAP: Record<string, string> = { yok: "none", hafif: "subtle" };

const SETTINGS_MAP: KeyMap = {
  gorunur: "visible",
  mobildeGizle: "hideOnMobile",
  arkaPlan: ["background", (v) => (typeof v === "string" && Object.hasOwn(BACKGROUND_MAP, v) ? BACKGROUND_MAP[v] : v)],
  capa: "anchor",
};

const BUTTON_MAP: KeyMap = { metin: "label", baglanti: "href" };
const HEADING_MAP: KeyMap = { ust: "eyebrow", baslik: "title" };
const TITLE_TEXT_MAP: KeyMap = { baslik: "title", metin: "text" };

const CONTENT_MAPS: Record<string, KeyMap> = {
  hero: {
    rozet: "badge",
    baslik: "title",
    altBaslik: "subtitle",
    anaButon: ["primaryButton", mapObject(BUTTON_MAP)],
    ikincilButon: ["secondaryButton", mapObject(BUTTON_MAP)],
    maddeler: "bullets",
  },
  page_title: { ...HEADING_MAP, aciklama: "description" },
  template_showcase: { ...HEADING_MAP, aciklama: "description", sec: "cardButton" },
  steps: { ...HEADING_MAP, liste: ["items", mapList(TITLE_TEXT_MAP)] },
  comparison: {
    ...HEADING_MAP,
    aciklama: "description",
    konu: "featureHeader",
    diger: "othersHeader",
    biz: "usHeader",
    satirlar: ["rows", mapList({ konu: "feature", diger: "others", biz: "us" })],
  },
  features: { ...HEADING_MAP, liste: ["items", mapList(TITLE_TEXT_MAP)] },
  faq: { ...HEADING_MAP, liste: ["items", mapList({ soru: "question", cevap: "answer" })] },
  cta: { ...TITLE_TEXT_MAP, buton: ["button", mapObject(BUTTON_MAP)] },
  donation: { ...TITLE_TEXT_MAP, buton: "buttonLabel" },
  rich_text: TITLE_TEXT_MAP,
};

function migrateBlock(block: unknown): unknown {
  if (!isObject(block)) return block;
  const rawType = block.type ?? block.tur;
  const type = typeof rawType === "string" && Object.hasOwn(BLOCK_TYPE_MAP, rawType) ? BLOCK_TYPE_MAP[rawType] : rawType;
  const contentMap = typeof type === "string" && Object.hasOwn(CONTENT_MAPS, type) ? CONTENT_MAPS[type] : undefined;
  return renameKeys(block, {
    tur: ["type", () => type],
    ayarlar: ["settings", mapObject(SETTINGS_MAP)],
    icerik: ["content", (v) => (contentMap ? renameKeys(v, contentMap) : v)],
  });
}

/** Converts a block list (pages.draft_blocks, pages.published_blocks, page_versions.blocks). */
export function migrateLegacyBlocks(blocks: unknown): unknown {
  return Array.isArray(blocks) ? blocks.map(migrateBlock) : blocks;
}

/* ---------------- Site settings ---------------- */

const ENABLED_URL_MAP: KeyMap = { aktif: "enabled", baglanti: "url" };

const GLOBAL_SETTINGS_MAP: KeyMap = {
  iletisimEposta: "contactEmail",
  sosyal: "social",
  bagis: ["donation", mapObject(ENABLED_URL_MAP)],
};

const ANNOUNCEMENT_MAP: KeyMap = { aktif: "enabled", metin: "text", baglanti: "href" };

const LOCALE_SETTINGS_MAP: KeyMap = {
  duyuru: ["announcement", mapObject(ANNOUNCEMENT_MAP)],
  altBilgiSlogan: "footerTagline",
  bagisMetni: "donationLabel",
};

/** Converts a site_settings row (`settings` and every locale in `translations`). */
export function migrateLegacySiteSettings(row: { settings: unknown; translations: unknown }): {
  settings: unknown;
  translations: unknown;
} {
  const translations = isObject(row.translations)
    ? Object.fromEntries(
        Object.entries(row.translations).map(([locale, v]) => [locale, renameKeys(v, LOCALE_SETTINGS_MAP)]),
      )
    : row.translations;
  return { settings: renameKeys(row.settings, GLOBAL_SETTINGS_MAP), translations };
}

/* ---------------- Page version meta ---------------- */

/** Converts page_versions.meta ({baslik, metaBaslik, metaAciklama, indeks}). */
export function migrateLegacyPageMeta(meta: unknown): unknown {
  return renameKeys(meta, {
    baslik: "title",
    metaBaslik: "metaTitle",
    metaAciklama: "metaDescription",
    indeks: "indexable",
  });
}
