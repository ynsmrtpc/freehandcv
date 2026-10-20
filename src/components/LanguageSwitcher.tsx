"use client";

import { Check, ChevronDown, Globe, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const localeNames = { tr: "Türkçe", en: "English" } as const;
type Locale = (typeof routing.locales)[number];

/**
 * Language menu styled with the site's tokens (a native <select> list can't follow the theme).
 * Listbox pattern: Enter/Space/↓ opens, ↑/↓ move, Enter selects, Esc or a click outside closes.
 */
export function LanguageSwitcher({ className, align = "end" }: { className?: string; align?: "start" | "end" }) {
  const t = useTranslations("Site");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    listRef.current?.focus();
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const openMenu = () => {
    setActive(Math.max(0, routing.locales.indexOf(locale)));
    setOpen(true);
  };

  const choose = (next: Locale) => {
    setOpen(false);
    buttonRef.current?.focus();
    if (next === locale) return;
    startTransition(() => {
      // @ts-expect-error -- params always match the current pathname's parameters.
      router.replace({ pathname, params }, { locale: next });
    });
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`${t("language")}: ${localeNames[locale]}`}
        disabled={isPending}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openMenu();
          }
        }}
        className={cn(
          "flex h-10 items-center gap-1.5 rounded-xl ps-2.5 pe-2 text-sm font-medium transition-colors hover:bg-surface-2 hover:text-foreground",
          open ? "bg-surface-2 text-foreground" : "text-muted",
        )}
      >
        {isPending ? <Loader2 className="size-[18px] animate-spin" aria-hidden /> : <Globe className="size-[18px]" aria-hidden />}
        <span className="uppercase">{locale}</span>
        <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} aria-hidden />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-label={t("language")}
          aria-activedescendant={`${listId}-${routing.locales[active]}`}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" || e.key === "ArrowUp") {
              e.preventDefault();
              const step = e.key === "ArrowDown" ? 1 : -1;
              setActive((a) => (a + step + routing.locales.length) % routing.locales.length);
            } else if (e.key === "Home" || e.key === "End") {
              e.preventDefault();
              setActive(e.key === "Home" ? 0 : routing.locales.length - 1);
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              choose(routing.locales[active]);
            } else if (e.key === "Escape" || e.key === "Tab") {
              setOpen(false);
              if (e.key === "Escape") buttonRef.current?.focus();
            }
          }}
          className={cn(
            "absolute top-12 z-50 w-44",
            align === "end" ? "end-0" : "start-0",
            "rounded-xl border border-border bg-surface p-1.5 shadow-elevated outline-none",
          )}
        >
          {routing.locales.map((l, i) => (
            <li
              key={l}
              id={`${listId}-${l}`}
              role="option"
              aria-selected={l === locale}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(l)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground",
                i === active && "bg-surface-2",
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="w-6 text-xs font-semibold text-muted uppercase">{l}</span>
                {localeNames[l]}
              </span>
              {l === locale && <Check className="size-4 text-primary-text" aria-hidden />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
