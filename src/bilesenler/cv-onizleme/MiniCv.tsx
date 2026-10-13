// Landing'deki şablon önizlemeleri. Gerçek CV değil, 5 sistem şablonunun görünüş karakterini
// taşıyan dekoratif bir kâğıttır (aria-hidden). Faz 1'de gerçek çizim motoru bunun yerini alır.
// Boyutlar `em` ile verilir; kök yazı boyutu kapsayıcı genişliğine bağlıdır (cqw), böylece
// önizleme her genişlikte aynı oranla ölçeklenir.
import { cn } from "@/ortak/cn";

export const SABLONLAR = ["modern", "ats", "zarif", "teknik", "kenar"] as const;
export type SablonKimligi = (typeof SABLONLAR)[number];

export const SABLON_ATS: Record<SablonKimligi, number> = {
  modern: 5,
  ats: 5,
  zarif: 5,
  teknik: 4,
  kenar: 4,
};

const ICERIK = {
  tr: {
    ad: "Elif Yılmaz",
    unvan: "Kıdemli Yazılım Mühendisi",
    iletisim: ["elif@ornek.com", "İstanbul", "linkedin.com/in/elif"],
    ozet: "Özet",
    deneyim: "Deneyim",
    egitim: "Eğitim",
    yetenekler: "Yetenekler",
    projeler: "Projeler",
    diller: "Diller",
    dilListesi: ["Türkçe — ana dil", "İngilizce — C1"],
  },
  en: {
    ad: "Emily Carter",
    unvan: "Senior Software Engineer",
    iletisim: ["emily@example.com", "London", "linkedin.com/in/emily"],
    ozet: "Summary",
    deneyim: "Experience",
    egitim: "Education",
    yetenekler: "Skills",
    projeler: "Projects",
    diller: "Languages",
    dilListesi: ["English — native", "German — B2"],
  },
};

const VURGU: Record<SablonKimligi, string> = {
  modern: "#1f3a5f",
  ats: "#111111",
  zarif: "#1f2937",
  teknik: "#2457c5",
  kenar: "#0f766e",
};

const YETENEKLER = ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"];

function Cizgi({ genislik, soluk }: { genislik: string; soluk?: boolean }) {
  return (
    <span
      className={cn("block h-[0.42em] rounded-full", soluk ? "bg-[#cbd5e1]" : "bg-[#94a3b8]")}
      style={{ width: genislik }}
    />
  );
}

function Paragraf({ satirlar = 3 }: { satirlar?: number }) {
  const genislikler = ["96%", "88%", "92%", "70%"];
  return (
    <div className="mt-[0.6em] space-y-[0.45em]">
      {genislikler.slice(0, satirlar).map((g, i) => (
        <Cizgi key={i} genislik={g} soluk />
      ))}
    </div>
  );
}

