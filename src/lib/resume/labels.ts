// Fixed text in the resume language (plan 8.2). Independent of the UI locale: someone with a Turkish UI
// can write a German resume. The resume locale list is wider than the UI locales; only labels are translated.
import type { SectionId } from "./schema";

type ResumeLabels = {
  name: string;
  sectionTitles: Record<SectionId | "contact", string>;
  present: string;
  gpa: string;
  fullName: string;
  rtl?: boolean;
};

export const RESUME_LOCALES: Record<string, ResumeLabels> = {
  tr: {
    name: "Türkçe",
    sectionTitles: {
      summary: "Profesyonel Özet",
      experience: "İş Deneyimi",
      projects: "Projeler",
      skills: "Yetkinlikler",
      education: "Eğitim",
      certifications: "Sertifikalar",
      languages: "Yabancı Diller",
      references: "Referanslar",
      interests: "İlgi Alanları",
      contact: "İletişim",
    },
    present: "Günümüz",
    gpa: "GNO",
    fullName: "Ad Soyad",
  },
  en: {
    name: "English",
    sectionTitles: {
      summary: "Summary",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      certifications: "Certifications",
      languages: "Languages",
      references: "References",
      interests: "Interests",
      contact: "Contact",
    },
    present: "Present",
    gpa: "GPA",
    fullName: "Full Name",
  },
  de: {
    name: "Deutsch",
    sectionTitles: {
      summary: "Profil",
      experience: "Berufserfahrung",
      projects: "Projekte",
      skills: "Kenntnisse",
      education: "Ausbildung",
      certifications: "Zertifikate",
      languages: "Sprachen",
      references: "Referenzen",
      interests: "Interessen",
      contact: "Kontakt",
    },
    present: "heute",
    gpa: "Note",
    fullName: "Vorname Nachname",
  },
  fr: {
    name: "Français",
    sectionTitles: {
      summary: "Profil",
      experience: "Expérience professionnelle",
      projects: "Projets",
      skills: "Compétences",
      education: "Formation",
      certifications: "Certifications",
      languages: "Langues",
      references: "Références",
      interests: "Centres d’intérêt",
      contact: "Contact",
    },
    present: "aujourd’hui",
    gpa: "Moyenne",
    fullName: "Prénom Nom",
  },
  es: {
    name: "Español",
    sectionTitles: {
      summary: "Perfil profesional",
      experience: "Experiencia laboral",
      projects: "Proyectos",
      skills: "Habilidades",
      education: "Educación",
      certifications: "Certificaciones",
      languages: "Idiomas",
      references: "Referencias",
      interests: "Intereses",
      contact: "Contacto",
    },
    present: "Actualidad",
    gpa: "Promedio",
    fullName: "Nombre Apellido",
  },
};

export function resumeLabels(locale: string): ResumeLabels {
  return RESUME_LOCALES[locale] ?? RESUME_LOCALES.en;
}
