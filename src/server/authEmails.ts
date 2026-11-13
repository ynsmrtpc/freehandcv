import "server-only";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { escapeHtml, sendEmail } from "./email";

/** Reset links stay valid for one hour (Better Auth's default, set explicitly in auth.ts). */
export const RESET_TOKEN_EXPIRES_IN_SECONDS = 60 * 60;
/** Verification links stay valid for a day: people often open them later, on another device. */
export const VERIFY_TOKEN_EXPIRES_IN_SECONDS = 24 * 60 * 60;

type Recipient = { email: string; name?: string | null; uiLocale?: unknown };

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

/** One message with a single action button; text and HTML parts carry the same lines. */
async function sendActionEmail({
  to,
  locale,
  subject,
  intro,
  button,
  url,
  notes,
}: {
  to: Recipient;
  locale: Locale;
  subject: string;
  intro: string;
  button: string;
  url: string;
  notes: string[];
}) {
  const t = await getTranslations({ locale, namespace: "Email" });
  const name = to.name?.trim() ?? "";
  const greeting = name ? t("greetingName", { name }) : t("greeting");

  const text = [greeting, "", intro, "", url, "", ...notes, "", t("signature")].join("\n");
  // Email clients need inline styles; these colors live only in the email, not in the app UI.
  const html = `<!doctype html><html lang="${locale}"><body style="margin:0;padding:24px;background:#f2f3f6;font-family:Arial,Helvetica,sans-serif;color:#15171d">
<div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #d8dbe3;border-radius:10px;padding:28px">
<p style="margin:0 0 16px;font-size:16px">${escapeHtml(greeting)}</p>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6">${escapeHtml(intro)}</p>
<p style="margin:0 0 20px"><a href="${escapeHtml(url)}" style="display:inline-block;background:#2536a8;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:7px">${escapeHtml(button)}</a></p>
${notes.map((n) => `<p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#4a5062">${escapeHtml(n)}</p>`).join("\n")}
<p style="margin:12px 0 4px;font-size:12px;color:#4a5062">${escapeHtml(t("linkFallback"))}</p>
<p style="margin:0 0 20px;font-size:12px;word-break:break-all"><a href="${escapeHtml(url)}" style="color:#2536a8">${escapeHtml(url)}</a></p>
<p style="margin:0;font-size:14px">${escapeHtml(t("signature"))}</p>
</div></body></html>`;

  await sendEmail({ to: to.email, subject, text, html });
}

export async function sendPasswordResetEmail({ user, url }: { user: Recipient; url: string }) {
  const locale = resetEmailLocale(user.uiLocale, url);
  const t = await getTranslations({ locale, namespace: "Email" });
  await sendActionEmail({
    to: user,
    locale,
    url,
    subject: t("resetSubject"),
    intro: t("resetIntro"),
    button: t("resetButton"),
    notes: [t("resetExpiry", { hours: RESET_TOKEN_EXPIRES_IN_SECONDS / 3600 }), t("resetIgnore")],
  });
}

export async function sendVerificationEmail({ user, url }: { user: Recipient; url: string }) {
  const locale = resetEmailLocale(user.uiLocale, url);
  const t = await getTranslations({ locale, namespace: "Email" });
  await sendActionEmail({
    to: user,
    locale,
    url,
    subject: t("verifySubject"),
    intro: t("verifyIntro"),
    button: t("verifyButton"),
    notes: [t("verifyExpiry", { hours: VERIFY_TOKEN_EXPIRES_IN_SECONDS / 3600 }), t("verifyIgnore")],
  });
}

/**
 * Someone tried to sign up with an address that already has an account. The sign-up form answers the
 * same either way (no account enumeration), so the owner hears about it here, with a way back in.
 */
export async function sendExistingAccountEmail({ user, signInUrl, resetUrl }: { user: Recipient; signInUrl: string; resetUrl: string }) {
  const locale = resetEmailLocale(user.uiLocale, signInUrl);
  const t = await getTranslations({ locale, namespace: "Email" });
  await sendActionEmail({
    to: user,
    locale,
    url: signInUrl,
    subject: t("existingSubject"),
    intro: t("existingIntro"),
    button: t("existingButton"),
    notes: [t("existingReset", { url: resetUrl }), t("existingIgnore")],
  });
}
