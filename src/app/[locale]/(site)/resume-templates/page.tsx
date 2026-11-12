import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageTitle } from "@/blocks/PageTitle";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { itemFacts, itemKey, TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { TemplateId } from "@/lib/resume/schema";
import { alternates } from "@/lib/seo";
import { communityGalleryItems, systemGalleryItems } from "@/lib/templateGallery";
import { getPublicTemplates } from "@/server/templates";

export async function generateMetadata({ params }: PageProps<"/[locale]/resume-templates">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Templates.gallery" });
  return {
    title: { absolute: t("meta.title") },
    description: t("meta.description"),
    alternates: alternates("/resume-templates", locale),
  };
}

// "cv şablonları", "ats uyumlu cv şablonu" (plan 6.2, 11.4): official and community templates.
export default async function ResumeTemplates({ params }: PageProps<"/[locale]/resume-templates">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, messages, community] = await Promise.all([
    getTranslations({ locale, namespace: "Templates.gallery" }),
    getMessages({ locale }),
    getPublicTemplates(),
  ]);
  const text = messages.Templates as { names: Record<TemplateId, string>; descriptions: Record<TemplateId, string> };
  const items = [...systemGalleryItems(text), ...communityGalleryItems(community)];

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("home"), href: "/" },
            { name: t("breadcrumb"), href: "/resume-templates" },
          ]}
        />
      </div>
      <PageTitle content={{ eyebrow: t("eyebrow"), title: t("title"), description: t("description", { n: items.length }) }} />
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pb-24">
        <TemplateGallery
          entries={items.map((i) => ({
            key: itemKey(i),
            official: i.ref.kind === "system",
            ats: i.ats,
            usage: i.usage,
            score: i.score,
            ratingCount: i.ratingCount,
            publishedAt: i.publishedAt,
            ...itemFacts(i),
          }))}
          cards={Object.fromEntries(items.map((i) => [itemKey(i), <TemplateCard key={itemKey(i)} item={i} locale={locale} />]))}
        />
        <div className="mt-10 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground">{t("createTitle")}</h2>
          <p className="mt-2 max-w-xl text-muted">{t("createDescription")}</p>
          <Link href="/template-editor/new" className={buttonClass("secondary", "md", "mt-5")}>
            <Plus className="size-4" aria-hidden />
            {t("createButton")}
          </Link>
        </div>
      </section>
    </>
  );
}
