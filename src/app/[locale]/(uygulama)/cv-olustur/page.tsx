import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Editor } from "@/bilesenler/editor/Editor";
import { routing } from "@/i18n/routing";
import { alternatifler } from "@/ortak/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cv-olustur">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Editor" });
  return { title: t("meta"), alternates: alternatifler("/cv-olustur", locale) };
}

// Hesapsız editör (plan 9): veri tarayıcıda (localStorage) durur. Faz 2'de hesaba aktarılır.
export default function CvOlustur() {
  return <Editor />;
}
