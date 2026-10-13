import { count, isNull } from "drizzle-orm";
import { FileText, Files, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { Link } from "@/i18n/navigation";
import { db } from "@/server/db";
import { pages, resumes, user } from "@/server/db/schema";
import { listAuditLog } from "@/server/content/pages";
import { adminStatus } from "@/server/authz";
import { AuditLogTable } from "./audit-log/AuditLogTable";

export default async function Overview() {
  const [s, [users], [savedResumes], [pageCount], recent] = await Promise.all([
    adminStatus(),
    db.select({ n: count() }).from(user),
    db.select({ n: count() }).from(resumes).where(isNull(resumes.deletedAt)),
    db.select({ n: count() }).from(pages),
    listAuditLog(8),
  ]);
  const name = s.status === "ok" ? s.user.name : "";

  const stats = [
    { label: "Kullanıcı", value: users.n, icon: Users },
    { label: "Kayıtlı CV", value: savedResumes.n, icon: FileText },
    { label: "Sayfa", value: pageCount.n, icon: Files },
  ];

  return (
    <>
      <AdminPageHeader title={`Hoş geldin, ${name}`} description="Sitenin içeriği buradan yönetilir; kod dağıtımı gerekmez." />
      <div className="space-y-8 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <stat.icon className="size-5 text-primary-text" aria-hidden />
              <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-foreground">Son değişiklikler</h2>
            <Link href="/admin/audit-log" className="text-sm font-semibold text-primary-text hover:underline">
              Tüm günlük
            </Link>
          </div>
          <AuditLogTable rows={recent} />
        </section>
      </div>
    </>
  );
}
