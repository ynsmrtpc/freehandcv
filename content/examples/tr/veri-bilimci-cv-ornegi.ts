import { defineExample } from "../define";

export default defineExample({
  slug: "veri-bilimci-cv-ornegi",
  title: "Veri Bilimci CV Örneği",
  occupation: "Veri Bilimci",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "Veri Bilimci CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Tahmin modelleri ve A/B testleriyle yazılmış veri bilimci CV örneği. Model sonuçlarını iş etkisiyle anlatma ve yetkinlik ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Veri bilimi ekiplerinin yöneticileri bir CV'de önce hangi iş problemini çözdüğüne, ardından hangi yöntemi seçtiğine ve modelin canlıya çıkıp çıkmadığına bakar. Bu örnek, perakende ve telekom alanlarında 5 yıl çalışmış bir veri bilimcinin model sonuçlarını iş diline nasıl çevirdiğini gösteriyor.",
    sections: [
      {
        heading: "Özet: problem türü ve alan bilgisi",
        body: "Veri bilimci özetinde algoritma adlarından önce çalıştığın problem türünü yaz: talep tahmini, müşteri kaybı (churn) tahmini, fiyatlama, öneri sistemleri, dolandırıcılık tespiti ya da deney tasarımı. Hangi sektörde çalıştığını da belirt; perakendede mevsimsellik, bankacılıkta düzenleme, telekomda abone davranışı farklı bilgi ister.\n\nÖrneğin: \"5 yıldır perakende ve telekom şirketlerinde talep tahmini ve müşteri kaybı modelleri geliştiriyorum; modellerimin üçü canlı ortamda karar süreçlerinde kullanılıyor.\" Canlıda kullanılan model sayısı, bu meslekte en çok merak edilen bilgilerden biridir.",
      },
      {
        heading: "Model sonucunu iş etkisine çevir",
        body: "AUC, RMSE ya da MAPE gibi metrikler teknik okuyucu için önemlidir; ama işe alım sürecinde CV'yi ilk okuyan kişi çoğu zaman modelin şirkete ne kazandırdığını arar. En iyi madde ikisini birlikte verir: model metriği ve iş sonucu.\n\n- Zayıf: \"Churn tahmin modeli geliştirdim.\"\n- Güçlü: \"Gradient boosting tabanlı churn modelini kampanya hedeflemesine bağladım; hedeflenen grupta 3 aylık abone kaybı kontrol grubuna göre **%11** daha düşük çıktı.\"\n\nİş sonucunu bir A/B testi ya da kontrol grubuyla ölçtüysen bunu belirt. Ölçülmemiş bir etkiyi \"tahmini katkı\" olarak bile yazma; mülakatta nasıl hesaplandığı mutlaka sorulur.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri programlama, modelleme, istatistik ve deney tasarımı, veri altyapısı ve görselleştirme olarak grupla. İlanlarda sık geçen ifadeler şunlardır: Python, pandas, NumPy, scikit-learn, XGBoost, LightGBM, SQL, Spark, zaman serisi, sınıflandırma, regresyon, kümeleme, A/B testi, hipotez testi, özellik mühendisliği, MLflow, Airflow, Docker, Tableau veya Power BI.\n\nDerin öğrenme kütüphanelerini yalnızca gerçekten kullandıysan ekle. Veri bilimi ilanlarının çoğu tablo verisiyle çalışmayı, temiz SQL yazmayı ve sonucu açıklayabilmeyi ilk sıraya koyar.",
      },
      {
        heading: "Projeler, yayınlar ve yarışmalar",
        body: "Şirket çalışmalarını ayrıntısıyla paylaşamıyorsan GitHub'da baştan sona çalışan bir proje göster: veri kaynağı, sorulan soru, yöntem, doğrulama yaklaşımı ve sonuç README'de açıkça yazsın. Kaggle yarışmalarında üst sıralara girdiysen yüzdelik dilimi ver; yalnızca katılım, deneyimli adaylarda fazla bir şey anlatmaz.\n\nYüksek lisans tezin ya da bir konferans bildirin varsa ayrı bir satırda başlığıyla yaz. Akademik çalışma, özellikle araştırma ağırlıklı ekiplerde ayırt edicidir.",
      },
      {
        heading: "Modelin canlıya çıkışını anlat",
        body: "Bir not defterinde kalan modelle karar sürecine bağlanmış model arasındaki fark, orta seviye veri bilimcide en çok sorgulanan konudur. Modelin nasıl canlıya alındığını (toplu skorlama, API, raporlama aracına aktarım), performansının nasıl izlendiğini ve veri kayması fark edildiğinde ne yaptığını bir iki maddede yaz.\n\nBu işi bir makine öğrenmesi mühendisiyle birlikte yaptıysan rolünü net belirt; tek başına yapmış gibi anlatmak mülakatta kolayca ortaya çıkar.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yalnızca algoritma adlarını saymak: problemi ve sonucu yazmadan liste bilgi vermez.\n- Metriği bağlamsız vermek: \"%92 doğruluk\" sınıf dağılımı bilinmeden anlam taşımaz.\n- Müşteri verisini ya da iç rakamları açık etmek: oran ve göreli değişim kullan.\n- Her kursu ve sertifikayı listelemek: ilanla ilgili iki üçünü seç.\n- Sonucu iletişim boyutuyla anlatmamak: bulguları hangi ekiple, hangi kararda paylaştığını yaz.",
      },
    ],
  },
  content: {
    settings: {
      template: "swiss",
      color: "#7c3aed",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Zeynep Kocabaş",
      title: "Veri Bilimci",
      email: "zeynep.kocabas@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/zeynepkocabas-ornek",
      github: "github.com/zeynepkocabas-ornek",
    },
    summary:
      "5 yıldır perakende ve telekom şirketlerinde talep tahmini, müşteri kaybı ve kampanya etkisi ölçümü üzerine çalışan veri bilimciyim. Python, SQL ve Spark ile veri hazırlığından modelin canlıya alınmasına ve A/B testleriyle değerlendirilmesine kadar süreci yürütüyorum. Geliştirdiğim modellerin üçü bugün stok ve kampanya kararlarında düzenli olarak kullanılıyor.",
    experience: [
      {
        position: "Veri Bilimci",
        company: "Anadolu Çarşı Perakende A.Ş.",
        location: "İstanbul",
        start: "Eyl 2023",
        current: true,
        bullets: [
          "420 mağaza ve yaklaşık 8.000 ürün için LightGBM tabanlı haftalık talep tahmini modeli geliştirdim; tahmin hatası (MAPE) önceki yönteme göre **%31'den %19'a** indi.",
          "Tahminleri otomatik sipariş önerisine bağlayan akışı veri mühendisleriyle kurdum; pilot bölgede stoksuz kalan ürün oranı **%7,5'ten %4,8'e** düştü.",
          "Kampanya etkisini ölçmek için mağaza bazlı A/B test ve fark-içinde-fark (difference-in-differences) analiz şablonunu hazırladım; pazarlama ekibi 2025'te 14 kampanyayı bu yöntemle değerlendirdi.",
          "MLflow ile model sürümlerini ve Airflow ile haftalık yeniden eğitim akışını düzenledim; model güncelleme süresi **2 günden yarım güne** indi.",
        ].join("\n"),
      },
      {
        position: "Veri Bilimci",
        company: "Hatboyu İletişim Hizmetleri A.Ş.",
        location: "İstanbul",
        start: "Tem 2021",
        end: "Ağu 2023",
        bullets: [
          "Faturalı aboneler için gradient boosting tabanlı churn modeli geliştirdim; kampanya hedeflemesinde kullanılan grupta 3 aylık abone kaybı kontrol grubuna göre **%11** daha düşük çıktı.",
          "Şikâyet kayıtlarından konu sınıflandırması yapan metin modelini çağrı merkezi raporlarına ekledim; elle etiketleme ihtiyacı **%60** azaldı.",
          "Model sonuçlarını iş birimlerine aylık sunumlarla anlattım; Tableau'da segment bazlı izleme paneli hazırladım.",
        ].join("\n"),
      },
      {
        position: "Veri Analisti",
        company: "Lale Pazar Araştırma Ltd.",
        location: "İstanbul",
        start: "Şub 2020",
        end: "Haz 2021",
        bullets: [
          "Anket verilerini Python ve R ile temizleyip ağırlıklandırdım; müşteri raporlarının hazırlık süresini **%40** kısalttım.",
          "Kümeleme analiziyle 3 müşteri projesinde tüketici segmentleri oluşturdum.",
          "Tekrarlanan SQL sorgularını ortak bir sorgu kütüphanesinde topladım; ekipteki 5 analistin aynı tanımlarla rapor üretmesini sağladım.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Yüksek lisans tezi",
        role: "Araştırmacı",
        start: "2021",
        technologies: "Python, statsmodels, Prophet",
        description:
          "Perakende satış verisinde tatil ve kampanya etkilerini içeren zaman serisi modellerinin karşılaştırılması.",
      },
    ],
    skills: [
      { category: "Programlama", items: "Python (pandas, NumPy, scikit-learn), SQL, PySpark, R" },
      { category: "Modelleme", items: "LightGBM, XGBoost, zaman serisi tahmini, sınıflandırma, kümeleme, temel NLP" },
      { category: "İstatistik ve deney", items: "A/B testi, hipotez testleri, fark-içinde-fark, güç analizi" },
      { category: "MLOps ve veri", items: "MLflow, Airflow, Docker, Git, BigQuery" },
      { category: "Görselleştirme", items: "Tableau, Matplotlib, Plotly" },
    ],
    education: [
      {
        school: "Marmara Üniversitesi",
        field: "Ekonometri",
        degree: "Yüksek Lisans (Tezli)",
        start: "2019",
        end: "2021",
      },
      {
        school: "Marmara Üniversitesi",
        field: "Ekonometri",
        degree: "Lisans",
        start: "2015",
        end: "2019",
      },
    ],
    certifications: [],
    languages: [{ language: "İngilizce", level: "C1 – İleri" }],
    references: [],
    interests: "Veri gazeteciliği, koşu, bulmaca",
  },
});
