"use client";

import { BriefcaseBusiness, Download, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { GoogleLogo } from "@/bilesenler/hesap/GoogleLogo";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { getPathname, Link } from "@/i18n/navigation";
import type { Dil } from "@/i18n/routing";
import { authIstemci, GOOGLE_ISTEMCI_KIMLIGI } from "@/istemci/auth";
import { useEditor } from "@/istemci/editor/depo";

/** Misafir editöründe sürekli görünen veri bilgisi (girişsizken hiçbir şey sunucuya gitmez). */
export function MisafirSeridi() {
  const t = useTranslations("Riza");
  const dil = useLocale() as Dil;
  return (
    <div className="onizleme-arac flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-cizgi bg-ana-acik px-4 py-2 text-center text-[13px] text-metin">
      <span className="flex items-center gap-1.5">
        <LockKeyhole className="size-3.5 shrink-0 text-ana-metin" aria-hidden />
        {t("serit")}
      </span>
      <Link
        href={{ pathname: "/giris", query: { sonra: getPathname({ href: "/panel", locale: dil }) } }}
        className="font-semibold text-ana-metin underline-offset-4 hover:underline"
      >
        {t("seritBaglanti")}
      </Link>
    </div>
  );
}

/**
 * Misafir "PDF indir"e basınca: giriş yaparsa neler olacağını (CV hesabında saklanır, onay verirse
 * işverenlerle paylaşılabilir) ve girişsiz indirmenin de mümkün olduğunu açıkça söyler.
 */
export function MisafirIndirDiyalogu({
  acik,
  kapat,
  girissizIndir,
}: {
  acik: boolean;
  kapat: () => void;
  girissizIndir: () => void;
}) {
  const t = useTranslations("Riza");
  const dil = useLocale() as Dil;
  const ref = useRef<HTMLDialogElement>(null);
  const panel = getPathname({ href: "/panel", locale: dil });

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (acik && !d.open) d.showModal();
    if (!acik && d.open) d.close();
  }, [acik]);

  return (
    <dialog
      ref={ref}
      onClose={kapat}
      aria-labelledby="misafir-indir-baslik"
      className="m-auto w-[min(520px,calc(100vw-2rem))] rounded-2xl border border-cizgi bg-yuzey p-0 text-metin shadow-yuksek backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 px-6 pt-6">
        <h2 id="misafir-indir-baslik" className="text-lg font-bold">
          {t("indirBaslik")}
        </h2>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="×"
          className="-me-2 -mt-1 grid size-9 place-items-center rounded-lg text-soluk hover:bg-yuzey-2 hover:text-metin"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="space-y-4 px-6 pt-4 text-sm leading-relaxed">
        <p className="flex gap-3">
          <BriefcaseBusiness className="mt-0.5 size-5 shrink-0 text-ana-metin" aria-hidden />
          <span>{t("isveren")}</span>
        </p>
        <p className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-vurgu" aria-hidden />
          <span className="text-soluk">{t("veri")}</span>
        </p>
        <p className="flex gap-3 rounded-xl bg-yuzey-2 px-3 py-2.5">
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-soluk" aria-hidden />
          <span className="text-soluk">{t("misafir")}</span>
        </p>
      </div>

      <div className="mt-6 space-y-2 border-t border-cizgi px-6 py-5">
        {GOOGLE_ISTEMCI_KIMLIGI && (
          <button
            type="button"
            onClick={async () => {
              useEditor.getState().simdiKaydet(); // girişten sonra panelde hesaba aktarılsın
              await authIstemci.signIn.social({ provider: "google", callbackURL: panel });
            }}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-cizgi-guclu bg-yuzey text-[15px] font-semibold text-metin hover:bg-yuzey-2"
          >
            <GoogleLogo className="size-5" />
            {t("googleIle")}
          </button>
        )}
        <Link
          href={{ pathname: "/giris", query: { sonra: panel } }}
          onClick={() => useEditor.getState().simdiKaydet()}
          className={butonSinifi(GOOGLE_ISTEMCI_KIMLIGI ? "ikincil" : "ana", "orta", "w-full")}
        >
          {t("epostaIle")}
        </Link>
        <button
          type="button"
          onClick={() => {
            ref.current?.close();
            girissizIndir();
          }}
          className={butonSinifi("hayalet", "orta", "w-full")}
        >
          <Download className="size-4" />
          {t("girissizIndir")}
        </button>
      </div>
    </dialog>
  );
}
