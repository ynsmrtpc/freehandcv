import { AdminPageHeader } from "@/components/admin/kit";
import { listAuditLog } from "@/server/content/pages";
import { AuditLogTable } from "./AuditLogTable";

export default async function AuditLog() {
  const rows = await listAuditLog(200);
  return (
    <>
      <AdminPageHeader title="Günlük" description="Kim, neyi, ne zaman değiştirdi (son 200 kayıt)." />
      <div className="p-5 sm:p-8">
        <AuditLogTable rows={rows} />
      </div>
    </>
  );
}
