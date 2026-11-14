import { emptyEntry, emptyResume, type ResumeData } from "./schema";

const normalize = (text: string) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").toLowerCase().trim();
const headings: Record<string, string> = { summary: "summary", profile: "summary", ozet: "summary", hakkimda: "summary", experience: "experience", "work experience": "experience", deneyim: "experience", "is deneyimi": "experience", education: "education", egitim: "education", skills: "skills", beceriler: "skills", yetenekler: "skills", languages: "languages", diller: "languages", projects: "projects", projeler: "projects" };

/** Conservative mapping: unknown job dates/employers stay blank for the person's review. */
export function resumeFromText(text: string, locale: string) {
  if (text.length > 50_000) throw new Error("too_large");
  const data = emptyResume(locale), lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  data.personal.email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
  const phone = text.match(/(?:tel(?:efon)?|phone|mobile)\s*:?\s*([+\d][\d ()-]{7,}\d)/i)?.[1] ?? text.match(/\+\d{1,3}[ ()-]*\d[\d ()-]{8,}\d/)?.[0];
  if (phone && phone.replace(/\D/g, "").length >= 10) data.personal.phone = phone.trim();
  const first = lines[0] ?? "";
  if (first.split(/\s+/).length >= 2 && first.split(/\s+/).length <= 6 && !/[\d@]/.test(first) && !/resume|curriculum|ozgecmis|profile/i.test(normalize(first))) data.personal.name = first;
  const sections: Record<string, string[]> = {};
  let current = "unmapped";
  for (const line of lines.slice(data.personal.name ? 1 : 0)) {
    const heading = headings[normalize(line.replace(/:$/, ""))];
    if (heading) { current = heading; continue; }
    (sections[current] ??= []).push(line);
  }
  data.summary = (sections.summary ?? sections.unmapped ?? []).join("\n");
  if (sections.experience?.length) data.experience.push({ ...emptyEntry("experience"), description: sections.experience.join("\n") });
  if (sections.education?.length) data.education.push({ ...emptyEntry("education"), description: sections.education.join("\n") });
  if (sections.skills?.length) data.skills.push({ ...emptyEntry("skills"), items: sections.skills.join(", ") });
  if (sections.languages?.length) data.languages = sections.languages.map((language) => ({ ...emptyEntry("languages"), language }));
  if (sections.projects?.length) data.projects.push({ ...emptyEntry("projects"), description: sections.projects.join("\n") });
  return data;
}
/** RFC 4180 quoting, including commas, escaped quotes and line breaks inside fields. */
export function parseCsv(text: string) {
  if (text.length > 500_000) throw new Error("too_large");
  const rows: string[][] = []; let row: string[] = [], value = "", quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') { if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted; }
    else if (char === "," && !quoted) { row.push(value); value = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(value); if (row.some(Boolean)) rows.push(row); row = []; value = "";
    } else value += char;
    if (rows.length > 1000 || row.length > 100) throw new Error("too_large");
  }
  if (quoted) throw new Error("invalid_file");
  row.push(value); if (row.some(Boolean)) rows.push(row);
  const [headers, ...values] = rows;
  if (!headers) throw new Error("invalid_file");
  return values.map((fields) => Object.fromEntries(headers.map((header, index) => [header.trim(), fields[index]?.trim() ?? ""])));
}
export function mergeLinkedInCsv(data: ResumeData, text: string) {
  const rows = parseCsv(text), next = structuredClone(data);
  if (!rows.length) return next;
  const first = rows[0];
  if ("First Name" in first) {
    next.personal.name = [first["First Name"], first["Last Name"]].filter(Boolean).join(" ");
    next.personal.title = first.Headline ?? ""; next.personal.location = first["Geo Location"] ?? "";
    next.summary = first.Summary ?? next.summary;
  } else if ("Company Name" in first && "Title" in first) next.experience.push(...rows.map((row) => ({ ...emptyEntry("experience"), position: row.Title, company: row["Company Name"], start: row["Started On"] ?? "", end: row["Finished On"] ?? "", current: !row["Finished On"], description: row.Description ?? "" })));
  else if ("School Name" in first) next.education.push(...rows.map((row) => ({ ...emptyEntry("education"), school: row["School Name"], degree: row["Degree Name"] ?? "", field: row["Field Of Study"] ?? "", start: row["Start Date"] ?? "", end: row["End Date"] ?? "", description: row.Notes ?? "" })));
  else if ("Name" in first && "Proficiency" in first) next.languages.push(...rows.map((row) => ({ ...emptyEntry("languages"), language: row.Name, level: row.Proficiency })));
  else if ("Name" in first && Object.keys(first).length === 1) next.skills.push({ ...emptyEntry("skills"), items: rows.map((row) => row.Name).join(", ") });
  else throw new Error("unsupported_csv");
  return next;
}
