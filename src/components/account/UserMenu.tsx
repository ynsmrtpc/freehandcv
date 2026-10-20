"use client";

import { FileText, LogOut, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { authClient } from "@/client/auth";
import { cn } from "@/lib/cn";

/**
 * With a session: avatar + menu (My resumes, Sign out); otherwise a "Sign in" link. The session is
 * read on the client so site pages stay static (plan 6.1).
 */
export function UserMenu({ className, showSignIn = true }: { className?: string; showSignIn?: boolean }) {
  const t = useTranslations("Auth");
  const { data, isPending } = authClient.useSession();
  // Return to this page after sign-in (the real browser path, locale prefix included).
  const path = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname,
    () => "/",
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onOutsideClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onEscape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onOutsideClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("click", onOutsideClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (isPending) return <span className={cn("size-9", className)} aria-hidden />;

  if (!data)
    return showSignIn ? (
      <Link
        href={{ pathname: "/sign-in", query: path !== "/" && path !== "/en" ? { next: path } : {} }}
        className={cn(
          "flex h-10 items-center rounded-xl px-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2",
          className,
        )}
      >
        {t("signInShort")}
      </Link>
    ) : null;

  const displayName = data.user.name || data.user.email;
  const initial = displayName.trim().charAt(0).toLocaleUpperCase();

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={t("menu")}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-full ring-offset-2 ring-offset-background hover:ring-2 hover:ring-border-strong"
      >
        {data.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.user.image} alt="" referrerPolicy="no-referrer" className="size-8 rounded-full object-cover" />
        ) : (
          <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-white">{initial}</span>
        )}
      </button>
      {open && (
        <div role="menu" className="absolute end-0 top-12 z-50 w-64 rounded-xl border border-border bg-surface p-1.5 shadow-elevated">
          <div className="border-b border-border px-3 pt-2 pb-3">
            <p className="truncate text-sm font-semibold text-foreground">{data.user.name || "—"}</p>
            <p className="truncate text-xs text-muted">{data.user.email}</p>
          </div>
          <Link
            role="menuitem"
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2"
          >
            <FileText className="size-4 text-muted" />
            {t("dashboard")}
          </Link>
          <Link
            role="menuitem"
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-2"
          >
            <UserRound className="size-4 text-muted" />
            {t("account")}
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={async () => {
              setOpen(false);
              await authClient.signOut();
              router.replace("/");
              router.refresh();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-foreground hover:bg-surface-2"
          >
            <LogOut className="size-4 text-muted" />
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
