import { ArrowRight } from "lucide-react";
import { AdminBody, AdminPageHeader } from "@/components/admin/kit";
import { InkTick } from "@/components/ui/InkMark";
import { Link } from "@/i18n/navigation";
import { listAuditLog } from "@/server/content/pages";
import { getAdminOverview } from "@/server/admin/overview";
import { adminStatus } from "@/server/authz";
import { AuditLogTable } from "./audit-log/AuditLogTable";

export default async function Overview() {
  const [s, o, recent] = await Promise.all([adminStatus(), getAdminOverview(), listAuditLog(8)]);
  const name = s.status === "ok" ? s.user.name : "";

  // What needs a person's attention, most actionable first. Empty items drop out.
  const todo = [
    { n: o.openReports, text: "şablon şikâyeti inceleme bekliyor", href: "/admin/templates?durum=reported" },
    { n: o.unpublishedPages, text: "sayfada yayınlanmamış değişiklik var", href: "/admin/pages?durum=taslak" },
    { n: o.draftExamples, text: "örnek CV taslakta bekliyor", href: "/admin/examples?durum=taslak" },
    { n: o.pendingReviews, text: "yorum onay bekliyor", href: "/admin/reviews" },
  ].filter((t) => t.n > 0);

  return (
    <>
      <AdminPageHeader
        title={`Hoş geldin, ${name}`}
        description={`${o.users} kullanıcı · ${o.resumes} kayıtlı CV · ${o.publishedExamples} yayında örnek`}
      />
      <AdminBody>
        <section aria-labelledby="todo-title">
          <h2 id="todo-title" className="text-lg font-bold text-foreground">
            Bekleyen işler
          </h2>
          {todo.length ? (
            <ul className="mt-3 border-t border-border">
              {todo.map((t) => (
                <li key={t.href} className="border-b border-border">
                  <Link
                    href={t.href as never}
                    className="group flex min-h-14 items-center gap-3 py-3 text-[15px] text-foreground hover:text-primary-text"
                  >
                    <span className="w-12 text-end text-xl font-bold tabular-nums">{t.n}</span>
                    <span className="flex-1">{t.text}</span>
                    <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 rtl:rotate-180" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 flex items-center gap-2 text-[15px] text-muted">
              <InkTick className="size-5" />
              Bekleyen iş yok: tüm sayfalar yayında, taslak örnek ya da onay bekleyen yorum yok.
            </p>
          )}
        </section>

        <section aria-labelledby="recent-title">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="recent-title" className="text-lg font-bold text-foreground">
              Son değişiklikler
            </h2>
            <Link href="/admin/audit-log" className="text-[15px] font-semibold text-primary-text hover:underline">
              Tüm günlük
            </Link>
          </div>
          <AuditLogTable rows={recent} />
        </section>
      </AdminBody>
    </>
  );
}
