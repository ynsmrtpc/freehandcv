import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSession } from "@/server/authz";
import { listOwnTemplates } from "@/server/templates";
import { TemplatesView } from "./TemplatesView";

export async function generateMetadata({ params }: PageProps<"/[locale]/dashboard/templates">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Dashboard.templates" });
  return { title: t("meta") };
}

// My templates (plan 9 /panel/sablonlarim).
export default async function MyTemplatesPage({ params }: PageProps<"/[locale]/dashboard/templates">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return (
    <Suspense fallback={null}>
      <Loader locale={locale} />
    </Suspense>
  );
}

// The session is read at request time (Cache Components), hence inside Suspense.
async function Loader({ locale }: { locale: Locale }) {
  const session = await getSession();
  if (!session)
    redirect({ href: { pathname: "/sign-in", query: { next: getPathname({ href: "/dashboard/templates", locale }) } }, locale });
  const templates = await listOwnTemplates(session!.user.id);
  return (
    <TemplatesView
      templates={templates.map((t) => ({
        id: t.id,
        name: t.name,
        definition: t.definition,
        visibility: t.visibility,
        status: t.status,
        atsScore: t.atsScore ?? 1,
        usageCount: t.usageCount,
        updatedAt: t.updatedAt.toISOString(),
      }))}
    />
  );
}
