import { count, isNull } from "drizzle-orm";
import { FileText, Files, Users } from "lucide-react";
import { YonetimBaslik } from "@/bilesenler/yonetim/YonetimKabugu";
import { Link } from "@/i18n/navigation";
import { db } from "@/sunucu/db";
import { cvler, sayfalar, user } from "@/sunucu/db/sema";
import { gunlukListesi } from "@/sunucu/icerik/sayfalar";
import { yonetimDurumu } from "@/sunucu/yetki";
import { GunlukTablosu } from "./gunluk/GunlukTablosu";

export default async function GenelBakis() {
  const [d, [kullanici], [cv], [sayfa], gunluk] = await Promise.all([
    yonetimDurumu(),
    db.select({ n: count() }).from(user),
    db.select({ n: count() }).from(cvler).where(isNull(cvler.silinme)),
    db.select({ n: count() }).from(sayfalar),
    gunlukListesi(8),
  ]);
  const ad = d.durum === "tamam" ? d.kullanici.ad : "";

  const sayaclar = [
    { ad: "Kullanıcı", deger: kullanici.n, ikon: Users },
    { ad: "Kayıtlı CV", deger: cv.n, ikon: FileText },
    { ad: "Sayfa", deger: sayfa.n, ikon: Files },
  ];

  return (
    <>
      <YonetimBaslik baslik={`Hoş geldin, ${ad}`} aciklama="Sitenin içeriği buradan yönetilir; kod dağıtımı gerekmez." />
      <div className="space-y-8 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {sayaclar.map((s) => (
            <div key={s.ad} className="rounded-2xl border border-cizgi bg-yuzey p-5 shadow-kart">
              <s.ikon className="size-5 text-ana-metin" aria-hidden />
              <p className="mt-3 text-3xl font-bold text-metin tabular-nums">{s.deger}</p>
              <p className="text-sm text-soluk">{s.ad}</p>
            </div>
          ))}
        </div>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-metin">Son değişiklikler</h2>
            <Link href="/yonetim/gunluk" className="text-sm font-semibold text-ana-metin hover:underline">
              Tüm günlük
            </Link>
          </div>
          <GunlukTablosu satirlar={gunluk} />
        </section>
      </div>
    </>
  );
}
