// CV çizim motoru (plan 6.1, 10, 11.1). Saf bileşendir: hook ve tarayıcı API'si kullanmaz;
// aynı bileşen editör önizlemesinde, yazdırmada, örnek CV sayfalarında (sunucuda HTML) ve
// sunucu PDF'inde kullanılır. Görünüşü yalnızca tasarım tanımı belirler — şablona özel kod yoktur.
import { Fragment, type ReactNode } from "react";
import { cvMetinleri } from "@/ortak/cv/basliklar";
import type { BolumKimligi, CvVerisi, Kisisel } from "@/ortak/cv/sema";
import {
  FONTLAR,
  KAGIT_OLCULERI,
  bantTuru,
  kenardaMi,
  kenarliMi,
  tasarimCoz,
  type CozulmusTasarim,
  type TasarimTanimi,
} from "@/ortak/cv/tasarim";
import {
  baglantiMetni,
  guvenliAdres,
  paragraflar,
  satirlar,
  tarihAraligi,
  virgulListesi,
  zenginParcalar,
} from "@/ortak/cv/yardimci";
import "./cv.css";

type Baglam = {
  v: CvVerisi;
  t: CozulmusTasarim;
  m: ReturnType<typeof cvMetinleri>;
  baglantisiz: boolean;
};

function Zengin({ metin }: { metin: string }) {
  return (
    <>
      {zenginParcalar(metin).map((p, i) =>
        p.kalin ? <strong key={i}>{p.metin}</strong> : <Fragment key={i}>{p.metin}</Fragment>,
      )}
    </>
  );
}

function Maddeler({ metin }: { metin: string }) {
  const l = satirlar(metin);
  if (!l.length) return null;
  return (
    <ul>
      {l.map((s, i) => (
        <li key={i}>
          <Zengin metin={s} />
        </li>
      ))}
    </ul>
  );
}

function Baglanti({
  adres,
  children,
  className,
  kapali,
}: {
  adres: string;
  children: ReactNode;
  className?: string;
  /** Küçük önizlemelerde bağlantı yok: önizleme zaten bir <a>/<button> içinde durur. */
  kapali?: boolean;
}) {
  const href = kapali ? "" : guvenliAdres(adres);
  return href ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <span className={className}>{children}</span>
  );
}

/* --- İletişim --- */

const IKONLAR: Record<string, ReactNode> = {
  posta: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  tel: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  konum: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v6M8 7.5v.01M12 16v-3.5a2 2 0 0 1 4 0V16M12 10v6" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
  ),
  web: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
};

function Ikon({ ad }: { ad: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cv-ikon">
      {IKONLAR[ad]}
    </svg>
  );
}

type IletisimOgesi = { ikon: string; metin: string; adres?: string };

function iletisimListesi(p: Kisisel): IletisimOgesi[] {
  const l: IletisimOgesi[] = [];
  if (p.eposta) l.push({ ikon: "posta", metin: p.eposta, adres: "mailto:" + p.eposta.trim() });
  if (p.telefon) l.push({ ikon: "tel", metin: p.telefon, adres: "tel:" + p.telefon.replace(/[^\d+]/g, "") });
  if (p.konum) l.push({ ikon: "konum", metin: p.konum });
  if (p.linkedin) l.push({ ikon: "linkedin", metin: baglantiMetni(p.linkedin), adres: p.linkedin });
  if (p.github) l.push({ ikon: "github", metin: baglantiMetni(p.github), adres: p.github });
  if (p.web) l.push({ ikon: "web", metin: baglantiMetni(p.web), adres: p.web });
  return l;
}

/** Dar sütunda e-posta "@" işaretinden bölünsün, harf ortasından değil. */
function Kirilabilir({ metin }: { metin: string }) {
  const [once, ...sonra] = metin.split("@");
  if (!sonra.length) return <>{metin}</>;
  return (
    <>
      {once}@<wbr />
      {sonra.join("@")}
    </>
  );
}

