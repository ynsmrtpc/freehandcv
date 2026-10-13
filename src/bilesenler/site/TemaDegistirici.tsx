"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/ortak/cn";

// İkonlar CSS ile (dark:) değişir; böylece sunucu ve istemci çıktısı aynı kalır,
// "mounted" beklemeye gerek olmaz.
export function TemaDegistirici({ className }: { className?: string }) {
  const t = useTranslations("Site");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={`${t("tema")}: ${t("temaAcik")} / ${t("temaKoyu")}`}
      className={cn(
        "grid size-10 place-items-center rounded-xl text-soluk transition-colors hover:bg-yuzey-2 hover:text-metin",
        className,
      )}
    >
      <Sun className="size-[18px] dark:hidden" strokeWidth={2} />
      <Moon className="hidden size-[18px] dark:block" strokeWidth={2} />
    </button>
  );
}
