import { index, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createdAt, timestamptz } from "./columns";

// The ledger enforces the three-generation allowance across tabs, retries and app instances.
export const aiGenerations = pgTable("ai_generations", {
  id: uuid().primaryKey(), userId: text().notNull().references(() => user.id, { onDelete: "cascade" }),
  status: text().$type<"pending" | "completed" | "failed">().notNull(),
  provider: text().notNull(), model: text().notNull(), consentVersion: text().notNull(),
  inputHash: text().notNull(),
  draft: jsonb(), createdAt: createdAt(), expiresAt: timestamptz().notNull(),
}, (table) => [index().on(table.userId, table.status)]);
