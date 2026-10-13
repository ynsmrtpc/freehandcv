"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { Link } from "@/i18n/navigation";
import { cn } from "@/ortak/cn";
import { DilSecici } from "../DilSecici";
import { Logo } from "./Logo";
import { TemaDegistirici } from "./TemaDegistirici";

const BAGLANTILAR = [
  { hash: "sablonlar", anahtar: "sablonlar" },
  { hash: "nasil-calisir", anahtar: "nasilCalisir" },
  { hash: "karsilastirma", anahtar: "ucretsizMi" },
  { hash: "sss", anahtar: "sss" },
] as const;

export function SiteBasligi() {
  const t = useTranslations("Site");
  const { scrollY } = useScroll();
  const [kaydirildi, setKaydirildi] = useState(false);
  const [menuAcik, setMenuAcik] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setKaydirildi(y > 8));

  // Mobil menü açıkken: Esc kapatır, sayfa kaymaz.
  useEffect(() => {
    if (!menuAcik) return;
    const tus = (e: KeyboardEvent) => e.key === "Escape" && setMenuAcik(false);
    document.addEventListener("keydown", tus);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tus);
      document.documentElement.style.overflow = "";
    };
  }, [menuAcik]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        kaydirildi || menuAcik
          ? "border-cizgi bg-zemin/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="FreehandCV" className="rounded-lg">
          <Logo />
        </Link>

        <nav aria-label={t("anaMenu")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {BAGLANTILAR.map((b) => (
              <li key={b.hash}>
                <Link
                  href={{ pathname: "/", hash: b.hash }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-soluk transition-colors hover:bg-yuzey-2 hover:text-metin"
                >
                  {t(b.anahtar)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <DilSecici className="hidden sm:flex" />
          <TemaDegistirici />
          <Link href="/cv-olustur" className={butonSinifi("ana", "kucuk", "ms-2 hidden sm:inline-flex")}>
            {t("cvOlustur")}
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl text-metin hover:bg-yuzey-2 lg:hidden"
            aria-expanded={menuAcik}
            aria-controls="mobil-menu"
            aria-label={menuAcik ? t("menuKapat") : t("menuAc")}
            onClick={() => setMenuAcik((a) => !a)}
          >
            {menuAcik ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuAcik && (
          <m.div
            id="mobil-menu"
            key="mobil-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] border-t border-cizgi bg-zemin px-4 pt-4 pb-8 lg:hidden"
          >
            <nav aria-label={t("anaMenu")}>
              <ul className="space-y-1">
                {BAGLANTILAR.map((b) => (
                  <li key={b.hash}>
                    <Link
                      href={{ pathname: "/", hash: b.hash }}
                      onClick={() => setMenuAcik(false)}
                      className="flex h-12 items-center rounded-xl px-3 text-base font-semibold text-metin hover:bg-yuzey-2"
                    >
                      {t(b.anahtar)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center gap-2 border-t border-cizgi pt-6">
              <DilSecici />
            </div>
            <Link
              href="/cv-olustur"
              onClick={() => setMenuAcik(false)}
              className={butonSinifi("ana", "buyuk", "mt-6 w-full")}
            >
              {t("cvOlustur")}
            </Link>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
