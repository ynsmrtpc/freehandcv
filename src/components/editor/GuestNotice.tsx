"use client";

import { ChevronDown, CloudUpload, LockKeyhole, X } from "lucide-react";
import { m } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import { InkTick } from "@/components/ui/InkMark";
import { getPathname, Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useEditor } from "@/client/editor/store";

/**
 * Data notice in the guest editor: one line, with the full disclosure (what is sent when a PDF is
 * made) one tap away rather than wrapping across the phone screen.
 */
export function GuestNotice() {
  const t = useTranslations("Consent");
  const locale = useLocale() as Locale;
  return (
    <details className="editor-chrome group shrink-0 border-b border-border bg-primary-soft text-sm text-foreground">
      <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 px-4 py-1.5 [&::-webkit-details-marker]:hidden">
        <LockKeyhole className="size-4 shrink-0 text-primary-text" aria-hidden />
        <span className="min-w-0 truncate">{t("noticeShort")}</span>
        <span className="ms-auto flex shrink-0 items-center gap-1 font-semibold text-primary-text">
          {t("noticeDetails")}
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
        </span>
      </summary>
      <div className="px-4 pb-3 leading-relaxed">
        <p className="max-w-3xl text-muted">{t("notice")}</p>
        <Link
          href={{ pathname: "/sign-in", query: { next: getPathname({ href: "/dashboard", locale }) } }}
          onClick={() => useEditor.getState().saveNow()}
          className="mt-1 inline-flex min-h-11 items-center font-semibold text-primary-text underline underline-offset-4 pointer-fine:min-h-0"
        >
          {t("noticeLink")}
        </Link>
      </div>
    </details>
  );
}

/**
 * After a PDF downloads: a quiet confirmation that names the file. Guests get one optional way to
 * keep the resume; nothing stands between them and the download.
 */
export function DownloadedCard({ file, guest, onClose }: { file: string; guest: boolean; onClose: () => void }) {
  const t = useTranslations("Editor.downloaded");
  const locale = useLocale() as Locale;
  return (
    <m.div
      role="status"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.15 } }}
      className="fixed inset-x-3 bottom-20 z-50 rounded-xl border border-border-strong bg-surface p-4 text-foreground shadow-elevated sm:inset-x-auto sm:end-6 sm:w-[24rem] lg:bottom-6"
    >
      <div className="flex items-start gap-3">
        <InkTick className="mt-0.5 text-2xl" draw delay={0.1} />
        <div className="min-w-0 flex-1">
          <p className="font-bold">{t("title")}</p>
          <p className="truncate text-sm text-muted">{file}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="-me-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-foreground pointer-fine:size-9"
        >
          <X className="size-4" />
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{guest ? t("guestText") : t("accountText")}</p>
      {guest && (
        <Link
          href={{ pathname: "/sign-in", query: { next: getPathname({ href: "/dashboard", locale }) } }}
          onClick={() => useEditor.getState().saveNow()}
          className={buttonClass("secondary", "md", "mt-3 w-full")}
        >
          <CloudUpload className="size-4" />
          {t("saveToAccount")}
        </Link>
      )}
    </m.div>
  );
}
