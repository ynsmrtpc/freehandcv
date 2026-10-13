// Belirme sarmalayıcıları. Animasyon CSS'tedir (globals.css: .belir-yukle, .belir-kaydir);
// bu yüzden sunucu bileşenidir ve istemciye JS göndermez.
import { cn } from "@/ortak/cn";

type Ortak = { children: React.ReactNode; className?: string };

/**
 * mod="kaydir" (varsayılan): görünüme girerken belirir.
 * mod="yukle": sayfa açılınca belirir; ilk ekrandaki öğeler için. `gecikme` saniye.
 */
export function Belir({
  children,
  className,
  mod = "kaydir",
  gecikme = 0,
}: Ortak & { mod?: "kaydir" | "yukle"; gecikme?: number }) {
  return (
    <div
      className={cn(mod === "yukle" ? "belir-yukle" : "belir-kaydir", className)}
      style={gecikme ? ({ "--gecikme": `${gecikme}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/** Kademeli liste kabı; öğeleri `KademeliOge` ile sarılır. */
export function Kademeli({ children, className, as: Etiket = "div" }: Ortak & { as?: "div" | "ul" | "ol" }) {
  return <Etiket className={className}>{children}</Etiket>;
}

/** `sira`: ızgaradaki konum; aynı satırdaki öğeler biraz arayla belirir. */
export function KademeliOge({
  children,
  className,
  as: Etiket = "div",
  sira = 0,
}: Ortak & { as?: "div" | "li"; sira?: number }) {
  return (
    <Etiket className={cn("belir-kaydir", className)} style={{ "--i": sira } as React.CSSProperties}>
      {children}
    </Etiket>
  );
}
