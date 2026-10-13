import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as sema from "./sema";

// Geliştirmede sıcak yenileme her seferinde yeni bağlantı havuzu açmasın.
const kuresel = globalThis as unknown as { pgBaglanti?: postgres.Sql };

const baglanti =
  kuresel.pgBaglanti ?? postgres(process.env.DATABASE_URL!, { max: 10 });

if (process.env.NODE_ENV !== "production") kuresel.pgBaglanti = baglanti;

export const db = drizzle(baglanti, { schema: sema, casing: "snake_case" });
export type Db = typeof db;
