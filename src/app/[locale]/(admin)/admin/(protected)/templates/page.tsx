import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { BulkSelection, RowCheckbox, SelectAll } from "@/components/admin/BulkSelection";
import { AdminBody, AdminPageHeader, adminHref, Badge, EmptyState, FilterLinks, formatDate, SearchForm, Table, Td, Th, Toolbar } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { listTemplatesForAdmin, MODERATION_FILTERS, type ModerationFilter } from "@/server/admin/templates";
import { dismissReportsAction, featureTemplatesAction, hideTemplatesAction, restoreTemplatesAction, unfeatureTemplatesAction } from "./actions";
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
        title={ADMIN_CONTENT.templatesIdPageContent320}
        description={ADMIN_CONTENT.templatesPageDescription346}
      />
      <AdminBody>
        <Toolbar>
          <SearchForm value={q} placeholder={ADMIN_CONTENT.templatesPagePlaceholder347} label={ADMIN_CONTENT.templatesPageLabel348} hidden={{ durum: filter ?? "" }} />
          <FilterLinks
            label={ADMIN_CONTENT.examplesPageLabel148}
            current={filter ?? ""}
            hrefFor={(v) => href({ durum: v })}
            options={[
              { value: "", label: ADMIN_CONTENT.examplesPageLabel136 },
              { value: "reported", label: ADMIN_CONTENT.templatesPageLabel349 },
              { value: "featured", label: ADMIN_CONTENT.templatesIdPageContent318 },
              { value: "public", label: ADMIN_CONTENT.templatesLabelsPublic339 },
              { value: "unlisted", label: ADMIN_CONTENT.templatesLabelsUnlisted340 },
              { value: "hidden", label: ADMIN_CONTENT.templatesPageLabel350 },
            ]}
          />
        </Toolbar>

        {!rows.length ? (
          <EmptyState title={filter === "reported" ? ADMIN_CONTENT.templatesPageLabel351 : ADMIN_CONTENT.templatesPageLabel352}>
            {filter === "reported" ? ADMIN_CONTENT.templatesPageLabel353 : null}
          </EmptyState>
        ) : (
          <BulkSelection
            ids={rows.map((r) => r.id)}
            noun={ADMIN_CONTENT.templatesPageNoun354}
            actions={[
              { label: ADMIN_CONTENT.faqsPageLabel182, run: hideTemplatesAction, danger: true, confirm: ADMIN_CONTENT.templatesPageConfirm355 },
              { label: ADMIN_CONTENT.templatesPageLabel356, run: featureTemplatesAction },
              { label: ADMIN_CONTENT.templatesIdModerationActionsContent314, run: unfeatureTemplatesAction },
              { label: ADMIN_CONTENT.templatesIdModerationActionsContent311, run: restoreTemplatesAction },
              { label: ADMIN_CONTENT.templatesPageLabel357, run: dismissReportsAction },
            ]}
          >
            <Table label={ADMIN_CONTENT.templatesIdPageContent320}>
              <thead>
                <tr>
                  <Th className="w-12">
                    <SelectAll />
                  </Th>
                  <Th>{ADMIN_CONTENT.auditLogAuditLogTableTemplate44}</Th>
                  <Th>{ADMIN_CONTENT.examplesPageLabel148}</Th>
                  <Th className="text-end max-lg:hidden">{ADMIN_CONTENT.examplesPageContent156}</Th>
                  <Th className="max-lg:hidden">{ADMIN_CONTENT.templatesIdPageLabel329}</Th>
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
                        {r.openReports > 0 && <Badge tone="danger">{r.openReports} {ADMIN_CONTENT.templatesPageContent358}</Badge>}
                        {r.featured && <Badge tone="info">{ADMIN_CONTENT.templatesIdPageContent318}</Badge>}
                        {r.status === "hidden" ? <Badge tone="warning">{ADMIN_CONTENT.templatesIdPageContent317}</Badge> : <Badge tone={r.visibility === "public" ? "success" : "neutral"}>{VISIBILITY_NAMES[r.visibility]}</Badge>}
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
