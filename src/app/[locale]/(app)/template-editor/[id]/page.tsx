import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import { TemplateEditor } from "@/components/template-editor/TemplateEditor";
import { getPathname, redirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSession } from "@/server/authz";
import { getOwnTemplate, TemplateNotFoundError } from "@/server/templates";

export async function generateMetadata({ params }: PageProps<"/[locale]/template-editor/[id]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "TemplateEditor" });
  return { title: t("metaEdit") };
}

export default async function EditTemplatePage({ params }: PageProps<"/[locale]/template-editor/[id]">) {
  return (
    <Suspense fallback={null}>
      <Loader params={params} />
    </Suspense>
  );
}

// Only the owner edits a template; someone else's looks "not found" (its existence is not revealed).
async function Loader({ params }: { params: PageProps<"/[locale]/template-editor/[id]">["params"] }) {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale) || !z.uuid().safeParse(id).success) notFound();
  const session = await getSession();
  if (!session)
    redirect({
      href: {
        pathname: "/sign-in",
        query: { next: getPathname({ href: { pathname: "/template-editor/[id]", params: { id } }, locale: locale as Locale }) },
      },
      locale,
    });
  const template = await getOwnTemplate(id, session!.user.id).catch((e) => {
    if (e instanceof TemplateNotFoundError) notFound();
    throw e;
  });
  return (
    <TemplateEditor
      key={template.id}
      initialDefinition={template.definition}
      template={{
        id: template.id,
        name: template.name,
        description: template.description ?? "",
        definition: template.definition,
        visibility: template.visibility,
      }}
    />
  );
}
