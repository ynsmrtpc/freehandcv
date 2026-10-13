// Editörün ilk açılışta gösterdiği örnek CV — kurgusal kişi. Gerçek kişi ve şirket adı içermez.
import { cvNormalize, type CvVerisi } from "./sema";

const tr = {
  ayarlar: { sablon: "modern", renk: "#1f3a5f", foto: false, dil: "tr", gizli: ["referanslar"] },
  kisisel: {
    ad: "Deniz Aksoy",
    unvan: "Kıdemli Frontend Geliştirici",
    eposta: "deniz.aksoy@ornek.com",
    telefon: "0500 000 00 00",
    konum: "Kadıköy, İstanbul",
    linkedin: "linkedin.com/in/denizaksoy",
    github: "github.com/denizaksoy",
    ekler: [{ etiket: "Askerlik", deger: "Muaf" }],
  },
  ozet:
    "6 yıllık deneyime sahip frontend geliştiriciyim. E-ticaret ve finans alanlarında milyonlarca kullanıcıya ulaşan React ve Next.js uygulamaları geliştirdim. Performans, erişilebilirlik ve tasarım sistemleri konusunda ekip içinde sorumluluk alıyor; ürün ve tasarım ekipleriyle yakın çalışarak ölçülebilir sonuç üreten arayüzler geliştirmeyi hedefliyorum.",
  deneyim: [
    {
      id: "o1",
      pozisyon: "Kıdemli Frontend Geliştirici",
      kurum: "Örnek Teknoloji A.Ş.",
      konum: "İstanbul",
      baslangic: "Mar 2023",
      devam: true,
      maddeler: [
        "Ödeme akışını yeniden tasarlayarak sepet terk oranını **%18** düşürdüm.",
        "Ortak tasarım sistemini (60+ bileşen) kurdum; yeni ekran geliştirme süresi yaklaşık **%40** kısaldı.",
        "Core Web Vitals iyileştirmeleriyle LCP değerini 3,8 sn'den **1,9 sn**'ye indirdim.",
        "3 kişilik ekibe teknik mentorluk ve kod incelemesi yaptım.",
      ].join("\n"),
    },
    {
      id: "o2",
      pozisyon: "Frontend Geliştirici",
      kurum: "Deneme Yazılım Ltd.",
      konum: "İstanbul",
      baslangic: "Tem 2020",
      bitis: "Şub 2023",
      maddeler: [
        "Bankacılık müşteri paneli için React ve TypeScript ile 25+ ekran geliştirdim.",
        "Birim test kapsamını %20'den %75'e çıkardım (Jest, Testing Library).",
      ].join("\n"),
    },
  ],
  projeler: [
    {
      id: "o3",
      ad: "Açık Kaynak Takvim Bileşeni",
      rol: "Geliştirici",
      baslangic: "2022",
      bitis: "2023",
      teknolojiler: "React, TypeScript, Storybook",
      baglanti: "github.com/denizaksoy/takvim",
      aciklama: "Erişilebilir, klavyeyle kullanılabilen tarih seçici; haftalık 4 bin indirme.",
    },
  ],
  yetenekler: [
    { id: "o4", kategori: "Diller", liste: "TypeScript, JavaScript, HTML, CSS" },
    { id: "o5", kategori: "Kütüphaneler", liste: "React, Next.js, Redux Toolkit, TanStack Query, Tailwind CSS" },
    { id: "o6", kategori: "Test ve Araçlar", liste: "Jest, Playwright, Storybook, Git, Figma" },
  ],
  egitim: [
    {
      id: "o7",
      okul: "Örnek Üniversitesi",
      bolum: "Bilgisayar Mühendisliği",
      derece: "Lisans",
      baslangic: "2016",
      bitis: "2020",
      not: "3,10 / 4,00",
    },
  ],
  sertifikalar: [{ id: "o8", ad: "Professional Scrum Master I", kurum: "Scrum.org", tarih: "2024" }],
  diller: [
    { id: "o9", dil: "İngilizce", seviye: "C1 – İleri" },
    { id: "o10", dil: "Almanca", seviye: "A2 – Başlangıç" },
  ],
  referanslar: [{ id: "o11", ad: "Referanslar talep üzerine iletilecektir." }],
  ilgi: "Fotoğrafçılık, koşu, açık kaynak katkısı",
};

const en = {
  ayarlar: { sablon: "modern", renk: "#1f3a5f", foto: false, dil: "en", gizli: ["referanslar"] },
  kisisel: {
    ad: "Alex Morgan",
    unvan: "Senior Frontend Engineer",
    eposta: "alex.morgan@example.com",
    telefon: "+44 7700 900000",
    konum: "London, UK",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
  },
  ozet:
    "Frontend engineer with 6 years of experience building React and Next.js applications used by millions in e-commerce and fintech. I own performance, accessibility and design-system work on my team, and partner closely with product and design to ship interfaces with measurable impact.",
  deneyim: [
    {
      id: "e1",
      pozisyon: "Senior Frontend Engineer",
      kurum: "Example Tech Ltd.",
      konum: "London",
      baslangic: "Mar 2023",
      devam: true,
      maddeler: [
        "Redesigned the checkout flow, cutting cart abandonment by **18%**.",
        "Built the shared design system (60+ components), reducing new-screen build time by about **40%**.",
        "Brought LCP down from 3.8 s to **1.9 s** through Core Web Vitals work.",
        "Mentored a team of 3 engineers and led code reviews.",
      ].join("\n"),
    },
    {
      id: "e2",
      pozisyon: "Frontend Engineer",
      kurum: "Sample Software Co.",
      konum: "Manchester",
      baslangic: "Jul 2020",
      bitis: "Feb 2023",
      maddeler: [
        "Delivered 25+ screens for a retail banking dashboard in React and TypeScript.",
        "Raised unit-test coverage from 20% to 75% (Jest, Testing Library).",
      ].join("\n"),
    },
  ],
  projeler: [
    {
      id: "e3",
      ad: "Open-source Date Picker",
      rol: "Maintainer",
      baslangic: "2022",
      bitis: "2023",
      teknolojiler: "React, TypeScript, Storybook",
      baglanti: "github.com/alexmorgan/datepicker",
      aciklama: "Accessible, keyboard-friendly date picker; 4k weekly downloads.",
    },
  ],
  yetenekler: [
    { id: "e4", kategori: "Languages", liste: "TypeScript, JavaScript, HTML, CSS" },
    { id: "e5", kategori: "Libraries", liste: "React, Next.js, Redux Toolkit, TanStack Query, Tailwind CSS" },
    { id: "e6", kategori: "Testing & Tools", liste: "Jest, Playwright, Storybook, Git, Figma" },
  ],
  egitim: [
    { id: "e7", okul: "Example University", bolum: "Computer Science", derece: "BSc", baslangic: "2016", bitis: "2020" },
  ],
  sertifikalar: [{ id: "e8", ad: "Professional Scrum Master I", kurum: "Scrum.org", tarih: "2024" }],
  diller: [
    { id: "e9", dil: "English", seviye: "Native" },
    { id: "e10", dil: "Spanish", seviye: "B2" },
  ],
  referanslar: [{ id: "e11", ad: "Available on request." }],
  ilgi: "Photography, running, open-source contributions",
};

export function ornekCv(dil: string): CvVerisi {
  return cvNormalize(dil === "tr" ? tr : en);
}
