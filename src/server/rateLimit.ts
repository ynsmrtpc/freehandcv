import "server-only";
import { headers } from "next/headers";

/** In-memory sliding window per key (client IP); enough for a single app instance. */
export function createRateLimiter(windowMs: number, max: number) {
  const hits = new Map<string, number[]>();
  return function allow(key: string, now = Date.now()) {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    const allowed = recent.length < max;
    if (allowed) recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) {
      for (const [k, times] of hits) if (!times.some((t) => now - t < windowMs)) hits.delete(k);
    }
    return allowed;
  };
}

/** The client's address as forwarded by the reverse proxy (Nginx on aaPanel). */
export function clientIp(h: Headers) {
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
}

/** For Server Actions, which have no Request object. */
export async function requestIp() {
  return clientIp(await headers());
}
