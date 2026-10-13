"use client";

import {
  Check,
  ChevronDown,
  CloudOff,
  CloudUpload,
  Loader2,
  Download,
  Eye,
  FileJson,
  FilePlus2,
  FileUp,
  PencilLine,
  Redo2,
  Sparkles,
  Undo2,
} from "lucide-react";
import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleTekDokunus } from "@/bilesenler/hesap/GoogleTekDokunus";
import { KullaniciMenusu } from "@/bilesenler/hesap/KullaniciMenusu";
import { Logo } from "@/bilesenler/site/Logo";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { getPathname, Link, useRouter } from "@/i18n/navigation";
import type { Dil } from "@/i18n/routing";
import { authIstemci } from "@/istemci/auth";
import { useEditor } from "@/istemci/editor/depo";
import { cn } from "@/ortak/cn";
import { ornekCv } from "@/ortak/cv/ornek";
import { bosCv, type CvVerisi } from "@/ortak/cv/sema";
import { dosyaAdi } from "@/ortak/cv/yardimci";
import { IcerikPaneli } from "./IcerikPaneli";
import { KontrolPaneli, useKontrol } from "./KontrolPaneli";
import { Onizleme } from "./Onizleme";
import { TasarimPaneli } from "./TasarimPaneli";
import { IkonButon } from "./ui";
import "./editor.css";

const SEKMELER = ["icerik", "tasarim", "kontrol"] as const;
type Sekme = (typeof SEKMELER)[number];
const PDF_IPUCU_ANAHTARI = "freehandcv:pdf-ipucu-gizle";

export type HesapCv = { id: string; veri: CvVerisi; surum: number };

