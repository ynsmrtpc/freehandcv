import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageTitle } from "@/blocks/PageTitle";
import { ExampleBrowser } from "@/components/examples/ExampleBrowser";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { getPublishedExamples } from "@/server/content/examples";

export async function generateMetadata({ params }: PageProps<"/[locale]/resume-examples">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, items] = await Promise.all([getTranslations({ locale, namespace: "Examples" }), getPublishedExamples(locale)]);
  return {
    title: { absolute: t("meta.title") },
    description: t("meta.description", { n: items.length }),
    alternates: alternates("/resume-examples", locale),
    // An empty list is not worth indexing yet.
    robots: items.length ? undefined : { index: false },
  };
}

// All published examples of the locale, grouped by category (plan 6.2: "cv örnekleri").
export default async function ResumeExamples({ params }: PageProps<"/[locale]/resume-examples">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, items] = await Promise.all([getTranslations({ locale, namespace: "Examples" }), getPublishedExamples(locale)]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("detail.home"), href: "/" },
            { name: t("detail.examples"), href: "/resume-examples" },
          ]}
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <PageTitle reading content={{ eyebrow: t("index.eyebrow"), title: t("index.title"), description: t("index.description") }} />
      </div>
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pb-24">
        {items.length ? (
          <ExampleBrowser items={items} />
        ) : (
          <p className="text-center text-muted">{t("index.empty")}</p>
        )}
      </section>
    </>
  );
}
