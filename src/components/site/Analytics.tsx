"use client";
import Script from "next/script";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "@/i18n/navigation";
import { isAnalyticsPath } from "@/lib/analytics";
import { useLocale } from "next-intl";

export function Analytics({ source, websiteId }: { source: string; websiteId: string }) {
  const pathname = usePathname(), [ready, setReady] = useState(false);
  const locale = useLocale();
  const optedOut = useSyncExternalStore(() => () => {}, () => navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true, () => true);
  const allowed = isAnalyticsPath(pathname) && !optedOut;
  useEffect(() => {
    if (!allowed || !ready) return;
    const tracker = (window as Window & { umami?: { track: (data: Record<string, string>) => void } }).umami;
    // Never send query strings, referrers, account IDs, CV content or user-supplied form fields.
    tracker?.track({ website: websiteId, url: window.location.pathname, title: pathname, referrer: "" });
  }, [allowed, ready, pathname, websiteId, locale]);
  return allowed ? <Script src={source} data-website-id={websiteId} data-auto-track="false" data-auto-pageview="false" data-do-not-track="true" strategy="afterInteractive" onReady={() => setReady(true)} /> : null;
}
