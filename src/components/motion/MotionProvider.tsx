"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";

/**
 * Site-wide motion config. LazyMotion + `m` components keep the bundle small
 * (site pages should ship minimal JS, plan 6.1). `reducedMotion="user"`: when the OS
 * "reduce motion" setting is on, transform animations are disabled and only opacity remains.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
