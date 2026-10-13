// Pages with fixed URLs whose content comes from the admin panel (plan 6.2, 7.3). The URL is fixed
// in code; the database slug is an internal key, identical across locales.
export const CMS_PAGES = [
  { href: "/is-it-free", slug: "is-it-free" },
  { href: "/support", slug: "support" },
  { href: "/privacy", slug: "privacy" },
] as const;
export type CmsPageHref = (typeof CMS_PAGES)[number]["href"];
