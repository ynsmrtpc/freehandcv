"use server";

import { z } from "zod";
import { roller } from "@/sunucu/db/sema";
import { rolDegistir, SonYoneticiHatasi } from "@/sunucu/yonetim/kullanicilar";
import { YetkiHatasi, yonetimYetkisi } from "@/sunucu/yetki";

export async function rolDegistirEylemi(hedefId: string, rol: string) {
  try {
    // Rol vermek yalnız yöneticinin işi (plan 5: editör ayar/rol değiştiremez).
    const yapan = await yonetimYetkisi(["yonetici"]);
    if (yapan.id === hedefId) return { tamam: false as const, hata: "Kendi rolünü değiştiremezsin." };
    await rolDegistir(z.string().min(1).parse(hedefId), z.enum(roller).parse(rol), yapan.id);
    return { tamam: true as const };
  } catch (hata) {
    if (hata instanceof YetkiHatasi) return { tamam: false as const, hata: "Rolleri yalnız yöneticiler değiştirebilir." };
    if (hata instanceof SonYoneticiHatasi) return { tamam: false as const, hata: "Son yöneticinin yetkisi alınamaz." };
    console.error(hata);
    return { tamam: false as const, hata: "Beklenmeyen bir hata oluştu." };
  }
}
