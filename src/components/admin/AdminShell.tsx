"use client";

// Admin panel shell. The panel is for our team only, so its texts are Turkish.
import {
  ExternalLink,
  FileText,
  Files,
  Gauge,
  HelpCircle,
  Image as ImageIcon,
  LayoutTemplate,
  Menu,
  MessageSquareQuote,
  ScrollText,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { SignOutButton } from "./SignOutButton";

export type AdminHref =
  | "/admin"
  | "/admin/pages"
  | "/admin/examples"
  | "/admin/faqs"
  | "/admin/media"
  | "/admin/templates"
  | "/admin/reviews"
  | "/admin/users"
  | "/admin/settings"
  | "/admin/audit-log";

type MenuItem = { name: string; href: AdminHref; icon: typeof Gauge; adminOnly?: boolean };
type MenuGroup = { name?: string; items: MenuItem[] };

/** Sections not built yet are simply absent rather than shown as disabled "soon" entries. */
export function adminMenu(available: ReadonlySet<AdminHref>): MenuGroup[] {
  const groups: MenuGroup[] = [
    { items: [{ name: "Genel bakış", href: "/admin", icon: Gauge }] },
    {
      name: "İçerik",
      items: [
        { name: "Sayfalar", href: "/admin/pages", icon: Files },
        { name: "Örnek CV'ler", href: "/admin/examples", icon: FileText },
        { name: "SSS", href: "/admin/faqs", icon: HelpCircle },
        { name: "Medya", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      name: "Topluluk",
      items: [
        { name: "Şablonlar", href: "/admin/templates", icon: LayoutTemplate },
        { name: "Yorumlar", href: "/admin/reviews", icon: MessageSquareQuote },
        { name: "Kullanıcılar", href: "/admin/users", icon: Users },
      ],
    },
    {
      name: "Sistem",
      items: [
        { name: "Site ayarları", href: "/admin/settings", icon: Settings, adminOnly: true },
        { name: "Günlük", href: "/admin/audit-log", icon: ScrollText },
      ],
    },
  ];
  return groups.map((g) => ({ ...g, items: g.items.filter((i) => available.has(i.href)) })).filter((g) => g.items.length);
}

const BUILT: ReadonlySet<AdminHref> = new Set<AdminHref>([
  "/admin",
  "/admin/pages",
  "/admin/examples",
  "/admin/faqs",
  "/admin/media",
  "/admin/templates",
  "/admin/reviews",
  "/admin/users",
  "/admin/settings",
  "/admin/audit-log",
]);

const ROLE_LABELS: Record<string, string> = { user: "Kullanıcı", editor: "Editör", admin: "Yönetici" };

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const drawer = useRef<HTMLDialogElement>(null);
  const isActive = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  const groups = adminMenu(BUILT).map((g) => ({ ...g, items: g.items.filter((i) => !i.adminOnly || user.role === "admin") }));

  // Navigating from the drawer closes it.
  useEffect(() => drawer.current?.close(), [pathname]);

  const nav = (
    <nav aria-label="Yönetim menüsü" className="space-y-5 px-3 py-4">
      {groups.map((g, gi) => (
        <div key={g.name ?? gi}>
          {g.name && <p className="mb-1 px-3 text-sm font-semibold text-muted">{g.name}</p>}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-md px-3 text-[15px] font-medium transition-colors pointer-fine:min-h-10",
                      active ? "bg-primary-soft text-primary-text" : "text-foreground hover:bg-surface-2",
                    )}
                  >
                    <Icon className={cn("size-[18px] shrink-0", active ? "text-primary-text" : "text-muted")} aria-hidden />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const account = (
    <div className="border-t border-border p-3">
      <div className="flex items-center gap-2 px-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-foreground">{user.name}</p>
          <p className="truncate text-sm text-muted">{ROLE_LABELS[user.role] ?? user.role}</p>
        </div>
        <ThemeToggle />
      </div>
      <div className="mt-2 flex items-center gap-1">
        <Link href="/" target="_blank" className="flex min-h-11 flex-1 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted hover:bg-surface-2 hover:text-foreground pointer-fine:min-h-9">
          <ExternalLink className="size-4" aria-hidden />
          Siteyi aç
        </Link>
        <SignOutButton label="Çıkış" />
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      {/* Desktop sidebar */}
      <aside className="hidden border-e border-border bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-5">
          <Link href="/admin" className="rounded-lg" aria-label="Yönetim paneli ana sayfa">
            <Logo />
          </Link>
          <span className="text-sm font-semibold text-muted">Yönetim</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{nav}</div>
        {account}
      </aside>

      {/* Phone and tablet: top bar with a drawer */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-surface px-2 lg:hidden">
        <button
          type="button"
          onClick={() => drawer.current?.showModal()}
          className="grid size-11 place-items-center rounded-md text-foreground hover:bg-surface-2"
          aria-label="Menüyü aç"
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <Link href="/admin" className="rounded-lg" aria-label="Yönetim paneli ana sayfa">
          <Logo />
        </Link>
        <span className="text-sm font-semibold text-muted">Yönetim</span>
      </div>
      <dialog
        ref={drawer}
        aria-label="Yönetim menüsü"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-0 h-dvh max-h-dvh w-[min(20rem,calc(100vw-3rem))] max-w-none border-e border-border bg-surface p-0 text-foreground backdrop:bg-foreground/40 lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border ps-4 pe-2">
            <Logo />
            <button type="button" onClick={() => drawer.current?.close()} className="grid size-11 place-items-center rounded-md hover:bg-surface-2" aria-label="Menüyü kapat">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{nav}</div>
          {account}
        </div>
      </dialog>

      <main className="min-w-0">{children}</main>
    </div>
  );
}