/** `hesap` verilirse CV hesaptan açılır ve sunucuya kaydedilir; verilmezse misafir modudur. */
export function Editor({ hesap }: { hesap?: HesapCv }) {
  const t = useTranslations("Editor");
  const dil = useLocale();
  const kaynak = useEditor((d) => d.kaynak);
  const hazir = hesap ? kaynak.tur === "hesap" && kaynak.id === hesap.id : kaynak.tur === "misafir";
  const veri = useEditor((d) => (hazir ? d.veri : null));
  const [sekme, setSekme] = useState<Sekme>("icerik");
  const [gorunum, setGorunum] = useState<"duzenle" | "onizle">("duzenle");
  const [bildirim, setBildirim] = useState<{ metin: string; no: number } | null>(null);
  const [pdfAcik, setPdfAcik] = useState(false);

  useEffect(() => {
    if (hesap) useEditor.getState().hesapBaslat(hesap.id, hesap.veri, hesap.surum);
    else useEditor.getState().misafirBaslat(dil);
  }, [hesap, dil]);

  // Girişliyken misafir editörü açılırsa kişinin paneline gidilir (CV'ler hesapta tutulur;
  // tarayıcıda kalmış misafir CV'si panelde hesaba aktarılır).
  const oturum = authIstemci.useSession();
  const router = useRouter();
  useEffect(() => {
    if (!hesap && oturum.data) {
      useEditor.getState().simdiKaydet();
      router.replace("/panel");
    }
  }, [hesap, oturum.data, router]);

  const bildir = useCallback((metin: string) => setBildirim({ metin, no: Date.now() }), []);
  useEffect(() => {
    if (!bildirim) return;
    const z = setTimeout(() => setBildirim(null), 2800);
    return () => clearTimeout(z);
  }, [bildirim]);

  const yazdir = useCallback(() => {
    const v = useEditor.getState().veri;
    const eski = document.title;
    document.title = dosyaAdi(v?.kisisel.ad ?? ""); // tarayıcı PDF dosya adını başlıktan önerir
    const geri = () => {
      document.title = eski;
      window.removeEventListener("afterprint", geri);
    };
    window.addEventListener("afterprint", geri);
    document.fonts.ready.then(() => window.print());
  }, []);

  const pdfIndir = useCallback(
    (dogrudan = false) => {
      let gizli = false;
      try {
        gizli = localStorage.getItem(PDF_IPUCU_ANAHTARI) === "1";
      } catch {}
      if (gizli || dogrudan) yazdir();
      else setPdfAcik(true);
    },
    [yazdir],
  );

  // Kısayollar: Ctrl+Z / Ctrl+Shift+Z (Ctrl+Y) geri-ileri al, Ctrl+P PDF.
  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        useEditor.getState().geriAl();
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        useEditor.getState().ileriAl();
      } else if (k === "p") {
        e.preventDefault();
        pdfIndir(true);
      }
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, [pdfIndir]);

  if (!veri)
    return (
      <div className="grid min-h-dvh place-items-center text-sm text-soluk" role="status">
        {t("yukleniyor")}
      </div>
    );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        {/* @page boyutu CV'nin kâğıt ayarından gelir. */}
        <style>{`@page { size: ${veri.ayarlar.kagit === "Letter" ? "letter" : "A4"}; margin: 0; }`}</style>
        <div className="editor-kabuk flex h-dvh flex-col bg-zemin">
          <UstCubuk bildir={bildir} pdfIndir={() => pdfIndir()} />

          <div className="editor-calisma grid min-h-0 flex-1 lg:grid-cols-[minmax(380px,460px)_1fr]">
            <section
              className={cn(
                "editor-panel flex min-h-0 flex-col border-e border-cizgi bg-zemin",
                gorunum === "onizle" && "max-lg:hidden",
              )}
            >
              <div role="tablist" aria-label={t("meta")} className="flex shrink-0 gap-1 border-b border-cizgi bg-yuzey px-3">
                {SEKMELER.map((s) => (
                  <SekmeDugmesi key={s} sekme={s} secili={sekme === s} sec={setSekme} />
                ))}
              </div>
              <div
                role="tabpanel"
                id={`panel-${sekme}`}
                aria-labelledby={`sekme-${sekme}`}
                className="min-h-0 flex-1 overflow-y-auto"
              >
                {sekme === "icerik" && <IcerikPaneli bildir={bildir} />}
                {sekme === "tasarim" && <TasarimPaneli />}
                {sekme === "kontrol" && <KontrolPaneli />}
              </div>
            </section>
            <section className={cn("editor-onizleme min-h-0", gorunum === "duzenle" && "max-lg:hidden")}>
              <Onizleme />
            </section>
          </div>

          {/* Mobil: düzenle / önizle geçişi */}
          <div className="flex shrink-0 gap-2 border-t border-cizgi bg-yuzey p-2 lg:hidden">
            {(["duzenle", "onizle"] as const).map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={gorunum === g}
                onClick={() => setGorunum(g)}
                className={cn(
                  "flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold",
                  gorunum === g ? "bg-ana text-white" : "text-soluk hover:bg-yuzey-2",
                )}
              >
                {g === "duzenle" ? <PencilLine className="size-4" /> : <Eye className="size-4" />}
                {t(`arac.${g}`)}
              </button>
            ))}
          </div>

          <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center lg:bottom-6">
            <AnimatePresence>
              {bildirim && (
                <m.p
                  key={bildirim.no}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                  className="rounded-xl bg-metin px-4 py-2.5 text-sm font-medium text-zemin shadow-yuksek"
                >
                  {bildirim.metin}
                </m.p>
              )}
            </AnimatePresence>
          </div>

          <PdfDiyalogu acik={pdfAcik} kapat={() => setPdfAcik(false)} devam={yazdir} />
          <CakismaDiyalogu />
          {!hesap && <GoogleTekDokunus donus={getPathname({ href: "/panel", locale: dil as Dil })} />}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}

function SekmeDugmesi({ sekme, secili, sec }: { sekme: Sekme; secili: boolean; sec: (s: Sekme) => void }) {
  const t = useTranslations("Editor");
  const kontrol = useKontrol();
  return (
    <button
      type="button"
      role="tab"
      id={`sekme-${sekme}`}
      aria-selected={secili}
      aria-controls={`panel-${sekme}`}
      tabIndex={secili ? 0 : -1}
      onClick={() => sec(sekme)}
      onKeyDown={(e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const i = SEKMELER.indexOf(sekme);
        const ileri = (e.key === "ArrowRight") !== (document.dir === "rtl");
        const yeni = SEKMELER[(i + (ileri ? 1 : -1) + SEKMELER.length) % SEKMELER.length];
        sec(yeni);
        document.getElementById(`sekme-${yeni}`)?.focus();
      }}
      className={cn(
        "relative flex h-12 items-center gap-2 px-3 text-sm font-semibold transition-colors",
        secili ? "text-metin" : "text-soluk hover:text-metin",
      )}
    >
      {t(`sekmeler.${sekme}`)}
      {sekme === "kontrol" && kontrol && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
            kontrol.puan >= 80 ? "bg-vurgu-acik text-vurgu" : "bg-[#fef3c7] text-uyari dark:bg-[#3a2a05]",
          )}
        >
          {kontrol.puan}
        </span>
      )}
      {secili && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ana" />}
    </button>
  );
}

