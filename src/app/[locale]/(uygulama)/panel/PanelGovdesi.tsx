"use client";

import { Copy, FilePlus2, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { CvBelge } from "@/bilesenler/cv/CvBelge";
import { OlcekliKagit } from "@/bilesenler/cv/OlcekliKagit";
import { IkonButon } from "@/bilesenler/editor/ui";
import { KullaniciMenusu } from "@/bilesenler/hesap/KullaniciMenusu";
import { Logo } from "@/bilesenler/site/Logo";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { cvCogaltEylemi, cvOlusturEylemi, cvSilEylemi, type CvSonucu } from "@/eylemler/cv";
import { Link, useRouter } from "@/i18n/navigation";
import { MISAFIR_ANAHTARI } from "@/istemci/editor/depo";
import { ornekCv } from "@/ortak/cv/ornek";
import { bosCv, cvNormalize, type CvVerisi } from "@/ortak/cv/sema";
import { sistemTanimi } from "@/ortak/cv/tasarim";
import { PaylasimKarti } from "./PaylasimKarti";

type Kart = { id: string; baslik: string; icerik: unknown; guncelleme: string };

/** Tarayıcıdaki misafir CV'si hiç düzenlenmemiş örnekse aktarmaya değmez. */
function ornekMi(v: CvVerisi) {
  const sade = (x: CvVerisi) => JSON.stringify({ ...x, ayarlar: { ...x.ayarlar, gizli: [] } });
  return ["tr", "en"].some((d) => sade(ornekCv(d)) === sade(v));
}

let aktarimBasladi = false;

export function PanelGovdesi({
  cvler,
  paylasim,
}: {
  cvler: Kart[];
  paylasim: { acik: boolean; cvId: string | null };
}) {
  const t = useTranslations("Panel");
  const dil = useLocale();
  const router = useRouter();
  const [bekliyor, gecis] = useTransition();
  const [mesaj, setMesaj] = useState<{ tur: "iyi" | "hata"; metin: string } | null>(null);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sonuc = (s: CvSonucu, iyi?: string) => {
    if (s.tamam) {
      if (iyi) setMesaj({ tur: "iyi", metin: iyi });
      return true;
    }
    setMesaj({ tur: "hata", metin: s.neden === "sinir" ? t("sinir") : t("hata") });
    return false;
  };

  // Plan 10: misafirken hazırlanan CV, giriş yapınca hesaba aktarılır (bir kez).
  useEffect(() => {
    if (aktarimBasladi) return;
    aktarimBasladi = true;
    let ham: string | null = null;
    try {
      ham = localStorage.getItem(MISAFIR_ANAHTARI);
    } catch {}
    if (!ham) return;
    let veri: CvVerisi;
    try {
      veri = cvNormalize(JSON.parse(ham));
    } catch {
      return;
    }
    if (ornekMi(veri)) {
      localStorage.removeItem(MISAFIR_ANAHTARI);
      return;
    }
    void cvOlusturEylemi(veri).then((s) => {
      if (s.tamam) {
        localStorage.removeItem(MISAFIR_ANAHTARI);
        setMesaj({ tur: "iyi", metin: t("aktarildi") });
        router.refresh();
      }
    });
  }, [router, t]);

  useEffect(() => {
    if (!menu) return;
    const disari = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setMenu(false);
    document.addEventListener("click", disari);
    return () => document.removeEventListener("click", disari);
  }, [menu]);

  const yeni = (veri: CvVerisi) =>
    gecis(async () => {
      setMenu(false);
      const s = await cvOlusturEylemi(veri);
      if (sonuc(s) && s.tamam) router.push({ pathname: "/cv/[id]", params: { id: s.id } });
    });

  const tarih = (iso: string) =>
    new Intl.DateTimeFormat(dil, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

  return (
    <div className="min-h-dvh">
      <header className="border-b border-cizgi bg-yuzey">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link href="/" className="rounded-lg">
            <Logo />
          </Link>
          <div className="ms-auto">
            <KullaniciMenusu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-metin">{t("baslik")}</h1>
            <p className="mt-1 text-soluk">{t("alt", { n: cvler.length })}</p>
          </div>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-expanded={menu}
              disabled={bekliyor}
              onClick={() => setMenu((m) => !m)}
              className={butonSinifi("ana", "orta")}
            >
              {bekliyor ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              {t("yeni")}
            </button>
            {menu && (
              <div className="absolute end-0 top-13 z-20 w-56 rounded-xl border border-cizgi bg-yuzey p-1.5 shadow-yuksek">
                <button
                  type="button"
                  onClick={() => yeni(ornekCv(dil))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-metin hover:bg-yuzey-2"
                >
                  <Sparkles className="size-4 text-soluk" />
                  {t("yeniOrnek")}
                </button>
                <button
                  type="button"
                  onClick={() => yeni(bosCv(dil))}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-metin hover:bg-yuzey-2"
                >
                  <FilePlus2 className="size-4 text-soluk" />
                  {t("yeniBos")}
                </button>
              </div>
            )}
          </div>
        </div>

        {mesaj && (
          <p
            role={mesaj.tur === "hata" ? "alert" : "status"}
            className={`mt-6 rounded-xl px-4 py-3 text-sm font-medium ${mesaj.tur === "hata" ? "bg-hata-acik text-hata" : "bg-vurgu-acik text-vurgu"}`}
          >
            {mesaj.metin}
          </p>
        )}

        <PaylasimKarti baslangic={paylasim} cvler={cvler.map((c) => ({ id: c.id, baslik: c.baslik }))} />

        {cvler.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-cizgi-guclu p-12 text-center">
            <p className="text-soluk">{t("bos")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => yeni(ornekCv(dil))} className={butonSinifi("ana", "orta")}>
                <Sparkles className="size-4" />
                {t("yeniOrnek")}
              </button>
              <button type="button" onClick={() => yeni(bosCv(dil))} className={butonSinifi("ikincil", "orta")}>
                {t("yeniBos")}
              </button>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {cvler.map((c) => {
              const veri = cvNormalize(c.icerik);
              return (
                <li key={c.id} className="group relative rounded-2xl border border-cizgi bg-yuzey p-2.5 shadow-kart transition-shadow hover:shadow-yuksek">
                  <Link href={{ pathname: "/cv/[id]", params: { id: c.id } }} className="block rounded-lg">
                    <div
                      aria-hidden
                      inert
                      className="pointer-events-none aspect-[210/297] w-full overflow-hidden rounded-lg bg-white ring-1 ring-black/5"
                    >
                      <OlcekliKagit ilkOlcek={0.25}>
                        <CvBelge veri={veri} tanim={sistemTanimi(veri.ayarlar.sablon)} baglantisiz />
                      </OlcekliKagit>
                    </div>
                    <p className="mt-3 truncate px-1 text-sm font-semibold text-metin">{c.baslik}</p>
                    <p className="px-1 pb-1 text-xs text-soluk">{t("guncellendi", { zaman: tarih(c.guncelleme) })}</p>
                  </Link>
                  <div className="absolute end-4 top-4 flex gap-1 rounded-lg bg-yuzey/95 p-0.5 opacity-0 shadow-kart transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 max-sm:opacity-100">
                    <IkonButon
                      etiket={`${t("cogalt")}: ${c.baslik}`}
                      disabled={bekliyor}
                      onClick={() =>
                        gecis(async () => {
                          if (sonuc(await cvCogaltEylemi(c.id))) router.refresh();
                        })
                      }
                    >
                      <Copy className="size-4" />
                    </IkonButon>
                    <IkonButon
                      etiket={`${t("sil")}: ${c.baslik}`}
                      tehlike
                      disabled={bekliyor}
                      onClick={() =>
                        confirm(t("silOnay", { ad: c.baslik })) &&
                        gecis(async () => {
                          if (sonuc(await cvSilEylemi(c.id))) router.refresh();
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </IkonButon>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