function Kalem({ vurgu, tarzi }: { vurgu: string; tarzi: SablonKimligi }) {
  return (
    <div className="mt-[0.9em]">
      <div className="flex items-center justify-between gap-[1em]">
        <Cizgi genislik="42%" />
        <span className="block h-[0.42em] w-[18%] rounded-full bg-[#cbd5e1]" />
      </div>
      <span
        className="mt-[0.4em] block h-[0.42em] w-[30%] rounded-full"
        style={{ background: vurgu, opacity: tarzi === "ats" ? 0.5 : 0.55 }}
      />
      <ul className="mt-[0.55em] space-y-[0.45em] ps-[0.9em]">
        {["90%", "82%", "64%"].map((g, i) => (
          <li key={i} className="relative">
            <span
              className="absolute -start-[0.85em] top-[0.08em] block size-[0.32em] rounded-full"
              style={{ background: vurgu }}
            />
            <Cizgi genislik={g} soluk />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BolumBasligi({
  children,
  tarzi,
  vurgu,
}: {
  children: React.ReactNode;
  tarzi: SablonKimligi;
  vurgu: string;
}) {
  const ortak = "mt-[1.3em] text-[0.82em] font-bold uppercase";
  if (tarzi === "modern")
    return (
      <h4 className={cn(ortak, "flex items-center gap-[0.6em] tracking-[0.07em]")} style={{ color: vurgu }}>
        {children}
        <span className="h-px flex-1 bg-[#d6dbe3]" />
      </h4>
    );
  if (tarzi === "ats")
    return (
      <h4 className={cn(ortak, "border-b border-[#9aa1ab] pb-[0.2em] tracking-[0.08em] text-[#111]")}>
        {children}
      </h4>
    );
  if (tarzi === "zarif")
    return (
      <h4 className={cn(ortak, "border-b border-[#d6dbe3] pb-[0.2em] font-semibold tracking-[0.14em]")}>
        {children}
      </h4>
    );
  return (
    <h4 className={cn(ortak, "flex items-center gap-[0.45em] tracking-[0.05em]")} style={{ color: vurgu }}>
      <span className="size-[0.5em] rounded-[0.12em]" style={{ background: vurgu }} />
      {children}
    </h4>
  );
}

/** İletişim satırı: ayraçlar boşlukla değil öğe olarak (HTML boşlukları birleştirir). */
function Iletisim({ ogeler, ayrac, className }: { ogeler: string[]; ayrac?: string; className?: string }) {
  return (
    <p className={cn("flex flex-wrap gap-x-[0.9em] gap-y-[0.2em] text-[0.72em]", className)}>
      {ogeler.map((o, i) => (
        <span key={o} className="flex gap-[0.9em]">
          {ayrac && i > 0 && <span className="opacity-60">{ayrac}</span>}
          {o}
        </span>
      ))}
    </p>
  );
}

export function MiniCv({
  sablon,
  dil = "tr",
  className,
}: {
  sablon: SablonKimligi;
  dil?: "tr" | "en";
  className?: string;
}) {
  const m = ICERIK[dil];
  const vurgu = VURGU[sablon];
  const serif = sablon === "zarif";

  const bas = (() => {
    if (sablon === "teknik")
      return (
        <div className="-mx-[1.8em] -mt-[1.6em] mb-[0.4em] px-[1.8em] py-[1.4em] text-white" style={{ background: vurgu }}>
          <p className="text-[1.9em] leading-none font-bold">{m.ad}</p>
          <p className="mt-[0.35em] text-[1em] font-medium opacity-90">{m.unvan}</p>
          <Iletisim ogeler={m.iletisim} className="mt-[0.7em] opacity-90" />
        </div>
      );
    if (sablon === "zarif")
      return (
        <div className="border-b-[3px] border-double border-[#1f2937] pb-[0.9em] text-center">
          <p className="text-[2em] leading-none font-semibold">{m.ad}</p>
          <p className="mt-[0.45em] text-[0.78em] font-medium tracking-[0.16em] uppercase">{m.unvan}</p>
          <Iletisim ogeler={m.iletisim} ayrac="·" className="mt-[0.6em] justify-center text-[#4b5563]" />
        </div>
      );
    return (
      <div
        className={cn("pb-[0.8em]", sablon === "ats" ? "border-b-[1.5px] border-[#111]" : "border-b-2")}
        style={sablon === "modern" ? { borderColor: vurgu } : undefined}
      >
        <p className={cn("text-[1.9em] leading-none font-bold", sablon === "ats" && "text-[#111]")}>{m.ad}</p>
        <p className="mt-[0.35em] text-[1em] font-semibold" style={{ color: sablon === "ats" ? "#222" : vurgu }}>
          {m.unvan}
        </p>
        <Iletisim
          ogeler={m.iletisim}
          ayrac={sablon === "ats" ? "|" : undefined}
          className="mt-[0.55em] text-[#4b5563]"
        />
      </div>
    );
  })();

  const govde = (
    <>
      <BolumBasligi tarzi={sablon} vurgu={vurgu}>{m.ozet}</BolumBasligi>
      <Paragraf />
      <BolumBasligi tarzi={sablon} vurgu={vurgu}>{m.deneyim}</BolumBasligi>
      <Kalem vurgu={vurgu} tarzi={sablon} />
      <Kalem vurgu={vurgu} tarzi={sablon} />
      <Kalem vurgu={vurgu} tarzi={sablon} />
      <BolumBasligi tarzi={sablon} vurgu={vurgu}>{m.egitim}</BolumBasligi>
      <div className="mt-[0.7em] flex justify-between">
        <Cizgi genislik="50%" />
        <span className="block h-[0.42em] w-[16%] rounded-full bg-[#cbd5e1]" />
      </div>
      {sablon !== "kenar" && (
        <>
          <BolumBasligi tarzi={sablon} vurgu={vurgu}>{m.yetenekler}</BolumBasligi>
          <div className={cn("mt-[0.7em] flex flex-wrap gap-[0.4em]", sablon === "teknik" && "grid grid-cols-2")}>
            {YETENEKLER.map((y) => (
              <span
                key={y}
                className="rounded-[0.3em] px-[0.5em] py-[0.15em] text-[0.68em] font-medium"
                style={{ background: `color-mix(in srgb, ${vurgu} 10%, #fff)`, color: vurgu }}
              >
                {y}
              </span>
            ))}
          </div>
        </>
      )}
      <BolumBasligi tarzi={sablon} vurgu={vurgu}>{m.projeler}</BolumBasligi>
      <Paragraf satirlar={2} />
      {sablon !== "kenar" && (
        <>
          <BolumBasligi tarzi={sablon} vurgu={vurgu}>{m.diller}</BolumBasligi>
          <p className="mt-[0.6em] flex gap-[1.5em] text-[0.72em] text-[#4b5563]">
            {m.dilListesi.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </p>
        </>
      )}
    </>
  );

  return (
    <div
      aria-hidden
      className={cn("@container aspect-[210/297] w-full overflow-hidden bg-kagit text-[#1f2937] select-none", className)}
    >
      <div
        className={cn("h-full text-[2.75cqw] leading-tight", serif && "font-serif")}
        style={serif ? { fontFamily: "Georgia, 'Times New Roman', serif" } : undefined}
      >
        {sablon === "kenar" ? (
          <div className="grid h-full grid-cols-[34%_1fr]">
            <div className="px-[1.2em] py-[1.6em] text-white" style={{ background: vurgu }}>
              <div className="mx-auto size-[5.5em] rounded-full border-[0.25em] border-white/70 bg-white/25" />
              <p className="mt-[1em] text-[0.82em] font-bold tracking-[0.07em] uppercase">{m.yetenekler}</p>
              <div className="mt-[0.6em] space-y-[0.5em]">
                {YETENEKLER.map((y) => (
                  <p key={y} className="text-[0.72em] opacity-90">{y}</p>
                ))}
              </div>
              <p className="mt-[1.4em] text-[0.82em] font-bold tracking-[0.07em] uppercase">{m.diller}</p>
              <div className="mt-[0.6em] space-y-[0.5em]">
                {m.dilListesi.map((d) => (
                  <p key={d} className="text-[0.72em] opacity-90">{d}</p>
                ))}
              </div>
            </div>
            <div className="px-[1.4em] py-[1.6em]">
              <p className="text-[1.75em] leading-none font-bold">{m.ad}</p>
              <p className="mt-[0.35em] text-[0.95em] font-semibold" style={{ color: vurgu }}>{m.unvan}</p>
              <p className="mt-[0.5em] text-[0.68em] text-[#4b5563]">{m.iletisim[0]}</p>
              {govde}
            </div>
          </div>
        ) : (
          <div className="h-full px-[1.8em] py-[1.6em]">
            {bas}
            {govde}
          </div>
        )}
      </div>
    </div>
  );
}
