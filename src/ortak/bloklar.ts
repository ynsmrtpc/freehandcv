// Blok tabanlı sayfa içeriği (plan 7.1). Her blok türünün Zod şeması vardır; yönetim panelindeki
// form bu şemadan otomatik üretilir (`meta` etiketleri). Yeni blok türü = bir şema + bir bileşen.
// "Nasıl görünür" kodda (src/bloklar), "ne yazar / hangi sırada" veritabanında (sayfalar.bloklar).
import { z } from "zod";

/** Form üreticisinin okuduğu alan bilgisi. */
export type AlanMeta = {
  etiket: string;
  ipucu?: string;
  /** uzun: çok satırlı metin; baglanti: adres alanı */
  gorunum?: "uzun" | "baglanti";
  /** Dizi öğelerinin kapalı başlığında gösterilecek alan. */
  ozetAlani?: string;
  secenekEtiketleri?: Record<string, string>;
};

const m = <T extends z.ZodType>(s: T, meta: AlanMeta) => s.meta(meta as Record<string, unknown>);

const metin = (etiket: string, ipucu?: string) => m(z.string().max(300), { etiket, ipucu });
const uzunMetin = (etiket: string, ipucu?: string) => m(z.string().max(4000), { etiket, ipucu, gorunum: "uzun" });
const baglanti = (etiket: string) =>
  m(
    z
      .string()
      .max(500)
      .refine((v) => !v || /^(\/|#|https?:\/\/|mailto:)/.test(v), "Bağlantı /, #, https:// ya da mailto: ile başlamalı"),
    { etiket, gorunum: "baglanti", ipucu: "Örn. /cv-olustur, /en/create-resume, #sss" },
  );

const buton = (etiket: string) =>
  m(z.object({ metin: metin("Metin"), baglanti: baglanti("Bağlantı") }), { etiket });

const bolumUstu = {
  ust: metin("Üst etiket", "Başlığın üstündeki küçük renkli yazı"),
  baslik: metin("Başlık"),
};

export const ortakAyarSemasi = z.object({
  gorunur: m(z.boolean(), { etiket: "Görünür" }),
  mobildeGizle: m(z.boolean(), { etiket: "Mobilde gizle" }),
  arkaPlan: m(z.enum(["yok", "hafif"]), {
    etiket: "Arka plan",
    secenekEtiketleri: { yok: "Yok", hafif: "Hafif gri" },
  }),
  capa: m(
    z
      .string()
      .max(40)
      .regex(/^[a-z0-9-]*$/, "Yalnız küçük harf, rakam ve tire"),
    { etiket: "Bağlantı çapası", ipucu: "Örn. sss → sayfa/#sss" },
  ),
});
export type OrtakAyarlar = z.infer<typeof ortakAyarSemasi>;

export const BLOK_SEMALARI = {
  hero: z.object({
    rozet: metin("Rozet"),
    baslik: metin("Başlık (h1)", "**iki yıldız** arasındaki kelimeler renkli vurgulanır"),
    altBaslik: uzunMetin("Alt başlık"),
    anaButon: buton("Ana buton"),
    ikincilButon: buton("İkincil buton"),
    maddeler: m(z.array(metin("Madde")).max(5), { etiket: "Onay maddeleri" }),
  }),
  sablon_vitrini: z.object({
    ...bolumUstu,
    aciklama: uzunMetin("Açıklama"),
    sec: metin("Kart düğmesi"),
  }),
  adimlar: z.object({
    ...bolumUstu,
    liste: m(z.array(z.object({ baslik: metin("Başlık"), metin: uzunMetin("Metin") })).max(6), {
      etiket: "Adımlar",
      ozetAlani: "baslik",
    }),
  }),
  karsilastirma: z.object({
    ...bolumUstu,
    aciklama: uzunMetin("Açıklama"),
    konu: metin("1. sütun başlığı"),
    diger: metin("2. sütun başlığı (diğer siteler)"),
    biz: metin("3. sütun başlığı (biz)"),
    satirlar: m(
      z.array(z.object({ konu: metin("Özellik"), diger: metin("Diğer sitelerde"), biz: metin("Bizde") })).max(12),
      { etiket: "Satırlar", ozetAlani: "konu" },
    ),
  }),
  ozellikler: z.object({
    ...bolumUstu,
    liste: m(z.array(z.object({ baslik: metin("Başlık"), metin: uzunMetin("Metin") })).max(12), {
      etiket: "Özellik kartları",
      ozetAlani: "baslik",
      ipucu: "İlk iki kart geniş gösterilir",
    }),
  }),
  sss: z.object({
    ...bolumUstu,
    liste: m(z.array(z.object({ soru: metin("Soru"), cevap: uzunMetin("Cevap") })).max(30), {
      etiket: "Sorular",
      ozetAlani: "soru",
      ipucu: "FAQPage yapılandırılmış verisi bu listeden üretilir",
    }),
  }),
  cta: z.object({ baslik: metin("Başlık"), metin: uzunMetin("Metin"), buton: buton("Buton") }),
  zengin_metin: z.object({
    baslik: metin("Başlık (h2)"),
    metin: uzunMetin("Metin", "Boş satır yeni paragraf; **kalın**"),
  }),
} as const;

export type BlokTuru = keyof typeof BLOK_SEMALARI;
export const BLOK_TURLERI = Object.keys(BLOK_SEMALARI) as BlokTuru[];

export const BLOK_ADLARI: Record<BlokTuru, string> = {
  hero: "Hero (sayfa girişi)",
  sablon_vitrini: "Şablon vitrini",
  adimlar: "Adımlar",
  karsilastirma: "Karşılaştırma tablosu",
  ozellikler: "Özellikler",
  sss: "SSS",
  cta: "Son çağrı (CTA)",
  zengin_metin: "Metin",
};

export type Blok = {
  [T in BlokTuru]: { id: string; tur: T; ayarlar: OrtakAyarlar; icerik: z.infer<(typeof BLOK_SEMALARI)[T]> };
}[BlokTuru];

export const blokSemasi = z.discriminatedUnion(
  "tur",
  BLOK_TURLERI.map((tur) =>
    z.object({
      id: z.string().min(1).max(40),
      tur: z.literal(tur),
      ayarlar: ortakAyarSemasi,
      icerik: BLOK_SEMALARI[tur],
    }),
  ) as unknown as [z.ZodObject, ...z.ZodObject[]],
);
export const blokListesiSemasi = z.array(blokSemasi).max(40);

export const VARSAYILAN_AYARLAR: OrtakAyarlar = { gorunur: true, mobildeGizle: false, arkaPlan: "yok", capa: "" };

/** Şemadan boş içerik üretir (yeni blok eklerken). */
export function bosDeger(sema: z.ZodType): unknown {
  const def = (sema as unknown as { def: { type: string } }).def;
  switch (def.type) {
    case "object": {
      const sekil = (sema as unknown as z.ZodObject).shape;
      return Object.fromEntries(Object.entries(sekil).map(([k, s]) => [k, bosDeger(s as z.ZodType)]));
    }
    case "array":
      return [];
    case "boolean":
      return false;
    case "number":
      return 0;
    case "enum":
      return (sema as unknown as z.ZodEnum).options[0];
    case "pipe":
    case "optional":
    case "default":
      return bosDeger((def as unknown as { innerType?: z.ZodType; in?: z.ZodType }).innerType ?? (def as unknown as { in: z.ZodType }).in);
    default:
      return "";
  }
}

export function yeniBlok<T extends BlokTuru>(tur: T): Blok {
  return {
    id: Math.random().toString(36).slice(2, 10),
    tur,
    ayarlar: { ...VARSAYILAN_AYARLAR },
    icerik: bosDeger(BLOK_SEMALARI[tur]),
  } as Blok;
}
