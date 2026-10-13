"use client";

import { FileText, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { authIstemci } from "@/istemci/auth";
import { cn } from "@/ortak/cn";

/**
 * Oturum açıksa avatar + menü (CV'lerim, Çıkış), değilse "Giriş" bağlantısı. Oturum istemcide
 * okunur; böylece site sayfaları statik kalır (plan 6.1).
 */
export function KullaniciMenusu({ className, girisGoster = true }: { className?: string; girisGoster?: boolean }) {
  const t = useTranslations("Hesap");
  const { data, isPending } = authIstemci.useSession();
  // Girişten sonra bu sayfaya dönülsün (tarayıcıdaki gerçek adres; dil öneki dahil).
  const yol = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => "/",
  );
  const router = useRouter();
  const [acik, setAcik] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!acik) return;
    const disari = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAcik(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAcik(false);
    document.addEventListener("click", disari);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", disari);
      document.removeEventListener("keydown", esc);
    };
  }, [acik]);

  if (isPending) return <span className={cn("size-9", className)} aria-hidden />;

  if (!data)
    return girisGoster ? (
      <Link
        href={{ pathname: "/giris", query: yol !== "/" && yol !== "/en" ? { sonra: yol } : {} }}
        className={cn(
          "flex h-10 items-center rounded-xl px-3 text-sm font-semibold text-metin transition-colors hover:bg-yuzey-2",
          className,
        )}
      >
        {t("girisKisa")}
      </Link>
    ) : null;

  const ad = data.user.name || data.user.email;
  const basHarf = ad.trim().charAt(0).toLocaleUpperCase();

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={t("menu")}
        aria-expanded={acik}
        aria-haspopup="menu"
        onClick={() => setAcik((a) => !a)}
        className="grid size-10 place-items-center rounded-full ring-offset-2 ring-offset-zemin hover:ring-2 hover:ring-cizgi-guclu"
      >
        {data.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.user.image} alt="" referrerPolicy="no-referrer" className="size-8 rounded-full object-cover" />
        ) : (
          <span className="grid size-8 place-items-center rounded-full bg-ana text-sm font-bold text-white">{basHarf}</span>
        )}
      </button>
      {acik && (
        <div role="menu" className="absolute end-0 top-12 z-50 w-64 rounded-xl border border-cizgi bg-yuzey p-1.5 shadow-yuksek">
          <div className="border-b border-cizgi px-3 pt-2 pb-3">
            <p className="truncate text-sm font-semibold text-metin">{data.user.name || "—"}</p>
            <p className="truncate text-xs text-soluk">{data.user.email}</p>
          </div>
          <Link
            role="menuitem"
            href="/panel"
            onClick={() => setAcik(false)}
            className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-metin hover:bg-yuzey-2"
          >
            <FileText className="size-4 text-soluk" />
            {t("panel")}
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={async () => {
              setAcik(false);
              await authIstemci.signOut();
              router.replace("/");
              router.refresh();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-metin hover:bg-yuzey-2"
          >
            <LogOut className="size-4 text-soluk" />
            {t("cikis")}
          </button>
        </div>
      )}
    </div>
  );
}
