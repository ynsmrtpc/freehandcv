import { getSessionCookie } from "better-auth/cookies";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, type Locale } from "./i18n/routing";

const intl = createMiddleware(routing);

/** Public path of a route (prefix "as-needed": none for the default locale). The proxy can't import i18n/navigation. */
function publicPath(href: "/create-resume" | "/dashboard", locale: Locale) {
  const segment = routing.pathnames[href][locale];
  return locale === routing.defaultLocale ? segment : `/${locale}${segment}`;
}

// The guest editor's public paths and where signed-in users go instead (their resumes live in the account).
const editorToDashboard = new Map(
  routing.locales.map((locale) => [publicPath("/create-resume", locale), publicPath("/dashboard", locale)]),
);

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const dashboard = editorToDashboard.get(pathname);
  // Redirect before the editor renders, so a signed-in user never sees it flash. Only the cookie's
  // presence is checked here (cheap); the dashboard validates the session and asks to sign in if it
  // has expired. "Start from this example" (?ornek=) is handled by the editor itself.
  if (dashboard && !searchParams.has("ornek") && getSessionCookie(request)) {
    return NextResponse.redirect(new URL(dashboard, request.url));
  }
  return intl(request);
}

export const config = {
  // Everything except api, Next.js internals and files with an extension (favicon.ico, sitemap.xml…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
