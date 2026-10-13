"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

// Icons swap via CSS (dark:), so server and client output match and there is
// no need to wait for "mounted".
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("Site");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={`${t("theme")}: ${t("themeLight")} / ${t("themeDark")}`}
      className={cn(
        "grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-foreground",
        className,
      )}
    >
      <Sun className="size-[18px] dark:hidden" strokeWidth={2} />
      <Moon className="hidden size-[18px] dark:block" strokeWidth={2} />
    </button>
  );
}