function Foto({ p }: { p: Kisisel }) {
  // CV, PDF ve yazdırma için düz <img> olmalı (next/image yazdırmada tembel yüklenir).
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="cv-foto" src={p.foto} alt="" />;
}

function UstBilgi({ b, kenarli }: { b: Baglam; kenarli: boolean }) {
  const { v, t, m } = b;
  const p = v.kisisel;
  const ekler = p.ekler.filter((e) => e.etiket || e.deger);
  const iletisim = kenarli ? [] : iletisimListesi(p);
  return (
    <header className="cv-bas">
      {!kenarli && t.fotoGoster && p.foto && <Foto p={p} />}
      <div className="cv-bas-metin">
        <h1 className="cv-ad">{p.ad || m.adSoyad}</h1>
        {p.unvan && <p className="cv-unvan">{p.unvan}</p>}
        {iletisim.length > 0 && (
          <ul className="cv-iletisim">
            {iletisim.map((x) => (
              <li key={x.ikon}>
                <Ikon ad={x.ikon} />
                {x.adres ? (
                  <Baglanti kapali={b.baglantisiz} adres={x.adres}>
                    <Kirilabilir metin={x.metin} />
                  </Baglanti>
                ) : (
                  <span>{x.metin}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {!kenarli && ekler.length > 0 && (
          <p className="cv-ekler">
            {ekler.map((e, i) => (
              <span key={i}>
                <b>{e.etiket}:</b> {e.deger}
              </span>
            ))}
          </p>
        )}
      </div>
    </header>
  );
}

function KenarIletisim({ b }: { b: Baglam }) {
  const p = b.v.kisisel;
  const l = iletisimListesi(p);
  const ekler = p.ekler.filter((e) => e.etiket || e.deger);
  if (!l.length && !ekler.length) return null;
  return (
    <section className="cv-bolum cv-b-iletisim">
      <h2>{b.m.basliklar.iletisim}</h2>
      <ul className="cv-yan-iletisim">
        {l.map((x) => (
          <li key={x.ikon}>
            <Ikon ad={x.ikon} />
            <span>
              {x.adres ? (
                <Baglanti kapali={b.baglantisiz} adres={x.adres}>
                  <Kirilabilir metin={x.metin} />
                </Baglanti>
              ) : (
                x.metin
              )}
            </span>
          </li>
        ))}
        {ekler.map((e, i) => (
          <li key={"ek" + i}>
            <span>
              <span className="cv-etiket-baslik">{e.etiket}</span>
              {e.deger}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* --- Bölümler --- */

function KalemUst({ sol, tarih }: { sol: ReactNode; tarih: string }) {
  return (
    <div className="cv-kalem-ust">
      <div>{sol}</div>
      {tarih && <p className="cv-tarih">{tarih}</p>}
    </div>
  );
}

function bolumGovdesi(id: BolumKimligi, b: Baglam, yanda: boolean): ReactNode {
  const { v, t, m } = b;
  const gorunur = <K extends keyof CvVerisi>(k: K) =>
    (v[k] as { gizli?: boolean }[]).filter((i) => !i.gizli) as CvVerisi[K];

  switch (id) {
    case "ozet":
      if (!v.ozet.trim()) return null;
      return (
        <div className="cv-ozet">
          {paragraflar(v.ozet).map((p, i) => (
            <p key={i}>
              <Zengin metin={p} />
            </p>
          ))}
        </div>
      );
    case "ilgi":
      if (!v.ilgi.trim()) return null;
      return (
        <div className="cv-ozet">
          {paragraflar(v.ilgi).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      );
    case "deneyim": {
      const l = gorunur("deneyim");
      if (!l.length) return null;
      return l.map((i) => {
        const alt = [i.kurum, i.konum].filter(Boolean).join(" · ");
        return (
          <article key={i.id} className="cv-kalem">
            <KalemUst
              sol={
                <>
                  <h3>{i.pozisyon}</h3>
                  {alt && <p className="cv-kurum">{alt}</p>}
                </>
              }
              tarih={tarihAraligi(i.baslangic, i.bitis, i.devam, m.gunumuz)}
            />
            {i.aciklama && (
              <p className="cv-aciklama">
                <Zengin metin={i.aciklama} />
              </p>
            )}
            <Maddeler metin={i.maddeler} />
          </article>
        );
      });
    }
    case "projeler": {
      const l = gorunur("projeler");
      if (!l.length) return null;
      return l.map((i) => (
        <article key={i.id} className="cv-kalem kisa">
          <KalemUst
            sol={
              <>
                <h3>
                  {i.baglanti ? <Baglanti kapali={b.baglantisiz} adres={i.baglanti}>{i.ad}</Baglanti> : i.ad}
                  {i.rol && <span className="cv-rol"> · {i.rol}</span>}
                </h3>
                {(i.teknolojiler || i.baglanti) && (
                  <p className="cv-teknoloji">
                    {i.teknolojiler}
                    {i.teknolojiler && i.baglanti && " · "}
                    {i.baglanti && (
                      <Baglanti kapali={b.baglantisiz} adres={i.baglanti} className="cv-baglanti">
                        {baglantiMetni(i.baglanti)}
                      </Baglanti>
                    )}
                  </p>
                )}
              </>
            }
            tarih={tarihAraligi(i.baslangic, i.bitis || (i.baslangic ? m.gunumuz : ""), false, m.gunumuz)}
          />
          {i.aciklama && (
            <p className="cv-aciklama">
              <Zengin metin={i.aciklama} />
            </p>
          )}
          <Maddeler metin={i.maddeler} />
        </article>
      ));
    }
    case "egitim": {
      const l = gorunur("egitim");
      if (!l.length) return null;
      return l.map((i) => {
        const alt = [i.bolum, i.derece].filter(Boolean).join(", ");
        const ek = [i.not ? `${m.notOrtalamasi}: ${i.not}` : "", i.konum].filter(Boolean).join(" · ");
        return (
          <article key={i.id} className="cv-kalem kisa">
            <KalemUst
              sol={
                <>
                  <h3>{i.okul}</h3>
                  {alt && <p className="cv-kurum">{alt}</p>}
                </>
              }
              tarih={tarihAraligi(i.baslangic, i.bitis, false, m.gunumuz)}
            />
            {ek && <p className="cv-aciklama">{ek}</p>}
            {i.aciklama && (
              <p className="cv-aciklama">
                <Zengin metin={i.aciklama} />
              </p>
            )}
          </article>
        );
      });
    }
    case "yetenekler": {
      const l = gorunur("yetenekler").filter((i) => i.kategori || i.liste);
      if (!l.length) return null;
      const bicim = yanda ? "liste" : t.yetenekler;
      if (bicim === "liste")
        return (
          <dl className="cv-yetenek">
            {l.map((i) => (
              <div key={i.id}>
                <dt>{i.kategori}</dt>
                <dd>{virgulListesi(i.liste).join(", ")}</dd>
              </div>
            ))}
          </dl>
        );
      return (
        <div className={bicim === "iki-sutun" ? "cv-yet-izgara" : "cv-yet-akis"}>
          {l.map((i) => (
            <div key={i.id} className="cv-yet-grup">
              {i.kategori && <h3>{i.kategori}</h3>}
              <p className="cv-etiketler">
                {virgulListesi(i.liste).map((e, j) => (
                  <Fragment key={j}>
                    {j > 0 && <span className="cv-gizli-ayrac">, </span>}
                    <span className="cv-etiket">{e}</span>
                  </Fragment>
                ))}
              </p>
            </div>
          ))}
        </div>
      );
    }
    case "sertifikalar": {
      const l = gorunur("sertifikalar").filter((i) => i.ad);
      if (!l.length) return null;
      return (
        <ul className="cv-liste">
          {l.map((i) => {
            const ek = [i.kurum, i.tarih].filter(Boolean).join(", ");
            return (
              <li key={i.id}>
                <strong>{i.baglanti ? <Baglanti kapali={b.baglantisiz} adres={i.baglanti}>{i.ad}</Baglanti> : i.ad}</strong>
                {ek && (yanda ? <span className="cv-ek cv-blok">{ek}</span> : <span className="cv-ek"> — {ek}</span>)}
              </li>
            );
          })}
        </ul>
      );
    }
    case "diller": {
      const l = gorunur("diller").filter((i) => i.dil);
      if (!l.length) return null;
      return (
        <ul className="cv-liste">
          {l.map((i) => (
            <li key={i.id}>
              <strong>{i.dil}</strong>
              {i.seviye &&
                (yanda ? <span className="cv-ek cv-blok">{i.seviye}</span> : <span className="cv-ek"> — {i.seviye}</span>)}
            </li>
          ))}
        </ul>
      );
    }
    case "referanslar": {
      const l = gorunur("referanslar").filter((i) => i.ad);
      if (!l.length) return null;
      return (
        <div className="cv-referanslar">
          {l.map((i) => {
            const unvan = [i.unvan, i.kurum].filter(Boolean).join(", ");
            return (
              <div key={i.id} className="cv-ref">
                <strong>{i.ad}</strong>
                {unvan && <span>{unvan}</span>}
                {(i.telefon || i.eposta) && (
                  <span>
                    {i.telefon && <Baglanti kapali={b.baglantisiz} adres={"tel:" + i.telefon.replace(/[^\d+]/g, "")}>{i.telefon}</Baglanti>}
                    {i.telefon && i.eposta && " · "}
                    {i.eposta && <Baglanti kapali={b.baglantisiz} adres={"mailto:" + i.eposta}>{i.eposta}</Baglanti>}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  }
}

function Bolum({ id, b, yanda }: { id: BolumKimligi; b: Baglam; yanda: boolean }) {
  const govde = bolumGovdesi(id, b, yanda);
  if (!govde) return null;
  const baslik = b.v.ayarlar.basliklar[id]?.trim() || b.m.basliklar[id];
  return (
    <section className={`cv-bolum cv-b-${id}`}>
      <h2>{baslik}</h2>
      {govde}
    </section>
  );
}

/* --- Belge --- */

export function CvBelge({
  veri,
  tanim,
  className,
  baglantisiz = false,
}: {
  veri: CvVerisi;
  tanim: TasarimTanimi;
  className?: string;
  /** Bağlantıları düz metin olarak basar (küçük önizlemeler; tıklanabilir bir öğenin içinde). */
  baglantisiz?: boolean;
}) {
  const t = tasarimCoz(tanim, veri.ayarlar);
  const m = cvMetinleri(veri.ayarlar.dil);
  const b: Baglam = { v: veri, t, m, baglantisiz };
  const kagit = KAGIT_OLCULERI[t.kagit];
  const gorunur = veri.ayarlar.bolumSirasi.filter((id) => !veri.ayarlar.gizli.includes(id));
  const kenarli = kenarliMi(t);
  const tamUstBilgi = kenarli && !!t.kenar?.tamUstBilgi;

  const stil = {
    "--cv-vurgu": t.renkler.vurgu,
    "--cv-metin": t.renkler.metin,
    "--cv-soluk": t.renkler.soluk,
    "--cv-cizgi": t.renkler.cizgi,
    "--cv-font": FONTLAR[t.yazi.font].css,
    "--cv-baslik-font": t.yazi.baslikFont ? FONTLAR[t.yazi.baslikFont].css : undefined,
    "--cv-boyut": `${t.yazi.boyut}pt`,
    "--cv-satir": t.yazi.satir,
    "--cv-aralik": t.aralikCarpani,
    "--cv-ust": `${t.kenarBosluk.ust}mm`,
    "--cv-alt": `${t.kenarBosluk.alt}mm`,
    "--cv-yatay": `${t.kenarBosluk.yatay}mm`,
    "--cv-yan": t.kenar ? `${t.kenar.genislik}mm` : undefined,
    "--cv-sayfa-g": `${kagit.genislik}mm`,
    "--cv-sayfa-y": `${kagit.yukseklik}mm`,
    "--cv-ayrac": `"${t.ayracKarakteri}"`,
  } as React.CSSProperties;

  // Her görünüş farkı bir data-* özniteliğidir; cv.css yalnız bunlara bakar.
  const veriOznitelikleri = {
    "data-yerlesim": t.yerlesim,
    "data-hizalama": t.ustBilgi.hizalama,
    "data-foto": t.ustBilgi.foto,
    "data-ayrac": t.ustBilgi.ayrac,
    "data-unvan": t.ustBilgi.unvan,
    "data-ad": t.ustBilgi.adRengi,
    "data-ad-boyut": t.ustBilgi.adBoyutu ?? "orta",
    "data-ad-bicim": t.ustBilgi.adBicimi ?? "kalin",
    "data-bant": bantTuru(t),
    "data-serit": kenarli ? "yok" : (t.serit ?? "yok"),
    "data-baslik": t.bolumBasligi,
    "data-baslik-harf": t.bolumBasligiHarf ?? "buyuk",
    "data-bolum-duzeni": t.bolumDuzeni ?? "ust",
    "data-maddeler": t.maddeler,
    "data-etiket": t.etiketStili ?? "dolu",
    "data-iletisim": t.iletisim,
    "data-kurum": t.kurum,
    "data-tarih": t.tarihYeri ?? "sag",
    "data-zaman": t.zamanCizelgesi ? "evet" : "hayir",
    "data-kenar-zemin": kenarli ? (t.kenar?.zemin ?? "vurgu") : undefined,
    "data-tam-ust": tamUstBilgi ? "evet" : undefined,
    "data-kagit": t.kagit,
  };

  let ic: ReactNode;
  if (kenarli) {
    const yan = gorunur.filter((id) => kenardaMi(t, id));
    const ana = gorunur.filter((id) => !kenardaMi(t, id));
    ic = (
      <>
        {tamUstBilgi && (
          <div className="cv-tam-ust">
            <UstBilgi b={b} kenarli={false} />
          </div>
        )}
        {/* DOM'da ana sütun önce gelir (ATS okuma sırası); kenar çubuğu grid ile yana alınır. */}
        <div className="cv-govde">
          <div className="cv-ana">
            {!tamUstBilgi && <UstBilgi b={b} kenarli />}
            {ana.map((id) => (
              <Bolum key={id} id={id} b={b} yanda={false} />
            ))}
          </div>
          <aside className="cv-yan">
            {!tamUstBilgi && t.fotoGoster && veri.kisisel.foto && <Foto p={veri.kisisel} />}
            {!tamUstBilgi && <KenarIletisim b={b} />}
            {yan.map((id) => (
              <Bolum key={id} id={id} b={b} yanda />
            ))}
          </aside>
        </div>
      </>
    );
  } else {
    ic = (
      <div className="cv-ic">
        <UstBilgi b={b} kenarli={false} />
        {gorunur.map((id) => (
          <Bolum key={id} id={id} b={b} yanda={false} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={className ? `cv ${className}` : "cv"}
      lang={veri.ayarlar.dil}
      dir={m.rtl ? "rtl" : "ltr"}
      style={stil}
      {...veriOznitelikleri}
    >
      <div className="cv-zemin" aria-hidden="true" />
      <table className="cv-cerceve" role="presentation">
        <thead>
          <tr>
            <td>
              <div className="cv-bosluk-ust" />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="cv-icerik">{ic}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>
              <div className="cv-bosluk-alt" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
