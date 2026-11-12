import "server-only";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { escapeHtml, sendEmail } from "./email";

/** Reset links stay valid for one hour (Better Auth's default, set explicitly in auth.ts). */
export const RESET_TOKEN_EXPIRES_IN_SECONDS = 60 * 60;

/**
 * The email's language: the user's saved interface language, otherwise the locale of the page the
 * request came from (the callback URL inside the link carries it), otherwise Turkish.
 */
export function resetEmailLocale(uiLocale: unknown, url: string): Locale {
  if (typeof uiLocale === "string" && hasLocale(routing.locales, uiLocale)) return uiLocale;
  try {
    const callback = new URL(url).searchParams.get("callbackURL") ?? "";
    const first = new URL(callback, "http://x").pathname.split("/")[1];
    if (first !== routing.defaultLocale && hasLocale(routing.locales, first)) return first;
  } catch {
    // Malformed URL: fall through to the default.
  }
  return routing.defaultLocale;
}

export async function sendPasswordResetEmail({
  user,
  url,
}: {
  user: { email: string; name?: string | null; uiLocale?: unknown };
  url: string;
}) {
  const locale = resetEmailLocale(user.uiLocale, url);
  const t = await getTranslations({ locale, namespace: "Email" });
  const name = user.name?.trim() ?? "";
  const greeting = name ? t("greetingName", { name }) : t("greeting");
  const hours = RESET_TOKEN_EXPIRES_IN_SECONDS / 3600;
  const lines = [t("resetIntro"), t("resetExpiry", { hours }), t("resetIgnore")];

  const text = [greeting, "", lines[0], "", url, "", lines[1], lines[2], "", t("signature")].join("\n");
  // Email clients need inline styles; these colors live only in the email, not in the app UI.
  const html = `<!doctype html><html lang="${locale}"><body style="margin:0;padding:24px;background:#f2f3f6;font-family:Arial,Helvetica,sans-serif;color:#15171d">
<div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #d8dbe3;border-radius:10px;padding:28px">
<p style="margin:0 0 16px;font-size:16px">${escapeHtml(greeting)}</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(lines[0])}</p>
<p style="margin:0 0 20px"><a href="${escapeHtml(url)}" style="display:inline-block;background:#2536a8;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:7px">${escapeHtml(t("resetButton"))}</a></p>
<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#4a5062">${escapeHtml(lines[1])}</p>
<p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#4a5062">${escapeHtml(lines[2])}</p>
<p style="margin:0 0 4px;font-size:12px;color:#4a5062">${escapeHtml(t("linkFallback"))}</p>
<p style="margin:0 0 20px;font-size:12px;word-break:break-all"><a href="${escapeHtml(url)}" style="color:#2536a8">${escapeHtml(url)}</a></p>
<p style="margin:0;font-size:14px">${escapeHtml(t("signature"))}</p>
</div></body></html>`;

  await sendEmail({ to: user.email, subject: t("resetSubject"), text, html });
}
