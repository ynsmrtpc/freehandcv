import { defineExample } from "../define";

export default defineExample({
  slug: "veri-analisti-cv-ornegi",
  title: "Veri Analisti CV Örneği",
  occupation: "Veri Analisti",
  category: "technology",
  experienceLevel: "entry",
  metaTitle: "Veri Analisti CV Örneği (Yeni Mezun) ve Rehber",
  metaDescription:
    "Staj ve projelerle yazılmış yeni mezun veri analisti CV örneği. SQL, Python, Power BI yetkinlikleri ve proje maddeleri için ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Veri analisti ilanlarına başvuran yeni mezunlardan beklenen, iş deneyiminden çok bir veri setini alıp soru sorabilmek, temizleyebilmek ve sonucu anlaşılır bir şekilde sunabilmektir. Bu örnek, bir staj ve iki projeyle başvuran bir istatistik mezununun bunu tek sayfada nasıl kanıtladığını gösteriyor.",
    sections: [
      {
        heading: "Özet: hangi soruları cevaplayabildiğini yaz",
        body: "Yeni mezun özetinde \"veriye meraklı, analitik düşünen\" gibi ifadeler yerine hangi araçlarla hangi tür analiz yaptığını yaz. Bölümünü, kullandığın üç dört aracı ve en somut deneyimini tek paragrafta topla.\n\nÖrneğin: \"İstatistik mezunuyum; SQL ve Python ile satış verisini temizleyip Power BI'da haftalık rapora dönüştürdüğüm 3 aylık bir stajım var.\" Bu cümle, ilanı okuyan kişinin aradığı üç anahtar kelimeyi ve bir kanıtı aynı anda verir.",
      },
      {
        heading: "Staj ve proje maddelerini analiz akışıyla anlat",
        body: "Deneyimin az olduğunda her maddeyi bir analiz hikâyesi gibi yaz: hangi veri, hangi yöntem, hangi bulgu ve bu bulgu kime ne kazandırdı. Rakam vermek için büyük bir şirkette çalışmış olman gerekmez; satır sayısı, rapor sıklığı ya da kazanılan zaman da ölçüttür.\n\n- Zayıf: \"Excel'de raporlar hazırladım.\"\n- Güçlü: \"Elle hazırlanan haftalık satış raporunu SQL sorguları ve Power BI ile otomatikleştirdim; raporlama süresi **4 saatten 20 dakikaya** indi.\"\n\nBitirme projesi, Kaggle çalışması veya ders projesi de bu bölüme girer; ama \"ödev\" gibi değil, gerçek bir iş sorusu gibi anlat.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Veri analisti ilanlarında en sık geçen kelimeler SQL, Python (pandas, NumPy), Excel (pivot tablo, XLOOKUP), Power BI veya Tableau, istatistiksel analiz, A/B testi, veri temizleme ve veri görselleştirmedir. Bunları \"Sorgu ve programlama\", \"Raporlama\", \"İstatistik\" başlıkları altında grupla.\n\nSQL seviyeni somutlaştır: JOIN, alt sorgu, pencere fonksiyonları (window functions) ve CTE kullanabiliyorsan yaz. İşe alım yapanlar mülakatta en çok SQL sorusu sorar. Teknik bir ön eleme varsa genellikle bir veri seti üzerinde kısa bir vaka çalışması istenir; CV'ndeki her aracın bu vakada kullanılabilecek düzeyde olduğundan emin ol.",
      },
      {
        heading: "Sertifika ve çevrim içi eğitimler",
        body: "Yeni mezunlar için çevrim içi sertifikalar, kendi kendine öğrenebildiğini gösterir; ama iş deneyiminin yerini tutmaz. Google Data Analytics Professional Certificate veya Microsoft'un Power BI Data Analyst Associate sertifikası gibi tanınan programları tarihiyle yaz. Tamamladığın her kısa kursu listelemek yerine ilanla ilgili iki üçünü seç.",
      },
      {
        heading: "Portfolyo: bir bağlantı, iki iyi proje",
        body: "GitHub'da ya da Tableau Public gibi bir platformda iki iyi belgelenmiş proje, on yarım kalmış projeden daha etkilidir. Her projede sorunun ne olduğunu, veri kaynağını, kullandığın yöntemi ve vardığın sonucu kısa bir README ile açıkla. Not defterlerinde (Jupyter) hata vermeyen, baştan sona çalışan bir akış bırak; işe alım yapanlar dosyayı açtığında ilk hücreden hata görmemeli.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Makine öğrenmesi algoritmalarını uzun bir liste hâlinde yazmak: veri analisti rolünde önce SQL, raporlama ve iş sorusu aranır.\n- Dashboard ekran görüntülerini CV'ye eklemek: bağlantı ver, görseli portfolyoda göster.\n- Sonucu yazmadan yalnızca yöntemi anlatmak: \"regresyon modeli kurdum\" yerine modelin neyi açıkladığını söyle.\n- Gizli staj verisini paylaşmak: müşteri adı ve gerçek ciro yerine oran kullan.\n- Not ortalamasını düşükse yazmak: zorunlu değil, ilan istiyorsa ekle.",
      },
    ],
  },
  content: {
    settings: {
      template: "graduate",
      color: "#0e7490",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Elif Sarıgül",
      title: "Veri Analisti",
      email: "elif.sarigul@ornek.com",
      phone: "0500 000 00 00",
      location: "Ankara",
      linkedin: "linkedin.com/in/elifsarigul-ornek",
      github: "github.com/elifsarigul-ornek",
    },
    summary:
      "Hacettepe Üniversitesi İstatistik bölümü mezunuyum. SQL ve Python ile veri temizleme, keşifsel analiz ve Power BI raporlama üzerine 3 aylık bir staj ve iki kapsamlı projem var. Satış ve müşteri verisinden iş birimlerinin kullanabileceği düzenli raporlar ve sade bulgular üretmeyi hedefliyorum.",
    experience: [
      {
        position: "Veri Analizi Stajyeri",
        company: "Kervan E-Ticaret A.Ş.",
        location: "Ankara",
        start: "Tem 2025",
        end: "Eyl 2025",
        bullets: [
          "Elle hazırlanan haftalık satış raporunu SQL sorguları ve Power BI ile otomatikleştirdim; raporlama süresi **4 saatten 20 dakikaya** indi.",
          "Yaklaşık 250 bin satırlık sipariş verisinde mükerrer ve eksik kayıtları Python (pandas) ile temizleyerek kategori bazlı iade analizini hazırladım.",
          "İade oranı en yüksek 3 ürün kategorisinde iade nedenlerini sınıflandırdım; bulgular ürün sayfası açıklamalarının güncellenmesinde kullanıldı.",
        ].join("\n"),
      },
      {
        position: "Öğrenci Asistanı (Yarı Zamanlı)",
        company: "Üniversite İstatistik Bölümü",
        location: "Ankara",
        start: "Eki 2024",
        end: "Haz 2025",
        bullets: [
          "Olasılık dersinin R uygulama saatlerinde 30 kişilik gruplara yardımcı oldum; haftalık ödevlerin ön kontrolünü yaptım.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Müşteri Kaybı (Churn) Analizi — Bitirme Projesi",
        role: "Proje ekibi (3 kişi)",
        start: "2025",
        technologies: "Python, pandas, scikit-learn, Power BI",
        link: "github.com/elifsarigul-ornek/churn-analizi",
        description:
          "Açık bir telekom veri setinde lojistik regresyonla müşteri kaybını etkileyen değişkenleri inceledik; sözleşme türü ve ilk 6 ay içindeki şikâyet sayısının en güçlü belirleyiciler olduğunu gösterdik. Bölüm proje gününde ilk üç arasına seçildi.",
      },
      {
        name: "İstanbul Hava Kalitesi Panosu",
        role: "Bireysel proje",
        start: "2024",
        technologies: "SQL, Tableau Public",
        link: "github.com/elifsarigul-ornek/hava-kalitesi",
        description:
          "Açık veri portalından alınan 3 yıllık ölçümleri temizleyip ilçe ve mevsim bazında karşılaştıran etkileşimli bir pano hazırladım.",
      },
    ],
    skills: [
      { category: "Sorgu ve programlama", items: "SQL (JOIN, CTE, pencere fonksiyonları), Python (pandas, NumPy, Matplotlib), R" },
      { category: "Raporlama", items: "Power BI (DAX temel), Tableau, Excel (pivot tablo, XLOOKUP, Power Query)" },
      { category: "İstatistik", items: "Hipotez testleri, regresyon analizi, A/B testi temelleri, örnekleme" },
    ],
    education: [
      {
        school: "Hacettepe Üniversitesi",
        field: "İstatistik",
        degree: "Lisans",
        start: "2021",
        end: "2025",
        gpa: "3,21 / 4,00",
      },
    ],
    certifications: [
      { name: "Google Data Analytics Professional Certificate", issuer: "Google (Coursera)", date: "2025" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – Orta üstü" }],
    references: [],
    interests: "Veri görselleştirme blogları, satranç, kamp",
  },
});
