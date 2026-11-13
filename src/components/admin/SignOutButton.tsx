"use client";

import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/client/auth";

export function SignOutButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="flex min-h-11 items-center rounded-md px-3 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-foreground pointer-fine:min-h-9"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/admin/sign-in");
      }}
    >
      {label}
    </button>
  );
}
