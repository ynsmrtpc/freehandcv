import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { redirect } from "@/i18n/navigation";
import { yonetimDurumu } from "@/sunucu/yetki";
import { IkiAdimKurulum } from "./IkiAdimKurulum";

export default function IkiAdimSayfasi() {
  return (
    <Suspense fallback={null}>
      <Denetim />
    </Suspense>
  );
}

async function Denetim() {
  const [durum, locale] = await Promise.all([yonetimDurumu(), getLocale()]);
  if (durum.durum === "girissiz") redirect({ href: "/yonetim/giris", locale });
  if (durum.durum === "yetkisiz") notFound();
  if (durum.durum === "tamam") redirect({ href: "/yonetim", locale });
  return <IkiAdimKurulum />;
}
