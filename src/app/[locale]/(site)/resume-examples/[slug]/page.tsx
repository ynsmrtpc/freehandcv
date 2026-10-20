import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { routing, type Locale } from "@/i18n/routing";
import { categoryBySlug, EXAMPLE_CATEGORIES } from "@/lib/examples";
import { alternates } from "@/lib/seo";
import { getPublishedExample, getPublishedExamples } from "@/server/content/examples";
import { CategoryPage } from "./CategoryPage";
import { ExamplePage } from "./ExamplePage";

// One segment, two kinds of page (plan 6.2): category slugs are fixed in code (/cv-ornekleri/saglik),
// example slugs end in "-cv-ornegi" (/cv-ornekleri/hemsire-cv-ornegi), so they never collide.

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const examples = await getPublishedExamples(locale);
  return [...EXAMPLE_CATEGORIES.map((c) => ({ slug: c.slug[locale] })), ...examples.map((e) => ({ slug: e.slug }))];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/resume-examples/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const href = { pathname: "/resume-examples/[slug]" as const, params: { slug } };
  const category = categoryBySlug(locale, slug);
  if (category) {
    const [t, items] = await Promise.all([getTranslations({ locale, namespace: "Examples" }), getPublishedExamples(locale)]);
    const name = t(`categories.${category.id}.name` as never);
    const count = items.filter((e) => e.category === category.id).length;
    return {
      title: t("meta.categoryTitle", { name }),
      description: t("meta.categoryDescription", { name }),
      // Category slugs differ per locale, so only this locale's URL is listed as an alternate.
      alternates: alternates(href, locale, [locale]),
      robots: count ? undefined : { index: false },
    };
  }
  const example = await getPublishedExample(locale, slug);
  if (!example) return {};
  return {
    title: { absolute: example.metaTitle || example.title },
    description: example.metaDescription || example.guide.intro.slice(0, 155) || undefined,
    // Examples are written per market, not translated (plan 8.3): no cross-locale alternates.
    alternates: alternates(href, locale, [locale]),
  };
}

export default function Page({ params }: PageProps<"/[locale]/resume-examples/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/[locale]/resume-examples/[slug]">["params"] }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const category = categoryBySlug(locale, slug);
  if (category) return <CategoryPage locale={locale} categoryId={category.id} />;
  const example = await getPublishedExample(locale, slug);
  if (!example) notFound();
  return <ExamplePage locale={locale} example={example} />;
}
