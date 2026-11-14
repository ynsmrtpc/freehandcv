import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { BulkSelection, RowCheckbox, SelectAll } from "@/components/admin/BulkSelection";
import { AdminBody, AdminPageHeader, adminHref, EmptyState, formatDate, Pagination, SearchForm, Toolbar } from "@/components/admin/kit";
import { listMedia, MAX_UPLOAD_BYTES, mediaUrl, mediaUsage } from "@/server/media";
import { deleteMediaAction } from "./actions";
import { AltTextField, CopyUrl, MediaUploader } from "./MediaClient";

const PAGE_SIZE = 60;
const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

export default async function Media({ searchParams }: PageProps<"/[locale]/admin/media">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const page = Math.max(0, Number(sp.sayfa) || 0);
  const { rows, total } = await listMedia({ search: q || undefined, page, pageSize: PAGE_SIZE });
  const usage = await mediaUsage(rows.map((r) => r.key));

  return (
    <>
      <AdminPageHeader
        title={ADMIN_CONTENT.auditLogAuditLogTableMedia45}
        description={ADMIN_CONTENT.mediaPageDescription204}
      />
      <AdminBody>
        <MediaUploader maxMb={MAX_UPLOAD_BYTES / 1024 / 1024} />

        <Toolbar>
          <SearchForm value={q} placeholder={ADMIN_CONTENT.mediaPagePlaceholder205} label={ADMIN_CONTENT.mediaPageLabel206} />
          <p className="text-sm text-muted">{total} {ADMIN_CONTENT.mediaPageContent207}</p>
        </Toolbar>

        {!rows.length ? (
          <EmptyState title={q ? "Bu aramaya uyan dosya yok." : ADMIN_CONTENT.mediaPageLabel208}>
            {q ? null : ADMIN_CONTENT.mediaPageLabel209}
          </EmptyState>
        ) : (
          <BulkSelection
            ids={rows.map((r) => r.id)}
            noun={ADMIN_CONTENT.mediaPageContent207}
            actions={[{ label: ADMIN_CONTENT.examplesPageLabel140, run: deleteMediaAction, danger: true, confirm: ADMIN_CONTENT.mediaPageConfirm210 }]}
          >
            <div className="mb-3 flex items-center gap-3 text-[15px] text-foreground">
              <SelectAll />
              <span>{ADMIN_CONTENT.mediaPageContent211}</span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((m) => {
                const used = usage[m.key] ?? [];
                return (
                  <li key={m.id} className="flex flex-col rounded-lg border border-border bg-surface">
                    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-t-lg bg-desk">
                      {/* eslint-disable-next-line @next/next/no-img-element -- files are served as-is from the media folder */}
                      <img src={mediaUrl(m.key)} alt={m.altText ?? ""} loading="lazy" className="max-h-full max-w-full object-contain" />
                      <span className="absolute start-2 top-2 rounded-md bg-surface/95">
                        <RowCheckbox id={m.id} label={m.altText || m.key} />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-3">
                      <p className="text-sm text-muted tabular-nums">
                        {m.width && m.height ? `${m.width}×${m.height} · ` : ""}
                        {kb(m.size)} · {formatDate(m.createdAt)}
                      </p>
                      <p className="text-sm">
                        {used.length ? (
                          <span className="text-foreground" title={used.join(", ")}>
                            {ADMIN_CONTENT.mediaPageContent212}{used.slice(0, 2).join(", ")}
                            {used.length > 2 && ` +${used.length - 2}`}
                          </span>
                        ) : (
                          <span className="text-muted">{ADMIN_CONTENT.mediaPageContent213}</span>
                        )}
                      </p>
                      <AltTextField id={m.id} value={m.altText ?? ""} />
                      <CopyUrl url={mediaUrl(m.key)} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </BulkSelection>
        )}

        <Pagination page={page} pageSize={PAGE_SIZE} total={total} hrefFor={(p) => adminHref("/admin/media", { q, sayfa: p || undefined })} />
      </AdminBody>
    </>
  );
}
