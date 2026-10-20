import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { CMS_PAGES } from "@/lib/cmsPages";
import { categorySlug, EXAMPLE_CATEGORIES } from "@/lib/examples";
import { alternates, absoluteUrl } from "@/lib/seo";
import { getPublishedExamples } from "@/server/content/examples";
import { HOME_SLUG, getPublishedPages } from "@/server/content/pages";

// Only published, indexable pages; lastmod is the real update time (plan 6.4).
// Templates and guides join here as they are added.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [published, examples] = await Promise.all([
    getPublishedPages(),
    Promise.all(routing.locales.map(async (locale) => ({ locale, items: await getPublishedExamples(locale) }))),
  ]);
  const routes = [{ href: "/" as const, slug: HOME_SLUG }, ...CMS_PAGES];

  const pages = routes.flatMap(({ href, slug }) => {
    const records = published.filter((p) => p.slug === slug);
    // If the database is unreachable the home page is still listed.
    const locales = (records.length ? records.map((r) => r.locale) : slug === HOME_SLUG ? routing.locales : []) as Locale[];
    return locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      lastModified: records.find((r) => r.locale === locale)?.updatedAt,
      alternates: { languages: alternates(href, locale, locales)?.languages as Record<string, string> },
    }));
  });

  // Examples are written per market (plan 8.3), so each locale's pages stand alone (no alternates).
  const examplePages = examples.flatMap(({ locale, items }) => {
    if (!items.length) return [];
    const newest = (list: typeof items) => list.reduce((a, e) => (e.updatedAt > a ? e.updatedAt : a), list[0].updatedAt);
    const categories = EXAMPLE_CATEGORIES.map((c) => ({ c, list: items.filter((e) => e.category === c.id) })).filter(
      ({ list }) => list.length,
    );
    return [
      { url: absoluteUrl("/resume-examples", locale), lastModified: newest(items) },
      ...categories.map(({ c, list }) => ({
        url: absoluteUrl({ pathname: "/resume-examples/[slug]", params: { slug: categorySlug(locale, c.id)! } }, locale),
        lastModified: newest(list),
      })),
      ...items.map((e) => ({
        url: absoluteUrl({ pathname: "/resume-examples/[slug]", params: { slug: e.slug } }, locale),
        lastModified: e.updatedAt,
      })),
    ];
  });

  return [...pages, ...examplePages];
}
