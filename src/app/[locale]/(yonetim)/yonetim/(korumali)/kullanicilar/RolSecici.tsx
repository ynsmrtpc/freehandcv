"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { rolDegistirEylemi } from "./eylemler";

const ADLAR = { kullanici: "Kullanıcı", editor: "Editör", yonetici: "Yönetici" } as const;

export function RolSecici({
  id,
  rol,
  kendisi,
  duzenleyebilir,
}: {
  id: string;
  rol: keyof typeof ADLAR;
  kendisi: boolean;
  duzenleyebilir: boolean;
}) {
  const router = useRouter();
  const [hata, setHata] = useState("");
  const [bekliyor, gecis] = useTransition();

  if (!duzenleyebilir || kendisi)
    return (
      <span className="font-medium text-metin">
        {ADLAR[rol]}
        {kendisi && <span className="text-soluk"> (sen)</span>}
      </span>
    );

  return (
    <div>
      <select
        aria-label="Rol"
        defaultValue={rol}
        disabled={bekliyor}
        onChange={(e) => {
          const secim = e.currentTarget;
          const yeni = secim.value;
          if (yeni === "yonetici" && !confirm("Bu kişiye tüm yetkileri olan yönetici rolü verilsin mi?")) {
            secim.value = rol;
            return;
          }
          gecis(async () => {
            const s = await rolDegistirEylemi(id, yeni);
            if (s.tamam) {
              setHata("");
              router.refresh();
            } else {
              setHata(s.hata);
              secim.value = rol;
            }
          });
        }}
        className="h-9 rounded-lg border border-cizgi-guclu bg-yuzey px-2 text-sm text-metin"
      >
        {Object.entries(ADLAR).map(([k, ad]) => (
          <option key={k} value={k}>
            {ad}
          </option>
        ))}
      </select>
      {hata && (
        <p role="alert" className="mt-1 text-xs font-medium text-hata">
          {hata}
        </p>
      )}
    </div>
  );
}
