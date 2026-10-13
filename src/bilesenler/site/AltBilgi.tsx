import { ArrowUpRight, Heart, Mail } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteAyarlariGetir } from "@/sunucu/icerik/siteAyarlari";
import { Logo } from "./Logo";

// Cache Components: istek dışında saat okunacaksa önbellekli fonksiyonda okunur.
async function yilGetir() {
  "use cache";
  return new Date().getFullYear();
}

// Slogan, sosyal bağlantılar, iletişim ve bağış site ayarlarından (yönetim paneli) gelir.
export async function AltBilgi() {
  const dil = await getLocale();
  const [t, yil, ayar] = await Promise.all([getTranslations("Site"), yilGetir(), siteAyarlariGetir(dil)]);
  const sosyal = [
    { ad: "LinkedIn", adres: ayar.genel.sosyal.linkedin },
    { ad: "X", adres: ayar.genel.sosyal.x },
    { ad: "Instagram", adres: ayar.genel.sosyal.instagram },
    { ad: "GitHub", adres: ayar.genel.sosyal.github },
  ].filter((s) => s.adres);
  const baglanti = "text-sm text-soluk transition-colors hover:text-metin";

  return (
    <footer className="border-t border-cizgi bg-yuzey">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-soluk">{ayar.dil.altBilgiSlogan || t("altBilgiSlogan")}</p>
          {(sosyal.length > 0 || ayar.genel.iletisimEposta) && (
            <ul className="mt-5 flex flex-wrap items-center gap-1">
              {sosyal.map(({ ad, adres }) => (
                <li key={ad}>
                  <a
                    href={adres}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center gap-1 rounded-xl px-2.5 text-sm font-medium text-soluk transition-colors hover:bg-yuzey-2 hover:text-metin"
                  >
                    {ad}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </a>
                </li>
              ))}
              {ayar.genel.iletisimEposta && (
                <li>
                  <a
                    href={`mailto:${ayar.genel.iletisimEposta}`}
                    className="flex h-10 items-center gap-2 rounded-xl px-2.5 text-sm text-soluk transition-colors hover:bg-yuzey-2 hover:text-metin"
                  >
                    <Mail className="size-[18px]" aria-hidden />
                    {ayar.genel.iletisimEposta}
                  </a>
                </li>
              )}
            </ul>
          )}
          {ayar.genel.bagis.aktif && ayar.genel.bagis.baglanti && (
            <a
              href={ayar.genel.bagis.baglanti}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-cizgi px-3 py-2 text-sm font-semibold text-metin hover:bg-yuzey-2"
            >
              <Heart className="size-4 text-hata" aria-hidden />
              {ayar.dil.bagisMetni || "♥"}
            </a>
          )}
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
