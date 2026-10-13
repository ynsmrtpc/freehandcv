import { describe, expect, it } from "vitest";
import { BLOCK_SCHEMAS, BLOCK_TYPES, blockListSchema, newBlock } from "./blocks";
import { defaultLandingBlocks } from "./defaultContent";
import { migrateLegacyBlocks, migrateLegacyPageMeta, migrateLegacySiteSettings } from "./legacyContent";
import { resolveGlobalSettings, resolveLocaleSettings } from "./siteSettings";
import { seedPages } from "../../scripts/seed-pages";

describe("blocks", () => {
  it("default landing blocks match the schema", () => {
    for (const locale of ["tr", "en"] as const) {
      const result = blockListSchema.safeParse(defaultLandingBlocks(locale));
      expect(result.error?.issues ?? []).toEqual([]);
    }
  });

  it("seed pages match the schema", () => {
    for (const locale of ["tr", "en"] as const)
      for (const p of seedPages(locale)) {
        const result = blockListSchema.safeParse(p.blocks);
        expect([p.slug, result.error?.issues ?? []]).toEqual([p.slug, []]);
      }
  });

  it("a new block of every type matches the schema", () => {
    for (const type of BLOCK_TYPES) {
      const b = newBlock(type);
      expect(BLOCK_SCHEMAS[type].safeParse(b.content).success).toBe(true);
    }
  });

  it("rejects an unsafe link", () => {
    const b = defaultLandingBlocks("tr");
    const hero = structuredClone(b[0]) as Extract<(typeof b)[number], { type: "hero" }>;
    hero.content.primaryButton.href = "javascript:alert(1)";
    expect(blockListSchema.safeParse([hero]).success).toBe(false);
  });
});

// Turkish-keyed blocks as stored before the English rename.
const LEGACY_BLOCKS = [
  {
    id: "hero",
    tur: "hero",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "" },
    icerik: {
      rozet: "Rozet",
      baslik: "CV'ni **ücretsiz** hazırla",
      altBaslik: "Alt",
      anaButon: { metin: "Başla", baglanti: "/cv-olustur" },
      ikincilButon: { metin: "Şablonlar", baglanti: "#sablonlar" },
      maddeler: ["Bir", "İki"],
    },
  },
  {
    id: "s",
    tur: "sablon_vitrini",
    ayarlar: { gorunur: true, mobildeGizle: true, arkaPlan: "hafif", capa: "sablonlar" },
    icerik: { ust: "Ü", baslik: "B", aciklama: "A", sec: "Seç" },
  },
  {
    id: "p",
    tur: "sayfa_basligi",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "" },
    icerik: { ust: "Ü", baslik: "B", aciklama: "A" },
  },
  {
    id: "a",
    tur: "adimlar",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "nasil-calisir" },
    icerik: { ust: "Ü", baslik: "B", liste: [{ baslik: "1", metin: "bir" }] },
  },
  {
    id: "k",
    tur: "karsilastirma",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "" },
    icerik: {
      ust: "Ü",
      baslik: "B",
      aciklama: "A",
      konu: "Özellik",
      diger: "Diğer",
      biz: "Biz",
      satirlar: [{ konu: "PDF", diger: "Ücretli", biz: "Ücretsiz" }],
    },
  },
  {
    id: "o",
    tur: "ozellikler",
    ayarlar: { gorunur: false, mobildeGizle: false, arkaPlan: "hafif", capa: "" },
    icerik: { ust: "Ü", baslik: "B", liste: [{ baslik: "ATS", metin: "uyumlu" }] },
  },
  {
    id: "q",
    tur: "sss",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "sss" },
    icerik: { ust: "Ü", baslik: "B", liste: [{ soru: "S?", cevap: "C." }] },
  },
  {
    id: "c",
    tur: "cta",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "" },
    icerik: { baslik: "B", metin: "M", buton: { metin: "Git", baglanti: "/cv-olustur" } },
  },
  {
    id: "d",
    tur: "bagis",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "" },
    icerik: { baslik: "B", metin: "M", buton: "Bağış yap" },
  },
  {
    id: "r",
    tur: "zengin_metin",
    ayarlar: { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "" },
    icerik: { baslik: "B", metin: "M" },
  },
];

