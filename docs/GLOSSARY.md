# Naming glossary (Turkish → English)

The codebase was originally written with Turkish identifiers. It is now English everywhere in code:
files, folders, identifiers, comments, database objects, JSON data keys, translation keys and CSS
tokens. **User-facing text stays localized** (Turkish and English values in `messages/`), and
**public Turkish URLs stay Turkish** for search (mapped in `src/i18n/routing.ts` `pathnames`).

This file is the contract for the rename. Domain vocabulary used across the code:

| Turkish | English |
|---|---|
| CV / özgeçmiş | resume (code), CV (UI text where the market uses it) |
| şablon | template |
| tasarım tanımı | design definition |
| blok | block |
| sayfa | page |
| yönetim | admin |
| misafir | guest |
| hesap | account |
| oturum | session |
| rıza / onay | consent |
| işveren paylaşımı | employer sharing |
| IK kontrolü | resume checks |
| önizleme | preview |
| site ayarları | site settings |
| günlük (yönetim) | audit log |
| yayınla / taslak | publish / draft |
| sürüm | version |
| dil (arayüz) | locale |
| pazar | market |

## Folders and files

| Old | New |
|---|---|
| `src/sunucu/` | `src/server/` |
| `src/sunucu/yetki.ts` | `src/server/authz.ts` |
| `src/sunucu/cvler.ts` | `src/server/resumes.ts` |
| `src/sunucu/rizalar.ts` | `src/server/consents.ts` |
| `src/sunucu/db/sema/{index,auth,uygulama,icerik,ortak}.ts` | `src/server/db/schema/{index,auth,app,content,columns}.ts` |
| `src/sunucu/icerik/{sayfalar,siteAyarlari}.ts` | `src/server/content/{pages,siteSettings}.ts` |
| `src/sunucu/yonetim/kullanicilar.ts` | `src/server/admin/users.ts` |
| `src/istemci/auth.ts` | `src/client/auth.ts` |
| `src/istemci/editor/depo.ts` | `src/client/editor/store.ts` |
| `src/eylemler/{cv,paylasim}.ts` | `src/actions/{resume,sharing}.ts` |
| `src/ortak/` | `src/lib/` |
| `src/ortak/cv/{sema,tasarim,basliklar,kontroller,ornek,yardimci,cv.test}.ts` | `src/lib/resume/{schema,design,labels,checks,sample,utils,resume.test}.ts` |
| `src/ortak/{bloklar,bloklar.test,cmsSayfalari,siteAyarlari,varsayilanIcerik}.ts` | `src/lib/{blocks,blocks.test,cmsPages,siteSettings,defaultContent}.ts` |
| `src/bilesenler/` | `src/components/` |
| `src/bilesenler/cv/{CvBelge,OlcekliKagit,SablonOnizleme}.tsx, cv.css, cvFontlari.ts` | `src/components/resume/{ResumeDocument,ScaledPaper,TemplatePreview}.tsx, resume.css, resumeFonts.ts` |
| `src/bilesenler/editor/{Editor,IcerikPaneli,TasarimPaneli,KontrolPaneli,Onizleme,MisafirBilgi,ui}.tsx, editor.css` | `src/components/editor/{Editor,ContentPanel,DesignPanel,ChecksPanel,Preview,GuestNotice,ui}.tsx, editor.css` |
| `src/bilesenler/hareket/{Belir,HareketSaglayici}.tsx` | `src/components/motion/{Reveal,MotionProvider}.tsx` |
| `src/bilesenler/hesap/{GirisFormu,GoogleLogo,GoogleTekDokunus,KullaniciMenusu}.tsx` | `src/components/account/{AuthForm,GoogleLogo,GoogleOneTap,UserMenu}.tsx` |
| `src/bilesenler/site/{AltBilgi,CmsSayfasi,DuyuruCubugu,Logo,SiteBasligi,TemaDegistirici}.tsx` | `src/components/site/{Footer,CmsPage,AnnouncementBar,Logo,SiteHeader,ThemeToggle}.tsx` |
| `src/bilesenler/ui/Buton.tsx` | `src/components/ui/Button.tsx` |
| `src/bilesenler/yonetim/{CikisButonu,SemaFormu,YonetimDenetimi,YonetimKabugu,ui}.tsx` | `src/components/admin/{SignOutButton,SchemaForm,AdminGuard,AdminShell,ui}.tsx` |
| `src/bilesenler/{DilSecici,JsonLd,TemaSaglayici}.tsx` | `src/components/{LanguageSwitcher,JsonLd,ThemeProvider}.tsx` |
| `src/bloklar/` | `src/blocks/` |
| `src/bloklar/{Adimlar,Bagis,BlokCizici,Cta,Hero,HeroOnizleme,Karsilastirma,Ozellikler,SablonVitrini,SayfaBasligi,Sss,ZenginMetin,ortak}.tsx` | `src/blocks/{Steps,Donation,BlockRenderer,Cta,Hero,HeroPreview,Comparison,Features,TemplateShowcase,PageTitle,Faq,RichText,shared}.tsx` |
| `scripts/{yonetici-olustur,icerik-tohumla,tohum-sayfalari,goc}` | `scripts/{create-admin.ts,seed-content.ts,seed-pages.ts,migrate.mjs}` |
| `messages/{tr,en}.json` | `messages/{tr,en}/<namespace>.json` (one file per namespace, merged in `src/i18n/request.ts`) |

