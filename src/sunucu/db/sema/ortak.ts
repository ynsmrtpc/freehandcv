import { timestamp } from "drizzle-orm/pg-core";

export const zaman = () => timestamp({ withTimezone: true });
export const olusturma = () => zaman().notNull().defaultNow();
export const guncelleme = () =>
  zaman()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
