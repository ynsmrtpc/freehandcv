import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/create-resume">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Editor" });
  return { title: t("meta"), alternates: alternates("/create-resume", locale) };
}

// Guest editor (plan 9): data stays in the browser (localStorage) and moves to the account in phase 2.
export default function CreateResumePage() {
  return <Editor />;
}
