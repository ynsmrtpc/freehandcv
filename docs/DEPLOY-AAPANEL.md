# aaPanel ile canlıya alma

FreehandCV, aaPanel ile yönetilen bir Linux sunucuda **Node.js uygulaması** (PM2) olarak çalışır.
PostgreSQL aynı sunucudadır; yüklenen görseller sunucudaki bir klasörde tutulur. Docker zorunlu
değildir: `Dockerfile` hâlâ çalışır ve aynı ayarları kullanır, ama bu rehber Docker'sız yolu anlatır.

Uygulama, Next.js'in `standalone` çıktısıdır: `server.js` ve gereken minimum `node_modules`.
Derleme sunucuda Bun ile yapılır, çalışma zamanı Node'dur.

## 1. Sunucuda bir kez yapılacaklar

aaPanel → **App Store** üzerinden:

- **Nginx**
- **PM2 Manager** (Node.js 24 sürümünü seç)
- **PostgreSQL** (aaPanel'in kendi kurulumu ya da mevcut Postgres 17/18)

Terminalden:

```bash
# Bun (derleme için)
curl -fsSL https://bun.sh/install | bash

# Sunucu PDF'i için Chromium (Debian/Ubuntu). Yol genelde /usr/bin/chromium olur.
sudo apt install -y chromium fonts-noto-core

# Medya klasörü: uygulama klasörünün DIŞINDA, böylece her dağıtımda silinmez
sudo mkdir -p /www/wwwroot/freehandcv-media
sudo chown -R www:www /www/wwwroot/freehandcv-media
```

### Veritabanı

```sql
CREATE USER freehandcv WITH PASSWORD 'güçlü-bir-şifre';
CREATE DATABASE freehandcv OWNER freehandcv;
```

Veritabanının sahibi uygulama kullanıcısı olmalı; aksi halde migration `drizzle` şemasını
oluşturamaz ("exited with code 1" hatası).

**Postgres portunu dışarıya açma.** Uygulama aynı sunucuda olduğu için `localhost` yeterli. aaPanel
→ **Security** bölümünde Postgres portu (5432/5433) kapalı kalsın. Uzaktan bağlanman gerekiyorsa
yalnızca kendi IP adresine izin ver ve Postgres'te SSL'i aç.

## 2. Ortam değişkenleri

Uygulama klasöründe `.env` dosyası (örnek: `.env.example`):

```ini
DATABASE_URL=postgres://freehandcv:ŞİFRE@localhost:5432/freehandcv
BETTER_AUTH_SECRET=            # openssl rand -base64 32
BETTER_AUTH_URL=https://freehandcv.com
NEXT_PUBLIC_SITE_URL=https://freehandcv.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
CHROMIUM_PATH=/usr/bin/chromium
RESEND_API_KEY=
EMAIL_FROM=FreehandCV <no-reply@freehandcv.com>
MEDIA_DIR=/www/wwwroot/freehandcv-media
PORT=3000
HOSTNAME=127.0.0.1
NODE_ENV=production
```

`NEXT_PUBLIC_*` değişkenleri **derleme sırasında** koda gömülür. Değiştirirsen yeniden derle.

## 3. Derleme ve yayın

İlk kurulumda depoyu `/www/wwwroot/freehandcv` klasörüne klonla, sonra her dağıtımda:

```bash
cd /www/wwwroot/freehandcv
git pull
bun install --frozen-lockfile
bun run build
bun run build:migrate

# standalone çıktısı statik dosyaları içermez; yanına kopyalanır
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
cp -r drizzle .next/standalone/
cp .next/migrate.mjs .next/standalone/
cp .env .next/standalone/

# Bekleyen veritabanı değişikliklerini uygula, sonra uygulamayı yeniden başlat
cd .next/standalone && node --env-file=.env migrate.mjs && pm2 restart freehandcv
```

### PM2'de uygulamayı tanımla (ilk kez)

aaPanel → **PM2 Manager → Add project**:

- **Startup file:** `/www/wwwroot/freehandcv/.next/standalone/server.js`
- **Run dir:** `/www/wwwroot/freehandcv/.next/standalone`
- **Name:** `freehandcv`
- **Node version:** 24

Ya da terminalden:

```bash
cd /www/wwwroot/freehandcv/.next/standalone
pm2 start server.js --name freehandcv --node-args="--env-file=.env"
pm2 save
```

## 4. Nginx (site ve SSL)

aaPanel → **Website → Add site** → alan adı `freehandcv.com`, ardından **SSL → Let's Encrypt**.
Sitenin **Config** bölümüne ters vekil ayarını ekle:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    client_max_body_size 25m;   # toplu görsel yükleme için
}

# İsteğe bağlı: görselleri Node'a uğramadan Nginx sunsun (uygulama da sunabilir)
location /media/ {
    alias /www/wwwroot/freehandcv-media/;
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header X-Content-Type-Options nosniff;
    try_files $uri =404;
}
```

`X-Forwarded-Host` başlığı gereklidir. Server Action'lar istek kaynağını bu başlıkla karşılaştırır;
eksik olursa yönetim panelinde kaydetme işlemleri reddedilir.

## 5. İlk yayından sonra

```bash
cd /www/wwwroot/freehandcv
bun run content:seed               # landing içeriği ve site ayarları (varsa dokunmaz)
bun run admin:create e-posta 'şifre' "Ad Soyad"
bun run content:seed-examples      # isteğe bağlı: 90 örnek CV taslağı
bun run content:seed-guides        # isteğe bağlı: 10 rehber taslağı
```

Kontrol listesi:

- `https://freehandcv.com/` ve `https://freehandcv.com/en` açılıyor.
- Türkçe adresler (`/cv-olustur`, `/cv-ornekleri`) yönlendirme döngüsüne girmiyor. Geliştirmede
  `127.0.0.1`e bağlanan bir sunucuda böyle bir döngü görülmüştü (`docs/WORK-STATUS.md`); döngü olursa
  `HOSTNAME=localhost` dene ve Nginx'in `Host` başlığını ilettiğinden emin ol.
- Editörde **PDF indir** sunucu PDF'i üretiyor; metin seçilebiliyor.
- `/admin/sign-in` → giriş → iki adımlı doğrulama kurulumu.
- Yönetim → **Medya**'ya bir görsel yükle ve adresini tarayıcıda aç.
- Yönetim → **Site ayarları** → Arama motorları: Search Console doğrulama kodunu gir.

## Yedekleme

İki şeyin yedeği alınmalı. aaPanel → **Cron** ile günlük görev olarak tanımlanabilir:

```bash
pg_dump -U freehandcv freehandcv | gzip > /www/backup/freehandcv-$(date +%F).sql.gz
tar -czf /www/backup/freehandcv-media-$(date +%F).tar.gz -C /www/wwwroot freehandcv-media
```
