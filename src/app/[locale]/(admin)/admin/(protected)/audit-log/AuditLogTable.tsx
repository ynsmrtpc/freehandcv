import { EmptyState, formatDate, Table, Td, Th } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";

export const ACTION_LABELS: Record<string, string> = {
  save_draft: "Taslak kaydedildi",
  publish: "Yayınlandı",
  restore_version: "Eski sürüm taslağa alındı",
  update_site_settings: "Site ayarları değişti",
  change_role: "Rol değişti",
  approve_review: "Yorum onaylandı",
  hide_review: "Yorum gizlendi",
  create_example: "Örnek CV eklendi",
  update_example: "Örnek CV bilgileri değişti",
  publish_example: "Örnek CV yayınlandı",
  unpublish_example: "Örnek CV yayından kaldırıldı",
  delete_example: "Örnek CV silindi",
  delete_page: "Sayfa silindi",
  unpublish_page: "Sayfa yayından kaldırıldı",
  create_user: "Kullanıcı oluşturuldu",
  update_user: "Kullanıcı profili düzenlendi",
  suspend_user: "Hesap askıya alındı",
  restore_user: "Hesap yeniden açıldı",
  set_password: "Şifre belirlendi",
  send_password_reset: "Şifre sıfırlama bağlantısı gönderildi",
  revoke_sessions: "Oturumlar kapatıldı",
  delete_user: "Hesap silindi",
  close_account: "Hesap kapatıldı",
};

const TARGET_LABELS: Record<string, string> = {
  page: "Sayfa",
  site_settings: "Site ayarları",
  user: "Kullanıcı",
  site_review: "Yorum",
  example_resume: "Örnek CV",
};

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
  if (!rows.length) return <EmptyState title="Henüz kayıt yok.">Panelde yapılan her değişiklik burada kim, ne zaman bilgisiyle görünür.</EmptyState>;
  return (
    <Table label="Değişiklik günlüğü">
      <thead>
        <tr>
          <Th>Zaman</Th>
          <Th>Kişi</Th>
          <Th>İşlem</Th>
          <Th className="max-md:hidden">Hedef</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <Td className="whitespace-nowrap text-muted tabular-nums">{formatDate(r.createdAt, true)}</Td>
            <Td className="text-foreground">{r.userName || r.userEmail || "—"}</Td>
            <Td className="font-medium text-foreground">{ACTION_LABELS[r.action] ?? r.action}</Td>
            <Td className="text-muted max-md:hidden">
              {r.targetType === "user" && r.targetId ? (
                <Link href={{ pathname: "/admin/users/[id]", params: { id: r.targetId } }} className="text-primary-text hover:underline">
                  {TARGET_LABELS.user}
                </Link>
              ) : r.targetType === "page" && r.targetId ? (
                <Link href={{ pathname: "/admin/pages/[id]", params: { id: r.targetId } }} className="text-primary-text hover:underline">
                  {TARGET_LABELS.page}
                </Link>
              ) : r.targetType === "example_resume" && r.targetId ? (
                <Link href={{ pathname: "/admin/examples/[id]", params: { id: r.targetId } }} className="text-primary-text hover:underline">
                  {TARGET_LABELS.example_resume}
                </Link>
              ) : (
                (TARGET_LABELS[r.targetType] ?? r.targetType)
              )}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
