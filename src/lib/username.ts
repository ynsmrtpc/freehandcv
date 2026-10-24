// Usernames (plan 5, 11.2): shown as @username on public templates and in /kullanici/[username].
// Shared by the account form (instant feedback) and the server (the rule that counts).

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;

/** Lowercase ASCII letters, digits, "-" and "_"; starts with a letter, no doubled or trailing separators. */
const PATTERN = /^[a-z](?:[a-z0-9]|[-_](?=[a-z0-9]))*$/;

/** Names that could pass for the site itself or collide with site words. */
const RESERVED = new Set([
  "admin",
  "administrator",
  "yonetici",
  "yonetim",
  "root",
  "system",
  "sistem",
  "support",
  "destek",
  "help",
  "yardim",
  "freehand",
  "freehandcv",
  "official",
  "resmi",
  "moderator",
  "staff",
  "team",
  "ekip",
  "api",
  "www",
  "mail",
  "panel",
  "dashboard",
  "account",
  "hesap",
  "settings",
  "ayarlar",
  "null",
  "undefined",
  "anonymous",
  "anonim",
]);

export type UsernameProblem = "length" | "format" | "reserved";

/** Lowercases and trims; the stored form is always the normalized one. */
export function normalizeUsername(raw: string) {
  return raw.trim().toLowerCase();
}

export function usernameProblem(username: string): UsernameProblem | null {
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) return "length";
  if (!PATTERN.test(username)) return "format";
  if (RESERVED.has(username) || RESERVED.has(username.replace(/[-_]/g, ""))) return "reserved";
  return null;
}
