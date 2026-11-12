# FreehandCV — Web Uygulaması Planı

> Durum: **Faz 0 kodda tamam** (Ekim 2026); dağıtım, Umami ve Search Console bekliyor.
> Eski statik sürüm (`ozgecmis-studyo` deposu: `index.html`, `js/uygulama.js`, `css/sablonlar.css`)
> yeni uygulamanın tasarım/şablon referansıdır.
>
> **Uygulamada plandan farklar:**
> - Next.js 16'da ISR yerine **Cache Components** (`use cache` + `cacheTag`/`revalidateTag`)
>   kullanılır; ara katman dosyası `src/proxy.ts`'dir (eski adıyla middleware).
> - Dil, `app/[locale]` kök layout'undan `next/root-params` ile okunur; route group'lar bunun altındadır.
> - Planın `user.ad_soyad` alanı Better Auth'un `name` alanıdır.
> - Better Auth hız sınırlaması bellekte tutulur (tek sunucu).
> - 6.4'te geçen 301 kayıtları için `yonlendirmeler` tablosu eklendi.

## 1. Hedef

- **%100 ücretsiz** CV düzenleyici: PDF indirme dahil hiçbir özellik ücretli değil; filigran,
  deneme süresi, kredi kartı ve gizli abonelik yok. Bu, ürünün ana vaadi ve ayırt edici yanı.
- Açılışta kullanıcıyı doğrudan editöre ya da giriş ekranına atmayan, **tanıtım sayfası (landing)**
  olan, arama motorlarında üst sıraları hedefleyen bir site.
- Kullanıcı hesabıyla çalışan, canlıda yayında bir CV düzenleyici.
- Giriş: **Google ile tek tık** ya da **e-posta + şifre**. Kayıtta yalnızca e-posta ve şifre
  zorunlu; kullanıcı adı ve ad soyad isteğe bağlı, sonradan da eklenebilir.
- Her kullanıcı yalnızca kendi CV'lerini görür: birden çok CV, taslaklar, eski sürümler.
- Herkese açık **örnek CV'ler** (meslek bazında) — kullanıcı bir örnekten kendi CV'sini başlatır.
- Mevcut 5 şablon, IK kontrolü, canlı A4 önizleme ve PDF aynen korunur.
- **Çok dilli ve çok ülkeli:** arayüz, site ve CV'ler en yaygın dillerde; her ülkenin CV
  geleneğine (kâğıt boyu, fotoğraf, uzunluk) göre ayarlı. Ayrıntı: bölüm 8.
- **Topluluk şablonları:** kullanıcı kendi şablonunu tasarlar; isterse herkese açar. Açık
  şablonları başka kullanıcılar kullanır ve puanlar. Gizli şablonu sahibinden başkası
  göremez ve kullanamaz. Ayrıntı: bölüm 11.

## 2. Konumlandırma ve rakipler

Ekim 2026'da yapılan inceleme.

| Site | Model | PDF indirme | Not |
|---|---|---|---|
| Zety | Ücretli abonelik | Ücretsizde yalnızca TXT; PDF/Word ücretli | ~2,70 $ / 14 gün deneme, sonra 4 haftada bir ~23,70 $ otomatik yenileme; iptal ve beklenmedik ücret şikâyetleri yaygın |
| Resume.io | Ücretli abonelik | Ücretli | ~2–3 $ deneme → ~25–30 $/ay; Trustpilot'ta "habersiz çekim" şikâyetleri |
| Novorésumé | Freemium | Sınırlı | Ücretsizde az şablon |
| FlowCV | Freemium | **Ücretsiz, filigransız** | Ücretsizde yalnızca **1 CV**; çoklu CV, yapay zekâ, başvuru takibi 5 $/ay |
| Reactive Resume (rxresu.me) | Açık kaynak, bağış | **Ücretsiz** | En güçlü ücretsiz rakip: 17 şablon, sürüm geçmişi, ATS kontrolü, paylaşım, 54 dil. Ancak İngilizce odaklı, Türkiye'ye özgü bir şey yok |
| CVdone (TR) | Ücretsiz | Ücretsiz, kayıtsız | 8 şablon, "2 milyon+ CV" iddiası; hesap/sürüm/topluluk yok |
| Pozitif CV, onlinecvhazirla.tr, anbean Kampüs (TR) | Ücretsiz / karışık | Değişken | Bazılarında "ücretsiz" ile "tek seferlik ödeme" aynı sayfada — güven sorunu |
| StylingCV (TR) | İçerik sitesi | — | "Muhasebeci CV örneği 2026" gibi meslek sayfalarıyla Türkçe aramalarda öne çıkıyor |

**Çıkarımlar — kurgu buna göre yapılır:**

1. **"Ücretsiz" tek başına fark değil.** Türkiye'de ücretsiz araçlar var. Bizim farkımız
   **ücretsiz + sınırsız**: sınırsız CV, sürüm geçmişi, topluluk şablonları, IK kontrolü — hepsi
   kayıt gerekmeden denenebilir, hiçbir şey kilitli değil. Landing'de bu, ücretli rakiplerin
   "oluşturmak ücretsiz, indirmek ücretli" modeliyle **doğrudan karşılaştırılarak** anlatılır
   (marka adı vermeden: "Diğer sitelerde PDF indirmek için kart istenir. Burada istenmez.").
2. **Türkiye'ye özgü olmak** en büyük boşluk: KVKK'ya uygun bilgi uyarıları, askerlik/ehliyet
   alanları, Türk IK pratiği (fotoğraf, referans), kamu başvurusu/KPSS formatı, Kariyer.net ve
   LinkedIn'e uygun ATS önerileri, Türkçe-İngilizce CV aynı hesapta.
3. **Arama trafiği meslek sayfalarından gelir.** Rakiplerin Türkçe trafiği "X cv örneği" ve
   "cv nasıl hazırlanır" sayfalarından geliyor. Bu yüzden **örnek CV sayfaları ve rehberler
   ürünün parçası olarak baştan tasarlanır** (bölüm 6).
4. **Kayıt zorunlu olmamalı.** Türk rakipler "üyelik yok" diye öne çıkıyor. Editör ve PDF
   indirme **hesapsız** çalışır; hesap yalnızca bulutta saklama, sürümler, birden çok cihaz ve
   şablon paylaşımı için gerekir.
5. **Güven:** ücretli rakiplerin abonelik şikâyetleri bizim için pazarlama malzemesi.
   Landing'de net vaat: "Kredi kartı istemiyoruz. Hiçbir zaman." Bu vaat bozulmaz. Masraflar
   şimdilik **bağışla** karşılanır; ileride site tarafında rahatsız etmeyen birkaç reklam alanı
   açılabilir (bölüm 7.6). Ücretli özellik hiçbir zaman olmaz.

## 3. Mimari kararı: Next.js ile tam yığın (tek uygulama)

**Karar: API ve ön yüz ayrılmayacak. Tek bir Next.js uygulaması** (App Router, Server
Components, Server Actions, gerektiğinde Route Handlers).

Neden:

| Konu | Tek Next.js | Ayrı API + ön yüz |
|---|---|---|
| Geliştirici sayısı | 1 kişi için ideal | İki proje, iki dağıtım, iki sürüm |
| Oturum / çerez | Aynı alan adı, httpOnly çerez, CORS yok | CORS, çapraz alan çerezi, token yenileme derdi |
| Tip güvenliği | Veritabanından ekrana tek TypeScript tipi | Sözleşme (OpenAPI) üretip senkron tutmak gerekir |
| Kimlik doğrulama | Kütüphane doğrudan entegre | API'de ayrıca doğrulama katmanı |
| Ölçek ihtiyacı | Bu ürün için fazlasıyla yeterli | Gereksiz karmaşıklık |

