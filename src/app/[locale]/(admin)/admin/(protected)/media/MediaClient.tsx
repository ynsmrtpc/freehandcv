"use client";

import { Check, Copy, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { InlineNotice, useAction, type Notice } from "@/components/admin/forms";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { updateAltTextAction } from "./actions";

/** Drop or pick images; they are sent to the upload Route Handler in one request. */
export function MediaUploader({ maxMb }: { maxMb: number }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const altId = useId();
  const [alt, setAlt] = useState("");
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  const upload = async (files: FileList | File[]) => {
    const list = [...files];
    if (!list.length) return;
    setBusy(true);
    setNotice(null);
    const body = new FormData();
    list.forEach((f) => body.append("files", f));
    body.append("alt", alt);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body });
      const r = (await res.json()) as { ok: boolean; saved?: number; failed?: string[]; error?: string };
      const failed = r.failed?.length ? ` Yüklenemeyenler: ${r.failed.join("; ")}.` : "";
      setNotice(r.saved ? { kind: failed ? "error" : "success", text: `${r.saved} dosya yüklendi.${failed}` } : { kind: "error", text: (r.error ?? "Yüklenemedi.") + failed });
      if (r.saved) {
        setAlt("");
        router.refresh();
      }
    } catch {
      setNotice({ kind: "error", text: "Bağlantı kesildi; yükleme tamamlanmadı." });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <section aria-labelledby="upload-title" className="space-y-3">
      <h2 id="upload-title" className="sr-only">
        Yükle
      </h2>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          void upload(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
          over ? "border-primary bg-primary-soft" : "border-border-strong bg-surface",
        )}
      >
        <Upload className="size-6 text-muted" aria-hidden />
        <p className="text-[15px] text-foreground">
          Görselleri buraya sürükle ya da{" "}
          <button type="button" disabled={busy} onClick={() => input.current?.click()} className="font-semibold text-primary-text underline underline-offset-4">
            bilgisayarından seç
          </button>
        </p>
        <p className="text-sm text-muted">PNG, JPG, WebP, GIF ya da AVIF; her biri en fazla {maxMb} MB. SVG güvenlik nedeniyle kabul edilmez.</p>
        <input ref={input} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif,image/avif" className="sr-only" tabIndex={-1} onChange={(e) => e.target.files && void upload(e.target.files)} />
        {busy && <p className="text-[15px] font-semibold text-foreground" aria-live="polite">Yükleniyor…</p>}
      </div>
      <div className="max-w-xl">
        <label htmlFor={altId} className="block text-[15px] font-semibold text-foreground">
          Alternatif metin (isteğe bağlı)
        </label>
        <input
          id={altId}
          value={alt}
          maxLength={300}
          onChange={(e) => setAlt(e.target.value)}
          className="mt-1.5 block h-11 w-full rounded-lg border border-border-strong bg-surface px-3 text-base text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <p className="mt-1.5 text-sm text-muted">Görmeyen kullanıcılar için görseli bir cümleyle anlat. Bu yüklemedeki tüm dosyalara uygulanır; sonra tek tek düzenlenebilir.</p>
      </div>
      <InlineNotice notice={notice} />
    </section>
  );
}

export function AltTextField({ id, value }: { id: string; value: string }) {
  const [v, setV] = useState(value);
  const { notice, pending, run } = useAction();
  return (
    <form
      className="space-y-1.5"
      onSubmit={(e) => {
        e.preventDefault();
        run(() => updateAltTextAction(id, v));
      }}
    >
      <div className="flex gap-1.5">
        <input
          aria-label="Alternatif metin"
          placeholder="Alternatif metin yok"
          value={v}
          maxLength={300}
          onChange={(e) => setV(e.target.value)}
          className="block h-10 min-w-0 flex-1 rounded-md border border-border-strong bg-surface px-2.5 text-sm text-foreground outline-none placeholder:text-muted/80 focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <button type="submit" disabled={pending || v === value} className={buttonClass("secondary", "sm", "pointer-fine:h-10")}>
          Kaydet
        </button>
      </div>
      <InlineNotice notice={notice} />
    </form>
  );
}

export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-primary-text hover:bg-primary-soft pointer-fine:min-h-9"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {copied ? "Kopyalandı" : "Adresi kopyala"}
    </button>
  );
}
