"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

/**
 * Site genelinde hareket ayarı. LazyMotion + `m` bileşenleri paketi küçük tutar
 * (site sayfalarında JS en az olmalı, plan 6.1). `reducedMotion="user"`: işletim
 * sisteminde "hareketi azalt" açıksa dönüşüm animasyonları kapanır, yalnız opaklık kalır.
 */
export function HareketSaglayici({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
