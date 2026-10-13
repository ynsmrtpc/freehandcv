"use client";

// Editör durumu (plan bölüm 4: Zustand). İki kayıt kaynağı vardır:
// - misafir: veri tarayıcının localStorage'ında durur (plan 10),
// - hesap: değişiklikler 1 sn bekleyip sunucuya yazılır; sürüm farklıysa çakışma bildirilir,
//   bağlantı yoksa bekler ve bağlantı gelince yeniden dener (plan 12).
import { create } from "zustand";
import { cvKaydetEylemi } from "@/eylemler/cv";
import { ornekCv } from "@/ortak/cv/ornek";
import { cvNormalize, type CvVerisi } from "@/ortak/cv/sema";

export const MISAFIR_ANAHTARI = "freehandcv:misafir-cv:v1";
const GECMIS_SINIRI = 80;
/** Bu süre içindeki ardışık değişiklikler tek geri alma adımı sayılır (yazarken her tuş değil). */
const BIRLESTIRME_MS = 700;
const MISAFIR_GECIKME = 400;
const HESAP_GECIKME = 1000;

export type Kaynak = { tur: "misafir" } | { tur: "hesap"; id: string; surum: number };

export type KayitDurumu =
  | { tur: "bos" }
  | { tur: "bekliyor" }
  | { tur: "kaydediliyor" }
  | { tur: "kaydedildi"; zaman: number }
  | { tur: "hata"; neden: "depolama" | "baglanti" | "buyuk" | "oturum" }
  | { tur: "cakisma"; sunucuSurumu: number };

type Depo = {
  veri: CvVerisi | null;
  kaynak: Kaynak;
  gecmis: CvVerisi[];
  gelecek: CvVerisi[];
  sonDegisiklik: number;
  kayit: KayitDurumu;
  /** Önizlemenin ölçtüğü yaklaşık sayfa sayısı (IK kontrolü kullanır; geçmişe girmez). */
  sayfaSayisi: number;
  /** Misafir: tarayıcıdan yükler; kayıt yoksa arayüz dilindeki örnek CV ile başlar. */
  misafirBaslat: (arayuzDili: string) => void;
  /** Hesap: sunucudan gelen CV ile başlar. */
  hesapBaslat: (id: string, veri: CvVerisi, surum: number) => void;
  /** Taslağı değiştiren işlev alır; kopya üzerinde çalışır, eski hali geçmişe yazar. */
  degistir: (tarif: (taslak: CvVerisi) => void, birlestir?: boolean) => void;
  /** Tüm CV'yi değiştirir (örnek yükle, JSON içe aktar, boş başla). */
  yerineKoy: (veri: unknown) => void;
  geriAl: () => void;
  ileriAl: () => void;
  /** Çakışmada "benimkini koru": sunucudaki sürümün üzerine yazar. */
  benimkiniKoru: () => void;
  /** Bekleyen kaydı hemen yazar (sekme kapanırken). */
  simdiKaydet: () => void;
};

const SIFIR = { gecmis: [], gelecek: [], sonDegisiklik: 0, kayit: { tur: "bos" } as KayitDurumu, sayfaSayisi: 1 };

