"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { buttonClass } from "@/components/ui/Button";
import { setReviewApprovalAction } from "./actions";

export function ApprovalButton({ id, approved, displayAllowed }: { id: string; approved: boolean; displayAllowed: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!approved && !displayAllowed) return <span className="text-xs text-muted">İzin yok</span>;

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const r = await setReviewApprovalAction(id, !approved);
            if (r.ok) {
              setError("");
              router.refresh();
            } else setError(r.error);
          })
        }
        className={buttonClass(approved ? "ghost" : "secondary", "sm")}
      >
        {approved ? "Gizle" : "Onayla"}
      </button>
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
