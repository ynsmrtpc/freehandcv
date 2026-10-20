import { Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
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
      <div className="p-5 sm:p-8">
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted uppercase">
                {["Puan", "Yorum", "Yazan", "Gösterim izni", "Durum", "Tarih", ""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border align-top last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex gap-0.5" aria-label={`${r.rating} / 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          aria-hidden
                          className={cn("size-3.5", n <= r.rating ? "fill-warning text-warning" : "text-border-strong")}
                        />
                      ))}
                    </span>
                  </td>
                  <td className="max-w-md px-4 py-3 text-foreground">
                    {r.body || <span className="text-muted">— (yalnız puan)</span>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{r.userName || "Misafir"}</p>
                    <p className="text-xs text-muted">
                      {[r.occupation, r.userEmail].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {r.displayAllowed ? <span className="text-accent">Var</span> : <span className="text-muted">Yok</span>}
                  </td>
                  <td className="px-4 py-3">
                    {r.approved ? (
                      <span className="font-medium text-accent">Yayında</span>
                    ) : (
                      <span className="text-muted">Bekliyor</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted tabular-nums">
                    {r.createdAt.toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3">
                    {r.body && <ApprovalButton id={r.id} approved={r.approved} displayAllowed={r.displayAllowed} />}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted">
                    Henüz yorum yok.
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
