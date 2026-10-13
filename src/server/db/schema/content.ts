// Content management tables (plan sections 5 and 7).
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
import { createdAt, timestamptz, updatedAt } from "./columns";

// Single-row table: id is always 1.
export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer().primaryKey().default(1),
    settings: jsonb().notNull().default({}),
    translations: jsonb().notNull().default({}),
    version: integer().notNull().default(1),
    updatedById: text().references(() => user.id, { onDelete: "set null" }),
    updatedAt: updatedAt(),
  },
  (t) => [check("site_settings_single_row", sql`${t.id} = 1`)],
);

export const media = pgTable("media", {
  id: uuid().primaryKey().defaultRandom(),
  key: text().notNull().unique(),
  altText: text(),
  width: integer(),
  height: integer(),
  size: integer().notNull(),
  uploadedById: text().references(() => user.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

export const pages = pgTable(
  "pages",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull(),
    kind: text().$type<"static" | "guide" | "legal">().notNull(),
    locale: text().notNull(),
    translationGroup: uuid(),
    translationStatus: text()
      .$type<"machine" | "reviewed">()
      .notNull()
      .default("reviewed"),
    title: text().notNull(),
    metaTitle: text(),
    metaDescription: text(),
    ogImageId: uuid().references(() => media.id, { onDelete: "set null" }),
    canonical: text(),
    indexable: boolean().notNull().default(true),
    status: text()
      .$type<"draft" | "published" | "scheduled" | "archived">()
      .notNull()
      .default("draft"),
    publishAt: timestamptz(),
    draftBlocks: jsonb().notNull().default([]),
    publishedBlocks: jsonb(),
    version: integer().notNull().default(1),
    updatedById: text().references(() => user.id, { onDelete: "set null" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex().on(t.locale, t.slug), index().on(t.translationGroup)],
);

export const pageVersions = pgTable(
  "page_versions",
  {
    id: uuid().primaryKey().defaultRandom(),
    pageId: uuid()
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    blocks: jsonb().notNull(),
    meta: jsonb(),
    publishedById: text().references(() => user.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.pageId, t.createdAt)],
);

export const faqs = pgTable(
  "faqs",
  {
    id: uuid().primaryKey().defaultRandom(),
    locale: text().notNull(),
    translationGroup: uuid(),
    question: text().notNull(),
    answer: jsonb().notNull(),
    category: text(),
    sortOrder: integer().notNull().default(0),
    active: boolean().notNull().default(true),
  },
  (t) => [index().on(t.locale, t.category)],
);

export const adSlots = pgTable("ad_slots", {
  id: uuid().primaryKey().defaultRandom(),
  code: text().notNull().unique(),
  provider: text().$type<"adsense" | "custom" | "off">().notNull().default("off"),
  content: jsonb(),
  size: text(),
  active: boolean().notNull().default(false),
  updatedAt: updatedAt(),
});

// 301 records created automatically when a slug changes (plan 6.4, 7.4).
export const redirects = pgTable("redirects", {
  id: uuid().primaryKey().defaultRandom(),
  source: text().notNull().unique(),
  destination: text().notNull(),
  statusCode: integer().notNull().default(301),
  createdAt: createdAt(),
});

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text().references(() => user.id, { onDelete: "set null" }),
    action: text().notNull(),
    targetType: text().notNull(),
    targetId: text(),
    before: jsonb(),
    after: jsonb(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.createdAt), index().on(t.targetType, t.targetId)],
);
