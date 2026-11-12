import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "./Breadcrumbs";
import { ReadingLayout } from "./ReadingLayout";
import type { Locale } from "@/i18n/routing";
import { CMS_PAGES, type CmsPageHref } from "@/lib/cmsPages";
import { alternates } from "@/lib/seo";
import { getPublishedPage } from "@/server/content/pages";
import { getSiteSettings } from "@/server/content/siteSettings";
import { loadBlockContext } from "@/server/content/blockContext";

const slugFor = (href: CmsPageHref) =>
  CMS_PAGES.find((p) => p.href === href)!.slug;

export async function cmsMetadata(
  href: CmsPageHref,
  locale: Locale,
): Promise<Metadata> {
  const page = await getPublishedPage(locale, slugFor(href));
  if (!page) return {};
  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
    alternates: alternates(href, locale),
    robots: page.indexable ? undefined : { index: false },
  };
}

/** 404 unless published (drafts are never shown to visitors). */
export async function CmsPage({
  href,
  locale,
}: {
  href: CmsPageHref;
  locale: Locale;
}) {
  const [page, settings, t] = await Promise.all([
    getPublishedPage(locale, slugFor(href)),
    getSiteSettings(locale),
    getTranslations({ locale, namespace: "Site" }),
  ]);
  if (!page) notFound();
  const { donation } = settings.global;
  const context = await loadBlockContext(page.blocks, locale);
  return (
    <article>
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("home"), href: "/" },
            { name: page.title, href },
          ]}
        />
      </div>
      <ReadingLayout
        blocks={page.blocks}
        title={page.title}
        contentsLabel={t("contents")}
        context={{
          ...context,
          donationUrl: donation.enabled ? donation.url : undefined,
        }}
      />
    </article>
  );
}
