// Landing'in başlangıç blokları (plan 6.3 sırası). Veritabanı tohumlanırken ve veritabanına
// erişilemeyen derleme ortamında yedek olarak kullanılır. Canlıda içerik yönetim panelinden değişir.
import en from "../../messages/en.json";
import tr from "../../messages/tr.json";
import { VARSAYILAN_AYARLAR, type Blok } from "./bloklar";

const ayar = (ek: Partial<Blok["ayarlar"]> = {}) => ({ ...VARSAYILAN_AYARLAR, ...ek });

export function varsayilanLandingBloklari(dil: "tr" | "en"): Blok[] {
  const L = (dil === "tr" ? tr : en).Landing;
  const cvOlustur = dil === "tr" ? "/cv-olustur" : "/en/create-resume";
  const kok = dil === "tr" ? "/" : "/en";
  return [
    {
      id: "hero",
      tur: "hero",
      ayarlar: ayar(),
      icerik: {
        rozet: L.hero.rozet,
        baslik: L.hero.baslik.replace(/<vurgu>(.*?)<\/vurgu>/g, "**$1**"),
        altBaslik: L.hero.altBaslik,
        anaButon: { metin: L.hero.anaButon, baglanti: cvOlustur },
        ikincilButon: { metin: L.hero.ikincilButon, baglanti: `${kok === "/" ? "" : kok}#sablonlar` },
        maddeler: L.hero.maddeler,
      },
    },
    {
      id: "sablonlar",
      tur: "sablon_vitrini",
      ayarlar: ayar({ capa: "sablonlar", arkaPlan: "hafif" }),
      icerik: { ust: L.sablonlar.ust, baslik: L.sablonlar.baslik, aciklama: L.sablonlar.aciklama, sec: L.sablonlar.sec },
    },
    { id: "adimlar", tur: "adimlar", ayarlar: ayar({ capa: "nasil-calisir" }), icerik: L.adimlar },
    { id: "karsilastirma", tur: "karsilastirma", ayarlar: ayar({ capa: "karsilastirma" }), icerik: L.karsilastirma },
    { id: "ozellikler", tur: "ozellikler", ayarlar: ayar({ arkaPlan: "hafif" }), icerik: L.ozellikler },
    { id: "sss", tur: "sss", ayarlar: ayar({ capa: "sss" }), icerik: L.sss },
    {
      id: "cta",
      tur: "cta",
      ayarlar: ayar(),
      icerik: { baslik: L.cta.baslik, metin: L.cta.metin, buton: { metin: L.cta.buton, baglanti: cvOlustur } },
    },
  ];
}
