# Google ile giriş: anahtarları alma

FreehandCV'de "Google ile devam et" düğmesi ve Google One Tap açılır penceresi için Google Cloud'dan
bir **OAuth istemci kimliği** almak gerekir. Bu belge, `.env` dosyasına yazılacak üç değeri adım adım
nasıl alacağını anlatır:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

Bu değerler boş kaldığı sürece Google düğmeleri gizlenir, e-posta/şifre ile giriş çalışmaya devam eder.
Kurulum yaklaşık 10–15 dakika sürer ve ücretsizdir; Google Cloud'da kart bilgisi girmen gerekmez.

---

## 1. Google Cloud projesi oluştur

1. <https://console.cloud.google.com> adresine, sitenin sahibi olacak Google hesabıyla gir.
2. Üst çubuktaki proje seçiciden **New Project (Yeni proje)** seç.
3. Proje adı: `FreehandCV`. Kuruluş (organization) sorulursa "No organization" kalabilir.
4. **Create** de, ardından üst çubuktan yeni projenin seçili olduğundan emin ol.

## 2. Uygulamayı tanıt (OAuth onay ekranı)

Kullanıcı Google ile giriş yaparken "FreehandCV hesabınıza erişmek istiyor" ekranını görür; bu ekranın
bilgileri burada girilir.

1. Sol menü: **APIs & Services → OAuth consent screen**. Yeni arayüzde bu bölümün adı
   **Google Auth Platform**'dur. **Get started** de.
2. **App information**
   - App name: `FreehandCV`
   - User support email: kendi e-postan
3. **Audience:** **External** seç. Herkes giriş yapabilsin diye bu seçenek gerekir.
4. **Contact information:** Google'ın sana ulaşacağı e-posta.
5. Koşulları kabul et ve **Create** de.
6. **Branding** sekmesi (isteğe bağlı ama önerilir):
   - Application home page: `https://freehandcv.com`
   - Application privacy policy link: `https://freehandcv.com/gizlilik-ve-kvkk`
   - Authorized domains: `freehandcv.com`
   - Logo yüklersen Google, logonun gösterilmesi için marka doğrulaması ister (birkaç gün sürebilir).
     Logo yüklemek şart değildir; logosuz da çalışır.
7. **Data Access (Scopes):** hiçbir şey ekleme. Uygulama yalnızca `openid`, `email` ve `profile`
   kapsamlarını kullanır. Bunlar "hassas olmayan" kapsamlar olduğu için Google incelemesi gerekmez.

## 3. OAuth istemci kimliğini oluştur

1. **APIs & Services → Credentials → Create credentials → OAuth client ID**. Yeni arayüzde yol
   **Google Auth Platform → Clients → Create client**'tır.
2. Application type: **Web application**
3. Name: `FreehandCV Web`
4. **Authorized JavaScript origins.** One Tap ve Google düğmesi bu adreslerde çalışır:
   ```
   http://localhost
   http://localhost:3000
   https://freehandcv.com
   ```
   Yerelde One Tap için Google, portlu ve portsuz `localhost` adreslerinin ikisini de ister.
5. **Authorized redirect URIs.** Google girişten sonra kullanıcıyı bu adreslere geri gönderir:
   ```
   http://localhost:3000/api/auth/callback/google
   https://freehandcv.com/api/auth/callback/google
   ```
   Adres harfi harfine aynı olmalı: `https`/`http` farkı, `www` ya da sondaki `/` girişi bozar.
6. **Create** de. Açılan pencerede iki değer görünür:
   - **Client ID**, `….apps.googleusercontent.com` ile biter
   - **Client secret**, `GOCSPX-…` ile başlar

   İkisini de kopyala. Client secret'ı bir parola gibi sakla; kimseyle paylaşma, git'e ekleme.
   Kaybedersen aynı ekrandan yeni bir secret oluşturabilirsin.

## 4. `.env` dosyasına yaz

```env
GOOGLE_CLIENT_ID=1234567890-abc…apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-…
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abc…apps.googleusercontent.com
```

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` alanına `GOOGLE_CLIENT_ID` ile **aynı** değer yazılır. Tarayıcıdaki
  One Tap bu değeri kullanır. Client ID gizli bir bilgi değildir, secret ise gizlidir.
- Değişiklikten sonra `pnpm dev`'i durdurup yeniden başlat.

## 5. Dene

1. <http://localhost:3000/giris> sayfasında **Google ile devam et** düğmesi görünmeli.
2. Düğmeye tıkla, Google hesabını seç; giriş yapınca `/panel`'e dönmelisin.
3. Çıkış yapıp ana sayfaya dönersen sağ üstte One Tap penceresi çıkmalı. Pencereyi daha önce
   kapattıysan Google onu bir süre göstermez; gizli pencerede dene.

## 6. Canlıya alırken

- **Yayın durumu:** OAuth onay ekranı başlangıçta **Testing** durumundadır. Bu durumda yalnızca
  **Audience → Test users** listesine eklediğin hesaplar (en fazla 100) giriş yapabilir. Yayından önce
  **Audience → Publish app** ile durumu **In production** yap. Hassas kapsam kullanılmadığı için bu
  adım onay beklemeden hemen geçerli olur.
- **Coolify ortam değişkenleri:** üç değişkeni de Coolify'daki uygulamaya ekle.
  `NEXT_PUBLIC_GOOGLE_CLIENT_ID` derleme sırasında koda gömülür; Coolify'da bu değişkeni
  **Build Variable** olarak da işaretle. Değeri değiştirirsen uygulamayı yeniden derle (redeploy).
- `BETTER_AUTH_URL` ve `NEXT_PUBLIC_SITE_URL` değerleri canlıda `https://freehandcv.com` olmalı.
  Aksi halde Google dönüş adresi eşleşmez.

## Sık karşılaşılan hatalar

| Hata | Neden ve çözüm |
|---|---|
| `Error 400: redirect_uri_mismatch` | 3.5'teki dönüş adresi, uygulamanın kullandığı adresle birebir aynı değil. Hata sayfasındaki "redirect_uri" değerini kopyalayıp listeye ekle. Değişikliğin etkinleşmesi birkaç dakika sürebilir. |
| `Error 403: access_denied` / "uygulama test aşamasında" | Onay ekranı Testing durumunda ve hesap test kullanıcısı değil. Hesabı test kullanıcısı olarak ekle ya da uygulamayı yayınla (6. bölüm). |
| One Tap hiç çıkmıyor | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` boş ya da sunucu yeniden başlatılmamış; adres 3.4'teki listede yok; tarayıcıda üçüncü taraf girişi (FedCM) kapalı; ya da pencere yakın zamanda kapatıldı. |
| `invalid_client` | Client secret yanlış kopyalanmış ya da başka bir istemciye ait. Yeni secret oluşturup yeniden yaz. |
| Google düğmesi görünmüyor | `GOOGLE_CLIENT_ID` veya `GOOGLE_CLIENT_SECRET` boş. İkisi de dolu olmalı. |
