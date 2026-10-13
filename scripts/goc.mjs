// Üretimde açılışta bekleyen veritabanı göçlerini uygular (Dockerfile CMD).
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const baglanti = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => {} });
await migrate(drizzle(baglanti), { migrationsFolder: "./drizzle" });
await baglanti.end();
console.log("Veritabanı göçleri uygulandı.");
