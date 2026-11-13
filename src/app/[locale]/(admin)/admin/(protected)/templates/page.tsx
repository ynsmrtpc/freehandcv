import { BulkSelection, RowCheckbox, SelectAll } from "@/components/admin/BulkSelection";
import { AdminBody, AdminPageHeader, adminHref, Badge, EmptyState, FilterLinks, formatDate, SearchForm, Table, Td, Th, Toolbar } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { listTemplatesForAdmin, MODERATION_FILTERS, type ModerationFilter } from "@/server/admin/templates";
import { dismissReportsAction, hideTemplatesAction, restoreTemplatesAction } from "./actions";
import { VISIBILITY_NAMES } from "./labels";

export default async function Templates({ searchParams }: PageProps<"/[locale]/admin/templates">) {
  const sp = await searchParams;
  const filter = MODERATION_FILTERS.includes(sp.durum as ModerationFilter) ? (sp.durum as ModerationFilter) : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const rows = await listTemplatesForAdmin({ filter, search: q || undefined });
  const href = (patch: Record<string, string>) => adminHref("/admin/templates", { durum: filter, q, ...patch });

  return (
    <>
      <AdminPageHeader
        title="Şablonlar"
        description="Kullanıcıların paylaştığı şablonlar. Ön onay yok; şikâyet gelince incele ve gerekirse gizle (plan 11.5). Özel şablonlar burada görünmez."
      />
      <AdminBody>
        <Toolbar>
          <SearchForm value={q} placeholder="Şablon adı ya da @kullanıcı" label="Şablon ara" hidden={{ durum: filter ?? "" }} />
          <FilterLinks
            label="Durum"
            current={filter ?? ""}
            hrefFor={(v) => href({ durum: v })}
            options={[
              { value: "", label: "Tümü" },
              { value: "reported", label: "Şikâyet var" },
              { value: "public", label: "Galeride" },
              { value: "unlisted", label: "Bağlantıyla" },
              { value: "hidden", label: "Gizlenmiş" },
            ]}
          />
        </Toolbar>

        {!rows.length ? (
          <EmptyState title={filter === "reported" ? "Açık şikâyet yok." : "Bu filtreye uyan şablon yok."}>
            {filter === "reported" ? "Kullanıcılar bir şablonu şikâyet edince burada en üstte görünür." : null}
          </EmptyState>
        ) : (
          <BulkSelection
            ids={rows.map((r) => r.id)}
            noun="şablon"
            actions={[
              { label: "Gizle", run: hideTemplatesAction, danger: true, confirm: "{n} şablon galeriden ve sayfasından kaldırılsın mı? Sahibi şablonu kullanmaya devam eder." },
              { label: "Yeniden aç", run: restoreTemplatesAction },
              { label: "Şikâyetleri kapat", run: dismissReportsAction },
            ]}
          >
            <Table label="Şablonlar">
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>Şablon</Th>
                  <Th>Durum</Th>
                  <Th className="text-end max-lg:hidden">Kullanım</Th>
                  <Th className="max-lg:hidden">Güncellendi</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-2/60">
                    <Td>
                      <RowCheckbox id={r.id} label={r.name} />
                    </Td>
                    <Td className="max-w-96">
                      <Link href={{ pathname: "/admin/templates/[id]", params: { id: r.id } }} className="block truncate font-semibold text-foreground hover:text-primary-text">
                        {r.name}
                      </Link>
                      <p className="truncate text-sm text-muted">{r.ownerUsername ? `@${r.ownerUsername}` : r.ownerEmail}</p>
                    </Td>
                    <Td>
                      <span className="flex flex-wrap gap-1">
                        {r.openReports > 0 && <Badge tone="danger">{r.openReports} şikâyet</Badge>}
                        {r.status === "hidden" ? <Badge tone="warning">Gizlendi</Badge> : <Badge tone={r.visibility === "public" ? "success" : "neutral"}>{VISIBILITY_NAMES[r.visibility]}</Badge>}
                      </span>
                    </Td>
                    <Td className="text-end text-muted tabular-nums max-lg:hidden">{r.usageCount}</Td>
                    <Td className="whitespace-nowrap text-muted tabular-nums max-lg:hidden">{formatDate(r.updatedAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </BulkSelection>
        )}
      </AdminBody>
    </>
  );
}
