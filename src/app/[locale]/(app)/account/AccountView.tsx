"use client";

import { Download, Eye, EyeOff, Loader2, Monitor, Smartphone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { closeAccountAction, setPasswordAction, setUsernameAction } from "@/actions/account";
import { GoogleLogo } from "@/components/account/GoogleLogo";
import { UserMenu } from "@/components/account/UserMenu";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { authClient } from "@/client/auth";
import { getPathname, Link, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { normalizeUsername, USERNAME_MAX, usernameProblem } from "@/lib/username";

/** Set on the account URL by the last email-change link (`?eposta=degisti`). */
const EMAIL_CHANGED_PARAM = "eposta";
const EMAIL_CHANGED_VALUE = "degisti";

const inputClass =
  "mt-1.5 block h-11 w-full rounded-lg border border-border-strong bg-surface px-3 text-base font-normal text-foreground outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-surface-2 disabled:text-muted";
const labelClass = "block text-[15px] font-semibold text-foreground";
const hintClass = "mt-1.5 block text-sm font-normal text-muted";

type Notice = { text: string; error?: boolean } | null;
type User = {
  name: string;
  email: string;
  image: string | null;
  username: string | null;
  emailVerified: boolean;
  createdAt: string;
  isAdmin: boolean;
};

/* ---------------- Building blocks ---------------- */

/**
 * A settings card: title and explanation, the fields, and a footer row with the status message on the
 * left and the card's action on the right (the same hairline-separated footer as the resume cards).
 */
function Card({
  id,
  title,
  description,
  children,
  footer,
  danger,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-6 rounded-xl border bg-surface", danger ? "border-danger/40" : "border-border")}>
      <div className="px-5 pt-5 pb-6 sm:px-6">
        <h2 id={`${id}-title`} className={cn("text-xl font-bold", danger ? "text-danger" : "text-foreground")}>
          {title}
        </h2>
        {description && <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-muted">{description}</p>}
        {children && <div className="mt-5 max-w-xl">{children}</div>}
      </div>
      {footer && <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 border-t border-border px-5 py-3 sm:px-6">{footer}</div>}
    </section>
  );
}

function Status({ notice }: { notice: Notice }) {
  return (
    <p role={notice?.error ? "alert" : "status"} className={cn("me-auto min-w-0 text-[15px] font-medium", notice?.error ? "text-danger" : "text-accent")}>
      {notice?.text}
    </p>
  );
}

function Pill({ tone, children }: { tone: "success" | "warning" | "neutral"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-sm font-semibold",
        tone === "success" && "bg-accent-soft text-accent",
        tone === "warning" && "bg-warning/12 text-warning",
        tone === "neutral" && "bg-surface-2 text-muted",
      )}
    >
      {children}
    </span>
  );
}

/** Browser and operating system from a user-agent string; good enough to recognise one's own devices. */
function describeAgent(ua: string | null | undefined) {
  if (!ua) return null;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : null;
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : null;
  if (!browser && !os) return null;
  return { browser: browser ?? "?", os: os ?? "?", mobile: /Mobi|iPhone|Android/.test(ua) };
}

/* ---------------- Page ---------------- */

export function AccountView({
  user,
  currentSessionId,
  hasPassword,
  hasGoogle,
  googleEnabled,
}: {
  user: User;
  currentSessionId: string;
  hasPassword: boolean;
  hasGoogle: boolean;
  googleEnabled: boolean;
}) {
  const t = useTranslations("Account");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  // The last link of an email change lands here; its result is shown above everything else.
  const emailResult =
    searchParams.get(EMAIL_CHANGED_PARAM) === EMAIL_CHANGED_VALUE ? (searchParams.get("error") ? "linkInvalid" : "changed") : null;
  const date = (iso: string, withTime = false) =>
    new Intl.DateTimeFormat(locale, withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "long" }).format(new Date(iso));
  const initial = (user.name || user.email).trim().charAt(0).toLocaleUpperCase(locale);

  const sections = [
    ["profile", t("nav.profile")],
    ["email", t("nav.email")],
    ["security", t("nav.security")],
    ["sessions", t("nav.sessions")],
    ["data", t("nav.data")],
    ["close", t("nav.close")],
  ] as const;

  return (
    <div className="min-h-dvh">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
          <div className="ms-auto">
            <UserMenu />
          </div>
        </div>
      </header>
      <DashboardNav current="account" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
        <p className="mt-1 text-muted">{t("subtitle")}</p>

        <div className="mt-8 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
          {/* Section outline, like the reading pages: a sticky list on desktop. */}
          <nav aria-label={t("nav.label")} className="hidden lg:block">
            <ul className="sticky top-6 space-y-0.5 border-s border-border">
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      "-ms-px flex min-h-10 items-center border-s-2 border-transparent ps-4 text-[15px] font-medium hover:border-border-strong hover:text-foreground",
                      id === "close" ? "text-danger" : "text-muted",
                    )}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0 space-y-6">
            {emailResult && (
              <p
                role={emailResult === "changed" ? "status" : "alert"}
                className={cn("rounded-xl px-4 py-3 text-[15px] font-medium", emailResult === "changed" ? "bg-accent-soft text-accent" : "bg-danger-soft text-danger")}
              >
                {t(`email.${emailResult}`)}
              </p>
            )}
            {/* Who is signed in: the facts the person checks first. */}
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-5 sm:p-6">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- Google profile photo, an external URL
                <img src={user.image} alt="" referrerPolicy="no-referrer" className="size-16 shrink-0 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid size-16 shrink-0 place-items-center rounded-full bg-primary text-2xl font-bold text-white">
                  {initial}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-xl font-bold", user.name ? "text-foreground" : "text-muted")}>{user.name || t("summary.noName")}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted">
                  <span className="break-all">{user.email}</span>
                  <Pill tone={user.emailVerified ? "success" : "warning"}>{user.emailVerified ? t("summary.verified") : t("summary.unverified")}</Pill>
                  {hasGoogle && <Pill tone="neutral">{t("summary.google")}</Pill>}
                </p>
                <p className="mt-1 text-sm text-muted">{t("summary.memberSince", { date: date(user.createdAt) })}</p>
              </div>
            </div>

            <ProfileCard user={user} />
            <EmailCard user={user} locale={locale} />
            <SecurityCard hasPassword={hasPassword} hasGoogle={hasGoogle} googleEnabled={googleEnabled} locale={locale} />
            <SessionsCard currentSessionId={currentSessionId} format={(iso) => date(iso, true)} />

            <Card
              id="data"
              title={t("data.title")}
              description={t("data.description")}
              footer={
                // A plain link: the browser downloads the file with the session cookie.
                <a href="/api/account/export" download className={buttonClass("secondary", "sm")}>
                  <Download className="size-4" aria-hidden />
                  {t("data.download")}
                </a>
              }
            />

            <CloseCard user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- Cards ---------------- */

function ProfileCard({ user }: { user: User }) {
  const t = useTranslations("Account");
  const router = useRouter();
  const nameId = useId();
  const usernameId = useId();
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username ?? "");
  const [saved, setSaved] = useState({ name: user.name, username: user.username ?? "" });
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, setPending] = useState(false);
  const dirty = name.trim() !== saved.name || normalizeUsername(username) !== saved.username;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setNotice(null);
        const nextName = name.trim().slice(0, 80);
        const nextUsername = normalizeUsername(username);
        if (nextUsername !== saved.username) {
          const problem = usernameProblem(nextUsername);
          if (problem) return setNotice({ text: t(`username.${problem}`), error: true });
        }
        setPending(true);
        try {
          if (nextName !== saved.name) {
            const r = await authClient.updateUser({ name: nextName });
            if (r.error) throw new Error();
          }
          let finalUsername = saved.username;
          if (nextUsername !== saved.username) {
            const r = await setUsernameAction(nextUsername);
            if (!r.ok)
              return setNotice({ text: r.reason !== "error" && r.reason !== "unauthenticated" ? t(`username.${r.reason}`) : t("error"), error: true });
            finalUsername = r.username;
            setUsername(r.username);
          }
          setSaved({ name: nextName, username: finalUsername });
          setNotice({ text: t("saved") });
          router.refresh();
        } catch {
          setNotice({ text: t("error"), error: true });
        } finally {
          setPending(false);
        }
      }}
    >
      <Card
        id="profile"
        title={t("profile.title")}
        description={t("profile.description")}
        footer={
          <>
            <Status notice={notice} />
            <button type="submit" disabled={pending || !dirty} className={buttonClass("primary", "sm")}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {t("save")}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label htmlFor={nameId} className={labelClass}>
              {t("profile.name")}
            </label>
            <input id={nameId} className={inputClass} value={name} maxLength={80} autoComplete="name" onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor={usernameId} className={labelClass}>
              {t("username.label")}
            </label>
            <span className="mt-1.5 flex items-center rounded-lg border border-border-strong bg-surface transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
              <span className="ps-3 text-base text-muted" aria-hidden>
                @
              </span>
              <input
                id={usernameId}
                aria-describedby={`${usernameId}-hint`}
                className="block h-11 w-full rounded-lg bg-transparent px-1 text-base text-foreground outline-none"
                value={username}
                maxLength={USERNAME_MAX}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                onChange={(e) => setUsername(e.target.value)}
              />
            </span>
            <span id={`${usernameId}-hint`} className={hintClass}>
              {t("username.hint")}
            </span>
            {saved.username && (
              <Link
                href={{ pathname: "/users/[username]", params: { username: saved.username } }}
                className="mt-2 inline-flex min-h-11 items-center text-[15px] font-semibold text-primary-text hover:underline pointer-fine:min-h-9"
              >
                {t("profile.viewProfile")}
              </Link>
            )}
          </div>
        </div>
      </Card>
    </form>
  );
}

