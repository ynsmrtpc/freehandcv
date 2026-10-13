import { Search } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminShell";
import { listUsers } from "@/server/admin/users";
import { adminStatus } from "@/server/authz";
import { RoleSelect } from "./RoleSelect";

export default async function Users({ searchParams }: PageProps<"/[locale]/admin/users">) {
  const { q } = await searchParams;
  const search = typeof q === "string" ? q.slice(0, 100) : "";
  const [{ rows, total }, s] = await Promise.all([listUsers(search), adminStatus()]);
  const me = s.status === "ok" ? s.user : null;

  return (
    <>
      <AdminPageHeader
        title="Kullanıcılar"
        description={`${total} kullanıcı. CV içerikleri burada görünmez (KVKK); yalnız sayıları gösterilir.`}
      >
        <form role="search" className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            name="q"
            defaultValue={search}
            placeholder="E-posta, ad ya da kullanıcı adı"
            aria-label="Kullanıcı ara"
            className="h-10 w-72 rounded-lg border border-border-strong bg-surface ps-9 pe-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        </form>
      </AdminPageHeader>
      <div className="p-5 sm:p-8">
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted uppercase">
                {["Kullanıcı", "Rol", "2FA", "CV", "İşveren paylaşımı", "Kayıt"].map((h) => (
                  <th key={h} className="px-4 py-3 text-start font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{u.name || "—"}</p>
                    <p className="text-xs text-muted">
                      {u.email}
                      {u.username && ` · @${u.username}`}
                      {!u.emailVerified && " · e-posta doğrulanmadı"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <RoleSelect
                      id={u.id}
                      role={u.role}
                      isSelf={me?.id === u.id}
                      canEdit={me?.role === "admin"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {u.twoFactorEnabled ? <span className="text-accent">Açık</span> : <span className="text-muted">Kapalı</span>}
                  </td>
                  <td className="px-4 py-3 text-foreground tabular-nums">{u.resumeCount}</td>
                  <td className="px-4 py-3">
                    {u.employerSharing ? <span className="font-medium text-accent">Onaylı</span> : <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted tabular-nums">
                    {u.createdAt.toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    Kullanıcı bulunamadı.
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
