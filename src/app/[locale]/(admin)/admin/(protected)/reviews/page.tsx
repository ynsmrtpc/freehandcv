import { adminContent as ADMIN_CONTENT, formatAdminContent } from "@/lib/adminContent";
import { Star } from "lucide-react";
import { AdminBody, AdminPageHeader, Badge, EmptyState, formatDate, Table, Td, Th } from "@/components/admin/kit";
import { cn } from "@/lib/cn";
import { listReviewsForAdmin } from "@/server/reviews";
import { ApprovalButton } from "./ApprovalButton";

export default async function Reviews() {
  const rows = await listReviewsForAdmin();
  const average = rows.length ? rows.reduce((s, r) => s + r.rating, 0) / rows.length : 0;

  return (
    <>
      <AdminPageHeader
        title={ADMIN_CONTENT.reviewsPageTitle281}
        description={formatAdminContent(ADMIN_CONTENT.reviewsPageMessage282, {value0: rows.length,value1: rows.length ? `, ortalama ${average.toFixed(1)} / 5` : ""})}
      />
      <AdminBody>
        {!rows.length ? (
          <EmptyState title={ADMIN_CONTENT.reviewsPageTitle283}>{ADMIN_CONTENT.reviewsPageContent284}</EmptyState>
        ) : (
          <Table label={ADMIN_CONTENT.reviewsPageTitle281}>
            <thead>
              <tr>
                <Th>{ADMIN_CONTENT.reviewsPageContent285}</Th>
                <Th>{ADMIN_CONTENT.auditLogAuditLogTableSiteReview41}</Th>
                <Th className="max-md:hidden">{ADMIN_CONTENT.reviewsPageContent286}</Th>
                <Th className="max-lg:hidden">{ADMIN_CONTENT.reviewsPageContent287}</Th>
                <Th>{ADMIN_CONTENT.examplesPageLabel148}</Th>
                <Th className="max-lg:hidden">{ADMIN_CONTENT.reviewsPageContent288}</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="align-top">
                  <Td>
                    <span className="flex gap-0.5" aria-label={`${r.rating} / 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} aria-hidden className={cn("size-4", n <= r.rating ? "fill-warning text-warning" : "text-border-strong")} />
                      ))}
                    </span>
                  </Td>
                  <Td className="max-w-md text-foreground">{r.body || <span className="text-muted">{ADMIN_CONTENT.reviewsPageContent289}</span>}</Td>
                  <Td className="max-md:hidden">
                    <p className="font-medium text-foreground">{r.userName || "Misafir"}</p>
                    <p className="text-sm text-muted">{[r.occupation, r.userEmail].filter(Boolean).join(" · ") || "—"}</p>
                  </Td>
                  <Td className="max-lg:hidden">{r.displayAllowed ? <Badge tone="success">{ADMIN_CONTENT.reviewsPageContent290}</Badge> : <Badge>{ADMIN_CONTENT.reviewsPageContent291}</Badge>}</Td>
                  <Td>{r.approved ? <Badge tone="success">{ADMIN_CONTENT.examplesIdPageLabel97}</Badge> : <Badge tone="warning">{ADMIN_CONTENT.reviewsPageContent292}</Badge>}</Td>
                  <Td className="whitespace-nowrap text-muted tabular-nums max-lg:hidden">{formatDate(r.createdAt)}</Td>
                  <Td>{r.body && <ApprovalButton id={r.id} approved={r.approved} displayAllowed={r.displayAllowed} />}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </AdminBody>
    </>
  );
}
