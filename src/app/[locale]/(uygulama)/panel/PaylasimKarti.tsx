"use client";

import { BriefcaseBusiness } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState, useTransition } from "react";
import { paylasimAyarlaEylemi } from "@/eylemler/paylasim";
import { cn } from "@/ortak/cn";

/**
 * İşverenlerle paylaşım için açık rıza (KVKK): varsayılan kapalı, kişi kendisi açar, istediği an
 * kapatır. Her değişiklik sunucuda rizalar tablosuna kalıcı olarak yazılır.
 */
export function PaylasimKarti({
  baslangic,
  cvler,
}: {
  baslangic: { acik: boolean; cvId: string | null };
  cvler: { id: string; baslik: string }[];
}) {
  const t = useTranslations("Riza");
  const [durum, setDurum] = useState(baslangic);
  const [mesaj, setMesaj] = useState<{ tur: "iyi" | "hata"; metin: string } | null>(null);
  const [bekliyor, gecis] = useTransition();
  const anahtarId = useId();

  const kaydet = (yeni: { acik: boolean; cvId: string | null }) => {
    const once = durum;
    setDurum(yeni);
    gecis(async () => {
      const s = await paylasimAyarlaEylemi(yeni.acik, yeni.cvId, "panel");
      if (s.tamam) setMesaj({ tur: "iyi", metin: t("kaydedildi") });
      else {
        setDurum(once);
        setMesaj({ tur: "hata", metin: t("hata") });
      }
    });
  };

  return (
    <section className="mt-8 rounded-2xl border border-cizgi bg-yuzey p-5 shadow-kart sm:p-6" aria-labelledby={`${anahtarId}-baslik`}>
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ana-acik text-ana-metin">
          <BriefcaseBusiness className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id={`${anahtarId}-baslik`} className="font-bold text-metin">
              {t("panelBaslik")}
            </h2>
            <button
              type="button"
              role="switch"
              aria-checked={durum.acik}
              aria-labelledby={`${anahtarId}-baslik`}
              disabled={bekliyor}
              onClick={() => kaydet({ acik: !durum.acik, cvId: durum.cvId })}
              className={cn(
                "relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60",
                durum.acik ? "bg-vurgu" : "bg-cizgi-guclu",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-5 rounded-full bg-white shadow transition-[inset-inline-start] duration-200",
                  durum.acik ? "start-6" : "start-1",
                )}
              />
            </button>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-soluk">{t("panelAciklama")}</p>
          <p className={cn("mt-3 text-sm font-semibold", durum.acik ? "text-vurgu" : "text-soluk")} aria-live="polite">
            {durum.acik ? t("panelAcik") : t("panelKapali")}
          </p>

          {durum.acik && cvler.length > 0 && (
            <label className="mt-4 block max-w-sm text-[13px] font-semibold text-metin">
              {t("cvSec")}
              <select
                value={durum.cvId ?? ""}
                disabled={bekliyor}
                onChange={(e) => kaydet({ acik: true, cvId: e.target.value || null })}
                className="mt-1.5 block h-10 w-full rounded-lg border border-cizgi-guclu bg-yuzey px-3 text-sm font-normal text-metin"
              >
                <option value="">{t("enGuncel")}</option>
                {cvler.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.baslik}
                  </option>
                ))}
              </select>
            </label>
          )}
          <p className="mt-3 text-xs text-soluk">{t("geriAlNot")}</p>
          {mesaj && (
            <p role={mesaj.tur === "hata" ? "alert" : "status"} className={cn("mt-2 text-xs font-medium", mesaj.tur === "hata" ? "text-hata" : "text-vurgu")}>
              {mesaj.metin}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
