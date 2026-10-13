// Resume checks (plan section 10): a pure function. Produces no text; every result returns a key and
// values, and the UI shows them in the user's language (messages: Checks.*).
import type { ResumeData } from "./schema";
import { SYSTEM_TEMPLATES, hasSidebar, hasWhiteTextOnAccent, type DesignDefinition } from "./design";
import { whiteContrast, lines } from "./utils";

export type CheckStatus = "good" | "warning" | "info";
export type CheckResult = {
  id: string;
  status: CheckStatus;
  /** Message key: Checks.<id>.<key> */
  key: string;
  values?: Record<string, string | number>;
};

export const SUMMARY_MIN = 250;
export const SUMMARY_MAX = 700;
export const BULLETS_MAX = 260;

export function runChecks(v: ResumeData, definition: DesignDefinition, pageCount: number): CheckResult[] {
  const c: CheckResult[] = [];
  const add = (id: string, status: CheckStatus, key: string, values?: CheckResult["values"]) =>
    c.push({ id, status, key, values });
  const p = v.personal;
  const isHidden = (s: string) => v.settings.hiddenSections.includes(s as never);
  const visible = <T extends { hidden?: boolean }>(l: T[]) => l.filter((i) => !i.hidden);

  add("title", p.name && p.title ? "good" : "warning", p.title ? "present" : "absent");
  add("contact", p.email && p.phone ? "good" : "warning", p.email && p.phone ? "present" : "absent");
  add("profile", p.linkedin || p.github || p.web ? "good" : "warning", p.linkedin || p.github || p.web ? "present" : "absent");

  const n = v.summary.trim().length;
  if (!n || isHidden("summary")) add("summary", "warning", "absent");
  else if (n < SUMMARY_MIN) add("summary", "warning", "short", { n });
  else if (n > SUMMARY_MAX) add("summary", "warning", "long", { n });
  else add("summary", "good", "ideal", { n });

  const bullets = [...visible(v.experience), ...visible(v.projects)].flatMap((i) => lines(i.bullets));
  const ratio = bullets.length ? bullets.filter((b) => /\d/.test(b)).length / bullets.length : 0;
  const percent = Math.round(ratio * 100);
  if (!bullets.length) add("metrics", "warning", "absent");
  else add("metrics", ratio >= 0.3 ? "good" : "warning", ratio >= 0.3 ? "good" : "low", { percent });

  const tooLong = bullets.filter((b) => b.length > BULLETS_MAX).length;
  add("bulletLength", tooLong ? "warning" : "good", tooLong ? "long" : "good", { n: tooLong, limit: BULLETS_MAX });

  const undated =
    visible(v.experience).filter((i) => !i.start).length +
    visible(v.education).filter((i) => !i.start && !i.end).length;
  add("dates", undated ? "warning" : "good", undated ? "incomplete" : "complete", { n: undated });

  const hasSkills = visible(v.skills).length > 0 && !isHidden("skills");
  add("skills", hasSkills ? "good" : "warning", hasSkills ? "present" : "absent");

  add("length", pageCount <= 2 ? "good" : "warning", pageCount <= 2 ? "good" : "long", { n: pageCount });

  // Turkish ID number (11 digits, not starting with 0) or sensitive extra-field labels (plan 13: KVKK).
  const text = JSON.stringify({ ...v, personal: { ...p, photo: "" } }).replace(/0\d{10}/g, "");
  const sensitive =
    /\b[1-9]\d{10}\b/.test(text) ||
    p.extras.some((e) => /(t\.?c\.?|kimlik|medeni|doğum|dogum|uyruk|din|marital|birth)/i.test(e.label));
  add("personalData", sensitive ? "warning" : "good", sensitive ? "present" : "absent");

  if (hasWhiteTextOnAccent(definition)) {
    const cr = whiteContrast(v.settings.color);
    add("contrast", cr >= 4.5 ? "good" : "warning", cr >= 4.5 ? "good" : "low", { ratio: cr.toFixed(1) });
  }

  const photoShown = v.settings.showPhoto && !!p.photo && definition.header.photo !== "none";
  add("photo", "info", photoShown ? "present" : "absent");

  const ats = atsScore(definition);
  add("ats", "info", ats === 5 ? "full" : "partial", { score: ats });
  return c;
}

/** 0–100; "info" results don't count toward the score. */
export function checkScore(results: CheckResult[]) {
  const scored = results.filter((r) => r.status !== "info");
  const passed = scored.filter((r) => r.status === "good").length;
  return { score: scored.length ? Math.round((passed / scored.length) * 100) : 0, passed, total: scored.length };
}

/**
 * Automatic ATS compatibility score (1–5, plan 11.4): template authors don't declare it.
 * System templates use the hand-assigned value; user templates are scored from the definition.
 */
export function atsScore(definition: DesignDefinition): number {
  const system = Object.values(SYSTEM_TEMPLATES).find((s) => s.definition === definition);
  if (system) return system.ats;
  let score = 5;
  if (hasSidebar(definition)) score -= 1;
  // A light band is only a background; a dark band with white text puts legibility at risk.
  if (definition.layout === "top-band" && definition.band !== "light") score -= 1;
  if (definition.skills !== "list") score -= 0.5;
  if (definition.typography.size < 9.5) score -= 0.5;
  // Layouts that move headings or dates into a separate column confuse some parsers' line order.
  if (definition.sectionLayout === "side" || definition.timeline) score -= 0.5;
  return Math.max(1, Math.round(score));
}
