"use client";

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
import { Girdi, IkonButon, MetinAlani, Onay } from "@/bilesenler/editor/ui";
import { butonSinifi } from "@/bilesenler/ui/Buton";
import { SemaFormu, yolAnahtari, type Hatalar } from "@/bilesenler/yonetim/SemaFormu";
import { getPathname, Link } from "@/i18n/navigation";
import {
  BLOK_ADLARI,
  BLOK_SEMALARI,
  BLOK_TURLERI,
  blokListesiSemasi,
  ortakAyarSemasi,
  yeniBlok,
  type Blok,
  type BlokTuru,
} from "@/ortak/bloklar";
import { cn } from "@/ortak/cn";
import { surumuTaslagaAlEylemi, taslakKaydetEylemi, yayinlaEylemi, type EylemSonucu } from "../eylemler";

type Meta = { baslik: string; metaBaslik: string; metaAciklama: string; indeks: boolean };
type Sayfa = {
  id: string;
  slug: string;
  dil: string;
  surum: number;
  meta: Meta;
  bloklar: Blok[];
  yayindaFarkli: boolean;
};
type Surum = { id: string; zaman: string; kisi: string };

const GENISLIKLER = { masaustu: "100%", tablet: "820px", mobil: "390px" } as const;

// Kayıttan sonra düzenleyici yeni sürümle yeniden kurulur (key = surum); başarı mesajı bu
// yeniden kuruluşu atlatsın diye bileşen dışında bekletilir.
let bekleyenMesaj: { tur: "iyi" | "hata"; metin: string } | null = null;

/** Sunucu ya da istemci doğrulama sorunlarını "bloklar.2.icerik.baslik" biçiminde anahtarlar. */
function sorunlariHaritala(sorunlar: { yol: (string | number)[]; mesaj: string }[]): Hatalar {
  return Object.fromEntries(sorunlar.map((s) => [yolAnahtari(s.yol), s.mesaj]));
}