### App routes (folders) and public URLs

| Old folder | New folder | Public URL tr | Public URL en |
|---|---|---|---|
| `(site)/ucretsiz-mi` | `(site)/is-it-free` | `/ucretsiz-mi` | `/en/is-it-free` |
| `(site)/destek` | `(site)/support` | `/destek` | `/en/support` |
| `(site)/gizlilik` | `(site)/privacy` | `/gizlilik-ve-kvkk` | `/en/privacy` |
| `(uygulama)` | `(app)` | | |
| `(uygulama)/cv-olustur` | `(app)/create-resume` | `/cv-olustur` | `/en/create-resume` |
| `(uygulama)/cv/[id]` | `(app)/resume/[id]` | `/cv/[id]` | `/en/resume/[id]` |
| `(uygulama)/giris`, `kayit` | `(app)/sign-in`, `sign-up` | `/giris`, `/kayit` | `/en/sign-in`, `/en/sign-up` |
| `(uygulama)/panel` | `(app)/dashboard` | `/panel` | `/en/dashboard` |
| `(yonetim)/yonetim` | `(admin)/admin` | `/admin` | `/en/admin` |
| `…/yonetim/(korumali)` | `…/admin/(protected)` | | |
| `…/giris`, `iki-adim`, `onizleme` | `…/sign-in`, `two-factor`, `preview` | `/admin/…` | |
| `…/(korumali)/{gunluk,kullanicilar,sayfalar,sayfalar/[id],site-ayarlari}` | `…/(protected)/{audit-log,users,pages,pages/[id],settings}` | `/admin/…` | |

Planned routes keep the same rule: `/resume-examples` (tr `/cv-ornekleri`), `/resume-examples/[slug]`,
`/resume-templates` (tr `/cv-sablonlari`), `/resume-templates/[slug]`, `/guides/[topic]` (tr `/rehber/[topic]`).

## Translation namespaces

| Old | New | Owner area |
|---|---|---|
| `Meta` | `Meta` | site |
| `Site` | `Site` | site |
| `Landing` | `Landing` | site |
| `Landing.sablonlar.adlar` + `Editor.tasarim.aciklamalar` | `Templates.names.<id>`, `Templates.descriptions.<id>` | resume |
| `Uygulama` | `App` | account |
| `Yonetim` | `Admin` | admin |
| `Editor` | `Editor` | resume |
| `Kontrol` | `Checks` | resume |
| `Hesap` | `Auth` | account |
| `Panel` | `Dashboard` | resume |
| `Riza` | `Consent` | account |

Keys inside namespaces are English camelCase.

## CSS design tokens (`src/app/globals.css`, Tailwind utilities)

