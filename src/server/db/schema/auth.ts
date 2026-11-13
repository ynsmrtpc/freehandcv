// Better Auth tables (core + twoFactor plugin). Field names are the keys Better Auth expects;
// columns are converted to snake_case by `casing: "snake_case"`.
// The plan's extra user fields (username, ui_locale, market, role) live here too; the plan's
// full-name field is Better Auth's `name`.
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { timestamptz } from "./columns";

export const roles = ["user", "editor", "admin"] as const;
export type Role = (typeof roles)[number];

export const user = pgTable("user", {
  id: text().primaryKey(),
  name: text().notNull().default(""),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: timestamptz().notNull().defaultNow(),
  updatedAt: timestamptz()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  twoFactorEnabled: boolean().default(false),

  username: text().unique(),
  uiLocale: text(),
  market: text(),
  role: text().$type<Role>().notNull().default("user"),
  /** Current explicit consent to share with employers (history: consents table). Off by default. */
  employerSharing: boolean().notNull().default(false),
  /** Resume shared with employers (resumes.id). Checked in code to avoid a circular import. */
  sharedResumeId: text(),
  /** Suspended by an admin: cannot sign in, existing sessions are removed. */
  banned: boolean().notNull().default(false),
  bannedAt: timestamptz(),
  banReason: text(),
});

export const session = pgTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamptz().notNull(),
    token: text().notNull().unique(),
    createdAt: timestamptz().notNull().defaultNow(),
    updatedAt: timestamptz()
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
    accessTokenExpiresAt: timestamptz(),
    refreshTokenExpiresAt: timestamptz(),
    scope: text(),
    password: text(),
    createdAt: timestamptz().notNull().defaultNow(),
    updatedAt: timestamptz()
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
    expiresAt: timestamptz().notNull(),
    createdAt: timestamptz().notNull().defaultNow(),
    updatedAt: timestamptz()
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
    lockedUntil: timestamptz(),
  },
  (t) => [index().on(t.secret), index().on(t.userId)],
);
