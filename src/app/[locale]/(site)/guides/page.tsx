import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageTitle } from "@/blocks/PageTitle";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { getPublishedGuides } from "@/server/content/pages";

export async function generateMetadata({ params }: PageProps<"/[locale]/guides">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, guides] = await Promise.all([getTranslations({ locale, namespace: "Guides" }), getPublishedGuides()]);
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: alternates("/guides", locale),
    // An empty list is not worth indexing yet.
    robots: guides.some((g) => g.locale === locale) ? undefined : { index: false },
  };
}

// All published guides of the locale: the entry point the header links to.
export default async function Guides({ params }: PageProps<"/[locale]/guides">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [t, all] = await Promise.all([getTranslations({ locale, namespace: "Guides" }), getPublishedGuides()]);
  const guides = all.filter((g) => g.locale === locale);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("home"), href: "/" },
            { name: t("indexEyebrow"), href: "/guides" },
          ]}
        />
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <PageTitle reading content={{ eyebrow: t("indexEyebrow"), title: t("indexTitle"), description: t("indexDescription") }} />
      </div>
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 sm:pb-24">
        {guides.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={{ pathname: "/guides/[topic]", params: { topic: g.slug } }}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary sm:p-6"
                >
                  <h2 className="text-lg font-bold text-balance text-foreground">{g.title}</h2>
                  {g.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{g.description}</p>}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-text">
                    {t("read")}
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">{t("empty")}</p>
        )}
      </section>
    </>
  );
}
