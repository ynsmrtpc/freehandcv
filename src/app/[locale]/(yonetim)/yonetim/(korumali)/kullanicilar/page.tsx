import { Search } from "lucide-react";
import { YonetimBaslik } from "@/bilesenler/yonetim/YonetimKabugu";
import { kullaniciListesi } from "@/sunucu/yonetim/kullanicilar";
import { yonetimDurumu } from "@/sunucu/yetki";
import { RolSecici } from "./RolSecici";

export default async function Kullanicilar({ searchParams }: PageProps<"/[locale]/yonetim/kullanicilar">) {
  const { q } = await searchParams;
  const arama = typeof q === "string" ? q.slice(0, 100) : "";
  const [{ satirlar, toplam }, d] = await Promise.all([kullaniciListesi(arama), yonetimDurumu()]);
  const ben = d.durum === "tamam" ? d.kullanici : null;

  return (
    <>
      <YonetimBaslik
        baslik="Kullanıcılar"
        aciklama={`${toplam} kullanıcı. CV içerikleri burada görünmez (KVKK); yalnız sayıları gösterilir.`}
      >
        <form role="search" className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-soluk" aria-hidden />
          <input
            name="q"
            defaultValue={arama}
            placeholder="E-posta, ad ya da kullanıcı adı"
            aria-label="Kullanıcı ara"
            className="h-10 w-72 rounded-lg border border-cizgi-guclu bg-yuzey ps-9 pe-3 text-sm text-metin outline-none focus:border-ana focus:ring-4 focus:ring-ana/15"
          />
        </form>
      </YonetimBaslik>
      <div className="p-5 sm:p-8">
        <div className="overflow-x-auto rounded-2xl border border-cizgi bg-yuzey shadow-kart">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cizgi text-xs text-soluk uppercase">
                {["Kullanıcı", "Rol", "2FA", "CV", "İşveren paylaşımı", "Kayıt"].map((b) => (
                  <th key={b} className="px-4 py-3 text-start font-semibold">
                    {b}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {satirlar.map((k) => (
                <tr key={k.id} className="border-b border-cizgi last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-metin">{k.ad || "—"}</p>
                    <p className="text-xs text-soluk">
                      {k.email}
                      {k.kullaniciAdi && ` · @${k.kullaniciAdi}`}
                      {!k.dogrulandi && " · e-posta doğrulanmadı"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <RolSecici
                      id={k.id}
                      rol={k.rol}
                      kendisi={ben?.id === k.id}
                      duzenleyebilir={ben?.rol === "yonetici"}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {k.ikiAdim ? <span className="text-vurgu">Açık</span> : <span className="text-soluk">Kapalı</span>}
                  </td>
                  <td className="px-4 py-3 text-metin tabular-nums">{k.cv}</td>
                  <td className="px-4 py-3">
                    {k.paylasim ? <span className="font-medium text-vurgu">Onaylı</span> : <span className="text-soluk">—</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-soluk tabular-nums">
                    {k.olusturma.toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
              {!satirlar.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-soluk">
                    Kullanıcı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
