import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { blokListesiSemasi, type Blok } from "@/ortak/bloklar";
import { db } from "../db";
import { sayfalar, sayfaSurumleri, user, yonetimGunlugu } from "../db/sema";

export const ANA_SAYFA = "ana-sayfa";
export const sayfaEtiketi = (dil: string, slug: string) => `sayfa:${dil}:${slug}`;

export type YayindakiSayfa = {
  baslik: string;
  metaBaslik: string | null;
  metaAciklama: string | null;
  indeks: boolean;
  bloklar: Blok[];
};

/**
 * Ziyaretçinin gördüğü sayfa (yayindaki_bloklar). Önbelleklidir; "Yayınla" yalnız bu sayfanın
 * etiketini yeniler (plan 7.2). Veritabanına ulaşılamazsa (ör. Docker derleme aşaması) null döner
 * ve kısa ömürlü olur: sayfa ilk istekte gerçek içerikle yeniden üretilir.
 */
export async function yayindakiSayfa(dil: string, slug: string): Promise<YayindakiSayfa | null> {
  "use cache";
  cacheTag(sayfaEtiketi(dil, slug));
  try {
    const [s] = await db
      .select({
        baslik: sayfalar.baslik,
        metaBaslik: sayfalar.metaBaslik,
        metaAciklama: sayfalar.metaAciklama,
        indeks: sayfalar.indeks,
        bloklar: sayfalar.yayindakiBloklar,
      })
      .from(sayfalar)
      .where(and(eq(sayfalar.dil, dil), eq(sayfalar.slug, slug), eq(sayfalar.durum, "yayinda")))
      .limit(1);
    if (!s?.bloklar) return null;
    const bloklar = blokListesiSemasi.safeParse(s.bloklar);
    return { ...s, bloklar: bloklar.success ? (bloklar.data as Blok[]) : [] };
  } catch (hata) {
    console.error("yayindakiSayfa: veritabanına ulaşılamadı", hata);
    cacheLife("seconds");
    return null;
  }
}

/* ---------------- Yönetim (önbelleksiz; çağıran yetkiyi denetler) ---------------- */

export async function sayfaListesi() {
  return db
    .select({
      id: sayfalar.id,
      slug: sayfalar.slug,
      dil: sayfalar.dil,
      tur: sayfalar.tur,
      baslik: sayfalar.baslik,
      durum: sayfalar.durum,
      guncelleme: sayfalar.guncelleme,
      yayinda: sql<boolean>`${sayfalar.yayindakiBloklar} is not null`,
      taslakFarkli: sql<boolean>`${sayfalar.bloklar} is distinct from ${sayfalar.yayindakiBloklar}`,
    })
    .from(sayfalar)
    .orderBy(sayfalar.tur, sayfalar.slug, sayfalar.dil);
}

export async function sayfaYonetim(id: string) {
  const [s] = await db.select().from(sayfalar).where(eq(sayfalar.id, id)).limit(1);
  return s ?? null;
}

export class SurumCakismasi extends Error {}

export type SayfaMeta = { baslik: string; metaBaslik: string; metaAciklama: string; indeks: boolean };

/** Taslağı kaydeder. `surum` farklıysa (başka biri değiştirmiş) SurumCakismasi atar. */
export async function taslakKaydet(
  id: string,
  bloklar: Blok[],
  meta: SayfaMeta,
  beklenenSurum: number,
  kullaniciId: string,
) {
  return db.transaction(async (tx) => {
    const [once] = await tx.select().from(sayfalar).where(eq(sayfalar.id, id)).for("update");
    if (!once) throw new Error("Sayfa bulunamadı");
    if (once.surum !== beklenenSurum) throw new SurumCakismasi();
    const [sonra] = await tx
      .update(sayfalar)
      .set({ bloklar, ...meta, surum: once.surum + 1, guncelleyenId: kullaniciId })
      .where(eq(sayfalar.id, id))
      .returning();
    await tx.insert(yonetimGunlugu).values({
      kullaniciId,
      islem: "taslak_kaydet",
      hedefTur: "sayfa",
      hedefId: id,
      once: { bloklar: once.bloklar, baslik: once.baslik },
      sonra: { bloklar, baslik: meta.baslik },
    });
    return sonra;
  });
}

