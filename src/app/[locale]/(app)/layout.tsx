import type { Metadata } from "next";
import { resumeFontClasses } from "@/components/resume/resumeFonts";

// App pages are not indexed (plan 6.1).
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AppLayout({ children }: LayoutProps<"/[locale]">) {
  return <div className={`min-h-dvh bg-background ${resumeFontClasses}`}>{children}</div>;
}
