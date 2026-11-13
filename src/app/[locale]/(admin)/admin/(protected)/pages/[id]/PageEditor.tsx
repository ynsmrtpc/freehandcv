"use client";

import { useConfirm } from "@/components/ui/ConfirmProvider";

import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  History,
  Laptop,
  Loader2,
  Plus,
  Smartphone,
  Tablet,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Input, IconButton, Textarea, Checkbox } from "@/components/editor/ui";
import { buttonClass } from "@/components/ui/Button";
import { SchemaForm, pathKey, type FieldErrors } from "@/components/admin/SchemaForm";
import { getPathname, Link } from "@/i18n/navigation";
import {
  BLOCK_NAMES,
  BLOCK_SCHEMAS,
  BLOCK_TYPES,
  blockListSchema,
  blockSettingsSchema,
  newBlock,
  type Block,
  type BlockType,
} from "@/lib/blocks";
import { cn } from "@/lib/cn";
import { restoreVersionAction, saveDraftAction, publishAction, type ActionResult } from "../actions";

type Meta = { title: string; metaTitle: string; metaDescription: string; indexable: boolean };
type Page = {
  id: string;
  slug: string;
  locale: string;
  kind: string;
  version: number;
  meta: Meta;
  blocks: Block[];
  hasUnpublishedChanges: boolean;
};
type Version = { id: string; createdAt: string; publishedBy: string };
type Notice = { kind: "success" | "error"; text: string };

const WIDTHS = { desktop: "100%", tablet: "820px", mobile: "390px" } as const;

// After saving, the editor is rebuilt with the new version (key = version); the success message
// is parked outside the component so it survives that rebuild.
let pendingNotice: Notice | null = null;

/** Keys server or client validation issues as "blocks.2.content.title". */
function mapIssues(issues: { path: (string | number)[]; message: string }[]): FieldErrors {
  return Object.fromEntries(issues.map((i) => [pathKey(i.path), i.message]));
}

