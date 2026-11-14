import { Atkinson_Hyperlegible_Next } from "next/font/google";

// Shared by the regular root layout and the routing-level 404 document.
export const bodyFont = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});
