"use server";

// Sayfa düzenleyici eylemleri. Her eylem yetkiyi kendisi denetler (plan 7.5: yalnızca
// layout'a güvenilmez) ve girdiyi Zod ile doğrular.
import { updateTag } from "next/cache";
import { z } from "zod";
import { blokListesiSemasi, type Blok } from "@/ortak/bloklar";
import {
  YAYIN_LISTESI_ETIKETI,
  sayfaEtiketi,
  surumuTaslagaAl,
  SurumCakismasi,
  taslakKaydet,
  yayinla,
} from "@/sunucu/icerik/sayfalar";
import { YetkiHatasi, yonetimYetkisi } from "@/sunucu/yetki";

const metaSemasi = z.object({
  baslik: z.string().trim().min(1, "Başlık boş olamaz").max(120),
  metaBaslik: z.string().trim().max(70, "En fazla 70 karakter"),
  metaAciklama: z.string().trim().max(170, "En fazla 170 karakter"),
  indeks: z.boolean(),
});

export type EylemSonucu =
  | { tamam: true; surum?: number }
  | { tamam: false; hata: string; sorunlar?: { yol: (string | number)[]; mesaj: string }[] };

function hataSonucu(hata: unknown): EylemSonucu {
  if (hata instanceof YetkiHatasi) return { tamam: false, hata: "Bu işlem için yetkin yok. Yeniden giriş yap." };
  if (hata instanceof SurumCakismasi)
    return { tamam: false, hata: "Sayfa başka bir sekmede ya da başka biri tarafından değiştirilmiş. Sayfayı yenile." };
  console.error(hata);
  return { tamam: false, hata: "Beklenmeyen bir hata oluştu." };
}

export async function taslakKaydetEylemi(
  id: string,
  bloklarHam: unknown,
  metaHam: unknown,
  surum: number,
): Promise<EylemSonucu> {
  try {
    const kullanici = await yonetimYetkisi();
    const bloklar = blokListesiSemasi.safeParse(bloklarHam);
    const meta = metaSemasi.safeParse(metaHam);
    if (!bloklar.success || !meta.success) {
      const sorunlar = [
        ...(bloklar.error?.issues.map((i) => ({ yol: ["bloklar", ...(i.path as (string | number)[])], mesaj: i.message })) ?? []),
        ...(meta.error?.issues.map((i) => ({ yol: ["meta", ...(i.path as (string | number)[])], mesaj: i.message })) ?? []),
      ];
      return { tamam: false, hata: "Bazı alanlar hatalı.", sorunlar };
    }
    const s = await taslakKaydet(id, bloklar.data as Blok[], meta.data, surum, kullanici.id);
    return { tamam: true, surum: s.surum };
  } catch (hata) {
    return hataSonucu(hata);
  }
}

export async function yayinlaEylemi(id: string): Promise<EylemSonucu> {
  try {
    const kullanici = await yonetimYetkisi();
    const { dil, slug } = await yayinla(id, kullanici.id);
    // Yalnız bu sayfanın önbelleği yenilenir; sonraki ziyaretçi yeni içeriği görür.
    updateTag(sayfaEtiketi(dil, slug));
    updateTag(YAYIN_LISTESI_ETIKETI);
    return { tamam: true };
  } catch (hata) {
    return hataSonucu(hata);
  }
}

export async function surumuTaslagaAlEylemi(surumId: string): Promise<EylemSonucu> {
  try {
    const kullanici = await yonetimYetkisi();
    await surumuTaslagaAl(z.uuid().parse(surumId), kullanici.id);
    return { tamam: true };
  } catch (hata) {
    return hataSonucu(hata);
  }
}
