import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { listAuditLog } from "@/server/content/pages";
import { AuditLogTable } from "./AuditLogTable";

export default async function AuditLog() {
  const rows = await listAuditLog(200);
  return (
    <>
      <AdminPageHeader title={ADMIN_CONTENT.auditLogPageTitle53} description={ADMIN_CONTENT.auditLogPageDescription54} />
      <AdminBody>
        <AuditLogTable rows={rows} />
      </AdminBody>
    </>
  );
}
