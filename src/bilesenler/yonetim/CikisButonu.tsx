"use client";

import { useRouter } from "@/i18n/navigation";
import { authIstemci } from "@/istemci/auth";

export function CikisButonu({ etiket }: { etiket: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="rounded-lg border border-cizgi-guclu px-3 py-1.5 text-sm hover:bg-zemin"
      onClick={async () => {
        await authIstemci.signOut();
        router.replace("/yonetim/giris");
      }}
    >
      {etiket}
    </button>
  );
}
