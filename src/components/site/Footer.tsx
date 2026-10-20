import { ArrowUpRight, Heart, Mail } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getPublishedExamples } from "@/server/content/examples";
import { getPublishedGuides, getPublishedPages } from "@/server/content/pages";
import { getSiteSettings } from "@/server/content/siteSettings";
import { Logo } from "./Logo";

// Cache Components: reading the clock outside a request must happen in a cached function.
async function getYear() {
  "use cache";
  return new Date().getFullYear();
}

// Tagline, social links, contact and donation come from site settings (admin panel).
export async function Footer() {
  const locale = await getLocale();
  const [t, tGuides, year, settings, published, examples, allGuides] = await Promise.all([
    getTranslations("Site"),
    getTranslations("Guides"),
    getYear(),
    getSiteSettings(locale),
    getPublishedPages(),
    getPublishedExamples(locale),
    getPublishedGuides(),
  ]);
  // Internal links to the guides (plan 6.3 footer); at most 6.
  const guides = allGuides.filter((g) => g.locale === locale).slice(0, 6);
  const { global, localized } = settings;
  const isPublished = (slug: string) => published.some((p) => p.locale === locale && p.slug === slug);
  const social = [
    { name: "LinkedIn", url: global.social.linkedin },
    { name: "X", url: global.social.x },
    { name: "Instagram", url: global.social.instagram },
    { name: "GitHub", url: global.social.github },
  ].filter((s) => s.url);
  const linkClass = "text-sm text-muted transition-colors hover:text-foreground";

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{localized.footerTagline || t("footerTagline")}</p>
          {(social.length > 0 || global.contactEmail) && (
            <ul className="mt-5 flex flex-wrap items-center gap-1">
              {social.map(({ name, url }) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center gap-1 rounded-xl px-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                  >
                    {name}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </li>
              ))}
              {global.contactEmail && (
                <li>
                  <a
                    href={`mailto:${global.contactEmail}`}
                    className="flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                  >
                    <Mail className="size-[18px]" aria-hidden />
                    {global.contactEmail}
                  </a>
                </li>
              )}
            </ul>
          )}
          {global.donation.enabled && global.donation.url && (
            <a
              href={global.donation.url}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-surface-2"
            >
              <Heart className="size-4 text-danger" aria-hidden />
              {localized.donationLabel || "♥"}
            </a>
          )}
        </div>
        <nav aria-label={t("footerProduct")}>
          <p className="text-sm font-semibold text-foreground">{t("footerProduct")}</p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/create-resume" className={linkClass}>
                {t("createResume")}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: "/", hash: "sablonlar" }} className={linkClass}>
                {t("templates")}
              </Link>
            </li>
            {examples.length > 0 && (
              <li>
                <Link href="/resume-examples" className={linkClass}>
                  {t("resumeExamples")}
                </Link>
              </li>
            )}
            <li>
              {isPublished("is-it-free") ? (
                <Link href="/is-it-free" className={linkClass}>
                  {t("isItFree")}
                </Link>
              ) : (
                <Link href={{ pathname: "/", hash: "karsilastirma" }} className={linkClass}>
                  {t("isItFree")}
                </Link>
              )}
            </li>
            {isPublished("support") && (
              <li>
                <Link href="/support" className={linkClass}>
                  {t("support")}
                </Link>
              </li>
            )}
            {isPublished("privacy") && (
              <li>
                <Link href="/privacy" className={linkClass}>
                  {t("privacy")}
                </Link>
              </li>
            )}
            <li>
              <Link href={{ pathname: "/", hash: "sss" }} className={linkClass}>
                {t("faq")}
              </Link>
            </li>
          </ul>
        </nav>
        {guides.length > 0 && (
          <nav aria-label={tGuides("footer")}>
            <p className="text-sm font-semibold text-foreground">{tGuides("footer")}</p>
            <ul className="mt-4 space-y-3">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={{ pathname: "/guides/[topic]", params: { topic: g.slug } }} className={linkClass}>
                    {g.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guides" className={`${linkClass} font-semibold`}>
                  {tGuides("all")}
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">
          {t("footerCopyright", { year })}
        </p>
      </div>
    </footer>
  );
}
