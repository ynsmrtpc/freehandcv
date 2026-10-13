import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { yonetimDurumu } from "@/sunucu/yetki";

/**
 * Yönetim sayfalarının sunucu tarafı denetimi. Oturum istek zamanında okunduğu için çağıran
 * bunu <Suspense> içinde kullanır (Cache Components). Yetkisiz kullanıcıya alanın varlığı
 * bile gösterilmez (404).
 */
export async function YonetimDenetimi({ children }: { children: React.ReactNode }) {
  const [durum, locale] = await Promise.all([yonetimDurumu(), getLocale()]);
  if (durum.durum === "girissiz") redirect({ href: "/yonetim/giris", locale });
  if (durum.durum === "iki-adim-gerekli") redirect({ href: "/yonetim/iki-adim", locale });
  if (durum.durum === "yetkisiz") notFound();
  return children;
}
