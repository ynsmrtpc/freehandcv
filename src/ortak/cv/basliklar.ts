// CV dilindeki sabit metinler (plan 8.2). Arayüz dilinden bağımsızdır: arayüzü Türkçe olan biri
// Almanca CV hazırlayabilir. CV dili listesi arayüz dillerinden geniştir; yalnız başlıklar çevrilir.
import type { BolumKimligi } from "./sema";

type CvMetinleri = {
  ad: string;
  basliklar: Record<BolumKimligi | "iletisim", string>;
  gunumuz: string;
  notOrtalamasi: string;
  adSoyad: string;
  rtl?: boolean;
};

export const CV_DILLERI: Record<string, CvMetinleri> = {
  tr: {
    ad: "Türkçe",
    basliklar: {
      ozet: "Profesyonel Özet",
      deneyim: "İş Deneyimi",
      projeler: "Projeler",
      yetenekler: "Yetkinlikler",
      egitim: "Eğitim",
      sertifikalar: "Sertifikalar",
      diller: "Yabancı Diller",
      referanslar: "Referanslar",
      ilgi: "İlgi Alanları",
      iletisim: "İletişim",
    },
    gunumuz: "Günümüz",
    notOrtalamasi: "GNO",
    adSoyad: "Ad Soyad",
  },
  en: {
    ad: "English",
    basliklar: {
      ozet: "Summary",
      deneyim: "Experience",
      projeler: "Projects",
      yetenekler: "Skills",
      egitim: "Education",
      sertifikalar: "Certifications",
      diller: "Languages",
      referanslar: "References",
      ilgi: "Interests",
      iletisim: "Contact",
    },
    gunumuz: "Present",
    notOrtalamasi: "GPA",
    adSoyad: "Full Name",
  },
  de: {
    ad: "Deutsch",
    basliklar: {
      ozet: "Profil",
      deneyim: "Berufserfahrung",
      projeler: "Projekte",
      yetenekler: "Kenntnisse",
      egitim: "Ausbildung",
      sertifikalar: "Zertifikate",
      diller: "Sprachen",
      referanslar: "Referenzen",
      ilgi: "Interessen",
      iletisim: "Kontakt",
    },
    gunumuz: "heute",
    notOrtalamasi: "Note",
    adSoyad: "Vorname Nachname",
  },
  fr: {
    ad: "Français",
    basliklar: {
      ozet: "Profil",
      deneyim: "Expérience professionnelle",
      projeler: "Projets",
      yetenekler: "Compétences",
      egitim: "Formation",
      sertifikalar: "Certifications",
      diller: "Langues",
      referanslar: "Références",
      ilgi: "Centres d’intérêt",
      iletisim: "Contact",
    },
    gunumuz: "aujourd’hui",
    notOrtalamasi: "Moyenne",
    adSoyad: "Prénom Nom",
  },
  es: {
    ad: "Español",
    basliklar: {
      ozet: "Perfil profesional",
      deneyim: "Experiencia laboral",
      projeler: "Proyectos",
      yetenekler: "Habilidades",
      egitim: "Educación",
      sertifikalar: "Certificaciones",
      diller: "Idiomas",
      referanslar: "Referencias",
      ilgi: "Intereses",
      iletisim: "Contacto",
    },
    gunumuz: "Actualidad",
    notOrtalamasi: "Promedio",
    adSoyad: "Nombre Apellido",
  },
};

export function cvMetinleri(dil: string): CvMetinleri {
  return CV_DILLERI[dil] ?? CV_DILLERI.en;
}
