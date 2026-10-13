import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // api, Next.js iç yolları ve uzantılı dosyalar (favicon.ico, sitemap.xml…) hariç her şey.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
