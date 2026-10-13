// CV yazı tipleri. next/font dosyaları kendi sunucumuzdan verir (plan 6.4); her aile bir CSS
// değişkeni tanımlar (FONTLAR.css bunlara başvurur). preload kapalı: tarayıcı yalnız CV'de
// kullanılan aileyi indirir. Önizleme ve örnek CV sayfaları bu sınıfı kapsayıcıya ekler.
// next/font seçenekleri derleme anında okunduğu için her çağrıda açık yazılır.
// Türkçe karakterler (ğ, ş, ı, İ) için her ailede latin-ext alt kümesi gerekir.
import {
  DM_Sans,
  EB_Garamond,
  IBM_Plex_Sans,
  Inter,
  Lato,
  Merriweather,
  Montserrat,
  Nunito_Sans,
  Playfair_Display,
  Source_Sans_3,
  Source_Serif_4,
  Space_Grotesk,
  Work_Sans,
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
const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-dm-sans",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-nunito-sans",
});
const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-work-sans",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-space-grotesk",
});
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-montserrat",
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
const ebGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-eb-garamond",
});
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--cv-font-playfair",
});

export const cvFontSiniflari = [
  inter,
  ibmPlex,
  sourceSans,
  lato,
  dmSans,
  nunitoSans,
  workSans,
  spaceGrotesk,
  montserrat,
  sourceSerif,
  merriweather,
  ebGaramond,
  playfair,
]
  .map((f) => f.variable)
  .join(" ");
