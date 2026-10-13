const ISLEMLER: Record<string, string> = {
  taslak_kaydet: "Taslak kaydedildi",
  yayinla: "Yayınlandı",
  surume_don: "Eski sürüm taslağa alındı",
  site_ayarlari: "Site ayarları değişti",
};

type Satir = {
  id: string;
  islem: string;
  hedefTur: string;
  hedefId: string | null;
  olusturma: Date;
  kullanici: string | null;
  eposta: string | null;
};

export function GunlukTablosu({ satirlar }: { satirlar: Satir[] }) {
  if (!satirlar.length)
    return (
      <p className="rounded-2xl border border-dashed border-cizgi-guclu p-8 text-center text-sm text-soluk">
        Henüz kayıt yok.
      </p>
    );
  return (
    <div className="overflow-x-auto rounded-2xl border border-cizgi bg-yuzey shadow-kart">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cizgi text-start text-xs text-soluk uppercase">
            <th className="px-4 py-3 text-start font-semibold">Zaman</th>
            <th className="px-4 py-3 text-start font-semibold">Kişi</th>
            <th className="px-4 py-3 text-start font-semibold">İşlem</th>
            <th className="px-4 py-3 text-start font-semibold">Hedef</th>
          </tr>
        </thead>
        <tbody>
          {satirlar.map((s) => (
            <tr key={s.id} className="border-b border-cizgi last:border-0">
              <td className="px-4 py-3 whitespace-nowrap text-soluk tabular-nums">
                {s.olusturma.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" })}
              </td>
              <td className="px-4 py-3 text-metin">{s.kullanici || s.eposta || "—"}</td>
              <td className="px-4 py-3 font-medium text-metin">{ISLEMLER[s.islem] ?? s.islem}</td>
              <td className="px-4 py-3 text-soluk">
                {s.hedefTur}
                {s.hedefId && <span className="ms-1 font-mono text-xs">{s.hedefId.slice(0, 8)}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
