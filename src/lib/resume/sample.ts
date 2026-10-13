// Example resume shown when the editor first opens — a fictional person. No real people or companies.
import { normalizeResume, type ResumeData } from "./schema";

const tr = {
  settings: { template: "modern", color: "#1f3a5f", showPhoto: false, locale: "tr", hiddenSections: ["references"] },
  personal: {
    name: "Deniz Aksoy",
    title: "Kıdemli Frontend Geliştirici",
    email: "deniz.aksoy@ornek.com",
    phone: "0500 000 00 00",
    location: "Kadıköy, İstanbul",
    linkedin: "linkedin.com/in/denizaksoy",
    github: "github.com/denizaksoy",
    extras: [{ label: "Askerlik", value: "Muaf" }],
  },
  summary:
    "6 yıllık deneyime sahip frontend geliştiriciyim. E-ticaret ve finans alanlarında milyonlarca kullanıcıya ulaşan React ve Next.js uygulamaları geliştirdim. Performans, erişilebilirlik ve tasarım sistemleri konusunda ekip içinde sorumluluk alıyor; ürün ve tasarım ekipleriyle yakın çalışarak ölçülebilir sonuç üreten arayüzler geliştirmeyi hedefliyorum.",
  experience: [
    {
      id: "o1",
      position: "Kıdemli Frontend Geliştirici",
      company: "Örnek Teknoloji A.Ş.",
      location: "İstanbul",
      start: "Mar 2023",
      current: true,
      bullets: [
        "Ödeme akışını yeniden tasarlayarak sepet terk oranını **%18** düşürdüm.",
        "Ortak tasarım sistemini (60+ bileşen) kurdum; yeni ekran geliştirme süresi yaklaşık **%40** kısaldı.",
        "Core Web Vitals iyileştirmeleriyle LCP değerini 3,8 sn'den **1,9 sn**'ye indirdim.",
        "3 kişilik ekibe teknik mentorluk ve kod incelemesi yaptım.",
      ].join("\n"),
    },
    {
      id: "o2",
      position: "Frontend Geliştirici",
      company: "Deneme Yazılım Ltd.",
      location: "İstanbul",
      start: "Tem 2020",
      end: "Şub 2023",
      bullets: [
        "Bankacılık müşteri paneli için React ve TypeScript ile 25+ ekran geliştirdim.",
        "Birim test kapsamını %20'den %75'e çıkardım (Jest, Testing Library).",
      ].join("\n"),
    },
  ],
  projects: [
    {
      id: "o3",
      name: "Açık Kaynak Takvim Bileşeni",
      role: "Geliştirici",
      start: "2022",
      end: "2023",
      technologies: "React, TypeScript, Storybook",
      link: "github.com/denizaksoy/takvim",
      description: "Erişilebilir, klavyeyle kullanılabilen tarih seçici; haftalık 4 bin indirme.",
    },
  ],
  skills: [
    { id: "o4", category: "Diller", items: "TypeScript, JavaScript, HTML, CSS" },
    { id: "o5", category: "Kütüphaneler", items: "React, Next.js, Redux Toolkit, TanStack Query, Tailwind CSS" },
    { id: "o6", category: "Test ve Araçlar", items: "Jest, Playwright, Storybook, Git, Figma" },
  ],
  education: [
    {
      id: "o7",
      school: "Örnek Üniversitesi",
      field: "Bilgisayar Mühendisliği",
      degree: "Lisans",
      start: "2016",
      end: "2020",
      gpa: "3,10 / 4,00",
    },
  ],
  certifications: [{ id: "o8", name: "Professional Scrum Master I", issuer: "Scrum.org", date: "2024" }],
  languages: [
    { id: "o9", language: "İngilizce", level: "C1 – İleri" },
    { id: "o10", language: "Almanca", level: "A2 – Başlangıç" },
  ],
  references: [{ id: "o11", name: "Referanslar talep üzerine iletilecektir." }],
  interests: "Fotoğrafçılık, koşu, açık kaynak katkısı",
};

const en = {
  settings: { template: "modern", color: "#1f3a5f", showPhoto: false, locale: "en", hiddenSections: ["references"] },
  personal: {
    name: "Alex Morgan",
    title: "Senior Frontend Engineer",
    email: "alex.morgan@example.com",
    phone: "+44 7700 900000",
    location: "London, UK",
    linkedin: "linkedin.com/in/alexmorgan",
    github: "github.com/alexmorgan",
  },
  summary:
    "Frontend engineer with 6 years of experience building React and Next.js applications used by millions in e-commerce and fintech. I own performance, accessibility and design-system work on my team, and partner closely with product and design to ship interfaces with measurable impact.",
  experience: [
    {
      id: "e1",
      position: "Senior Frontend Engineer",
      company: "Example Tech Ltd.",
      location: "London",
      start: "Mar 2023",
      current: true,
      bullets: [
        "Redesigned the checkout flow, cutting cart abandonment by **18%**.",
        "Built the shared design system (60+ components), reducing new-screen build time by about **40%**.",
        "Brought LCP down from 3.8 s to **1.9 s** through Core Web Vitals work.",
        "Mentored a team of 3 engineers and led code reviews.",
      ].join("\n"),
    },
    {
      id: "e2",
      position: "Frontend Engineer",
      company: "Sample Software Co.",
      location: "Manchester",
      start: "Jul 2020",
      end: "Feb 2023",
      bullets: [
        "Delivered 25+ screens for a retail banking dashboard in React and TypeScript.",
        "Raised unit-test coverage from 20% to 75% (Jest, Testing Library).",
      ].join("\n"),
    },
  ],
  projects: [
    {
      id: "e3",
      name: "Open-source Date Picker",
      role: "Maintainer",
      start: "2022",
      end: "2023",
      technologies: "React, TypeScript, Storybook",
      link: "github.com/alexmorgan/datepicker",
      description: "Accessible, keyboard-friendly date picker; 4k weekly downloads.",
    },
  ],
  skills: [
    { id: "e4", category: "Languages", items: "TypeScript, JavaScript, HTML, CSS" },
    { id: "e5", category: "Libraries", items: "React, Next.js, Redux Toolkit, TanStack Query, Tailwind CSS" },
    { id: "e6", category: "Testing & Tools", items: "Jest, Playwright, Storybook, Git, Figma" },
  ],
  education: [
    { id: "e7", school: "Example University", field: "Computer Science", degree: "BSc", start: "2016", end: "2020" },
  ],
  certifications: [{ id: "e8", name: "Professional Scrum Master I", issuer: "Scrum.org", date: "2024" }],
  languages: [
    { id: "e9", language: "English", level: "Native" },
    { id: "e10", language: "Spanish", level: "B2" },
  ],
  references: [{ id: "e11", name: "Available on request." }],
  interests: "Photography, running, open-source contributions",
};

export function sampleResume(locale: string): ResumeData {
  return normalizeResume(locale === "tr" ? tr : en);
}
