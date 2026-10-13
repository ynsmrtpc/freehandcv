import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { redirect } from "@/i18n/navigation";
import { adminStatus } from "@/server/authz";

/**
 * Server-side check for admin pages. The session is read at request time, so callers use this
 * inside <Suspense> (Cache Components). Unauthorized users are not even shown that the area
 * exists (404).
 */
export async function AdminGuard({ children }: { children: React.ReactNode }) {
  const [s, locale] = await Promise.all([adminStatus(), getLocale()]);
  if (s.status === "signed-out") redirect({ href: "/admin/sign-in", locale });
  if (s.status === "two-factor-required") redirect({ href: "/admin/two-factor", locale });
  if (s.status === "forbidden") notFound();
  return children;
}
