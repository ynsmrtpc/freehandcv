# FreehandCV

%100 ücretsiz CV düzenleyici. Plan ve kararlar: [docs/WEB-UYGULAMA-PLANI.md](docs/WEB-UYGULAMA-PLANI.md).

## Yerelde çalıştırma

Gerekenler: Node 24, pnpm 10, Docker.

```bash
pnpm install
cp .env.example .env            # BETTER_AUTH_SECRET'ı doldur: openssl rand -base64 32
pnpm db:up                      # Postgres 17, localhost:5433
pnpm db:migrate
pnpm yonetici:olustur <e-posta> <şifre> "Ad Soyad"
pnpm dev
```

- Site: http://localhost:3000 (Türkçe), http://localhost:3000/en
- Yönetim: http://localhost:3000/yonetim — ilk girişte iki adımlı doğrulama (TOTP) kurulur.

## Komutlar

| Komut | İş |
|---|---|
| `pnpm dev` / `pnpm build` | Geliştirme sunucusu / üretim derlemesi |
| `pnpm typecheck`, `pnpm lint` | Tip ve lint denetimi |
| `pnpm db:generate` | Şema değişikliğinden SQL göçü üretir (`drizzle/`) |
| `pnpm db:migrate` | Göçleri uygular |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm yonetici:olustur` | Yönetici hesabı açar ya da var olanı yönetici yapar |

## Dizinler

```
src/app/[locale]/(site)       herkese açık site (statik, indekslenir)
src/app/[locale]/(uygulama)   editör ve panel (noindex)
src/app/[locale]/(yonetim)    yönetim paneli (rol + TOTP denetimli)
src/sunucu/                   iş mantığı, veritabanı, auth — yalnız sunucuda
src/sunucu/db/sema/           Drizzle şeması (planın 5. bölümündeki tüm tablolar)
src/istemci/                  tarayıcı tarafı yardımcılar
src/ortak/                    iki tarafın da kullandığı saf kod (SEO, site adresi)
src/i18n/                     next-intl: diller, yerelleştirilmiş yollar
messages/                     arayüz çevirileri
```

## Dağıtım

`Dockerfile` Coolify içindir: standalone Next.js imajı, açılışta veritabanı göçlerini uygular.
Ortam değişkenleri `.env.example` ile aynıdır; `BETTER_AUTH_URL` ve `NEXT_PUBLIC_SITE_URL`
canlı adres (`https://freehandcv.com`) olmalıdır.
