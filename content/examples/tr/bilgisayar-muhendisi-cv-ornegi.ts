import { defineExample } from "../define";

export default defineExample({
  slug: "bilgisayar-muhendisi-cv-ornegi",
  title: "Bilgisayar Mühendisi CV Örneği",
  occupation: "Bilgisayar Mühendisi",
  category: "technology",
  experienceLevel: "entry",
  metaTitle: "Bilgisayar Mühendisi CV Örneği (Yeni Mezun)",
  metaDescription:
    "Staj, bitirme projesi ve kişisel projelerle yazılmış yeni mezun bilgisayar mühendisi CV örneği. Proje maddeleri ve yetkinlik ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Yeni mezun bilgisayar mühendislerini değerlendiren ekipler, uzun bir iş geçmişi beklemez; temel bilgisayar bilimi bilgisine, bitirdiği projelere ve öğrenme hızına bakar. Bu örnek, iki staj ve bir bitirme projesiyle başvuran bir mezunun deneyimini abartmadan tek sayfada nasıl güçlü gösterdiğini anlatıyor.",
    sections: [
      {
        heading: "Özet: hangi yöne gitmek istediğini söyle",
        body: "Yeni mezun özetinin en sık hatası, her alana açık görünmeye çalışmaktır. Bölümünü ve mezuniyet yılını yazdıktan sonra hangi alana yöneldiğini belirt: backend, mobil, gömülü sistemler, veri ya da siber güvenlik. Ardından bu yönü destekleyen en somut deneyimini ekle.\n\nÖrneğin: \"2026 Bilgisayar Mühendisliği mezunuyum; backend geliştirmeye yöneliyorum. Stajımda Spring Boot ile bir iç API geliştirdim, bitirme projemde de gerçek kullanıcılarla test edilmiş bir randevu sistemi kurdum.\" İki cümle, ilanı okuyan kişiye seni nereye yerleştireceğini söyler.",
      },
      {
        heading: "Staj ve projeleri iş gibi anlat",
        body: "Staj ve ders projeleri, yeni mezunun deneyim bölümüdür. Her birini bir iş deneyimi gibi yaz: ne geliştirdin, hangi teknolojiyle, kim kullandı ve ne öğrendin. Sayı vermek için büyük bir ölçek gerekmez; kullanıcı sayısı, test sayısı ya da kısalan bir süre de ölçüttür.\n\n- Zayıf: \"Stajımda yazılım ekibine destek verdim.\"\n- Güçlü: \"Stok sayım ekranı için Spring Boot ile 6 uç noktalı bir REST API yazdım; depo ekibi sayım sonuçlarını Excel yerine sistemden almaya başladı.\"\n\nYapmadığın işi büyütme. \"Mikroservis mimarisi tasarladım\" gibi bir cümle, mülakatın ilk sorusunu zorlaştırır; gerçekte yaptığın kısmı net ve dürüst anlatmak her zaman daha iyidir.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri diller, çatılar, veritabanları ve araçlar olarak grupla; yalnızca bir proje yaptığın ve anlatabileceğin teknolojileri yaz. Yeni mezun ilanlarında sık geçen ifadeler şunlardır: Java, C#, Python, JavaScript, SQL, nesne yönelimli programlama, veri yapıları ve algoritmalar, REST API, Git, Linux, Docker, birim testi, Agile/Scrum.\n\nBir dili \"ileri\" diye nitelendirmek yerine onunla ne yaptığını göster. Teknik mülakatlarda veri yapıları ve algoritma soruları hâlâ yaygındır; listede yer alan her konunun temelini tazelemiş olarak görüşmeye git.",
      },
      {
        heading: "GitHub, bitirme projesi ve yarışmalar",
        body: "İşe alım yapanlar yeni mezun CV'sindeki GitHub bağlantısına çoğu zaman tıklar. Profilinde iki üç iyi belgelenmiş proje bulunsun: README'de projenin amacı, ekran görüntüsü ve kurulum adımları yer alsın. Yarım kalmış ödev depolarını gizle ya da arşivle.\n\nBitirme projen bir araştırma desteği aldıysa, bir yarışmada derece yaptıysa ya da gerçek bir kurumda kullanıldıysa bunu açıkça yaz. Hackathon katılımları, öğrenci kulübü görevleri ve gönüllü eğitmenlik de takım çalışmasının somut kanıtıdır.",
      },
      {
        heading: "Eğitim, not ortalaması ve askerlik",
        body: "Yeni mezunda eğitim bölümü üstlerde yer alabilir. Üniversite, bölüm ve mezuniyet yılını yaz; not ortalaman 3,00'ın üzerindeyse ya da ilan istiyorsa ekle. Yurt dışı değişim programına katıldıysan veya ilgili seçmeli dersler aldıysan kısa bir satırda belirt.\n\nErkek adaylar askerlik durumunu açıkça yazmalı: tamamlandı, muaf ya da tecilli. Tecil varsa bitiş yılını eklemek, işverenin planlama yapmasını kolaylaştırır.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Lise bilgisini ve ilgisiz yarı zamanlı işleri uzun uzun yazmak.\n- Bir kez denediğin her aracı yetkinlik listesine eklemek.\n- Yetkinliklere yüzde çubukları ya da yıldızlar koymak.\n- Ders projesini adıyla bırakıp ne yaptığını anlatmamak.\n- CV'yi iki sayfaya uzatmak: yeni mezun için bir sayfa yeterlidir.",
      },
    ],
  },
  content: {
    settings: {
      template: "graduate",
      color: "#2563eb",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Mert Şahinoğlu",
      title: "Bilgisayar Mühendisi (Yeni Mezun)",
      email: "mert.sahinoglu@ornek.com",
      phone: "0500 000 00 00",
      location: "Sakarya",
      linkedin: "linkedin.com/in/mertsahinoglu-ornek",
      github: "github.com/mertsahinoglu-ornek",
      extras: [{ label: "Askerlik", value: "Muaf" }],
    },
    summary:
      "2026 yılında Sakarya Üniversitesi Bilgisayar Mühendisliği bölümünden mezun oldum; backend geliştirmeye yöneliyorum. Stajımda Spring Boot ile bir iç API geliştirdim, bitirme projemde de üç kişilik bir ekiple gerçek kullanıcılarla test edilen bir randevu sistemi kurdum. Java, SQL ve Git ile rahat çalışıyor; Docker ve birim testi konularında kendimi geliştiriyorum.",
    experience: [
      {
        position: "Yazılım Geliştirme Stajyeri",
        company: "Sapanca Endüstriyel Yazılım Ltd.",
        location: "Sakarya",
        start: "Tem 2025",
        end: "Ağu 2025",
        bullets: [
          "Depo stok sayım ekranı için Spring Boot ile 6 uç noktalı bir REST API yazdım; depo ekibi sayım sonuçlarını Excel yerine sistemden almaya başladı.",
          "Yazdığım servis katmanı için JUnit ile 40 birim testi ekledim; kod incelemelerinde gelen geri bildirimlere göre düzenlemeler yaptım.",
          "Ekibin günlük toplantılarına ve sprint değerlendirmelerine katılarak Scrum sürecini uygulamada gördüm.",
        ].join("\n"),
      },
      {
        position: "Bilgi İşlem Stajyeri",
        company: "Adapazarı Lojistik Hizmetleri A.Ş.",
        location: "Sakarya",
        start: "Tem 2024",
        end: "Ağu 2024",
        bullets: [
          "45 kullanıcılı ofiste bilgisayar kurulumu, ağ sorunları ve kullanıcı destek taleplerinde bilgi işlem ekibine yardımcı oldum.",
          "Envanter takibi için Python ile basit bir betik yazdım; donanım listesinin güncellenmesi **yarım günden 20 dakikaya** indi.",
          "Sık gelen 12 destek talebi için adım adım çözüm notları yazdım; notlar ekibin iç bilgi bankasına eklendi.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Klinik Randevu Sistemi (Bitirme Projesi)",
        role: "Backend geliştirici, 3 kişilik ekip",
        start: "2025",
        end: "2026",
        technologies: "Java, Spring Boot, PostgreSQL, React, Docker",
        link: "github.com/mertsahinoglu-ornek/randevu",
        description:
          "Bir diş kliniğinde 4 hafta boyunca pilot olarak kullanıldı; 300'ü aşkın randevu sistem üzerinden alındı. API, veritabanı tasarımı ve SMS hatırlatma entegrasyonu benim sorumluluğumdaydı. Proje, bölüm bitirme projeleri sergisinde ilk üçe seçildi.",
      },
      {
        name: "kampus-yemek",
        role: "Kişisel proje",
        start: "2024",
        technologies: "Kotlin, Firebase",
        link: "github.com/mertsahinoglu-ornek/kampus-yemek",
        description: "Yemekhane menüsünü gösteren Android uygulaması; dönem boyunca yaklaşık 900 öğrenci tarafından indirildi.",
      },
    ],
    skills: [
      { category: "Diller", items: "Java, SQL, Python, JavaScript, C" },
      { category: "Çatılar ve kütüphaneler", items: "Spring Boot, JUnit, React (temel)" },
      { category: "Veritabanı", items: "PostgreSQL, MySQL" },
      { category: "Araçlar", items: "Git, Docker, Linux, Postman, Jira" },
      { category: "Temel bilgi", items: "Veri yapıları ve algoritmalar, nesne yönelimli programlama, bilgisayar ağları" },
    ],
    education: [
      {
        school: "Sakarya Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2022",
        end: "2026",
        gpa: "3,21 / 4,00",
      },
    ],
    certifications: [],
    languages: [{ language: "İngilizce", level: "B2 – İyi" }],
    references: [],
    interests: "Bilgisayar topluluğu (etkinlik koordinatörü), satranç, bisiklet",
  },
});