export const useEditor = create<Depo>((set, get) => ({
  veri: null,
  kaynak: { tur: "misafir" },
  ...SIFIR,

  misafirBaslat(arayuzDili) {
    const { veri, kaynak } = get();
    if (veri && kaynak.tur === "misafir") return;
    if (veri) get().simdiKaydet(); // önceki CV'nin bekleyen kaydı kaybolmasın
    let yuklu: CvVerisi | null = null;
    try {
      const ham = localStorage.getItem(MISAFIR_ANAHTARI);
      if (ham) yuklu = cvNormalize(JSON.parse(ham));
    } catch {
      // bozuk ya da erişilemeyen depolama: örneğe düş
    }
    set({ ...SIFIR, veri: yuklu ?? ornekCv(arayuzDili), kaynak: { tur: "misafir" } });
  },

  hesapBaslat(id, veri, surum) {
    const k = get().kaynak;
    if (k.tur === "hesap" && k.id === id && get().veri) return;
    if (get().veri) get().simdiKaydet();
    kirli = false;
    set({ ...SIFIR, veri, kaynak: { tur: "hesap", id, surum } });
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

  benimkiniKoru() {
    const { kaynak, kayit } = get();
    if (kaynak.tur !== "hesap" || kayit.tur !== "cakisma") return;
    kirli = true;
    set({ kaynak: { ...kaynak, surum: kayit.sunucuSurumu }, kayit: { tur: "bekliyor" } });
    void hesabaYaz();
  },

  simdiKaydet() {
    clearTimeout(zamanlayici);
    if (get().kaynak.tur === "misafir") misafireYaz();
    else void hesabaYaz();
  },
}));

/* ---------------- Otomatik kayıt ---------------- */

let zamanlayici: ReturnType<typeof setTimeout> | undefined;
let kirli = false;
let yaziliyor = false;

function misafireYaz() {
  const { veri, kaynak } = useEditor.getState();
  if (!kirli || !veri || kaynak.tur !== "misafir") return;
  try {
    localStorage.setItem(MISAFIR_ANAHTARI, JSON.stringify(veri));
    kirli = false;
    useEditor.setState({ kayit: { tur: "kaydedildi", zaman: Date.now() } });
  } catch {
    useEditor.setState({ kayit: { tur: "hata", neden: "depolama" } });
  }
}

async function hesabaYaz() {
  const durum = useEditor.getState();
  if (durum.kaynak.tur !== "hesap" || !durum.veri || durum.kayit.tur === "cakisma" || !kirli) return;
  if (yaziliyor) {
    // Bir yazım sürerken gelen değişiklik, o bitince yazılır.
    clearTimeout(zamanlayici);
    zamanlayici = setTimeout(() => void hesabaYaz(), 300);
    return;
  }
  const { id, surum } = durum.kaynak;
  const gonderilen = durum.veri;
  yaziliyor = true;
  kirli = false;
  useEditor.setState({ kayit: { tur: "kaydediliyor" } });
  try {
    const s = await cvKaydetEylemi(id, gonderilen, surum);
    const k = useEditor.getState().kaynak;
    if (k.tur !== "hesap" || k.id !== id) return; // bu arada başka CV açıldı
    if (s.tamam) {
      const degisti = useEditor.getState().veri !== gonderilen;
      if (degisti) kirli = true;
      useEditor.setState({
        kaynak: { ...k, surum: s.surum },
        kayit: degisti ? { tur: "bekliyor" } : { tur: "kaydedildi", zaman: Date.now() },
      });
      if (degisti) zamanlayici = setTimeout(() => void hesabaYaz(), HESAP_GECIKME);
    } else {
      kirli = true;
      useEditor.setState({
        kayit:
          s.neden === "cakisma"
            ? { tur: "cakisma", sunucuSurumu: s.sunucuSurumu ?? surum }
            : { tur: "hata", neden: s.neden === "buyuk" ? "buyuk" : s.neden === "oturum" ? "oturum" : "baglanti" },
      });
    }
  } catch {
    kirli = true;
    useEditor.setState({ kayit: { tur: "hata", neden: "baglanti" } });
  } finally {
    yaziliyor = false;
  }
}

if (typeof window !== "undefined") {
  useEditor.subscribe((durum, onceki) => {
    // Yalnız aynı CV üzerindeki içerik değişiklikleri kayıt tetikler (yeni CV açmak değil).
    if (!durum.veri || durum.veri === onceki.veri || !onceki.veri) return;
    if (durum.kaynak.tur !== onceki.kaynak.tur) return;
    if (durum.kaynak.tur === "hesap" && onceki.kaynak.tur === "hesap" && durum.kaynak.id !== onceki.kaynak.id) return;
    kirli = true;
    clearTimeout(zamanlayici);
    if (durum.kaynak.tur === "misafir") {
      zamanlayici = setTimeout(misafireYaz, MISAFIR_GECIKME);
    } else if (durum.kayit.tur !== "cakisma") {
      if (durum.kayit.tur !== "kaydediliyor") useEditor.setState({ kayit: { tur: "bekliyor" } });
      zamanlayici = setTimeout(() => void hesabaYaz(), HESAP_GECIKME);
    }
  });
  const kapanirken = () => useEditor.getState().simdiKaydet();
  window.addEventListener("pagehide", kapanirken);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && kapanirken());
  window.addEventListener("online", () => {
    if (useEditor.getState().kayit.tur === "hata") useEditor.getState().simdiKaydet();
  });
}
