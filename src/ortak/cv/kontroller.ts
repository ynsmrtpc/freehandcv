// IK kontrolü (plan bölüm 10): saf fonksiyon. Metin üretmez; her sonuç bir anahtar ve
// parametreler döndürür, arayüz bunları kullanıcının dilinde gösterir (messages: Kontrol.*).
import type { CvVerisi } from "./sema";
import { SISTEM_SABLONLARI, type TasarimTanimi } from "./tasarim";
import { beyazKontrast, satirlar } from "./yardimci";

export type KontrolDurumu = "iyi" | "uyari" | "bilgi";
export type KontrolSonucu = {
  kimlik: string;
  durum: KontrolDurumu;
  /** Mesaj anahtarı: Kontrol.<kimlik>.<anahtar> */
  anahtar: string;
  degerler?: Record<string, string | number>;
};

export const OZET_EN_AZ = 250;
export const OZET_EN_COK = 700;
export const MADDE_EN_COK = 260;

export function kontroller(v: CvVerisi, tanim: TasarimTanimi, sayfaSayisi: number): KontrolSonucu[] {
  const c: KontrolSonucu[] = [];
  const ekle = (kimlik: string, durum: KontrolDurumu, anahtar: string, degerler?: KontrolSonucu["degerler"]) =>
    c.push({ kimlik, durum, anahtar, degerler });
  const p = v.kisisel;
  const gizli = (b: string) => v.ayarlar.gizli.includes(b as never);
  const gorunur = <T extends { gizli?: boolean }>(l: T[]) => l.filter((i) => !i.gizli);

  ekle("unvan", p.ad && p.unvan ? "iyi" : "uyari", p.unvan ? "var" : "yok");
  ekle("iletisim", p.eposta && p.telefon ? "iyi" : "uyari", p.eposta && p.telefon ? "var" : "yok");
  ekle("profil", p.linkedin || p.github || p.web ? "iyi" : "uyari", p.linkedin || p.github || p.web ? "var" : "yok");

  const n = v.ozet.trim().length;
  if (!n || gizli("ozet")) ekle("ozet", "uyari", "yok");
  else if (n < OZET_EN_AZ) ekle("ozet", "uyari", "kisa", { n });
  else if (n > OZET_EN_COK) ekle("ozet", "uyari", "uzun", { n });
  else ekle("ozet", "iyi", "ideal", { n });

  const maddeler = [...gorunur(v.deneyim), ...gorunur(v.projeler)].flatMap((i) => satirlar(i.maddeler));
  const oran = maddeler.length ? maddeler.filter((m) => /\d/.test(m)).length / maddeler.length : 0;
  const yuzde = Math.round(oran * 100);
  if (!maddeler.length) ekle("olcum", "uyari", "yok");
  else ekle("olcum", oran >= 0.3 ? "iyi" : "uyari", oran >= 0.3 ? "iyi" : "az", { yuzde });

  const uzun = maddeler.filter((m) => m.length > MADDE_EN_COK).length;
  ekle("madde", uzun ? "uyari" : "iyi", uzun ? "uzun" : "iyi", { n: uzun, sinir: MADDE_EN_COK });

  const tarihsiz =
    gorunur(v.deneyim).filter((i) => !i.baslangic).length +
    gorunur(v.egitim).filter((i) => !i.baslangic && !i.bitis).length;
  ekle("tarih", tarihsiz ? "uyari" : "iyi", tarihsiz ? "eksik" : "tam", { n: tarihsiz });

  const yetenek = gorunur(v.yetenekler).length > 0 && !gizli("yetenekler");
  ekle("yetenek", yetenek ? "iyi" : "uyari", yetenek ? "var" : "yok");

  ekle("uzunluk", sayfaSayisi <= 2 ? "iyi" : "uyari", sayfaSayisi <= 2 ? "iyi" : "uzun", { n: sayfaSayisi });

  // T.C. kimlik no (11 hane, 0 ile başlamaz) ya da hassas ek bilgi başlıkları (plan 13: KVKK).
  const metin = JSON.stringify({ ...v, kisisel: { ...p, foto: "" } }).replace(/0\d{10}/g, "");
  const hassas =
    /\b[1-9]\d{10}\b/.test(metin) ||
    p.ekler.some((e) => /(t\.?c\.?|kimlik|medeni|doğum|dogum|uyruk|din|marital|birth)/i.test(e.etiket));
  ekle("kvkk", hassas ? "uyari" : "iyi", hassas ? "var" : "yok");

  if (tanim.yerlesim !== "tek-sutun" && !tanim.tekRenk) {
    const kr = beyazKontrast(v.ayarlar.renk);
    ekle("kontrast", kr >= 4.5 ? "iyi" : "uyari", kr >= 4.5 ? "iyi" : "dusuk", { oran: kr.toFixed(1) });
  }

  const fotoVar = v.ayarlar.foto && !!p.foto && tanim.ustBilgi.foto !== "yok";
  ekle("foto", "bilgi", fotoVar ? "var" : "yok");

  const ats = atsPuani(tanim);
  ekle("ats", "bilgi", ats === 5 ? "tam" : "orta", { puan: ats });
  return c;
}

/** 0–100; "bilgi" sonuçları puana katılmaz. */
export function kontrolPuani(sonuclar: KontrolSonucu[]) {
  const puanlanan = sonuclar.filter((s) => s.durum !== "bilgi");
  const iyi = puanlanan.filter((s) => s.durum === "iyi").length;
  return { puan: puanlanan.length ? Math.round((iyi / puanlanan.length) * 100) : 0, iyi, toplam: puanlanan.length };
}

/**
 * Otomatik ATS uyum puanı (1–5, plan 11.4): şablon sahibi beyan etmez.
 * Sistem şablonlarında elle ayarlanmış değer kullanılır; kullanıcı şablonlarında tanımdan hesaplanır.
 */
export function atsPuani(tanim: TasarimTanimi): number {
  const sistem = Object.values(SISTEM_SABLONLARI).find((s) => s.tanim === tanim);
  if (sistem) return sistem.ats;
  let puan = 5;
  if (tanim.yerlesim.startsWith("kenar-cubugu")) puan -= 1;
  if (tanim.yerlesim === "ust-bant") puan -= 1;
  if (tanim.yetenekler !== "liste") puan -= 0.5;
  if (tanim.yazi.boyut < 9.5) puan -= 0.5;
  return Math.max(1, Math.round(puan));
}