Ayrı API'yi gerektirecek tek senaryo ileride **mobil uygulama** olur. O gün geldiğinde bile
ayrı proje gerekmez: aynı Next.js içinde `/api/v1/*` Route Handler'ları açılır. Bunu
kolaylaştırmak için kural:

- **İş mantığı `src/sunucu/` altında düz TypeScript fonksiyonlarıdır** (`cvGetir`, `cvKaydet`,
  `surumOlustur`…). Server Action'lar ve ileride Route Handler'lar yalnızca bunları çağıran ince
  katmandır. Veritabanı sorgusu bileşen içine yazılmaz.

## 4. Teknolojiler

| Alan | Seçim | Not |
|---|---|---|
| Çatı | **Next.js 16** (App Router), **React 19**, **TypeScript** (strict) | `output: "standalone"` ile Docker imajı |
| Veritabanı | **PostgreSQL 17** | CV içeriği `jsonb` |
| ORM / göç | **Drizzle ORM** + `drizzle-kit` | SQL'e yakın, çalışma zamanı motoru yok, göçler SQL dosyası olarak depoda |
| Kimlik doğrulama | **Better Auth** | Google OAuth + e-posta/şifre aynı kütüphanede; oturumlar Postgres'te; hız sınırlama dahili. (Auth.js'in şifreli giriş sağlayıcısı veritabanı oturumuyla çalışmadığı için tercih edilmedi.) |
| Doğrulama | **Zod** | CV JSON şeması tek yerde; hem istemci hem sunucu kullanır |
| Arayüz | **Tailwind CSS 4** + **shadcn/ui** (Radix) | Erişilebilir hazır bileşenler (diyalog, menü, sekme) |
| CV şablonları | Düz CSS (mevcut `sablonlar.css`) | mm/pt birimleri ve `@page` kuralları Tailwind'e taşınmaz, olduğu gibi kalır |
| Düzenleyici durumu | **Zustand** | Otomatik kayıt kuyruğu, geri al/ileri al |
| E-posta | **Resend** (ya da SMTP) | Doğrulama, şifre sıfırlama |
| Dosya (fotoğraf) | S3 uyumlu depolama (**Cloudflare R2**) | Fotoğraf JSON'a gömülmez; sürümler şişmesin |
| PDF | Faz 1: tarayıcı yazdırma (mevcut yöntem). Faz 2: **Playwright + Chromium** ile sunucuda PDF | Faz 2 tek tık "İndir" verir; metin seçilebilir kalır |
| Çok dil | **next-intl** (yerelleştirilmiş yollar ile) | İlk günden çok dilli kurulur; dil eklemek yalnızca çeviri ve içerik işidir (bölüm 8) |
| Yazı tipleri | Latin için mevcut fontlar + **Noto** ailesi (Noto Sans Arabic, Noto Sans JP/KR/SC, Noto Sans Devanagari) | Her yazı sistemi için PDF'e gömülebilen yedek font; CJK fontları yalnızca o dilde yüklenir |
| İçerik yönetimi | **Kendi CMS'imiz** (Postgres + blok yapısı) | Landing, rehberler, örnek CV metinleri, SSS, menüler yönetim panelinden düzenlenir (bölüm 7). Kod dağıtmadan içerik değişir |
| Zengin metin | **Tiptap** (ProseMirror) | Rehber ve blok metinleri; çıktı JSON olarak saklanır, sunucuda HTML'e çevrilir |
| Önbellek | Next.js ISR + **etiketli yeniden doğrulama** (`revalidateTag`) | Sayfalar statik hızında sunulur; yönetici "Yayınla" dediğinde yalnızca ilgili sayfalar yenilenir |
| SEO | Next.js Metadata API, `sitemap.ts`, `robots.ts`, **next/og** (dinamik paylaşım görselleri), JSON-LD | Bölüm 6 |
| Analitik | **Umami** (kendi sunucumuzda) | Çerezsiz; çerez onayı gerektirmez, veri bizde kalır |
| Test | **Vitest** (birim), **Playwright** (uçtan uca + PDF sayfa sayısı) | |
| Hata izleme | Sentry (isteğe bağlı) | |
| Dağıtım | **Docker** → VPS üzerinde **Coolify** (Postgres aynı sunucuda) | Sunucu tarafı PDF için Chromium gerektiğinden Vercel yerine VPS. Günlük `pg_dump` yedeği |

## 5. Veri modeli (taslak)

Better Auth kendi tablolarını oluşturur: `user`, `session`, `account`, `verification`.
`user` tablosuna ek alanlar:

- `kullanici_adi` — benzersiz, boş olabilir; **şablonu herkese açmak için zorunlu** (galeride
  sahip olarak bu ad görünür)
- `ad_soyad` — boş olabilir
- `arayuz_dili`, `pazar` — tarayıcıdan tahmin edilir, kullanıcı değiştirebilir

Uygulama tabloları:

```
cvler
  id              uuid PK
  kullanici_id    → user.id
  baslik          text            "Yazılım Mühendisi — TR", "İngilizce CV" …
  icerik          jsonb           mevcut JSON biçimi (kisisel, ozet, deneyim, ayarlar…)
  dil             text            CV'nin yazıldığı dil (arayüz dilinden bağımsız) — bölüm başlıkları buna göre
  pazar           text            hedef ülke profili (de-DE, en-US…) — kâğıt boyu, fotoğraf, IK kuralları buna göre
  durum           text            taslak | aktif | arsiv
  kaynak_ornek_id → ornek_cvler.id (boş olabilir)
  surum           int             iyimser kilit; her kayıtta +1
  olusturma, guncelleme, silinme   timestamptz (silinme = çöp kutusu)

  sablon_id       → sablonlar.id
  sablon_tanim    jsonb           uygulandığı andaki şablon tanımının kopyası (bkz. 11.2)

cv_surumleri                      "eskiler / eskizler"
  id, cv_id → cvler.id
  icerik          jsonb           o anın tam kopyası
  tur             text            otomatik | elle | pdf
  etiket          text            "Trendyol başvurusu" gibi, elle verilen ad
  olusturma

ornek_cvler                       herkese açık örnekler (SEO sayfası olarak da yayınlanır)
  id, slug                        "yazilim-muhendisi-cv-ornegi"
  baslik, meslek, kategori        kategori: bilişim, sağlık, eğitim, kamu, yeni mezun…
  dil, pazar                      örnek hangi dil ve ülke için yazıldı
  ceviri_grubu    uuid            aynı mesleğin diğer dillerdeki örnekleriyle bağ (hreflang)
  deneyim_seviyesi                yeni-mezun | orta | kidemli
  icerik          jsonb           CV verisi
  sablon_id       → sablonlar.id  örneğin gösterildiği şablon
  meta_baslik, meta_aciklama      SEO
  rehber          jsonb           sayfadaki "bu meslekte CV yazarken" metni (Tiptap)
  kullanim_sayisi int             "en çok kullanılan" sıralaması için
  sira, aktif, guncelleme

site_yorumlari                    landing'deki kullanıcı yorumları
  id, kullanici_id, puan (1–5), metin, meslek (isteğe bağlı)
  izin_verildi    bool            kullanıcı "sitede gösterilebilir" dedi mi
  onaylandi       bool            yönetici onayı
  olusturma

dosyalar
  id, kullanici_id, anahtar (R2), tur, boyut, olusturma

sablonlar
  id                 uuid PK
  sahip_id           → user.id       boş = sistem şablonu
  ad, aciklama       text
  tanim              jsonb           tasarım tanımı (bkz. 11.1)
  surum              int             tanım her değiştiğinde +1
  gorunurluk         text            ozel | baglanti | herkese_acik
  durum              text            aktif | incelemede | gizlendi
  resmi              bool            sistem şablonu / öne çıkan
  kaynak_sablon_id   → sablonlar.id  kopyalandığı şablon
  ats_puani          smallint        otomatik (1–5)
  onizleme_anahtari  text            R2'deki önizleme görseli
  kullanim_sayisi    int
  puan_toplam, puan_sayisi  int      önbellek
  olusturma, guncelleme, yayinlanma, silinme

sablon_puanlari
  sablon_id, kullanici_id            birleşik benzersiz
  puan               smallint        1–5
  yorum              text            boş olabilir, ≤ 300 karakter
  gizlendi           bool            moderasyon
  olusturma, guncelleme

sablon_favorileri
  sablon_id, kullanici_id, olusturma

sablon_sikayetleri
  id, sablon_id, kullanici_id, neden, aciklama, durum (acik | kapandi), olusturma
```

