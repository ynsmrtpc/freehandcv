"use client";

import { Eye, EyeOff, Loader2, MailCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { authClient } from "@/client/auth";
import { ErrorMessage, inputClass, RESET_DONE_PARAM, RESET_DONE_VALUE } from "./AuthForm";

/**
 * Plan 9 `/sifre-sifirla`: one page for both steps. Without a token it asks for the email and sends a
 * link; Better Auth's link checks the token and comes back here with `?token=` (valid) or
 * `?error=INVALID_TOKEN` (expired or already used).
 */
export function ResetPasswordForm({ linkHours }: { linkHours: number }) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  if (searchParams.get("error")) return <InvalidLink linkHours={linkHours} />;
  if (token) return <NewPasswordStep token={token} linkHours={linkHours} />;
  return <RequestStep linkHours={linkHours} />;
}

function Shell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const t = useTranslations("Auth");
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-elevated sm:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-2 text-center text-sm text-muted">{subtitle}</p>}
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/sign-in" className="font-semibold text-primary-text hover:underline">
            {t("backToSignIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}

function RequestStep({ linkHours }: { linkHours: number }) {
  const t = useTranslations("Auth");
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(form: FormData) {
    setPending(true);
    setError("");
    const { error } = await authClient.requestPasswordReset({
      email: String(form.get("email")).trim(),
      redirectTo: getPathname({ href: "/reset-password", locale }),
    });
    setPending(false);
    // Same answer whether or not the account exists; only rate limiting and outages are reported.
    if (error?.status === 429) return setError(t("errors.tooManyAttempts"));
    if (error && error.status !== 400) return setError(t("errors.generic"));
    setSent(true);
  }

  if (sent)
    return (
      <Shell title={t("resetLinkSentTitle")}>
        <div className="mt-5 flex flex-col items-center gap-4 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-accent-soft text-accent">
            <MailCheck className="size-6" aria-hidden />
          </span>
          <p role="status" className="text-sm leading-relaxed text-muted">
            {t("resetLinkSent", { hours: linkHours })}
          </p>
        </div>
      </Shell>
    );

  return (
    <Shell title={t("forgotTitle")} subtitle={t("forgotSubtitle")}>
      <form action={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          {t("email")}
          <input name="email" type="email" autoComplete="email" required autoFocus className={`${inputClass} mt-1.5`} />
        </label>
        {error && <ErrorMessage text={error} />}
        <button disabled={pending} className={buttonClass("primary", "md", "w-full")}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("sendResetLink")}
        </button>
      </form>
    </Shell>
  );
}

function NewPasswordStep({ token, linkHours }: { token: string; linkHours: number }) {
  const t = useTranslations("Auth");
  const locale = useLocale() as Locale;
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [visible, setVisible] = useState(false);

  async function submit(form: FormData) {
    const newPassword = String(form.get("password"));
    if (newPassword !== String(form.get("confirm"))) return setError(t("errors.passwordMismatch"));
    setPending(true);
    setError("");
    const { error } = await authClient.resetPassword({ newPassword, token });
    if (!error) {
      const signIn = getPathname({ href: "/sign-in", locale });
      return window.location.replace(`${signIn}?${RESET_DONE_PARAM}=${RESET_DONE_VALUE}`);
    }
    setPending(false);
    if (error.code === "INVALID_TOKEN" || error.code === "USER_NOT_FOUND") return setInvalid(true);
    if (error.status === 429) return setError(t("errors.tooManyAttempts"));
    if (error.code === "PASSWORD_TOO_SHORT") return setError(t("errors.passwordTooShort"));
    setError(t("errors.generic"));
  }

  if (invalid) return <InvalidLink linkHours={linkHours} />;

  const passwordInput = (id: string, name: string) => (
    <input
      id={id}
      name={name}
      type={visible ? "text" : "password"}
      autoComplete="new-password"
      minLength={10}
      maxLength={128}
      required
      className={`${inputClass} mt-1.5`}
    />
  );

  return (
    <Shell title={t("newPasswordTitle")} subtitle={t("newPasswordSubtitle")}>
      <form action={submit} className="mt-6 space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="new-password" className="text-sm font-semibold text-foreground">
              {t("newPassword")}
            </label>
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? t("hidePassword") : t("showPassword")}
              aria-pressed={visible}
              className="inline-flex items-center gap-1 text-muted hover:text-foreground"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {passwordInput("new-password", "password")}
          <p className="mt-1.5 text-xs text-muted">{t("passwordRule")}</p>
        </div>
        <div>
          <label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">
            {t("confirmPassword")}
          </label>
          {passwordInput("confirm-password", "confirm")}
        </div>
        {error && <ErrorMessage text={error} />}
        <button disabled={pending} className={buttonClass("primary", "md", "w-full")}>
          {pending && <Loader2 className="size-4 animate-spin" />}
          {t("savePassword")}
        </button>
      </form>
    </Shell>
  );
}

function InvalidLink({ linkHours }: { linkHours: number }) {
  const t = useTranslations("Auth");
  return (
    <Shell title={t("invalidTokenTitle")}>
      <p className="mt-3 text-center text-sm leading-relaxed text-muted">{t("invalidToken", { hours: linkHours })}</p>
      {/* A plain link drops ?token/?error and shows the request step again. */}
      <Link href="/reset-password" className={buttonClass("primary", "md", "mt-6 w-full")}>
        {t("requestNewLink")}
      </Link>
    </Shell>
  );
}