/** Taslağı yayına kopyalar, sürüm geçmişine yazar. Dönen değer önbellek etiketi içindir. */
export async function yayinla(id: string, kullaniciId: string) {
  return db.transaction(async (tx) => {
    const [s] = await tx.select().from(sayfalar).where(eq(sayfalar.id, id)).for("update");
    if (!s) throw new Error("Sayfa bulunamadı");
    await tx
      .update(sayfalar)
      .set({ yayindakiBloklar: s.bloklar, durum: "yayinda", guncelleyenId: kullaniciId })
      .where(eq(sayfalar.id, id));
    await tx.insert(sayfaSurumleri).values({
      sayfaId: id,
      bloklar: s.bloklar,
      meta: { baslik: s.baslik, metaBaslik: s.metaBaslik, metaAciklama: s.metaAciklama, indeks: s.indeks },
      yayinlayanId: kullaniciId,
    });
    await tx.insert(yonetimGunlugu).values({
      kullaniciId,
      islem: "yayinla",
      hedefTur: "sayfa",
      hedefId: id,
      once: { bloklar: s.yayindakiBloklar },
      sonra: { bloklar: s.bloklar },
    });
    return { dil: s.dil, slug: s.slug };
  });
}

export async function sayfaSurumListesi(sayfaId: string) {
  return db
    .select({
      id: sayfaSurumleri.id,
      olusturma: sayfaSurumleri.olusturma,
      yayinlayan: user.name,
      yayinlayanEposta: user.email,
    })
    .from(sayfaSurumleri)
    .leftJoin(user, eq(user.id, sayfaSurumleri.yayinlayanId))
    .where(eq(sayfaSurumleri.sayfaId, sayfaId))
    .orderBy(desc(sayfaSurumleri.olusturma))
    .limit(30);
}

/** Eski bir yayını taslağa geri yükler (yayınlamaz; yönetici kontrol edip yayınlar). */
export async function surumuTaslagaAl(surumId: string, kullaniciId: string) {
  return db.transaction(async (tx) => {
    const [v] = await tx.select().from(sayfaSurumleri).where(eq(sayfaSurumleri.id, surumId)).limit(1);
    if (!v) throw new Error("Sürüm bulunamadı");
    const [s] = await tx.select().from(sayfalar).where(eq(sayfalar.id, v.sayfaId)).for("update");
    await tx
      .update(sayfalar)
      .set({ bloklar: v.bloklar, surum: s.surum + 1, guncelleyenId: kullaniciId })
      .where(eq(sayfalar.id, v.sayfaId));
    await tx.insert(yonetimGunlugu).values({
      kullaniciId,
      islem: "surume_don",
      hedefTur: "sayfa",
      hedefId: v.sayfaId,
      once: { bloklar: s.bloklar },
      sonra: { bloklar: v.bloklar, surumId },
    });
    return v.sayfaId;
  });
}

export async function gunlukListesi(sinir = 100) {
  return db
    .select({
      id: yonetimGunlugu.id,
      islem: yonetimGunlugu.islem,
      hedefTur: yonetimGunlugu.hedefTur,
      hedefId: yonetimGunlugu.hedefId,
      olusturma: yonetimGunlugu.olusturma,
      kullanici: user.name,
      eposta: user.email,
    })
    .from(yonetimGunlugu)
    .leftJoin(user, eq(user.id, yonetimGunlugu.kullaniciId))
    .orderBy(desc(yonetimGunlugu.olusturma))
    .limit(sinir);
}
