import { Suspense } from "react";
import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { yonetimDurumu } from "@/sunucu/yetki";

// Oturum istek zamanında okunduğu için denetim Suspense içinde yapılır (Cache Components).
export default function KorumaliLayout({ children }: LayoutProps<"/[locale]/yonetim">) {
  return (
    <Suspense fallback={null}>
      <Denetim>{children}</Denetim>
    </Suspense>
  );
}

async function Denetim({ children }: { children: React.ReactNode }) {
  const [durum, locale] = await Promise.all([yonetimDurumu(), getLocale()]);
  if (durum.durum === "girissiz") redirect({ href: "/yonetim/giris", locale });
  if (durum.durum === "iki-adim-gerekli") redirect({ href: "/yonetim/iki-adim", locale });
  // Yetkisiz kullanıcıya yönetim alanının varlığı bile gösterilmez.
  if (durum.durum === "yetkisiz") notFound();
  return children;
}
