import { z } from "zod";
import { normalizeResume } from "./schema";

const field = z.string().max(8000);
export const draftSchema = z.object({
  personal: z.object({ name: field, title: field, email: field, phone: field, location: field }).strict(),
  summary: field,
  experience: z.array(z.object({ position: field, company: field, start: field, end: field, current: z.boolean(), description: field }).strict()).max(25),
  education: z.array(z.object({ school: field, field: field, degree: field, start: field, end: field }).strict()).max(15),
  skills: z.array(z.object({ category: field, items: field }).strict()).max(20),
  languages: z.array(z.object({ language: field, level: field }).strict()).max(15),
}).strict();
export function draftToResume(raw: unknown, locale: string) {
  const draft = draftSchema.parse(raw);
  return normalizeResume({ ...draft, settings: { locale, showPhoto: false, template: "ats" } });
}