describe("legacy content", () => {
  it("converts Turkish-keyed blocks of every type to valid English blocks", () => {
    const converted = migrateLegacyBlocks(LEGACY_BLOCKS);
    const result = blockListSchema.safeParse(converted);
    expect(result.error?.issues ?? []).toEqual([]);
    expect(new Set((converted as { type: string }[]).map((b) => b.type))).toEqual(new Set(BLOCK_TYPES));
  });

  it("maps block keys and values per the glossary", () => {
    const [hero, showcase, , , comparison, , faq, cta, donation] = migrateLegacyBlocks(LEGACY_BLOCKS) as Record<
      string,
      unknown
    >[];
    expect(hero).toEqual({
      id: "hero",
      type: "hero",
      settings: { visible: true, hideOnMobile: false, background: "none", anchor: "" },
      content: {
        badge: "Rozet",
        title: "CV'ni **ücretsiz** hazırla",
        subtitle: "Alt",
        primaryButton: { label: "Başla", href: "/cv-olustur" },
        secondaryButton: { label: "Şablonlar", href: "#sablonlar" },
        bullets: ["Bir", "İki"],
      },
    });
    expect(showcase.settings).toEqual({ visible: true, hideOnMobile: true, background: "subtle", anchor: "sablonlar" });
    expect(showcase.content).toEqual({ eyebrow: "Ü", title: "B", description: "A", cardButton: "Seç" });
    expect(comparison.content).toEqual({
      eyebrow: "Ü",
      title: "B",
      description: "A",
      featureHeader: "Özellik",
      othersHeader: "Diğer",
      usHeader: "Biz",
      rows: [{ feature: "PDF", others: "Ücretli", us: "Ücretsiz" }],
    });
    expect(faq.content).toEqual({ eyebrow: "Ü", title: "B", items: [{ question: "S?", answer: "C." }] });
    expect(cta.content).toEqual({ title: "B", text: "M", button: { label: "Git", href: "/cv-olustur" } });
    expect(donation).toMatchObject({ type: "donation", content: { title: "B", text: "M", buttonLabel: "Bağış yap" } });
  });

  it("is idempotent and leaves English blocks unchanged", () => {
    const once = migrateLegacyBlocks(LEGACY_BLOCKS);
    expect(migrateLegacyBlocks(once)).toEqual(once);
    for (const locale of ["tr", "en"] as const) {
      const english = defaultLandingBlocks(locale);
      expect(migrateLegacyBlocks(english)).toEqual(english);
      for (const p of seedPages(locale)) expect(migrateLegacyBlocks(p.blocks)).toEqual(p.blocks);
    }
  });

  it("passes non-array input through", () => {
    expect(migrateLegacyBlocks(null)).toBeNull();
    expect(migrateLegacyBlocks({ a: 1 })).toEqual({ a: 1 });
  });

  it("converts site settings and every locale's translations", () => {
    const legacy = {
      settings: {
        iletisimEposta: "a@b.co",
        sosyal: { linkedin: "https://l.in", x: "", instagram: "", github: "" },
        bagis: { aktif: true, baglanti: "https://d.co" },
      },
      translations: {
        tr: { duyuru: { aktif: true, metin: "Yeni", baglanti: "/x" }, altBilgiSlogan: "Slogan", bagisMetni: "Destek ol" },
        en: { duyuru: { aktif: false, metin: "", baglanti: "" }, altBilgiSlogan: "", bagisMetni: "" },
      },
    };
    const converted = migrateLegacySiteSettings(legacy);
    expect(converted.settings).toEqual({
      contactEmail: "a@b.co",
      social: { linkedin: "https://l.in", x: "", instagram: "", github: "" },
      donation: { enabled: true, url: "https://d.co" },
    });
    expect((converted.translations as Record<string, unknown>).tr).toEqual({
      announcement: { enabled: true, text: "Yeni", href: "/x" },
      footerTagline: "Slogan",
      donationLabel: "Destek ol",
    });
    expect(resolveGlobalSettings(converted.settings)).toEqual(converted.settings);
    const tr = (converted.translations as Record<string, unknown>).tr;
    expect(resolveLocaleSettings(tr)).toEqual(tr);
    expect(migrateLegacySiteSettings(converted)).toEqual(converted);
  });

  it("keeps empty or missing site settings as they are", () => {
    expect(migrateLegacySiteSettings({ settings: {}, translations: {} })).toEqual({ settings: {}, translations: {} });
    expect(migrateLegacySiteSettings({ settings: null, translations: null })).toEqual({ settings: null, translations: null });
  });

  it("converts page version meta", () => {
    const meta = { baslik: "B", metaBaslik: "MB", metaAciklama: "MA", indeks: true };
    const converted = migrateLegacyPageMeta(meta);
    expect(converted).toEqual({ title: "B", metaTitle: "MB", metaDescription: "MA", indexable: true });
    expect(migrateLegacyPageMeta(converted)).toEqual(converted);
  });
});
