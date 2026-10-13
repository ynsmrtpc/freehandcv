import "server-only";
import { and, count, desc, eq, ilike, isNull, ne, or, sql } from "drizzle-orm";
import { db } from "../db";
import { cvler, roller, user, yonetimGunlugu, type Rol } from "../db/sema";

/** Yönetim için kullanıcı listesi. CV içerikleri hiçbir zaman döndürülmez (plan 7.3, KVKK). */
export async function kullaniciListesi(arama = "", sayfa = 0, boyut = 50) {
  const kosul = arama
    ? or(ilike(user.email, `%${arama}%`), ilike(user.name, `%${arama}%`), ilike(user.kullaniciAdi, `%${arama}%`))
    : undefined;
  const cvSayisi = db
    .select({ kullaniciId: cvler.kullaniciId, n: count().as("n") })
    .from(cvler)
    .where(isNull(cvler.silinme))
    .groupBy(cvler.kullaniciId)
    .as("cv_sayisi");
  const [satirlar, [toplam]] = await Promise.all([
    db
      .select({
        id: user.id,
        email: user.email,
        ad: user.name,
        kullaniciAdi: user.kullaniciAdi,
        rol: user.rol,
        ikiAdim: user.twoFactorEnabled,
        dogrulandi: user.emailVerified,
        olusturma: user.createdAt,
        cv: sql<number>`coalesce(${cvSayisi.n}, 0)`.mapWith(Number),
      })
      .from(user)
      .leftJoin(cvSayisi, eq(cvSayisi.kullaniciId, user.id))
      .where(kosul)
      .orderBy(desc(user.createdAt))
      .limit(boyut)
      .offset(sayfa * boyut),
    db.select({ n: count() }).from(user).where(kosul),
  ]);
  return { satirlar, toplam: toplam.n };
}

export class SonYoneticiHatasi extends Error {}

export async function rolDegistir(hedefId: string, yeniRol: Rol, yapanId: string) {
  if (!roller.includes(yeniRol)) throw new Error("Geçersiz rol");
  await db.transaction(async (tx) => {
    const [once] = await tx.select({ rol: user.rol }).from(user).where(eq(user.id, hedefId)).for("update");
    if (!once) throw new Error("Kullanıcı bulunamadı");
    // Son yöneticinin yetkisi alınamaz (panel sahipsiz kalmasın).
    if (once.rol === "yonetici" && yeniRol !== "yonetici") {
      const [diger] = await tx
        .select({ n: count() })
        .from(user)
        .where(and(eq(user.rol, "yonetici"), ne(user.id, hedefId)));
      if (diger.n === 0) throw new SonYoneticiHatasi();
    }
    await tx.update(user).set({ rol: yeniRol }).where(eq(user.id, hedefId));
    await tx.insert(yonetimGunlugu).values({
      kullaniciId: yapanId,
      islem: "rol_degistir",
      hedefTur: "kullanici",
      hedefId,
      once: { rol: once.rol },
      sonra: { rol: yeniRol },
    });
  });
}
