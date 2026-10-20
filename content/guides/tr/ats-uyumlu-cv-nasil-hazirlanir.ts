import { defineGuide } from "../define";

export default defineGuide({
  slug: "ats-uyumlu-cv-nasil-hazirlanir",
  title: "ATS Uyumlu CV Nasıl Hazırlanır?",
  metaTitle: "ATS Uyumlu CV Nasıl Hazırlanır? Kurallar ve Hatalar",
  metaDescription:
    "Aday takip sistemi (ATS) nedir, CV'ni nasıl okur? Anahtar kelime eşleşmesi, tablo ve sütun hataları, doğru dosya formatı ile ATS uyumlu CV hazırla.",
  eyebrow: "Rehber",
  intro:
    "Başvurduğun birçok ilanda CV'ni ilk okuyan bir insan değil, bir yazılımdır. Bu rehberde aday takip sistemlerinin (ATS) CV'yi nasıl okuduğunu, anahtar kelimeleri nasıl seçeceğini ve hangi tasarım tercihlerinin CV'ni okunmaz hale getirdiğini öğreneceksin.",
  sections: [
    {
      heading: "ATS (aday takip sistemi) nedir?",
      body: "**Aday takip sistemi (ATS)**, şirketlerin başvuruları tek bir yerde toplamak, sıralamak ve yönetmek için kullandığı yazılımdır. Bir ilana yüzlerce başvuru geldiğinde işe alım ekibi CV'leri tek tek açmak yerine bu sistemde arar, filtreler ve etiketler.\n\nATS, büyük şirketlerin kendi kariyer sayfalarında, birçok kariyer sitesinin işveren panelinde ve işe alım ajanslarında yaygın olarak kullanılır. Çoğu sistem CV'ni otomatik olarak \"reddetmez\"; ama bilgilerini doğru okuyamazsa ya da aranan kelimeleri bulamazsa CV'n listenin altında kalır ve hiç açılmayabilir.\n\nKısacası ATS uyumlu bir CV, **yazılımın doğru okuyabildiği** ve **işe alım yapan kişinin aramasında çıkan** bir CV'dir.",
    },
    {
      heading: "ATS bir CV'yi nasıl okur?",
      body: "Sen CV'ni yüklediğinde sistem dosyayı önce düz metne çevirir (bu işleme **ayrıştırma** ya da parsing denir). Ardından bu metni parçalara ayırmaya çalışır: ad soyad, iletişim bilgileri, iş deneyimleri, tarihler, eğitim, yetenekler.\n\nBu aşamada yazılım görsel düzeni değil, **metnin sırasını** görür. Senin ekranda iki sütun olarak gördüğün bir sayfa, ayrıştırmadan sonra iki sütunun satırlarının birbirine karıştığı tek bir metne dönüşebilir. Bir tablonun içindeki tarih, yanlış şirketin altına düşebilir.\n\nAyrıştırma tamamlandıktan sonra işe alım yapan kişi sistemde arama yapar: \"muhasebe\", \"SAP\", \"İngilizce\", \"3 yıl\" gibi. CV'nde bu kelimeler geçiyorsa ve doğru bölümde okunuyorsa, sonuçlarda üst sıralarda görünürsün.",
    },
    {
      heading: "Anahtar kelime eşleşmesi: ilanı kaynak olarak kullan",
      body: "En doğru anahtar kelimeler, başvurduğun **ilanın kendisinde** yazar. İlanı dikkatle oku ve şunları ayır:\n\n- Unvan: \"Muhasebe Uzmanı\", \"Satış Temsilcisi\", \"Frontend Geliştirici\"\n- Teknik yetkinlikler ve araçlar: \"Logo Tiger\", \"Excel (pivot tablo)\", \"React\", \"SQL\"\n- Sertifika ve belgeler: \"SMMM\", \"PMP\", \"B sınıfı ehliyet\"\n- Sorumluluklar: \"bütçe planlama\", \"müşteri portföyü yönetimi\", \"stok takibi\"\n\nBu kelimeleri CV'ne doğal biçimde yerleştir: özetinde, deneyim maddelerinde ve yetenekler bölümünde. Kelimeyi ilandaki yazımıyla kullan; ilan \"Microsoft Excel\" diyorsa sen de öyle yaz. Kısaltmaları bir kez açık haliyle yazmak iki aramada da çıkmanı sağlar: \"Kurumsal Kaynak Planlama (ERP)\".\n\nUnvanına da dikkat et. Şirketindeki resmi unvan çok özelse (\"Müşteri Mutluluğu Kahramanı\" gibi), yanına sektörde yaygın karşılığını ekle: \"Müşteri Mutluluğu Kahramanı (Müşteri Hizmetleri Uzmanı)\". İşe alım yapanlar genellikle yaygın unvanlarla arama yapar. Aynı mantık sektör terimleri için de geçerli: hem Türkçe hem İngilizce kullanılan bir terimse ve ilan İngilizcesini kullanıyorsa, sen de o yazımı tercih et.\n\nAnahtar kelime eklemek, sahip olmadığın bir yetkinliği yazmak demek değildir. CV'nde geçen her araç mülakatta sorulabilir.",
    },
    {
      heading: "Anahtar kelime doldurmanın zararları",
      body: "Bazı adaylar ilanı olduğu gibi kopyalayıp CV'nin altına küçük ya da beyaz renkli yazıyla yapıştırır. Bu yöntem işe yaramaz: CV bir insan tarafından açıldığında ya da metin kopyalandığında hemen fark edilir ve güvenini zedeler.\n\nAynı kelimeyi her maddede tekrar etmek de okumayı zorlaştırır. Bunun yerine kelimeyi bir sonuçla birlikte kullan:\n\n- Zayıf: \"Excel, Excel raporlama, Excel pivot, Excel makro.\"\n- Güçlü: \"Aylık satış raporlarını **Excel pivot tablo** ve makrolarla otomatikleştirerek hazırlama süresini 2 günden yarım güne indirdim.\"\n\nİkinci madde hem anahtar kelimeyi içeriyor hem de okuyan kişiye ne kadar iyi kullandığını gösteriyor.",
    },
    {
      heading: "Düzen hataları: tablo, görsel, üst bilgi ve sütunlar",
      body: "ATS'lerin en çok zorlandığı yer içerik değil, düzendir. Şu tercihlerden kaçın:\n\n- **Tablolar ve metin kutuları:** Hücrelerin okunma sırası beklediğin gibi olmayabilir; tarih, şirket ve unvan birbirinden kopabilir.\n- **Görselin içindeki metin:** Logo, ikon ya da resim olarak eklenen yazılar çoğu sistem tarafından okunmaz. Yetenekleri bir görsel ya da infografik olarak koyarsan sistem bunları hiç görmeyebilir.\n- **Üst bilgi ve alt bilgi (header/footer):** Bazı sistemler bu alanları atlar. Ad soyad ve iletişim bilgilerini sayfanın gövdesine yaz.\n- **Çok sütunlu düzen:** İki sütunlu tasarımlar ekranda düzenli görünür ama ayrıştırmada satırlar karışabilir. Tek sütun en güvenli seçenektir; iki sütun kullanacaksan ana içeriği (deneyim, eğitim) geniş sütunda tut.\n- **Yaratıcı başlıklar:** \"Yolculuğum\" ya da \"Neler yaptım\" yerine \"İş Deneyimi\" yaz. Sistem bölümleri standart başlıklardan tanır.\n- **Yetenek grafikleri:** Yıldızlar, çubuklar ve yüzdeler metin olarak okunmaz; seviyeyi yazıyla belirt.",
    },
    {
      heading: "Tarih, yazı tipi ve küçük ayrıntılar",
      body: "Ayrıştırmayı kolaylaştıran birkaç küçük kural daha var:\n\n- Tarihleri her pozisyonda aynı biçimde yaz: \"03/2021 – 06/2024\" ya da \"Mart 2021 – Haziran 2024\". Sadece yıl yazmak deneyim süresinin yanlış hesaplanmasına yol açabilir.\n- Şirket adı, unvan ve tarihi her pozisyonda aynı sırayla ver.\n- Yaygın, okunaklı bir yazı tipi kullan; süslü ya da el yazısı tarzı fontlardan kaçın.\n- Madde işareti olarak basit bir nokta ya da tire kullan; özel semboller bozuk karakterlere dönüşebilir.\n- Türkçe karakterlerin (ç, ğ, ı, ö, ş, ü) PDF'te doğru göründüğünü kontrol et.",
    },
    {
      heading: "Dosya formatı: PDF mi, Word mü?",
      body: "Günümüzdeki sistemlerin çoğu hem **PDF** hem de **Word (.docx)** dosyalarını okuyabilir. İlan özel bir format istiyorsa her zaman ona uy.\n\nİlan bir şey belirtmiyorsa PDF genellikle daha iyi bir seçimdir: düzenin her cihazda aynı görünür ve yanlışlıkla değiştirilemez. Ancak PDF'in **metin tabanlı** olması şart. Word'de ya da bir CV editöründe hazırlayıp \"PDF olarak kaydet\" ile oluşturduğun dosya metin içerir; kâğıt CV'yi tarayarak ya da ekran görüntüsü alarak oluşturduğun PDF ise sadece bir resimdir ve ATS onu okuyamaz.\n\nBasit bir test yap: PDF'ini aç, tüm metni seç ve bir not defterine yapıştır. Metin doğru sırada ve eksiksiz geliyorsa, büyük ihtimalle ATS de onu okuyabilir.",
    },
    {
      heading: "Kariyer sitelerinde ve başvuru formlarında",
      body: "Bazı kariyer siteleri ve şirket başvuru sayfaları CV'ni yükledikten sonra bilgileri otomatik olarak form alanlarına doldurur. Bu, ATS'nin CV'ni nasıl okuduğunu görmen için iyi bir fırsattır.\n\nForm dolduğunda alanları tek tek kontrol et:\n\n- Şirket adları ve unvanlar doğru alanlara mı düşmüş?\n- Başlangıç ve bitiş tarihleri doğru okunmuş mu?\n- Yetenekler eksiksiz aktarılmış mı?\n\nYanlış okunan alanları elle düzelt; işe alım ekibi çoğu zaman CV dosyasından önce bu form verisini görür. Aynı hatalar birden fazla sitede tekrar ediyorsa sorun büyük ihtimalle CV'nin düzenindedir: tablo, sütun ya da metin kutusu kullandığın bölümleri sadeleştir.\n\nFormlardaki \"ön yazı\" ve \"ek bilgiler\" alanlarını boş bırakma. İlandaki iki üç temel gereksinime kısa ve somut cevaplar vermek, hem aramalarda görünürlüğünü artırır hem de seni okuyan kişiye ilana gerçekten baktığını gösterir.",
    },
    {
      heading: "ATS uyumlu CV kontrol listesi",
      body: "- Tek sütunlu ya da sade iki sütunlu bir düzen kullandım.\n- İletişim bilgilerim sayfanın gövdesinde, üst bilgi alanında değil.\n- Bölüm başlıklarım standart: Profesyonel Özet, İş Deneyimi, Eğitim, Yetenekler.\n- Önemli bilgileri tablo, metin kutusu ya da görsel içine koymadım.\n- İlandaki temel anahtar kelimeler özetimde, maddelerimde ve yeteneklerimde geçiyor.\n- Tarihlerim tutarlı ve ay/yıl biçiminde.\n- Dosyam metin seçilebilen bir PDF ve kopyala-yapıştır testini geçiyor.\n- Dosya adı açık: \"Ad-Soyad-CV.pdf\".\n\nUnutma: ATS uyumu, CV'nin ilk eşiği geçmesini sağlar. Sonrasında CV'ni bir insan okuyacak; o yüzden yazılım için değil, önce okuyan kişi için net ve ikna edici yaz.",
    },
  ],
  faq: [
    {
      question: "ATS nedir?",
      answer:
        "ATS (aday takip sistemi), şirketlerin iş başvurularını toplamak, aramak ve yönetmek için kullandığı yazılımdır. CV'ni metne çevirir ve işe alım ekibinin anahtar kelimelerle arama yapmasını sağlar.",
    },
    {
      question: "CV'min ATS uyumlu olup olmadığını nasıl anlarım?",
      answer:
        "PDF'indeki tüm metni seçip bir not defterine yapıştır. Metin doğru sırada, eksiksiz ve okunur geliyorsa, ayrıca standart bölüm başlıkları kullandıysan CV'n büyük ölçüde ATS uyumludur.",
    },
    {
      question: "ATS için PDF mi yoksa Word mü daha iyi?",
      answer:
        "Çoğu sistem ikisini de okur. İlan bir format belirtmiyorsa metin tabanlı bir PDF genellikle en güvenli seçimdir; taranmış görüntü PDF'lerden kaçın.",
    },
    {
      question: "İki sütunlu CV ATS'de sorun çıkarır mı?",
      answer:
        "Bazı sistemlerde sütunlardaki satırlar birbirine karışabilir. Tek sütun en güvenlisidir; iki sütun kullanacaksan deneyim ve eğitimi ana sütunda tut, tablo ve metin kutusu kullanma.",
    },
    {
      question: "ATS CV'mi otomatik olarak reddeder mi?",
      answer:
        "Bu, şirketin sistemi nasıl ayarladığına bağlıdır; bazıları ön eleme soruları kullanır. Çoğu durumda asıl risk otomatik ret değil, CV'nin yanlış okunması ya da aramalarda çıkmamasıdır.",
    },
  ],
  cta: {
    title: "ATS uyumlu CV'ni hemen oluştur",
    text: "ATS dostu şablonlarla CV'ni hazırla, İK kontrolüyle eksiklerini gör ve hesap açmadan ücretsiz PDF indir.",
    buttonLabel: "Ücretsiz CV oluştur",
  },
});
