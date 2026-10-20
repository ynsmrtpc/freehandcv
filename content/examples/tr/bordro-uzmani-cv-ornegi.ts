import { defineExample } from "../define";

export default defineExample({
  slug: "bordro-uzmani-cv-ornegi",
  title: "Bordro Uzmanı CV Örneği",
  occupation: "Bordro Uzmanı",
  category: "administration",
  experienceLevel: "mid",
  metaTitle: "Bordro Uzmanı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "1.150 kişilik üretim şirketinde çalışan bordro uzmanı CV örneği. SGK bildirimleri, tazminat hesabı ve program ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "İnsan kaynakları ve finans yöneticileri bir bordro uzmanı CV'sinde önce kaç kişilik bordro yönettiğine, bordroyu ne kadar hatasız ve zamanında kapattığına ve hangi programlarla çalıştığına bakar. Bu örnek, bordro hizmeti veren bir bürodan üretim şirketine geçmiş 9 yıllık bir uzmanın bu bilgileri tek sayfada nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: bordro hacmini ve yapısını yaz",
        body: "Bordro uzmanlığında ilk sorulan, kaç çalışanın bordrosunu hazırladığındır. Ardından yapının karmaşıklığı gelir: vardiyalı üretim, sendikalı ve sendikasız personel, birden fazla işyeri, farklı ücret ve prim kalemleri. Özetinde bu bilgileri, şirket içinde mi yoksa hizmet veren bir büroda mı çalıştığını ve kullandığın programları yaz.\n\nÖrneğin: \"3 fabrikada çalışan yaklaşık 1.150 personelin vardiya primi, fazla mesai ve toplu iş sözleşmesi kalemlerini içeren bordrosunu hazırlıyorum.\" Bu cümle, okuyanın senin ölçeğini ve deneyim türünü hemen anlamasını sağlar.",
      },
      {
        heading: "Deneyim maddelerinde doğruluk ve zamanlama",
        body: "Bordroda başarı görünmezdir: hatasız ve zamanında kapanan bir bordro kimsenin dikkatini çekmez. Bu yüzden maddelerini ölçülebilir göstergelerle yaz: bordro düzeltme sayısı, bildirimlerin zamanında verilmesi, puantaj hatalarının azaltılması, teşvik kontrolüyle sağlanan maliyet avantajı.\n\n- Zayıf: \"Puantaj verilerini kontrol ettim.\"\n- Güçlü: \"PDKS verilerini bordro programına aktaran Excel kontrol şablonu kurdum; puantaj kaynaklı bordro düzeltmeleri **ayda ortalama 35'ten 8'e** indi.\"\n\nYılda kaç işten çıkış hesabı yaptığını, toplu iş sözleşmesi dönemlerinde fark bordrolarını nasıl hazırladığını da ekle.",
      },
      {
        heading: "Mevzuat ve hesaplama bilgisini somutlaştır",
        body: "\"İş ve SGK mevzuatına hakimim\" cümlesi mülakatta ilk sınanan iddiadır. Bunun yerine hangi hesapları yaptığını say: brütten nete ve netten brüte ücret hesabı, fazla mesai, kıdem ve ihbar tazminatı, yıllık izin ücreti, icra kesintisi, BES otomatik katılım kesintileri, asgari ücret istisnası. SGK prim teşviklerini kontrol ettiysen bunun yarattığı sonucu yaz; işverenler bu konuda deneyimli uzman arar.\n\nMevzuat sık değiştiğinden güncel kalmak için katıldığın eğitimleri yılıyla belirtmen de güven verir.\n\nYıl başı ve asgari ücret değişiklikleri gibi parametre güncellemelerini nasıl yönettiğini de anlat. Yeni dönem öncesinde test bordrosu çalıştırıyor, sonuçları bir önceki ayla karşılaştırıyor ve farkları açıklayan bir not hazırlıyorsan bunu bir madde olarak yaz; finans müdürleri bordronun sürprizsiz kapanmasına en çok bu hazırlıkla güvenir.",
      },
      {
        heading: "Programlar ve anahtar kelimeler",
        body: "Bordro ilanları çoğu zaman aday takip sistemiyle taranır ve program adları en çok aranan kelimeler arasındadır. Kullandığın bordro programlarını ve modüllerini ilandaki yazımıyla ver: Logo, Mikro, Netsis, SAP HCM gibi. PDKS ve puantaj sistemleri, SGK e-Bildirge, muhtasar ve prim hizmet beyannamesi, özlük dosyası yönetimi ve personel maliyet raporlaması da beceriler bölümünde yer almalı. Excel bilgini kullandığın özelliklerle yaz: pivot tablo, DÜŞEYARA, Power Query.",
      },
      {
        heading: "Eğitim ve sertifikalar",
        body: "Çalışma ekonomisi, işletme, iktisat ya da muhasebe eğitimini üniversite adıyla yaz. Bordro, iş hukuku ve sosyal güvenlik eğitimlerini düzenleyen kurum ve yılıyla listele; yalnızca katılım belgesi olan kısa seminerleri seçerek ekle. İnsan kaynakları tarafına geçmeyi düşünüyorsan özlük ve işe alım süreçlerindeki deneyimini ayrı bir maddeyle göster.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Çalışan maaşları, kişisel veriler ya da şirket personel maliyeti tutarlarını paylaşmak.\n- Bordro hacmini ve işyeri sayısını belirtmemek.\n- Mevzuat bilgisini genel bir cümleyle geçip yaptığın hesapları saymamak.\n- Programları seviye ve modül belirtmeden uzun bir liste halinde yazmak.\n- Erkek adaylarda askerlik durumunu atlamak: şirket içi ilanlarda sıkça sorulur.",
      },
    ],
  },
  content: {
    settings: {
      template: "compact",
      color: "#4338ca",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Fatih Esen",
      title: "Bordro Uzmanı",
      email: "fatih.esen@ornek.com",
      phone: "0500 000 00 00",
      location: "İzmir",
      linkedin: "linkedin.com/in/fatihesen-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "9 yıllık deneyime sahip bordro uzmanıyım. 4,5 yıl bordro hizmeti veren bir büroda farklı sektörlerden 25 firmanın bordrosunu, son 4,5 yıldır 3 fabrikası olan bir üretim şirketinde yaklaşık 1.150 personelin bordrosunu hazırlıyorum. Vardiya primi, fazla mesai, toplu iş sözleşmesi fark hesapları, kıdem ve ihbar tazminatı ile SGK bildirimleri ve prim teşviklerinde deneyimliyim.",
    experience: [
      {
        position: "Bordro Uzmanı",
        company: "Yamanlar Otomotiv Yan Sanayi A.Ş.",
        location: "İzmir",
        start: "Mar 2022",
        current: true,
        bullets: [
          "3 fabrikada çalışan yaklaşık 1.150 personelin aylık bordrosunu fazla mesai, vardiya primi ve yol-yemek yardımı hesaplarıyla birlikte hazırlıyorum.",
          "PDKS verilerini bordro programına aktaran Excel kontrol şablonu kurdum; puantaj kaynaklı bordro düzeltmeleri **ayda ortalama 35'ten 8'e** indi.",
          "SGK e-Bildirge, işe giriş ve çıkış bildirgeleri ile muhtasar ve prim hizmet beyannamesinin bordro tarafını hazırlıyorum; son 3 yılda **gecikme cezası oluşmadı**.",
          "SGK prim teşviklerinin uygunluğunu aylık kontrol eden bir liste hazırladım; daha önce uygulanmayan teşviklerle yıllık işveren prim maliyetinde **yaklaşık %4 tasarruf** sağlandı.",
          "Toplu iş sözleşmesi zammının 6 aylık geriye dönük fark bordrosunu hazırladım; yılda ortalama 180 işten çıkışın kıdem, ihbar ve izin ücreti hesabını yapıyorum.",
        ].join("\n"),
      },
      {
        position: "Bordro Uzman Yardımcısı",
        company: "Ilıca Mali Müşavirlik ve Bordro Hizmetleri",
        location: "İzmir",
        start: "Ağu 2017",
        end: "Şub 2022",
        bullets: [
          "Perakende, inşaat ve hizmet sektörlerinden 25 firmanın toplam yaklaşık 600 çalışanının aylık bordrosunu ve SGK bildirimlerini hazırladım.",
          "BES otomatik katılım kesintilerinin ve cayma işlemlerinin takibini firma bazında tek tabloda topladım.",
          "Müşteri firmalar için aylık personel maliyet raporu şablonu hazırladım; raporu talep eden firma sayısı **4'ten 15'e** çıktı.",
          "Özlük dosyaları için belge kontrol listesi oluşturdum; müşteri firmalarda yapılan SGK denetimlerinde **eksik belge tespit edilmedi**.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Bordro hesaplamaları",
        items:
          "Brüt-net ücret hesabı, fazla mesai, vardiya ve gece primi, kıdem ve ihbar tazminatı, yıllık izin ücreti, icra kesintisi, TİS fark bordrosu",
      },
      {
        category: "Bildirim ve mevzuat",
        items: "SGK e-Bildirge, işe giriş ve çıkış bildirgeleri, muhtasar ve prim hizmet beyannamesi, SGK prim teşvikleri, BES otomatik katılım, asgari ücret istisnası",
      },
      { category: "Programlar", items: "Logo bordro modülü, SAP HCM (bordro), PDKS, Excel (pivot tablo, DÜŞEYARA, Power Query)" },
      { category: "Raporlama", items: "Personel maliyet raporu, bütçe karşılaştırması, özlük dosyası yönetimi" },
    ],
    education: [
      {
        school: "Ankara Üniversitesi",
        field: "Çalışma Ekonomisi ve Endüstri İlişkileri",
        degree: "Lisans",
        start: "2013",
        end: "2017",
      },
    ],
    certifications: [
      { name: "Uygulamalı Bordro ve SGK Mevzuatı Eğitimi", issuer: "Mesleki eğitim programı", date: "2024" },
      { name: "İş Hukuku ve Tazminat Hesaplamaları Eğitimi", issuer: "Mesleki eğitim programı", date: "2021" },
    ],
    languages: [{ language: "İngilizce", level: "B1 – Orta" }],
    references: [],
    interests: "Masa tenisi, Ege'de bisiklet rotaları, satranç",
  },
});
