// Şablon = görünüm (plan 11.1). Kullanıcı HTML/CSS yazmaz; şablon Zod ile doğrulanan bir
// tasarım tanımıdır ve CV'yi her zaman aynı çizim motoru basar. Sistem şablonları da
// kullanıcı şablonları da bu tanımla yazılır; çizim motorunda şablona özel `if` yoktur.
import { z } from "zod";
import type { BolumKimligi, CvAyarlari, SablonKimligi } from "./sema";

export const FONTLAR = {
  inter: { ad: "Inter", css: "var(--cv-font-inter), 'Segoe UI', Arial, sans-serif" },
  "ibm-plex": { ad: "IBM Plex Sans", css: "var(--cv-font-ibm-plex), 'Segoe UI', Arial, sans-serif" },
  "source-sans": { ad: "Source Sans 3", css: "var(--cv-font-source-sans), 'Segoe UI', Arial, sans-serif" },
  lato: { ad: "Lato", css: "var(--cv-font-lato), 'Segoe UI', Arial, sans-serif" },
  "source-serif": { ad: "Source Serif 4", css: "var(--cv-font-source-serif), Georgia, 'Times New Roman', serif" },
  merriweather: { ad: "Merriweather", css: "var(--cv-font-merriweather), Georgia, serif" },
} as const;
export type FontKimligi = keyof typeof FONTLAR;
const fontAlani = z.enum(Object.keys(FONTLAR) as [FontKimligi, ...FontKimligi[]]);

