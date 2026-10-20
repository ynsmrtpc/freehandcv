"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { UserMenu } from "../account/UserMenu";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

// Hashes are anchors on the landing (block `anchor` values); English in every locale.
type NavLink = {
  labelKey: "templates" | "howItWorks" | "isItFree" | "faq" | "navExamples" | "navGuides";
  href: React.ComponentProps<typeof Link>["href"];
  /** Internal route on which the link is marked as the current page. */
  route?: "/resume-examples" | "/guides";
  /** Shown only in the mobile menu (the desktop bar stays short). */
  mobileOnly?: boolean;
};

/** Sections with published content get a header link; empty ones are not advertised. */
export function SiteHeader({ showExamples = false, showGuides = false }: { showExamples?: boolean; showGuides?: boolean }) {
  const t = useTranslations("Site");
  const pathname = usePathname();
  const links: NavLink[] = [
    { labelKey: "templates", href: { pathname: "/", hash: "templates" } },
    ...(showExamples ? [{ labelKey: "navExamples", href: "/resume-examples", route: "/resume-examples" } as const] : []),
    ...(showGuides ? [{ labelKey: "navGuides", href: "/guides", route: "/guides" } as const] : []),
    { labelKey: "howItWorks", href: { pathname: "/", hash: "how-it-works" }, mobileOnly: true },
    { labelKey: "isItFree", href: { pathname: "/", hash: "comparison" } },
    { labelKey: "faq", href: { pathname: "/", hash: "faq" } },
  ];
  const isCurrent = (l: NavLink) => !!l.route && (pathname === l.route || pathname.startsWith(l.route + "/"));
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
            {links
              .filter((l) => !l.mobileOnly)
              .map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    aria-current={isCurrent(link) ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-2 hover:text-foreground",
                      isCurrent(link) ? "bg-surface-2 text-foreground" : "text-muted",
                    )}
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
                {links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      aria-current={isCurrent(link) ? "page" : undefined}
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
              <LanguageSwitcher align="start" />
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
