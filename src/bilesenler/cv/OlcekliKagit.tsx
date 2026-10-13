"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/** A4 genişliği CSS pikseli olarak (96 dpi). */
const KAGIT_PX = (210 * 96) / 25.4;

/**
 * Gerçek boyutta çizilen kâğıdı kapsayıcısının genişliğine `zoom` ile sığdırır. Sunucu HTML'i
 * `ilkOlcek` ile gelir (JS'siz de görünür); tarayıcıda kapsayıcı ölçülüp ölçek düzeltilir.
 * Ölçek DOM'a doğrudan yazılır: yeniden boyutlanmada React yeniden çizim yapmaz.
 */
export function OlcekliKagit({ children, ilkOlcek }: { children: ReactNode; ilkOlcek: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const kutu = el?.parentElement;
    if (!el || !kutu) return;
    const olc = () => {
      const g = kutu.clientWidth;
      if (g) el.style.zoom = String(g / KAGIT_PX);
    };
    olc();
    const gozlemci = new ResizeObserver(olc);
    gozlemci.observe(kutu);
    return () => gozlemci.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ zoom: ilkOlcek, width: "210mm" }}>
      {children}
    </div>
  );
}
