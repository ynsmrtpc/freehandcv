"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Alan, Buton, Hata, Kart } from "@/bilesenler/yonetim/ui";
import { useRouter } from "@/i18n/navigation";
import { authIstemci } from "@/istemci/auth";

export function IkiAdimKurulum() {
  const t = useTranslations("Yonetim");
  const router = useRouter();
  const [kurulum, setKurulum] = useState<{ uri: string; yedekler: string[] } | null>(null);
  const [hata, setHata] = useState("");
  const [bekliyor, setBekliyor] = useState(false);

  async function baslat(form: FormData) {
    setBekliyor(true);
    setHata("");
    const { data, error } = await authIstemci.twoFactor.enable({
      password: String(form.get("sifre")),
    });
    setBekliyor(false);
    if (error || !data || data.method !== "totp") return setHata(t("hata"));
    setKurulum({ uri: data.totpURI, yedekler: data.backupCodes });
  }

  async function dogrula(form: FormData) {
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
      <h1 className="text-xl font-bold">{t("ikiAdimBaslik")}</h1>
      {!kurulum ? (
        <form action={baslat}>
          <p className="mt-2 text-sm text-soluk">{t("ikiAdimAciklama")}</p>
          <Alan
            etiket={t("sifre")}
            name="sifre"
            type="password"
            autoComplete="current-password"
            required
          />
          <Hata>{hata}</Hata>
          <Buton disabled={bekliyor}>{t("devam")}</Buton>
        </form>
      ) : (
        <form action={dogrula}>
          <p className="mt-2 text-sm text-soluk">{t("qrAciklama")}</p>
          <div className="mt-4 flex justify-center rounded-lg bg-white p-4">
            <QRCode value={kurulum.uri} size={176} />
          </div>
          <p className="mt-4 text-sm font-medium">{t("yedekKodlar")}</p>
          <ul className="mt-2 grid grid-cols-2 gap-1 font-mono text-sm">
            {kurulum.yedekler.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <Alan
            etiket={t("dogrulamaKodu")}
            name="kod"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />
          <Hata>{hata}</Hata>
          <Buton disabled={bekliyor}>{t("dogrula")}</Buton>
        </form>
      )}
    </Kart>
  );
}
