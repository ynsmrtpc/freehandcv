import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { itemKey, TemplateCard } from "@/components/templates/TemplateCard";
import { routing } from "@/i18n/routing";
import { alternates } from "@/lib/seo";
import { communityGalleryItems } from "@/lib/templateGallery";
import { normalizeUsername } from "@/lib/username";
import { getProfile, getPublicTemplates } from "@/server/templates";

// A template owner's public profile (plan 6.2 /kullanici/[kullanici-adi]): their public templates
// only, never resumes. A profile without public templates is not indexed.

export async function generateStaticParams() {
  const owners = new Set((await getPublicTemplates()).map((t) => t.ownerUsername).filter((u) => u !== null));
  return [...owners].map((username) => ({ username }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/users/[username]">): Promise<Metadata> {
  const { locale, username } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const profile = await getProfile(normalizeUsername(decodeURIComponent(username)));
  if (!profile) return {};
  const t = await getTranslations({ locale, namespace: "Templates.profile" });
  return {
    title: t("meta.title", { username: profile.username }),
    description: t("meta.description", { username: profile.username, n: profile.templates.length }),
    alternates: alternates({ pathname: "/users/[username]", params: { username: profile.username } }, locale),
    robots: profile.templates.length ? undefined : { index: false },
  };
}

export default function Page({ params }: PageProps<"/[locale]/users/[username]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/[locale]/users/[username]">["params"] }) {
  const { locale, username } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const [profile, all, t, tg] = await Promise.all([
    getProfile(normalizeUsername(decodeURIComponent(username))),
    getPublicTemplates(),
    getTranslations({ locale, namespace: "Templates.profile" }),
    getTranslations({ locale, namespace: "Templates.gallery" }),
  ]);
  if (!profile) notFound();
  const items = communityGalleryItems(profile.templates, all);
  const uses = items.reduce((n, i) => n + i.usage, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="pt-6">
        <Breadcrumbs
          items={[
            { name: tg("home"), href: "/" },
            { name: tg("breadcrumb"), href: "/resume-templates" },
            { name: `@${profile.username}`, href: { pathname: "/users/[username]", params: { username: profile.username } } },
          ]}
        />
      </div>
      <header className="flex items-center gap-4 pt-10 sm:pt-14">
        <span
          aria-hidden
          className="grid size-16 shrink-0 place-items-center rounded-full bg-primary-soft text-2xl font-bold text-primary-text uppercase"
        >
          {profile.username[0]}
        </span>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">@{profile.username}</h1>
          <p className="mt-1 text-muted">{t("summary", { n: items.length, uses })}</p>
        </div>
      </header>
      {items.length ? (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((i) => (
            <li key={itemKey(i)}>
              <TemplateCard item={i} locale={locale} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-border-strong px-6 py-14 text-center text-muted">{t("empty")}</p>
      )}
    </div>
  );
}
