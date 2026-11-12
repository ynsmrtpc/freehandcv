"use client";

import { useConfirm } from "@/components/ui/ConfirmProvider";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Role } from "@/server/db/schema";
import { changeRoleAction } from "./actions";

const ROLE_NAMES: Record<Role, string> = { user: "Kullanıcı", editor: "Editör", admin: "Yönetici" };

export function RoleSelect({
  id,
  role,
  isSelf,
  canEdit,
}: {
  id: string;
  role: Role;
  isSelf: boolean;
  canEdit: boolean;
}) {
  const confirm = useConfirm();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!canEdit || isSelf)
    return (
      <span className="font-medium text-foreground">
        {ROLE_NAMES[role]}
        {isSelf && <span className="text-muted"> (sen)</span>}
      </span>
    );

  return (
    <div>
      <select
        aria-label="Rol"
        defaultValue={role}
        disabled={pending}
        onChange={async (e) => {
          const select = e.currentTarget;
          const next = select.value;
          if (next === "admin" && !await confirm("Bu kişiye tüm yetkileri olan yönetici rolü verilsin mi?")) {
            select.value = role;
            return;
          }
          startTransition(async () => {
            const r = await changeRoleAction(id, next);
            if (r.ok) {
              setError("");
              router.refresh();
            } else {
              setError(r.error);
              select.value = role;
            }
          });
        }}
        className="h-9 rounded-lg border border-border-strong bg-surface px-2 text-sm text-foreground"
      >
        {Object.entries(ROLE_NAMES).map(([k, name]) => (
          <option key={k} value={k}>
            {name}
          </option>
        ))}
      </select>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
