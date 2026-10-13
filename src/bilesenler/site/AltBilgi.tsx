import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";

// Cache Components: istek dışında saat okunacaksa önbellekli fonksiyonda okunur.
async function yilGetir() {
  "use cache";
  return new Date().getFullYear();
}

// Faz 1'de alt bilgi sütunları site ayarlarından (CMS) gelir; şimdilik yalnız var olan sayfalar.
export async function AltBilgi() {
  const [t, yil] = await Promise.all([getTranslations("Site"), yilGetir()]);
  const baglanti = "text-sm text-soluk transition-colors hover:text-metin";

  return (
    <footer className="border-t border-cizgi bg-yuzey">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-soluk">{t("altBilgiSlogan")}</p>
        </div>
        <nav aria-label={t("altBilgiUrun")}>
          <p className="text-sm font-semibold text-metin">{t("altBilgiUrun")}</p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/cv-olustur" className={baglanti}>
                {t("cvOlustur")}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: "/", hash: "sablonlar" }} className={baglanti}>
                {t("sablonlar")}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: "/", hash: "karsilastirma" }} className={baglanti}>
                {t("ucretsizMi")}
              </Link>
            </li>
            <li>
              <Link href={{ pathname: "/", hash: "sss" }} className={baglanti}>
                {t("sss")}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-cizgi">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-soluk sm:px-6">
          {t("altBilgiHaklar", { yil })}
        </p>
      </div>
    </footer>
  );
}
