import { ChevronRight } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Link } from "@/i18n/navigation";
import { listPages } from "@/server/content/pages";

// Page kinds are shown with the Turkish values the list always displayed.
const KIND_LABELS: Record<string, string> = { static: "sabit", guide: "rehber", legal: "yasal" };

export default async function Pages() {
  const list = await listPages();
  return (
    <>
      <AdminPageHeader title="Sayfalar" description="Landing ve diğer sayfalar blok blok düzenlenir; değişiklikler “Yayınla” deyince sitede görünür." />
      <div className="p-5 sm:p-8">
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
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
