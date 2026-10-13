"use client";

import { BriefcaseBusiness, Download, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { GoogleLogo } from "@/components/account/GoogleLogo";
import { buttonClass } from "@/components/ui/Button";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { authClient, GOOGLE_CLIENT_ID } from "@/client/auth";
import { useEditor } from "@/client/editor/store";

/** Data notice always visible in the guest editor (nothing goes to the server while signed out). */
export function GuestNotice() {
  const t = useTranslations("Consent");
  const locale = useLocale() as Locale;
  return (
    <div className="editor-chrome flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-border bg-primary-soft px-4 py-2 text-center text-[13px] text-foreground">
      <span className="flex items-center gap-1.5">
        <LockKeyhole className="size-3.5 shrink-0 text-primary-text" aria-hidden />
        {t("notice")}
      </span>
      <Link
        href={{ pathname: "/sign-in", query: { next: getPathname({ href: "/dashboard", locale }) } }}
        className="font-semibold text-primary-text underline-offset-4 hover:underline"
      >
        {t("noticeLink")}
      </Link>
    </div>
  );
}

/**
 * When a guest presses "Download PDF": explains what happens on sign-in (the resume is kept in the
 * account and, with consent, can be shared with employers) and that downloading without signing in works too.
 */
export function GuestDownloadDialog({
  open,
  onClose,
  onDownloadWithoutSignIn,
}: {
  open: boolean;
  onClose: () => void;
  onDownloadWithoutSignIn: () => void;
}) {
  const t = useTranslations("Consent");
  const locale = useLocale() as Locale;
  const ref = useRef<HTMLDialogElement>(null);
  const dashboard = getPathname({ href: "/dashboard", locale });

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="guest-download-title"
      className="m-auto w-[min(520px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-0 text-foreground shadow-elevated backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <h2 id="guest-download-title" className="text-lg font-bold">
          {t("downloadTitle")}
        </h2>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="×"
          className="-me-2 -mt-1 grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-4 px-6 pt-4 text-sm leading-relaxed">
        <p className="flex gap-3">
          <BriefcaseBusiness className="mt-0.5 size-5 shrink-0 text-primary-text" aria-hidden />
          <span>{t("employerSharing")}</span>
        </p>
        <p className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
          <span className="text-muted">{t("dataUse")}</span>
        </p>
        <p className="flex gap-3 rounded-xl bg-surface-2 px-3 py-2.5">
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
          <span className="text-muted">{t("guestNoData")}</span>
        </p>
      </div>

      <div className="mt-6 space-y-2 border-t border-border px-6 py-5">
        {GOOGLE_CLIENT_ID && (
          <button
            type="button"
            onClick={async () => {
              useEditor.getState().saveNow(); // so the dashboard can move it to the account after sign-in
              await authClient.signIn.social({ provider: "google", callbackURL: dashboard });
            }}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border-strong bg-surface text-[15px] font-semibold text-foreground hover:bg-surface-2"
          >
            <GoogleLogo className="size-5" />
            {t("withGoogle")}
          </button>
        )}
        <Link
          href={{ pathname: "/sign-in", query: { next: dashboard } }}
          onClick={() => useEditor.getState().saveNow()}
          className={buttonClass(GOOGLE_CLIENT_ID ? "secondary" : "primary", "md", "w-full")}
        >
          {t("withEmail")}
        </Link>
        <button
          type="button"
          onClick={() => {
            ref.current?.close();
            onDownloadWithoutSignIn();
          }}
          className={buttonClass("ghost", "md", "w-full")}
        >
          <Download className="size-4" />
          {t("downloadWithoutSignIn")}
        </button>
      </div>
    </dialog>
  );
}
