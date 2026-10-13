// Better Auth tabloları (çekirdek + twoFactor eklentisi). Alan adları Better Auth'un
// beklediği anahtarlardır; sütunlar `casing: "snake_case"` ile yılan biçimine çevrilir.
// Planın ek kullanıcı alanları (kullanici_adi, arayuz_dili, pazar, rol) de buradadır;
// planın `ad_soyad` alanı Better Auth'un `name` alanıdır.
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { zaman } from "./ortak";

export const roller = ["kullanici", "editor", "yonetici"] as const;
export type Rol = (typeof roller)[number];

export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull().default(""),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: zaman().notNull().defaultNow(),
  updatedAt: zaman()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  twoFactorEnabled: boolean().default(false),

  kullaniciAdi: text().unique(),
  arayuzDili: text(),
  pazar: text(),
  rol: text().$type<Rol>().notNull().default("kullanici"),
  /** İşverenlerle paylaşım için güncel açık rıza (geçmişi: rizalar tablosu). Varsayılan kapalı. */
  isverenPaylasimi: boolean().notNull().default(false),
  /** Paylaşıma açılan CV (cvler.id). Döngüsel içe aktarma olmasın diye yabancı anahtar kodda denetlenir. */
  paylasilanCvId: text(),
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: zaman().notNull(),
    token: text().notNull().unique(),
    createdAt: zaman().notNull().defaultNow(),
    updatedAt: zaman()
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => [index().on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: zaman(),
    refreshTokenExpiresAt: zaman(),
    scope: text(),
    password: text(),
    createdAt: zaman().notNull().defaultNow(),
    updatedAt: zaman()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [index().on(t.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: zaman().notNull(),
    createdAt: zaman().notNull().defaultNow(),
    updatedAt: zaman()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index().on(t.identifier)],
);

export const twoFactor = pgTable(
  "two_factor",
  {
    id: text().primaryKey(),
    secret: text().notNull(),
    backupCodes: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: boolean().default(true),
    failedVerificationCount: integer().default(0),
    lockedUntil: zaman(),
  },
  (t) => [index().on(t.secret), index().on(t.userId)],
);
