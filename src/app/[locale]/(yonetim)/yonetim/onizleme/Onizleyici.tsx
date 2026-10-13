"use client";

import { useEffect, useState } from "react";
import { HareketSaglayici } from "@/bilesenler/hareket/HareketSaglayici";
import { BlokCizici } from "@/bloklar/BlokCizici";
import type { Blok } from "@/ortak/bloklar";

export function Onizleyici() {
  const [bloklar, setBloklar] = useState<Blok[]>([]);
  const [secili, setSecili] = useState<string | null>(null);

  useEffect(() => {
    const dinle = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || e.data?.tur !== "freehandcv-onizleme") return;
      // Yarım doldurulmuş blok da çizilsin diye doğrulama hatasında da göster; yalnız biçimi denetle.
      if (Array.isArray(e.data.bloklar)) setBloklar(e.data.bloklar as Blok[]);
      setSecili(typeof e.data.secili === "string" ? e.data.secili : null);
    };
    window.addEventListener("message", dinle);
    window.parent.postMessage({ tur: "freehandcv-onizleme-hazir" }, window.location.origin);
    return () => window.removeEventListener("message", dinle);
  }, []);

  useEffect(() => {
    if (!secili) return;
    document.querySelector(`[data-blok="${CSS.escape(secili)}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [secili]);

  // Kalıcı veri olarak hiçbir zaman kullanılmaz; yalnız biçim hatalı mesajları elemek için.
  const gecerli = Array.isArray(bloklar) && bloklar.every((b) => b && typeof b === "object" && "tur" in b);

  return (
    <HareketSaglayici>
      {secili && (
        <style>{`[data-blok="${secili.replace(/[^a-z0-9]/gi, "")}"]{outline:3px solid var(--ana);outline-offset:-3px}`}</style>
      )}
      <main
        className="min-h-dvh bg-zemin [&_[data-blok]]:cursor-pointer"
        onClickCapture={(e) => {
          const hedef = e.target as HTMLElement;
          if (hedef.closest("a")) e.preventDefault();
          const blok = hedef.closest<HTMLElement>("[data-blok]");
          if (blok?.dataset.blok)
            window.parent.postMessage({ tur: "freehandcv-onizleme-sec", id: blok.dataset.blok }, window.location.origin);
        }}
      >
        {gecerli && <BlokCizici bloklar={bloklar} onizleme />}
      </main>
    </HareketSaglayici>
  );
}
