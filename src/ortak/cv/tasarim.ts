// Şablon = görünüm (plan 11.1). Kullanıcı HTML/CSS yazmaz; şablon Zod ile doğrulanan bir
// tasarım tanımıdır ve CV'yi her zaman aynı çizim motoru basar. Sistem şablonları da
// kullanıcı şablonları da bu tanımla yazılır; çizim motorunda şablona özel `if` yoktur.
import { z } from "zod";
import { SABLON_KIMLIKLERI, type BolumKimligi, type CvAyarlari, type SablonKimligi } from "./sema";

export const FONTLAR = {
  inter: {
    ad: "Inter",
    css: "var(--cv-font-inter), 'Segoe UI', Arial, sans-serif",
  },
  "ibm-plex": {
    ad: "IBM Plex Sans",
    css: "var(--cv-font-ibm-plex), 'Segoe UI', Arial, sans-serif",
  },
  "source-sans": {
    ad: "Source Sans 3",
    css: "var(--cv-font-source-sans), 'Segoe UI', Arial, sans-serif",
  },
  lato: {
    ad: "Lato",
    css: "var(--cv-font-lato), 'Segoe UI', Arial, sans-serif",
  },
  "dm-sans": {
    ad: "DM Sans",
    css: "var(--cv-font-dm-sans), 'Segoe UI', Arial, sans-serif",
  },
  "nunito-sans": {
    ad: "Nunito Sans",
    css: "var(--cv-font-nunito-sans), 'Segoe UI', Arial, sans-serif",
  },
  "work-sans": {
    ad: "Work Sans",
    css: "var(--cv-font-work-sans), 'Segoe UI', Arial, sans-serif",
  },
  "space-grotesk": {
    ad: "Space Grotesk",
    css: "var(--cv-font-space-grotesk), 'Segoe UI', Arial, sans-serif",
  },
  montserrat: {
    ad: "Montserrat",
    css: "var(--cv-font-montserrat), 'Segoe UI', Arial, sans-serif",
  },
  "source-serif": {
    ad: "Source Serif 4",
    css: "var(--cv-font-source-serif), Georgia, 'Times New Roman', serif",
  },
  merriweather: {
    ad: "Merriweather",
    css: "var(--cv-font-merriweather), Georgia, serif",
  },
  "eb-garamond": {
    ad: "EB Garamond",
    css: "var(--cv-font-eb-garamond), Garamond, Georgia, serif",
  },
  playfair: {
    ad: "Playfair Display",
    css: "var(--cv-font-playfair), Georgia, 'Times New Roman', serif",
  },
} as const;
export type FontKimligi = keyof typeof FONTLAR;
const fontAlani = z.enum(Object.keys(FONTLAR) as [FontKimligi, ...FontKimligi[]]);

