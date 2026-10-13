"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const localeNames = { tr: "Türkçe", en: "English" } as const;

// Native <select>: keyboard, screen readers and the mobile picker work out of the box.
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Site");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  return (
    <label
      className={cn(
        "relative flex h-10 items-center gap-1.5 rounded-xl ps-2.5 pe-2 text-sm font-medium text-muted transition-colors focus-within:text-foreground hover:bg-surface-2 hover:text-foreground",
        className,
      )}
    >
      <Globe className="size-[18px]" aria-hidden />
      <span className="uppercase">{locale}</span>
      <ChevronDown className="size-3.5" aria-hidden />
      <select
        aria-label={t("language")}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
        value={locale}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.value as (typeof routing.locales)[number];
          startTransition(() => {
            // @ts-expect-error -- params always match the current pathname's parameters.
            router.replace({ pathname, params }, { locale: next });
          });
        }}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
