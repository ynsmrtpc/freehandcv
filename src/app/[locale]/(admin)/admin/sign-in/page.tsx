"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Field, Button, ErrorText, Card } from "@/components/admin/ui";
import { useRouter } from "@/i18n/navigation";
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
    if (error) return setError(error.code === "ACCOUNT_SUSPENDED" ? "Bu hesap askıya alınmış." : t("signInFailed"));
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
    <Card>
      <h1 className="text-xl font-bold">{t("signInTitle")}</h1>
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
          <p className="mt-2 text-sm text-muted">{t("verificationHint")}</p>
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