const renk = z.string().regex(/^#[0-9a-f]{6}$/i);
const mm = (en: number, cok: number) => z.number().min(en).max(cok);

// Sonradan eklenen seçenekler isteğe bağlıdır (optional); yokken çizim motoru ilk sürümdeki
// görünümü korur. Böylece eski tanımlar (ve kullanıcı şablonları) değişmeden geçerli kalır.
export const tasarimSemasi = z.object({
  surum: z.literal(1),
  yerlesim: z.enum(["tek-sutun", "kenar-cubugu-sol", "kenar-cubugu-sag", "ust-bant"]),
  kenar: z
    .object({
      genislik: mm(45, 90),
      /** Kenar çubuğunda gösterilen bölümler; geri kalanı ana sütunda. */
      bolumler: z.array(z.string()),
      /** Kenar çubuğu zemini: vurgu rengi (beyaz yazı), açık vurgu tonu, gri ya da yalnız ayırıcı çizgi. */
      zemin: z.enum(["vurgu", "acik", "gri", "cizgi"]).optional(),
      /** Üst bilgi (ad, iletişim, fotoğraf) iki sütunun üstünde tam genişlikte durur. */
      tamUstBilgi: z.boolean().optional(),
    })
    .optional(),
  ustBilgi: z.object({
    /** iki-yana: ad ve unvan solda, iletişim alt alta sağda. */
    hizalama: z.enum(["sol", "orta", "iki-yana"]),
    foto: z.enum(["yok", "yuvarlak", "kare", "koseli"]),
    ayrac: z.enum(["yok", "ince", "kalin", "vurgu", "cift"]),
    unvan: z.enum(["vurgu", "buyuk-harf", "soluk-buyuk-harf"]),
    adRengi: z.enum(["koyu", "vurgu"]),
    adBoyutu: z.enum(["kucuk", "orta", "buyuk", "dev"]).optional(),
    adBicimi: z.enum(["kalin", "ince", "buyuk-harf", "ince-buyuk-harf"]).optional(),
  }),
  /**
   * Üst bilginin zemini. Yoksa "ust-bant" yerleşiminde vurgu, diğerlerinde zeminsiz.
   * vurgu/koyu: beyaz yazı; acik: vurgunun açık tonu üstünde koyu yazı.
   */
  bant: z.enum(["yok", "vurgu", "koyu", "acik"]).optional(),
  /** Kâğıt kenarında ince vurgu şeridi (kenar çubuklu yerleşimlerde uygulanmaz). */
  serit: z.enum(["yok", "sol", "ust"]).optional(),
  renkler: z.object({ vurgu: renk, metin: renk, soluk: renk, cizgi: renk }),
  /** Vurgu yerine her yerde metin rengi (siyah-beyaz ATS şablonları). */
  tekRenk: z.boolean(),
  yazi: z.object({
    font: fontAlani,
    /** Ad ve bölüm başlıkları için ayrı yazı tipi (yoksa gövdeyle aynı). */
    baslikFont: fontAlani.optional(),
    boyut: z.number().min(8.5).max(12),
    satir: z.number().min(1.2).max(1.7),
  }),
  bolumBasligi: z.enum([
    "buyuk-harf",
    "alt-cizgi",
    "sol-cubuk",
    "kare-imli",
    "cizgiyle-uzayan",
    "kutu",
    "ortali",
    "kisa-cizgi",
  ]),
  /** Bölüm başlığı harfleri: BÜYÜK HARF (varsayılan) ya da yazıldığı gibi, biraz daha iri. */
  bolumBasligiHarf: z.enum(["buyuk", "normal"]).optional(),
  /** yan: bölüm başlığı solda dar bir sütunda, içerik sağında. */
  bolumDuzeni: z.enum(["ust", "yan"]).optional(),
  maddeler: z.enum(["nokta", "tire", "ok", "kare", "yok"]),
  yetenekler: z.enum(["liste", "etiket", "iki-sutun"]),
  etiketStili: z.enum(["dolu", "cerceve"]).optional(),
  iletisim: z.enum(["ikonlu", "ayracli"]),
  ayracKarakteri: z.enum(["|", "·", "–"]),
  kurum: z.enum(["kalin", "italik", "vurgu"]),
  /** Tarih aralığı: başlık satırının sağında, başlığın altında ya da solda ayrı bir sütunda. */
  tarihYeri: z.enum(["sag", "alt", "sol"]).optional(),
  /** Deneyim, proje ve eğitim kalemleri dikey bir zaman çizgisine bağlanır. */
  zamanCizelgesi: z.boolean().optional(),
  kenarBosluk: z.object({ ust: mm(6, 25), alt: mm(6, 25), yatay: mm(10, 25) }),
});
export type TasarimTanimi = z.infer<typeof tasarimSemasi>;

export type SistemSablonu = {
  kimlik: SablonKimligi;
  /** Elle verilmiş ATS uyum puanı (1–5): düz tek sütun 5; kenar çubuğu, bant, süs arttıkça düşer. */
  ats: number;
  /** Landing vitrininde ve hero önizlemesinde gösterilir. */
  oneCikan?: boolean;
  tanim: TasarimTanimi;
};

const ORTAK_RENK = { metin: "#1f2937", soluk: "#4b5563", cizgi: "#d6dbe3" };
const SIYAH_BEYAZ = {
  vurgu: "#111111",
  metin: "#111111",
  soluk: "#3f4752",
  cizgi: "#9aa1ab",
};
const ORTAK_BOSLUK = { ust: 12, alt: 12, yatay: 16 };
const KENAR_BOLUMLERI = ["yetenekler", "diller", "sertifikalar", "ilgi"];

export const SISTEM_SABLONLARI: Record<SablonKimligi, SistemSablonu> = {
  modern: {
    kimlik: "modern",
    ats: 5,
    oneCikan: true,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "vurgu",
        unvan: "vurgu",
        adRengi: "koyu",
      },
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
    oneCikan: true,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "sol",
        foto: "yok",
        ayrac: "kalin",
        unvan: "vurgu",
        adRengi: "koyu",
      },
      renkler: SIYAH_BEYAZ,
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
      ustBilgi: {
        hizalama: "orta",
        foto: "yuvarlak",
        ayrac: "cift",
        unvan: "buyuk-harf",
        adRengi: "koyu",
      },
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
      ustBilgi: {
        hizalama: "sol",
        foto: "koseli",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "koyu",
      },
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
    oneCikan: true,
    tanim: {
      surum: 1,
      yerlesim: "kenar-cubugu-sol",
      kenar: { genislik: 67, bolumler: KENAR_BOLUMLERI },
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "vurgu",
        unvan: "soluk-buyuk-harf",
        adRengi: "vurgu",
      },
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
  kurumsal: {
    kimlik: "kurumsal",
    ats: 5,
    oneCikan: true,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "iki-yana",
        foto: "yok",
        ayrac: "kalin",
        unvan: "buyuk-harf",
        adRengi: "koyu",
        adBoyutu: "buyuk",
      },
      renkler: { vurgu: "#111827", ...ORTAK_RENK },
      tekRenk: false,
      yazi: {
        font: "source-sans",
        baslikFont: "playfair",
        boyut: 10.2,
        satir: 1.45,
      },
      bolumBasligi: "alt-cizgi",
      bolumBasligiHarf: "normal",
      maddeler: "kare",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "italik",
      kenarBosluk: { ust: 14, alt: 14, yatay: 18 },
    },
  },
  isvicre: {
    kimlik: "isvicre",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "sol",
        foto: "yok",
        ayrac: "yok",
        unvan: "soluk-buyuk-harf",
        adRengi: "koyu",
        adBoyutu: "dev",
      },
      renkler: { vurgu: "#b91c1c", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "inter", boyut: 9.6, satir: 1.45 },
      bolumBasligi: "buyuk-harf",
      bolumDuzeni: "yan",
      maddeler: "tire",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: { ust: 14, alt: 14, yatay: 17 },
    },
  },
  ikili: {
    kimlik: "ikili",
    ats: 4,
    oneCikan: true,
    tanim: {
      surum: 1,
      yerlesim: "kenar-cubugu-sag",
      kenar: {
        genislik: 64,
        bolumler: KENAR_BOLUMLERI,
        zemin: "gri",
        tamUstBilgi: true,
      },
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "koyu",
        adBoyutu: "buyuk",
      },
      renkler: { vurgu: "#0e7490", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "dm-sans", boyut: 9.8, satir: 1.42 },
      bolumBasligi: "cizgiyle-uzayan",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  kontrast: {
    kimlik: "kontrast",
    ats: 4,
    oneCikan: true,
    tanim: {
      surum: 1,
      yerlesim: "ust-bant",
      bant: "koyu",
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "koyu",
        adBoyutu: "buyuk",
        adBicimi: "buyuk-harf",
      },
      renkler: { vurgu: "#9a3412", ...ORTAK_RENK },
      tekRenk: false,
      yazi: {
        font: "source-sans",
        baslikFont: "montserrat",
        boyut: 10,
        satir: 1.42,
      },
      bolumBasligi: "cizgiyle-uzayan",
      maddeler: "kare",
      yetenekler: "etiket",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "vurgu",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  akademik: {
    kimlik: "akademik",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "orta",
        foto: "yok",
        ayrac: "ince",
        unvan: "soluk-buyuk-harf",
        adRengi: "koyu",
      },
      renkler: { vurgu: "#1f3a5f", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "eb-garamond", boyut: 11, satir: 1.38 },
      bolumBasligi: "alt-cizgi",
      bolumBasligiHarf: "normal",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "·",
      kurum: "italik",
      tarihYeri: "sol",
      kenarBosluk: { ust: 15, alt: 15, yatay: 20 },
    },
  },
  zaman: {
    kimlik: "zaman",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "vurgu",
        unvan: "vurgu",
        adRengi: "koyu",
      },
      renkler: { vurgu: "#0e7490", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "work-sans", boyut: 9.6, satir: 1.42 },
      bolumBasligi: "sol-cubuk",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "vurgu",
      tarihYeri: "sol",
      zamanCizelgesi: true,
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  yaratici: {
    kimlik: "yaratici",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      serit: "sol",
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "koyu",
        adBoyutu: "dev",
        adBicimi: "buyuk-harf",
      },
      renkler: { vurgu: "#be185d", ...ORTAK_RENK },
      tekRenk: false,
      yazi: {
        font: "work-sans",
        baslikFont: "montserrat",
        boyut: 9.8,
        satir: 1.45,
      },
      bolumBasligi: "kisa-cizgi",
      maddeler: "ok",
      yetenekler: "etiket",
      etiketStili: "cerceve",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "vurgu",
      kenarBosluk: { ust: 14, alt: 13, yatay: 19 },
    },
  },
  girisim: {
    kimlik: "girisim",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      serit: "ust",
      ustBilgi: {
        hizalama: "sol",
        foto: "koseli",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "koyu",
        adBoyutu: "dev",
      },
      renkler: { vurgu: "#5b21b6", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "space-grotesk", boyut: 9.8, satir: 1.45 },
      bolumBasligi: "kisa-cizgi",
      bolumBasligiHarf: "normal",
      maddeler: "ok",
      yetenekler: "etiket",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "vurgu",
      tarihYeri: "alt",
      kenarBosluk: { ust: 15, alt: 13, yatay: 17 },
    },
  },
  ferah: {
    kimlik: "ferah",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "ust-bant",
      bant: "acik",
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "vurgu",
      },
      renkler: { vurgu: "#0f766e", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "nunito-sans", boyut: 10, satir: 1.45 },
      bolumBasligi: "alt-cizgi",
      bolumBasligiHarf: "normal",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  "yeni-mezun": {
    kimlik: "yeni-mezun",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "vurgu",
        adBoyutu: "buyuk",
      },
      renkler: { vurgu: "#166534", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "nunito-sans", boyut: 10, satir: 1.45 },
      bolumBasligi: "kutu",
      maddeler: "nokta",
      yetenekler: "etiket",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  "acik-kenar": {
    kimlik: "acik-kenar",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "kenar-cubugu-sol",
      kenar: { genislik: 66, bolumler: KENAR_BOLUMLERI, zemin: "acik" },
      ustBilgi: {
        hizalama: "sol",
        foto: "yuvarlak",
        ayrac: "yok",
        unvan: "vurgu",
        adRengi: "koyu",
        adBoyutu: "buyuk",
      },
      renkler: { vurgu: "#1d4ed8", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "ibm-plex", boyut: 9.8, satir: 1.42 },
      bolumBasligi: "kare-imli",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ikonlu",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  editoryal: {
    kimlik: "editoryal",
    ats: 4,
    tanim: {
      surum: 1,
      yerlesim: "kenar-cubugu-sol",
      kenar: {
        genislik: 58,
        bolumler: KENAR_BOLUMLERI,
        zemin: "cizgi",
        tamUstBilgi: true,
      },
      ustBilgi: {
        hizalama: "sol",
        foto: "kare",
        ayrac: "kalin",
        unvan: "soluk-buyuk-harf",
        adRengi: "koyu",
        adBoyutu: "dev",
        adBicimi: "ince",
      },
      renkler: { vurgu: "#8b1e3f", ...ORTAK_RENK },
      tekRenk: false,
      yazi: {
        font: "source-serif",
        baslikFont: "playfair",
        boyut: 9.8,
        satir: 1.45,
      },
      bolumBasligi: "buyuk-harf",
      maddeler: "tire",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "·",
      kurum: "italik",
      kenarBosluk: ORTAK_BOSLUK,
    },
  },
  butik: {
    kimlik: "butik",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "orta",
        foto: "yuvarlak",
        ayrac: "yok",
        unvan: "buyuk-harf",
        adRengi: "koyu",
        adBoyutu: "buyuk",
        adBicimi: "ince-buyuk-harf",
      },
      renkler: { vurgu: "#8b1e3f", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "lato", baslikFont: "montserrat", boyut: 10, satir: 1.45 },
      bolumBasligi: "ortali",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "·",
      kurum: "italik",
      kenarBosluk: { ust: 14, alt: 13, yatay: 20 },
    },
  },
  kompakt: {
    kimlik: "kompakt",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "sol",
        foto: "yok",
        ayrac: "ince",
        unvan: "vurgu",
        adRengi: "koyu",
        adBoyutu: "kucuk",
      },
      renkler: { vurgu: "#334155", ...ORTAK_RENK },
      tekRenk: false,
      yazi: { font: "source-sans", boyut: 9.2, satir: 1.32 },
      bolumBasligi: "alt-cizgi",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "|",
      kurum: "italik",
      kenarBosluk: { ust: 9, alt: 9, yatay: 13 },
    },
  },
  resmi: {
    kimlik: "resmi",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "orta",
        foto: "yok",
        ayrac: "kalin",
        unvan: "soluk-buyuk-harf",
        adRengi: "koyu",
        adBicimi: "buyuk-harf",
      },
      renkler: SIYAH_BEYAZ,
      tekRenk: true,
      yazi: { font: "merriweather", boyut: 9.6, satir: 1.45 },
      bolumBasligi: "ortali",
      maddeler: "tire",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "|",
      kurum: "italik",
      kenarBosluk: { ust: 15, alt: 14, yatay: 20 },
    },
  },
  klasik: {
    kimlik: "klasik",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "iki-yana",
        foto: "yok",
        ayrac: "cift",
        unvan: "vurgu",
        adRengi: "koyu",
      },
      renkler: SIYAH_BEYAZ,
      tekRenk: true,
      yazi: { font: "source-serif", boyut: 10.4, satir: 1.4 },
      bolumBasligi: "alt-cizgi",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "|",
      kurum: "italik",
      kenarBosluk: { ust: 13, alt: 13, yatay: 18 },
    },
  },
  sade: {
    kimlik: "sade",
    ats: 5,
    tanim: {
      surum: 1,
      yerlesim: "tek-sutun",
      ustBilgi: {
        hizalama: "orta",
        foto: "yok",
        ayrac: "yok",
        unvan: "soluk-buyuk-harf",
        adRengi: "koyu",
      },
      renkler: SIYAH_BEYAZ,
      tekRenk: true,
      yazi: { font: "dm-sans", boyut: 10, satir: 1.42 },
      bolumBasligi: "cizgiyle-uzayan",
      maddeler: "nokta",
      yetenekler: "liste",
      iletisim: "ayracli",
      ayracKarakteri: "·",
      kurum: "kalin",
      kenarBosluk: { ust: 13, alt: 13, yatay: 18 },
    },
  },
};