export function SayfaDuzenleyici({ sayfa, surumler }: { sayfa: Sayfa; surumler: Surum[] }) {
  const router = useRouter();
  const [bloklar, setBloklar] = useState(sayfa.bloklar);
  const [meta, setMeta] = useState(sayfa.meta);
  const [secili, setSecili] = useState<string | null>(null);
  const [sekme, setSekme] = useState<"bloklar" | "ayarlar">("bloklar");
  const [genislik, setGenislik] = useState<keyof typeof GENISLIKLER>("masaustu");
  const [hatalar, setHatalar] = useState<Hatalar>({});
  const [mesaj, setMesaj] = useState<{ tur: "iyi" | "hata"; metin: string } | null>(() => {
    const m = bekleyenMesaj;
    bekleyenMesaj = null;
    return m;
  });
  const [bekliyor, gecis] = useTransition();
  const [surumAcik, setSurumAcik] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const kirli = useMemo(
    () => JSON.stringify({ bloklar, meta }) !== JSON.stringify({ bloklar: sayfa.bloklar, meta: sayfa.meta }),
    [bloklar, meta, sayfa],
  );

  // Kaydedilmemiş değişiklik varken sayfadan çıkarken uyar.
  useEffect(() => {
    if (!kirli) return;
    const uyar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", uyar);
    return () => window.removeEventListener("beforeunload", uyar);
  }, [kirli]);

  // Canlı önizleme: iframe'e blokları gönder; iframe hazır olunca ve her değişiklikte.
  const gonder = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { tur: "freehandcv-onizleme", bloklar, secili },
      window.location.origin,
    );
  }, [bloklar, secili]);
  useEffect(() => {
    const z = setTimeout(gonder, 120);
    return () => clearTimeout(z);
  }, [gonder]);
  useEffect(() => {
    const dinle = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.tur === "freehandcv-onizleme-hazir") gonder();
      if (e.data?.tur === "freehandcv-onizleme-sec" && typeof e.data.id === "string") {
        setSekme("bloklar");
        setSecili(e.data.id);
      }
    };
    window.addEventListener("message", dinle);
    return () => window.removeEventListener("message", dinle);
  }, [gonder]);

  const sonucuIsle = (s: EylemSonucu, basari: string) => {
    if (s.tamam) {
      setHatalar({});
      setMesaj({ tur: "iyi", metin: basari });
      bekleyenMesaj = { tur: "iyi", metin: basari };
      router.refresh();
      return true;
    }
    setHatalar(sorunlariHaritala(s.sorunlar ?? []));
    setMesaj({ tur: "hata", metin: s.hata });
    return false;
  };

  const istemciDogrula = () => {
    const b = blokListesiSemasi.safeParse(bloklar);
    if (b.success) return true;
    setHatalar(sorunlariHaritala(b.error.issues.map((i) => ({ yol: ["bloklar", ...(i.path as (string | number)[])], mesaj: i.message }))));
    setMesaj({ tur: "hata", metin: "Bazı alanlar hatalı; kırmızı alanları düzelt." });
    return false;
  };

  const kaydet = (sonra?: () => Promise<EylemSonucu>) =>
    gecis(async () => {
      if (!istemciDogrula()) return;
      let surum = sayfa.surum;
      if (kirli) {
        const s = await taslakKaydetEylemi(sayfa.id, bloklar, meta, sayfa.surum);
        if (!s.tamam) return void sonucuIsle(s, "");
        surum = s.surum ?? surum;
      }
      if (sonra) sonucuIsle(await sonra(), "Yayınlandı. Ziyaretçiler yeni içeriği görüyor.");
      else sonucuIsle({ tamam: true, surum }, "Taslak kaydedildi. Sitede görünmesi için yayınla.");
    });

  const blokGuncelle = (id: string, f: (b: Blok) => Blok) => setBloklar((l) => l.map((b) => (b.id === id ? f(b) : b)));
  const tasi = (i: number, yon: -1 | 1) =>
    setBloklar((l) => {
      const y = [...l];
      const j = i + yon;
      if (j < 0 || j >= y.length) return l;
      [y[i], y[j]] = [y[j], y[i]];
      return y;
    });

  const seciliIndeks = bloklar.findIndex((b) => b.id === secili);
  const seciliBlok = seciliIndeks >= 0 ? bloklar[seciliIndeks] : null;
  const blokHatalari = (i: number): Hatalar =>
    Object.fromEntries(
      Object.entries(hatalar)
        .filter(([k]) => k.startsWith(`bloklar.${i}.`))
        .map(([k, v]) => [k.slice(`bloklar.${i}.`.length), v]),
    );

  const siteAdresi = getPathname({ href: "/", locale: sayfa.dil as "tr" | "en" });
  const onizlemeAdresi = getPathname({ href: "/yonetim/onizleme", locale: sayfa.dil as "tr" | "en" });

  return (
    <div className="flex h-dvh flex-col">
      {/* Üst çubuk */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cizgi bg-yuzey px-4 py-3">
        <Link href="/yonetim/sayfalar" className={butonSinifi("hayalet", "kucuk", "px-2")} aria-label="Sayfalara dön">
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Link>
        <div className="min-w-0">
          <p className="truncate font-bold text-metin">{meta.baslik}</p>
          <p className="text-xs text-soluk">
            <span className="font-semibold uppercase">{sayfa.dil}</span> · /{sayfa.slug} ·{" "}
            {kirli ? (
              <span className="font-semibold text-uyari">Kaydedilmemiş değişiklik</span>
            ) : sayfa.yayindaFarkli ? (
              <span className="font-semibold text-uyari">Taslak yayında değil</span>
            ) : (
              <span className="text-vurgu">Yayında</span>
            )}
          </p>
        </div>
        <div className="ms-auto flex flex-wrap items-center gap-1.5">
          <div role="group" aria-label="Önizleme genişliği" className="hidden rounded-lg border border-cizgi p-0.5 md:flex">
            {(
              [
                ["masaustu", Laptop, "Masaüstü"],
                ["tablet", Tablet, "Tablet"],
                ["mobil", Smartphone, "Mobil"],
              ] as const
            ).map(([k, Ikon, ad]) => (
              <IkonButon
                key={k}
                etiket={ad}
                aria-pressed={genislik === k}
                onClick={() => setGenislik(k)}
                className={cn(genislik === k && "bg-yuzey-2 text-metin")}
              >
                <Ikon className="size-4" />
              </IkonButon>
            ))}
          </div>
          <a href={siteAdresi} target="_blank" rel="noreferrer" className={butonSinifi("hayalet", "kucuk")}>
            <ExternalLink className="size-4" />
            <span className="max-sm:sr-only">Sitede aç</span>
          </a>
          <button type="button" onClick={() => setSurumAcik(true)} className={butonSinifi("hayalet", "kucuk")}>
            <History className="size-4" />
            <span className="max-sm:sr-only">Sürümler</span>
          </button>
          <button
            type="button"
            disabled={bekliyor || !kirli}
            onClick={() => kaydet()}
            className={butonSinifi("ikincil", "kucuk")}
          >
            Taslağı kaydet
          </button>
          <button
            type="button"
            disabled={bekliyor || (!kirli && !sayfa.yayindaFarkli)}
            onClick={() => kaydet(() => yayinlaEylemi(sayfa.id))}
            className={butonSinifi("ana", "kucuk")}
          >
            {bekliyor && <Loader2 className="size-4 animate-spin" />}
            Yayınla
          </button>
        </div>
      </div>

      {mesaj && (
        <p
          role={mesaj.tur === "hata" ? "alert" : "status"}
          className={cn(
            "border-b px-4 py-2 text-sm font-medium",
            mesaj.tur === "hata" ? "border-hata/20 bg-hata-acik text-hata" : "border-vurgu/20 bg-vurgu-acik text-vurgu",
          )}
        >
          {mesaj.metin}
        </p>
      )}

      <div className="grid min-h-0 flex-1 lg:grid-cols-[440px_1fr]">
        {/* Sol: bloklar / ayarlar */}
        <div className="flex min-h-0 flex-col border-e border-cizgi bg-zemin">
          <div role="tablist" className="flex shrink-0 gap-1 border-b border-cizgi bg-yuzey px-3">
            {(
              [
                ["bloklar", "Bloklar"],
                ["ayarlar", "Sayfa ayarları"],
              ] as const
            ).map(([k, ad]) => (
              <button
                key={k}
                role="tab"
                type="button"
                aria-selected={sekme === k}
                onClick={() => setSekme(k)}
                className={cn(
                  "relative h-11 px-3 text-sm font-semibold",
                  sekme === k ? "text-metin" : "text-soluk hover:text-metin",
                )}
              >
                {ad}
                {sekme === k && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ana" />}
              </button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {sekme === "ayarlar" ? (
              <SayfaAyarlari meta={meta} setMeta={setMeta} hatalar={hatalar} />
            ) : seciliBlok ? (
              <div>
                <button
                  type="button"
                  onClick={() => setSecili(null)}
                  className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-ana-metin hover:underline"
                >
                  <ArrowLeft className="size-4 rtl:rotate-180" />
                  Tüm bloklar
                </button>
                <h2 className="mb-4 text-lg font-bold text-metin">{BLOK_ADLARI[seciliBlok.tur]}</h2>
                <div className="space-y-6">
                  <SemaFormu
                    sema={BLOK_SEMALARI[seciliBlok.tur]}
                    deger={seciliBlok.icerik}
                    degistir={(d) => blokGuncelle(seciliBlok.id, (b) => ({ ...b, icerik: d }) as Blok)}
                    hatalar={blokHatalari(seciliIndeks)}
                    yol={["icerik"]}
                  />
                  <details className="rounded-xl border border-cizgi bg-yuzey p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-metin">Blok ayarları</summary>
                    <div className="mt-4">
                      <SemaFormu
                        sema={ortakAyarSemasi}
                        deger={seciliBlok.ayarlar}
                        degistir={(d) => blokGuncelle(seciliBlok.id, (b) => ({ ...b, ayarlar: d }) as Blok)}
                        hatalar={blokHatalari(seciliIndeks)}
                        yol={["ayarlar"]}
                      />
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <BlokListesi
                bloklar={bloklar}
                hatalar={hatalar}
                sec={setSecili}
                tasi={tasi}
                guncelle={blokGuncelle}
                setBloklar={setBloklar}
              />
            )}
          </div>
        </div>

        {/* Sağ: canlı önizleme */}
        <div className="hidden min-h-0 overflow-auto bg-[#dfe3ea] p-4 lg:block dark:bg-[#0a0f1a]">
          <iframe
            ref={iframeRef}
            title="Canlı önizleme"
            src={onizlemeAdresi}
            onLoad={gonder}
            className="mx-auto h-full rounded-lg bg-zemin shadow-kagit transition-[width] duration-300"
            style={{ width: GENISLIKLER[genislik] }}
          />
        </div>
      </div>

      {surumAcik && (
        <SurumPenceresi
          surumler={surumler}
          kapat={() => setSurumAcik(false)}
          al={(id) =>
            gecis(async () => {
              if (kirli && !confirm("Kaydedilmemiş değişikliklerin kaybolacak. Devam edilsin mi?")) return;
              const s = await surumuTaslagaAlEylemi(id);
              setSurumAcik(false);
              sonucuIsle(s, "Eski sürüm taslağa alındı. Kontrol edip yayınlayabilirsin.");
            })
          }
        />
      )}
    </div>
  );
}

function BlokListesi({
  bloklar,
  hatalar,
  sec,
  tasi,
  guncelle,
  setBloklar,
}: {
  bloklar: Blok[];
  hatalar: Hatalar;
  sec: (id: string) => void;
  tasi: (i: number, yon: -1 | 1) => void;
  guncelle: (id: string, f: (b: Blok) => Blok) => void;
  setBloklar: React.Dispatch<React.SetStateAction<Blok[]>>;
}) {
  const [eklemeAcik, setEklemeAcik] = useState(false);
  const baslikOzeti = (b: Blok) => {
    const ic = b.icerik as Record<string, unknown>;
    return String(ic.baslik ?? "").replace(/\*\*/g, "");
  };

  return (
    <div className="space-y-2">
      {bloklar.map((b, i) => {
        const hataVar = Object.keys(hatalar).some((k) => k.startsWith(`bloklar.${i}.`));
        return (
          <div
            key={b.id}
            className={cn(
              "flex items-center rounded-xl border bg-yuzey shadow-kart",
              hataVar ? "border-hata" : "border-cizgi",
              !b.ayarlar.gorunur && "opacity-60",
            )}
          >
            <button type="button" onClick={() => sec(b.id)} className="min-w-0 flex-1 px-4 py-3 text-start">
              <span className="block text-sm font-semibold text-metin">{BLOK_ADLARI[b.tur]}</span>
              <span className="block truncate text-xs text-soluk">
                {baslikOzeti(b) || "—"}
                {b.ayarlar.capa && <span className="ms-1 font-mono">#{b.ayarlar.capa}</span>}
              </span>
            </button>
            <span className="flex items-center pe-1">
              <IkonButon
                etiket={b.ayarlar.gorunur ? "Gizle" : "Göster"}
                onClick={() => guncelle(b.id, (x) => ({ ...x, ayarlar: { ...x.ayarlar, gorunur: !x.ayarlar.gorunur } }))}
              >
                {b.ayarlar.gorunur ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </IkonButon>
              <IkonButon etiket="Yukarı" disabled={i === 0} onClick={() => tasi(i, -1)}>
                <ChevronUp className="size-4" />
              </IkonButon>
              <IkonButon etiket="Aşağı" disabled={i === bloklar.length - 1} onClick={() => tasi(i, 1)}>
                <ChevronDown className="size-4" />
              </IkonButon>
              <IkonButon
                etiket="Çoğalt"
                onClick={() =>
                  setBloklar((l) => {
                    const y = [...l];
                    y.splice(i + 1, 0, { ...structuredClone(b), id: Math.random().toString(36).slice(2, 10), ayarlar: { ...b.ayarlar, capa: "" } });
                    return y;
                  })
                }
              >
                <Copy className="size-4" />
              </IkonButon>
              <IkonButon
                etiket="Sil"
                tehlike
                onClick={() => confirm(`"${BLOK_ADLARI[b.tur]}" bloğu silinsin mi?`) && setBloklar((l) => l.filter((x) => x.id !== b.id))}
              >
                <Trash2 className="size-4" />
              </IkonButon>
            </span>
          </div>
        );
      })}

      {eklemeAcik ? (
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-dashed border-cizgi-guclu p-3">
          {BLOK_TURLERI.map((tur: BlokTuru) => (
            <button
              key={tur}
              type="button"
              onClick={() => {
                const yeni = yeniBlok(tur);
                setBloklar((l) => [...l, yeni]);
                setEklemeAcik(false);
                sec(yeni.id);
              }}
              className="rounded-lg border border-cizgi bg-yuzey px-3 py-2.5 text-start text-sm font-medium text-metin hover:border-ana hover:bg-ana-acik"
            >
              {BLOK_ADLARI[tur]}
            </button>
          ))}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEklemeAcik(true)}
          className="flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-cizgi-guclu text-sm font-semibold text-ana-metin hover:border-ana hover:bg-ana-acik"
        >
          <Plus className="size-4" />
          Blok ekle
        </button>
      )}
    </div>
  );
}

function SayfaAyarlari({ meta, setMeta, hatalar }: { meta: Meta; setMeta: (m: Meta) => void; hatalar: Hatalar }) {
  const alan = (k: keyof Meta, etiket: string, sinir: number, uzun = false) => {
    const deger = String(meta[k]);
    const Bilesen = uzun ? MetinAlani : Girdi;
    return (
      <div>
        <label htmlFor={`meta-${k}`} className="mb-1.5 flex justify-between text-[13px] font-semibold text-metin">
          {etiket}
          <span className={cn("font-medium tabular-nums", deger.length > sinir ? "text-hata" : "text-soluk")}>
            {deger.length}/{sinir}
          </span>
        </label>
        <Bilesen
          id={`meta-${k}`}
          value={deger}
          rows={uzun ? 3 : undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => setMeta({ ...meta, [k]: e.target.value })}
        />
        {hatalar[`meta.${k}`] && <p className="mt-1 text-xs font-medium text-hata">{hatalar[`meta.${k}`]}</p>}
      </div>
    );
  };
  return (
    <div className="space-y-4">
      {alan("baslik", "Sayfa adı (yönetimde görünür)", 120)}
      {alan("metaBaslik", "SEO başlığı", 60)}
      {alan("metaAciklama", "SEO açıklaması", 155, true)}
      <Onay etiket="Arama motorları indekslesin" checked={meta.indeks} onChange={(d) => setMeta({ ...meta, indeks: d })} />
      <p className="text-xs text-soluk">
        Başlık 60, açıklama 155 karakteri geçmemeli (plan 6.4). Boş bırakılırsa sitenin varsayılan başlığı kullanılır.
      </p>
    </div>
  );
}

function SurumPenceresi({ surumler, kapat, al }: { surumler: Surum[]; kapat: () => void; al: (id: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => ref.current?.showModal(), []);
  return (
    <dialog
      ref={ref}
      onClose={kapat}
      className="m-auto w-[min(520px,calc(100vw-2rem))] rounded-2xl border border-cizgi bg-yuzey p-0 text-metin shadow-yuksek backdrop:bg-black/50"
    >
      <div className="flex items-center justify-between border-b border-cizgi px-5 py-4">
        <h2 className="font-bold">Yayın geçmişi</h2>
        <button type="button" onClick={() => ref.current?.close()} className={butonSinifi("hayalet", "kucuk")}>
          Kapat
        </button>
      </div>
      {surumler.length ? (
        <ul className="max-h-[60vh] divide-y divide-cizgi overflow-y-auto">
          {surumler.map((v, i) => (
            <li key={v.id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  {new Date(v.zaman).toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" })}
                  {i === 0 && <span className="ms-2 rounded bg-vurgu-acik px-1.5 text-xs text-vurgu">Son yayın</span>}
                </p>
                <p className="text-xs text-soluk">{v.kisi}</p>
              </div>
              <button type="button" onClick={() => al(v.id)} className={butonSinifi("ikincil", "kucuk")}>
                Taslağa al
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-6 text-sm text-soluk">Henüz yayın geçmişi yok. İlk “Yayınla” ile oluşur.</p>
      )}
    </dialog>
  );
}
