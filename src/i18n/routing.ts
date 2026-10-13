import { defineRouting } from "next-intl/routing";

// Plan bölüm 6.2 ve 8.3: Türkçe kökte (öneksiz), diğer diller kendi önekiyle.
// Yol parçaları o dilin gerçek aramasına göre yazılır. URL'ler yayından sonra değişmez.
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  // Otomatik yönlendirme yok; tarayıcı diline göre yalnızca öneri çubuğu gösterilir (8.3).
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/cv-olustur": { tr: "/cv-olustur", en: "/create-resume" },
    "/cv-ornekleri": { tr: "/cv-ornekleri", en: "/resume-examples" },
    "/cv-ornekleri/[slug]": {
      tr: "/cv-ornekleri/[slug]",
      en: "/resume-examples/[slug]",
    },
    "/cv-sablonlari": { tr: "/cv-sablonlari", en: "/resume-templates" },
    "/cv-sablonlari/[slug]": {
      tr: "/cv-sablonlari/[slug]",
      en: "/resume-templates/[slug]",
    },
    "/rehber/[konu]": { tr: "/rehber/[konu]", en: "/guides/[konu]" },
    "/ucretsiz-mi": { tr: "/ucretsiz-mi", en: "/is-it-free" },
    "/destek": { tr: "/destek", en: "/support" },
    "/yonetim": "/yonetim",
    "/yonetim/giris": "/yonetim/giris",
    "/yonetim/iki-adim": "/yonetim/iki-adim",
    "/yonetim/sayfalar": "/yonetim/sayfalar",
    "/yonetim/sayfalar/[id]": "/yonetim/sayfalar/[id]",
    "/yonetim/onizleme": "/yonetim/onizleme",
    "/yonetim/site-ayarlari": "/yonetim/site-ayarlari",
    "/yonetim/gunluk": "/yonetim/gunluk",
  },
});

export type Dil = (typeof routing.locales)[number];
export type Yol = keyof typeof routing.pathnames;
