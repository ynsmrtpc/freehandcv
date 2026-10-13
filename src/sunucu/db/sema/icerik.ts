// İçerik yönetimi tabloları (plan bölüm 5 ve 7).
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { guncelleme, olusturma, zaman } from "./ortak";

// Tek satırlık tablo: id her zaman 1.
export const siteAyarlari = pgTable(
  "site_ayarlari",
  {
    id: integer().primaryKey().default(1),
    ayarlar: jsonb().notNull().default({}),
    ceviriler: jsonb().notNull().default({}),
    surum: integer().notNull().default(1),
    guncelleyenId: text().references(() => user.id, { onDelete: "set null" }),
    guncelleme: guncelleme(),
  },
  (t) => [check("site_ayarlari_tek_satir", sql`${t.id} = 1`)],
);

export const medya = pgTable("medya", {
  id: uuid().primaryKey().defaultRandom(),
  anahtar: text().notNull().unique(),
  altMetin: text(),
  genislik: integer(),
  yukseklik: integer(),
  boyut: integer().notNull(),
  yukleyenId: text().references(() => user.id, { onDelete: "set null" }),
  olusturma: olusturma(),
});

export const sayfalar = pgTable(
  "sayfalar",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull(),
    tur: text().$type<"sabit" | "rehber" | "yasal">().notNull(),
    dil: text().notNull(),
    ceviriGrubu: uuid(),
    ceviriDurumu: text()
      .$type<"makine" | "gozden_gecirildi">()
      .notNull()
      .default("gozden_gecirildi"),
    baslik: text().notNull(),
    metaBaslik: text(),
    metaAciklama: text(),
    ogGorselId: uuid().references(() => medya.id, { onDelete: "set null" }),
    canonical: text(),
    indeks: boolean().notNull().default(true),
    durum: text()
      .$type<"taslak" | "yayinda" | "zamanlanmis" | "arsiv">()
      .notNull()
      .default("taslak"),
    yayinTarihi: zaman(),
    bloklar: jsonb().notNull().default([]),
    yayindakiBloklar: jsonb(),
    surum: integer().notNull().default(1),
    guncelleyenId: text().references(() => user.id, { onDelete: "set null" }),
    olusturma: olusturma(),
    guncelleme: guncelleme(),
  },
  (t) => [uniqueIndex().on(t.dil, t.slug), index().on(t.ceviriGrubu)],
);

export const sayfaSurumleri = pgTable(
  "sayfa_surumleri",
  {
    id: uuid().primaryKey().defaultRandom(),
    sayfaId: uuid()
      .notNull()
      .references(() => sayfalar.id, { onDelete: "cascade" }),
    bloklar: jsonb().notNull(),
    meta: jsonb(),
    yayinlayanId: text().references(() => user.id, { onDelete: "set null" }),
    olusturma: olusturma(),
  },
  (t) => [index().on(t.sayfaId, t.olusturma)],
);

export const sss = pgTable(
  "sss",
  {
    id: uuid().primaryKey().defaultRandom(),
    dil: text().notNull(),
    ceviriGrubu: uuid(),
    soru: text().notNull(),
    cevap: jsonb().notNull(),
    kategori: text(),
    sira: integer().notNull().default(0),
    aktif: boolean().notNull().default(true),
  },
  (t) => [index().on(t.dil, t.kategori)],
);

export const reklamAlanlari = pgTable("reklam_alanlari", {
  id: uuid().primaryKey().defaultRandom(),
  kod: text().notNull().unique(),
  saglayici: text().$type<"adsense" | "ozel" | "kapali">().notNull().default("kapali"),
  icerik: jsonb(),
  boyut: text(),
  aktif: boolean().notNull().default(false),
  guncelleme: guncelleme(),
});

// Slug değişince otomatik oluşan 301 kayıtları (plan 6.4, 7.4).
export const yonlendirmeler = pgTable("yonlendirmeler", {
  id: uuid().primaryKey().defaultRandom(),
  kaynak: text().notNull().unique(),
  hedef: text().notNull(),
  kod: integer().notNull().default(301),
  olusturma: olusturma(),
});

export const yonetimGunlugu = pgTable(
  "yonetim_gunlugu",
  {
    id: uuid().primaryKey().defaultRandom(),
    kullaniciId: text().references(() => user.id, { onDelete: "set null" }),
    islem: text().notNull(),
    hedefTur: text().notNull(),
    hedefId: text(),
    once: jsonb(),
    sonra: jsonb(),
    olusturma: olusturma(),
  },
  (t) => [index().on(t.olusturma), index().on(t.hedefTur, t.hedefId)],
);