Kurallar:

- **Her sorgu `kullanici_id = oturumdaki kullanıcı` ile süzülür.** Sahiplik denetimi
  `src/sunucu/` fonksiyonlarında yapılır, ekranda değil.
- Silme = `silinme` doldurulur (çöp kutusu, 30 gün geri alınabilir). Kayıt fiziksel olarak
  silinmez.
- Hesap kapatma (KVKK): kişisel alanlar anonimleştirilir, CV içerikleri boşaltılır, R2'deki
  fotoğraflar kaldırılır.
- Sürüm politikası: otomatik sürüm en fazla 10 dakikada bir ve son 50 tanesi tutulur; elle
  kaydedilen ve PDF alınırken oluşan sürümler kalıcıdır.

İçerik yönetimi tabloları (ayrıntı: bölüm 7):

```
site_ayarlari                     tek satır; tüm site genelindeki ayarlar
  ayarlar         jsonb           dilden bağımsız: logo, renkler, sosyal bağlantılar, iletişim,
                                  analitik kimlikleri, reklam ayarları, bağış bağlantıları,
                                  sayaçların gösterim eşikleri, yayındaki diller
  ceviriler       jsonb           dile bağlı: { "tr": { site adı, menü, alt bilgi, duyuru,
                                  varsayılan SEO kalıpları }, "en": { … }, … }
  surum, guncelleyen_id, guncelleme

sayfalar                          landing, /ucretsiz-mi, /hakkimizda, KVKK metinleri, rehberler…
  id, slug, tur                   tur: sabit | rehber | yasal
  dil             text            her dil ayrı satır; (dil, slug) benzersiz
  ceviri_grubu    uuid            aynı sayfanın diğer dillerdeki karşılıkları (hreflang, dil değiştirici)
  ceviri_durumu   text            makine | gozden_gecirildi — yalnız gözden geçirilmiş sayfa indekslenir
  baslik, meta_baslik, meta_aciklama, og_gorsel_id, canonical, indeks (bool)
  durum           text            taslak | yayinda | zamanlanmis | arsiv
  yayin_tarihi    timestamptz     zamanlanmış yayın
  bloklar         jsonb           taslak blok listesi (düzenlenen)
  yayindaki_bloklar jsonb         yayındaki blok listesi (ziyaretçinin gördüğü)
  surum, guncelleyen_id, olusturma, guncelleme

sayfa_surumleri                   her "Yayınla"da bir kopya → geri alma
  id, sayfa_id, bloklar jsonb, meta jsonb, yayinlayan_id, olusturma

medya                             görsel kütüphanesi (R2)
  id, anahtar, alt_metin, genislik, yukseklik, boyut, yukleyen_id, olusturma

sss                               blokların ve FAQPage şemasının kaynağı
  id, dil, ceviri_grubu, soru, cevap jsonb, kategori, sira, aktif

reklam_alanlari
  id, kod                         "landing-orta", "rehber-yan", "ornek-alt"
  saglayici       text            adsense | ozel | kapali
  icerik          jsonb           AdSense birim kimliği ya da özel görsel + bağlantı
  boyut           text            ayrılan kutu ölçüsü (yerleşim kaymasını önlemek için)
  aktif, guncelleme

yonetim_gunlugu                   kim, neyi, ne zaman değiştirdi
  id, kullanici_id, islem, hedef_tur, hedef_id, once jsonb, sonra jsonb, olusturma
```

`user.rol`: `kullanici` | `editor` (içerik düzenler, ayar/rol değiştiremez) | `yonetici` (her şey).

## 6. Landing ve SEO mimarisi

SEO sonradan eklenecek bir özellik değil, **rota yapısı ve çizim mimarisiyle birlikte baştan
kurulur.** Sonradan URL değiştirmek sıralamayı sıfırlar; bu bölümdeki kararlar kesindir.

### 6.1 İki ayrı dünya: herkese açık site ve uygulama

| | Herkese açık site | Uygulama |
|---|---|---|
| Sayfalar | Landing, örnek CV'ler, şablon galerisi, rehberler, SSS | Editör, panel, hesap, sürümler |
| Üretim | **Statik / ISR** (sunucuda HTML, JS en az) | İstemci ağırlıklı |
| İndeks | `index, follow` | `noindex`, robots.txt'te kapalı |
| Hedef | Core Web Vitals yeşil: LCP < 2 sn, CLS ≈ 0, INP < 200 ms | Hız ve kararlılık |

Next.js'te iki ayrı route group: `app/(site)` ve `app/(uygulama)`. Site tarafı editörün
JS paketini asla yüklemez.

**CV çizim bileşeni saf (server component uyumlu) olmalı:** tarayıcı API'si kullanmaz. Böylece
aynı bileşen örnek CV sayfalarını **sunucuda HTML olarak** basar — arama motoru CV içeriğini
metin olarak okur, görsel değil.

### 6.2 URL yapısı (kesin)

Türkçe, küçük harf, ASCII, tire ile; sonda eğik çizgi yok. **Türkçe kökte (önek yok), diğer diller
kendi önekiyle** (`/en`, `/de`…; next-intl `localePrefix: "as-needed"`). Yol parçaları da o dilde
yazılır; aşağıdaki tablo Türkçe karşılıklarıdır, diğer diller için bölüm 8.3.

