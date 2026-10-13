// CV verisinin tek kaynağı (plan bölüm 10): eski statik sürümün JSON biçimi korunur.
// Hem istemci (editör, localStorage) hem sunucu (Server Action, örnek CV) bu şemayı kullanır.
// Şema hoşgörülüdür: eksik ya da bozuk alanlar varsayılana düşer, böylece eski dosyalar
// ve elle düzenlenmiş JSON'lar da açılır.
import { z } from "zod";

export const CV_SURUM = 1;

export const BOLUMLER = [
  "ozet",
  "deneyim",
  "projeler",
  "yetenekler",
  "egitim",
  "sertifikalar",
  "diller",
  "referanslar",
  "ilgi",
] as const;
export type BolumKimligi = (typeof BOLUMLER)[number];

export const LISTE_BOLUMLERI = [
  "deneyim",
  "projeler",
  "yetenekler",
  "egitim",
  "sertifikalar",
  "diller",
  "referanslar",
] as const;
export type ListeBolumu = (typeof LISTE_BOLUMLERI)[number];

export const SABLON_KIMLIKLERI = [
  "modern",
  "ats",
  "zarif",
  "teknik",
  "kenar",
  "kurumsal",
  "ikili",
  "kontrast",
  "isvicre",
  "akademik",
  "zaman",
  "yaratici",
  "girisim",
  "ferah",
  "yeni-mezun",
  "acik-kenar",
  "editoryal",
  "butik",
  "kompakt",
  "resmi",
  "klasik",
  "sade",
] as const;
export type SablonKimligi = (typeof SABLON_KIMLIKLERI)[number];

export const BOYUTLAR = ["kucuk", "orta", "buyuk"] as const;
export const ARALIKLAR = ["siki", "normal", "ferah"] as const;
export const KAGITLAR = ["A4", "Letter"] as const;
export type Kagit = (typeof KAGITLAR)[number];

const metin = z.string().catch("");
const bayrak = z.boolean().catch(false);
const kimlik = z.string().min(1).catch(() => yeniKimlik());

export function yeniKimlik() {
  return Math.random().toString(36).slice(2, 10);
}

const kalemOrtak = { id: kimlik, gizli: bayrak.optional() };

export const deneyimSemasi = z.object({
  ...kalemOrtak,
  pozisyon: metin.default(""),
  kurum: metin.default(""),
  konum: metin.default(""),
  baslangic: metin.default(""),
  bitis: metin.default(""),
  devam: bayrak.default(false),
  aciklama: metin.default(""),
  maddeler: metin.default(""),
});

export const projeSemasi = z.object({
  ...kalemOrtak,
  ad: metin.default(""),
  rol: metin.default(""),
  baslangic: metin.default(""),
  bitis: metin.default(""),
  teknolojiler: metin.default(""),
  baglanti: metin.default(""),
  aciklama: metin.default(""),
  maddeler: metin.default(""),
});

export const yetenekSemasi = z.object({
  ...kalemOrtak,
  kategori: metin.default(""),
  liste: metin.default(""),
});

export const egitimSemasi = z.object({
  ...kalemOrtak,
  okul: metin.default(""),
  bolum: metin.default(""),
  derece: metin.default(""),
  baslangic: metin.default(""),
  bitis: metin.default(""),
  not: metin.default(""),
  konum: metin.default(""),
  aciklama: metin.default(""),
});

export const sertifikaSemasi = z.object({
  ...kalemOrtak,
  ad: metin.default(""),
  kurum: metin.default(""),
  tarih: metin.default(""),
  baglanti: metin.default(""),
});

export const dilSemasi = z.object({
  ...kalemOrtak,
  dil: metin.default(""),
  seviye: metin.default(""),
});

export const referansSemasi = z.object({
  ...kalemOrtak,
  ad: metin.default(""),
  unvan: metin.default(""),
  kurum: metin.default(""),
  telefon: metin.default(""),
  eposta: metin.default(""),
});

const liste = <T extends z.ZodType>(s: T) => z.array(s).catch([]).default([]);

