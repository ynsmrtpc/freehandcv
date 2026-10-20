import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { categorySlug, EXAMPLE_CATEGORIES } from "@/lib/examples";
import type { ExampleSummary } from "@/server/content/examples";

// Shared pieces of the example pages (plan 6.2): cards and category links.

export function ExampleCards({ items }: { items: ExampleSummary[] }) {
  const t = useTranslations("Examples");
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => (
        <li key={e.slug}>
          <Link
            href={{ pathname: "/resume-examples/[slug]", params: { slug: e.slug } }}
            className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-5 py-4 shadow-card transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-elevated"
          >
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">{e.title}</span>
              <span className="mt-0.5 block text-sm text-muted">
                {t(`categories.${e.category}.name` as never)}
                {e.experienceLevel && ` · ${t(`levels.${e.experienceLevel}` as never)}`}
              </span>
            </span>
            <ArrowRight
              aria-hidden
              className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 rtl:rotate-180 group-hover:rtl:-translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Links to every category page; `current` is marked. Only categories with examples are listed. */
export function CategoryLinks({ counts, current }: { counts: Record<string, number>; current?: string }) {
  const t = useTranslations("Examples");
  const locale = useLocale() as Locale;
  return (
    <ul className="flex flex-wrap gap-2">
      {EXAMPLE_CATEGORIES.filter((c) => counts[c.id]).map((c) => (
        <li key={c.id}>
          <Link
            href={{ pathname: "/resume-examples/[slug]", params: { slug: categorySlug(locale, c.id)! } }}
            aria-current={c.id === current ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors",
              c.id === current
                ? "border-primary bg-primary-soft text-primary-text"
                : "border-border bg-surface text-foreground hover:border-border-strong",
            )}
          >
            {t(`categories.${c.id}.name` as never)}
            <span className="text-xs text-muted tabular-nums">{counts[c.id]}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function countByCategory(items: ExampleSummary[]) {
  const counts: Record<string, number> = {};
  for (const e of items) counts[e.category] = (counts[e.category] ?? 0) + 1;
  return counts;
}
