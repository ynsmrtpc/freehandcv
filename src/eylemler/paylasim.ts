"use server";

import { z } from "zod";
import { CvSahibiDegil, paylasimAyarla } from "@/sunucu/rizalar";
import { oturumGetir } from "@/sunucu/yetki";

/** İşverenlerle paylaşım rızasını verir/geri çeker. Kullanıcı kimliği oturumdan okunur. */
export async function paylasimAyarlaEylemi(
  acik: boolean,
  cvId: string | null,
  kaynak: "kayit" | "panel" | "indirme",
): Promise<{ tamam: boolean }> {
  const o = await oturumGetir();
  if (!o) return { tamam: false };
  try {
    await paylasimAyarla(
      o.user.id,
      z.boolean().parse(acik),
      cvId === null ? null : z.uuid().parse(cvId),
      z.enum(["kayit", "panel", "indirme"]).parse(kaynak),
    );
    return { tamam: true };
  } catch (e) {
    if (!(e instanceof CvSahibiDegil) && !(e instanceof z.ZodError)) console.error(e);
    return { tamam: false };
  }
}
