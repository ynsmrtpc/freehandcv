import { defineExample } from "../define";

export default defineExample({
  slug: "makine-ogrenmesi-muhendisi-cv-ornegi",
  title: "Makine Öğrenmesi Mühendisi CV Örneği",
  occupation: "Makine Öğrenmesi Mühendisi",
  category: "technology",
  experienceLevel: "senior",
  metaTitle: "Makine Öğrenmesi Mühendisi CV Örneği ve Rehber",
  metaDescription:
    "Model servisleme, MLOps ve ekip liderliğiyle yazılmış kıdemli makine öğrenmesi mühendisi CV örneği. Gecikme, maliyet ve sistem maddeleri için ipuçları.",
  guide: {
    intro:
      "Kıdemli makine öğrenmesi mühendisi arayan şirketler, model kurabilen birinden çok modeli güvenilir bir ürüne dönüştürebilen birini arar. Bu örnek, 10 yılda yazılım geliştirmeden öneri ve arama sistemlerine geçmiş, bugün bir ML platform ekibine liderlik eden bir mühendisin bu dönüşümü iki sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: sistem türü, ölçek ve liderlik",
        body: "Kıdemli rolde özet üç bilgiyi vermeli: hangi tür sistemler kurduğun (öneri, arama ve sıralama, dolandırıcılık tespiti, görüntü işleme, dil modelleri), bunların hangi ölçekte çalıştığı ve teknik liderlikte ne kadar sorumluluk aldığın. Toplam deneyimini ve ML'e özel deneyimini ayrı ayrı belirtmek, yazılım geçmişinden gelen adaylar için güçlü bir sinyaldir.\n\nÖrneğin: \"10 yıllık deneyimin 7 yılında üretimde çalışan ML sistemleri geliştirdim; şu an saniyede 3.000 isteğe yanıt veren öneri servisinden ve 5 kişilik ekipten sorumluyum.\"",
      },
      {
        heading: "Maddelerde hem model hem sistem metriği kullan",
        body: "Makine öğrenmesi mühendisinin başarısı iki katmanda ölçülür: modelin kalitesi (NDCG, recall, AUC) ve sistemin davranışı (gecikme, maliyet, erişilebilirlik, yeniden eğitim süresi). Kıdemli bir CV'de ikisi birlikte görünmeli; çünkü ilan sahibi, modeli üretimde sürdürülebilir kılabilecek birini arıyor.\n\n- Zayıf: \"Öneri modelini iyileştirdim.\"\n- Güçlü: \"İki aşamalı aday üretme ve sıralama mimarisine geçtim; tıklama oranı A/B testinde **%9** arttı, p99 gecikme **180 ms'den 70 ms'ye** indi.\"\n\nİş etkisini kontrollü bir deneyle ölçtüysen bunu söyle; ölçüm yöntemini bilmediğin bir sonucu yazma.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri modelleme, servisleme ve MLOps, veri altyapısı, bulut ve programlama olarak grupla. İlanlarda sık geçen ifadeler şunlardır: Python, PyTorch, TensorFlow, scikit-learn, öneri sistemleri, learning to rank, embedding, vektör arama, büyük dil modelleri (LLM), RAG, ince ayar (fine-tuning), MLflow, Kubeflow, feature store, model izleme, Triton, ONNX, Kubernetes, Spark, Kafka, AWS veya GCP.\n\nDil modelleri üzerine yeni çalışmaya başladıysan bunu dürüstçe ölçekle yaz: bir iç araç ya da pilot proje, üretimdeki bir sistemle aynı ağırlıkta anlatılmamalı.",
      },
      {
        heading: "Yayınlar, patentler ve konuşmalar",
        body: "Kıdemli adaylarda konferans bildirileri, patent başvuruları, teknik blog yazıları ve topluluk etkinliklerindeki konuşmalar ayrı bir bölümde yer alabilir. Her biri için başlık, yıl ve yayın türünü yaz; dergi ya da konferans adından emin değilsen genel ifade kullan. Bu bölüm, araştırma ağırlıklı ekiplerde ve uluslararası başvurularda ağırlık kazanır.\n\nBulut sağlayıcılarının makine öğrenmesi sertifikaları ilan bir bulut ortamı istiyorsa faydalıdır; ancak kıdemli seviyede üretim deneyiminin yerini tutmaz.",
      },
      {
        heading: "Teknik liderlik ve ekip katkısı",
        body: "Kıdemli rolde sorumluluk yalnızca kod değildir. Tasarım dokümanı yazma, mimari karar süreçlerini yürütme, model inceleme kuralları koyma, ürün ekipleriyle hedef metrikleri belirleme ve mühendis yetiştirme gibi işleri somut sayılarla anlat: kaç kişiyi mentorluk ettin, kaç ekibin kullandığı bir platform kurdun, hangi süreci standart hâle getirdin.\n\nVeri gizliliği, model adaleti (bias) ve açıklanabilirlik konularında bir süreç kurduysan bunu da bir maddede göster; birçok şirket bu konulara artık açıkça önem veriyor.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yalnızca model doğruluğunu yazmak: kıdemli rolde gecikme, maliyet ve bakım yükü de sorulur.\n- On yılın her işini aynı uzunlukta anlatmak: eski rollere iki üç madde yeter.\n- Her yeni kütüphaneyi listeye eklemek: üretimde kullandıklarını öne al.\n- Ekip başarılarını tek başına yapılmış gibi yazmak: rolünü ve ekip büyüklüğünü belirt.\n- Gizli veri, müşteri adı ya da iç metrik paylaşmak: oran ve göreli değişim kullan.",
      },
    ],
  },
  content: {
    settings: {
      template: "two-column",
      color: "#9333ea",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Can Erdoğdu",
      title: "Kıdemli Makine Öğrenmesi Mühendisi",
      email: "can.erdogdu@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/canerdogdu-ornek",
      github: "github.com/canerdogdu-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "10 yıllık yazılım deneyimimin son 7 yılında üretimde çalışan makine öğrenmesi sistemleri geliştiriyorum. Öneri, arama ve sıralama sistemleri ile bu sistemlerin servisleme ve MLOps altyapısında uzmanım. Şu an saniyede 3.000 isteğe yanıt veren öneri servisinden ve 5 kişilik ML platform ekibinden sorumluyum; son iki yılda müşteri destek süreçleri için dil modeli tabanlı araçların canlıya çıkışını yönettim.",
    experience: [
      {
        position: "Kıdemli Makine Öğrenmesi Mühendisi / Takım Lideri",
        company: "Pazaryeri Teknoloji A.Ş.",
        location: "İstanbul",
        start: "Mar 2022",
        current: true,
        bullets: [
          "Öneri sistemini iki aşamalı aday üretme ve sıralama mimarisine taşıdım; A/B testinde tıklama oranı **%9**, sepete ekleme oranı **%4** arttı.",
          "Sıralama modelini ONNX'e dönüştürüp Triton ile servisledim; p99 gecikme **180 ms'den 70 ms'ye** indi, çıkarım sunucusu maliyeti **%35** azaldı.",
          "Ortak feature store ve MLflow tabanlı model kayıt sürecini kurdum; 4 ürün ekibinin yeni modeli canlıya alma süresi **6 haftadan 2 haftaya** düştü.",
          "Destek temsilcileri için RAG tabanlı yanıt öneri aracının canlıya çıkışını yönettim; temsilcilerin ilk yanıt süresi ortalama **%22** kısaldı, insan onayı olmadan hiçbir yanıt gönderilmedi.",
          "5 kişilik ekibi yönetiyor, tasarım dokümanı ve model inceleme kurallarını belirliyor, 3 mühendise düzenli mentorluk yapıyorum.",
        ].join("\n"),
      },
      {
        position: "Makine Öğrenmesi Mühendisi",
        company: "Yolcu Seyahat Teknolojileri A.Ş.",
        location: "İstanbul",
        start: "Eyl 2019",
        end: "Şub 2022",
        bullets: [
          "Otel arama sonuçları için learning to rank modeli geliştirdim; arama başına rezervasyon oranı A/B testinde **%6** arttı.",
          "Embedding tabanlı benzer otel önerisini vektör aramayla kurdum; sistem günde yaklaşık 2 milyon öneri üretti.",
          "Model performansı ve veri kayması için izleme panelleri ve alarmlar ekledim; model bozulmalarının tespit süresi **haftalardan 1 güne** indi.",
          "Kafka akışlarından gerçek zamanlı özellik hesaplayan servisi Python ve Go ile yazdım.",
        ].join("\n"),
      },
      {
        position: "Yazılım Mühendisi",
        company: "Çağlayan Yazılım Ltd.",
        location: "İstanbul",
        start: "Tem 2016",
        end: "Ağu 2019",
        bullets: [
          "E-ticaret müşterileri için Java ile arama ve katalog servisleri geliştirdim.",
          "Ürün kategorilerini otomatik atayan ilk metin sınıflandırma modelini kurdum; elle kategori atama işi **%70** azaldı ve bu çalışma kariyerimi makine öğrenmesine yöneltti.",
          "Elasticsearch sorgularını yeniden düzenleyerek arama yanıt süresini yarıya indirdim.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Bildiri: Seyahat aramasında sıralama modellerinin çevrim dışı ve çevrim içi değerlendirmesi",
        role: "Birinci yazar",
        start: "2021",
        description: "Ulusal bir sinyal işleme ve yapay zekâ konferansında sunuldu.",
      },
      {
        name: "Konuşma: Öneri modellerini düşük gecikmeyle servislemek",
        role: "Konuşmacı",
        start: "2024",
        description: "Yerel bir makine öğrenmesi topluluğu buluşmasında yaklaşık 200 katılımcıya sunuldu.",
      },
    ],
    skills: [
      { category: "Modelleme", items: "Öneri sistemleri, learning to rank, embedding, metin sınıflandırma, LLM ve RAG uygulamaları" },
      { category: "Kütüphaneler", items: "PyTorch, scikit-learn, LightGBM, Hugging Face Transformers" },
      { category: "Servisleme ve MLOps", items: "Triton, ONNX, MLflow, Kubeflow, feature store, model izleme" },
      { category: "Veri ve altyapı", items: "Spark, Kafka, Elasticsearch, vektör veritabanları, Kubernetes, AWS" },
      { category: "Programlama", items: "Python, Go, Java, SQL" },
    ],
    education: [
      {
        school: "Boğaziçi Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Yüksek Lisans (Tezli)",
        start: "2016",
        end: "2019",
        description: "Tez: Kısa ürün açıklamalarında hiyerarşik kategori sınıflandırması",
      },
      {
        school: "İstanbul Teknik Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2011",
        end: "2016",
      },
    ],
    certifications: [
      { name: "Google Cloud Certified – Professional Machine Learning Engineer", issuer: "Google Cloud", date: "2023" },
    ],
    languages: [{ language: "İngilizce", level: "C1 – İleri" }],
    references: [],
    interests: "Go oyunu, uzun mesafe bisiklet, teknik kitap okuma grupları",
  },
});
