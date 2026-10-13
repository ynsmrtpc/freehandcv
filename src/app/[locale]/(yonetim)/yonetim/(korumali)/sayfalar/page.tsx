import { ChevronRight } from "lucide-react";
import { YonetimBaslik } from "@/bilesenler/yonetim/YonetimKabugu";
import { Link } from "@/i18n/navigation";
import { sayfaListesi } from "@/sunucu/icerik/sayfalar";

export default async function Sayfalar() {
  const liste = await sayfaListesi();
  return (
    <>
      <YonetimBaslik baslik="Sayfalar" aciklama="Landing ve diğer sayfalar blok blok düzenlenir; değişiklikler “Yayınla” deyince sitede görünür." />
      <div className="p-5 sm:p-8">
        <ul className="divide-y divide-cizgi overflow-hidden rounded-2xl border border-cizgi bg-yuzey shadow-kart">
          {liste.map((s) => (
            <li key={s.id}>
              <Link
                href={{ pathname: "/yonetim/sayfalar/[id]", params: { id: s.id } }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-yuzey-2"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-yuzey-2 text-xs font-bold text-soluk uppercase">
                  {s.dil}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-metin">{s.baslik}</span>
                  <span className="block text-xs text-soluk">
                    /{s.slug} · {s.tur} · {s.guncelleme.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </span>
                {s.taslakFarkli ? (
                  <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-xs font-semibold text-uyari dark:bg-[#3a2a05]">
                    Yayınlanmamış değişiklik
                  </span>
                ) : (
                  <span className="rounded-full bg-vurgu-acik px-2 py-0.5 text-xs font-semibold text-vurgu">Yayında</span>
                )}
                <ChevronRight className="size-4 text-soluk rtl:rotate-180" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