`zemin`→`background`, `yuzey`→`surface`, `yuzey-2`→`surface-2`, `cizgi`→`border`, `cizgi-guclu`→`border-strong`,
`metin`→`foreground`, `soluk`→`muted`, `ana`→`primary`, `ana-koyu`→`primary-dark`, `ana-acik`→`primary-soft`,
`ana-metin`→`primary-text`, `vurgu`→`accent`, `vurgu-acik`→`accent-soft`, `uyari`→`warning`, `hata`→`danger`,
`hata-acik`→`danger-soft`, `odak`→`focus`, `kagit`→`paper`.
Shadows: `shadow-kart`→`shadow-card`, `shadow-yuksek`→`shadow-elevated`, `shadow-kagit`→`shadow-paper`.
Reveal classes: `.belir-yukle`→`.reveal-on-load`, `.belir-kaydir`→`.reveal-on-scroll`, `--gecikme`→`--delay`.

## Database (snake_case columns, camelCase Drizzle properties)

Better Auth tables (`user`, `session`, `account`, `verification`, `two_factor`) keep their names. Extra `user` columns:
`kullanici_adi`→`username`, `arayuz_dili`→`ui_locale`, `pazar`→`market`, `rol`→`role`,
`isveren_paylasimi`→`employer_sharing`, `paylasilan_cv_id`→`shared_resume_id`.
Role values: `kullanici`→`user`, `editor`→`editor`, `yonetici`→`admin`.

| Old table | New table | Columns (old → new) |
|---|---|---|
| `cvler` | `resumes` | kullanici_id→user_id, baslik→title, icerik→content, dil→locale, pazar→market, durum→status (taslak/aktif/arsiv → draft/active/archived), kaynak_ornek_id→source_example_id, surum→version, olusturma→created_at, guncelleme→updated_at, silinme→deleted_at, sablon_id→template_id, sablon_tanim→template_definition |
| `cv_surumleri` | `resume_versions` | cv_id→resume_id, icerik→content, tur→kind (otomatik/elle/pdf → auto/manual/pdf), etiket→label, olusturma→created_at |
| `ornek_cvler` | `example_resumes` | baslik→title, meslek→occupation, kategori→category, dil→locale, pazar→market, ceviri_grubu→translation_group, deneyim_seviyesi→experience_level (yeni-mezun/orta/kidemli → entry/mid/senior), icerik→content, sablon_id→template_id, meta_baslik→meta_title, meta_aciklama→meta_description, rehber→guide, kullanim_sayisi→usage_count, sira→sort_order, aktif→active, guncelleme→updated_at |
| `site_yorumlari` | `site_reviews` | kullanici_id→user_id, puan→rating, metin→body, meslek→occupation, izin_verildi→display_allowed, onaylandi→approved, olusturma→created_at |
| `dosyalar` | `files` | kullanici_id→user_id, anahtar→key, tur→kind, boyut→size, olusturma→created_at |
| `sablonlar` | `templates` | sahip_id→owner_id, ad→name, aciklama→description, tanim→definition, surum→version, gorunurluk→visibility (ozel/baglanti/herkese_acik → private/unlisted/public), durum→status (aktif/incelemede/gizlendi → active/under_review/hidden), resmi→official, kaynak_sablon_id→source_template_id, ats_puani→ats_score, onizleme_anahtari→preview_key, kullanim_sayisi→usage_count, puan_toplam→rating_sum, puan_sayisi→rating_count, olusturma→created_at, guncelleme→updated_at, yayinlanma→published_at, silinme→deleted_at |
| `sablon_puanlari` | `template_ratings` | sablon_id→template_id, kullanici_id→user_id, puan→rating, yorum→comment, gizlendi→hidden, olusturma→created_at, guncelleme→updated_at |
| `sablon_favorileri` | `template_favorites` | sablon_id→template_id, kullanici_id→user_id, olusturma→created_at |
| `sablon_sikayetleri` | `template_reports` | sablon_id→template_id, kullanici_id→user_id, neden→reason, aciklama→details, durum→status (acik/kapandi → open/closed), olusturma→created_at |
| `rizalar` | `consents` | kullanici_id→user_id, tur→kind (isveren_paylasimi → employer_sharing), verildi→granted, metin_surumu→text_version, kaynak→source (kayit/panel/indirme → sign_up/dashboard/download), olusturma→created_at |
| `site_ayarlari` | `site_settings` | ayarlar→settings, ceviriler→translations, surum→version, guncelleyen_id→updated_by_id, guncelleme→updated_at |
| `medya` | `media` | anahtar→key, alt_metin→alt_text, genislik→width, yukseklik→height, boyut→size, yukleyen_id→uploaded_by_id, olusturma→created_at |
| `sayfalar` | `pages` | tur→kind (sabit/rehber/yasal → static/guide/legal), dil→locale, ceviri_grubu→translation_group, ceviri_durumu→translation_status (makine/gozden_gecirildi → machine/reviewed), baslik→title, meta_baslik→meta_title, meta_aciklama→meta_description, og_gorsel_id→og_image_id, indeks→indexable, durum→status (taslak/yayinda/zamanlanmis/arsiv → draft/published/scheduled/archived), yayin_tarihi→publish_at, bloklar→draft_blocks, yayindaki_bloklar→published_blocks, surum→version, guncelleyen_id→updated_by_id, olusturma→created_at, guncelleme→updated_at |
| `sayfa_surumleri` | `page_versions` | sayfa_id→page_id, bloklar→blocks, yayinlayan_id→published_by_id, olusturma→created_at |
| `sss` | `faqs` | dil→locale, ceviri_grubu→translation_group, soru→question, cevap→answer, kategori→category, sira→sort_order, aktif→active |
| `reklam_alanlari` | `ad_slots` | kod→code, saglayici→provider (adsense/ozel/kapali → adsense/custom/off), icerik→content, boyut→size, aktif→active, guncelleme→updated_at |
| `yonlendirmeler` | `redirects` | kaynak→source, hedef→destination, kod→status_code, olusturma→created_at |
| `yonetim_gunlugu` | `audit_log` | kullanici_id→user_id, islem→action, hedef_tur→target_type, hedef_id→target_id, once→before, sonra→after, olusturma→created_at |

