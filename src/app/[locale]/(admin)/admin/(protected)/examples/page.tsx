import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/kit";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { guideWordCount } from "@/lib/examples";
import { cn } from "@/lib/cn";
import { listExamplesForAdmin, parseGuide } from "@/server/content/examples";
import { CATEGORY_NAMES, LEVEL_NAMES } from "./labels";
import { PublishToggle } from "./PublishToggle";

export default async function Examples() {
  const rows = await listExamplesForAdmin();
  const published = rows.filter((r) => r.active).length;

  return (
    <>
      <AdminPageHeader
        title="Örnek CV'ler"
        description={`${rows.length} örnek, ${published} yayında. Yeni taslaklar “bun run content:seed-examples” ile yayında olmayan durumda eklenir; gözden geçirip yayınla.`}
      >
        <Link href="/admin/examples/new" className={buttonClass("primary", "sm")}>
          <Plus className="size-4" />
          Yeni örnek
        </Link>
      </AdminPageHeader>
      <div className="p-5 sm:p-8">
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted uppercase">
                {["Örnek", "Kategori", "Rehber", "Kullanım", "Durum", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const words = guideWordCount(parseGuide(r.guide));
                return (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <Link
                        href={{ pathname: "/admin/examples/[id]", params: { id: r.id } }}
                        className="font-semibold text-foreground hover:text-primary-text"
                      >
                        {r.title}
                      </Link>
                      <p className="text-xs text-muted">
                        {r.locale.toUpperCase()} · /{r.slug}
                        {r.experienceLevel && ` · ${LEVEL_NAMES[r.experienceLevel] ?? r.experienceLevel}`}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{CATEGORY_NAMES[r.category] ?? r.category}</td>
                    <td className={cn("px-4 py-3 tabular-nums", words < 400 ? "text-warning" : "text-muted")}>
                      {words} kelime
                    </td>
                    <td className="px-4 py-3 text-muted tabular-nums">{r.usageCount}</td>
                    <td className="px-4 py-3">
                      {r.active ? (
                        <span className="font-medium text-accent">Yayında</span>
                      ) : (
                        <span className="text-muted">Taslak</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <PublishToggle id={r.id} active={r.active} />
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    Henüz örnek yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
