import "server-only";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import {
  dilAyarlariCoz,
  genelAyarlarCoz,
  VARSAYILAN_DIL,
  VARSAYILAN_GENEL,
  type DilAyarlari,
  type GenelAyarlar,
} from "@/ortak/siteAyarlari";
import { db } from "../db";
import { siteAyarlari, yonetimGunlugu } from "../db/sema";

export const SITE_AYARLARI_ETIKETI = "site-ayarlari";

/** Herkese açık sitenin okuduğu ayarlar (önbellekli). */
export async function siteAyarlariGetir(dil: string): Promise<{ genel: GenelAyarlar; dil: DilAyarlari }> {
  "use cache";
  cacheTag(SITE_AYARLARI_ETIKETI);
  try {
    const [s] = await db.select().from(siteAyarlari).where(eq(siteAyarlari.id, 1)).limit(1);
    return {
      genel: genelAyarlarCoz(s?.ayarlar),
      dil: dilAyarlariCoz((s?.ceviriler as Record<string, unknown> | undefined)?.[dil]),
    };
  } catch (hata) {
    console.error("siteAyarlariGetir: veritabanına ulaşılamadı", hata);
    cacheLife("seconds");
    return { genel: VARSAYILAN_GENEL, dil: VARSAYILAN_DIL };
  }
}

export async function siteAyarlariYonetim() {
  const [s] = await db.select().from(siteAyarlari).where(eq(siteAyarlari.id, 1)).limit(1);
  return {
    genel: genelAyarlarCoz(s?.ayarlar),
    ceviriler: Object.fromEntries(
      Object.entries((s?.ceviriler as Record<string, unknown>) ?? {}).map(([d, v]) => [d, dilAyarlariCoz(v)]),
    ) as Record<string, DilAyarlari>,
    surum: s?.surum ?? 0,
  };
}

export async function siteAyarlariKaydet(
  genel: GenelAyarlar,
  ceviriler: Record<string, DilAyarlari>,
  kullaniciId: string,
) {
  await db.transaction(async (tx) => {
    const [once] = await tx.select().from(siteAyarlari).where(eq(siteAyarlari.id, 1)).for("update");
    await tx
      .insert(siteAyarlari)
      .values({ id: 1, ayarlar: genel, ceviriler, guncelleyenId: kullaniciId })
      .onConflictDoUpdate({
        target: siteAyarlari.id,
        set: { ayarlar: genel, ceviriler, guncelleyenId: kullaniciId, surum: (once?.surum ?? 0) + 1 },
      });
    await tx.insert(yonetimGunlugu).values({
      kullaniciId,
      islem: "site_ayarlari",
      hedefTur: "site_ayarlari",
      once: once ? { ayarlar: once.ayarlar, ceviriler: once.ceviriler } : null,
      sonra: { ayarlar: genel, ceviriler },
    });
  });
}
