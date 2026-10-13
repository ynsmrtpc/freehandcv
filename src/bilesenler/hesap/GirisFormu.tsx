"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/bilesenler/site/Logo";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { getPathname, Link } from "@/i18n/navigation";
import type { Dil } from "@/i18n/routing";
import { authIstemci, GOOGLE_ISTEMCI_KIMLIGI } from "@/istemci/auth";
import { paylasimAyarlaEylemi } from "@/eylemler/paylasim";
import { GoogleLogo } from "./GoogleLogo";

/** Yalnız site içi göreli yollara dönülür (açık yönlendirme açığı olmasın). */
function guvenliDonus(ham: string | null, varsayilan: string) {
  if (ham && ham.startsWith("/") && !ham.startsWith("//") && !ham.startsWith("/\\")) return ham;
  return varsayilan;
}

const girdi =
  "block h-11 w-full rounded-xl border border-cizgi-guclu bg-yuzey px-3.5 text-base text-metin outline-none transition-[border-color,box-shadow] focus:border-ana focus:ring-4 focus:ring-ana/15";

export function GirisFormu({ mod }: { mod: "giris" | "kayit" }) {
  const t = useTranslations("Hesap");
  const tr = useTranslations("Riza");
  const dil = useLocale() as Dil;
  const parametreler = useSearchParams();
  const donus = guvenliDonus(parametreler.get("sonra"), getPathname({ href: "/panel", locale: dil }));
  const oturum = authIstemci.useSession();
  const [adim, setAdim] = useState<"form" | "kod">("form");
  const [hata, setHata] = useState("");
  const [bekliyor, setBekliyor] = useState(false);
  const [sifreAcik, setSifreAcik] = useState(false);

  // Zaten girişliyse doğrudan hedefe.
  useEffect(() => {
    if (oturum.data) window.location.replace(donus);
  }, [oturum.data, donus]);

  const hataCevir = (kod?: string, durum?: number) => {
    if (durum === 429) return t("hatalar.cokDeneme");
    if (kod === "USER_ALREADY_EXISTS" || kod === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") return t("hatalar.kayitli");
    if (kod === "PASSWORD_TOO_SHORT") return t("hatalar.sifreKisa");
    if (kod === "INVALID_EMAIL_OR_PASSWORD" || kod === "INVALID_EMAIL" || kod === "INVALID_PASSWORD") return t("hatalar.hatali");
    return t("hatalar.genel");
  };

  async function gonder(form: FormData) {
    setBekliyor(true);
    setHata("");
    const eposta = String(form.get("eposta")).trim();
    const sifre = String(form.get("sifre"));
    const sonuc =
      mod === "giris"
        ? await authIstemci.signIn.email({ email: eposta, password: sifre })
        : await authIstemci.signUp.email({ email: eposta, password: sifre, name: String(form.get("ad") ?? "").trim() });
    setBekliyor(false);
    if (sonuc.error) return setHata(hataCevir(sonuc.error.code, sonuc.error.status));
    if (sonuc.data && "twoFactorRedirect" in sonuc.data && sonuc.data.twoFactorRedirect) return setAdim("kod");
    // İsteğe bağlı açık rıza: yalnız kişi kutuyu kendisi işaretlediyse kaydedilir.
    if (mod === "kayit" && form.get("isverenRiza") === "on") await paylasimAyarlaEylemi(true, null, "kayit");
    window.location.replace(donus);
  }

  async function kodGonder(form: FormData) {
    setBekliyor(true);
    setHata("");
    const { error } = await authIstemci.twoFactor.verifyTotp({ code: String(form.get("kod")) });
    setBekliyor(false);
    if (error) return setHata(hataCevir(error.code, error.status));
    window.location.replace(donus);
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
        </div>
        <div className="rounded-2xl border border-cizgi bg-yuzey p-6 shadow-yuksek sm:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight text-metin">
            {mod === "giris" ? t("girisBaslik") : t("kayitBaslik")}
          </h1>
          <p className="mt-2 text-center text-sm text-soluk">{mod === "giris" ? t("girisAlt") : t("kayitAlt")}</p>

          {adim === "kod" ? (
            <form action={kodGonder} className="mt-6 space-y-4">
              <p className="text-sm text-soluk">{t("ikiAdim")}</p>
              <label className="block text-sm font-semibold text-metin">
                {t("kod")}
                <input
                  name="kod"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  className={`${girdi} mt-1.5`}
                />
              </label>
              {hata && <Hata metin={hata} />}
              <button disabled={bekliyor} className={butonSinifi("ana", "orta", "w-full")}>
                {t("dogrula")}
              </button>
            </form>
          ) : (
            <>
              {GOOGLE_ISTEMCI_KIMLIGI && (
                <>
                  <button
                    type="button"
                    disabled={bekliyor}
                    onClick={async () => {
                      setBekliyor(true);
                      await authIstemci.signIn.social({ provider: "google", callbackURL: donus });
                    }}
                    className="mt-6 flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-cizgi-guclu bg-yuzey text-[15px] font-semibold text-metin transition-colors hover:bg-yuzey-2"
                  >
                    <GoogleLogo className="size-5" />
                    {t("google")}
                  </button>
                  <div className="my-5 flex items-center gap-3 text-xs font-medium text-soluk uppercase">
                    <span className="h-px flex-1 bg-cizgi" />
                    {t("veya")}
                    <span className="h-px flex-1 bg-cizgi" />
                  </div>
                </>
              )}
              <form action={gonder} className={GOOGLE_ISTEMCI_KIMLIGI ? "space-y-4" : "mt-6 space-y-4"}>
                {mod === "kayit" && (
                  <label className="block text-sm font-semibold text-metin">
                    {t("ad")}
                    <input name="ad" autoComplete="name" maxLength={100} className={`${girdi} mt-1.5`} />
                  </label>
                )}
                <label className="block text-sm font-semibold text-metin">
                  {t("eposta")}
                  <input name="eposta" type="email" autoComplete="email" required className={`${girdi} mt-1.5`} />
                </label>
                <div>
                  <label htmlFor="sifre" className="block text-sm font-semibold text-metin">
                    {t("sifre")}
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      id="sifre"
                      name="sifre"
                      type={sifreAcik ? "text" : "password"}
                      autoComplete={mod === "giris" ? "current-password" : "new-password"}
                      minLength={10}
                      maxLength={128}
                      required
                      aria-describedby={mod === "kayit" ? "sifre-kurali" : undefined}
                      className={`${girdi} pe-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setSifreAcik((a) => !a)}
                      aria-label={sifreAcik ? t("sifreGizle") : t("sifreGoster")}
                      className="absolute inset-y-0 end-0 grid w-11 place-items-center text-soluk hover:text-metin"
                    >
                      {sifreAcik ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {mod === "kayit" && (
                    <p id="sifre-kurali" className="mt-1.5 text-xs text-soluk">
                      {t("sifreKurali")}
                    </p>
                  )}
                </div>
                {hata && <Hata metin={hata} />}
                <button disabled={bekliyor} className={butonSinifi("ana", "orta", "w-full")}>
                  {bekliyor && <Loader2 className="size-4 animate-spin" />}
                  {mod === "giris" ? t("girisYap") : t("kayitOl")}
                </button>
                {mod === "kayit" && (
                  <>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-cizgi bg-zemin p-3 text-[13px] leading-relaxed text-metin">
                      <input type="checkbox" name="isverenRiza" className="mt-0.5 size-4 shrink-0 accent-[var(--ana)]" />
                      {tr("kayitOnay")}
                    </label>
                    <p className="text-xs leading-relaxed text-soluk">{tr("kayitVeriNotu")}</p>
                    <p className="text-center text-xs leading-relaxed text-soluk">{t("kosullar")}</p>
                  </>
                )}
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-soluk">
          {mod === "giris" ? t("hesapYok") : t("hesapVar")}{" "}
          <Link
            href={{ pathname: mod === "giris" ? "/kayit" : "/giris", query: parametreler.get("sonra") ? { sonra: donus } : {} }}
            className="font-semibold text-ana-metin hover:underline"
          >
            {mod === "giris" ? t("kayitOlBaglanti") : t("girisBaglanti")}
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-soluk">
          {t("misafirNot")}{" "}
          <Link href="/cv-olustur" className="font-semibold text-ana-metin hover:underline">
            {t("misafirDevam")}
          </Link>
        </p>
      </div>
    </div>
  );
}

function Hata({ metin }: { metin: string }) {
  return (
    <p role="alert" className="rounded-lg bg-hata-acik px-3 py-2 text-sm font-medium text-hata">
      {metin}
    </p>
  );
}
