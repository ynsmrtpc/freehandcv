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
import { getPublishedExamples, type PublishedExample } from "@/server/content/examples";

const SIMILAR_MAX = 6;

// "yazılım mühendisi cv örneği" (plan 6.2, 6.4): the full resume as real text, the occupation guide,
// similar examples and "start from this example". Not a thin page: the guide is 400–800 words.
export async function ExamplePage({ locale, example }: { locale: Locale; example: PublishedExample }) {
  const [t, tTemplates, all] = await Promise.all([
    getTranslations({ locale, namespace: "Examples" }),
    getTranslations({ locale, namespace: "Templates" }),
    getPublishedExamples(locale),
  ]);
  const categoryName = t(`categories.${example.category}.name` as never);
  const similar = all.filter((e) => e.category === example.category && e.slug !== example.slug).slice(0, SIMILAR_MAX);
  const template = example.content.settings.template;
  const startHref = { pathname: "/create-resume" as const, query: { ornek: example.slug } };

  return (
    <article>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <Breadcrumbs
          items={[
            { name: t("detail.home"), href: "/" },
            { name: t("detail.examples"), href: "/resume-examples" },
            {
              name: categoryName,
              href: { pathname: "/resume-examples/[slug]", params: { slug: categorySlug(locale, example.category)! } },
            },
            { name: example.title, href: { pathname: "/resume-examples/[slug]", params: { slug: example.slug } } },
          ]}
        />
      </div>

      <header className="mx-auto max-w-3xl px-4 pt-10 text-center sm:px-6 sm:pt-14">
        <p className="text-sm font-semibold tracking-wide text-primary-text uppercase">
          {t("detail.eyebrow")}
          {example.experienceLevel && ` · ${t(`levels.${example.experienceLevel}` as never)}`}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-foreground sm:text-5xl">
          {example.title}
        </h1>
        {example.guide.intro && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted">{example.guide.intro}</p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link href={startHref} className={buttonClass("primary", "lg")}>
            <FilePen className="size-5" />
            {t("detail.start")}
          </Link>
          <p className="max-w-md text-sm text-muted">{t("detail.startHint")}</p>
        </div>
      </header>

      <section aria-label={t("detail.resumeLabel", { occupation: example.occupation })} className="px-4 pt-12 sm:px-6">
        <div className="mx-auto max-w-[820px]">
          <div className={cn("overflow-hidden rounded-sm bg-white shadow-paper", resumeFontClasses)}>
            <ScaledPaper initialScale={1}>
              <ResumeDocument data={example.content} definition={systemDefinition(template)} embedded />
            </ScaledPaper>
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            {t("detail.template", { name: tTemplates(`names.${template}` as never) })}
          </p>
        </div>
      </section>

      {example.guide.sections.length > 0 && (
        <section aria-labelledby="guide-title" className="px-4 pt-20 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 id="guide-title" className="text-3xl font-bold tracking-tight text-balance text-foreground">
              {t("detail.guideTitle", { occupation: example.occupation })}
            </h2>
            <div className="mt-8 space-y-10">
              {example.guide.sections.map((s, i) => (
                <section key={i}>
                  <h3 className="text-xl font-bold text-foreground">{s.heading}</h3>
                  <div className="mt-3">
                    <Prose text={s.body} />
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-12 flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
              <p className="text-foreground">{t("detail.startHint")}</p>
              <Link href={startHref} className={buttonClass("secondary", "md", "shrink-0")}>
                <FilePen className="size-4" />
                {t("detail.start")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 id="similar-title" className="mb-6 text-2xl font-bold tracking-tight text-foreground">
              {t("detail.similar")}
            </h2>
            <ExampleCards items={similar} />
          </div>
        </section>
      )}
    </article>
  );
}
