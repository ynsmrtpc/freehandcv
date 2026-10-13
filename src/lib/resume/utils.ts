// Pure helpers for resume text (client + server).

/** Splits multi-line text into bullets; leading "-", "•", "*" markers are dropped. */
export function lines(s: string): string[] {
  return String(s || "")
    .split(/\r?\n/)
    .map((t) => t.replace(/^\s*[-•*–]\s+/, "").trim())
    .filter(Boolean);
}

/** Paragraphs separated by blank lines or line breaks. */
export function paragraphs(s: string): string[] {
  return String(s || "")
    .split(/\n\s*\n|\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Splits **bold**-marked text into parts; produces no HTML (no XSS). */
export function richTextParts(s: string): { text: string; bold: boolean }[] {
  return String(s || "")
    .split(/(\*\*[^*]+?\*\*)/g)
    .filter(Boolean)
    .map((p) =>
      p.startsWith("**") && p.endsWith("**") && p.length > 4
        ? { text: p.slice(2, -2), bold: true }
        : { text: p, bold: false },
    );
}

export function dateRange(start: string, end: string, current: boolean, present: string) {
  const last = current ? present : end || "";
  if (start && last) return `${start} – ${last}`;
  return start || last || "";
}

/** Turns a user-typed link into a clickable URL. Safe schemes only. */
export function safeUrl(value: string): string {
  const v = String(value || "").trim();
  if (!v) return "";
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return ""; // javascript:, data: etc. are rejected
  return "https://" + v;
}

export function linkText(value: string) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

export function commaList(s: string): string[] {
  return String(s || "")
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

const TURKISH_TO_ASCII: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "C", Ğ: "G", İ: "I", Ö: "O", Ş: "S", Ü: "U" };

/** "Elif Yılmaz" → "Elif_Yilmaz_CV" (suggested PDF/JSON file name). */
export function fileName(name: string, extension = "") {
  const clean =
    (name || "CV")
      .trim()
      .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => TURKISH_TO_ASCII[c])
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\w]+/g, "_")
      .replace(/^_|_$/g, "") || "CV";
  return `${clean}_CV${extension ? "." + extension : ""}`;
}

/** WCAG relative luminance and contrast ratio against white (for coloured areas). */
export function whiteContrast(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return 21;
  const n = parseInt(m[1], 16);
  const l = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    })
    .reduce((t, c, i) => t + c * [0.2126, 0.7152, 0.0722][i], 0);
  return 1.05 / (l + 0.05);
}
