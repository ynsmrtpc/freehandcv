"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Button, Card, ErrorText, Field } from "@/components/admin/ui";
import { buttonClass } from "@/components/ui/Button";
import { authClient } from "@/client/auth";
import { useRouter } from "@/i18n/navigation";

export function TwoFactorSetup() {
  const t = useTranslations("Admin");
  const router = useRouter();
  const [setup, setSetup] = useState<{ uri: string; backupCodes: string[] } | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <Card label={t("title")}>
      <p className="text-sm font-semibold text-muted tabular-nums">{t("step", { n: setup ? 2 : 1 })}</p>
      <h1 className="mt-1 text-2xl font-bold tracking-[-0.015em] text-foreground">{t("twoFactorTitle")}</h1>
      {!setup ? (
        <form action={start}>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{t("twoFactorDescription")}</p>
          <Field label={t("password")} name="password" type="password" autoComplete="current-password" required autoFocus />
          <ErrorText>{error}</ErrorText>
          <Button disabled={pending}>{t("continue")}</Button>
        </form>
      ) : (
        <form action={verify}>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">{t("qrInstructions")}</p>
          {/* The QR code stays dark on white in both themes so phone cameras can read it. */}
          <div className="mt-5 flex justify-center rounded-lg border border-border bg-white p-4">
            <QRCode value={setup.uri} size={176} />
          </div>

          <div className="mt-6 border-t border-border pt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-semibold text-foreground">{t("backupCodes")}</h2>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(setup.backupCodes.join("\n"));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className={buttonClass("ghost", "sm")}
              >
                {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                {copied ? t("copied") : t("copyCodes")}
              </button>
            </div>
            <p className="mt-1 text-sm text-muted">{t("backupCodesHint")}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-lg bg-surface-2 p-3 font-mono text-[15px] text-foreground tabular-nums">
              {setup.backupCodes.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>

          <Field
            label={t("verificationCode")}
            hint={t("codeHint")}
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
