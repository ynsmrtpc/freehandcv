import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { Editor } from "@/bilesenler/editor/Editor";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cvGetir, CvBulunamadi } from "@/sunucu/cvler";
import { oturumGetir } from "@/sunucu/yetki";

export const metadata: Metadata = { title: "CV" };

// CV kimliği ve oturum istek zamanında bilinir (Cache Components): ikisi de Suspense içinde okunur.
export default function CvDuzenle({ params }: PageProps<"/[locale]/cv/[id]">) {
  return (
    <Suspense fallback={null}>
      <Yukle params={params} />
    </Suspense>
  );
}

async function Yukle({ params }: { params: PageProps<"/[locale]/cv/[id]">["params"] }) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale) || !z.uuid().safeParse(id).success) notFound();
  const oturum = await oturumGetir();
  if (!oturum)
    redirect({
      href: {
        pathname: "/giris",
        query: { sonra: getPathname({ href: { pathname: "/cv/[id]", params: { id } }, locale }) },
      },
      locale,
    });
  const cv = await cvGetir(id, oturum!.user.id).catch((e) => {
    // Başkasının CV'si de "bulunamadı" görünür; varlığı açığa çıkmaz.
    if (e instanceof CvBulunamadi) notFound();
    throw e;
  });
  return <Editor hesap={{ id: cv.id, veri: cv.icerik, surum: cv.surum }} />;
}
