import { Suspense } from "react";
import { YonetimDenetimi } from "@/bilesenler/yonetim/YonetimDenetimi";
import { Onizleyici } from "./Onizleyici";

// Sayfa düzenleyicinin iframe'i. İçerik postMessage ile gelir; kaydedilmemiş taslak da görünür.
export default function OnizlemeSayfasi() {
  return (
    <Suspense fallback={null}>
      <YonetimDenetimi>
        <Onizleyici />
      </YonetimDenetimi>
    </Suspense>
  );
}