const renk = z.string().regex(/^#[0-9a-f]{6}$/i);
const mm = (en: number, cok: number) => z.number().min(en).max(cok);

export const tasarimSemasi = z.object({
  surum: z.literal(1),
  yerlesim: z.enum(["tek-sutun", "kenar-cubugu-sol", "kenar-cubugu-sag", "ust-bant"]),
  kenar: z
    .object({
      genislik: mm(45, 90),
      /** Kenar çubuğunda gösterilen bölümler; geri kalanı ana sütunda. */
      bolumler: z.array(z.string()),
    })
    .optional(),
  ustBilgi: z.object({
    hizalama: z.enum(["sol", "orta"]),
    foto: z.enum(["yok", "yuvarlak", "kare", "koseli"]),
    ayrac: z.enum(["yok", "ince", "kalin", "vurgu", "cift"]),
    unvan: z.enum(["vurgu", "buyuk-harf", "soluk-buyuk-harf"]),
    adRengi: z.enum(["koyu", "vurgu"]),
  }),
  renkler: z.object({ vurgu: renk, metin: renk, soluk: renk, cizgi: renk }),
  /** Vurgu yerine her yerde metin rengi (siyah-beyaz ATS şablonları). */
  tekRenk: z.boolean(),
  yazi: z.object({
    font: fontAlani,
    boyut: z.number().min(8.5).max(12),
    satir: z.number().min(1.2).max(1.7),
  }),
  bolumBasligi: z.enum(["buyuk-harf", "alt-cizgi", "sol-cubuk", "kare-imli", "cizgiyle-uzayan"]),
  maddeler: z.enum(["nokta", "tire", "ok", "yok"]),
  yetenekler: z.enum(["liste", "etiket", "iki-sutun"]),
  iletisim: z.enum(["ikonlu", "ayracli"]),
  ayracKarakteri: z.enum(["|", "·", "–"]),
  kurum: z.enum(["kalin", "italik"]),
  kenarBosluk: z.object({ ust: mm(6, 25), alt: mm(6, 25), yatay: mm(10, 25) }),
});
export type TasarimTanimi = z.infer<typeof tasarimSemasi>;

type SistemSablonu = { kimlik: SablonKimligi; ats: number; tanim: TasarimTanimi };

const ORTAK_RENK = { metin: "#1f2937", soluk: "#4b5563", cizgi: "#d6dbe3" };
const ORTAK_BOSLUK = { ust: 12, alt: 12, yatay: 16 };

export const SISTEM_SABLONLARI: Record<SablonKimligi, SistemSablonu> = {
  modern: {
    kimlik: "modern",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: { hizalama: "sol", foto: "yuvarlak", ayrac: "vurgu", unvan: "vurgu", adRengi: "koyu" },
      renkler: { vurgu: "#1f3a5f", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "inter", boyut: 10, satir: 1.42 },
      bolumBasligi: "cizgiyle-uzayan",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  ats: {
    kimlik: "ats",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: { hizalama: "sol", foto: "yok", ayrac: "kalin", unvan: "vurgu", adRengi: "koyu" },
      renkler: { vurgu: "#111111", metin: "#111111", soluk: "#3f4752", cizgi: "#9aa1ab" },
      tekRenk: true,
      yazi: { font: "source-sans", boyut: 10, satir: 1.42 },
      bolumBasligi: "alt-cizgi",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "|",
      kurum: "kalin",
      kenarBosluk: { ust: 12, alt: 12, yatay: 18 },
    },
  },
  zarif: {
    kimlik: "zarif",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: { hizalama: "orta", foto: "yuvarlak", ayrac: "cift", unvan: "buyuk-harf", adRengi: "koyu" },
      renkler: { vurgu: "#1f3a5f", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "source-serif", boyut: 10, satir: 1.42 },
      bolumBasligi: "alt-cizgi",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "·",
      kurum: "italik",
      kenarBosluk: { ust: 12, alt: 12, yatay: 19 },
    },
  },
  teknik: {
    kimlik: "teknik",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "ust-bant",
      ustBilgi: { hizalama: "sol", foto: "koseli", ayrac: "yok", unvan: "vurgu", adRengi: "koyu" },
      renkler: { vurgu: "#1d4ed8", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "ibm-plex", boyut: 10, satir: 1.42 },
      bolumBasligi: "kare-imli",
      maddeler: "nokta",
      yetenekler: "iki-sutun",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  kenar: {
    kimlik: "kenar",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "kenar-cubugu-sol",
      kenar: { genislik: 67, bolumler: ["yetenekler", "diller", "sertifikalar", "ilgi"] },
      ustBilgi: { hizalama: "sol", foto: "yuvarlak", ayrac: "vurgu", unvan: "soluk-buyuk-harf", adRengi: "vurgu" },
      renkler: { vurgu: "#0f766e", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "lato", boyut: 10, satir: 1.42 },
      bolumBasligi: "buyuk-harf",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
};

export const VURGU_RENKLERI = [
  "#1f3a5f",
  "#1d4ed8",
  "#0f766e",
  "#166534",
  "#8b1e3f",
  "#5b21b6",
  "#334155",
  "#111827",
] as const;

const BOYUT_CARPANI = { kucuk: 0.93, orta: 1, buyuk: 1.07 } as const;
const ARALIK_CARPANI = { siki: 0.7, normal: 1, ferah: 1.3 } as const;

export const KAGIT_OLCULERI = {
  A4: { genislik: 210, yukseklik: 297 },
  Letter: { genislik: 215.9, yukseklik: 279.4 },
} as const;

/** Tanım + CV'nin kendi ayarları (renk, yazı tipi, boyut, aralık) = çizilecek son tasarım. */
export type CozulmusTasarim = TasarimTanimi & {
  fotoGoster: boolean;
  aralikCarpani: number;
  kagit: CvAyarlari["kagit"];
};

export function tasarimCoz(tanim: TasarimTanimi, ayarlar: CvAyarlari): CozulmusTasarim {
  const font = ayarlar.font in FONTLAR ? (ayarlar.font as FontKimligi) : tanim.yazi.font;
  return {
    ...tanim,
    renkler: { ...tanim.renkler, vurgu: tanim.tekRenk ? tanim.renkler.metin : ayarlar.renk },
    yazi: { ...tanim.yazi, font, boyut: +(tanim.yazi.boyut * BOYUT_CARPANI[ayarlar.boyut]).toFixed(2) },
    fotoGoster: ayarlar.foto && tanim.ustBilgi.foto !== "yok",
    aralikCarpani: ARALIK_CARPANI[ayarlar.aralik],
    kagit: ayarlar.kagit,
  };
}

export function sistemTanimi(kimlik: SablonKimligi): TasarimTanimi {
  return SISTEM_SABLONLARI[kimlik].tanim;
}

export function kenardaMi(tasarim: TasarimTanimi, bolum: BolumKimligi) {
  return !!tasarim.kenar && tasarim.kenar.bolumler.includes(bolum);
}
