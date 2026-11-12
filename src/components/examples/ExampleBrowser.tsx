"use client";

import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo, useState } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { categorySlug, EXAMPLE_CATEGORIES } from "@/lib/examples";
import type { ExampleSummary } from "@/server/content/examples";
import { countByCategory, ExampleCards } from "./ExampleList";

const searchable = (value: string, locale: string) =>
  value
    .toLocaleLowerCase(locale)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/g, "i");

/** All examples render on the server; filtering the small summary list needs no network requests. */
export function ExampleBrowser({
  items,
  withinCategory = false,
}: {
  items: ExampleSummary[];
  withinCategory?: boolean;
}) {
  const t = useTranslations("Examples");
  const locale = useLocale();
  const id = useId();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const counts = useMemo(() => countByCategory(items), [items]);
  const categories = EXAMPLE_CATEGORIES.filter((item) => counts[item.id]);
  const filtered = useMemo(() => {
    const words = searchable(query.trim(), locale).split(/\s+/).filter(Boolean);
    return items.filter(
      (item) =>
        (!category || item.category === category) &&
        words.every((word) =>
          searchable(`${item.title} ${item.occupation}`, locale).includes(word),
        ),
    );
  }, [items, category, query, locale]);
  const reset = () => {
    setQuery("");
    setCategory("");
  };

  return (
    <div
      className={cn(
        "grid items-start gap-8",
        !withinCategory && "lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10",
      )}
    >
      {!withinCategory && (
        <aside className="sticky top-24 hidden lg:block">
          <h2 className="mb-3 border-b border-border pb-3 text-base font-bold text-foreground">
            {t("index.categoriesLabel")}
          </h2>
          <div
            role="group"
            aria-label={t("index.categoriesLabel")}
            className="space-y-1"
          >
            {[
              { id: "", count: items.length, label: t("index.all") },
              ...categories.map((c) => ({
                id: c.id,
                count: counts[c.id],
                label: t(`categories.${c.id}.name` as never),
              })),
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-start text-sm font-medium transition-colors",
                  category === c.id
                    ? "bg-primary-soft text-primary-text"
                    : "text-muted hover:bg-surface-2 hover:text-foreground",
                )}
              >
                {c.label}
                <span className="text-xs tabular-nums">{c.count}</span>
              </button>
            ))}
          </div>
        </aside>
      )}
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="mb-2 block text-base font-semibold text-foreground"
        >
          {t("index.searchLabel")}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute start-3.5 top-3.5 size-5 text-muted"
            aria-hidden
          />
          <input
            id={id}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("index.searchPlaceholder")}
            aria-controls={`${id}-results`}
            className="h-12 w-full rounded-lg border border-border-strong bg-surface pe-4 ps-11 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-2 focus:outline-offset-2 focus:outline-focus"
          />
        </div>
        {!withinCategory && (
          <div className="mt-4 lg:hidden">
            <label
              htmlFor={`${id}-category`}
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              {t("index.categoriesLabel")}
            </label>
            <select
              id={`${id}-category`}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-11 w-full rounded-lg border border-border-strong bg-surface px-3 text-base text-foreground"
            >
              <option value="">
                {t("index.all")} ({items.length})
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(`categories.${c.id}.name` as never)} ({counts[c.id]})
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mt-4 flex min-h-11 flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <p role="status" className="text-sm text-muted">
            {t("index.results", { n: filtered.length })}
          </p>
          {(query || category) && (
            <button
              type="button"
              onClick={reset}
              className={buttonClass("ghost", "sm", "max-sm:h-11")}
            >
              {t("index.clear")}
            </button>
          )}
        </div>
        <div id={`${id}-results`} className="mt-6 space-y-8">
          {!filtered.length ? (
            <div className="rounded-lg border border-dashed border-border-strong p-6">
              <h2 className="text-lg font-bold text-foreground">
                {t("index.noResults")}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-muted">
                {t("index.noResultsHint")}
              </p>
            </div>
          ) : (
            categories
              .filter((c) => filtered.some((item) => item.category === c.id))
              .map((c) => (
                <section
                  key={c.id}
                  aria-labelledby={withinCategory ? undefined : `${id}-${c.id}`}
                >
                  {!withinCategory && (
                    <h2
                      id={`${id}-${c.id}`}
                      className="mb-4 text-xl font-bold text-foreground"
                    >
                      <Link
                        href={{
                          pathname: "/resume-examples/[slug]",
                          params: { slug: categorySlug(locale, c.id)! },
                        }}
                        className="hover:text-primary-text hover:underline"
                      >
                        {t(`categories.${c.id}.name` as never)}
                      </Link>
                    </h2>
                  )}
                  <ExampleCards
                    items={filtered.filter((item) => item.category === c.id)}
                  />
                </section>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
