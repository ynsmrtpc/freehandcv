"use client";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { InlineNotice, TextField, useAction } from "@/components/admin/forms";
import { buttonClass } from "@/components/ui/Button";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import type { Role } from "@/server/db/schema";
import {
  changeRoleAction,
  createUserAction,
  deleteUsersAction,
  restoreUsersAction,
  revokeSessionsAction,
  sendResetLinkAction,
  setPasswordAction,
  suspendUsersAction,
  updateUserAction,
} from "./actions";
import { ROLE_HINTS, ROLE_NAMES } from "./labels";

export function ProfileForm({ id, name: initialName, email: initialEmail }: { id: string; name: string; email: string }) {
  const t_ = useTranslations("Admin.users");
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const { notice, pending, run } = useAction();
  const dirty = name !== initialName || email !== initialEmail;
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => updateUserAction(id, { name, email }));
      }}
    >
      <TextField label={t_("fullName")} value={name} maxLength={100} onChange={(e) => setName(e.target.value)} autoComplete="off" />
      <TextField
        label={t_("email")}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="off"
        hint={t_("theEmailBecomesUnverifiedAfterAChange")}
      />
      <InlineNotice notice={notice} />
      <button type="submit" disabled={!dirty || pending} className={buttonClass("secondary", "sm")}>
        {t_("saveProfile")}</button>
    </form>
  );
}

