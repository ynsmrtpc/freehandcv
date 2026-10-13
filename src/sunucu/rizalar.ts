import "server-only";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { cvler, rizalar, user } from "./db/sema";

/**
 * İşverenlerle paylaşım rızasının metin sürümü. Ekranda gösterilen onay metni (messages:
 * Rıza.*) değişirse bu sürüm artırılır; eski onaylar eski metne verilmiş sayılır.
 */
export const ISVEREN_RIZA_SURUMU = "isveren-2026-10";

export type PaylasimDurumu = { acik: boolean; cvId: string | null };

export async function paylasimDurumu(kullaniciId: string): Promise<PaylasimDurumu> {
  const [u] = await db
    .select({ acik: user.isverenPaylasimi, cvId: user.paylasilanCvId })
    .from(user)
    .where(eq(user.id, kullaniciId))
    .limit(1);
  return { acik: !!u?.acik, cvId: u?.cvId ?? null };
}

export class CvSahibiDegil extends Error {}

/**
 * Rızayı verir ya da geri çeker. Durum değiştiyse rizalar tablosuna kalıcı bir kayıt düşülür.
 * `cvId` null = "en son güncellediğim CV".
 */
export async function paylasimAyarla(
  kullaniciId: string,
  acik: boolean,
  cvId: string | null,
  kaynak: "kayit" | "panel" | "indirme",
) {
  await db.transaction(async (tx) => {
    if (cvId) {
      const [cv] = await tx
        .select({ id: cvler.id })
        .from(cvler)
        .where(and(eq(cvler.id, cvId), eq(cvler.kullaniciId, kullaniciId), isNull(cvler.silinme)))
        .limit(1);
      if (!cv) throw new CvSahibiDegil();
    }
    const [once] = await tx
      .select({ acik: user.isverenPaylasimi })
      .from(user)
      .where(eq(user.id, kullaniciId))
      .for("update");
    await tx
      .update(user)
      .set({ isverenPaylasimi: acik, paylasilanCvId: acik ? cvId : null })
      .where(eq(user.id, kullaniciId));
    if (once?.acik !== acik)
      await tx.insert(rizalar).values({
        kullaniciId,
        tur: "isveren_paylasimi",
        verildi: acik,
        metinSurumu: ISVEREN_RIZA_SURUMU,
        kaynak,
      });
  });
}
