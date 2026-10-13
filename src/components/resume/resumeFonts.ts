// Resume fonts. next/font serves the files from our own server (plan 6.4); each family defines a CSS
// variable (FONTS[].css refers to them). preload is off: the browser downloads only the family the
// resume uses. Previews and example resume pages add these classes to their container.
// next/font options are read at build time, so they are written out in full on every call.
// Turkish characters (ğ, ş, ı, İ) need the latin-ext subset in every family.
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
  variable: "--resume-font-inter",
});
const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--resume-font-ibm-plex",
});
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-source-sans",
});
const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--resume-font-lato",
});
const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-dm-sans",
});
const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-nunito-sans",
});
const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-work-sans",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-space-grotesk",
});
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-montserrat",
});
const sourceSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-source-serif",
});
const merriweather = Merriweather({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
  variable: "--resume-font-merriweather",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-eb-garamond",
});
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--resume-font-playfair",
});

export const resumeFontClasses = [
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