Audit actions: `taslak_kaydet`→`save_draft`, `yayinla`→`publish`, `surume_don`→`restore_version`,
`site_ayarlari`→`update_site_settings`, `rol_degistir`→`change_role`. Target types: `sayfa`→`page`,
`site_ayarlari`→`site_settings`, `kullanici`→`user`.
CMS page slugs (internal keys): `ana-sayfa`→`home`, `ucretsiz-mi`→`is-it-free`, `destek`→`support`, `gizlilik`→`privacy`.

## JSON data shapes

### Resume data (`resumes.content`, guest localStorage, JSON export)

Top level: `surum`→`version`, `ayarlar`→`settings`, `kisisel`→`personal`, `ozet`→`summary`, `deneyim`→`experience`,
`projeler`→`projects`, `yetenekler`→`skills`, `egitim`→`education`, `sertifikalar`→`certifications`,
`diller`→`languages`, `referanslar`→`references`, `ilgi`→`interests`.
Section ids are the same English keys (`summary`, `experience`, …, `interests`).

- settings: `sablon`→`template`, `renk`→`color`, `font`, `boyut`→`size` (kucuk/orta/buyuk → small/medium/large),
  `aralik`→`spacing` (siki/normal/ferah → compact/normal/relaxed), `foto`→`showPhoto`, `dil`→`locale`,
  `kagit`→`paper`, `bolumSirasi`→`sectionOrder`, `gizli`→`hiddenSections`, `basliklar`→`sectionTitles`.
- personal: `ad`→`name`, `unvan`→`title`, `eposta`→`email`, `telefon`→`phone`, `konum`→`location`, `linkedin`,
  `github`, `web`, `foto`→`photo`, `ekler`→`extras` [`etiket`→`label`, `deger`→`value`].
- every list entry: `id`, `gizli`→`hidden`.
- experience: `pozisyon`→`position`, `kurum`→`company`, `konum`→`location`, `baslangic`→`start`, `bitis`→`end`,
  `devam`→`current`, `aciklama`→`description`, `maddeler`→`bullets`.