export function PageEditor({ page, versions }: { page: Page; versions: Version[] }) {
  const confirm = useConfirm();
  const router = useRouter();
  const [blocks, setBlocks] = useState(page.blocks);
  const [meta, setMeta] = useState(page.meta);
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"blocks" | "settings">("blocks");
  const [width, setWidth] = useState<keyof typeof WIDTHS>("desktop");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState<Notice | null>(() => {
    const n = pendingNotice;
    pendingNotice = null;
    return n;
  });
  const [pending, startTransition] = useTransition();
  const [versionsOpen, setVersionsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const dirty = useMemo(
    () => JSON.stringify({ blocks, meta }) !== JSON.stringify({ blocks: page.blocks, meta: page.meta }),
    [blocks, meta, page],
  );

  // Warn when leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Live preview: send the blocks to the iframe once it is ready and on every change.
  const send = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "freehandcv-preview", blocks, selected, kind: page.kind, slug: page.slug, title: meta.title },
      window.location.origin,
    );
  }, [blocks, selected, page.kind, page.slug, meta.title]);
  useEffect(() => {
    const timer = setTimeout(send, 120);
    return () => clearTimeout(timer);
  }, [send]);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "freehandcv-preview-ready") send();
      if (e.data?.type === "freehandcv-preview-select" && typeof e.data.id === "string") {
        setTab("blocks");
        setSelected(e.data.id);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [send]);

  const handleResult = (r: ActionResult, success: string) => {
    if (r.ok) {
      setErrors({});
      setNotice({ kind: "success", text: success });
      pendingNotice = { kind: "success", text: success };
      router.refresh();
      return true;
    }
    setErrors(mapIssues(r.issues ?? []));
    setNotice({ kind: "error", text: r.error });
    return false;
  };

  const validateOnClient = () => {
    const b = blockListSchema.safeParse(blocks);
    if (b.success) return true;
    setErrors(mapIssues(b.error.issues.map((i) => ({ path: ["blocks", ...(i.path as (string | number)[])], message: i.message }))));
    setNotice({ kind: "error", text: "Bazı alanlar hatalı; kırmızı alanları düzelt." });
    return false;
  };

  const save = (then?: () => Promise<ActionResult>) =>
    startTransition(async () => {
      if (!validateOnClient()) return;
      let version = page.version;
      if (dirty) {
        const r = await saveDraftAction(page.id, blocks, meta, page.version);
        if (!r.ok) return void handleResult(r, "");
        version = r.version ?? version;
      }
      if (then) handleResult(await then(), "Yayınlandı. Ziyaretçiler yeni içeriği görüyor.");
      else handleResult({ ok: true, version }, "Taslak kaydedildi. Sitede görünmesi için yayınla.");
    });

  const updateBlock = (id: string, f: (b: Block) => Block) => setBlocks((l) => l.map((b) => (b.id === id ? f(b) : b)));
  const move = (i: number, direction: -1 | 1) =>
    setBlocks((l) => {
      const next = [...l];
      const j = i + direction;
      if (j < 0 || j >= next.length) return l;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const selectedIndex = blocks.findIndex((b) => b.id === selected);
  const selectedBlock = selectedIndex >= 0 ? blocks[selectedIndex] : null;
  const blockErrors = (i: number): FieldErrors =>
    Object.fromEntries(
      Object.entries(errors)
        .filter(([k]) => k.startsWith(`blocks.${i}.`))
        .map(([k, v]) => [k.slice(`blocks.${i}.`.length), v]),
    );

  const siteUrl = getPathname({ href: "/", locale: page.locale as "tr" | "en" });
  const previewUrl = getPathname({ href: "/admin/preview", locale: page.locale as "tr" | "en" });

  return (
    // On phones the admin top bar (3.5rem) sits above the editor.
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col lg:h-dvh">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3">
        <Link href="/admin/pages" className={buttonClass("ghost", "sm", "px-2")} aria-label="Sayfalara dön">
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-foreground">{meta.title}</p>
          <p className="text-sm text-muted">
            <span className="font-semibold uppercase">{page.locale}</span> · /{page.slug} ·{" "}
            {dirty ? (
              <span className="font-semibold text-warning">Kaydedilmemiş değişiklik</span>
            ) : page.hasUnpublishedChanges ? (
              <span className="font-semibold text-warning">Taslak yayında değil</span>
            ) : (
              <span className="font-semibold text-accent">Yayında</span>
            )}
          </p>
        </div>
        <div className="ms-auto flex flex-wrap items-center gap-1.5">
          <div role="group" aria-label="Önizleme genişliği" className="hidden rounded-lg border border-border p-0.5 md:flex">
            {(
              [
                ["desktop", Laptop, "Masaüstü"],
                ["tablet", Tablet, "Tablet"],
                ["mobile", Smartphone, "Mobil"],
              ] as const
            ).map(([k, Icon, name]) => (
              <IconButton
                key={k}
                label={name}
                aria-pressed={width === k}
                onClick={() => setWidth(k)}
                className={cn(width === k && "bg-surface-2 text-foreground")}
              >
                <Icon className="size-4" />
              </IconButton>
            ))}
          </div>
          <a href={siteUrl} target="_blank" rel="noreferrer" className={buttonClass("ghost", "sm")}>
            <ExternalLink className="size-4" />
            <span className="max-sm:sr-only">Sitede aç</span>
          </a>
          <button type="button" onClick={() => setVersionsOpen(true)} className={buttonClass("ghost", "sm")}>
            <History className="size-4" />
            <span className="max-sm:sr-only">Sürümler</span>
          </button>
          <button
            type="button"
            disabled={pending || !dirty}
            onClick={() => save()}
            className={buttonClass("secondary", "sm")}
          >
            Taslağı kaydet
          </button>
          <button
            type="button"
            disabled={pending || (!dirty && !page.hasUnpublishedChanges)}
            onClick={() => save(() => publishAction(page.id))}
            className={buttonClass("primary", "sm")}
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Yayınla
          </button>
        </div>
      </div>

      {notice && (
        <p
          role={notice.kind === "error" ? "alert" : "status"}
          className={cn(
            "border-b px-4 py-2.5 text-[15px] font-medium",
            notice.kind === "error" ? "border-danger/20 bg-danger-soft text-danger" : "border-accent/20 bg-accent-soft text-accent",
          )}
        >
          {notice.text}
        </p>
      )}

      <div className="grid min-h-0 flex-1 lg:grid-cols-[440px_1fr]">
        {/* Left: blocks / page settings */}
        <div className="flex min-h-0 min-w-0 flex-col border-e border-border bg-background">
          <div role="tablist" className="flex shrink-0 gap-1 border-b border-border bg-surface px-3">
            {(
              [
                ["blocks", "Bloklar"],
                ["settings", "Sayfa ayarları"],
              ] as const
            ).map(([k, name]) => (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={tab === k}
                onClick={() => setTab(k)}
                className={cn(
                  "relative h-12 px-3 text-[15px] font-semibold",
                  tab === k ? "text-foreground" : "text-muted hover:text-foreground",
                )}
              >
                {name}
                {tab === k && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {tab === "settings" ? (
              <PageSettings meta={meta} setMeta={setMeta} errors={errors} />
            ) : selectedBlock ? (
              <div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mb-3 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary-text hover:underline pointer-fine:min-h-9"
                >
                  <ArrowLeft className="size-4 rtl:rotate-180" />
                  Tüm bloklar
                </button>
                <h2 className="mb-4 text-lg font-bold text-foreground">{BLOCK_NAMES[selectedBlock.type]}</h2>
                <div className="space-y-6">
                  <SchemaForm
                    schema={BLOCK_SCHEMAS[selectedBlock.type]}
                    value={selectedBlock.content}
                    onChange={(v) => updateBlock(selectedBlock.id, (b) => ({ ...b, content: v }) as Block)}
                    errors={blockErrors(selectedIndex)}
                    path={["content"]}
                  />
                  <details className="rounded-lg border border-border bg-surface p-4">
                    <summary className="cursor-pointer text-[15px] font-semibold text-foreground">Blok ayarları</summary>
                    <div className="mt-4">
                      <SchemaForm
                        schema={blockSettingsSchema}
                        value={selectedBlock.settings}
                        onChange={(v) => updateBlock(selectedBlock.id, (b) => ({ ...b, settings: v }) as Block)}
                        errors={blockErrors(selectedIndex)}
                        path={["settings"]}
                      />
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <BlockList
                blocks={blocks}
                errors={errors}
                select={setSelected}
                move={move}
                update={updateBlock}
                setBlocks={setBlocks}
              />
            )}
          </div>
        </div>

        {/* Right: live preview */}
        <div className="hidden min-h-0 overflow-auto bg-desk p-4 lg:block">
          <iframe
            ref={iframeRef}
            title="Canlı önizleme"
            src={previewUrl}
            onLoad={send}
            className="mx-auto h-full rounded-lg bg-background shadow-paper transition-[width] duration-300"
            style={{ width: WIDTHS[width] }}
          />
        </div>
      </div>

      {versionsOpen && (
        <VersionsDialog
          versions={versions}
          onClose={() => setVersionsOpen(false)}
          onRestore={(id) =>
            startTransition(async () => {
              if (dirty && !await confirm("Kaydedilmemiş değişikliklerin kaybolacak. Devam edilsin mi?")) return;
              const r = await restoreVersionAction(id);
              setVersionsOpen(false);
              handleResult(r, "Eski sürüm taslağa alındı. Kontrol edip yayınlayabilirsin.");
            })
          }
        />
      )}
    </div>
  );
}

function BlockList({
  blocks,
  errors,
  select,
  move,
  update,
  setBlocks,
}: {
  blocks: Block[];
  errors: FieldErrors;
  select: (id: string) => void;
  move: (i: number, direction: -1 | 1) => void;
  update: (id: string, f: (b: Block) => Block) => void;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
}) {
  const confirm = useConfirm();
  const [addOpen, setAddOpen] = useState(false);
  const titleSummary = (b: Block) => {
    const content = b.content as Record<string, unknown>;
    return String(content.title ?? "").replace(/\*\*/g, "");
  };

  return (
    <div className="space-y-2">
      {blocks.map((b, i) => {
        const hasError = Object.keys(errors).some((k) => k.startsWith(`blocks.${i}.`));
        return (
          <div
            key={b.id}
            className={cn(
              // Narrow screens: the action buttons wrap under the title instead of overflowing.
              "flex flex-wrap items-center rounded-lg border bg-surface",
              hasError ? "border-danger" : "border-border",
              !b.settings.visible && "opacity-60",
            )}
          >
            <button type="button" onClick={() => select(b.id)} className="min-w-48 flex-1 px-4 py-3 text-start">
              <span className="block text-[15px] font-semibold text-foreground">{BLOCK_NAMES[b.type]}</span>
              <span className="block truncate text-sm text-muted">
                {!b.settings.visible && <span className="me-1 font-semibold">Gizli ·</span>}
                {titleSummary(b) || "Başlıksız"}
                {b.settings.anchor && <span className="ms-1 font-mono">#{b.settings.anchor}</span>}
              </span>
            </button>
            <span className="ms-auto flex items-center px-1">
              <IconButton
                label={b.settings.visible ? "Gizle" : "Göster"}
                onClick={() => update(b.id, (x) => ({ ...x, settings: { ...x.settings, visible: !x.settings.visible } }))}
              >
                {b.settings.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </IconButton>
              <IconButton label="Yukarı" disabled={i === 0} onClick={() => move(i, -1)}>
                <ChevronUp className="size-4" />
              </IconButton>
              <IconButton label="Aşağı" disabled={i === blocks.length - 1} onClick={() => move(i, 1)}>
                <ChevronDown className="size-4" />
              </IconButton>
              <IconButton
                label="Çoğalt"
                onClick={() =>
                  setBlocks((l) => {
                    const next = [...l];
                    next.splice(i + 1, 0, { ...structuredClone(b), id: Math.random().toString(36).slice(2, 10), settings: { ...b.settings, anchor: "" } });
                    return next;
                  })
                }
              >
                <Copy className="size-4" />
              </IconButton>
              <IconButton
                label="Sil"
                danger
                onClick={async () => await confirm(`"${BLOCK_NAMES[b.type]}" bloğu silinsin mi?`, { danger: true }) && setBlocks((l) => l.filter((x) => x.id !== b.id))}
              >
                <Trash2 className="size-4" />
              </IconButton>
            </span>
          </div>
        );
      })}

      {addOpen ? (
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[15px] font-semibold text-foreground">Hangi blok eklensin?</p>
            <button type="button" onClick={() => setAddOpen(false)} className={buttonClass("ghost", "sm")}>
              Vazgeç
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
          {BLOCK_TYPES.map((type: BlockType) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                const created = newBlock(type);
                setBlocks((l) => [...l, created]);
                setAddOpen(false);
                select(created.id);
              }}
              className="min-h-11 rounded-md border border-border bg-surface px-3 py-2 text-start text-[15px] font-medium text-foreground hover:border-primary hover:bg-primary-soft"
            >
              {BLOCK_NAMES[type]}
            </button>
          ))}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex h-12 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-strong text-[15px] font-semibold text-primary-text hover:border-primary hover:bg-primary-soft"
        >
          <Plus className="size-4" />
          Blok ekle
        </button>
      )}
    </div>
  );
}

function PageSettings({ meta, setMeta, errors }: { meta: Meta; setMeta: (m: Meta) => void; errors: FieldErrors }) {
  const field = (k: keyof Meta, label: string, limit: number, long = false) => {
    const value = String(meta[k]);
    const Component = long ? Textarea : Input;
    return (
      <div>
        <label htmlFor={`meta-${k}`} className="mb-1.5 flex justify-between text-[15px] font-semibold text-foreground">
          {label}
          <span className={cn("font-medium tabular-nums", value.length > limit ? "text-danger" : "text-muted")}>
            {value.length}/{limit}
          </span>
        </label>
        <Component
          id={`meta-${k}`}
          value={value}
          rows={long ? 3 : undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => setMeta({ ...meta, [k]: e.target.value })}
        />
        {errors[`meta.${k}`] && <p className="mt-1.5 text-sm font-medium text-danger">{errors[`meta.${k}`]}</p>}
      </div>
    );
  };
  return (
    <div className="space-y-4">
      {field("title", "Sayfa adı (yönetimde görünür)", 120)}
      {field("metaTitle", "SEO başlığı", 60)}
      {field("metaDescription", "SEO açıklaması", 155, true)}
      <Checkbox label="Arama motorları indekslesin" checked={meta.indexable} onChange={(v) => setMeta({ ...meta, indexable: v })} />
      <p className="text-sm text-muted">
        Arama sonuçlarında başlık 60, açıklama 155 karakterden sonra kesilir. Boş bırakılırsa sitenin varsayılan başlığı kullanılır.
      </p>
    </div>
  );
}

function VersionsDialog({
  versions,
  onClose,
  onRestore,
}: {
  versions: Version[];
  onClose: () => void;
  onRestore: (id: string) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => ref.current?.showModal(), []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(520px,calc(100vw-2rem))] rounded-lg border border-border bg-surface p-0 text-foreground shadow-elevated backdrop:bg-foreground/40"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-lg font-bold">Yayın geçmişi</h2>
        <button type="button" onClick={() => ref.current?.close()} className={buttonClass("ghost", "sm")}>
          Kapat
        </button>
      </div>
      {versions.length ? (
        <ul className="max-h-[60vh] divide-y divide-border overflow-y-auto">
          {versions.map((v, i) => (
            <li key={v.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold tabular-nums">
                  {new Date(v.createdAt).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}
                  {i === 0 && <span className="ms-2 rounded-md bg-accent-soft px-1.5 py-0.5 text-sm text-accent">Son yayın</span>}
                </p>
                <p className="text-sm text-muted">{v.publishedBy}</p>
              </div>
              <button type="button" onClick={() => onRestore(v.id)} className={buttonClass("secondary", "sm")}>
                Taslağa al
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-6 text-[15px] text-muted">Henüz yayın geçmişi yok. İlk “Yayınla” ile oluşur.</p>
      )}
    </dialog>
  );
}
