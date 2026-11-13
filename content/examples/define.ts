// Draft example resumes kept in the repository (plan 6.2, 6.4). `bun run content:seed-examples` adds the
// ones missing from the database as inactive; an admin reviews and publishes them in the panel.
// Rules for writers:
// - Fictional people only: no real names, companies, schools' staff or contact details.
//   E-mail at ornek.com / example.com, phone 0500 000 00 00, LinkedIn handles made up.
// - Written for the market (plan 8.3): Turkish examples follow Turkish hiring conventions
//   (military status for men where relevant, KPSS/ALES/YDS, SGK, Turkish universities by name is fine).
// - Bullets start with a verb and carry a number or concrete result where honest; **bold** the result.
// - Guide: 400–800 words in total (intro + sections), specific to the occupation, no filler.
import type { ExampleCategoryId, ExampleGuide, ExperienceLevel } from "@/lib/examples";
import type { ResumeData } from "@/lib/resume/schema";

type DeepPartial<T> = T extends (infer U)[] ? DeepPartial<U>[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export type ExampleDraft = {
  /** URL slug: Turkish ends in "-cv-ornegi" (e.g. "hemsire-cv-ornegi"). Never changes after publishing. */
  slug: string;
  /** Page h1, e.g. "Hemşire CV Örneği". */
  title: string;
  /** e.g. "Hemşire" — used in "Hemşire CV'si yazarken". */
  occupation: string;
  category: ExampleCategoryId;
  experienceLevel: ExperienceLevel;
  /** ≤ 60 characters. */
  metaTitle: string;
  /** ≤ 155 characters. */
  metaDescription: string;
  guide: ExampleGuide;
  /** Normalized by the seed script; ids are filled in when missing. */
  content: DeepPartial<ResumeData>;
};

export const defineExample = (draft: ExampleDraft) => draft;
