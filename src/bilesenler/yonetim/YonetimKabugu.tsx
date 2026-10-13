"use client";

// Yönetim paneli kabuğu. Panel yalnız ekibimiz için olduğundan metinler Türkçedir.
import {
  FileText,
  Files,
  Gauge,
  HelpCircle,
  Image as ImageIcon,
  LayoutTemplate,
  ScrollText,
  Settings,
  Users,
} from "lucide-react";
import { Logo } from "@/bilesenler/site/Logo";
import { TemaDegistirici } from "@/bilesenler/site/TemaDegistirici";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/ortak/cn";
import { CikisButonu } from "./CikisButonu";

type Oge = {
  ad: string;
  href?: "/yonetim" | "/yonetim/sayfalar" | "/yonetim/site-ayarlari" | "/yonetim/gunluk";
  ikon: typeof Gauge;
};

const MENU: Oge[] = [
  { ad: "Genel bakış", href: "/yonetim", ikon: Gauge },
  { ad: "Sayfalar", href: "/yonetim/sayfalar", ikon: Files },
  { ad: "Örnek CV'ler", ikon: FileText },
  { ad: "Şablonlar", ikon: LayoutTemplate },
  { ad: "SSS", ikon: HelpCircle },
  { ad: "Medya", ikon: ImageIcon },
  { ad: "Kullanıcılar", ikon: Users },
  { ad: "Site ayarları", href: "/yonetim/site-ayarlari", ikon: Settings },
  { ad: "Günlük", href: "/yonetim/gunluk", ikon: ScrollText },
];

export function YonetimKabugu({
  kullanici,
  children,
}: {
  kullanici: { ad: string; rol: string };
  children: React.ReactNode;
}) {
  const yol = usePathname();
  const aktif = (href: string) => (href === "/yonetim" ? yol === href : yol.startsWith(href));

  return (
    <div className="min-h-dvh bg-zemin lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-cizgi bg-yuzey max-lg:border-b lg:sticky lg:top-0 lg:h-dvh lg:border-e">
        <div className="flex h-14 items-center justify-between px-4 lg:h-16">
          <Link href="/yonetim" className="rounded-lg">
            <Logo />
          </Link>
          <span className="rounded-md bg-ana-acik px-1.5 py-0.5 text-[11px] font-bold text-ana-metin uppercase">
            {kullanici.rol}
          </span>
        </div>
        <nav aria-label="Yönetim menüsü" className="px-2 pb-3 max-lg:overflow-x-auto">
          <ul className="flex gap-0.5 lg:flex-col">
            {MENU.map((o) => {
              const Ikon = o.ikon;
              const sinif = "flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap";
              return (
                <li key={o.ad}>
                  {o.href ? (
                    <Link
                      href={o.href}
                      aria-current={aktif(o.href) ? "page" : undefined}
                      className={cn(
                        sinif,
                        aktif(o.href) ? "bg-ana-acik text-ana-metin" : "text-soluk hover:bg-yuzey-2 hover:text-metin",
                      )}
                    >
                      <Ikon className="size-[18px]" aria-hidden />
                      {o.ad}
                    </Link>
                  ) : (
                    <span className={cn(sinif, "cursor-default text-soluk/60")} title="Faz 1'in sonraki adımlarında">
                      <Ikon className="size-[18px]" aria-hidden />
                      {o.ad}
                      <span className="ms-auto rounded bg-yuzey-2 px-1.5 text-[10px] font-semibold max-lg:hidden">Yakında</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute inset-x-0 bottom-0 hidden items-center gap-2 border-t border-cizgi p-3 lg:flex">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-metin">{kullanici.ad}</p>
          </div>
          <TemaDegistirici />
          <CikisButonu etiket="Çıkış" />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Sayfa başlığı + sağda eylemler. */
export function YonetimBaslik({
  baslik,
  aciklama,
  children,
}: {
  baslik: string;
  aciklama?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-cizgi bg-yuzey px-5 py-5 sm:px-8">
      <div>
        <h1 className="text-xl font-bold text-metin sm:text-2xl">{baslik}</h1>
        {aciklama && <p className="mt-1 text-sm text-soluk">{aciklama}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
