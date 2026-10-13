import { Belir } from "@/bilesenler/hareket/Belir";
import { cn } from "@/ortak/cn";

/** Bölüm kabı: ortak genişlik, dikey ritim ve çapa kimliği. */
export function Bolum({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("px-4 py-20 sm:px-6 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/** Üst etiket + başlık + açıklama. */
export function BolumBasligi({
  ust,
  baslik,
  aciklama,
  ortali = true,
}: {
  ust?: string;
  baslik: string;
  aciklama?: string;
  ortali?: boolean;
}) {
  return (
    <Belir className={cn("max-w-2xl", ortali && "mx-auto text-center")}>
      {ust && (
        <p className="text-sm font-semibold tracking-wide text-ana-metin uppercase">{ust}</p>
      )}
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-balance text-metin sm:text-4xl">
        {baslik}
      </h2>
      {aciklama && (
        <p className="mt-4 text-lg leading-relaxed text-pretty text-soluk">{aciklama}</p>
      )}
    </Belir>
  );
}
