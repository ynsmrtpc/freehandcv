import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { CMS_PAGES } from "@/lib/cmsPages";
import { alternates, absoluteUrl } from "@/lib/seo";
import { HOME_SLUG, getPublishedPages } from "@/server/content/pages";

// Only published, indexable pages; lastmod is the real update time (plan 6.4).
// Example resumes, templates and guides join here as they are added.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const published = await getPublishedPages();
  const routes = [{ href: "/" as const, slug: HOME_SLUG }, ...CMS_PAGES];

  return routes.flatMap(({ href, slug }) => {
    const records = published.filter((p) => p.slug === slug);
    // If the database is unreachable the home page is still listed.
    const locales = (records.length ? records.map((r) => r.locale) : slug === HOME_SLUG ? routing.locales : []) as Locale[];
    return locales.map((locale) => ({
      url: absoluteUrl(href, locale),
      lastModified: records.find((r) => r.locale === locale)?.updatedAt,
      alternates: { languages: alternates(href, locale, locales)?.languages as Record<string, string> },
    }));
  });
}
