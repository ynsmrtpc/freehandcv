"use client";

import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/client/auth";

export function SignOutButton({ label }: { label: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="rounded-lg border border-border-strong px-3 py-1.5 text-sm hover:bg-background"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/admin/sign-in");
      }}
    >
      {label}
    </button>
  );
}
