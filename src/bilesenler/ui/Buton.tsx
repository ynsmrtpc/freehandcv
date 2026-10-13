import { cn } from "@/ortak/cn";

type Tur = "ana" | "ikincil" | "hayalet";
type Boyut = "kucuk" | "orta" | "buyuk";

const turler: Record<Tur, string> = {
  ana: "bg-ana text-white shadow-[0_1px_0_rgb(255_255_255/0.15)_inset,0_6px_16px_-6px_rgb(37_99_235/0.6)] hover:bg-ana-koyu",
  ikincil: "border border-cizgi-guclu bg-yuzey text-metin hover:bg-yuzey-2",
  hayalet: "text-soluk hover:bg-yuzey-2 hover:text-metin",
};

const boyutlar: Record<Boyut, string> = {
  kucuk: "h-9 px-3.5 text-sm",
  orta: "h-11 px-5 text-[15px]",
  buyuk: "h-12 px-6 text-base sm:h-13 sm:px-7",
};

/** Buton ve buton görünümlü bağlantılar için ortak sınıflar. */
export function butonSinifi(tur: Tur = "ana", boyut: Boyut = "orta", ek?: string) {
  return cn(
    "inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap",
    "transition-[background-color,color,transform,box-shadow] duration-200 active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-50",
    turler[tur],
    boyutlar[boyut],
    ek,
  );
}
