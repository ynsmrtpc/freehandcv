// Sabit URL'li, içeriği yönetim panelinden gelen sayfalar (plan 6.2, 7.3). URL kodda sabittir;
// veritabanındaki slug iç anahtardır ve tüm dillerde aynıdır.
export const CMS_SAYFALARI = [
  { href: "/ucretsiz-mi", slug: "ucretsiz-mi" },
  { href: "/destek", slug: "destek" },
  { href: "/gizlilik", slug: "gizlilik" },
] as const;
export type CmsSayfaHref = (typeof CMS_SAYFALARI)[number]["href"];
