const ACTION_LABELS: Record<string, string> = {
  save_draft: "Taslak kaydedildi",
  publish: "Yayınlandı",
  restore_version: "Eski sürüm taslağa alındı",
  update_site_settings: "Site ayarları değişti",
  change_role: "Rol değişti",
  approve_review: "Yorum onaylandı",
  hide_review: "Yorum gizlendi",
};

// Target types are shown with the Turkish values the table always displayed.
const TARGET_LABELS: Record<string, string> = { page: "sayfa", site_settings: "site_ayarlari", user: "kullanici", site_review: "site_yorumu" };

type Row = {
  id: string;
  action: string;
  targetType: string;
  targetId: string | null;
  createdAt: Date;
  userName: string | null;
  userEmail: string | null;
};

export function AuditLogTable({ rows }: { rows: Row[] }) {
  if (!rows.length)
    return (
      <p className="rounded-2xl border border-dashed border-border-strong p-8 text-center text-sm text-muted">
        Henüz kayıt yok.
      </p>
    );
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-start text-xs text-muted uppercase">
            <th className="px-4 py-3 text-start font-semibold">Zaman</th>
            <th className="px-4 py-3 text-start font-semibold">Kişi</th>
            <th className="px-4 py-3 text-start font-semibold">İşlem</th>
            <th className="px-4 py-3 text-start font-semibold">Hedef</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3 whitespace-nowrap text-muted tabular-nums">
                {r.createdAt.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
              </td>
              <td className="px-4 py-3 text-foreground">{r.userName || r.userEmail || "—"}</td>
              <td className="px-4 py-3 font-medium text-foreground">{ACTION_LABELS[r.action] ?? r.action}</td>
              <td className="px-4 py-3 text-muted">
                {TARGET_LABELS[r.targetType] ?? r.targetType}
                {r.targetId && <span className="ms-1 font-mono text-xs">{r.targetId.slice(0, 8)}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
