"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  ImagePlus,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useEditor } from "@/istemci/editor/depo";
import { cn } from "@/ortak/cn";
import { cvMetinleri } from "@/ortak/cv/basliklar";
import { OZET_EN_AZ, OZET_EN_COK } from "@/ortak/cv/kontroller";
import {
  bosKalem,
  LISTE_BOLUMLERI,
  type BolumKimligi,
  type CvVerisi,
  type ListeBolumu,
} from "@/ortak/cv/sema";
import { Alan, Girdi, IkonButon, MetinAlani, Onay } from "./ui";

type AlanTanimi = {
  k: string;
  tip?: "metin" | "uzun" | "maddeler" | "onay";
  tur?: "email" | "tel" | "url";
  yarim?: boolean;
  satir?: number;
  pasifEger?: string;
};

// Kalem alanları. Sıra = formdaki sıra.
const ALANLAR: Record<ListeBolumu, AlanTanimi[]> = {
  deneyim: [
    { k: "pozisyon" },
    { k: "kurum" },
    { k: "konum", yarim: true },
    { k: "devam", tip: "onay", yarim: true },
    { k: "baslangic", yarim: true },
    { k: "bitis", yarim: true, pasifEger: "devam" },
    { k: "aciklama", tip: "uzun", satir: 2 },
    { k: "maddeler", tip: "maddeler", satir: 7 },
  ],
  projeler: [
    { k: "ad", yarim: true },
    { k: "rol", yarim: true },
    { k: "baslangic", yarim: true },
    { k: "bitis", yarim: true },
    { k: "teknolojiler" },
    { k: "baglanti", tur: "url" },
    { k: "aciklama", tip: "uzun", satir: 2 },
    { k: "maddeler", tip: "maddeler", satir: 4 },
  ],
  yetenekler: [{ k: "kategori" }, { k: "liste", tip: "uzun", satir: 2 }],
  egitim: [
    { k: "okul" },
    { k: "bolum", yarim: true },
    { k: "derece", yarim: true },
    { k: "baslangic", yarim: true },
    { k: "bitis", yarim: true },
    { k: "not", yarim: true },
    { k: "konum", yarim: true },
    { k: "aciklama", tip: "uzun", satir: 2 },
  ],
  sertifikalar: [{ k: "ad" }, { k: "kurum", yarim: true }, { k: "tarih", yarim: true }, { k: "baglanti", tur: "url" }],
  diller: [{ k: "dil", yarim: true }, { k: "seviye", yarim: true }],
  referanslar: [
    { k: "ad" },
    { k: "unvan", yarim: true },
    { k: "kurum", yarim: true },
    { k: "telefon", yarim: true, tur: "tel" },
    { k: "eposta", yarim: true, tur: "email" },
  ],
};

/** Kapalı kalemin başlığında görünen kısa ad. */
function kalemOzeti(bolum: ListeBolumu, k: Record<string, unknown>) {
  const s = (a: string) => (typeof k[a] === "string" ? (k[a] as string) : "");
  switch (bolum) {
    case "deneyim":
      return [s("pozisyon"), s("kurum")].filter(Boolean).join(" — ");
    case "egitim":
      return [s("okul"), s("bolum")].filter(Boolean).join(" — ");
    case "diller":
      return [s("dil"), s("seviye")].filter(Boolean).join(" — ");
    case "yetenekler":
      return s("kategori");
    default:
      return s("ad");
  }
}

const KISISEL_ALANLARI: AlanTanimi[] = [
  { k: "ad" },
  { k: "unvan" },
  { k: "eposta", yarim: true, tur: "email" },
  { k: "telefon", yarim: true, tur: "tel" },
  { k: "konum", yarim: true },
  { k: "linkedin", yarim: true },
  { k: "github", yarim: true },
  { k: "web", yarim: true },
];

function tasi<T>(dizi: T[], i: number, yon: -1 | 1) {
  const j = i + yon;
  if (j < 0 || j >= dizi.length) return;
  [dizi[i], dizi[j]] = [dizi[j], dizi[i]];
}

