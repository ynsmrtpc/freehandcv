import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminBody, AdminPageHeader, Badge, formatDate, FormSection } from "@/components/admin/kit";
import { Link } from "@/i18n/navigation";
import { getUserForAdmin } from "@/server/admin/users";
import { adminStatus } from "@/server/authz";
import { UserDetailsExtension } from "@/extensions/generated-server";
import { ROLE_NAMES } from "../labels";
import { DeletePanel, PasswordPanel, ProfileForm, RoleForm, SessionsPanel, SuspendPanel } from "../UserPanels";

/** A short device label from the user agent; the full string is in the title attribute. */
function device(ua: string | null, labels: { unknown: string; browser: string }) {
  if (!ua) return labels.unknown;
  const browser = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : labels.browser;
  const os = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "";
  return os ? `${browser} · ${os}` : browser;
}

export default async function UserDetail({ params }: PageProps<"/[locale]/admin/users/[id]">) {
  const t_ = await getTranslations("Admin.users");
const ACTIONS: Record<string, string> = {
  create_user: t_("accountCreated"),
  update_user: t_("profileUpdated"),
  change_role: t_("roleChanged"),
  suspend_user: t_("suspended"),
  restore_user: t_("restored"),
  set_password: t_("passwordSet"),
  send_password_reset: t_("resetLinkSent"),
  revoke_sessions: t_("sessionsRevoked"),
};
const METHODS: Record<string, string> = { credential: t_("emailAndPassword"), google: "Google" };


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
            <Badge tone={u.role === "user" ? "neutral" : "info"}>{t_(ROLE_NAMES[u.role] as never)}</Badge>
            {u.banned ? <Badge tone="danger">{t_("suspended2")}</Badge> : <Badge tone="success">{t_("active")}</Badge>}
            {isSelf && <Badge>{t_("you")}</Badge>}
          </span>
        }
      >
        <Link href="/admin/users" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t_("users")}</Link>
      </AdminPageHeader>
      <AdminBody>
        {isAdmin && <UserDetailsExtension userId={u.id} />}
        {u.banned && (
          <p role="status" className="rounded-lg bg-danger-soft px-4 py-3 text-[15px] text-danger">
            <strong className="font-semibold">{t_("thisAccountIsSuspended")}</strong>
            {u.bannedAt && ` (${formatDate(u.bannedAt, true)})`}
            {u.banReason && `: ${u.banReason}`}
          </p>
        )}

        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-y border-border py-4 text-[15px] sm:grid-cols-4">
          {[
            [t_("joined"), formatDate(u.createdAt)],
            [t_("cv"), String(u.resumeCount)],
            [t_("template"), String(u.templateCount)],
            [t_("signInMethod"), u.signInMethods.map((m) => METHODS[m] ?? m).join(", ") || "—"],
            [t_("twoFactorAuthentication"), u.twoFactorEnabled ? t_("on") : t_("off")],
            [t_("email"), u.emailVerified ? t_("verified") : t_("unverified")],
            [t_("employerSharing"), u.employerSharing ? t_("consented") : t_("off")],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="font-semibold text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        {!isAdmin ? (
          <p className="text-[15px] text-muted">{t_("onlyAdministratorsCanEditUsers")}</p>
        ) : (
          <div>
            <FormSection id="profile" title={t_("profile")}>
              <ProfileForm id={u.id} name={u.name} email={u.email} />
            </FormSection>
            <FormSection id="role" title={t_("role")} description={t_("staffRolesAccessAdministrationAndRequireTwo")}>
              <RoleForm id={u.id} role={u.role} disabledReason={isSelf ? t_("youCannotChangeYourOwnRole") : undefined} />
            </FormSection>
            <FormSection id="password" title={t_("password")}>
              <PasswordPanel id={u.id} hasPassword={u.signInMethods.includes("credential")} />
            </FormSection>
            <FormSection
              id="sessions"
              title={t_("sessions")}
              description={u.sessions.length ? `${u.sessions.length} cihazda açık oturum.` : t_("noActiveSessions")}
            >
              {u.sessions.length > 0 && (
                <ul className="mb-4 divide-y divide-border rounded-lg border border-border">
                  {u.sessions.map((x) => (
                    <li key={x.id} className="flex flex-wrap justify-between gap-x-4 px-4 py-2.5 text-[15px]" title={x.userAgent ?? undefined}>
                      <span className="text-foreground">{device(x.userAgent, {unknown: t_("unknownDevice"), browser: t_("browser")})}</span>
                      <span className="text-muted tabular-nums">{formatDate(x.updatedAt, true)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!isSelf && <SessionsPanel id={u.id} count={u.sessions.length} />}
            </FormSection>
            {!isSelf && (
              <>
                <FormSection id="status" title={u.banned ? t_("restore") : t_("suspend")} description={t_("suspendedAccountsCannotSignInTheirData")}>
                  <SuspendPanel id={u.id} banned={u.banned} />
                </FormSection>
                <FormSection id="delete" title={t_("deleteAccount")} description={t_("resumesAndVersionsAreDeletedAndPersonal")}>
                  <DeletePanel
                    id={u.id}
                    email={u.email}
                    disabledReason={u.role !== "user" ? t_("demoteStaffAccountsToUserBeforeDeleting") : undefined}
                  />
                </FormSection>
              </>
            )}
          </div>
        )}

        {u.history.length > 0 && (
          <section aria-labelledby="history-title">
            <h2 id="history-title" className="text-lg font-bold text-foreground">
              {t_("accountHistory")}</h2>
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
