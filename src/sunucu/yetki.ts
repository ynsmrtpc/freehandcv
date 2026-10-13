import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import type { Rol } from "./db/sema";

/**
 * Oturumdaki kullanıcı ya da null. İstek zamanında okunur; Suspense içinde çağrılmalı.
 * Aynı istekte layout ve sayfa ayrı ayrı çağırsa da tek sorgu yapılır.
 */
export const oturumGetir = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export type YonetimDurumu =
  | { durum: "girissiz" }
  | { durum: "yetkisiz" }
  | { durum: "iki-adim-gerekli" }
  | { durum: "tamam"; kullanici: { id: string; ad: string; eposta: string; rol: Rol } };

/**
 * Yönetim alanı için yetki denetimi (plan 7.5). Her Server Action ayrıca bunu çağırır;
 * yalnızca layout'a güvenilmez.
 */
export async function yonetimDurumu(): Promise<YonetimDurumu> {
  const oturum = await oturumGetir();
  if (!oturum) return { durum: "girissiz" };
  const rol = oturum.user.rol as Rol;
  if (rol !== "yonetici" && rol !== "editor") return { durum: "yetkisiz" };
  if (!oturum.user.twoFactorEnabled) return { durum: "iki-adim-gerekli" };
  return {
    durum: "tamam",
    kullanici: {
      id: oturum.user.id,
      ad: oturum.user.name || oturum.user.email,
      eposta: oturum.user.email,
      rol,
    },
  };
}

export class YetkiHatasi extends Error {}

/** Server Action'ların başında çağrılır: yetkisizse hata atar, yetkiliyse kullanıcıyı döndürür. */
export async function yonetimYetkisi(roller: readonly Rol[] = ["yonetici", "editor"]) {
  const d = await yonetimDurumu();
  if (d.durum !== "tamam" || !roller.includes(d.kullanici.rol)) throw new YetkiHatasi("Yetkisiz");
  return d.kullanici;
}
