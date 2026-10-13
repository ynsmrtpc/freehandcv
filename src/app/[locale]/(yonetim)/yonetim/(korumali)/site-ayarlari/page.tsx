import { YonetimBaslik } from "@/bilesenler/yonetim/YonetimKabugu";
import { routing } from "@/i18n/routing";
import { VARSAYILAN_DIL } from "@/ortak/siteAyarlari";
import { siteAyarlariYonetim } from "@/sunucu/icerik/siteAyarlari";
import { SiteAyarlariFormu } from "./SiteAyarlariFormu";

export default async function SiteAyarlari() {
  const a = await siteAyarlariYonetim();
  const ceviriler = Object.fromEntries(routing.locales.map((d) => [d, a.ceviriler[d] ?? VARSAYILAN_DIL]));
  return (
    <>
      <YonetimBaslik baslik="Site ayarları" aciklama="Sitenin genelindeki bağlantılar, duyuru çubuğu ve alt bilgi." />
      <SiteAyarlariFormu baslangic={{ genel: a.genel, ceviriler }} diller={[...routing.locales]} />
    </>
  );
}