/** Şablon seçicide, vitrinde ve testlerde kullanılan sıra (SABLON_KIMLIKLERI ile aynı). */
export const SISTEM_SABLON_LISTESI: SistemSablonu[] = SABLON_KIMLIKLERI.map((k) => SISTEM_SABLONLARI[k]);
export const ONE_CIKAN_SABLONLAR: SablonKimligi[] = SISTEM_SABLON_LISTESI.filter((s) => s.oneCikan).map(
  (s) => s.kimlik,
);

export const VURGU_RENKLERI = [
  "#1f3a5f",
  "#1d4ed8",
  "#0e7490",
  "#0f766e",
  "#166534",
  "#8b1e3f",
  "#be185d",
  "#b91c1c",
  "#9a3412",
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
  // Kullanıcı yazı tipi seçtiyse başlıklar da o yazı tipine geçer (tutarlı, öngörülebilir sonuç).
  const secilen = ayarlar.font in FONTLAR ? (ayarlar.font as FontKimligi) : null;
  return {
    ...tanim,
    renkler: {
      ...tanim.renkler,
      vurgu: tanim.tekRenk ? tanim.renkler.metin : ayarlar.renk,
    },
    yazi: {
      ...tanim.yazi,
      font: secilen ?? tanim.yazi.font,
      baslikFont: secilen ? undefined : tanim.yazi.baslikFont,
      boyut: +(tanim.yazi.boyut * BOYUT_CARPANI[ayarlar.boyut]).toFixed(2),
    },
    fotoGoster: ayarlar.foto && tanim.ustBilgi.foto !== "yok",
    aralikCarpani: ARALIK_CARPANI[ayarlar.aralik],
    kagit: ayarlar.kagit,
  };
}

