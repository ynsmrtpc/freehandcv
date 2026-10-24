import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { CMS_PAGES } from "@/lib/cmsPages";
import { categorySlug, EXAMPLE_CATEGORIES } from "@/lib/examples";
import { alternates, absoluteUrl } from "@/lib/seo";
import { getPublishedExamples } from "@/server/content/examples";
import { HOME_SLUG, getPublishedGuides, getPublishedPages } from "@/server/content/pages";
import { SYSTEM_TEMPLATE_LIST } from "@/lib/resume/design";
import { templateSlug } from "@/lib/templates";
import { getPublicTemplates } from "@/server/templates";

// Only published, indexable pages; lastmod is the real update time (plan 6.4).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [published, guides, examples, community] = await Promise.all([
    getPublishedPages(),
    getPublishedGuides(),
    Promise.all(routing.locales.map(async (locale) => ({ locale, items: await getPublishedExamples(locale) }))),
    getPublicTemplates(),
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

  // Guides: the same guide in other locales shares a translation group (hreflang).
  const guidePages = guides.map((g) => {
    const href = { pathname: "/guides/[topic]" as const, params: { topic: g.slug } };
    const siblings = g.translationGroup ? guides.filter((x) => x.translationGroup === g.translationGroup) : [g];
    return {
      url: absoluteUrl(href, g.locale as Locale),
      lastModified: g.updatedAt,
      alternates:
        siblings.length > 1
          ? {
              languages: Object.fromEntries(
                siblings.map((s) => [s.locale, absoluteUrl({ pathname: "/guides/[topic]", params: { topic: s.slug } }, s.locale as Locale)]),
              ),
            }
          : undefined,
    };
  });

  // The guides index of each locale that has guides.
  const guideIndexes = routing.locales
    .map((locale) => ({ locale, list: guides.filter((g) => g.locale === locale) }))
    .filter(({ list }) => list.length)
    .map(({ locale, list }) => ({
      url: absoluteUrl("/guides", locale),
      lastModified: list.reduce((a, g) => (g.updatedAt > a ? g.updatedAt : a), list[0].updatedAt),
    }));

  // Templates look the same in every locale, so each page lists its other-locale versions.
  const everyLocale = (href: Parameters<typeof absoluteUrl>[0], lastModified?: string) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      lastModified,
      alternates: { languages: alternates(href, locale)?.languages as Record<string, string> },
    }));
  const owners = [...new Set(community.map((t) => t.ownerUsername).filter((u) => u !== null))];
  const templatePages = [
    ...everyLocale("/resume-templates", community[0]?.updatedAt),
    ...SYSTEM_TEMPLATE_LIST.flatMap((t) =>
      everyLocale({ pathname: "/resume-templates/[slug]", params: { slug: templateSlug({ kind: "system", id: t.id }) } }),
    ),
    ...community.flatMap((t) =>
      everyLocale(
        { pathname: "/resume-templates/[slug]", params: { slug: templateSlug({ kind: "user", id: t.id }, t.name) } },
        t.updatedAt,
      ),
    ),
    ...owners.flatMap((username) => everyLocale({ pathname: "/users/[username]", params: { username } })),
  ];

  return [...pages, ...examplePages, ...guideIndexes, ...guidePages, ...templatePages];
}
