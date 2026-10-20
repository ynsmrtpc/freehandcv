import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageTitle } from "@/blocks/PageTitle";
import { Section } from "@/blocks/shared";
import { Breadcrumbs, CategoryLinks, countByCategory, ExampleCards } from "@/components/examples/ExampleList";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { categorySlug, EXAMPLE_CATEGORIES } from "@/lib/examples";
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
  const counts = countByCategory(items);

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
      <PageTitle content={{ eyebrow: t("index.eyebrow"), title: t("index.title"), description: t("index.description") }} />
      <Section className="pt-4 sm:pt-6">
        {items.length ? (
          <>
            <nav aria-label={t("index.categoriesLabel")} className="flex justify-center">
              <CategoryLinks counts={counts} />
            </nav>
            <div className="mt-14 space-y-14">
              {EXAMPLE_CATEGORIES.filter((c) => counts[c.id]).map((c) => (
                <section key={c.id} aria-labelledby={`category-${c.id}`}>
                  <h2 id={`category-${c.id}`} className="text-2xl font-bold tracking-tight text-foreground">
                    <Link
                      href={{ pathname: "/resume-examples/[slug]", params: { slug: categorySlug(locale, c.id)! } }}
                      className="hover:text-primary-text"
                    >
                      {t(`categories.${c.id}.name` as never)}
                    </Link>
                  </h2>
                  <div className="mt-5">
                    <ExampleCards items={items.filter((e) => e.category === c.id)} />
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-muted">{t("index.empty")}</p>
        )}
      </Section>
    </>
  );
}
