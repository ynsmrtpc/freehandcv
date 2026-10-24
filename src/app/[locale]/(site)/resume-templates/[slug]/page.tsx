import { ShieldCheck, Star, Users } from "lucide-react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { DefinitionPreview } from "@/components/resume/TemplatePreview";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { itemFacts, itemSlug, TemplateCard, type GalleryItem } from "@/components/templates/TemplateCard";
import { TemplateActions } from "@/components/templates/TemplateActions";
import { getPathname, Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { FONTS } from "@/lib/resume/design";
import type { TemplateId } from "@/lib/resume/schema";
import { alternates } from "@/lib/seo";
import { communityGalleryItems, systemGalleryItems } from "@/lib/templateGallery";
import { parseTemplateSlug } from "@/lib/templates";
import { getPublicTemplates, getSharedTemplate } from "@/server/templates";

const SIMILAR_MAX = 4;

type Text = { names: Record<TemplateId, string>; descriptions: Record<TemplateId, string> };

/** The template behind a slug, with every public template (for "similar" and the rating mean). */
async function load(locale: Locale, slug: string) {
  const ref = parseTemplateSlug(slug);
  if (!ref) return null;
  const [messages, community] = await Promise.all([getMessages({ locale }), getPublicTemplates()]);
  const system = systemGalleryItems(messages.Templates as Text);
  const all = [...system, ...communityGalleryItems(community)];
  if (ref.kind === "system") {
    const item = system.find((i) => i.ref.id === ref.id)!;
    return { item, all, unlisted: false };
  }
  const shared = await getSharedTemplate(ref.id);
  if (!shared) return null;
  const [item] = communityGalleryItems([shared], community);
  return { item, all, unlisted: shared.visibility === "unlisted" };
}

export async function generateStaticParams() {
  const community = await getPublicTemplates();
  const text = { names: {}, descriptions: {} } as Text;
  return [...systemGalleryItems(text), ...communityGalleryItems(community)].map((i) => ({ slug: itemSlug(i) }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/resume-templates/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const found = await load(locale, slug);
  if (!found) return {};
  const t = await getTranslations({ locale, namespace: "Templates.detail" });
  const { item, unlisted } = found;
  const href = { pathname: "/resume-templates/[slug]" as const, params: { slug: itemSlug(item) } };
  return {
    title: t("meta.title", { name: item.name }),
    description: item.description || t("meta.description", { name: item.name }),
    alternates: alternates(href, locale),
    // Unlisted templates are for people with the link only (plan 11.2).
    robots: unlisted ? { index: false, follow: false } : undefined,
  };
}

export default function Page({ params }: PageProps<"/[locale]/resume-templates/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: PageProps<"/[locale]/resume-templates/[slug]">["params"] }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const found = await load(locale, slug);
  if (!found) notFound();
  const { item, all } = found;
  const canonical = itemSlug(item);
  // A renamed template keeps its id; old links move to the current name.
  if (slug !== canonical)
    permanentRedirect(getPathname({ href: { pathname: "/resume-templates/[slug]", params: { slug: canonical } }, locale }));
  return <TemplatePage locale={locale} item={item} all={all} />;
}

async function TemplatePage({ locale, item, all }: { locale: Locale; item: GalleryItem; all: GalleryItem[] }) {
  const [t, tg, tl] = await Promise.all([
    getTranslations({ locale, namespace: "Templates.detail" }),
    getTranslations({ locale, namespace: "Templates.gallery" }),
    getTranslations({ locale, namespace: "TemplateEditor.options.layout" }),
  ]);
  const facts = itemFacts(item);
  const similar = all
    .filter((i) => i !== item && i.ref.id !== item.ref.id && itemFacts(i).twoColumn === facts.twoColumn)
    .sort((a, b) => Math.abs(a.ats - item.ats) - Math.abs(b.ats - item.ats) || b.usage - a.usage)
    .slice(0, SIMILAR_MAX);
  const font = item.definition.typography;

  return (
    <article>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: tg("home"), href: "/" },
            { name: tg("breadcrumb"), href: "/resume-templates" },
            { name: item.name, href: { pathname: "/resume-templates/[slug]", params: { slug: itemSlug(item) } } },
          ]}
        />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:py-14">
        <div className="lg:pt-6">
          <p className="text-sm font-semibold tracking-wide text-primary-text uppercase">
            {item.ownerUsername ? t("community") : t("official")}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">{item.name}</h1>
          <p className="mt-3 text-muted">
            {item.ownerUsername ? (
              t.rich("by", {
                owner: () => (
                  <Link
                    href={{ pathname: "/users/[username]", params: { username: item.ownerUsername! } }}
                    className="font-semibold text-foreground hover:text-primary-text"
                  >
                    @{item.ownerUsername}
                  </Link>
                ),
              })
            ) : (
              t("byOfficial")
            )}
          </p>
          {item.description && <p className="mt-5 text-lg leading-relaxed text-pretty text-muted">{item.description}</p>}

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <li className="inline-flex items-center gap-1.5 font-medium text-accent">
              <ShieldCheck className="size-4" aria-hidden />
              {tg("ats", { score: item.ats })}
            </li>
            {item.ratingAverage !== null && (
              <li className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-current text-warning" aria-hidden />
                {tg("rating", { average: item.ratingAverage.toFixed(1), count: item.ratingCount })}
              </li>
            )}
            {item.usage > 0 && (
              <li className="inline-flex items-center gap-1.5">
                <Users className="size-4" aria-hidden />
                {tg("usage", { n: item.usage })}
              </li>
            )}
          </ul>

          <div className="mt-8">
            <TemplateActions templateRef={item.ref} />
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 text-sm">
            <div>
              <dt className="text-muted">{t("facts.layout")}</dt>
              <dd className="mt-0.5 font-semibold text-foreground">{tl(item.definition.layout)}</dd>
            </div>
            <div>
              <dt className="text-muted">{t("facts.photo")}</dt>
              <dd className="mt-0.5 font-semibold text-foreground">{facts.photo ? t("facts.photoYes") : t("facts.photoNo")}</dd>
            </div>
            <div>
              <dt className="text-muted">{t("facts.font")}</dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {FONTS[font.headingFont ?? font.font].name}
                {font.headingFont && font.headingFont !== font.font && ` + ${FONTS[font.font].name}`}
              </dd>
            </div>
            <div>
              <dt className="text-muted">{t("facts.colour")}</dt>
              <dd className="mt-0.5 font-semibold text-foreground">
                {item.definition.monochrome ? t("facts.monochrome") : t("facts.anyColour")}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-muted">{t(item.ats === 5 ? "atsFull" : "atsPartial")}</p>
        </div>

        <div>
          <div className="overflow-hidden rounded-sm shadow-paper">
            <DefinitionPreview definition={item.definition} locale={locale} initialScale={0.7} />
          </div>
          <p className="mt-3 text-center text-sm text-muted">{t("sampleNote")}</p>
        </div>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-templates" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 id="similar-templates" className="text-2xl font-bold tracking-tight text-foreground">
            {t("similar")}
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((i) => (
              <li key={`${i.ref.kind}:${i.ref.id}`}>
                <TemplateCard item={i} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