| URL | Hedef arama |
|---|---|
| `/` | "ücretsiz cv hazırla", "cv oluştur", "online cv" |
| `/cv-olustur` | Editöre giriş (hesapsız başlar) |
| `/cv-ornekleri` | "cv örnekleri" — kategori ve meslek listesi |
| `/cv-ornekleri/[kategori]` | "sağlık sektörü cv örnekleri" |
| `/cv-ornekleri/[meslek-cv-ornegi]` | "yazılım mühendisi cv örneği", "hemşire cv örneği" — **ana trafik kaynağı** |
| `/cv-sablonlari` | "cv şablonları", "ats uyumlu cv şablonu" |
| `/cv-sablonlari/[slug]` | Tek şablon (sistem ve topluluk şablonları) |
| `/rehber/[konu]` | "cv nasıl hazırlanır", "ats nedir", "ingilizce cv", "ön yazı örnekleri", "cv'de fotoğraf olmalı mı", "yeni mezun cv" |
| `/ats-cv-kontrolu` | "cv ats kontrolü" — IK kontrolü aracının herkese açık sürümü (PDF/JSON yükle, puan al) |
| `/ingilizce-cv-hazirla` | "ingilizce cv hazırlama" |
| `/ucretsiz-mi` | Ücretsizlik vaadi, masraflar nasıl karşılanıyor — güven sayfası |
| `/kullanici/[kullanici-adi]` | Şablon sahibinin herkese açık profili (yalnız şablonları; CV'leri değil) |

Mesleki sayfa sayısı hedefi: yayında **50**, ilk yıl **200+** (en çok aranan meslekler; arama hacmi
Google Search Console + Keyword Planner ile seçilir).

### 6.3 Landing sayfası (`/`) bölümleri

Aşağıdaki sıra **varsayılan kurulumdur**. Landing sabit kodlanmaz; her bölüm yönetim
panelinden düzenlenen bir bloktur (bölüm 7). Sıra, metinler, görseller, görünürlük
değiştirilebilir, yeni bölüm eklenebilir.

1. **Hero:** "CV'ni ücretsiz hazırla, ücretsiz indir." Alt satır: "Kredi kartı yok, deneme süresi
   yok, filigran yok." Tek ana buton: **CV'mi oluştur** (hesapsız editöre). İkincil: Google ile devam et.
   Sağda canlı, döngüyle şablon değiştiren CV önizlemesi.
2. **Güven şeridi:** oluşturulan CV sayısı, kullanıcı sayısı, ortalama puan (gerçek veriden; sayı
   anlamlı olana kadar gösterilmez).
3. **"Neden ücretsiz?" karşılaştırması:** "Diğer sitelerde / Burada" tablosu — PDF indirme,
   filigran, kart bilgisi, deneme sonrası otomatik ücret, CV sayısı, sürüm geçmişi.
4. **En çok kullanılan şablonlar:** kullanım ve puana göre ilk 6, "Bu şablonla başla".
5. **Popüler CV örnekleri:** en çok açılan meslek örnekleri (kategori sekmeli).
6. **Nasıl çalışır:** 3 adım — bilgileri gir, şablon seç, PDF indir.
7. **Özellikler:** IK kontrolü, ATS uyumu, sürüm geçmişi, Türkçe/İngilizce, KVKK, mobilde çalışma.
8. **Kullanıcı yorumları:** yalnızca `site_yorumlari`'nda izin verilmiş ve onaylanmış gerçek yorumlar.
9. **SSS:** "Gerçekten ücretsiz mi?", "Verilerim nerede?", "ATS nedir?", "Fotoğraf koymalı mıyım?"…
10. **Son çağrı** + alt bilgi (rehber, örnekler, şablonlar, KVKK, iletişim — iç bağlantı ağı).

> **"En çok kullanılan CV'ler" kullanıcıların CV'leri değildir.** Kullanıcı CV'leri her zaman
> özeldir ve hiçbir yerde gösterilmez. Landing'de gösterilen "en çok kullanılan" listeleri
> **şablonlar** ve **örnek CV'ler**dir (kullanım sayısına göre).

**Yorum toplama:** kullanıcı 2. PDF indirmesinden sonra (memnun anda) tek satırlık "Bizi
puanlar mısın?" sorulur; yorumun sitede gösterilmesi için ayrıca açık izin istenir. Sahte ya da
uydurma yorum kesinlikle konmaz.

### 6.4 Teknik SEO kontrol listesi

- Her sayfada benzersiz `title` (≤ 60 karakter) ve `description` (≤ 155), `canonical`, Open Graph
  ve Twitter etiketleri; paylaşım görseli `next/og` ile otomatik üretilir.
- `sitemap.xml` veritabanından dinamik (örnekler, şablonlar, rehberler; `lastmod` gerçek tarih),
  `robots.txt` uygulama yollarını kapatır.
- **JSON-LD:** `WebApplication` (`offers.price = 0`, `priceCurrency = TRY`), `Organization`,
  `BreadcrumbList`, rehberlerde `Article` + `FAQPage`, rehber adımlarında `HowTo`.
  Not: Google kendi ürünü hakkındaki yorumlar için yıldız (Review) zengin sonucu **göstermez**;
  `AggregateRating` yalnızca topluluk şablonu sayfalarında kullanılır.
- Örnek CV sayfaları **ince içerik olmamalı**: her birinde tam CV metni + o mesleğe özel
  400–800 kelimelik rehber + benzer meslekler + "Bu örnekle başla". Şablon yalnızca değiştirilmiş
  kopya sayfalar üretilmez.
- Topluluk şablonu sayfaları belirli bir eşiğe (örn. 5 puan) ulaşana kadar `noindex` — boş,
  kalitesiz sayfalar sitenin genel değerini düşürmesin.
- Görseller `next/image` (AVIF/WebP, boyutlu), yazı tipleri `next/font` (kendi sunucumuzdan,
  `display: swap`, layout kayması yok).
- Tek `h1`, anlamlı başlık hiyerarşisi, `lang="tr"`, erişilebilirlik (WCAG AA) — Lighthouse'da
  Performans/Erişilebilirlik/SEO **≥ 95** yayın şartı; CI'da Lighthouse denetimi.
- Kayıt: Google Search Console, Bing Webmaster Tools, **Yandex Webmaster** (Türkiye'de payı var).
- Yayın günü sabit kalacaklar: alan adı, URL yapısı, slug'lar. Slug değişirse 301 yönlendirme
  (`yonlendirmeler` tablosu) zorunlu.

## 7. Yönetim paneli ve dinamik içerik

**İlke: herkese açık sitedeki hiçbir metin, görsel, bağlantı, sıra ya da SEO alanı koda gömülmez.**
Yönetici giriş yaptığında sitenin en ince ayrıntısına kadar panelden müdahale eder; içerik
değişikliği için kod dağıtımı gerekmez. Kodda yalnızca blok **türleri** (nasıl çizildikleri) durur.

### 7.1 Blok tabanlı sayfa düzenleyici

Her sayfa sıralı bir blok listesidir. Her blok türünün Zod ile tanımlı bir ayar şeması vardır;
yönetim paneli formu bu şemadan otomatik üretilir (yeni blok türü = bir bileşen + bir şema).

| Blok türü | Düzenlenebilenler |
|---|---|
| `hero` | Başlık, alt başlık, rozet metinleri, birincil/ikincil buton (metin + bağlantı), sağdaki önizlemede dönen şablonlar, arka plan |
| `guven_seridi` | Gösterilecek sayaçlar (CV, kullanıcı, puan), etiketleri, gösterim eşiği |
| `karsilastirma` | Satırlar ("Diğer sitelerde / Burada"), sütun başlıkları |
| `sablon_vitrini` | Başlık, kaç adet, sıralama ölçütü (kullanım / puan / elle seçim), süzgeç |
| `ornek_vitrini` | Başlık, kategoriler, kaç adet, sıralama ya da elle seçim |
| `adimlar` | Adımlar (ikon, başlık, metin) |
| `ozellikler` | Özellik kartları (ikon, başlık, metin, bağlantı) |
| `yorumlar` | Onaylı yorumlardan hangileri / kaç tane, otomatik ya da elle seçim |
| `sss` | Hangi SSS kategorisi ya da elle seçilen sorular (FAQPage JSON-LD buradan üretilir) |
| `cta` | Başlık, metin, buton |
| `zengin_metin` | Tiptap metni (başlık, liste, görsel, tablo, bağlantı) |
| `gorsel_metin` | Görsel + metin, sağ/sol yerleşim |
| `reklam` | Hangi reklam alanı (`reklam_alanlari.kod`) |
| `bagis` | Bağış çağrısı metni ve bağlantıları |

Her blokta ortak alanlar: görünür/gizli, arka plan tonu, üst/alt boşluk, mobilde gizle, bağlantı
çapası (`#sss`).

### 7.2 Düzenleme akışı

- **Taslak / yayın ayrımı:** düzenleme taslakta yapılır (`bloklar`); ziyaretçi
  `yayindaki_bloklar`'ı görür. "Yayınla" taslağı yayına kopyalar, ilgili sayfaların önbelleğini
  yeniler (`revalidateTag`).
- **Canlı önizleme:** panelde sağda sayfanın gerçek bileşenlerle çizilmiş hali; masaüstü / tablet /
  mobil genişlik düğmeleri. Taslak, paylaşılabilir gizli bir önizleme bağlantısıyla da açılır
  (Next.js draft mode).
- **Sürükle-bırak sıralama,** blok çoğaltma, blok kopyalayıp başka sayfaya yapıştırma.
- **Sürüm geçmişi ve geri alma:** her yayın `sayfa_surumleri`'ne yazılır; tek tıkla önceki
  yayına dönülür.
- **Zamanlanmış yayın:** `yayin_tarihi` gelince arka plan görevi yayınlar.
- **Sitede düzenle:** yönetici giriş yapmışken herkese açık sayfalarda köşede "Bu sayfayı düzenle"
  düğmesi görünür, ilgili blokla panele götürür.
- **Denetim günlüğü:** her değişiklik `yonetim_gunlugu`'ne önce/sonra değeriyle yazılır.

### 7.3 Yönetim panelinden yönetilenler

| Alan | İçerik |
|---|---|
| Site ayarları | Site adı, logo, favicon, marka renkleri, üst menü, alt bilgi sütunları, sosyal bağlantılar, iletişim, duyuru çubuğu (aç/kapa, metin) |
| SEO | Varsayılan başlık kalıbı, varsayılan açıklama ve paylaşım görseli, sayfa bazında başlık/açıklama/canonical/indeks, 301 yönlendirmeler, robots ek kuralları, doğrulama etiketleri (Google, Bing, Yandex) |
| Sayfalar | Landing, `/ucretsiz-mi`, hakkımızda, KVKK ve çerez metinleri, rehberler — blok düzenleyiciyle |
| Örnek CV'ler | Ekle / düzenle (CV editörünün aynısıyla), meslek, kategori, slug, meta alanları, rehber metni, şablon, yayın durumu |
| Şablonlar | Sistem şablonları (şablon editörüyle), "öne çıkan" işareti, topluluk şablonlarını gizle / geri aç |
| SSS | Soru-cevap, kategori, sıra |
| Yorumlar | Site yorumlarını onayla / gizle / öne çıkar; şablon yorumlarının moderasyonu |
| Şikâyetler | Şablon şikâyetleri kuyruğu |
| Medya | Görsel yükle, alt metin, kullanım yerleri |
| Reklam ve bağış | Reklam alanları (aç/kapa, sağlayıcı, kod), bağış bağlantıları ve metni |
| Kullanıcılar | Liste, rol ver (editör/yönetici), hesabı askıya al. **Kullanıcı CV'lerinin içeriği yönetim panelinde de görünmez** (KVKK) |
| İstatistik | Kayıt, oluşturulan CV, PDF indirme, en çok kullanılan şablon/örnek, Umami özeti |
| Günlük | Yönetim günlüğü, kim neyi değiştirdi |

### 7.4 Neyin kodda kaldığı

- Blok türlerinin görünümü (bileşenler), CV çizim motoru, editör, kimlik doğrulama, SEO üretim
  mantığı (JSON-LD, sitemap). Yani **"nasıl görünür"** kodda, **"ne yazar / ne gösterilir / hangi
  sırada"** veritabanında.
- URL kalıpları (bölüm 6.2) kodda sabittir; yönetici yalnızca slug'ları değiştirir ve her slug
  değişikliği otomatik 301 yönlendirme kaydı oluşturur.

### 7.5 Güvenlik

- Yönetim rotaları (`/yonetim/**`) sunucuda rol denetimiyle korunur; her Server Action ayrıca
  rolü kontrol eder (yalnızca ara katman yazılımına güvenilmez).
- Yönetici hesabında iki adımlı doğrulama (TOTP, Better Auth eklentisi) zorunlu.
- Zengin metin çıktısı sunucuda izin listesiyle temizlenir; yöneticinin bile ham HTML/script
  girmesine izin verilmez (reklam kodu hariç; o da yalnızca `reklam_alanlari`'nda, yalnız
  yönetici rolüyle ve CSP'de izinli alan adlarıyla).

### 7.6 Reklam ve bağış

- **Şimdilik yalnızca bağış.** Bağış bağlantıları `site_ayarlari`'nda; landing'de ve PDF indirme
  sonrasında rahatsız etmeyen tek satırlık "Beğendiysen destek ol".
- **Reklam seçeneği altyapıda hazır, varsayılan kapalı.** Kurallar:
  - Yalnızca herkese açık site sayfalarında (landing, rehber, örnek CV sayfaları). **Editörde,
    panelde, CV önizlemesinde ve PDF'te asla.**
  - Sayfa başına en fazla 2–3 alan; açılır pencere, tam ekran, otomatik sesli/videolu reklam yok.
  - Her alanın kutusu önceden ayrılır (sabit boyut) — reklam geç yüklense de sayfa kaymaz
    (Core Web Vitals / CLS korunur).
  - Kişiselleştirilmiş reklam (AdSense vb.) çerez kullandığı için reklam açıldığı anda **çerez onay
    çubuğu** devreye girer; onay yoksa reklam yüklenmez ya da kişiselleştirilmemiş gösterilir
    (KVKK). Reklam kapalıyken çerez onayı gerekmez (Umami çerezsiz).
  - Reklam alanları yönetim panelinden tek tek açılıp kapatılır.

## 8. Çok dil ve uluslararası pazarlar

**Karar:** yalnız Türkçe/İngilizce ile sınırlı kalınmaz. **Mimari ilk günden çok dilli ve çok
ülkeli kurulur;** diller içerik hazır oldukça dalgalar hâlinde açılır.

### 8.1 Dil seçimi

Ölçütler: web içeriğindeki pay (W3Techs, Haziran 2026: İngilizce ~%50, İspanyolca ve Almanca
~%6, Japonca %5, Fransızca %4,6, Portekizce %4,1, Rusça %3,5), konuşan sayısı, o ülkede CV
sitelerine olan talep ve rekabet, Türkiye'ye yakınlık.

| Dalga | Diller | Neden |
|---|---|---|
| **1 — ilk yayın** | Türkçe (`tr`), İngilizce (`en`) | Ana pazar + dünya geneli |
| **2** | İspanyolca (`es`), Almanca (`de`), Fransızca (`fr`), Portekizce (`pt`, Brezilya ağırlıklı), Arapça (`ar`), Rusça (`ru`) | Web'de en büyük diller; Almanya'da büyük Türk nüfusu; Arapça ile Körfez iş piyasası; Rusça ile Orta Asya |
| **3** | İtalyanca, Lehçe, Felemenkçe, Endonezce, Azerbaycan Türkçesi, Ukraynaca, Rumence | Orta büyüklükte, rekabeti daha az pazarlar |
| **4** | Japonca, Korece, Çince (basitleştirilmiş), Hintçe, Vietnamca | Yazı sistemi ve CV geleneği en farklı olanlar; ayrı tasarım işi gerektirir |

İlk iki dalga yaklaşık **8 dil**, dördü birlikte **~25 dil** eder. Hangi dalgaya ne zaman
geçileceği Search Console ve Umami'deki ülke trafiğine göre belirlenir.

### 8.2 Dil ve pazar ayrı kavramlardır

- **Arayüz dili:** kullanıcının uygulamayı gördüğü dil.
- **CV dili:** CV'nin yazıldığı dil. Arayüzü Türkçe olan biri Almanca CV hazırlayabilir. Bölüm
  başlıkları ("Berufserfahrung"), "Günümüz" karşılığı ("heute"), tarih biçimi CV diline göre gelir.
  CV dili için arayüz dillerinden **daha geniş** bir liste sunulur (yalnızca başlıklar çevrilir).
- **Pazar (hedef ülke):** CV'nin gönderileceği ülkenin geleneği. `en-US` ile `en-GB` aynı dil, farklı
  pazar.

Pazar profili (`src/ortak/pazarlar.ts`, kodda; yönetim panelinden metinleri düzenlenebilir):

| Ayar | Örnek |
|---|---|
| Kâğıt boyu | ABD, Kanada, Meksika: **Letter**; diğerleri: **A4** |
| Belge adı | ABD: "Resume" (CV = akademik özgeçmiş); Birleşik Krallık: "CV"; Almanya: "Lebenslauf" |
| Fotoğraf varsayılanı | ABD/İngiltere/Kanada: kapalı ve IK kontrolü uyarır; Almanya/Türkiye: açık ama isteğe bağlı |
| Önerilen uzunluk | ABD: 1 sayfa (kıdemlide 2); Avrupa: 1–2 sayfa |
| Kişisel bilgiler | ABD: yaş, medeni hal, uyruk **yazılmaz** (uyarı); Almanya: doğum tarihi isteğe bağlı alan |
| Veri koruma metni | Türkiye: KVKK; AB: GDPR; diğerleri: genel gizlilik |
| Tarih biçimi | `Ara 2022` / `Dec 2022` / `12/2022` (Almanya) |
| Özel şablon | Japonya'da **rirekisho** standart bir formdur; dalga 4'te ayrı sistem şablonu olarak yapılır |

**Bu yüzden çizim motoru ilk günden şunları desteklemelidir** (sonradan eklemek köklü değişiklik olur):

- **Kâğıt boyu parametresi** (A4 / Letter): sayfa genişlik-yüksekliği, `@page`, sayfa sonu tahmini ve
  sunucu PDF'i bu değerden okur. Mevcut koddaki sabit `210mm / 297mm` bir değişkene dönüşür.
- **Sağdan sola (RTL) yazım:** Arapça için. Tüm şablon ve arayüz CSS'i **mantıksal özelliklerle**
  yazılır (`margin-inline-start`, `padding-inline`, `inset-inline-start`; `left/right` yasak).
  Kenar çubuğu RTL'de otomatik sağa geçer. `dir="rtl"` CV dilinden gelir.
- **Yazı sistemine göre font:** her şablon fontunun yanında yazı sistemi yedeği (Noto). Arapçada
  `letter-spacing` ve `text-transform: uppercase` kapatılır (harfler bitişik yazıldığı için).
- **Dile duyarlı büyük harf:** `lang` özniteliği her zaman doğru (Türkçe i/İ, Almanca ß).

### 8.3 SEO: her dil kendi pazarının araması için yazılır

- Yol parçaları o dilde: `/cv-ornekleri/yazilim-muhendisi-cv-ornegi` ↔
  `/en/resume-examples/software-engineer-resume` ↔ `/de/lebenslauf-beispiele/softwareentwickler`
  (next-intl `pathnames`). Anahtar kelime çeviri değil o ülkedeki gerçek aramadır ("resume" vs "CV").
- Her sayfada `hreflang` karşılıkları + `x-default`; site haritası dil alternatifleriyle üretilir
  (`ceviri_grubu` üzerinden).
- **Kalitesiz otomatik çeviri indekslenmez.** Google, yapay zekâyla çevrilmiş içeriği kendiliğinden
  spam saymıyor, ama değer katmayan toplu çeviriyi "ölçekli içerik istismarı" sayıp
  cezalandırabiliyor. Kural:
  - Arayüz metinleri: yapay zekâ çevirisi + kısa gözden geçirme yeterli.
  - Landing, rehber, örnek CV sayfaları: yapay zekâ taslağı → anadili konuşan biri gözden geçirir →
    `ceviri_durumu = gozden_gecirildi` olunca indekslenir. O zamana kadar `noindex`.
  - **Örnek CV'ler çevrilmez, o pazar için yazılır:** Alman yazılımcı örneği Alman CV geleneğinde,
    Alman şirketleri ve eğitim sistemiyle olur.
- Dil önerisi: tarayıcı diline göre **yalnızca öneri çubuğu** ("Bu sayfa Deutsch dilinde de var"),
  otomatik yönlendirme **yapılmaz** (arama motoru botlarını ve kullanıcıyı şaşırtır).

### 8.4 Yönetim panelinde çeviri

- Her sayfa / örnek / SSS kaydında dil sekmeleri; "diğer dillerden yapay zekâ ile taslak oluştur"
  düğmesi.
- **Çeviri durumu ekranı:** dil × içerik tablosu — eksik, makine çevirisi, gözden geçirilmiş.
- Dil bazında "yayında" anahtarı: içerik hazır olmayan dil sitede ve dil seçicide görünmez.
- Arayüz çeviri dosyaları (`messages/<dil>.json`) depoda; eksik anahtarları CI yakalar.

## 9. Sayfalar

| Yol | İçerik |
|---|---|
| `/` | Landing (bölüm 6.3). Site tarafındaki tüm herkese açık sayfalar için bkz. 6.2 |
| `/cv-olustur` | Hesapsız editör (misafir modu); kaydetmek isterse hesap açtırır |
| `/giris`, `/kayit`, `/sifre-sifirla` | Kayıt: e-posta + şifre (+ isteğe bağlı kullanıcı adı, ad soyad) |
| `/panel` | Kullanıcının CV'leri (kart görünümü, küçük önizleme), çoğalt, arşivle, çöp kutusu |
| `/cv/[id]` | Düzenleyici (mevcut arayüz: İçerik / Tasarım / IK Kontrolü + önizleme) |
| `/cv/[id]/surumler` | Sürüm geçmişi: önizle, karşılaştır, bu sürümden yeni CV aç, geri yükle |
| `/yazdir/[id]` | Yalnızca CV'yi basan sayfa (tarayıcı yazdırma ve sunucu PDF'i bunu kullanır) |
| `/sablon-editoru/yeni`, `/sablon-editoru/[id]` | Görsel şablon editörü (solda ayarlar, sağda canlı önizleme), görünürlük seçimi |
| `/panel/sablonlarim` | Kendi şablonlarım ve favorilerim |
| `/yonetim/**` | Yönetim paneli: site ayarları, sayfa/blok düzenleyici, örnek CV'ler, şablonlar, SSS, yorumlar, şikâyetler, medya, reklam/bağış, kullanıcılar, istatistik, günlük (bölüm 7) |
| `/destek` | Bağış sayfası (içeriği CMS'ten) |
| `/hesap` | Profil, şifre, bağlı Google hesabı, verilerimi indir (JSON), hesabı kapat |

## 10. Mevcut koddan taşınacaklar

- `cvHtml()` ve `bolumHtml()` → **React bileşenleri** (`<CvBelge veri={…} />`). Aynı bileşen
  önizlemede, `/yazdir` sayfasında ve sunucu PDF'inde kullanılır.
- `sablonlar.css` aynen alınır.
- JSON biçimi korunur ve Zod şemasına dönüştürülür; `surum` alanıyla ileride göç yapılır.
- `kontroller()` (IK kontrolü) saf fonksiyon olarak `src/ortak/` altına taşınır.
- Sayfa sonu tahmini (`sayfaOlc`) istemci bileşeninde kalır.
- **Misafir modu:** giriş yapmadan denenebilir; veri localStorage'da durur. Kayıt olunca
  otomatik olarak hesaba aktarılır. Mevcut statik sürümden alınan JSON dosyaları da
  "İçe aktar" ile yüklenebilir.

## 11. Şablon sistemi (kullanıcı şablonları, paylaşım, puanlama)

### 11.1 Şablon nedir — ve neden HTML/CSS değil

**Şablon = görünüm, örnek CV = içerik.** Şablon CV'nin nasıl göründüğünü, örnek CV ne
yazdığını belirler; ikisi ayrı tablolarda durur.

**Karar: kullanıcı ham HTML/CSS yazmaz. Şablon, Zod ile doğrulanan bir JSON tasarım
tanımıdır;** CV'yi her zaman bizim çizim motorumuz basar.

Neden:

- **Güvenlik:** başkasının yazdığı HTML/CSS'i herkese sunmak XSS ve veri sızdırma
  (CSS `url()` ile dış istek) kapısı açar. JSON tanımda çalıştırılabilir hiçbir şey yoktur.
- **Kalite:** her şablon ATS'nin okuyabildiği aynı semantik HTML'i üretir; PDF'te metin
  seçilebilir kalır, sayfa bölünmeleri bozulmaz.
- **Kolaylık:** şablon görsel bir editörle, kod bilmeden oluşturulur.

Tasarım tanımının kapsamı (taslak):

```
yerlesim       tek-sutun | kenar-cubugu-sol | kenar-cubugu-sag | ust-bant
kenar          genişlik (mm), zemin rengi, hangi bölümler kenarda
ust_bilgi      hizalama (sol/orta), fotoğraf (yok/yuvarlak/kare/köşeli), ayraç çizgisi
renkler        vurgu, metin, ikincil metin, zemin (kontrast denetimli)
yazi           başlık fontu, gövde fontu (izinli Google Fonts listesi), boyut, satır aralığı
bolum_basligi  büyük harf | alt çizgi | sol çubuk | kare imli | çizgiyle uzayan
maddeler       nokta | tire | ok | yok
yetenekler     liste | etiket | iki sütun
iletisim       ikonlu | ayraçlı (| · –)
kenar_bosluk   üst / alt / yatay (mm)
```

Mevcut 5 şablon da (Modern, ATS Klasik, Zarif, Teknik, Kenar Çubuklu) bu tanımla yazılır ve
kullanıcı şablonlarıyla aynı motordan geçer. **Bu yüzden çizim motoru Faz 1'de doğrudan tasarım
tanımını okuyacak şekilde kurulmalı** — şablona özel `if` yazılmaz.

### 11.2 Görünürlük ve erişim

| Görünürlük | Kim görür / kullanır |
|---|---|
| `ozel` (varsayılan) | Yalnızca sahibi |
| `baglanti` | Bağlantıyı bilen giriş yapmış herkes kullanır; galeride listelenmez |
| `herkese_acik` | Galeride listelenir; herkes kullanır ve puanlar |

- Erişim **sunucuda** denetlenir. CV'ye şablon atanırken şu koşul aranır:
  `sahip = ben` **veya** (`gorunurluk in (baglanti, herkese_acik)` **ve** `durum = aktif`).
  Ekrandan gelen şablon id'sine güvenilmez.
- **CV, uygulandığı andaki şablon tanımının kopyasını saklar** (`cvler.sablon_tanim`).
  Sahip şablonu sonradan gizlerse, değiştirirse ya da silerse onu kullananların CV'leri bozulmaz;
  yalnızca o şablon yeni CV'lere artık uygulanamaz.
- Şablon güncellenince onu kullanan CV'de "Şablonun yeni sürümü var — uygula" bildirimi çıkar;
  otomatik uygulanmaz.
- **Sahibin adı görünür:** herkese açık şablonda sahibin `@kullanici_adi`'ı gösterilir ve
  `/kullanici/[kullanici-adi]` profil sayfasına bağlanır. Kullanıcı adı olmayan kullanıcı
  şablonunu herkese açmadan önce bir kullanıcı adı seçer.
- **Kopyala ve düzenle:** herkese açık bir şablon kendi hesabına kopyalanıp değiştirilebilir.
  Kopyada "X'in şablonundan uyarlandı" bilgisi (`kaynak_sablon_id`) tutulur.

### 11.3 Puanlama

- 1–5 yıldız; kullanıcı başına şablon başına **tek puan** (sonradan değiştirilebilir).
- Kişi **kendi şablonunu puanlayamaz**.
- Puan vermek için şablonu **en az bir CV'de kullanmış** olmak gerekir (sahte puanı azaltır).
- İsteğe bağlı kısa yorum (en fazla 300 karakter).
- Sıralama düz ortalamayla değil **Bayes ortalamasıyla** yapılır; tek kişinin 5 verdiği şablon,
  200 kişinin ortalama 4,7 verdiği şablonun önüne geçmez:
  `skor = (C × m + puan_toplam) / (C + puan_sayisi)` — m: tüm şablonların ortalaması, C ≈ 10.
- Toplam ve sayı `sablonlar` tablosunda önbellek olarak tutulur; puan yazılırken aynı
  işlemde (transaction) güncellenir.

### 11.4 Galeri ve keşif

- Süzgeçler: en popüler (kullanım), en yüksek puan, en yeni, ATS uyumu, yerleşim,
  fotoğraflı/fotoğrafsız, renk.
- **ATS uyum puanı otomatik hesaplanır** (sütun sayısı, ikon yoğunluğu, kontrast, yazı boyutu);
  şablon sahibi beyan etmez.
- Her kartta örnek içerikle üretilmiş **önizleme görseli**: şablon kaydedilince sunucu PDF
  altyapısıyla (Playwright) üretilip R2'ye yazılır.
- Favorilere ekleme.

### 11.5 Moderasyon

- Şablonda çalıştırılabilir içerik olmadığı için risk ad, açıklama ve yorum metinlerindedir.
- **Ön onay yok:** şablon herkese açıldığı anda yayına girer; müdahale yalnızca şikâyet gelirse
  yapılır.
- "Şikâyet et" → `sablon_sikayetleri`. Belirli sayıda şikâyet alan şablon otomatik olarak
  galeriden çekilir (`durum = incelemede`); kararı yönetici verir.
- Yönetici paneli: şikâyetler, şablonu gizle / geri aç, yorumu gizle, "öne çıkan" işaretle.

## 12. Otomatik kayıt

- Düzenleyici değişiklikleri 1 sn bekleyip Server Action ile gönderir.
- İstek `surum` numarasını taşır; sunucudaki sürüm farklıysa (iki sekmede açık CV) kayıt
  reddedilir, kullanıcıya "Başka bir sekmede değişmiş — yenile / benimkini koru" sorulur.
- Çevrim dışıyken değişiklikler kuyrukta bekler, bağlantı gelince gönderilir.

## 13. Güvenlik ve KVKK

- Şifreler Better Auth'un varsayılan özet algoritmasıyla saklanır; giriş ve kayıt uçlarında hız
  sınırlama.
- E-posta doğrulaması gönderilir ama girişi engellemez (sürtünmeyi azaltmak için); şifre
  sıfırlama yalnızca doğrulanmış e-postaya.
- Aydınlatma metni ve açık rıza kayıt ekranında; çerez bildirimi.
- Fotoğraflar R2'de özel (public olmayan) tutulur, imzalı ve süreli URL ile sunulur.
- CSP, `SameSite=Lax` httpOnly oturum çerezi, Server Action'larda Zod doğrulaması.

## 14. Yol haritası

**Strateji: erken yayın.** Bir sitenin arama motorlarında güven kazanması aylar sürer; bu süre
ne kadar erken başlarsa o kadar iyi. Bu yüzden önce hesapsız çalışan editör + landing + örnek
CV sayfaları canlıya çıkar, hesap ve topluluk özellikleri arkadan gelir. Veri modeli ve URL yapısı
en baştan tam haliyle kurulduğu için sonraki fazlar köklü değişiklik gerektirmez.

1. **Faz 0 — İskelet:** Next.js + Drizzle + Postgres (Docker Compose), next-intl, `(site)` /
   `(uygulama)` / `(yonetim)` ayrımı, SEO altyapısı (metadata, sitemap, robots, JSON-LD, OG),
   **tüm tablolar** (kullanılmayanlar da), Better Auth (önce yalnız yönetici girişi + TOTP),
   Coolify'a ilk dağıtım, Umami, Search Console.
   *Durum: kod tarafı tamam (Dockerfile dahil). Coolify dağıtımı, Umami ve Search Console kaldı.*
2. **Faz 1 — İlk yayın (MVP):** tasarım tanımını okuyan saf çizim motoru (A4/Letter, RTL hazır)
   + 5 sistem şablonu, **Türkçe + İngilizce** (dalga 1),
   **hesapsız editör** (`/cv-olustur`, localStorage), tarayıcı yazdırma ile PDF, **blok tabanlı CMS
   ve yönetim paneli** (site ayarları, sayfa düzenleyici, örnek CV, SSS, medya, günlük), landing ve
   diğer sayfaların panelden doldurulması, ilk 50 örnek CV sayfası, ilk 10 rehber, `/ucretsiz-mi`,
   `/destek`, KVKK metinleri, alan adı → **canlı**.
   *Durum (Ekim 2026): kod tamam. İçerik: 50+ Türkçe örnek CV taslağı (`content/examples/tr`, panelden
   yayınlanır), 10 rehber taslağı (`content/guides/tr`), gizlilik metni taslağı (köşeli parantezli
   alanlar ve hukukçu kontrolü bekliyor). Kalan: alan adı ve dağıtım.*
3. **Faz 2 — Hesaplar:** kullanıcı girişi (Google + e-posta/şifre), misafir CV'sinin hesaba
   aktarılması, `/panel`, birden çok CV, otomatik kayıt, sürüm geçmişi, sunucu tarafı PDF,
   site yorumu toplama.
   *Durum: kod tarafı tamam (Ekim 2026). Sunucu PDF'i Docker imajında (Alpine Chromium) henüz denenmedi.*
4. **Faz 3 — Kullanıcı şablonları:** görsel şablon editörü, özel / bağlantılı / herkese açık
   görünürlük, galeri, puanlama ve yorum, kopyala-düzenle, otomatik ATS puanı, önizleme görseli,
   şikâyet ve yönetici moderasyonu.
5. **Faz 4 — Büyüme:** örnek CV sayısını 200+'e çıkarma (devam ediyor: taslaklar alt-ajanlarla 10'arlı
   partiler halinde `content/examples/tr` altına yazılır, `pnpm content:seed-examples` ile yüklenir,
   panelde gözden geçirilip yayınlanır; sıradaki meslekler Search Console verisine göre seçilir), `/ats-cv-kontrolu` aracı, Search Console
   verisine göre içerik, **dil dalgaları 2–4** (bölüm 8.1).
6. **Sonrası (fikir):** herkese açık paylaşım bağlantısı, ilana göre yapay zekâ ile CV
   uyarlama, ön yazı (cover letter) şablonları.

### 14.1 Kullanıcı istekleri (12 Kasım 2026)

- **Arayüz yenilemesi:** uygulama tarafında (panel, editör, şablon editörü) UI/UX'i baştan ele alan,
  daha kullanışlı ve güncel bir arayüz. İstenen araç: `impeccable` tasarım skill'i.
- **Canva'dan tasarım aktarma:** fizibilite tartışılacak. Çizim motoru serbest yerleşim değil,
  JSON tasarım tanımı okuduğu için (11.1) birebir kopya mümkün değil; olası yollar içerik aktarımı
  (Canva'dan dışa aktarılan PDF/PPTX → CV alanları) ve stil yakınsaması (renk, font, yerleşim →
  tasarım tanımı). Canva şablonlarının lisansı, galeride herkese açmayı kısıtlayabilir.

## 15. Verilen kararlar

| Konu | Karar |
|---|---|
| Ürün adı | **FreehandCV**, alan adı **freehandcv.com** (dil önekleriyle tek `.com`). Eski çalışma adı: Özgeçmiş Stüdyo |
| Ücret | **%100 ücretsiz**, PDF dahil. Ücretli plan, deneme süresi, kart bilgisi yok |
| Gelir | Şimdilik yalnızca **bağış**. Site sayfalarında rahatsız etmeyen birkaç reklam alanı seçeneği altyapıda hazır, varsayılan kapalı (bölüm 7.6) |
| İçerik | Landing dahil herkese açık sitenin tamamı **yönetim panelinden dinamik** düzenlenir (bölüm 7) |
| Mimari | Tek Next.js uygulaması (tam yığın), PostgreSQL |
| Açılış | Doğrudan editör ya da giriş değil, **landing sayfası** |
| Kayıt | Editör ve PDF hesapsız; hesap bulut kaydı, sürümler ve şablon paylaşımı için |
| Şablon sahibi | Adı (`@kullanici_adi`) galeride görünür |
| Moderasyon | Ön onay yok; şikâyet gelirse müdahale |
| Şablonda CSS | Açılmaz. Karar değişirse sonradan uyarlanır |
| SEO | URL yapısı ve site/uygulama ayrımı baştan kesin (bölüm 6) |
| Diller | Çok dilli mimari ilk günden; ilk yayında Türkçe + İngilizce, ardından dalgalarla ~25 dile kadar (bölüm 8) |

## 16. Açık sorular

- Marka tescili: "FreehandCV" için TÜRKPATENT ve EUIPO'da kesin arama yapılmalı. Ön inceleme
  (Ekim 2026): eski Aldus/Adobe FreeHand ABD tescilleri iptal; Miro'nun 2023'te InVision'dan
  aldığı "Freehand" beyaz tahta ürünü var, farklı pazar ama aynı yazılım sınıfı.
- Bağış kanalı: Buy Me a Coffee, Patreon, GitHub Sponsors, banka havalesi (IBAN)? Türkiye'den kartla
  ödeme alabilen bir kanal seçilmeli.
- Dalga 2'deki dillerin içeriğini gözden geçirecek anadili konuşanlar (gönüllü / serbest çevirmen).
