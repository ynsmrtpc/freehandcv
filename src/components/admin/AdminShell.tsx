"use client";

// Admin panel shell. The panel is for our team only, so its texts are Turkish.
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
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { SignOutButton } from "./SignOutButton";

type MenuItem = {
  name: string;
  href?: "/admin" | "/admin/pages" | "/admin/settings" | "/admin/audit-log" | "/admin/users";
  icon: typeof Gauge;
};

const MENU: MenuItem[] = [
  { name: "Genel bakış", href: "/admin", icon: Gauge },
  { name: "Sayfalar", href: "/admin/pages", icon: Files },
  { name: "Örnek CV'ler", icon: FileText },
  { name: "Şablonlar", icon: LayoutTemplate },
  { name: "SSS", icon: HelpCircle },
  { name: "Medya", icon: ImageIcon },
  { name: "Kullanıcılar", href: "/admin/users", icon: Users },
  { name: "Site ayarları", href: "/admin/settings", icon: Settings },
  { name: "Günlük", href: "/admin/audit-log", icon: ScrollText },
];

// Role badge text (shown uppercase), unchanged from the Turkish role values it used to print.
const ROLE_LABELS: Record<string, string> = { user: "kullanici", editor: "editor", admin: "yonetici" };

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="border-border bg-surface max-lg:border-b lg:sticky lg:top-0 lg:h-dvh lg:border-e">
        <div className="flex h-14 items-center justify-between px-4 lg:h-16">
          <Link href="/admin" className="rounded-lg">
            <Logo />
          </Link>
          <span className="rounded-md bg-primary-soft px-1.5 py-0.5 text-[11px] font-bold text-primary-text uppercase">
            {ROLE_LABELS[user.role] ?? user.role}
          </span>
        </div>
        <nav aria-label="Yönetim menüsü" className="px-2 pb-3 max-lg:overflow-x-auto">
          <ul className="flex gap-0.5 lg:flex-col">
            {MENU.map((item) => {
              const Icon = item.icon;
              const itemClass = "flex h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap";
              return (
                <li key={item.name}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        itemClass,
                        isActive(item.href) ? "bg-primary-soft text-primary-text" : "text-muted hover:bg-surface-2 hover:text-foreground",
                      )}
                    >
                      <Icon className="size-[18px]" aria-hidden />
                      {item.name}
                    </Link>
                  ) : (
                    <span className={cn(itemClass, "cursor-default text-muted/60")} title="Faz 1'in sonraki adımlarında">
                      <Icon className="size-[18px]" aria-hidden />
                      {item.name}
                      <span className="ms-auto rounded bg-surface-2 px-1.5 text-[10px] font-semibold max-lg:hidden">Yakında</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="absolute inset-x-0 bottom-0 hidden items-center gap-2 border-t border-border p-3 lg:flex">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          </div>
          <ThemeToggle />
          <SignOutButton label="Çıkış" />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Page title with actions on the right. */
export function AdminPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border bg-surface px-5 py-5 sm:px-8">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
