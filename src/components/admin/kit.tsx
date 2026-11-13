// Shared building blocks of the admin screens (server-safe; no client hooks here).
// The panel is for our team only, so its texts are Turkish.
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Page header: title, one line of context, actions on the right. */
export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-x-6 gap-y-4 px-4 py-6 sm:px-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-[-0.015em] text-foreground">{title}</h1>
          {description && <p className="mt-1 max-w-3xl text-[15px] leading-relaxed text-muted">{description}</p>}
        </div>
        {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}

/** Content column under the header. */
export function AdminBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-8 sm:py-8", className)}>{children}</div>;
}

/** Search and filters above a list. Filters live in the URL, so the form is a plain GET. */
export function Toolbar({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-x-4 gap-y-3">{children}</div>;
}

export function SearchForm({
  value,
  placeholder,
  label,
  hidden = {},
}: {
  value: string;
  placeholder: string;
  label: string;
  /** Other filters to keep when searching. */
  hidden?: Record<string, string>;
}) {
  return (
    <form role="search" className="relative w-full sm:w-80">
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        type="search"
        name="q"
        defaultValue={value}
        placeholder={placeholder}
        aria-label={label}
        className="h-11 w-full rounded-lg border border-border-strong bg-surface ps-9 pe-3 text-base text-foreground outline-none placeholder:text-muted/80 focus:border-primary focus:ring-4 focus:ring-primary/15 pointer-fine:h-10 pointer-fine:text-[15px]"
      />
      {Object.entries(hidden).map(([k, v]) => (v ? <input key={k} type="hidden" name={k} value={v} /> : null))}
    </form>
  );
}

type FilterOption = { value: string; label: string; count?: number };

/**
 * A set of mutually exclusive filter links. Selection is a bordered soft-ink box (DESIGN.md:
 * selectors never use filled pills).
 */
export function FilterLinks({
  label,
  options,
  current,
  hrefFor,
}: {
  label: string;
  options: FilterOption[];
  current: string;
  hrefFor: (value: string) => string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = current === o.value;
        return (
          <Link
            key={o.value || "all"}
            // Admin URLs are untranslated; the string form keeps query strings simple.
            href={hrefFor(o.value) as never}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors pointer-fine:min-h-9",
              active
                ? "border-primary bg-primary-soft text-primary-text"
                : "border-border bg-surface text-foreground hover:border-border-strong",
            )}
          >
            {o.label}
            {o.count !== undefined && <span className="text-xs text-muted tabular-nums">{o.count}</span>}
          </Link>
        );
      })}
    </div>
  );
}

/** Builds `/admin/...?a=1&b=2`, dropping empty values. */
export function adminHref(path: string, query: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams(
    Object.entries(query)
      .filter(([, v]) => v !== undefined && v !== "" && v !== 0)
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  return qs ? `${path}?${qs}` : path;
}

type Tone = "neutral" | "success" | "warning" | "danger" | "info";
const TONES: Record<Tone, string> = {
  neutral: "bg-surface-2 text-muted",
  success: "bg-accent-soft text-accent",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-primary-soft text-primary-text",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap", TONES[tone])}>
      {children}
    </span>
  );
}

/** Flat paper table: hairline rules, readable header row, no shadow. */
export function Table({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full text-[15px]" aria-label={label}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th scope="col" className={cn("border-b border-border px-4 py-3 text-start text-sm font-semibold whitespace-nowrap text-muted", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-border px-4 py-3 align-middle", className)}>{children}</td>;
}

/** An empty list that says why it is empty and what to do next. */
export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border-strong px-6 py-12 text-center">
      <p className="font-semibold text-foreground">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-muted">{children}</div>}
    </div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  hrefFor,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefFor: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const linkClass =
    "inline-flex min-h-11 items-center gap-1 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-foreground hover:border-border-strong pointer-fine:min-h-9";
  return (
    <nav aria-label="Sayfalar" className="flex items-center justify-between gap-3 text-sm text-muted">
      <span className="tabular-nums">
        {page * pageSize + 1}–{Math.min(total, (page + 1) * pageSize)} / {total}
      </span>
      <span className="flex gap-2">
        {page > 0 && (
          <Link href={hrefFor(page - 1) as never} className={linkClass}>
            <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden />
            Önceki
          </Link>
        )}
        {page < pages - 1 && (
          <Link href={hrefFor(page + 1) as never} className={linkClass}>
            Sonraki
            <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        )}
      </span>
    </nav>
  );
}

/**
 * Settings-style section: what it is on the left, the fields on the right (stacked on phones).
 * Sections are separated by rules, not cards.
 */
export function FormSection({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="grid scroll-mt-24 gap-x-10 gap-y-4 border-b border-border py-8 first:pt-0 last:border-0 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
      <div>
        <h2 id={id ? `${id}-title` : undefined} className="text-lg font-bold text-foreground">
          {title}
        </h2>
        {description && <p className="mt-1 text-[15px] leading-relaxed text-muted">{description}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function formatDate(d: Date, withTime = false) {
  return d.toLocaleString("tr-TR", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" });
}
