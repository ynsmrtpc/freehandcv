// CV metinleri için saf yardımcılar (istemci + sunucu).

/** Çok satırlı metni maddelere böler; satır başındaki "-", "•", "*" işaretleri atılır. */
export function satirlar(s: string): string[] {
  return String(s || "")
    .split(/\r?\n/)
    .map((t) => t.replace(/^\s*[-•*–]\s+/, "").trim())
    .filter(Boolean);
}

/** Boş satırla ya da satır sonuyla ayrılmış paragraflar. */
export function paragraflar(s: string): string[] {
  return String(s || "")
    .split(/\n\s*\n|\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** **kalın** işaretli metni parçalara ayırır; HTML üretmez (XSS yok). */
export function zenginParcalar(s: string): { metin: string; kalin: boolean }[] {
  return String(s || "")
    .split(/(\*\*[^*]+?\*\*)/g)
    .filter(Boolean)
    .map((p) =>
      p.startsWith("**") && p.endsWith("**") && p.length > 4
        ? { metin: p.slice(2, -2), kalin: true }
        : { metin: p, kalin: false },
    );
}

export function tarihAraligi(baslangic: string, bitis: string, devam: boolean, gunumuz: string) {
  const son = devam ? gunumuz : bitis || "";
  if (baslangic && son) return `${baslangic} – ${son}`;
  return baslangic || son || "";
}

/** Kullanıcının yazdığı bağlantıyı tıklanabilir adrese çevirir. Yalnız güvenli şemalar. */
export function guvenliAdres(deger: string): string {
  const v = String(deger || "").trim();
  if (!v) return "";
  if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
  if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return ""; // javascript:, data: vb. reddedilir
  return "https://" + v;
}

export function baglantiMetni(deger: string) {
  return String(deger || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

export function virgulListesi(s: string): string[] {
  return String(s || "")
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

const TURKCE_ASCII: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "C", Ğ: "G", İ: "I", Ö: "O", Ş: "S", Ü: "U" };

/** "Elif Yılmaz" → "Elif_Yilmaz_CV" (PDF/JSON dosya adı önerisi). */
export function dosyaAdi(ad: string, uzanti = "") {
  const temiz =
    (ad || "CV")
      .trim()
      .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => TURKCE_ASCII[c])
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\w]+/g, "_")
      .replace(/^_|_$/g, "") || "CV";
  return `${temiz}_CV${uzanti ? "." + uzanti : ""}`;
}

/** WCAG göreli parlaklık ve beyaza karşı kontrast oranı (renkli alanlar için). */
export function beyazKontrast(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return 21;
  const n = parseInt(m[1], 16);
  const l = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    })
    .reduce((t, c, i) => t + c * [0.2126, 0.7152, 0.0722][i], 0);
  return 1.05 / (l + 0.05);
}
