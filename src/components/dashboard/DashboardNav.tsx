import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Tabs between the dashboard's lists: my resumes, my templates. */
export function DashboardNav({ current }: { current: "resumes" | "templates" }) {
  const t = useTranslations("Dashboard.nav");
  const items = [
    { key: "resumes", href: "/dashboard" },
    { key: "templates", href: "/dashboard/templates" },
  ] as const;
  return (
    <nav aria-label={t("label")} className="border-b border-border bg-surface">
      <ul className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
        {items.map((i) => (
          <li key={i.key}>
            <Link
              href={i.href}
              aria-current={i.key === current ? "page" : undefined}
              className={cn(
                "relative flex h-12 items-center px-3 text-sm font-semibold transition-colors",
                i.key === current ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {t(i.key)}
              {i.key === current && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
