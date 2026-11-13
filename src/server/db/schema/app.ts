// Resume, example resume and template tables (plan sections 5 and 11).
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
import { createdAt, timestamptz, updatedAt } from "./columns";

export const templates = pgTable(
  "templates",
  {
    id: uuid().primaryKey().defaultRandom(),
    ownerId: text().references(() => user.id, { onDelete: "set null" }), // null = system template
    name: text().notNull(),
    description: text(),
    definition: jsonb().notNull(),
    version: integer().notNull().default(1),
    visibility: text()
      .$type<"private" | "unlisted" | "public">()
      .notNull()
      .default("private"),
    status: text()
      .$type<"active" | "under_review" | "hidden">()
      .notNull()
      .default("active"),
    // Plan: "sistem şablonu / öne çıkan". System templates live in code (lib/resume/design.ts), so in
    // the database this marks a community template the team featured in the gallery.
    official: boolean().notNull().default(false),
    sourceTemplateId: uuid().references((): AnyPgColumn => templates.id, {
      onDelete: "set null",
    }),
    atsScore: smallint(),
    previewKey: text(),
    usageCount: integer().notNull().default(0),
    ratingSum: integer().notNull().default(0),
    ratingCount: integer().notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    publishedAt: timestamptz(),
    deletedAt: timestamptz(),
  },
  (t) => [index().on(t.ownerId), index().on(t.visibility, t.status)],
);

export const exampleResumes = pgTable(
  "example_resumes",
  {
    id: uuid().primaryKey().defaultRandom(),
    slug: text().notNull(),
    title: text().notNull(),
    occupation: text().notNull(),
    category: text().notNull(),
    locale: text().notNull(),
    market: text().notNull(),
    translationGroup: uuid(),
    experienceLevel: text().$type<"entry" | "mid" | "senior">(),
    content: jsonb().notNull(),
    templateId: uuid().references(() => templates.id, { onDelete: "set null" }),
    metaTitle: text(),
    metaDescription: text(),
    guide: jsonb(),
    usageCount: integer().notNull().default(0),
    sortOrder: integer().notNull().default(0),
    active: boolean().notNull().default(false),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex().on(t.locale, t.slug),
    index().on(t.category),
    index().on(t.translationGroup),
  ],
);

export const resumes = pgTable(
  "resumes",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text().notNull(),
    content: jsonb().notNull(),
    locale: text().notNull(),
    market: text().notNull(),
    status: text()
      .$type<"draft" | "active" | "archived">()
      .notNull()
      .default("draft"),
    sourceExampleId: uuid().references(() => exampleResumes.id, {
      onDelete: "set null",
    }),
    version: integer().notNull().default(1),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamptz(),
    templateId: uuid().references(() => templates.id, { onDelete: "set null" }),
    templateDefinition: jsonb(),
  },
  (t) => [index().on(t.userId)],
);

export const resumeVersions = pgTable(
  "resume_versions",
  {
    id: uuid().primaryKey().defaultRandom(),
    resumeId: uuid()
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    content: jsonb().notNull(),
    kind: text().$type<"auto" | "manual" | "pdf">().notNull(),
    label: text(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.resumeId, t.createdAt)],
);

export const siteReviews = pgTable("site_reviews", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text().references(() => user.id, { onDelete: "set null" }),
  rating: smallint().notNull(),
  body: text().notNull(),
  occupation: text(),
  displayAllowed: boolean().notNull().default(false),
  approved: boolean().notNull().default(false),
  createdAt: createdAt(),
});

export const files = pgTable(
  "files",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    key: text().notNull().unique(),
    kind: text().notNull(),
    size: integer().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.userId)],
);

export const templateRatings = pgTable(
  "template_ratings",
  {
    templateId: uuid()
      .notNull()
      .references(() => templates.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: smallint().notNull(),
    comment: text(),
    hidden: boolean().notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [primaryKey({ columns: [t.templateId, t.userId] })],
);

export const templateFavorites = pgTable(
  "template_favorites",
  {
    templateId: uuid()
      .notNull()
      .references(() => templates.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.templateId, t.userId] })],
);

export const templateReports = pgTable(
  "template_reports",
  {
    id: uuid().primaryKey().defaultRandom(),
    templateId: uuid()
      .notNull()
      .references(() => templates.id, { onDelete: "cascade" }),
    userId: text().references(() => user.id, { onDelete: "set null" }),
    reason: text().notNull(),
    details: text(),
    status: text().$type<"open" | "closed">().notNull().default("open"),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.templateId, t.status)],
);

/**
 * Explicit consent records (KVKK): every grant/withdrawal is its own row and is never deleted.
 * The consent text version and the time are kept as evidence.
 */
export const consents = pgTable(
  "consents",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: text().$type<"employer_sharing">().notNull(),
    granted: boolean().notNull(),
    textVersion: text().notNull(),
    source: text().$type<"sign_up" | "dashboard" | "download">().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index().on(t.userId, t.kind, t.createdAt)],
);
