import { adminContent as ADMIN_CONTENT } from "@/lib/adminContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ADMIN_CONTENT.layoutTitle359,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/[locale]/admin">) {
  return <div className="min-h-dvh bg-background">{children}</div>;
}