- projects: `ad`→`name`, `rol`→`role`, `baslangic`→`start`, `bitis`→`end`, `teknolojiler`→`technologies`,
  `baglanti`→`link`, `aciklama`→`description`, `maddeler`→`bullets`.
- skills: `kategori`→`category`, `liste`→`items`.
- education: `okul`→`school`, `bolum`→`field`, `derece`→`degree`, `baslangic`→`start`, `bitis`→`end`,
  `not`→`gpa`, `konum`→`location`, `aciklama`→`description`.
- certifications: `ad`→`name`, `kurum`→`issuer`, `tarih`→`date`, `baglanti`→`link`.
- languages: `dil`→`language`, `seviye`→`level`.
- references: `ad`→`name`, `unvan`→`title`, `kurum`→`company`, `telefon`→`phone`, `eposta`→`email`.

Template ids: `modern`, `ats`, `zarif`→`elegant`, `teknik`→`technical`, `kenar`→`sidebar`, `kurumsal`→`corporate`,
`ikili`→`two-column`, `kontrast`→`contrast`, `isvicre`→`swiss`, `akademik`→`academic`, `zaman`→`timeline`,
`yaratici`→`creative`, `girisim`→`startup`, `ferah`→`airy`, `yeni-mezun`→`graduate`, `acik-kenar`→`light-sidebar`,
`editoryal`→`editorial`, `butik`→`boutique`, `kompakt`→`compact`, `resmi`→`formal`, `klasik`→`classic`, `sade`→`minimal`
(legacy `yonetici` → `elegant`).

Legacy Turkish resume JSON (old static app exports, guest data in localStorage) is converted on read by
`src/lib/resume/legacy.ts`.

### Blocks (`pages.draft_blocks`, `pages.published_blocks`, `page_versions.blocks`)

Block: `id`, `tur`→`type`, `ayarlar`→`settings`, `icerik`→`content`.
Settings: `gorunur`→`visible`, `mobildeGizle`→`hideOnMobile`, `arkaPlan`→`background` (yok/hafif → none/subtle), `capa`→`anchor`.
Types and content keys:
- `hero`: `rozet`→`badge`, `baslik`→`title`, `altBaslik`→`subtitle`, `anaButon`→`primaryButton`, `ikincilButon`→`secondaryButton`
  (buttons: `metin`→`label`, `baglanti`→`href`), `maddeler`→`bullets`.
- `sayfa_basligi`→`page_title`: `ust`→`eyebrow`, `baslik`→`title`, `aciklama`→`description`.
- `sablon_vitrini`→`template_showcase`: `eyebrow`, `title`, `description`, `sec`→`cardButton`.
- `adimlar`→`steps`: `eyebrow`, `title`, `liste`→`items` [`baslik`→`title`, `metin`→`text`].
- `karsilastirma`→`comparison`: `eyebrow`, `title`, `description`, `konu`→`featureHeader`, `diger`→`othersHeader`,
  `biz`→`usHeader`, `satirlar`→`rows` [`konu`→`feature`, `diger`→`others`, `biz`→`us`].
- `ozellikler`→`features`: `eyebrow`, `title`, `items` [`title`, `text`].
- `sss`→`faq`: `eyebrow`, `title`, `items` [`soru`→`question`, `cevap`→`answer`].
- `cta`: `title`, `text`, `button` [`label`, `href`].
- `bagis`→`donation`: `title`, `text`, `buton`→`buttonLabel`.
- `zengin_metin`→`rich_text`: `title`, `text`.

### Site settings (`site_settings.settings` / `.translations[locale]`)

settings: `iletisimEposta`→`contactEmail`, `sosyal`→`social` {linkedin, x, instagram, github},
`bagis`→`donation` {`aktif`→`enabled`, `baglanti`→`url`}.
translations[locale]: `duyuru`→`announcement` {`aktif`→`enabled`, `metin`→`text`, `baglanti`→`href`},
`altBilgiSlogan`→`footerTagline`, `bagisMetni`→`donationLabel`.
