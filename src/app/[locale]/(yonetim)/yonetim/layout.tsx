import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};

export default function YonetimLayout({ children }: LayoutProps<"/[locale]/yonetim">) {
  return <div className="min-h-dvh bg-zemin">{children}</div>;
}