function EmailCard({ user, locale }: { user: User; locale: Locale }) {
  const t = useTranslations("Account");
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const next = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) return setNotice({ text: t("email.invalid"), error: true });
        if (next === user.email.toLowerCase()) return setNotice({ text: t("email.same"), error: true });
        setPending(true);
        const callbackURL = `${getPathname({ href: "/account", locale })}?${EMAIL_CHANGED_PARAM}=${EMAIL_CHANGED_VALUE}`;
        const r = await authClient.changeEmail({ newEmail: next, callbackURL }).catch(() => null);
        setPending(false);
        if (r && !r.error) {
          setEmail("");
          setNotice({ text: t("email.sent", { email: user.email }) });
        } else setNotice({ text: t("error"), error: true });
      }}
    >
      <Card
        id="email"
        title={t("email.title")}
        description={t("email.description")}
        footer={
          <>
            <Status notice={notice} />
            <button type="submit" disabled={pending || !email.trim()} className={buttonClass("secondary", "sm")}>
              {pending && <Loader2 className="size-4 animate-spin" />}
              {t("email.submit")}
            </button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <p className={labelClass}>{t("email.current")}</p>
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-base text-foreground">
              <span className="break-all">{user.email}</span>
              <Pill tone={user.emailVerified ? "success" : "warning"}>{user.emailVerified ? t("summary.verified") : t("summary.unverified")}</Pill>
            </p>
          </div>
          <div>
            <label htmlFor={inputId} className={labelClass}>
              {t("email.new")}
            </label>
            <input
              id={inputId}
              type="email"
              autoComplete="email"
              aria-describedby={`${inputId}-hint`}
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span id={`${inputId}-hint`} className={hintClass}>
              {t("email.howItWorks")}
            </span>
          </div>
        </div>
      </Card>
    </form>
  );
}

