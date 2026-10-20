import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BlockRenderer } from "@/blocks/BlockRenderer";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getPublishedGuide, getPublishedGuides, type GuideSummary } from "@/server/content/pages";
import { loadBlockContext } from "@/server/content/blockContext";

// Guides (plan 6.2 /rehber/[konu]): CMS pages of kind "guide", edited with the block editor.

const RELATED_MAX = 6;
/** Cache Components needs at least one param at build time; it renders a 404 until a guide is published. */
const FALLBACK_TOPIC = "cv-nasil-hazirlanir";

const guideHref = (slug: string) => ({ pathname: "/guides/[topic]" as const, params: { topic: slug } });

/** hreflang: the same guide in other locales shares a translation group (plan 8.3). */
function guideAlternates(all: GuideSummary[], locale: Locale, slug: string): Metadata["alternates"] {
  const self = all.find((g) => g.locale === locale && g.slug === slug);
  const siblings = self?.translationGroup ? all.filter((g) => g.translationGroup === self.translationGroup) : [];
  const languages: Record<string, string> = {};
  for (const g of siblings) languages[g.locale] = absoluteUrl(guideHref(g.slug), g.locale as Locale);
  const tr = siblings.find((g) => g.locale === routing.defaultLocale);
  if (tr) languages["x-default"] = languages[tr.locale];
  return { canonical: absoluteUrl(guideHref(slug), locale), languages: siblings.length > 1 ? languages : undefined };
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const guides = (await getPublishedGuides()).filter((g) => g.locale === params.locale);
  return guides.length ? guides.map((g) => ({ topic: g.slug })) : [{ topic: FALLBACK_TOPIC }];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/guides/[topic]">): Promise<Metadata> {
  const { locale, topic } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [guide, all] = await Promise.all([getPublishedGuide(locale, topic), getPublishedGuides()]);
  if (!guide) return {};
  return {
    title: { absolute: guide.metaTitle || guide.title },
    description: guide.metaDescription || undefined,
    alternates: guideAlternates(all, locale, topic),
    robots: guide.indexable ? undefined : { index: false },
    openGraph: { type: "article", modifiedTime: guide.updatedAt },
  };
}

export default function GuidePage({ params }: PageProps<"/[locale]/guides/[topic]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/[locale]/guides/[topic]">["params"] }) {
  const { locale, topic } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [guide, all, t] = await Promise.all([
    getPublishedGuide(locale, topic),
    getPublishedGuides(),
    getTranslations({ locale, namespace: "Guides" }),
  ]);
  if (!guide) notFound();
  const related = all.filter((g) => g.locale === locale && g.slug !== topic).slice(0, RELATED_MAX);
  const context = await loadBlockContext(guide.blocks, locale);
  const date = new Date(guide.updatedAt).toLocaleDateString(locale, { dateStyle: "long" });

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.metaDescription || undefined,
          inLanguage: locale,
          dateModified: guide.updatedAt,
          mainEntityOfPage: absoluteUrl(guideHref(topic), locale),
          publisher: { "@type": "Organization", name: "FreehandCV", url: SITE_URL },
        }}
      />
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("home"), href: "/" },
            { name: guide.title, href: guideHref(topic) },
          ]}
        />
      </div>
      <BlockRenderer blocks={guide.blocks} context={context} />
      <p className="mx-auto max-w-3xl px-4 pb-6 text-sm text-muted sm:px-6">{t("updated", { date })}</p>
      {related.length > 0 && (
        <nav aria-labelledby="related-guides" className="mx-auto max-w-3xl px-4 pt-6 pb-20 sm:px-6">
          <h2 id="related-guides" className="text-xl font-bold text-foreground">
            {t("related")}
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {related.map((g) => (
              <li key={g.slug}>
                <Link
                  href={guideHref(g.slug)}
                  className="block rounded-xl border border-border bg-surface px-4 py-3 font-medium text-foreground shadow-card hover:border-border-strong"
                >
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </article>
  );
}
