import { getTranslations } from "next-intl/server";
import { PageTitle } from "@/blocks/PageTitle";
import { Section } from "@/blocks/shared";
import { Breadcrumbs, CategoryLinks, countByCategory, ExampleCards } from "@/components/examples/ExampleList";
import type { Locale } from "@/i18n/routing";
import { categorySlug } from "@/lib/examples";
import { getPublishedExamples } from "@/server/content/examples";

// "sağlık sektörü cv örnekleri" (plan 6.2): the category's examples and links to the other categories.
export async function CategoryPage({ locale, categoryId }: { locale: Locale; categoryId: string }) {
  const [t, items] = await Promise.all([getTranslations({ locale, namespace: "Examples" }), getPublishedExamples(locale)]);
  const name = t(`categories.${categoryId}.name` as never);
  const inCategory = items.filter((e) => e.category === categoryId);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("detail.home"), href: "/" },
            { name: t("detail.examples"), href: "/resume-examples" },
            { name, href: { pathname: "/resume-examples/[slug]", params: { slug: categorySlug(locale, categoryId)! } } },
          ]}
        />
      </div>
      <PageTitle
        content={{
          eyebrow: t("index.eyebrow"),
          title: t("meta.categoryTitle", { name }),
          description: t(`categories.${categoryId}.intro` as never),
        }}
      />
      <Section className="pt-4 sm:pt-6">
        {inCategory.length ? <ExampleCards items={inCategory} /> : <p className="text-center text-muted">{t("category.empty")}</p>}
        {items.length > inCategory.length && (
          <nav aria-labelledby="other-categories" className="mt-16">
            <h2 id="other-categories" className="mb-4 text-lg font-bold text-foreground">
              {t("category.others")}
            </h2>
            <CategoryLinks counts={countByCategory(items)} current={categoryId} />
          </nav>
        )}
      </Section>
    </>
  );
}
