import { timestamp } from "drizzle-orm/pg-core";

export const timestamptz = () => timestamp({ withTimezone: true });
export const createdAt = () => timestamptz().notNull().defaultNow();
export const updatedAt = () =>
  timestamptz()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
