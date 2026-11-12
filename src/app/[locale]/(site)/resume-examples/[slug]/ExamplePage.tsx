import { FilePen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ExampleCards } from "@/components/examples/ExampleList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ResumeDocument } from "@/components/resume/ResumeDocument";
import { resumeFontClasses } from "@/components/resume/resumeFonts";
import { ScaledPaper } from "@/components/resume/ScaledPaper";
import { Prose } from "@/components/site/Prose";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { categorySlug } from "@/lib/examples";
import { systemDefinition } from "@/lib/resume/design";
import {
  getPublishedExamples,
  type PublishedExample,
} from "@/server/content/examples";

const SIMILAR_MAX = 6;

// "yazılım mühendisi cv örneği" (plan 6.2, 6.4): the full resume as real text, the occupation guide,
// similar examples and "start from this example". Not a thin page: the guide is 400–800 words.
export async function ExamplePage({
  locale,
  example,
}: {
  locale: Locale;
  example: PublishedExample;
}) {
  const [t, tTemplates, all] = await Promise.all([
    getTranslations({ locale, namespace: "Examples" }),
    getTranslations({ locale, namespace: "Templates" }),
    getPublishedExamples(locale),
  ]);
  const categoryName = t(`categories.${example.category}.name` as never);
  const similar = all
    .filter((e) => e.category === example.category && e.slug !== example.slug)
    .slice(0, SIMILAR_MAX);
  const template = example.content.settings.template;
  const startHref = {
    pathname: "/create-resume" as const,
    query: { ornek: example.slug },
  };

  return (
    <article>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("detail.home"), href: "/" },
            { name: t("detail.examples"), href: "/resume-examples" },
            {
              name: categoryName,
              href: {
                pathname: "/resume-examples/[slug]",
                params: { slug: categorySlug(locale, example.category)! },
              },
            },
            {
              name: example.title,
              href: {
                pathname: "/resume-examples/[slug]",
                params: { slug: example.slug },
              },
            },
          ]}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <header className="min-w-0 lg:sticky lg:top-24">
          <h1 className="text-3xl leading-tight font-bold tracking-[-0.025em] text-pretty text-foreground sm:text-4xl">
            {example.title}
          </h1>
          <p className="mt-4 text-sm font-medium text-muted">
            {categoryName}
            {example.experienceLevel &&
              ` · ${t(`levels.${example.experienceLevel}` as never)}`}
          </p>
          {example.guide.intro && (
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {example.guide.intro}
            </p>
          )}
          <div className="mt-6 flex flex-col items-start gap-3">
            <Link
              href={startHref}
              className={buttonClass("primary", "md", "max-sm:w-full")}
            >
              <FilePen className="size-5" />
              {t("detail.start")}
            </Link>
            <p className="max-w-md text-sm text-muted">
              {t("detail.startHint")}
            </p>
          </div>
          {example.guide.sections.length > 0 && (
            <a
              href="#example-guide"
              className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-4"
            >
              {t("detail.guideLink")}
            </a>
          )}
          <time
            dateTime={example.updatedAt}
            className="mt-5 block border-t border-border pt-4 text-sm text-muted"
          >
            {t("detail.updated", {
              date: new Date(example.updatedAt).toLocaleDateString(locale, {
                dateStyle: "long",
                timeZone: "Europe/Istanbul",
              }),
            })}
          </time>
        </header>

        <section
          aria-label={t("detail.resumeLabel", {
            occupation: example.occupation,
          })}
          className="min-w-0 rounded-xl border border-border bg-desk p-3 sm:p-5"
        >
          <div
            className={cn(
              "overflow-hidden rounded-sm bg-paper shadow-paper",
              resumeFontClasses,
            )}
          >
            <ScaledPaper initialScale={0.55}>
              <ResumeDocument
                data={example.content}
                definition={systemDefinition(template)}
                embedded
              />
            </ScaledPaper>
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            {t("detail.template", {
              name: tTemplates(`names.${template}` as never),
            })}
          </p>
        </section>
      </div>

      {example.guide.sections.length > 0 && (
        <section
          id="example-guide"
          aria-labelledby="guide-title"
          className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14"
        >
          <div className="max-w-2xl border-t border-border pt-8">
            <h2
              id="guide-title"
              className="text-2xl leading-snug font-bold tracking-tight text-pretty text-foreground"
            >
              {t("detail.guideTitle", { occupation: example.occupation })}
            </h2>
            <div className="mt-8 space-y-10">
              {example.guide.sections.map((s, i) => (
                <section key={i}>
                  <h3 className="text-xl font-bold text-foreground">
                    {s.heading}
                  </h3>
                  <div className="mt-3">
                    <Prose text={s.body} />
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-start gap-4 border-t border-border py-6">
              <p className="text-foreground">{t("detail.startHint")}</p>
              <Link
                href={startHref}
                className={buttonClass("secondary", "md", "shrink-0")}
              >
                <FilePen className="size-4" />
                {t("detail.start")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section
          aria-labelledby="similar-title"
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"
        >
          <div className="border-t border-border pt-8">
            <h2
              id="similar-title"
              className="mb-6 text-2xl font-bold tracking-tight text-foreground"
            >
              {t("detail.similar")}
            </h2>
            <ExampleCards items={similar} />
          </div>
        </section>
      )}
    </article>
  );
}
