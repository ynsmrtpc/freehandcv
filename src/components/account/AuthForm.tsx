"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { authClient, GOOGLE_CLIENT_ID } from "@/client/auth";
import { setSharingAction } from "@/actions/sharing";
import { GoogleLogo } from "./GoogleLogo";

/** Return URL query parameter (public URL, kept as is). */
const RETURN_PARAM = "next";
/** Set on the sign-in URL after a successful password reset (`?reset=done`). */
export const RESET_DONE_PARAM = "reset";
export const RESET_DONE_VALUE = "done";

/** Only relative in-site paths are followed (no open redirect). */
function safeReturnPath(raw: string | null, fallback: string) {
  if (raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\")) return raw;
  return fallback;
}

export const inputClass =
  "block h-11 w-full rounded-xl border border-border-strong bg-surface px-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-4 focus:ring-primary/15";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const t = useTranslations("Auth");
  const tc = useTranslations("Consent");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get(RETURN_PARAM), getPathname({ href: "/dashboard", locale }));
  const session = authClient.useSession();
  const [step, setStep] = useState<"form" | "code">("form");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const signIn = mode === "sign-in";

  // Already signed in: go straight to the target.
  useEffect(() => {
    if (session.data) window.location.replace(returnTo);
  }, [session.data, returnTo]);

  const errorMessage = (code?: string, status?: number) => {
    if (status === 429) return t("errors.tooManyAttempts");
    if (code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return t("errors.alreadyRegistered");
    if (code === "PASSWORD_TOO_SHORT") return t("errors.passwordTooShort");
    if (code === "INVALID_EMAIL_OR_PASSWORD" || code === "INVALID_EMAIL" || code === "INVALID_PASSWORD") return t("errors.invalidCredentials");
    return t("errors.generic");
  };

  async function submit(form: FormData) {
    setPending(true);
    setError("");
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    const result = signIn
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ email, password, name: String(form.get("name") ?? "").trim() });
    setPending(false);
    if (result.error) return setError(errorMessage(result.error.code, result.error.status));
    if (result.data && "twoFactorRedirect" in result.data && result.data.twoFactorRedirect) return setStep("code");
    // Optional explicit consent: recorded only when the person ticked the box themselves.
    if (!signIn && form.get("employerConsent") === "on") await setSharingAction(true, null, "sign_up");
    window.location.replace(returnTo);
  }

  async function submitCode(form: FormData) {
    setPending(true);
    setError("");
    const { error } = await authClient.twoFactor.verifyTotp({ code: String(form.get("code")) });
    setPending(false);
    if (error) return setError(errorMessage(error.code, error.status));
    window.location.replace(returnTo);
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight text-foreground">
            {signIn ? t("signInTitle") : t("signUpTitle")}
          </h1>
          <p className="mt-2 text-center text-sm text-muted">{signIn ? t("signInSubtitle") : t("signUpSubtitle")}</p>
          {signIn && searchParams.get(RESET_DONE_PARAM) === RESET_DONE_VALUE && step === "form" && (
            <SuccessMessage text={t("passwordResetDone")} className="mt-5" />
          )}

          {step === "code" ? (
            <form action={submitCode} className="mt-6 space-y-4">
              <p className="text-sm text-muted">{t("twoFactor")}</p>
              <label className="block text-sm font-semibold text-foreground">
                {t("code")}
                <input
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              {error && <ErrorMessage text={error} />}
              <button disabled={pending} className={buttonClass("primary", "md", "w-full")}>
                {t("verify")}
              </button>
            </form>
          ) : (
            <>
              {GOOGLE_CLIENT_ID && (
                <>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={async () => {
                      setPending(true);
                      await authClient.signIn.social({ provider: "google", callbackURL: returnTo });
                    }}
                    className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border-strong bg-surface text-[15px] font-semibold text-foreground transition-colors hover:bg-surface-2"
                  >
                    <GoogleLogo className="size-5" />
                    {t("google")}
                  </button>
                  <div className="my-5 flex items-center gap-3 text-xs font-medium text-muted uppercase">
                    <span className="h-px flex-1 bg-border" />
                    {t("or")}
                    <span className="h-px flex-1 bg-border" />
                  </div>
                </>
              )}
              <form action={submit} className={GOOGLE_CLIENT_ID ? "space-y-4" : "mt-6 space-y-4"}>
                {!signIn && (
                  <label className="block text-sm font-semibold text-foreground">
                    {t("name")}
                    <input name="name" autoComplete="name" maxLength={100} className={`${inputClass} mt-1.5`} />
                  </label>
                )}
                <label className="block text-sm font-semibold text-foreground">
                  {t("email")}
                  <input name="email" type="email" autoComplete="email" required className={`${inputClass} mt-1.5`} />
                </label>
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                      {t("password")}
                    </label>
                    {signIn && (
                      <Link href="/reset-password" className="text-sm font-medium text-primary-text hover:underline">
                        {t("forgotPassword")}
                      </Link>
                    )}
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      id="password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      autoComplete={signIn ? "current-password" : "new-password"}
                      minLength={10}
                      maxLength={128}
                      required
                      aria-describedby={signIn ? undefined : "password-rule"}
                      className={`${inputClass} pe-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((v) => !v)}
                      aria-label={passwordVisible ? t("hidePassword") : t("showPassword")}
                      className="absolute inset-y-0 end-0 grid w-11 place-items-center text-muted hover:text-foreground"
                    >
                      {passwordVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {!signIn && (
                    <p id="password-rule" className="mt-1.5 text-xs text-muted">
                      {t("passwordRule")}
                    </p>
                  )}
                </div>
                {error && <ErrorMessage text={error} />}
                <button disabled={pending} className={buttonClass("primary", "md", "w-full")}>
                  {pending && <Loader2 className="size-4 animate-spin" />}
                  {signIn ? t("signIn") : t("signUp")}
                </button>
                {!signIn && (
                  <>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-background p-3 text-[13px] leading-relaxed text-foreground">
                      <input type="checkbox" name="employerConsent" className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]" />
                      {tc("signUpConsent")}
                    </label>
                    <p className="text-xs leading-relaxed text-muted">{tc("signUpDataNote")}</p>
                    <p className="text-center text-xs leading-relaxed text-muted">
                      {t.rich("terms", {
                        link: (chunks) => (
                          <Link href="/privacy" target="_blank" className="font-medium text-primary-text underline underline-offset-2">
                            {chunks}
                          </Link>
                        ),
                      })}
                    </p>
                  </>
                )}
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          {signIn ? t("noAccount") : t("haveAccount")}{" "}
          <Link
            href={{
              pathname: signIn ? "/sign-up" : "/sign-in",
              query: searchParams.get(RETURN_PARAM) ? { [RETURN_PARAM]: returnTo } : {},
            }}
            className="font-semibold text-primary-text hover:underline"
          >
            {signIn ? t("signUpLink") : t("signInLink")}
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-muted">
          {t("guestNote")}{" "}
          <Link href="/create-resume" className="font-semibold text-primary-text hover:underline">
            {t("continueAsGuest")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export function SuccessMessage({ text, className }: { text: string; className?: string }) {
  return (
    <p role="status" className={cn("rounded-lg bg-accent-soft px-3 py-2 text-sm font-medium text-accent", className)}>
      {text}
    </p>
  );
}

export function ErrorMessage({ text }: { text: string }) {
  return (
    <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
      {text}
    </p>
  );
}