function UstCubuk({ bildir, pdfIndir }: { bildir: (m: string) => void; pdfIndir: () => void }) {
  const t = useTranslations("Editor");
  const dil = useLocale();
  const kayit = useEditor((d) => d.kayit);
  const geriVar = useEditor((d) => d.gecmis.length > 0);
  const ileriVar = useEditor((d) => d.gelecek.length > 0);
  const { geriAl, ileriAl, yerineKoy } = useEditor.getState();
  const jsonRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);

  const menuKapat = () => menuRef.current?.removeAttribute("open");

  useEffect(() => {
    const disari = (e: MouseEvent) => {
      if (menuRef.current?.open && !menuRef.current.contains(e.target as Node)) menuKapat();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && menuKapat();
    document.addEventListener("click", disari);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("click", disari);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const jsonIndir = () => {
    const v = useEditor.getState().veri!;
    const blob = new Blob([JSON.stringify(v, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = dosyaAdi(v.kisisel.ad, "json");
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    bildir(t("bildirim.jsonIndi"));
  };

  const kaynak = useEditor((d) => d.kaynak);
  const hesapta = kaynak.tur === "hesap";
  const saat =
    kayit.tur === "kaydedildi"
      ? new Date(kayit.zaman).toLocaleTimeString(dil, { hour: "2-digit", minute: "2-digit" })
      : "";

  const menuOgesi =
    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-metin hover:bg-yuzey-2";

  return (
    <header className="onizleme-arac flex h-14 shrink-0 items-center gap-2 border-b border-cizgi bg-yuzey px-3 sm:px-4">
      <Link href="/" aria-label={t("arac.anaSayfa")} className="me-1 rounded-lg">
        <Logo className="[&>span:last-child]:max-sm:hidden" />
      </Link>

      <div className="ms-1 hidden items-center gap-1.5 text-xs text-soluk md:flex" aria-live="polite">
        {kayit.tur === "hata" ? (
          <span className="flex items-center gap-1.5 font-medium text-hata">
            <CloudOff className="size-3.5" />
            {hesapta && kayit.neden !== "depolama" ? t(`kayit.${kayit.neden}`) : t("kayit.hata")}
          </span>
        ) : kayit.tur === "kaydediliyor" ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="size-3.5 animate-spin" />
            {t("kayit.kaydediliyor")}
          </span>
        ) : kayit.tur === "bekliyor" ? (
          <span>{t("kayit.bekliyor")}</span>
        ) : kayit.tur === "kaydedildi" ? (
          <span className="flex items-center gap-1.5" title={hesapta ? undefined : t("kayit.misafir")}>
            <Check className="size-3.5 text-vurgu" />
            {hesapta ? t("kayit.hesapKaydedildi", { saat }) : t("kayit.kaydedildi", { saat })}
          </span>
        ) : kayit.tur === "cakisma" ? null : (
          <span>{hesapta ? "" : t("kayit.misafir")}</span>
        )}
      </div>

      <div className="ms-auto flex items-center gap-1">
        <IkonButon etiket={t("arac.geriAl")} disabled={!geriVar} onClick={geriAl} className="size-9">
          <Undo2 className="size-[18px]" />
        </IkonButon>
        <IkonButon etiket={t("arac.ileriAl")} disabled={!ileriVar} onClick={ileriAl} className="size-9">
          <Redo2 className="size-[18px]" />
        </IkonButon>

        <details ref={menuRef} className="relative">
          <summary className="flex h-9 list-none items-center gap-1 rounded-lg px-2.5 text-sm font-semibold text-metin hover:bg-yuzey-2 [&::-webkit-details-marker]:hidden">
            {t("arac.dosya")}
            <ChevronDown className="size-3.5 text-soluk" />
          </summary>
          <div className="absolute end-0 top-11 z-40 w-60 rounded-xl border border-cizgi bg-yuzey p-1.5 shadow-yuksek">
            <button type="button" className={menuOgesi} onClick={() => (menuKapat(), jsonIndir())}>
              <FileJson className="size-4 text-soluk" />
              {t("arac.jsonDisa")}
            </button>
            <button type="button" className={menuOgesi} onClick={() => (menuKapat(), jsonRef.current?.click())}>
              <FileUp className="size-4 text-soluk" />
              {t("arac.jsonIce")}
            </button>
            <div className="my-1 h-px bg-cizgi" />
            <button
              type="button"
              className={menuOgesi}
              onClick={() => {
                menuKapat();
                if (confirm(t("onay.ornek"))) {
                  yerineKoy(ornekCv(dil));
                  bildir(t("bildirim.yuklendi"));
                }
              }}
            >
              <Sparkles className="size-4 text-soluk" />
              {t("arac.ornekYukle")}
            </button>
            <button
              type="button"
              className={menuOgesi}
              onClick={() => {
                menuKapat();
                if (confirm(t("onay.bos"))) yerineKoy(bosCv(dil));
              }}
            >
              <FilePlus2 className="size-4 text-soluk" />
              {t("arac.bosBasla")}
            </button>
          </div>
        </details>
        <input
          ref={jsonRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const dosya = e.target.files?.[0];
            e.target.value = "";
            if (!dosya) return;
            dosya
              .text()
              .then((m) => {
                const v = JSON.parse(m);
                if (!v || typeof v !== "object" || !("kisisel" in v)) throw new Error("bicim");
                yerineKoy(v);
                bildir(t("bildirim.yuklendi"));
              })
              .catch(() => bildir(t("bildirim.gecersizJson")));
          }}
        />

        {!hesapta && (
          <Link
            href={{ pathname: "/giris", query: { sonra: getPathname({ href: "/panel", locale: dil as Dil }) } }}
            className={butonSinifi("ikincil", "kucuk", "ms-1 max-md:hidden")}
          >
            <CloudUpload className="size-4" />
            {t("arac.hesabaKaydet")}
          </Link>
        )}
        <button type="button" onClick={pdfIndir} className={butonSinifi("ana", "kucuk", "ms-1")}>
          <Download className="size-4" />
          <span className="max-sm:sr-only">{t("arac.pdf")}</span>
        </button>
        <KullaniciMenusu girisGoster={false} className="ms-1" />
      </div>
    </header>
  );
}

function PdfDiyalogu({ acik, kapat, devam }: { acik: boolean; kapat: () => void; devam: () => void }) {
  const t = useTranslations("Editor.pdf");
  const ref = useRef<HTMLDialogElement>(null);
  const [gosterme, setGosterme] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (acik && !d.open) d.showModal();
    if (!acik && d.open) d.close();
  }, [acik]);

  const bitir = (devamEt: boolean) => {
    if (gosterme) {
      try {
        localStorage.setItem(PDF_IPUCU_ANAHTARI, "1");
      } catch {}
    }
    kapat();
    if (devamEt) setTimeout(devam, 80);
  };

  return (
    <dialog
      ref={ref}
      onClose={kapat}
      className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-cizgi bg-yuzey p-6 text-metin shadow-yuksek backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <h2 className="text-lg font-bold">{t("baslik")}</h2>
      <p className="mt-2 text-sm text-soluk">{t("aciklama")}</p>
      <ol className="mt-3 list-decimal space-y-1.5 ps-5 text-sm">
        <li>{t("adim1")}</li>
        <li>{t("adim2")}</li>
        <li>{t("adim3")}</li>
      </ol>
      <label className="mt-4 flex items-center gap-2 text-sm text-soluk">
        <input type="checkbox" checked={gosterme} onChange={(e) => setGosterme(e.target.checked)} className="size-4 accent-[var(--ana)]" />
        {t("tekrarGosterme")}
      </label>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={() => bitir(false)} className={butonSinifi("hayalet", "kucuk")}>
          {t("vazgec")}
        </button>
        <button type="button" onClick={() => bitir(true)} className={butonSinifi("ana", "kucuk")} autoFocus>
          {t("devam")}
        </button>
      </div>
    </dialog>
  );
}

function CakismaDiyalogu() {
  const t = useTranslations("Editor.cakisma");
  const kayit = useEditor((d) => d.kayit);
  const ref = useRef<HTMLDialogElement>(null);
  const acik = kayit.tur === "cakisma";
  useEffect(() => {
    const d = ref.current;
    if (acik && d && !d.open) d.showModal();
    if (!acik && d?.open) d.close();
  }, [acik]);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => e.preventDefault()}
      className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-cizgi bg-yuzey p-6 text-metin shadow-yuksek backdrop:bg-black/50"
    >
      <h2 className="text-lg font-bold">{t("baslik")}</h2>
      <p className="mt-2 text-sm text-soluk">{t("aciklama")}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => window.location.reload()} className={butonSinifi("ikincil", "kucuk")}>
          {t("yenile")}
        </button>
        <button type="button" onClick={() => useEditor.getState().benimkiniKoru()} className={butonSinifi("ana", "kucuk")}>
          {t("koru")}
        </button>
      </div>
    </dialog>
  );
}
