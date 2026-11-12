"use client";

import { useConfirm } from "@/components/ui/ConfirmProvider";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/Button";
import { setExampleActiveAction } from "./actions";

export function PublishToggle({ id, active }: { id: string; active: boolean }) {
  const confirm = useConfirm();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          if (active && !await confirm("Örnek yayından kaldırılsın mı? Sayfası 404 verir.")) return;
          startTransition(async () => {
            const r = await setExampleActiveAction(id, !active);
            if (r.ok) {
              setError("");
              router.refresh();
            } else setError(r.error);
          });
        }}
        className={buttonClass(active ? "ghost" : "secondary", "sm")}
      >
        {active ? "Yayından kaldır" : "Yayınla"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
