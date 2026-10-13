"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alan, Buton, Hata, Kart } from "@/bilesenler/yonetim/ui";
import { useRouter } from "@/i18n/navigation";
import { authIstemci } from "@/istemci/auth";

export default function YonetimGiris() {
  const t = useTranslations("Yonetim");
  const router = useRouter();
  const [adim, setAdim] = useState<"sifre" | "kod">("sifre");
  const [hata, setHata] = useState("");
  const [bekliyor, setBekliyor] = useState(false);

  async function sifreGonder(form: FormData) {
    setBekliyor(true);
    setHata("");
    const { data, error } = await authIstemci.signIn.email({
      email: String(form.get("eposta")),
      password: String(form.get("sifre")),
    });
    setBekliyor(false);
    if (error) return setHata(t("hata"));
    if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) return setAdim("kod");
    router.replace("/yonetim");
    router.refresh();
  }

  async function kodGonder(form: FormData) {
    setBekliyor(true);
    setHata("");
    const { error } = await authIstemci.twoFactor.verifyTotp({ code: String(form.get("kod")) });
    setBekliyor(false);
    if (error) return setHata(t("kodHatali"));
    router.replace("/yonetim");
    router.refresh();
  }

  return (
    <Kart>
      <h1 className="text-xl font-bold">{t("giris")}</h1>
      {adim === "sifre" ? (
        <form action={sifreGonder}>
          <Alan etiket={t("eposta")} name="eposta" type="email" autoComplete="username" required />
          <Alan
            etiket={t("sifre")}
            name="sifre"
            type="password"
            autoComplete="current-password"
            required
          />
          <Hata>{hata}</Hata>
          <Buton disabled={bekliyor}>{t("girisYap")}</Buton>
        </form>
      ) : (
        <form action={kodGonder}>
          <p className="mt-2 text-sm text-soluk">{t("dogrulamaAciklama")}</p>
          <Alan
            etiket={t("dogrulamaKodu")}
            name="kod"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoFocus
          />
          <Hata>{hata}</Hata>
          <Buton disabled={bekliyor}>{t("dogrula")}</Buton>
        </form>
      )}
    </Kart>
  );
}
