import { defineRouting } from "next-intl/routing";

// Plan sections 6.2 and 8.3: Turkish lives at the root (no prefix), other locales use a prefix.
// Internal route keys are English; public path segments are written for each market's real
// searches (Turkish URLs stay Turkish). Public URLs never change after launch.
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  // No automatic redirect; a browser-language suggestion bar is shown instead (8.3).
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/create-resume": { tr: "/cv-olustur", en: "/create-resume" },
    "/resume-examples": { tr: "/cv-ornekleri", en: "/resume-examples" },
    "/resume-examples/[slug]": { tr: "/cv-ornekleri/[slug]", en: "/resume-examples/[slug]" },
    "/resume-templates": { tr: "/cv-sablonlari", en: "/resume-templates" },
    "/resume-templates/[slug]": { tr: "/cv-sablonlari/[slug]", en: "/resume-templates/[slug]" },
    "/users/[username]": { tr: "/kullanici/[username]", en: "/users/[username]" },
    "/guides": { tr: "/rehber", en: "/guides" },
    "/guides/[topic]": { tr: "/rehber/[topic]", en: "/guides/[topic]" },
    "/is-it-free": { tr: "/ucretsiz-mi", en: "/is-it-free" },
    "/support": { tr: "/destek", en: "/support" },
    "/privacy": { tr: "/gizlilik-ve-kvkk", en: "/privacy" },
    "/sign-in": { tr: "/giris", en: "/sign-in" },
    "/sign-up": { tr: "/kayit", en: "/sign-up" },
    // Plan 9: one page for both steps (no token: request a link; with ?token=: set a new password).
    "/reset-password": { tr: "/sifre-sifirla", en: "/reset-password" },
    "/dashboard": { tr: "/panel", en: "/dashboard" },
    "/dashboard/templates": { tr: "/panel/sablonlarim", en: "/dashboard/templates" },
    "/template-editor/new": { tr: "/sablon-editoru/yeni", en: "/template-editor/new" },
    "/template-editor/[id]": { tr: "/sablon-editoru/[id]", en: "/template-editor/[id]" },
    "/resume/[id]": { tr: "/cv/[id]", en: "/resume/[id]" },
    "/account": { tr: "/hesap", en: "/account" },
    // Opened only by the server's headless browser to make the PDF (not linked, not indexed).
    "/print": "/print",
    // Admin is not indexed and English for both locales.
    "/admin": "/admin",
    "/admin/sign-in": "/admin/sign-in",
    "/admin/two-factor": "/admin/two-factor",
    "/admin/pages": "/admin/pages",
    "/admin/pages/[id]": "/admin/pages/[id]",
    "/admin/preview": "/admin/preview",
    "/admin/settings": "/admin/settings",
    "/admin/audit-log": "/admin/audit-log",
    "/admin/users": "/admin/users",
    "/admin/users/new": "/admin/users/new",
    "/admin/users/[id]": "/admin/users/[id]",
    "/admin/faqs": "/admin/faqs",
    "/admin/faqs/new": "/admin/faqs/new",
    "/admin/faqs/[id]": "/admin/faqs/[id]",
    "/admin/media": "/admin/media",
    "/admin/templates": "/admin/templates",
    "/admin/reviews": "/admin/reviews",
    "/admin/examples": "/admin/examples",
    "/admin/examples/new": "/admin/examples/new",
    "/admin/examples/[id]": "/admin/examples/[id]",
    "/admin/examples/[id]/preview": "/admin/examples/[id]/preview",
    "/admin/example-editor/[id]": "/admin/example-editor/[id]",
  },
});

export type Locale = (typeof routing.locales)[number];
export type RoutePath = keyof typeof routing.pathnames;
