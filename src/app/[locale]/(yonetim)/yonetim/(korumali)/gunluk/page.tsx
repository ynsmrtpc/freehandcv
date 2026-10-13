import { YonetimBaslik } from "@/bilesenler/yonetim/YonetimKabugu";
import { gunlukListesi } from "@/sunucu/icerik/sayfalar";
import { GunlukTablosu } from "./GunlukTablosu";

export default async function Gunluk() {
  const satirlar = await gunlukListesi(200);
  return (
    <>
      <YonetimBaslik baslik="Günlük" aciklama="Kim, neyi, ne zaman değiştirdi (son 200 kayıt)." />
      <div className="p-5 sm:p-8">
        <GunlukTablosu satirlar={satirlar} />
      </div>
    </>
  );
}
