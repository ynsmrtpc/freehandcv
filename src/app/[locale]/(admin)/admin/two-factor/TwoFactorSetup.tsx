"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Field, Button, ErrorText, Card } from "@/components/admin/ui";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/client/auth";

export function TwoFactorSetup() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [setup, setSetup] = useState<{ uri: string; backupCodes: string[] } | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function start(form: FormData) {
    setPending(true);
    setError("");
    const { data, error } = await authClient.twoFactor.enable({
      password: String(form.get("password")),
    });
    setPending(false);
    if (error || !data || data.method !== "totp") return setError(t("signInFailed"));
    setSetup({ uri: data.totpURI, backupCodes: data.backupCodes });
  }

  async function verify(form: FormData) {
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
      <h1 className="text-xl font-bold">{t("twoFactorTitle")}</h1>
      {!setup ? (
        <form action={start}>
          <p className="mt-2 text-sm text-muted">{t("twoFactorDescription")}</p>
          <Field
            label={t("password")}
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <ErrorText>{error}</ErrorText>
          <Button disabled={pending}>{t("continue")}</Button>
        </form>
      ) : (
        <form action={verify}>
          <p className="mt-2 text-sm text-muted">{t("qrInstructions")}</p>
          <div className="mt-4 flex justify-center rounded-lg bg-white p-4">
            <QRCode value={setup.uri} size={176} />
          </div>
          <p className="mt-4 text-sm font-medium">{t("backupCodes")}</p>
          <ul className="mt-2 grid grid-cols-2 gap-1 font-mono text-sm">
            {setup.backupCodes.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <Field
            label={t("verificationCode")}
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />
          <ErrorText>{error}</ErrorText>
          <Button disabled={pending}>{t("verify")}</Button>
        </form>
      )}
    </Card>
  );
}
