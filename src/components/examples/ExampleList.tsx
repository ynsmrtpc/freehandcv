import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { categorySlug, EXAMPLE_CATEGORIES } from "@/lib/examples";
import type { ExampleSummary } from "@/server/content/examples";

// Shared pieces of the example pages (plan 6.2): a ruled register of examples and category links.

export function ExampleCards({ items }: { items: ExampleSummary[] }) {
  const t = useTranslations("Examples");
  return (
    <ul className="grid border-t border-border lg:grid-cols-2 lg:gap-x-10">
      {items.map((e) => (
        <li key={e.slug} className="border-b border-border">
          <Link
            href={{ pathname: "/resume-examples/[slug]", params: { slug: e.slug } }}
            className="group flex h-full min-h-14 items-center justify-between gap-4 py-3.5 transition-colors hover:text-primary-text"
          >
            <span className="min-w-0">
              <span className="block text-base leading-snug font-semibold text-foreground group-hover:text-primary-text">{e.title}</span>
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
              "inline-flex min-h-11 items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
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
