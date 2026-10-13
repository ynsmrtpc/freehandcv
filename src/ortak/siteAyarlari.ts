// Site ayarları (plan 5: site_ayarlari, 7.3). `ayarlar` dilden bağımsız, `ceviriler` dile bağlıdır.
import { z } from "zod";
import type { AlanMeta } from "./bloklar";

const m = <T extends z.ZodType>(s: T, meta: AlanMeta) => s.meta(meta as Record<string, unknown>);
const adres = (etiket: string) =>
  m(
    z
      .string()
      .max(300)
      .refine((v) => !v || /^https:\/\//.test(v), "https:// ile başlamalı"),
    { etiket, gorunum: "baglanti" },
  );

export const genelAyarSemasi = z.object({
  iletisimEposta: m(z.union([z.literal(""), z.email("Geçerli bir e-posta gir")]), { etiket: "İletişim e-postası" }),
  sosyal: m(
    z.object({
      linkedin: adres("LinkedIn"),
      x: adres("X (Twitter)"),
      instagram: adres("Instagram"),
      github: adres("GitHub"),
    }),
    { etiket: "Sosyal bağlantılar" },
  ),
  bagis: m(
    z.object({
      aktif: m(z.boolean(), { etiket: "Bağış bağlantısını göster" }),
      baglanti: adres("Bağış sayfası adresi"),
    }),
    { etiket: "Bağış", ipucu: "Buy Me a Coffee, GitHub Sponsors vb." },
  ),
});

export const dilAyarSemasi = z.object({
  duyuru: m(
    z.object({
      aktif: m(z.boolean(), { etiket: "Duyuru çubuğunu göster" }),
      metin: m(z.string().max(160), { etiket: "Metin" }),
      baglanti: m(
        z
          .string()
          .max(300)
          .refine((v) => !v || /^(\/|https:\/\/)/.test(v), "/ ya da https:// ile başlamalı"),
        { etiket: "Bağlantı (isteğe bağlı)", gorunum: "baglanti" },
      ),
    }),
    { etiket: "Duyuru çubuğu", ipucu: "Sitenin en üstünde ince bir şerit" },
  ),
  altBilgiSlogan: m(z.string().max(240), { etiket: "Alt bilgi sloganı", gorunum: "uzun", ipucu: "Boşsa varsayılan metin" }),
  bagisMetni: m(z.string().max(80), { etiket: "Bağış bağlantısı metni", ipucu: "Örn. Beğendiysen destek ol" }),
});

export type GenelAyarlar = z.infer<typeof genelAyarSemasi>;
export type DilAyarlari = z.infer<typeof dilAyarSemasi>;

export const VARSAYILAN_GENEL: GenelAyarlar = {
  iletisimEposta: "",
  sosyal: { linkedin: "", x: "", instagram: "", github: "" },
  bagis: { aktif: false, baglanti: "" },
};
export const VARSAYILAN_DIL: DilAyarlari = {
  duyuru: { aktif: false, metin: "", baglanti: "" },
  altBilgiSlogan: "",
  bagisMetni: "",
};

/** Veritabanındaki ham değeri şemaya oturtur; bozuk alan varsayılana düşer. */
export function genelAyarlarCoz(ham: unknown): GenelAyarlar {
  const s = genelAyarSemasi.safeParse({ ...VARSAYILAN_GENEL, ...(ham as object) });
  return s.success ? s.data : VARSAYILAN_GENEL;
}
export function dilAyarlariCoz(ham: unknown): DilAyarlari {
  const s = dilAyarSemasi.safeParse({ ...VARSAYILAN_DIL, ...(ham as object) });
  return s.success ? s.data : VARSAYILAN_DIL;
}
