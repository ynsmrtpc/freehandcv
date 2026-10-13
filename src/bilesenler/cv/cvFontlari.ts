// CV yazı tipleri. next/font dosyaları kendi sunucumuzdan verir (plan 6.4); her aile bir CSS
// değişkeni tanımlar (FONTLAR.css bunlara başvurur). preload kapalı: tarayıcı yalnız CV'de
// kullanılan aileyi indirir. Önizleme ve örnek CV sayfaları bu sınıfı kapsayıcıya ekler.
// next/font seçenekleri derleme anında okunduğu için her çağrıda açık yazılır.
import {
  IBM_Plex_Sans,
  Inter,
  Lato,
  Merriweather,
  Source_Sans_3,
  Source_Serif_4,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-inter",
});
const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--cv-font-ibm-plex",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-source-sans",
});
const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--cv-font-lato",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-source-serif",
});
const merriweather = Merriweather({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--cv-font-merriweather",
});

export const cvFontSiniflari = [inter, ibmPlex, sourceSans, lato, sourceSerif, merriweather]
  .map((f) => f.variable)
  .join(" ");