function SecurityCard({
  hasPassword: initialHasPassword,
  hasGoogle: initialHasGoogle,
  googleEnabled,
  locale,
}: {
  hasPassword: boolean;
  hasGoogle: boolean;
  googleEnabled: boolean;
  locale: Locale;
}) {
  const t = useTranslations("Account");
  const confirm = useConfirm();
  const ids = { current: useId(), next: useId(), repeat: useId() };
  const [hasPassword, setHasPassword] = useState(initialHasPassword);
  const [hasGoogle, setHasGoogle] = useState(initialHasGoogle);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [methodNotice, setMethodNotice] = useState<Notice>(null);
  const mismatch = repeat.length > 0 && next !== repeat;
  const type = visible ? "text" : "password";

  return (
    <section id="security" aria-labelledby="security-title" className="scroll-mt-6 rounded-xl border border-border bg-surface">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (next.length < 10) return setNotice({ text: t("password.tooShort"), error: true });
          if (next !== repeat) return setNotice({ text: t("password.mismatch"), error: true });
          setPending(true);
          setNotice(null);
          if (hasPassword) {
            const r = await authClient.changePassword({ currentPassword: current, newPassword: next, revokeOtherSessions: true }).catch(() => null);
            setPending(false);
            if (!r || r.error) return setNotice({ text: t("password.failed"), error: true });
            setNotice({ text: t("password.changed") });
          } else {
            const r = await setPasswordAction(next).catch(() => null);
            setPending(false);
            if (!r?.ok) return setNotice({ text: r?.reason === "tooShort" ? t("password.tooShort") : t("error"), error: true });
            setHasPassword(true);
            setNotice({ text: t("password.set") });
          }
          setCurrent("");
          setNext("");
          setRepeat("");
        }}
      >
        <div className="px-5 pt-5 pb-6 sm:px-6">
          <h2 id="security-title" className="text-xl font-bold text-foreground">
            {hasPassword ? t("password.title") : t("password.setTitle")}
          </h2>
          <p className="mt-1 max-w-2xl text-[15px] leading-relaxed text-muted">{hasPassword ? t("password.description") : t("password.setDescription")}</p>
          <div className="mt-5 max-w-xl space-y-5">
            {hasPassword && (
              <div>
                <label htmlFor={ids.current} className={labelClass}>
                  {t("password.current")}
                </label>
                <input id={ids.current} className={inputClass} type={type} autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
              </div>
            )}
            <div>
              <label htmlFor={ids.next} className={labelClass}>
                {t("password.new")}
              </label>
              <input
                id={ids.next}
                className={inputClass}
                type={type}
                autoComplete="new-password"
                minLength={10}
                maxLength={128}
                aria-describedby={`${ids.next}-hint`}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
              />
              <span id={`${ids.next}-hint`} className={hintClass}>
                {t("password.hint")}
              </span>
            </div>
            <div>
              <label htmlFor={ids.repeat} className={labelClass}>
                {t("password.repeat")}
              </label>
              <input
                id={ids.repeat}
                className={cn(inputClass, mismatch && "border-danger focus:border-danger focus:ring-danger/15")}
                type={type}
                autoComplete="new-password"
                maxLength={128}
                aria-invalid={mismatch}
                aria-describedby={mismatch ? `${ids.repeat}-error` : undefined}
                value={repeat}
                onChange={(e) => setRepeat(e.target.value)}
                required
              />
              {mismatch && (
                <span id={`${ids.repeat}-error`} className="mt-1.5 block text-sm font-medium text-danger">
                  {t("password.mismatch")}
                </span>
              )}
            </div>
            <button
              type="button"
              aria-pressed={visible}
              onClick={() => setVisible((v) => !v)}
              className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-primary-text hover:underline pointer-fine:min-h-9"
            >
              {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
              {visible ? t("password.hide") : t("password.show")}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 border-t border-border px-5 py-3 sm:px-6">
          <Status notice={notice} />
          <button type="submit" disabled={pending || !next || !repeat} className={buttonClass("secondary", "sm")}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {hasPassword ? t("password.submit") : t("password.setSubmit")}
          </button>
        </div>
      </form>

      {/* Sign-in methods: ruled rows under the password form. */}
      <div className="border-t border-border px-5 pt-5 pb-5 sm:px-6">
        <h3 className="text-lg font-bold text-foreground">{t("methods.title")}</h3>
        <ul className="mt-3 max-w-xl divide-y divide-border border-y border-border">
          <li className="flex min-h-14 items-center gap-3 py-2">
            <span className="flex-1 text-[15px] font-medium text-foreground">{t("methods.password")}</span>
            <Pill tone={hasPassword ? "success" : "neutral"}>{hasPassword ? t("methods.on") : t("methods.off")}</Pill>
          </li>
          {(googleEnabled || hasGoogle) && (
            <li className="flex min-h-14 flex-wrap items-center gap-3 py-2">
              <GoogleLogo className="size-5" />
              <span className="flex-1 text-[15px] font-medium text-foreground">{t("methods.google")}</span>
              {hasGoogle ? (
                <>
                  <Pill tone="success">{t("methods.connected")}</Pill>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!hasPassword) return setMethodNotice({ text: t("methods.disconnectNeedsPassword"), error: true });
                      if (!(await confirm(t("methods.disconnectConfirm")))) return;
                      const accounts = await authClient.listAccounts().catch(() => null);
                      const google = accounts?.data?.find((a) => a.providerId === "google");
                      const r = google ? await authClient.unlinkAccount({ accountId: google.accountId }).catch(() => null) : null;
                      if (r && !r.error) {
                        setHasGoogle(false);
                        setMethodNotice({ text: t("methods.disconnected") });
                      } else setMethodNotice({ text: t("error"), error: true });
                    }}
                    className={buttonClass("ghost", "sm")}
                  >
                    {t("methods.disconnect")}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => authClient.linkSocial({ provider: "google", callbackURL: getPathname({ href: "/account", locale }) })}
                  className={buttonClass("secondary", "sm")}
                >
                  {t("methods.connect")}
                </button>
              )}
            </li>
          )}
        </ul>
        {methodNotice && (
          <p role={methodNotice.error ? "alert" : "status"} className={cn("mt-3 text-[15px] font-medium", methodNotice.error ? "text-danger" : "text-accent")}>
            {methodNotice.text}
          </p>
        )}
      </div>
    </section>
  );
}

