// Single source of truth for resume data (plan section 10).
// Used by both the client (editor, localStorage) and the server (Server Actions, example resumes).
// The schema is lenient: missing or broken fields fall back to defaults, so old files and
// hand-edited JSON still open. Legacy Turkish-keyed data is converted first (see legacy.ts).
import { z } from "zod";
import { migrateLegacyResume } from "./legacy";

export const RESUME_SCHEMA_VERSION = 1;

export const SECTIONS = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "languages",
  "references",
  "interests",
] as const;
export type SectionId = (typeof SECTIONS)[number];

export const LIST_SECTIONS = [
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "languages",
  "references",
] as const;
export type ListSection = (typeof LIST_SECTIONS)[number];

export const TEMPLATE_IDS = [
  "modern",
  "ats",
  "elegant",
  "technical",
  "sidebar",
  "corporate",
  "two-column",
  "contrast",
  "swiss",
  "academic",
  "timeline",
  "creative",
  "startup",
  "airy",
  "graduate",
  "light-sidebar",
  "editorial",
  "boutique",
  "compact",
  "formal",
  "classic",
  "minimal",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export const SIZES = ["small", "medium", "large"] as const;
export const SPACINGS = ["compact", "normal", "relaxed"] as const;
export const PAPERS = ["A4", "Letter"] as const;
export type Paper = (typeof PAPERS)[number];

const text = z.string().catch("");
const flag = z.boolean().catch(false);
const entryId = z.string().min(1).catch(() => newId());

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

const entryBase = { id: entryId, hidden: flag.optional() };

export const experienceSchema = z.object({
  ...entryBase,
  position: text.default(""),
  company: text.default(""),
  location: text.default(""),
  start: text.default(""),
  end: text.default(""),
  current: flag.default(false),
  description: text.default(""),
  bullets: text.default(""),
});

export const projectSchema = z.object({
  ...entryBase,
  name: text.default(""),
  role: text.default(""),
  start: text.default(""),
  end: text.default(""),
  technologies: text.default(""),
  link: text.default(""),
  description: text.default(""),
  bullets: text.default(""),
});

export const skillSchema = z.object({
  ...entryBase,
  category: text.default(""),
  items: text.default(""),
});

export const educationSchema = z.object({
  ...entryBase,
  school: text.default(""),
  field: text.default(""),
  degree: text.default(""),
  start: text.default(""),
  end: text.default(""),
  gpa: text.default(""),
  location: text.default(""),
  description: text.default(""),
});

export const certificationSchema = z.object({
  ...entryBase,
  name: text.default(""),
  issuer: text.default(""),
  date: text.default(""),
  link: text.default(""),
});

export const languageSchema = z.object({
  ...entryBase,
  language: text.default(""),
  level: text.default(""),
});

export const referenceSchema = z.object({
  ...entryBase,
  name: text.default(""),
  title: text.default(""),
  company: text.default(""),
  phone: text.default(""),
  email: text.default(""),
});

const list = <T extends z.ZodType>(s: T) => z.array(s).catch([]).default([]);

export const settingsSchema = z.object({
  template: z.enum(TEMPLATE_IDS).catch("modern").default("modern"),
  color: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .catch("#1f3a5f")
    .default("#1f3a5f"),
  /** Empty = the template's font. */
  font: text.default(""),
  size: z.enum(SIZES).catch("medium").default("medium"),
  spacing: z.enum(SPACINGS).catch("normal").default("normal"),
  showPhoto: z.boolean().catch(true).default(true),
  /** Resume language (section titles, "Present"). Independent of the UI locale (plan 8.2). */
  locale: z.string().min(2).max(10).catch("tr").default("tr"),
  paper: z.enum(PAPERS).catch("A4").default("A4"),
  sectionOrder: z
    .array(z.string())
    .catch([])
    .default([])
    .transform((l) => {
      const valid = l.filter((s): s is SectionId => (SECTIONS as readonly string[]).includes(s));
      const unique = [...new Set(valid)];
      return [...unique, ...SECTIONS.filter((s) => !unique.includes(s))];
    }),
  hiddenSections: z
    .array(z.enum(SECTIONS))
    .catch([])
    .default([]),
  sectionTitles: z.record(z.string(), z.string()).catch({}).default({}),
});

export const personalSchema = z.object({
  name: text.default(""),
  title: text.default(""),
  email: text.default(""),
  phone: text.default(""),
  location: text.default(""),
  linkedin: text.default(""),
  github: text.default(""),
  web: text.default(""),
  /** Guest mode: a data URL; with an account: a signed URL derived from the R2 key (phase 2). */
  photo: text.default(""),
  extras: z
    .array(z.object({ label: text.default(""), value: text.default("") }))
    .catch([])
    .default([]),
});

export const resumeSchema = z.object({
  version: z.number().catch(RESUME_SCHEMA_VERSION).default(RESUME_SCHEMA_VERSION),
  settings: settingsSchema.catch(() => settingsSchema.parse({})).default(() => settingsSchema.parse({})),
  personal: personalSchema.catch(() => personalSchema.parse({})).default(() => personalSchema.parse({})),
  summary: text.default(""),
  experience: list(experienceSchema),
  projects: list(projectSchema),
  skills: list(skillSchema),
  education: list(educationSchema),
  certifications: list(certificationSchema),
  languages: list(languageSchema),
  references: list(referenceSchema),
  interests: text.default(""),
});

export type ResumeData = z.infer<typeof resumeSchema>;
export type ResumeSettings = ResumeData["settings"];
export type Personal = ResumeData["personal"];
export type Entry<S extends ListSection> = ResumeData[S][number];

/** Turns any input into valid resume data; never throws. */
export function normalizeResume(input: unknown): ResumeData {
  const data = migrateLegacyResume(input);
  return resumeSchema.parse(data && typeof data === "object" ? data : {});
}

export function emptyResume(locale = "tr"): ResumeData {
  return normalizeResume({ settings: { locale } });
}

/** A new empty entry; the field list comes from the schema. */
export function emptyEntry<S extends ListSection>(section: S): Entry<S> {
  const schemas = {
    experience: experienceSchema,
    projects: projectSchema,
    skills: skillSchema,
    education: educationSchema,
    certifications: certificationSchema,
    languages: languageSchema,
    references: referenceSchema,
  } as const;
  return schemas[section].parse({ id: newId() }) as Entry<S>;
}
