import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AtsChecker } from "@/components/wizard/AtsChecker";
import { alternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params, t = await getTranslations({ locale, namespace: "Ats" });
  return { title: t("meta"), description: t("description"), alternates: alternates("/ats-resume-check", locale) };
}
export default function AtsPage() { return <AtsChecker />; }
