import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { yonetimDurumu } from "@/sunucu/yetki";
import { CikisButonu } from "./CikisButonu";

export default function YonetimPaneli() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Suspense fallback={null}>
        <Panel />
      </Suspense>
    </div>
  );
}

async function Panel() {
  const [durum, t] = await Promise.all([yonetimDurumu(), getTranslations("Yonetim")]);
  if (durum.durum !== "tamam") return null; // layout zaten yönlendirir
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("hosgeldin", { ad: durum.kullanici.ad })}</h1>
        <CikisButonu etiket={t("cikis")} />
      </div>
      <p className="mt-4 text-soluk">{t("panelYakinda")}</p>
    </>
  );
}
