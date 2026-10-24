"use client";

import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** What the filters and sorts need of a card; the cards themselves are rendered on the server. */
export type GalleryEntry = {
  key: string;
  official: boolean;
  ats: number;
  photo: boolean;
  twoColumn: boolean;
  usage: number;
  score: number;
  ratingCount: number;
  publishedAt: string | null;
};

const FILTERS = {
  all: () => true,
  official: (e: GalleryEntry) => e.official,
  community: (e: GalleryEntry) => !e.official,
  ats: (e: GalleryEntry) => e.ats === 5,
  photo: (e: GalleryEntry) => e.photo,
  twoColumn: (e: GalleryEntry) => e.twoColumn,
} as const;
type Filter = keyof typeof FILTERS;

// Plan 11.4: most used, highest rated, newest, ATS. Official templates lead the default order.
const SORTS = {
  popular: (a: GalleryEntry, b: GalleryEntry) => Number(b.official) - Number(a.official) || b.usage - a.usage,
  rating: (a: GalleryEntry, b: GalleryEntry) =>
    Number(b.ratingCount > 0) - Number(a.ratingCount > 0) || b.score - a.score || b.usage - a.usage,
  newest: (a: GalleryEntry, b: GalleryEntry) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  ats: (a: GalleryEntry, b: GalleryEntry) => b.ats - a.ats || Number(b.official) - Number(a.official),
} as const;
type Sort = keyof typeof SORTS;

/**
 * Filter chips and sort order over server-rendered cards: the full list is in the HTML for search
 * engines and works without JavaScript; filtering only hides cards.
 */
export function TemplateGallery({ entries, cards }: { entries: GalleryEntry[]; cards: Record<string, ReactNode> }) {
  const t = useTranslations("Templates.gallery");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const hasCommunity = entries.some((e) => !e.official);
  const filters = (Object.keys(FILTERS) as Filter[]).filter((f) => hasCommunity || (f !== "official" && f !== "community"));
  // Array.prototype.sort is stable, so ties keep the server order.
  const shown = entries.filter(FILTERS[filter]).sort(SORTS[sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const n = entries.filter(FILTERS[f]).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={f === filter}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm font-medium transition-colors",
                  f === filter
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-surface text-foreground hover:border-border-strong",
                )}
              >
                {t(`filters.${f}`)}
                <span className={cn("ms-1.5 text-xs tabular-nums", f === filter ? "text-white/80" : "text-muted")}>{n}</span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          {t("sortLabel")}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-9 rounded-lg border border-border-strong bg-surface px-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          >
            {(Object.keys(SORTS) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {t(`sorts.${s}`)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="sr-only" aria-live="polite">
        {t("results", { n: shown.length })}
      </p>
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((e) => (
          <li key={e.key}>{cards[e.key]}</li>
        ))}
      </ul>
    </div>
  );
}
