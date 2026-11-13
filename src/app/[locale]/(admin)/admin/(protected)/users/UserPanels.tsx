"use client";

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
      <TextField label="Ad soyad" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} autoComplete="off" />
      <TextField
        label="E-posta"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="off"
        hint="Değiştirirsen adres doğrulanmamış sayılır: kişi bir sonraki girişinde yeni adresine gelen bağlantıyla doğrulamadan giremez."
      />
      <InlineNotice notice={notice} />
      <button type="submit" disabled={!dirty || pending} className={buttonClass("secondary", "sm")}>
        Profili kaydet
      </button>
    </form>
  );
}

export function RoleForm({ id, role, disabledReason }: { id: string; role: Role; disabledReason?: string }) {
  const confirm = useConfirm();
  const [value, setValue] = useState<Role>(role);
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-4">
      <fieldset disabled={!!disabledReason || pending}>
        <legend className="sr-only">Rol</legend>
        <div className="divide-y divide-border rounded-lg border border-border">
          {(Object.keys(ROLE_NAMES) as Role[]).map((r) => (
            <label key={r} className={cn("flex cursor-pointer gap-3 px-4 py-3", value === r && "bg-primary-soft/60")}>
              <input type="radio" name="role" value={r} checked={value === r} onChange={() => setValue(r)} className="mt-1 size-[18px] accent-[var(--primary)]" />
              <span>
                <span className="block font-semibold text-foreground">{ROLE_NAMES[r]}</span>
                <span className="block text-sm text-muted">{ROLE_HINTS[r]}</span>
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
            if (value === "admin" && !(await confirm("Bu kişiye tüm yetkileri olan yönetici rolü verilsin mi?"))) return;
            run(() => changeRoleAction(id, value));
          }}
          className={buttonClass("secondary", "sm")}
        >
          Rolü kaydet
        </button>
      )}
    </div>
  );
}

export function PasswordPanel({ id, hasPassword }: { id: string; hasPassword: boolean }) {
  const [password, setPassword] = useState("");
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[15px] text-foreground">Kişiye kendi şifresini belirleyeceği bir bağlantı e-postayla gider. Bağlantı 1 saat geçerlidir.</p>
        <button type="button" disabled={pending} onClick={() => run(() => sendResetLinkAction(id))} className={buttonClass("secondary", "sm", "mt-3")}>
          Sıfırlama bağlantısı gönder
        </button>
      </div>
      <form
        className="space-y-3 border-t border-border pt-5"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => setPasswordAction(id, password), () => setPassword(""));
        }}
      >
        <TextField
          label={hasPassword ? "Yeni şifre belirle" : "Şifre ekle"}
          type="text"
          value={password}
          minLength={10}
          maxLength={128}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          spellCheck={false}
          hint={
            hasPassword
              ? "En az 10 karakter. Kaydedince kişinin tüm oturumları kapanır; şifreyi ona güvenli bir yoldan ilet."
              : "Hesap yalnız Google ile giriyor; şifre eklersen e-postayla da girebilir."
          }
        />
        <button type="submit" disabled={password.length < 10 || pending} className={buttonClass("secondary", "sm")}>
          Şifreyi kaydet
        </button>
      </form>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function SessionsPanel({ id, count }: { id: string; count: number }) {
  const { notice, pending, run } = useAction();
  return (
    <div className="space-y-3">
      <button type="button" disabled={!count || pending} onClick={() => run(() => revokeSessionsAction(id))} className={buttonClass("secondary", "sm")}>
        Tüm oturumları kapat
      </button>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function SuspendPanel({ id, banned }: { id: string; banned: boolean }) {
  const confirm = useConfirm();
  const [reason, setReason] = useState("");
  const { notice, pending, run } = useAction();
  return banned ? (
    <div className="space-y-3">
      <button type="button" disabled={pending} onClick={() => run(() => restoreUsersAction([id]))} className={buttonClass("secondary", "sm")}>
        Hesabı yeniden aç
      </button>
      <InlineNotice notice={notice} />
    </div>
  ) : (
    <div className="space-y-3">
      <TextField label="Neden (isteğe bağlı)" value={reason} maxLength={300} onChange={(e) => setReason(e.target.value)} hint="Yalnız yönetim panelinde ve günlükte görünür." />
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          if (!(await confirm("Hesap askıya alınsın mı? Tüm oturumları kapanır ve yeniden açana kadar giriş yapamaz.", { danger: true, title: "Hesabı askıya al", confirmLabel: "Askıya al" })))
            return;
          run(() => suspendUsersAction([id], reason));
        }}
        className={buttonClass("secondary", "sm", "text-danger hover:border-danger/50")}
      >
        Hesabı askıya al
      </button>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function DeletePanel({ id, email, disabledReason }: { id: string; email: string; disabledReason?: string }) {
  const router = useRouter();
  const [typed, setTyped] = useState("");
  const { notice, pending, run } = useAction();
  if (disabledReason) return <p className="text-[15px] text-muted">{disabledReason}</p>;
  return (
    <div className="space-y-3">
      <TextField label={`Onaylamak için e-postayı yaz (${email})`} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
      <button
        type="button"
        disabled={typed.trim().toLowerCase() !== email.toLowerCase() || pending}
        onClick={() => run(() => deleteUsersAction([id]), () => router.replace("/admin/users"))}
        className={buttonClass("primary", "sm", "bg-danger text-surface hover:bg-danger/90")}
      >
        Hesabı kalıcı olarak sil
      </button>
      <InlineNotice notice={notice} />
    </div>
  );
}

export function NewUserForm() {
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
      <TextField label="Ad soyad" value={form.name} maxLength={100} onChange={set("name")} autoComplete="off" />
      <TextField label="E-posta" type="email" required value={form.email} onChange={set("email")} autoComplete="off" />
      <TextField
        label="İlk şifre"
        type="text"
        required
        minLength={10}
        maxLength={128}
        value={form.password}
        onChange={set("password")}
        autoComplete="new-password"
        spellCheck={false}
        hint="En az 10 karakter. Kişiye güvenli bir yoldan ilet; girişten sonra Hesabım sayfasından değiştirebilir."
      />
      <fieldset>
        <legend className="text-[15px] font-semibold text-foreground">Rol</legend>
        <div className="mt-1.5 divide-y divide-border rounded-lg border border-border">
          {(Object.keys(ROLE_NAMES) as Role[]).map((r) => (
            <label key={r} className={cn("flex cursor-pointer gap-3 px-4 py-3", form.role === r && "bg-primary-soft/60")}>
              <input type="radio" name="role" value={r} checked={form.role === r} onChange={() => setForm({ ...form, role: r })} className="mt-1 size-[18px] accent-[var(--primary)]" />
              <span>
                <span className="block font-semibold text-foreground">{ROLE_NAMES[r]}</span>
                <span className="block text-sm text-muted">{ROLE_HINTS[r]}</span>
              </span>
            </label>
          ))}
        </div>
        {form.role !== "user" && <p className="mt-2 text-sm text-muted">Ekip hesapları ilk girişte iki adımlı doğrulamayı kurmak zorundadır.</p>}
      </fieldset>
      <InlineNotice notice={notice} />
      <button type="submit" disabled={pending} className={buttonClass("primary", "md")}>
        Hesabı oluştur
      </button>
    </form>
  );
}
