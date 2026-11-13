import { ChevronRight, UserPlus } from "lucide-react";
import { BulkSelection, RowCheckbox, SelectAll } from "@/components/admin/BulkSelection";
import {
  AdminBody,
  AdminPageHeader,
  adminHref,
  Badge,
  EmptyState,
  FilterLinks,
  formatDate,
  Pagination,
  SearchForm,
  Table,
  Td,
  Th,
  Toolbar,
} from "@/components/admin/kit";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { roles, type Role } from "@/server/db/schema";
import { listUsers, USER_STATUSES, type UserStatusFilter } from "@/server/admin/users";
import { adminStatus } from "@/server/authz";
import { deleteUsersAction, restoreUsersAction, suspendUsersAction } from "./actions";
import { ROLE_NAMES } from "./labels";

const PAGE_SIZE = 50;

export default async function Users({ searchParams }: PageProps<"/[locale]/admin/users">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 100) : "";
  const role = roles.includes(sp.rol as Role) ? (sp.rol as Role) : undefined;
  const status = USER_STATUSES.includes(sp.durum as UserStatusFilter) ? (sp.durum as UserStatusFilter) : undefined;
  const page = Math.max(0, Number(sp.sayfa) || 0);
  const [{ rows, total }, s] = await Promise.all([listUsers({ search: q, role, status, page, pageSize: PAGE_SIZE }), adminStatus()]);
  const me = s.status === "ok" ? s.user : null;
  const isAdmin = me?.role === "admin";
  const query = { q, rol: role, durum: status };
  const href = (patch: Record<string, string | number | undefined>) => adminHref("/admin/users", { ...query, ...patch });

  const list = (
    <Table label="Kullanıcılar">
      <thead>
        <tr>
          {isAdmin && (
            <Th className="w-12">
              <SelectAll />
            </Th>
          )}
          <Th>Kullanıcı</Th>
          <Th className="max-md:hidden">Rol</Th>
          <Th className="max-md:hidden">Durum</Th>
          <Th className="text-end max-lg:hidden">CV</Th>
          <Th className="max-lg:hidden">Son görülme</Th>
          <Th className="max-lg:hidden">Kayıt</Th>
          <Th className="w-10" />
        </tr>
      </thead>
      <tbody>
        {rows.map((u) => (
          <tr key={u.id} className="hover:bg-surface-2/60">
            {isAdmin && (
              <Td>
                {me?.id !== u.id && <RowCheckbox id={u.id} label={u.name || u.email} />}
              </Td>
            )}
            <Td className="max-w-80">
              <Link
                href={{ pathname: "/admin/users/[id]", params: { id: u.id } }}
                className="block truncate font-semibold text-foreground hover:text-primary-text"
              >
                {u.name || u.email}
              </Link>
              <p className="truncate text-sm text-muted">
                {u.email}
                {u.username && ` · @${u.username}`}
              </p>
              {/* Phones: role and state under the name instead of their own columns. */}
              <span className="mt-1 flex flex-wrap gap-1 md:hidden">
                {u.role !== "user" && <Badge tone="info">{ROLE_NAMES[u.role]}</Badge>}
                {u.banned && <Badge tone="danger">Askıda</Badge>}
                {u.role !== "user" && !u.twoFactorEnabled && <Badge tone="warning">2FA yok</Badge>}
              </span>
            </Td>
            <Td className="max-md:hidden">
              <Badge tone={u.role === "user" ? "neutral" : "info"}>{ROLE_NAMES[u.role]}</Badge>
            </Td>
            <Td className="max-md:hidden">
              <span className="flex flex-wrap gap-1">
                {u.banned ? <Badge tone="danger">Askıda</Badge> : <Badge tone="success">Aktif</Badge>}
                {u.role !== "user" && !u.twoFactorEnabled && <Badge tone="warning">2FA yok</Badge>}
                {!u.emailVerified && <Badge>E-posta doğrulanmadı</Badge>}
              </span>
            </Td>
            <Td className="text-end tabular-nums max-lg:hidden">{u.resumeCount}</Td>
            <Td className="whitespace-nowrap text-muted tabular-nums max-lg:hidden">{u.lastSeenAt ? formatDate(u.lastSeenAt) : "—"}</Td>
            <Td className="whitespace-nowrap text-muted tabular-nums max-lg:hidden">{formatDate(u.createdAt)}</Td>
            <Td>
              <Link
                href={{ pathname: "/admin/users/[id]", params: { id: u.id } }}
                aria-label={`Ayrıntılar: ${u.name || u.email}`}
                className="grid size-9 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      <AdminPageHeader
        title="Kullanıcılar"
        description="CV içerikleri burada görünmez (KVKK); yalnız sayıları gösterilir."
      >
        {isAdmin && (
          <Link href="/admin/users/new" className={buttonClass("primary", "sm")}>
            <UserPlus className="size-4" aria-hidden />
            Yeni kullanıcı
          </Link>
        )}
      </AdminPageHeader>
      <AdminBody>
        <Toolbar>
          <SearchForm value={q} placeholder="E-posta, ad ya da kullanıcı adı" label="Kullanıcı ara" hidden={{ rol: role ?? "", durum: status ?? "" }} />
          <FilterLinks
            label="Rol"
            current={role ?? ""}
            hrefFor={(v) => href({ rol: v || undefined, sayfa: undefined })}
            options={[{ value: "", label: "Tüm roller" }, ...roles.map((r) => ({ value: r, label: ROLE_NAMES[r] }))]}
          />
          <FilterLinks
            label="Durum"
            current={status ?? ""}
            hrefFor={(v) => href({ durum: v || undefined, sayfa: undefined })}
            options={[
              { value: "", label: "Tümü" },
              { value: "active", label: "Aktif" },
              { value: "suspended", label: "Askıda" },
              { value: "no-2fa", label: "2FA'sız ekip" },
            ]}
          />
        </Toolbar>

        <p className="text-sm text-muted" aria-live="polite">
          {total} kullanıcı{q && ` · “${q}” araması`}
        </p>

        {rows.length === 0 ? (
          <EmptyState title="Bu filtreye uyan kullanıcı yok.">
            <Link href="/admin/users" className="font-semibold text-primary-text underline underline-offset-4">
              Filtreleri temizle
            </Link>
          </EmptyState>
        ) : isAdmin ? (
          <BulkSelection
            ids={rows.filter((u) => u.id !== me?.id).map((u) => u.id)}
            noun="kullanıcı"
            actions={[
              { label: "Askıya al", run: suspendUsersAction, confirm: "{n} hesap askıya alınsın mı? Oturumları kapanır ve giriş yapamazlar." },
              { label: "Yeniden aç", run: restoreUsersAction },
              {
                label: "Sil",
                run: deleteUsersAction,
                danger: true,
                confirm: "{n} hesap kalıcı olarak silinsin mi? CV'leri silinir, kişisel bilgileri anonimleştirilir. Bu işlem geri alınamaz.",
              },
            ]}
          >
            {list}
          </BulkSelection>
        ) : (
          list
        )}

        <Pagination page={page} pageSize={PAGE_SIZE} total={total} hrefFor={(p) => href({ sayfa: p || undefined })} />
      </AdminBody>
    </>
  );
}