// Eski sürümdeki "yonetici" şablonu yeni adıyla "zarif".
const sablonAlani = z
  .preprocess((d) => (d === "yonetici" ? "zarif" : d), z.enum(SABLON_KIMLIKLERI))
  .catch("modern");

export const ayarlarSemasi = z.object({
  sablon: sablonAlani.default("modern"),
  renk: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .catch("#1f3a5f")
    .default("#1f3a5f"),
  /** Boş = şablonun yazı tipi. */
  font: metin.default(""),
  boyut: z.enum(BOYUTLAR).catch("orta").default("orta"),
  aralik: z.enum(ARALIKLAR).catch("normal").default("normal"),
  foto: z.boolean().catch(true).default(true),
  /** CV'nin dili (bölüm başlıkları, "Günümüz"). Arayüz dilinden bağımsızdır (plan 8.2). */
  dil: z.string().min(2).max(10).catch("tr").default("tr"),
  kagit: z.enum(KAGITLAR).catch("A4").default("A4"),
  bolumSirasi: z
    .array(z.string())
    .catch([])
    .default([])
    .transform((l) => {
      const gecerli = l.filter((b): b is BolumKimligi => (BOLUMLER as readonly string[]).includes(b));
      const tekil = [...new Set(gecerli)];
      return [...tekil, ...BOLUMLER.filter((b) => !tekil.includes(b))];
    }),
  gizli: z
    .array(z.enum(BOLUMLER))
    .catch([])
    .default([]),
  basliklar: z.record(z.string(), z.string()).catch({}).default({}),
});

export const kisiselSemasi = z.object({
  ad: metin.default(""),
  unvan: metin.default(""),
  eposta: metin.default(""),
  telefon: metin.default(""),
  konum: metin.default(""),
  linkedin: metin.default(""),
  github: metin.default(""),
  web: metin.default(""),
  /** Misafir modunda data URL; hesapta R2 anahtarından üretilen imzalı adres (Faz 2). */
  foto: metin.default(""),
  ekler: z
    .array(z.object({ etiket: metin.default(""), deger: metin.default("") }))
    .catch([])
    .default([]),
});

export const cvSemasi = z.object({
  surum: z.number().catch(CV_SURUM).default(CV_SURUM),
  ayarlar: ayarlarSemasi.catch(() => ayarlarSemasi.parse({})).default(() => ayarlarSemasi.parse({})),
  kisisel: kisiselSemasi.catch(() => kisiselSemasi.parse({})).default(() => kisiselSemasi.parse({})),
  ozet: metin.default(""),
  deneyim: liste(deneyimSemasi),
  projeler: liste(projeSemasi),
  yetenekler: liste(yetenekSemasi),
  egitim: liste(egitimSemasi),
  sertifikalar: liste(sertifikaSemasi),
  diller: liste(dilSemasi),
  referanslar: liste(referansSemasi),
  ilgi: metin.default(""),
});

export type CvVerisi = z.infer<typeof cvSemasi>;
export type CvAyarlari = CvVerisi["ayarlar"];
export type Kisisel = CvVerisi["kisisel"];
export type Kalem<B extends ListeBolumu> = CvVerisi[B][number];

/** Herhangi bir girdiyi geçerli CV verisine çevirir; hiçbir zaman hata atmaz. */
export function cvNormalize(ham: unknown): CvVerisi {
  return cvSemasi.parse(ham && typeof ham === "object" ? ham : {});
}

export function bosCv(dil = "tr"): CvVerisi {
  return cvNormalize({ ayarlar: { dil } });
}

/** Yeni boş kalem; alan listesi şemadan gelir. */
export function bosKalem<B extends ListeBolumu>(bolum: B): Kalem<B> {
  const semalar = {
    deneyim: deneyimSemasi,
    projeler: projeSemasi,
    yetenekler: yetenekSemasi,
    egitim: egitimSemasi,
    sertifikalar: sertifikaSemasi,
    diller: dilSemasi,
    referanslar: referansSemasi,
  } as const;
  return semalar[bolum].parse({ id: yeniKimlik() }) as Kalem<B>;
}