export function RoleForm({ id, role, disabledReason }: { id: string; role: Role; disabledReason?: string }) {
  const t_ = useTranslations("Admin.users");
  const confirm = useConfirm();
  const [value, setValue] = useState<Role>(role);
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-4">
      <fieldset disabled={!!disabledReason || pending}>
        <legend className="sr-only">{t_("role")}</legend>
        <div className="divide-y divide-border rounded-lg border border-border">
          {(Object.keys(ROLE_NAMES) as Role[]).map((r) => (
            <label key={r} className={cn("flex cursor-pointer gap-3 px-4 py-3", value === r && "bg-primary-soft/60")}>
              <input type="radio" name="role" value={r} checked={value === r} onChange={() => setValue(r)} className="mt-1 size-[18px] accent-[var(--primary)]" />
              <span>
                <span className="block font-semibold text-foreground">{t_(ROLE_NAMES[r] as never)}</span>
                <span className="block text-sm text-muted">{t_(ROLE_HINTS[r] as never)}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {disabledReason && <p className="text-sm text-muted">{disabledReason}</p>}
      <InlineNotice notice={notice} />
      {!disabledReason && (
        <button
          type="button"
          disabled={value === role || pending}
          onClick={async () => {
            if (value === "admin" && !(await confirm(t_("giveThisPersonFullAdministratorAccess")))) return;
            run(() => changeRoleAction(id, value));
          }}
          className={buttonClass("secondary", "sm")}
        >
          {t_("saveRole")}</button>
      )}
    </div>
  );
}

export function PasswordPanel({ id, hasPassword }: { id: string; hasPassword: boolean }) {
  const t_ = useTranslations("Admin.users");
  const [password, setPassword] = useState("");
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[15px] text-foreground">{t_("thePersonReceivesAnEmailLinkTo")}</p>
        <button type="button" disabled={pending} onClick={() => run(() => sendResetLinkAction(id))} className={buttonClass("secondary", "sm", "mt-3")}>
          {t_("sendResetLink")}</button>
      </div>
      <form
        className="space-y-3 border-t border-border pt-5"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => setPasswordAction(id, password), () => setPassword(""));
        }}
      >
        <TextField
          label={hasPassword ? t_("setANewPassword") : t_("addPassword")}
          type="password"
          value={password}
          minLength={10}
          maxLength={128}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          spellCheck={false}
          hint={
            hasPassword
              ? t_("atLeast10CharactersSavingSignsThe")
              : t_("thisAccountUsesSocialSignInOnly")
          }
        />
        <button type="submit" disabled={password.length < 10 || pending} className={buttonClass("secondary", "sm")}>
          {t_("savePassword")}</button>
      </form>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function SessionsPanel({ id, count }: { id: string; count: number }) {
  const t_ = useTranslations("Admin.users");
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-3">
      <button type="button" disabled={!count || pending} onClick={() => run(() => revokeSessionsAction(id))} className={buttonClass("secondary", "sm")}>
        {t_("signOutAllSessions")}</button>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function SuspendPanel({ id, banned }: { id: string; banned: boolean }) {
  const t_ = useTranslations("Admin.users");
  const confirm = useConfirm();
  const [reason, setReason] = useState("");
  const { notice, pending, run } = useAction();
  return banned ? (
    <div className="space-y-3">
      <button type="button" disabled={pending} onClick={() => run(() => restoreUsersAction([id]))} className={buttonClass("secondary", "sm")}>
        {t_("restoreAccount")}</button>
      <InlineNotice notice={notice} />
    </div>
  ) : (
    <div className="space-y-3">
      <TextField label={t_("reasonOptional")} value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} hint={t_("visibleOnlyInAdministrationAndTheAudit")} />
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          if (!(await confirm(t_("suspendThisAccountAllSessionsCloseAnd"), { danger: true, title: t_("suspendAccount"), confirmLabel: t_("suspend") })))
            return;
          run(() => suspendUsersAction([id], reason));
        }}
        className={buttonClass("secondary", "sm", "text-danger hover:border-danger/50")}
      >
        {t_("suspendAccount")}</button>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function DeletePanel({ id, email, disabledReason }: { id: string; email: string; disabledReason?: string }) {
  const t_ = useTranslations("Admin.users");
  const router = useRouter();
  const [typed, setTyped] = useState("");
  const { notice, pending, run } = useAction();
  if (disabledReason) return <p className="text-[15px] text-muted">{disabledReason}</p>;
  return (
    <div className="space-y-3">
      <TextField label={t_("confirmEmail", {email})} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
      <button
        type="button"
        disabled={typed.trim().toLowerCase() !== email.toLowerCase() || pending}
        onClick={() => run(() => deleteUsersAction([id]), () => router.replace("/admin/users"))}
        className={buttonClass("primary", "sm", "bg-danger text-surface hover:bg-danger/90")}
      >
        {t_("permanentlyDeleteAccount")}</button>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function NewUserForm() {
  const t_ = useTranslations("Admin.users");
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" as Role });
  const { notice, pending, run } = useAction();
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  return (
    <form
      className="max-w-xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        run(
          () => createUserAction(form),
          (r) => {
            if ("id" in r && r.id) router.replace({ pathname: "/admin/users/[id]", params: { id: String(r.id) } });
          },
        );
      }}
    >
      <TextField label={t_("fullName")} value={form.name} maxLength={100} onChange={set("name")} autoComplete="off" />
      <TextField label={t_("email")} type="email" required value={form.email} onChange={set("email")} autoComplete="off" />
      <TextField
        label={t_("initialPassword")}
        type="password"
        required
        minLength={10}
        maxLength={128}
        value={form.password}
        onChange={set("password")}
        autoComplete="new-password"
        spellCheck={false}
        hint={t_("atLeast10CharactersShareItSecurely")}
      />
      <fieldset>
        <legend className="text-[15px] font-semibold text-foreground">{t_("role")}</legend>
        <div className="mt-1.5 divide-y divide-border rounded-lg border border-border">
          {(Object.keys(ROLE_NAMES) as Role[]).map((r) => (
            <label key={r} className={cn("flex cursor-pointer gap-3 px-4 py-3", form.role === r && "bg-primary-soft/60")}>
              <input type="radio" name="role" value={r} checked={form.role === r} onChange={() => setForm({ ...form, role: r })} className="mt-1 size-[18px] accent-[var(--primary)]" />
              <span>
                <span className="block font-semibold text-foreground">{t_(ROLE_NAMES[r] as never)}</span>
                <span className="block text-sm text-muted">{t_(ROLE_HINTS[r] as never)}</span>
              </span>
            </label>
          ))}
        </div>
        {form.role !== "user" && <p className="mt-2 text-sm text-muted">{t_("staffMustSetUpTwoFactorAuthentication")}</p>}
      </fieldset>
      <InlineNotice notice={notice} />
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        {t_("createAccount")}</button>
    </form>
  );
}
