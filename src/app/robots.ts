import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

// App routes are not crawled (plan 6.1), including their localized paths.
const APP_ROUTES = ["/create-resume", "/admin", "/sign-in", "/sign-up", "/dashboard"] as const;
// Phase 2 app paths that have no route definition yet.
const UPCOMING_PATHS = ["/cv/", "/en/cv/", "/yazdir/", "/hesap", "/sablon-editoru/"];

export default function robots(): MetadataRoute.Robots {
  const disallowed = new Set<string>(["/api/", ...UPCOMING_PATHS]);
  for (const href of APP_ROUTES)
    for (const locale of routing.locales) disallowed.add(getPathname({ href, locale }));

  return {
    rules: { userAgent: "*", allow: "/", disallow: [...disallowed] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
