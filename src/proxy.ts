import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except api, Next.js internals and files with an extension (favicon.ico, sitemap.xml…).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
