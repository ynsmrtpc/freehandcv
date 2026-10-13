"use client";

import { useEffect } from "react";
import { authIstemci, GOOGLE_ISTEMCI_KIMLIGI } from "@/istemci/auth";

/**
 * Google One Tap: oturum yoksa sağ üstte "Ad Soyad olarak devam et" balonu çıkar. Kullanıcı
 * kapatırsa Google bir süre tekrar göstermez (Google'ın kendi bekleme kuralı). İstemci kimliği
 * tanımlı değilse hiçbir şey yapmaz. `donus`: giriş sonrası gidilecek yol.
 */
export function GoogleTekDokunus({ donus }: { donus: string }) {
  const { data, isPending } = authIstemci.useSession();

  useEffect(() => {
    if (!GOOGLE_ISTEMCI_KIMLIGI || isPending || data) return;
    const z = setTimeout(() => {
      void authIstemci.oneTap({
        fetchOptions: { onSuccess: () => window.location.assign(donus) },
      });
    }, 1200); // sayfa ilk boyandıktan sonra; ana içeriği geciktirmesin
    return () => clearTimeout(z);
  }, [data, isPending, donus]);

  return null;
}
