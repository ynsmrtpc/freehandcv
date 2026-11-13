"use client";

import { Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { closeAccountAction, setUsernameAction } from "@/actions/account";
import { UserMenu } from "@/components/account/UserMenu";
import { Logo } from "@/components/site/Logo";
import { buttonClass } from "@/components/ui/Button";
import { authClient } from "@/client/auth";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { normalizeUsername, USERNAME_MAX, usernameProblem } from "@/lib/username";

const input =
  "mt-1.5 block h-11 w-full rounded-xl border border-border-strong bg-surface px-3.5 text-base text-foreground outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-4 focus:ring-primary/15";

function Section({ title, description, children, danger }: { title: string; description?: string; children: React.ReactNode; danger?: boolean }) {
  const headingId = useId();
  return (
    <section
      className={cn("rounded-xl border bg-surface p-5 sm:p-6", danger ? "border-danger/30" : "border-border")}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className={cn("text-lg font-bold", danger ? "text-danger" : "text-foreground")}>
        {title}
      </h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Status({ text, error }: { text: string; error?: boolean }) {
  if (!text) return null;
  return (
    <p role={error ? "alert" : "status"} className={cn("text-sm font-medium", error ? "text-danger" : "text-accent")}>
      {text}
    </p>
  );
}

export function AccountView({
  user,
  hasPassword,
  hasGoogle,
}: {
  user: { name: string; email: string; username: string | null; isAdmin: boolean };
  hasPassword: boolean;
  hasGoogle: boolean;
}) {
  const t = useTranslations("Account");
  const router = useRouter();

  const [name, setName] = useState(user.name);
  const [nameState, setNameState] = useState<{ text: string; error?: boolean }>({ text: "" });
  const [savingName, setSavingName] = useState(false);

  const [username, setUsername] = useState(user.username ?? "");
  const [usernameState, setUsernameState] = useState<{ text: string; error?: boolean }>({ text: "" });
  const [savingUsername, setSavingUsername] = useState(false);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pwState, setPwState] = useState<{ text: string; error?: boolean }>({ text: "" });
  const [savingPw, setSavingPw] = useState(false);

  const [confirmEmail, setConfirmEmail] = useState("");
  const [closeState, setCloseState] = useState<{ text: string; error?: boolean }>({ text: "" });
  const [closing, setClosing] = useState(false);

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

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("title")}</h1>
          <p className="mt-1 break-all text-muted">{user.email}</p>
        </div>

        <Section title={t("profile.title")}>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSavingName(true);
              const r = await authClient.updateUser({ name: name.trim().slice(0, 80) }).catch(() => null);
              setSavingName(false);
              setNameState(r && !r.error ? { text: t("saved") } : { text: t("error"), error: true });
              if (r && !r.error) router.refresh();
            }}
          >
            <label className="block text-sm font-semibold text-foreground">
              {t("profile.name")}
              <input className={input} value={name} maxLength={80} autoComplete="name" onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={savingName} className={buttonClass("secondary", "sm")}>
                {savingName && <Loader2 className="size-4 animate-spin" />}
                {t("save")}
              </button>
              <Status {...nameState} />
            </div>
          </form>
          <form
            className="mt-6 space-y-4 border-t border-border pt-6"
            onSubmit={async (e) => {
              e.preventDefault();
              const value = normalizeUsername(username);
              const problem = usernameProblem(value);
              if (problem) return setUsernameState({ text: t(`username.${problem}`), error: true });
              setSavingUsername(true);
              const r = await setUsernameAction(value).catch(() => null);
              setSavingUsername(false);
              if (r?.ok) {
                setUsername(r.username);
                setUsernameState({ text: t("saved") });
                router.refresh();
              } else
                setUsernameState({
                  text: r && r.reason !== "error" && r.reason !== "unauthenticated" ? t(`username.${r.reason}`) : t("error"),
                  error: true,
                });
            }}
          >
            <label className="block text-sm font-semibold text-foreground">
              {t("username.label")}
              <span className="mt-1.5 flex items-center rounded-xl border border-border-strong bg-surface transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15">
                <span className="ps-3.5 text-base text-muted" aria-hidden>
                  @
                </span>
                <input
                  className="block h-11 w-full rounded-xl bg-transparent px-1 text-base text-foreground outline-none"
                  value={username}
                  maxLength={USERNAME_MAX}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </span>
              <span className="mt-1 block text-sm font-normal text-muted">{t("username.hint")}</span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" disabled={savingUsername} className={buttonClass("secondary", "sm")}>
                {savingUsername && <Loader2 className="size-4 animate-spin" />}
                {t("save")}
              </button>
              <Status {...usernameState} />
            </div>
          </form>
        </Section>

        <Section title={t("password.title")} description={hasPassword ? undefined : t(hasGoogle ? "password.googleOnly" : "password.none")}>
          {hasPassword && (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (next.length < 10) return setPwState({ text: t("password.tooShort"), error: true });
                setSavingPw(true);
                const r = await authClient
                  .changePassword({ currentPassword: current, newPassword: next, revokeOtherSessions: true })
                  .catch(() => null);
                setSavingPw(false);
                if (r && !r.error) {
                  setCurrent("");
                  setNext("");
                  setPwState({ text: t("password.changed") });
                } else setPwState({ text: t("password.failed"), error: true });
              }}
            >
              <label className="block text-sm font-semibold text-foreground">
                {t("password.current")}
                <input
                  className={input}
                  type="password"
                  autoComplete="current-password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
                />
              </label>
              <label className="block text-sm font-semibold text-foreground">
                {t("password.new")}
                <input
                  className={input}
                  type="password"
                  autoComplete="new-password"
                  minLength={10}
                  maxLength={128}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  required
                />
                <span className="mt-1 block text-sm font-normal text-muted">{t("password.hint")}</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" disabled={savingPw} className={buttonClass("secondary", "sm")}>
                  {savingPw && <Loader2 className="size-4 animate-spin" />}
                  {t("password.submit")}
                </button>
                <Status {...pwState} />
              </div>
            </form>
          )}
        </Section>

        <Section title={t("data.title")} description={t("data.description")}>
          {/* A plain link: the browser downloads the file with the session cookie. */}
          <a href="/api/account/export" download className={buttonClass("secondary", "sm")}>
            <Download className="size-4" />
            {t("data.download")}
          </a>
        </Section>

        <Section title={t("close.title")} description={t(user.isAdmin ? "close.admin" : "close.description")} danger>
          {!user.isAdmin && (
            <form
              className="space-y-4"
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
                setCloseState({ text: t(r?.ok === false && r.reason === "mismatch" ? "close.mismatch" : "error"), error: true });
              }}
            >
              <label className="block text-sm font-semibold text-foreground">
                {t("close.confirm", { email: user.email })}
                <input
                  className={input}
                  type="email"
                  autoComplete="off"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  required
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={closing || confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()}
                  className={buttonClass("ghost", "sm", "border border-danger/40 text-danger hover:bg-danger-soft")}
                >
                  {closing && <Loader2 className="size-4 animate-spin" />}
                  {t("close.submit")}
                </button>
                <Status {...closeState} />
              </div>
            </form>
          )}
        </Section>
      </main>
    </div>
  );
}
