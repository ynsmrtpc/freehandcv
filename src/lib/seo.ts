import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "./site";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute URL of a route in the given locale. */
export function absoluteUrl(href: Href, locale: Locale): string {
  const path = getPathname({ href, locale });
  return SITE_URL + (path === "/" ? "" : path);
}

/**
 * canonical + hreflang alternates (plan 8.3). x-default is the Turkish version.
 * When `locales` is given, alternates are produced only for the locales the page exists in.
 */
export function alternates(
  href: Href,
  locale: Locale,
  locales: readonly Locale[] = routing.locales,
): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(href, l);
  languages["x-default"] = absoluteUrl(href, routing.defaultLocale);
  return { canonical: absoluteUrl(href, locale), languages };
}
