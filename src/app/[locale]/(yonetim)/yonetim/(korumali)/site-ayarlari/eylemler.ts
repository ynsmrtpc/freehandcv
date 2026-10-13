"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { routing } from "@/i18n/routing";
import { dilAyarSemasi, genelAyarSemasi } from "@/ortak/siteAyarlari";
import { SITE_AYARLARI_ETIKETI, siteAyarlariKaydet } from "@/sunucu/icerik/siteAyarlari";
import { YetkiHatasi, yonetimYetkisi } from "@/sunucu/yetki";

const girdiSemasi = z.object({
  genel: genelAyarSemasi,
  ceviriler: z.record(z.enum(routing.locales), dilAyarSemasi),
});

export async function siteAyarlariKaydetEylemi(ham: unknown) {
  try {
    // Site geneli ayarlar yalnız yöneticinin (editör içerik düzenler, ayar değiştiremez — plan 5).
    const kullanici = await yonetimYetkisi(["yonetici"]);
    const g = girdiSemasi.safeParse(ham);
    if (!g.success)
      return {
        tamam: false as const,
        hata: "Bazı alanlar hatalı.",
        sorunlar: g.error.issues.map((i) => ({ yol: i.path as (string | number)[], mesaj: i.message })),
      };
    await siteAyarlariKaydet(g.data.genel, g.data.ceviriler, kullanici.id);
    updateTag(SITE_AYARLARI_ETIKETI);
    return { tamam: true as const };
  } catch (hata) {
    if (hata instanceof YetkiHatasi) return { tamam: false as const, hata: "Site ayarlarını yalnız yöneticiler değiştirebilir." };
    console.error(hata);
    return { tamam: false as const, hata: "Beklenmeyen bir hata oluştu." };
  }
}