export function sistemTanimi(kimlik: SablonKimligi): TasarimTanimi {
  return SISTEM_SABLONLARI[kimlik].tanim;
}

export function kenarliMi(tasarim: TasarimTanimi) {
  return tasarim.yerlesim === "kenar-cubugu-sol" || tasarim.yerlesim === "kenar-cubugu-sag";
}

export function kenardaMi(tasarim: TasarimTanimi, bolum: BolumKimligi) {
  return !!tasarim.kenar && tasarim.kenar.bolumler.includes(bolum);
}

/** Üst bilgi zemini; kenar çubuğunda üst bilgi tam genişlikte değilse zemin olmaz. */
export function bantTuru(tasarim: TasarimTanimi): NonNullable<TasarimTanimi["bant"]> {
  if (kenarliMi(tasarim) && !tasarim.kenar?.tamUstBilgi) return "yok";
  return tasarim.bant ?? (tasarim.yerlesim === "ust-bant" ? "vurgu" : "yok");
}

/** Vurgu renginin üstüne beyaz yazı basılıyor mu? (kontrast denetimi bunu ölçer) */
export function vurgudaBeyazYaziVar(tasarim: TasarimTanimi) {
  if (tasarim.tekRenk) return false;
  return (
    bantTuru(tasarim) === "vurgu" ||
    (kenarliMi(tasarim) && (tasarim.kenar?.zemin ?? "vurgu") === "vurgu") ||
    tasarim.bolumBasligi === "kutu"
  );
}
