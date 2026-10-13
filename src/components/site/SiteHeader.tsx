"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { UserMenu } from "../account/UserMenu";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

// Hashes are public anchors (block `anchor` values) and stay as they are.
const NAV_LINKS = [
  { hash: "sablonlar", labelKey: "templates" },
  { hash: "nasil-calisir", labelKey: "howItWorks" },
  { hash: "karsilastirma", labelKey: "isItFree" },
  { hash: "sss", labelKey: "faq" },
] as const;

export function SiteHeader() {
  const t = useTranslations("Site");
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  // While the mobile menu is open: Esc closes it and the page does not scroll.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || menuOpen
          ? "border-border bg-background/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" aria-label="FreehandCV" className="rounded-lg">
          <Logo />
        </Link>

        <nav aria-label={t("mainMenu")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <Link
                  href={{ pathname: "/", hash: link.hash }}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1">
          <LanguageSwitcher className="hidden sm:flex" />
          <ThemeToggle />
          <UserMenu />
          <Link href="/create-resume" className={buttonClass("primary", "sm", "ms-2 hidden sm:inline-flex")}>
            {t("createResume")}
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl text-foreground hover:bg-surface-2 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] border-t border-border bg-background px-4 pt-4 pb-8 lg:hidden"
          >
            <nav aria-label={t("mainMenu")}>
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.hash}>
                    <Link
                      href={{ pathname: "/", hash: link.hash }}
                      onClick={() => setMenuOpen(false)}
                      className="flex h-12 items-center rounded-xl px-3 text-base font-semibold text-foreground hover:bg-surface-2"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 flex items-center gap-2 border-t border-border pt-6">
              <LanguageSwitcher />
            </div>
            <Link
              href="/create-resume"
              onClick={() => setMenuOpen(false)}
              className={buttonClass("primary", "lg", "mt-6 w-full")}
            >
              {t("createResume")}
            </Link>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
