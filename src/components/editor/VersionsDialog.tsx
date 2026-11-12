"use client";

import { useConfirm } from "@/components/ui/ConfirmProvider";

import { FileDown, History, Loader2, RotateCcw, Save, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createVersionAction,
  listVersionsAction,
  restoreVersionAction,
  type ResumeVersionItem,
} from "@/actions/resume";
import { buttonClass } from "@/components/ui/Button";
import { useEditor } from "@/client/editor/store";
import { cn } from "@/lib/cn";
import { IconButton, Input } from "./ui";

const LABEL_MAX = 80;

const KIND_ICON = { auto: History, manual: Save, pdf: FileDown } as const;

/** Account resumes only: lists versions, saves a named one and restores an older one (plan 5). */
export function VersionsDialog({
  resumeId,
  open,
  onClose,
  notify,
}: {
  resumeId: string;
  open: boolean;
  onClose: () => void;
  notify: (text: string) => void;
}) {
  const confirm = useConfirm();
  const t = useTranslations("Editor.versions");
  const locale = useLocale();
  const ref = useRef<HTMLDialogElement>(null);
  const [versions, setVersions] = useState<ResumeVersionItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setFailed(false);
    const r = await listVersionsAction(resumeId).catch(() => null);
    if (r?.ok) setVersions(r.versions);
    else setFailed(true);
  }, [resumeId]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setVersions(null);
      void load();
    }
    if (!open && d.open) d.close();
  }, [open, load]);

  const save = async () => {
    const data = useEditor.getState().data;
    if (!data) return;
    setBusy("save");
    const r = await createVersionAction(resumeId, data, "manual", label.trim() || undefined).catch(() => null);
    setBusy(null);
    if (!r?.ok) return notify(t("error"));
    setLabel("");
    notify(t("saved"));
    void load();
  };

  const restore = async (versionId: string) => {
    const data = useEditor.getState().data;
    if (!data || !await confirm(t("restoreConfirm"))) return;
    setBusy(versionId);
    const r = await restoreVersionAction(resumeId, versionId, data).catch(() => null);
    setBusy(null);
    if (!r?.ok) return notify(t("error"));
    // Goes through the normal editor history: Ctrl+Z brings the previous state back, autosave writes it.
    useEditor.getState().replace(r.data);
    onClose();
    notify(t("restored"));
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" });

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="versions-title"
      className="m-auto flex max-h-[min(640px,calc(100dvh-2rem))] w-[min(520px,calc(100vw-2rem))] flex-col rounded-2xl border border-border bg-surface p-0 text-foreground shadow-elevated backdrop:bg-black/50 backdrop:backdrop-blur-sm [&:not([open])]:hidden"
    >
      <div className="flex items-start gap-3 border-b border-border p-6 pb-4">
        <div className="min-w-0 flex-1">
          <h2 id="versions-title" className="text-lg font-bold">
            {t("title")}
          </h2>
          <p className="mt-1.5 text-sm text-muted">{t("description")}</p>
        </div>
        <IconButton label={t("close")} onClick={onClose} className="-me-2 -mt-1 size-9">
          <X className="size-[18px]" />
        </IconButton>
      </div>

      <form
        className="flex gap-2 border-b border-border px-6 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <Input
          value={label}
          maxLength={LABEL_MAX}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("labelPlaceholder")}
          aria-label={t("labelPlaceholder")}
          className="min-w-0 flex-1"
        />
        <button type="submit" disabled={busy !== null} className={buttonClass("primary", "sm", "shrink-0")}>
          {busy === "save" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span className="max-sm:sr-only">{t("saveCurrent")}</span>
        </button>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3" aria-busy={versions === null && !failed}>
        {failed ? (
          <p className="px-3 py-6 text-center text-sm text-danger">{t("error")}</p>
        ) : versions === null ? (
          <p className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-muted" role="status">
            <Loader2 className="size-4 animate-spin" />
            {t("loading")}
          </p>
        ) : versions.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted">{t("empty")}</p>
        ) : (
          <ul className="space-y-0.5">
            {versions.map((v) => {
              const Icon = KIND_ICON[v.kind];
              return (
                <li key={v.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-2">
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-lg",
                      v.kind === "auto" ? "bg-surface-2 text-muted" : "bg-primary-soft text-primary-text",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{v.label || formatDate(v.createdAt)}</p>
                    <p className="truncate text-xs text-muted">
                      {t(`kind.${v.kind}`)}
                      {v.label && ` · ${formatDate(v.createdAt)}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy !== null}
                    onClick={() => void restore(v.id)}
                    className={buttonClass("ghost", "sm", "shrink-0")}
                  >
                    {busy === v.id ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
                    {t("restore")}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </dialog>
  );
}
