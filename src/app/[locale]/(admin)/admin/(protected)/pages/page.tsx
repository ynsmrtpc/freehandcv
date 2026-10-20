import { ChevronRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { listPages } from "@/server/content/pages";

// Page kinds are shown with the Turkish values the list always displayed.
const KIND_LABELS: Record<string, string> = { static: "sabit", guide: "rehber", legal: "yasal" };

const LOCALE_FILTERS = [
  { value: "", label: "Tüm diller" },
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "İngilizce" },
] as const;
const KIND_FILTERS = [
  { value: "", label: "Tüm türler" },
  { value: "static", label: "Sabit" },
  { value: "guide", label: "Rehber" },
  { value: "legal", label: "Yasal" },
] as const;

/** One row of filter pills; the selection lives in the URL (?dil=tr&tur=guide) so it survives a reload. */
function Filters({
  name,
  options,
  current,
  other,
  counts,
}: {
  name: "dil" | "tur";
  options: readonly { value: string; label: string }[];
  current: string;
  other: Record<string, string>;
  counts: Record<string, number>;
}) {
  return (
    <div role="group" aria-label={name === "dil" ? "Dil" : "Tür"} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const query = Object.fromEntries(Object.entries({ ...other, [name]: o.value }).filter(([, v]) => v));
        const active = current === o.value;
        return (
          <Link
            key={o.value || "all"}
            href={{ pathname: "/admin/pages", query }}
            aria-current={active ? "true" : undefined}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors",
              active ? "border-primary bg-primary-soft text-primary-text" : "border-border bg-surface text-foreground hover:border-border-strong",
            )}
          >
            {o.label}
            <span className="text-xs text-muted tabular-nums">{counts[o.value] ?? 0}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default async function Pages({ searchParams }: PageProps<"/[locale]/admin/pages">) {
  const sp = await searchParams;
  const locale = typeof sp.dil === "string" && ["tr", "en"].includes(sp.dil) ? sp.dil : "";
  const kind = typeof sp.tur === "string" && ["static", "guide", "legal"].includes(sp.tur) ? sp.tur : "";
  const all = await listPages();
  // Each row's counts follow the other filter, so the numbers always match what a click would show.
  const byKind = all.filter((p) => !kind || p.kind === kind);
  const byLocale = all.filter((p) => !locale || p.locale === locale);
  const count = (rows: typeof all, key: "locale" | "kind") =>
    rows.reduce<Record<string, number>>((acc, p) => ((acc[p[key]] = (acc[p[key]] ?? 0) + 1), acc), { "": rows.length });
  const list = all.filter((p) => (!locale || p.locale === locale) && (!kind || p.kind === kind));
  return (
    <>
      <AdminPageHeader title="Sayfalar" description="Landing ve diğer sayfalar blok blok düzenlenir; değişiklikler “Yayınla” deyince sitede görünür." />
      <div className="p-5 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Filters name="dil" options={LOCALE_FILTERS} current={locale} other={{ tur: kind }} counts={count(byKind, "locale")} />
          <Filters name="tur" options={KIND_FILTERS} current={kind} other={{ dil: locale }} counts={count(byLocale, "kind")} />
        </div>
        {!list.length && <p className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">Bu filtreye uyan sayfa yok.</p>}
        <ul className={cn("divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-card", !list.length && "hidden")}>
          {list.map((p) => (
            <li key={p.id}>
              <Link
                href={{ pathname: "/admin/pages/[id]", params: { id: p.id } }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-2"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-surface-2 text-xs font-bold text-muted uppercase">
                  {p.locale}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-foreground">{p.title}</span>
                  <span className="block text-xs text-muted">
                    /{p.slug} · {KIND_LABELS[p.kind] ?? p.kind} · {p.updatedAt.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </span>
                {p.hasUnpublishedChanges ? (
                  <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-xs font-semibold text-warning dark:bg-[#3a2a05]">
                    Yayınlanmamış değişiklik
                  </span>
                ) : (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">Yayında</span>
                )}
                <ChevronRight className="size-4 text-muted rtl:rotate-180" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