type SessionRow = { id: string; token: string; userAgent?: string | null; ipAddress?: string | null; updatedAt: Date | string };

/** Local and empty addresses (development, unknown proxies) say nothing to the person; leave them out. */
const shownIp = (ip?: string | null) => !!ip && !/^[0:.]*$/.test(ip) && ip !== "::1" && !ip.startsWith("127.") && ip !== "local";

/** The account's sessions: this device first, then the most recently active. */
async function fetchSessions(currentSessionId: string) {
  const r = await authClient.listSessions().catch(() => null);
  const list = [...((r?.data ?? []) as SessionRow[])];
  list.sort((a, b) => Number(b.id === currentSessionId) - Number(a.id === currentSessionId) || +new Date(b.updatedAt) - +new Date(a.updatedAt));
  return list;
}

function SessionsCard({ currentSessionId, format }: { currentSessionId: string; format: (iso: string) => string }) {
  const t = useTranslations("Account");
  const confirm = useConfirm();
  const [rows, setRows] = useState<SessionRow[] | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, setPending] = useState(false);

  const load = useCallback(() => fetchSessions(currentSessionId).then(setRows), [currentSessionId]);
  useEffect(() => {
    let alive = true;
    void fetchSessions(currentSessionId).then((list) => alive && setRows(list));
    return () => {
      alive = false;
    };
  }, [currentSessionId]);

  const others = rows?.filter((s) => s.id !== currentSessionId) ?? [];

  return (
    <Card
      id="sessions"
      title={t("sessions.title")}
      description={t("sessions.description")}
      footer={
        <>
          <Status notice={notice} />
          <button
            type="button"
            disabled={pending || !others.length}
            onClick={async () => {
              if (!(await confirm(t("sessions.revokeOthersConfirm"), { danger: true, confirmLabel: t("sessions.revokeOthers") }))) return;
              setPending(true);
              const r = await authClient.revokeOtherSessions().catch(() => null);
              setPending(false);
              setNotice(r && !r.error ? { text: t("sessions.othersRevoked") } : { text: t("error"), error: true });
              void load();
            }}
            className={buttonClass("secondary", "sm")}
          >
            {t("sessions.revokeOthers")}
          </button>
        </>
      }
    >
      {rows === null ? (
        <p className="text-[15px] text-muted" aria-live="polite">
          {t("sessions.loading")}
        </p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {rows.map((s) => {
            const agent = describeAgent(s.userAgent);
            const Icon = agent?.mobile ? Smartphone : Monitor;
            const current = s.id === currentSessionId;
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                <Icon className="size-5 shrink-0 text-muted" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-foreground">
                    {agent ? t("sessions.on", { browser: agent.browser, os: agent.os }) : t("sessions.unknownDevice")}
                    {current && <Pill tone="success">{t("sessions.thisDevice")}</Pill>}
                  </p>
                  <p className="text-sm text-muted tabular-nums">
                    {t("sessions.lastActive", { time: format(new Date(s.updatedAt).toISOString()) })}
                    {shownIp(s.ipAddress) ? ` · ${s.ipAddress}` : ""}
                  </p>
                </div>
                {!current && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={async () => {
                      setPending(true);
                      const r = await authClient.revokeSession({ token: s.token }).catch(() => null);
                      setPending(false);
                      setNotice(r && !r.error ? { text: t("sessions.revoked") } : { text: t("error"), error: true });
                      void load();
                    }}
                    className={buttonClass("ghost", "sm")}
                  >
                    {t("sessions.revoke")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {rows !== null && !others.length && <p className="mt-3 text-sm text-muted">{t("sessions.onlyThis")}</p>}
    </Card>
  );
}

function CloseCard({ user }: { user: User }) {
  const t = useTranslations("Account");
  const router = useRouter();
  const inputId = useId();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [closing, setClosing] = useState(false);
  const matches = confirmEmail.trim().toLowerCase() === user.email.toLowerCase();

  if (user.isAdmin) return <Card id="close" title={t("close.title")} description={t("close.admin")} danger />;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setClosing(true);
        const r = await closeAccountAction(confirmEmail).catch(() => null);
        if (r?.ok) {
          // The sessions are already gone on the server; this clears the cookie in the browser.
          await authClient.signOut().catch(() => {});
          router.replace("/");
          router.refresh();
          return;
        }
        setClosing(false);
        setNotice({ text: t(r?.ok === false && r.reason === "mismatch" ? "close.mismatch" : "error"), error: true });
      }}
    >
      <Card
        id="close"
        title={t("close.title")}
        description={t("close.description")}
        danger
        footer={
          <>
            <Status notice={notice} />
            <button type="submit" disabled={closing || !matches} className={buttonClass("ghost", "sm", "border border-danger/40 text-danger hover:bg-danger-soft")}>
              {closing && <Loader2 className="size-4 animate-spin" />}
              {t("close.submit")}
            </button>
          </>
        }
      >
        <label htmlFor={inputId} className={labelClass}>
          {t("close.confirm", { email: user.email })}
        </label>
        <input id={inputId} className={inputClass} type="email" autoComplete="off" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required />
      </Card>
    </form>
  );
}
