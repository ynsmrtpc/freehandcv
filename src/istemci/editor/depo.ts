"use client";

// Editör durumu (plan bölüm 4: Zustand). Misafir modunda veri localStorage'da durur (plan 10);
// Faz 2'de aynı depo otomatik kayıt kuyruğuyla sunucuya yazar (plan 12).
import { create } from "zustand";
import { ornekCv } from "@/ortak/cv/ornek";
import { cvNormalize, type CvVerisi } from "@/ortak/cv/sema";

export const MISAFIR_ANAHTARI = "freehandcv:misafir-cv:v1";
const GECMIS_SINIRI = 80;
/** Bu süre içindeki ardışık değişiklikler tek geri alma adımı sayılır (yazarken her tuş değil). */
const BIRLESTIRME_MS = 700;

type KayitDurumu = { tur: "bos" } | { tur: "kaydedildi"; zaman: number } | { tur: "hata" };

type Depo = {
  veri: CvVerisi | null;
  gecmis: CvVerisi[];
  gelecek: CvVerisi[];
  sonDegisiklik: number;
  kayit: KayitDurumu;
  /** Önizlemenin ölçtüğü yaklaşık sayfa sayısı (IK kontrolü kullanır; geçmişe girmez). */
  sayfaSayisi: number;
  /** Tarayıcıdan yükler; kayıt yoksa arayüz dilindeki örnek CV ile başlar. */
  baslat: (arayuzDili: string) => void;
  /** Taslağı değiştiren işlev alır; kopya üzerinde çalışır, eski hali geçmişe yazar. */
  degistir: (tarif: (taslak: CvVerisi) => void, birlestir?: boolean) => void;
  /** Tüm CV'yi değiştirir (örnek yükle, JSON içe aktar, boş başla). */
  yerineKoy: (veri: unknown) => void;
  geriAl: () => void;
  ileriAl: () => void;
};

export const useEditor = create<Depo>((set, get) => ({
  veri: null,
  gecmis: [],
  gelecek: [],
  sonDegisiklik: 0,
  kayit: { tur: "bos" },
  sayfaSayisi: 1,

  baslat(arayuzDili) {
    if (get().veri) return;
    let veri: CvVerisi | null = null;
    try {
      const ham = localStorage.getItem(MISAFIR_ANAHTARI);
      if (ham) veri = cvNormalize(JSON.parse(ham));
    } catch {
      // bozuk ya da erişilemeyen depolama: örneğe düş
    }
    set({ veri: veri ?? ornekCv(arayuzDili) });
  },

  degistir(tarif, birlestir = true) {
    const { veri, gecmis, sonDegisiklik } = get();
    if (!veri) return;
    const taslak = structuredClone(veri);
    tarif(taslak);
    const simdi = Date.now();
    const yeniAdim = !birlestir || simdi - sonDegisiklik > BIRLESTIRME_MS;
    set({
      veri: taslak,
      gecmis: yeniAdim ? [...gecmis, veri].slice(-GECMIS_SINIRI) : gecmis,
      gelecek: [],
      sonDegisiklik: birlestir ? simdi : 0,
    });
  },

  yerineKoy(ham) {
    const { veri, gecmis } = get();
    set({
      veri: cvNormalize(ham),
      gecmis: veri ? [...gecmis, veri].slice(-GECMIS_SINIRI) : gecmis,
      gelecek: [],
      sonDegisiklik: 0,
    });
  },

  geriAl() {
    const { veri, gecmis, gelecek } = get();
    if (!veri || !gecmis.length) return;
    set({ veri: gecmis[gecmis.length - 1], gecmis: gecmis.slice(0, -1), gelecek: [veri, ...gelecek], sonDegisiklik: 0 });
  },

  ileriAl() {
    const { veri, gecmis, gelecek } = get();
    if (!veri || !gelecek.length) return;
    set({ veri: gelecek[0], gecmis: [...gecmis, veri], gelecek: gelecek.slice(1), sonDegisiklik: 0 });
  },
}));

// Otomatik kayıt: değişiklikten 400 ms sonra tarayıcıya yazar; sayfa kapanırken bekleyen kayıt
// hemen yazılır (sekme kapatma, yenileme, mobilde arka plana alma).
let zamanlayici: ReturnType<typeof setTimeout> | undefined;
let bekleyen: CvVerisi | null = null;

function yaz() {
  clearTimeout(zamanlayici);
  if (!bekleyen) return;
  try {
    localStorage.setItem(MISAFIR_ANAHTARI, JSON.stringify(bekleyen));
    useEditor.setState({ kayit: { tur: "kaydedildi", zaman: Date.now() } });
  } catch {
    useEditor.setState({ kayit: { tur: "hata" } });
  }
  bekleyen = null;
}

if (typeof window !== "undefined") {
  useEditor.subscribe((durum, onceki) => {
    if (!durum.veri || durum.veri === onceki.veri) return;
    bekleyen = durum.veri;
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(yaz, 400);
  });
  window.addEventListener("pagehide", yaz);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && yaz());
}
