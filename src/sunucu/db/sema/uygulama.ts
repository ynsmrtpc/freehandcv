// CV, örnek CV ve şablon tabloları (plan bölüm 5 ve 11).
import {
  type AnyPgColumn,
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  smallint,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { guncelleme, olusturma, zaman } from "./ortak";

export const sablonlar = pgTable(
  "sablonlar",
  {
    id: uuid().primaryKey().defaultRandom(),
    sahipId: text().references(() => user.id, { onDelete: "set null" }), // boş = sistem şablonu
    ad: text().notNull(),
    aciklama: text(),
    tanim: jsonb().notNull(),
    surum: integer().notNull().default(1),
    gorunurluk: text()
      .$type<"ozel" | "baglanti" | "herkese_acik">()
      .notNull()
      .default("ozel"),
    durum: text()
      .$type<"aktif" | "incelemede" | "gizlendi">()
      .notNull()
      .default("aktif"),
    resmi: boolean().notNull().default(false),
    kaynakSablonId: uuid().references((): AnyPgColumn => sablonlar.id, {
      onDelete: "set null",
    }),
    atsPuani: smallint(),
    onizlemeAnahtari: text(),
    kullanimSayisi: integer().notNull().default(0),
    puanToplam: integer().notNull().default(0),
    puanSayisi: integer().notNull().default(0),
    olusturma: olusturma(),
    guncelleme: guncelleme(),
    yayinlanma: zaman(),
    silinme: zaman(),
  },
  (t) => [index().on(t.sahipId), index().on(t.gorunurluk, t.durum)],
);

export const ornekCvler = pgTable(
  "ornek_cvler",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull(),
    baslik: text().notNull(),
    meslek: text().notNull(),
    kategori: text().notNull(),
    dil: text().notNull(),
    pazar: text().notNull(),
    ceviriGrubu: uuid(),
    deneyimSeviyesi: text().$type<"yeni-mezun" | "orta" | "kidemli">(),
    icerik: jsonb().notNull(),
    sablonId: uuid().references(() => sablonlar.id, { onDelete: "set null" }),
    metaBaslik: text(),
    metaAciklama: text(),
    rehber: jsonb(),
    kullanimSayisi: integer().notNull().default(0),
    sira: integer().notNull().default(0),
    aktif: boolean().notNull().default(false),
    guncelleme: guncelleme(),
  },
  (t) => [
    uniqueIndex().on(t.dil, t.slug),
    index().on(t.kategori),
    index().on(t.ceviriGrubu),
  ],
);

export const cvler = pgTable(
  "cvler",
  {
    id: uuid().primaryKey().defaultRandom(),
    kullaniciId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    baslik: text().notNull(),
    icerik: jsonb().notNull(),
    dil: text().notNull(),
    pazar: text().notNull(),
    durum: text()
      .$type<"taslak" | "aktif" | "arsiv">()
      .notNull()
      .default("taslak"),
    kaynakOrnekId: uuid().references(() => ornekCvler.id, {
      onDelete: "set null",
    }),
    surum: integer().notNull().default(1),
    olusturma: olusturma(),
    guncelleme: guncelleme(),
    silinme: zaman(),
    sablonId: uuid().references(() => sablonlar.id, { onDelete: "set null" }),
    sablonTanim: jsonb(),
  },
  (t) => [index().on(t.kullaniciId)],
);

export const cvSurumleri = pgTable(
  "cv_surumleri",
  {
    id: uuid().primaryKey().defaultRandom(),
    cvId: uuid()
      .notNull()
      .references(() => cvler.id, { onDelete: "cascade" }),
    icerik: jsonb().notNull(),
    tur: text().$type<"otomatik" | "elle" | "pdf">().notNull(),
    etiket: text(),
    olusturma: olusturma(),
  },
  (t) => [index().on(t.cvId, t.olusturma)],
);

export const siteYorumlari = pgTable("site_yorumlari", {
  id: uuid().primaryKey().defaultRandom(),
  kullaniciId: text().references(() => user.id, { onDelete: "set null" }),
  puan: smallint().notNull(),
  metin: text().notNull(),
  meslek: text(),
  izinVerildi: boolean().notNull().default(false),
  onaylandi: boolean().notNull().default(false),
  olusturma: olusturma(),
});

export const dosyalar = pgTable(
  "dosyalar",
  {
    id: uuid().primaryKey().defaultRandom(),
    kullaniciId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    anahtar: text().notNull().unique(),
    tur: text().notNull(),
    boyut: integer().notNull(),
    olusturma: olusturma(),
  },
  (t) => [index().on(t.kullaniciId)],
);

export const sablonPuanlari = pgTable(
  "sablon_puanlari",
  {
    sablonId: uuid()
      .notNull()
      .references(() => sablonlar.id, { onDelete: "cascade" }),
    kullaniciId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    puan: smallint().notNull(),
    yorum: text(),
    gizlendi: boolean().notNull().default(false),
    olusturma: olusturma(),
    guncelleme: guncelleme(),
  },
  (t) => [primaryKey({ columns: [t.sablonId, t.kullaniciId] })],
);

export const sablonFavorileri = pgTable(
  "sablon_favorileri",
  {
    sablonId: uuid()
      .notNull()
      .references(() => sablonlar.id, { onDelete: "cascade" }),
    kullaniciId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    olusturma: olusturma(),
  },
  (t) => [primaryKey({ columns: [t.sablonId, t.kullaniciId] })],
);

export const sablonSikayetleri = pgTable(
  "sablon_sikayetleri",
  {
    id: uuid().primaryKey().defaultRandom(),
    sablonId: uuid()
      .notNull()
      .references(() => sablonlar.id, { onDelete: "cascade" }),
    kullaniciId: text().references(() => user.id, { onDelete: "set null" }),
    neden: text().notNull(),
    aciklama: text(),
    durum: text().$type<"acik" | "kapandi">().notNull().default("acik"),
    olusturma: olusturma(),
  },
  (t) => [index().on(t.sablonId, t.durum)],
);
