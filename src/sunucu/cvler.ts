import "server-only";
import { and, desc, eq, isNull } from "drizzle-orm";
import { cvNormalize, type CvVerisi } from "@/ortak/cv/sema";
import { db } from "./db";
import { cvler } from "./db/sema";

// Hesaptaki CV'ler (plan 5). Kural: her sorgu `kullanici_id = oturumdaki kullanıcı` ile süzülür;
// sahiplik burada denetlenir, ekranda değil. Silme = çöp kutusu (silinme doldurulur).

/** Fotoğraf R2'ye taşınana kadar JSON içinde data URL olarak durur; boyut sınırı bunun için. */
export const CV_EN_BUYUK_BAYT = 1_500_000;
export const CV_EN_COK = 100;

export class CvBulunamadi extends Error {}
export class CvCakismasi extends Error {
  constructor(public sunucuSurumu: number) {
    super("Sürüm çakışması");
  }
}
export class CvCokBuyuk extends Error {}
export class CvSiniri extends Error {}

function dogrula(ham: unknown): CvVerisi {
  const veri = cvNormalize(ham);
  if (JSON.stringify(veri).length > CV_EN_BUYUK_BAYT) throw new CvCokBuyuk();
  return veri;
}

const baslikUret = (v: CvVerisi) =>
  [v.kisisel.ad, v.kisisel.unvan].filter(Boolean).join(" — ").slice(0, 120) || "Adsız CV";

const sahibinin = (id: string, kullaniciId: string) =>
  and(eq(cvler.id, id), eq(cvler.kullaniciId, kullaniciId), isNull(cvler.silinme));

export async function cvListesi(kullaniciId: string) {
  return db
    .select({ id: cvler.id, baslik: cvler.baslik, icerik: cvler.icerik, guncelleme: cvler.guncelleme })
    .from(cvler)
    .where(and(eq(cvler.kullaniciId, kullaniciId), isNull(cvler.silinme)))
    .orderBy(desc(cvler.guncelleme))
    .limit(CV_EN_COK);
}

export async function cvGetir(id: string, kullaniciId: string) {
  const [cv] = await db.select().from(cvler).where(sahibinin(id, kullaniciId)).limit(1);
  if (!cv) throw new CvBulunamadi();
  return { ...cv, icerik: cvNormalize(cv.icerik) };
}

export async function cvOlustur(kullaniciId: string, ham: unknown) {
  const veri = dogrula(ham);
  const n = await db.$count(cvler, and(eq(cvler.kullaniciId, kullaniciId), isNull(cvler.silinme)));
  if (n >= CV_EN_COK) throw new CvSiniri();
  const [cv] = await db
    .insert(cvler)
    .values({
      kullaniciId,
      baslik: baslikUret(veri),
      icerik: veri,
      dil: veri.ayarlar.dil,
      pazar: veri.ayarlar.dil === "tr" ? "tr-TR" : "en-US",
    })
    .returning({ id: cvler.id });
  return cv.id;
}

/** İyimser kilit (plan 12): istek `surum` taşır; sunucudaki farklıysa CvCakismasi atar. */
export async function cvKaydet(id: string, kullaniciId: string, ham: unknown, beklenenSurum: number) {
  const veri = dogrula(ham);
  const [guncel] = await db
    .update(cvler)
    .set({
      icerik: veri,
      baslik: baslikUret(veri),
      dil: veri.ayarlar.dil,
      surum: beklenenSurum + 1,
    })
    .where(and(sahibinin(id, kullaniciId), eq(cvler.surum, beklenenSurum)))
    .returning({ surum: cvler.surum });
  if (guncel) return guncel.surum;
  const [mevcut] = await db.select({ surum: cvler.surum }).from(cvler).where(sahibinin(id, kullaniciId)).limit(1);
  if (!mevcut) throw new CvBulunamadi();
  throw new CvCakismasi(mevcut.surum);
}

export async function cvCogalt(id: string, kullaniciId: string) {
  const cv = await cvGetir(id, kullaniciId);
  return cvOlustur(kullaniciId, cv.icerik);
}

export async function cvSil(id: string, kullaniciId: string) {
  const r = await db
    .update(cvler)
    .set({ silinme: new Date() })
    .where(sahibinin(id, kullaniciId))
    .returning({ id: cvler.id });
  if (!r.length) throw new CvBulunamadi();
}
