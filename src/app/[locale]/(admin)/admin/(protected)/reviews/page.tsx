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
        title="Yorumlar"
        description={`${rows.length} yorum${rows.length ? `, ortalama ${average.toFixed(1)} / 5` : ""}. Landing'de yalnız yazarın izin verdiği ve onaylanan, metni olan yorumlar görünür.`}
      />
      <AdminBody>
        {!rows.length ? (
          <EmptyState title="Henüz yorum yok.">Kullanıcılar PDF indirdikten sonra puan ve yorum bırakabilir; onay bekleyenler burada görünür.</EmptyState>
        ) : (
          <Table label="Yorumlar">
            <thead>
              <tr>
                <Th>Puan</Th>
                <Th>Yorum</Th>
                <Th className="max-md:hidden">Yazan</Th>
                <Th className="max-lg:hidden">Gösterim izni</Th>
                <Th>Durum</Th>
                <Th className="max-lg:hidden">Tarih</Th>
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
                  <Td className="max-w-md text-foreground">{r.body || <span className="text-muted">Yalnız puan</span>}</Td>
                  <Td className="max-md:hidden">
                    <p className="font-medium text-foreground">{r.userName || "Misafir"}</p>
                    <p className="text-sm text-muted">{[r.occupation, r.userEmail].filter(Boolean).join(" · ") || "—"}</p>
                  </Td>
                  <Td className="max-lg:hidden">{r.displayAllowed ? <Badge tone="success">Var</Badge> : <Badge>Yok</Badge>}</Td>
                  <Td>{r.approved ? <Badge tone="success">Yayında</Badge> : <Badge tone="warning">Bekliyor</Badge>}</Td>
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
