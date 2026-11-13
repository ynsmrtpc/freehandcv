"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Field, Button, ErrorText, Card } from "@/components/admin/ui";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/client/auth";

export default function AdminSignIn() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [step, setStep] = useState<"password" | "code">("password");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submitPassword(form: FormData) {
    setPending(true);
    setError("");
    const { data, error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) return setError(error.code === "ACCOUNT_SUSPENDED" ? t("accountSuspended") : t("signInFailed"));
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) return setStep("code");
    router.replace("/admin");
    router.refresh();
  }

  async function submitCode(form: FormData) {
    setPending(true);
    setError("");
    const { error } = await authClient.twoFactor.verifyTotp({ code: String(form.get("code")) });
    setPending(false);
    if (error) return setError(t("invalidCode"));
    router.replace("/admin");
    router.refresh();
  }

  return (
    <Card
      label={t("title")}
      aside={
        <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-primary-text hover:underline pointer-fine:min-h-9">
          {t("backToSite")}
        </Link>
      }
    >
      <h1 className="text-2xl font-bold tracking-[-0.015em] text-foreground">{t("signInTitle")}</h1>
      {step === "password" ? (
        <form action={submitPassword}>
          <Field label={t("email")} name="email" type="email" autoComplete="username" required />
          <Field
            label={t("password")}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <ErrorText>{error}</ErrorText>
          <Button disabled={pending}>{t("signIn")}</Button>
        </form>
      ) : (
        <form action={submitCode}>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{t("verificationHint")}</p>
          <Field
            label={t("verificationCode")}
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
          />
          <ErrorText>{error}</ErrorText>
          <Button disabled={pending}>{t("verify")}</Button>
        </form>
      )}
    </Card>
  );
}