/** Görseli merkezden kare kırpıp 480 px JPEG'e küçültür (localStorage kotası için). */
function fotoKirp(dosya: File): Promise<string> {
  return new Promise((coz, reddet) => {
    const okuyucu = new FileReader();
    okuyucu.onerror = reddet;
    okuyucu.onload = () => {
      const img = new Image();
      img.onerror = reddet;
      img.onload = () => {
        const kenar = Math.min(img.naturalWidth, img.naturalHeight);
        const boy = Math.min(480, kenar);
        const c = document.createElement("canvas");
        c.width = c.height = boy;
        const x = c.getContext("2d")!;
        x.imageSmoothingQuality = "high";
        // Yüz genelde üst kısımda: dikeyde dörtte birden kırp.
        x.drawImage(img, (img.naturalWidth - kenar) / 2, (img.naturalHeight - kenar) / 4, kenar, kenar, 0, 0, boy, boy);
        coz(c.toDataURL("image/jpeg", 0.88));
      };
      img.src = okuyucu.result as string;
    };
    okuyucu.readAsDataURL(dosya);
  });
}

export function IcerikPaneli({ bildir }: { bildir: (m: string) => void }) {
  const t = useTranslations("Editor");
  const veri = useEditor((d) => d.veri)!;
  const degistir = useEditor((d) => d.degistir);
  const [acik, setAcik] = useState<Set<string>>(() => new Set(["kisisel"]));

  const ac = (id: string, durum: boolean) =>
    setAcik((s) => {
      const y = new Set(s);
      if (durum) y.add(id);
      else y.delete(id);
      return y;
    });

  const sira = veri.ayarlar.bolumSirasi;

  return (
    <div className="space-y-3 p-4 sm:p-5">
      <p className="text-[13px] leading-relaxed text-soluk">{t("bolumNot")}</p>
      <KisiselBolum acik={acik.has("kisisel")} ac={(d) => ac("kisisel", d)} bildir={bildir} />
      {sira.map((id, i) => (
        <BolumEditoru
          key={id}
          id={id}
          sira={i}
          toplam={sira.length}
          veri={veri}
          degistir={degistir}
          acik={acik}
          ac={ac}
        />
      ))}
    </div>
  );
}

function Akordeon({
  acik,
  ac,
  baslik,
  sayac,
  araclar,
  gizli,
  children,
}: {
  acik: boolean;
  ac: (d: boolean) => void;
  baslik: React.ReactNode;
  sayac?: number;
  araclar?: React.ReactNode;
  gizli?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-xl border border-cizgi bg-yuzey shadow-kart", gizli && "opacity-60")}>
      <div className="flex min-h-13 items-center gap-1 pe-2">
        <button
          type="button"
          aria-expanded={acik}
          onClick={() => ac(!acik)}
          className="flex min-h-13 flex-1 items-center gap-2.5 rounded-xl ps-4 text-start text-[15px] font-semibold text-metin"
        >
          <ChevronDown className={cn("size-4 shrink-0 text-soluk transition-transform duration-200", !acik && "-rotate-90 rtl:rotate-90")} />
          <span className="min-w-0 truncate">{baslik}</span>
          {sayac !== undefined && (
            <span className="rounded-full bg-yuzey-2 px-2 py-0.5 text-xs font-semibold text-soluk tabular-nums">{sayac}</span>
          )}
        </button>
        {araclar}
      </div>
      {acik && <div className="border-t border-cizgi px-4 pt-4 pb-5">{children}</div>}
    </div>
  );
}

