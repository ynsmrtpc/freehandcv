import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { TemplateEditor } from "@/components/template-editor/TemplateEditor";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { systemDefinition } from "@/lib/resume/design";
import { TEMPLATE_IDS, type TemplateId } from "@/lib/resume/schema";
import { getSession } from "@/server/authz";

export async function generateMetadata({ params }: PageProps<"/[locale]/template-editor/new">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "TemplateEditor" });
  return { title: t("metaNew") };
}

// A new template starts from a system template (?from=<id>, default Modern) and is saved explicitly.
export default async function NewTemplatePage({ params, searchParams }: PageProps<"/[locale]/template-editor/new">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <Suspense fallback={null}>
      <Loader locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}

// The session and the query are known at request time (Cache Components), hence inside Suspense.
async function Loader({ locale, searchParams }: { locale: Locale; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getSession();
  if (!session)
    redirect({ href: { pathname: "/sign-in", query: { next: getPathname({ href: "/template-editor/new", locale }) } }, locale });
  const { from } = await searchParams;
  const base: TemplateId = TEMPLATE_IDS.includes(from as TemplateId) ? (from as TemplateId) : "modern";
  return <TemplateEditor initialDefinition={systemDefinition(base)} />;
}
