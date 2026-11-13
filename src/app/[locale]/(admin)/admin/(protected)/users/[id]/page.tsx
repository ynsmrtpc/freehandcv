import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminBody, AdminPageHeader, Badge, formatDate, FormSection } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { getUserForAdmin } from "@/server/admin/users";
import { adminStatus } from "@/server/authz";
import { ROLE_NAMES } from "../labels";
import { DeletePanel, PasswordPanel, ProfileForm, RoleForm, SessionsPanel, SuspendPanel } from "../UserPanels";

const ACTIONS: Record<string, string> = {
  create_user: "Hesap oluşturuldu",
  update_user: "Profil düzenlendi",
  change_role: "Rol değişti",
  suspend_user: "Askıya alındı",
  restore_user: "Yeniden açıldı",
  set_password: "Şifre belirlendi",
  send_password_reset: "Sıfırlama bağlantısı gönderildi",
  revoke_sessions: "Oturumlar kapatıldı",
};
const METHODS: Record<string, string> = { credential: "E-posta ve şifre", google: "Google" };

/** A short device label from the user agent; the full string is in the title attribute. */
function device(ua: string | null) {
  if (!ua) return "Bilinmeyen cihaz";
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Tarayıcı";
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${browser} · ${os}` : browser;
}

export default async function UserDetail({ params }: PageProps<"/[locale]/admin/users/[id]">) {
  const { id } = await params;
  const [u, s] = await Promise.all([getUserForAdmin(id), adminStatus()]);
  if (!u) notFound();
  const me = s.status === "ok" ? s.user : null;
  const isAdmin = me?.role === "admin";
  const isSelf = me?.id === u.id;

  return (
    <>
      <AdminPageHeader
        title={u.name || u.email}
        description={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{u.email}</span>
            {u.username && <span>· @{u.username}</span>}
            <Badge tone={u.role === "user" ? "neutral" : "info"}>{ROLE_NAMES[u.role]}</Badge>
            {u.banned ? <Badge tone="danger">Askıda</Badge> : <Badge tone="success">Aktif</Badge>}
            {isSelf && <Badge>Sen</Badge>}
          </span>
        }
      >
        <Link href="/admin/users" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          Kullanıcılar
        </Link>
      </AdminPageHeader>
      <AdminBody>
        {u.banned && (
          <p role="status" className="rounded-lg bg-danger-soft px-4 py-3 text-[15px] text-danger">
            <strong className="font-semibold">Bu hesap askıda</strong>
            {u.bannedAt && ` (${formatDate(u.bannedAt, true)})`}
            {u.banReason && `: ${u.banReason}`}
          </p>
        )}

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-border py-4 text-[15px] sm:grid-cols-4">
          {[
            ["Kayıt", formatDate(u.createdAt)],
            ["CV", String(u.resumeCount)],
            ["Şablon", String(u.templateCount)],
            ["Giriş yöntemi", u.signInMethods.map((m) => METHODS[m] ?? m).join(", ") || "—"],
            ["İki adımlı doğrulama", u.twoFactorEnabled ? "Açık" : "Kapalı"],
            ["E-posta", u.emailVerified ? "Doğrulandı" : "Doğrulanmadı"],
            ["İşveren paylaşımı", u.employerSharing ? "Onaylı" : "Kapalı"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="font-semibold text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        {!isAdmin ? (
          <p className="text-[15px] text-muted">Kullanıcıları yalnız yöneticiler düzenleyebilir.</p>
        ) : (
          <div>
            <FormSection id="profile" title="Profil">
              <ProfileForm id={u.id} name={u.name} email={u.email} />
            </FormSection>
            <FormSection id="role" title="Rol" description="Ekip rolleri yönetim paneline girer ve iki adımlı doğrulama ister.">
              <RoleForm id={u.id} role={u.role} disabledReason={isSelf ? "Kendi rolünü değiştiremezsin." : undefined} />
            </FormSection>
            <FormSection id="password" title="Şifre">
              <PasswordPanel id={u.id} hasPassword={u.signInMethods.includes("credential")} />
            </FormSection>
            <FormSection
              id="sessions"
              title="Oturumlar"
              description={u.sessions.length ? `${u.sessions.length} cihazda açık oturum.` : "Açık oturum yok."}
            >
              {u.sessions.length > 0 && (
                <ul className="mb-4 divide-y divide-border rounded-lg border border-border">
                  {u.sessions.map((x) => (
                    <li key={x.id} className="flex flex-wrap justify-between gap-x-4 px-4 py-2.5 text-[15px]" title={x.userAgent ?? undefined}>
                      <span className="text-foreground">{device(x.userAgent)}</span>
                      <span className="text-muted tabular-nums">{formatDate(x.updatedAt, true)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!isSelf && <SessionsPanel id={u.id} count={u.sessions.length} />}
            </FormSection>
            {!isSelf && (
              <>
                <FormSection id="status" title={u.banned ? "Askıyı kaldır" : "Askıya al"} description="Askıdaki hesap giriş yapamaz; verileri silinmez.">
                  <SuspendPanel id={u.id} banned={u.banned} />
                </FormSection>
                <FormSection id="delete" title="Hesabı sil" description="CV'ler ve sürümleri silinir, kişisel bilgiler anonimleştirilir. Geri alınamaz.">
                  <DeletePanel
                    id={u.id}
                    email={u.email}
                    disabledReason={u.role !== "user" ? "Ekip hesapları silinemez; önce rolünü “Kullanıcı” yap." : undefined}
                  />
                </FormSection>
              </>
            )}
          </div>
        )}

        {u.history.length > 0 && (
          <section aria-labelledby="history-title">
            <h2 id="history-title" className="text-lg font-bold text-foreground">
              Hesap geçmişi
            </h2>
            <ul className="mt-3 divide-y divide-border border-y border-border text-[15px]">
              {u.history.map((h) => (
                <li key={h.id} className="flex justify-between gap-4 py-2.5">
                  <span className="text-foreground">{ACTIONS[h.action] ?? h.action}</span>
                  <span className="text-muted tabular-nums">{formatDate(h.createdAt, true)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </AdminBody>
    </>
  );
}