function KisiselBolum({ acik, ac, bildir }: { acik: boolean; ac: (d: boolean) => void; bildir: (m: string) => void }) {
  const t = useTranslations("Editor");
  const p = useEditor((d) => d.veri!.kisisel);
  const degistir = useEditor((d) => d.degistir);
  const dosyaRef = useRef<HTMLInputElement>(null);

  return (
    <Akordeon acik={acik} ac={ac} baslik={t("kisisel.baslik")}>
      <div className="mb-5 flex items-center gap-4">
        <div className="grid size-18 shrink-0 place-items-center overflow-hidden rounded-full bg-yuzey-2 text-soluk ring-1 ring-cizgi">
          {p.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.foto} alt="" className="size-full object-cover" />
          ) : (
            <UserRound className="size-8" />
          )}
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => dosyaRef.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-cizgi-guclu px-3 text-sm font-semibold text-metin hover:bg-yuzey-2"
            >
              <ImagePlus className="size-4" />
              {p.foto ? t("kisisel.fotoDegistir") : t("kisisel.fotoYukle")}
            </button>
            {p.foto && (
              <button
                type="button"
                onClick={() => degistir((v) => void (v.kisisel.foto = ""), false)}
                className="h-9 rounded-lg px-3 text-sm font-semibold text-soluk hover:bg-yuzey-2 hover:text-metin"
              >
                {t("kisisel.fotoKaldir")}
              </button>
            )}
          </div>
          <p className="mt-1.5 text-xs text-soluk">{t("kisisel.fotoIpucu")}</p>
          <input
            ref={dosyaRef}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const dosya = e.target.files?.[0];
              e.target.value = "";
              if (!dosya) return;
              try {
                const foto = await fotoKirp(dosya);
                degistir((v) => {
                  v.kisisel.foto = foto;
                  v.ayarlar.foto = true;
                }, false);
              } catch {
                bildir(t("bildirim.gorselHata"));
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {KISISEL_ALANLARI.map((a) => (
          <Alan key={a.k} etiket={t(`alanlar.kisisel.${a.k}` as never)} yarim={a.yarim}>
            {(id) => (
              <Girdi
                id={id}
                type={a.tur ?? "text"}
                value={p[a.k as keyof typeof p] as string}
                placeholder={t(`ornekler.kisisel.${a.k}` as never)}
                onChange={(e) => {
                  const d = e.target.value;
                  degistir((v) => void ((v.kisisel as Record<string, unknown>)[a.k] = d));
                }}
              />
            )}
          </Alan>
        ))}

        <div className="col-span-2">
          <p className="text-[13px] font-semibold text-metin">{t("kisisel.ekler")}</p>
          <p className="mt-0.5 mb-2 text-xs text-soluk">{t("kisisel.eklerIpucu")}</p>
          <div className="space-y-2">
            {p.ekler.map((e, i) => (
              <div key={i} className="flex gap-2">
                <Girdi
                  aria-label={`${t("kisisel.ekEtiket")} ${i + 1}`}
                  placeholder={t("ornekler.ekEtiket")}
                  value={e.etiket}
                  className="w-2/5"
                  onChange={(x) => {
                    const d = x.target.value;
                    degistir((v) => void (v.kisisel.ekler[i].etiket = d));
                  }}
                />
                <Girdi
                  aria-label={`${t("kisisel.ekDeger")} ${i + 1}`}
                  placeholder={t("ornekler.ekDeger")}
                  value={e.deger}
                  onChange={(x) => {
                    const d = x.target.value;
                    degistir((v) => void (v.kisisel.ekler[i].deger = d));
                  }}
                />
                <IkonButon
                  etiket={t("kisisel.ekSil")}
                  tehlike
                  className="size-10"
                  onClick={() => degistir((v) => void v.kisisel.ekler.splice(i, 1), false)}
                >
                  <Trash2 className="size-4" />
                </IkonButon>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => degistir((v) => void v.kisisel.ekler.push({ etiket: "", deger: "" }), false)}
            className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-ana-metin hover:bg-ana-acik"
          >
            <Plus className="size-4" />
            {t("kisisel.ekEkle")}
          </button>
        </div>
      </div>
    </Akordeon>
  );
}

function BolumEditoru({
  id,
  sira,
  toplam,
  veri,
  degistir,
  acik,
  ac,
}: {
  id: BolumKimligi;
  sira: number;
  toplam: number;
  veri: CvVerisi;
  degistir: ReturnType<typeof useEditor.getState>["degistir"];
  acik: Set<string>;
  ac: (id: string, d: boolean) => void;
}) {
  const t = useTranslations("Editor");
  const ad = t(`bolumler.${id}`);
  const gizli = veri.ayarlar.gizli.includes(id);
  const liste = (LISTE_BOLUMLERI as readonly string[]).includes(id) ? (id as ListeBolumu) : null;
  const varsayilanBaslik = cvMetinleri(veri.ayarlar.dil).basliklar[id];

  const araclar = (
    <span className="flex items-center">
      <IkonButon
        etiket={`${gizli ? t("goster") : t("gizle")}: ${ad}`}
        aria-pressed={gizli}
        onClick={() =>
          degistir((v) => {
            v.ayarlar.gizli = gizli ? v.ayarlar.gizli.filter((x) => x !== id) : [...v.ayarlar.gizli, id];
          }, false)
        }
      >
        {gizli ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </IkonButon>
      <IkonButon
        etiket={`${t("yukari")}: ${ad}`}
        disabled={sira === 0}
        onClick={() => degistir((v) => tasi(v.ayarlar.bolumSirasi, sira, -1), false)}
      >
        <ChevronUp className="size-4" />
      </IkonButon>
      <IkonButon
        etiket={`${t("asagi")}: ${ad}`}
        disabled={sira === toplam - 1}
        onClick={() => degistir((v) => tasi(v.ayarlar.bolumSirasi, sira, 1), false)}
      >
        <ChevronDown className="size-4" />
      </IkonButon>
    </span>
  );

  return (
    <Akordeon
      acik={acik.has(id)}
      ac={(d) => ac(id, d)}
      baslik={ad}
      sayac={liste ? veri[liste].length : undefined}
      araclar={araclar}
      gizli={gizli}
    >
      <div className="space-y-4">
        <Alan etiket={t("bolumBasligi")}>
          {(fid) => (
            <Girdi
              id={fid}
              value={veri.ayarlar.basliklar[id] ?? ""}
              placeholder={varsayilanBaslik}
              onChange={(e) => {
                const d = e.target.value;
                degistir((v) => void (v.ayarlar.basliklar[id] = d));
              }}
            />
          )}
        </Alan>

        {id === "ozet" && <OzetAlani />}
        {id === "ilgi" && (
          <Alan etiket={t("ilgiEtiket")}>
            {(fid) => (
              <MetinAlani
                id={fid}
                rows={3}
                value={veri.ilgi}
                placeholder={t("ilgiOrnek")}
                onChange={(e) => {
                  const d = e.target.value;
                  degistir((v) => void (v.ilgi = d));
                }}
              />
            )}
          </Alan>
        )}
        {liste && <KalemListesi bolum={liste} veri={veri} degistir={degistir} acik={acik} ac={ac} />}
      </div>
    </Akordeon>
  );
}

function OzetAlani() {
  const t = useTranslations("Editor");
  const ozet = useEditor((d) => d.veri!.ozet);
  const degistir = useEditor((d) => d.degistir);
  const n = ozet.length;
  const uyari = n > 0 && (n < OZET_EN_AZ || n > OZET_EN_COK);
  return (
    <Alan
      etiket={t("ozetEtiket")}
      ipucu={t("ozetIpucu")}
      ek={
        <span className={cn("text-xs font-medium tabular-nums", uyari ? "text-uyari" : "text-soluk")}>
          {t("karakter", { n })}
        </span>
      }
    >
      {(id) => (
        <MetinAlani
          id={id}
          rows={7}
          value={ozet}
          placeholder={t("ozetOrnek")}
          onChange={(e) => {
            const d = e.target.value;
            degistir((v) => void (v.ozet = d));
          }}
        />
      )}
    </Alan>
  );
}

function KalemListesi({
  bolum,
  veri,
  degistir,
  acik,
  ac,
}: {
  bolum: ListeBolumu;
  veri: CvVerisi;
  degistir: ReturnType<typeof useEditor.getState>["degistir"];
  acik: Set<string>;
  ac: (id: string, d: boolean) => void;
}) {
  const t = useTranslations("Editor");
  const dil = useLocale();
  const tekil = t(`tekil.${bolum}`);
  const kalemler = veri[bolum] as (Record<string, unknown> & { id: string; gizli?: boolean })[];
  const liste = (v: CvVerisi) => v[bolum] as unknown as Record<string, unknown>[];

  return (
    <div className="space-y-2.5">
      {kalemler.map((k, i) => {
        const ozet = kalemOzeti(bolum, k) || t("adsiz", { tur: tekil, n: i + 1 });
        const kalemAcik = acik.has(k.id);
        return (
          <div key={k.id} className={cn("rounded-lg border border-cizgi bg-zemin/60", k.gizli && "opacity-60")}>
            <div className="flex min-h-11 items-center gap-0.5 pe-1">
              <button
                type="button"
                aria-expanded={kalemAcik}
                onClick={() => ac(k.id, !kalemAcik)}
                className="flex min-h-11 min-w-0 flex-1 items-center gap-2 ps-3 text-start text-sm font-semibold text-metin"
              >
                <ChevronDown className={cn("size-3.5 shrink-0 text-soluk transition-transform", !kalemAcik && "-rotate-90 rtl:rotate-90")} />
                <span className="truncate">{ozet}</span>
              </button>
              <IkonButon
                etiket={`${k.gizli ? t("goster") : t("gizle")}: ${ozet}`}
                aria-pressed={!!k.gizli}
                onClick={() => degistir((v) => void (liste(v)[i].gizli = !k.gizli), false)}
              >
                {k.gizli ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </IkonButon>
              <IkonButon
                etiket={`${t("yukari")}: ${ozet}`}
                disabled={i === 0}
                onClick={() => degistir((v) => tasi(liste(v), i, -1), false)}
              >
                <ChevronUp className="size-4" />
              </IkonButon>
              <IkonButon
                etiket={`${t("asagi")}: ${ozet}`}
                disabled={i === kalemler.length - 1}
                onClick={() => degistir((v) => tasi(liste(v), i, 1), false)}
              >
                <ChevronDown className="size-4" />
              </IkonButon>
              <IkonButon
                etiket={`${t("cogalt")}: ${ozet}`}
                className="hidden sm:grid"
                onClick={() => {
                  const kopya = { ...structuredClone(k), id: bosKalem(bolum).id };
                  degistir((v) => void liste(v).splice(i + 1, 0, kopya), false);
                  ac(kopya.id, true);
                }}
              >
                <Copy className="size-4" />
              </IkonButon>
              <IkonButon
                etiket={`${t("sil")}: ${ozet}`}
                tehlike
                onClick={() => {
                  if (!confirm(t("onay.kalemSil", { ad: ozet }))) return;
                  degistir((v) => void liste(v).splice(i, 1), false);
                }}
              >
                <Trash2 className="size-4" />
              </IkonButon>
            </div>
            {kalemAcik && (
              <div className="grid grid-cols-2 gap-x-3 gap-y-4 border-t border-cizgi px-3 pt-3 pb-4">
                {ALANLAR[bolum].map((a) => {
                  const deger = k[a.k];
                  const etiket = t(`alanlar.${bolum}.${a.k}` as never);
                  if (a.tip === "onay")
                    return (
                      <div key={a.k} className="col-span-1 flex items-end">
                        <Onay
                          etiket={etiket}
                          checked={!!deger}
                          onChange={(d) => degistir((v) => void (liste(v)[i][a.k] = d), false)}
                        />
                      </div>
                    );
                  const pasif = !!(a.pasifEger && k[a.pasifEger]);
                  const ornek = t.has(`ornekler.${bolum}.${a.k}` as never) ? t(`ornekler.${bolum}.${a.k}` as never) : "";
                  const yaz = (d: string) => degistir((v) => void (liste(v)[i][a.k] = d));
                  return (
                    <Alan
                      key={a.k}
                      etiket={etiket}
                      yarim={a.yarim}
                      ipucu={a.tip === "maddeler" ? t("maddeIpucu") : undefined}
                    >
                      {(id) =>
                        a.tip === "uzun" || a.tip === "maddeler" ? (
                          <MetinAlani
                            id={id}
                            rows={a.satir}
                            value={deger as string}
                            placeholder={ornek}
                            onChange={(e) => yaz(e.target.value)}
                          />
                        ) : (
                          <Girdi
                            id={id}
                            type={a.tur ?? "text"}
                            value={pasif ? "" : (deger as string)}
                            placeholder={pasif ? t("gunumuz") : a.k === "bitis" && bolum === "projeler" ? t("devamEdiyor") : ornek}
                            disabled={pasif}
                            onChange={(e) => yaz(e.target.value)}
                          />
                        )
                      }
                    </Alan>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          const yeni = bosKalem(bolum);
          degistir((v) => void (v[bolum] as unknown[]).push(yeni), false);
          ac(yeni.id, true);
        }}
        className="flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-cizgi-guclu text-sm font-semibold text-ana-metin transition-colors hover:border-ana hover:bg-ana-acik"
      >
        <Plus className="size-4" />
        {t("ekle", { tur: tekil.toLocaleLowerCase(dil) })}
      </button>
    </div>
  );
}
