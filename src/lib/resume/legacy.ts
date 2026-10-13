// Converts legacy Turkish-keyed resume JSON (old static app exports, guest data in localStorage,
// early database rows) to the English shape. Pure and idempotent: English keys and values pass
// through unchanged, so it is safe to run on every input before schema validation.

type Obj = Record<string, unknown>;

const isObject = (v: unknown): v is Obj => !!v && typeof v === "object" && !Array.isArray(v);

const TOP_LEVEL: Record<string, string> = {
  surum: "version",
  ayarlar: "settings",
  kisisel: "personal",
  ozet: "summary",
  deneyim: "experience",
  projeler: "projects",
  yetenekler: "skills",
  egitim: "education",
  sertifikalar: "certifications",
  diller: "languages",
  referanslar: "references",
  ilgi: "interests",
};

/** Section ids are the same as the top-level keys. */
const SECTION_IDS = TOP_LEVEL;

const SETTINGS: Record<string, string> = {
  sablon: "template",
  renk: "color",
  boyut: "size",
  aralik: "spacing",
  foto: "showPhoto",
  dil: "locale",
  kagit: "paper",
  bolumSirasi: "sectionOrder",
  gizli: "hiddenSections",
  basliklar: "sectionTitles",
};

const PERSONAL: Record<string, string> = {
  ad: "name",
  unvan: "title",
  eposta: "email",
  telefon: "phone",
  konum: "location",
  foto: "photo",
  ekler: "extras",
};

const EXTRA: Record<string, string> = { etiket: "label", deger: "value" };

const ENTRY_COMMON: Record<string, string> = { gizli: "hidden" };

const ENTRIES: Record<string, Record<string, string>> = {
  experience: {
    pozisyon: "position",
    kurum: "company",
    konum: "location",
    baslangic: "start",
    bitis: "end",
    devam: "current",
    aciklama: "description",
    maddeler: "bullets",
  },
  projects: {
    ad: "name",
    rol: "role",
    baslangic: "start",
    bitis: "end",
    teknolojiler: "technologies",
    baglanti: "link",
    aciklama: "description",
    maddeler: "bullets",
  },
  skills: { kategori: "category", liste: "items" },
  education: {
    okul: "school",
    bolum: "field",
    derece: "degree",
    baslangic: "start",
    bitis: "end",
    not: "gpa",
    konum: "location",
    aciklama: "description",
  },
  certifications: { ad: "name", kurum: "issuer", tarih: "date", baglanti: "link" },
  languages: { dil: "language", seviye: "level" },
  references: { ad: "name", unvan: "title", kurum: "company", telefon: "phone", eposta: "email" },
};

export const LEGACY_TEMPLATE_IDS: Record<string, string> = {
  zarif: "elegant",
  yonetici: "elegant",
  teknik: "technical",
  kenar: "sidebar",
  kurumsal: "corporate",
  ikili: "two-column",
  kontrast: "contrast",
  isvicre: "swiss",
  akademik: "academic",
  zaman: "timeline",
  yaratici: "creative",
  girisim: "startup",
  ferah: "airy",
  "yeni-mezun": "graduate",
  "acik-kenar": "light-sidebar",
  editoryal: "editorial",
  butik: "boutique",
  kompakt: "compact",
  resmi: "formal",
  klasik: "classic",
  sade: "minimal",
};

const SIZE_VALUES: Record<string, string> = { kucuk: "small", orta: "medium", buyuk: "large" };
const SPACING_VALUES: Record<string, string> = { siki: "compact", ferah: "relaxed" };

/** Renames keys found in `map`; an English key that already exists wins over its legacy twin. */
function renameKeys(o: Obj, map: Record<string, string>): Obj {
  const out: Obj = {};
  for (const [k, v] of Object.entries(o)) {
    const target = map[k];
    if (!target) out[k] = v;
    else if (!(target in o)) out[target] = v;
  }
  return out;
}

const mapValue = (v: unknown, map: Record<string, string>) =>
  typeof v === "string" && Object.hasOwn(map, v) ? map[v] : v;

function migrateSettings(input: unknown): unknown {
  if (!isObject(input)) return input;
  const s = renameKeys(input, SETTINGS);
  if ("template" in s) s.template = mapValue(s.template, LEGACY_TEMPLATE_IDS);
  if ("size" in s) s.size = mapValue(s.size, SIZE_VALUES);
  if ("spacing" in s) s.spacing = mapValue(s.spacing, SPACING_VALUES);
  for (const k of ["sectionOrder", "hiddenSections"]) {
    if (Array.isArray(s[k])) s[k] = (s[k] as unknown[]).map((id) => mapValue(id, SECTION_IDS));
  }
  if (isObject(s.sectionTitles)) s.sectionTitles = renameKeys(s.sectionTitles, SECTION_IDS);
  return s;
}

function migratePersonal(input: unknown): unknown {
  if (!isObject(input)) return input;
  const p = renameKeys(input, PERSONAL);
  if (Array.isArray(p.extras)) p.extras = p.extras.map((e) => (isObject(e) ? renameKeys(e, EXTRA) : e));
  return p;
}

export function migrateLegacyResume(input: unknown): unknown {
  if (!isObject(input)) return input;
  const r = renameKeys(input, TOP_LEVEL);
  if ("settings" in r) r.settings = migrateSettings(r.settings);
  if ("personal" in r) r.personal = migratePersonal(r.personal);
  for (const [section, map] of Object.entries(ENTRIES)) {
    const list = r[section];
    if (!Array.isArray(list)) continue;
    const fields = { ...ENTRY_COMMON, ...map };
    r[section] = list.map((e) => (isObject(e) ? renameKeys(e, fields) : e));
  }
  return r;
}
