import { Suspense } from "react";
import { YonetimDenetimi } from "@/bilesenler/yonetim/YonetimDenetimi";
import { YonetimKabugu } from "@/bilesenler/yonetim/YonetimKabugu";
import { yonetimDurumu } from "@/sunucu/yetki";

// Oturum istek zamanında okunduğu için denetim Suspense içinde yapılır (Cache Components).
// Denetim çocukları ancak yetki doğrulanınca çizer; bu yüzden alt sayfalar hiç ön-render edilmez.
export default function KorumaliLayout({ children }: LayoutProps<"/[locale]/yonetim">) {
  return (
    <Suspense fallback={null}>
      <YonetimDenetimi>
        <Kabuk>{children}</Kabuk>
      </YonetimDenetimi>
    </Suspense>
  );
}

async function Kabuk({ children }: { children: React.ReactNode }) {
  const d = await yonetimDurumu();
  if (d.durum !== "tamam") return null;
  return <YonetimKabugu kullanici={{ ad: d.kullanici.ad, rol: d.kullanici.rol }}>{children}</YonetimKabugu>;
}
