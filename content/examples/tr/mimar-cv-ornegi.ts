import { defineExample } from "../define";

export default defineExample({
  slug: "mimar-cv-ornegi",
  title: "Mimar CV Örneği",
  occupation: "Mimar",
  category: "engineering",
  experienceLevel: "mid",
  metaTitle: "Mimar CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Proje türü, ölçek ve sorumluluğu net anlatan mimar CV örneği. Ruhsat, uygulama projesi, Revit ve portfolyo ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Mimarlık ofislerinin kurucuları ve proje yöneticileri bir mimar CV'sinde önce hangi tür yapılarda, projenin hangi aşamasında ve ne kadar sorumlulukla çalıştığına bakar; ardından portfolyoya geçer. Bu örnek, konut ve karma kullanımlı projelerde 7 yıl çalışmış, konseptten uygulama projesine kadar proje yürütmüş bir mimarın bu bilgileri nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: yapı türü, aşama ve rol",
        body: "Mimarlıkta deneyim, yapı türü ve proje aşamasıyla anlatılır. Özetin ilk cümlesinde hangi tür projelerde çalıştığını (konut, ofis, karma kullanım, eğitim yapısı, iç mimari, restorasyon) ve hangi aşamalarda güçlü olduğunu yaz: konsept, avan, ruhsat projesi, uygulama projesi, detay ya da şantiye koordinasyonu.\n\nArdından rolünü belirt: tasarım ekibinde mimar mısın, yoksa bir projenin sorumlu mimarı ya da proje koordinatörü müsün? Bu ayrım, ofisin seni hangi ekibe ve hangi ücret bandına yerleştireceğini belirler.",
      },
      {
        heading: "Projeleri ölçek ve sorumlulukla yaz",
        body: "Mimarlıkta rakamlar çoğu zaman ölçeği anlatır: inşaat alanı, blok ya da bağımsız bölüm sayısı, proje süresi, ekip büyüklüğü. Her maddede hangi projede, hangi aşamada ve neyi üstlendiğini yaz; mümkünse süreç sonucunu ekle: ruhsatın ilk başvuruda onaylanması, revizyon sayısının azalması, şantiyeden gelen soruların düşmesi.\n\n- Zayıf: \"Konut projelerinde çizim yaptım.\"\n- Güçlü: \"3 blok, 186 konutluk projenin ruhsat projesini Revit'te hazırlayıp belediye onay sürecini yürüttüm; proje **ilk başvuruda** onaylandı.\"\n\nOfisin adına yapılmış bir projede kendi katkını abartma; \"ekip içinde cephe tasarımından sorumluydum\" gibi net bir ifade daha güven verir.",
      },
      {
        heading: "Yazılım ve teknik yetkinlikler",
        body: "Yetkinlikleri çizim ve BIM, modelleme ve görselleştirme, sunum olarak grupla. AutoCAD neredeyse her ilanda istenir; Revit ve BIM deneyimi ise orta ve büyük ölçekli ofislerde giderek ön koşul haline geliyor. SketchUp, Rhino, Lumion, Enscape, V-Ray ve Adobe Photoshop, InDesign gibi araçları seviyeleriyle ver.\n\nYazılım listesinin yanında mesleki bilgini de anlat: imar mevzuatı ve yönetmeliklere hâkimiyet, belediye ruhsat süreçleri, yangın ve otopark gibi teknik gerekliliklerin projeye işlenmesi, disiplinler arası koordinasyon (statik, mekanik, elektrik projeleri) ve metraj. Bu bilgiler, yalnızca güzel görsel üreten adaylardan seni ayırır.",
      },
      {
        heading: "Portfolyo ve yarışmalar",
        body: "Mimar CV'si portfolyosuz eksik kalır. CV'de portfolyo bağlantısını kişisel bilgilerin içinde ver ve bağlantının herkese açık çalıştığından emin ol. Portfolyoda her projenin adını, yılını, aşamasını ve senin rolünü belirt; ofise ait projeleri paylaşmadan önce izin al ya da gizli bilgileri çıkar.\n\nMimari proje yarışmalarında ödül, mansiyon ya da satın alma aldıysan ayrı bir satırda yazabilirsin; derece almadığın yarışmalar da tasarım yaklaşımını göstermek için portfolyoda yer alabilir.",
      },
      {
        heading: "Oda üyeliği, eğitim ve dil",
        body: "Mimarlar Odası üyeliği, ruhsat projelerinde imza yetkisi ve meslekte resmi tanınırlık açısından önemlidir; üye olduğun şubeyi kişisel bilgilere yaz. Lisans ve varsa yüksek lisans bilgisini okul, bölüm ve yılla ver; tez ya da bitirme projen başvurduğun alanla ilgiliyse kısa bir açıklama ekle.\n\nYurt dışı projeler yürüten ofislere başvuruyorsan İngilizce seviyeni ve yabancı danışmanlarla yürüttüğün yazışma ve toplantı deneyimini belirt. Erkek adaylar askerlik durumunu eklemelidir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Portfolyo bağlantısı vermemek ya da çalışmayan bir bağlantı vermek.\n- Proje aşamasını ve rolünü belirtmeden yalnızca proje adlarını sıralamak.\n- Ekip projelerini tek başına yapılmış gibi göstermek.\n- Yazılımları seviye ayrımı olmadan uzun bir liste halinde vermek.\n- CV'yi görsel olarak aşırı süslemek: sade ve düzenli bir CV, tasarım becerisini en iyi gösteren belgedir.",
      },
    ],
  },
  content: {
    settings: {
      template: "boutique",
      color: "#78350f",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Mert Aksoylu",
      title: "Mimar",
      email: "mert.aksoylu@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/mertaksoylu-ornek",
      web: "ornek.com/mertaksoylu-portfolyo",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Meslek odası", value: "Mimarlar Odası İstanbul Büyükkent Şubesi üyesi" },
      ],
    },
    summary:
      "Konut ve karma kullanımlı projelerde 7 yıllık deneyime sahip mimarım. Konsept ve avan projeden ruhsat ve uygulama projesine kadar tüm aşamalarda çalıştım; son üç yıldır orta ölçekli bir mimarlık ofisinde proje sorumlusu olarak 5 kişilik ekiple projeleri yürütüyorum. Revit ile BIM tabanlı proje üretimi, belediye ruhsat süreçleri ve disiplinler arası koordinasyon konularında deneyimliyim.",
    experience: [
      {
        position: "Proje Sorumlusu Mimar",
        company: "Çizgi ve Mekân Mimarlık Ltd. Şti.",
        location: "İstanbul",
        start: "Eyl 2023",
        current: true,
        bullets: [
          "3 blok, 186 konutluk ve 28.000 m² inşaat alanlı projenin ruhsat projesini Revit'te hazırlayıp belediye onay sürecini yürüttüm; proje **ilk başvuruda** onaylandı.",
          "Karma kullanımlı bir ofis–ticaret yapısının uygulama projesi ve sistem detaylarını 5 kişilik ekiple hazırladım; şantiyeden gelen bilgi talebi sayısı önceki projeye göre **%40** azaldı.",
          "Statik, mekanik ve elektrik proje ekipleriyle Revit modeli üzerinden haftalık koordinasyon toplantıları düzenledim; çakışma kontrolüyle **120'den fazla** sorunu şantiyeye inmeden çözdük.",
          "Ofisin Revit şablonunu ve aile kütüphanesini düzenleyerek yeni projelerde model kurulum süresini **yaklaşık yarıya** indirdim.",
        ].join("\n"),
      },
      {
        position: "Mimar",
        company: "Atölye Kuzey Mimarlık",
        location: "İstanbul",
        start: "Eki 2019",
        end: "Ağu 2023",
        bullets: [
          "Villa, apartman ve küçük ölçekli ticari yapılardan oluşan 14 projede konsept, avan ve ruhsat aşamalarında çalıştım.",
          "SketchUp ve Lumion ile müşteri sunumları için görselleştirme ve animasyonlar hazırladım; 6 projede ilk sunumda tasarım onayı alındı.",
          "Bir konut projesinin şantiye sürecinde mimari kontrolleri ve imalat detaylarının yerinde çözümünü yürüttüm.",
          "Ekip içinde bir ulusal mimari proje yarışmasına katıldık; proje **mansiyon** aldı.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Çizim ve BIM", items: "AutoCAD, Revit (ileri), çakışma kontrolü, metraj" },
      { category: "Modelleme ve görselleştirme", items: "SketchUp, Rhino (temel), Lumion, Enscape" },
      { category: "Sunum", items: "Adobe Photoshop, InDesign, Illustrator" },
      { category: "Mesleki bilgi", items: "Ruhsat projesi, uygulama projesi ve detay, imar mevzuatı ve yönetmelikler, belediye onay süreçleri, disiplinler arası koordinasyon" },
    ],
    education: [
      {
        school: "Mimar Sinan Güzel Sanatlar Üniversitesi",
        field: "Mimarlık",
        degree: "Lisans",
        start: "2015",
        end: "2019",
      },
    ],
    certifications: [
      { name: "Revit ile BIM Proje Yönetimi Eğitimi", issuer: "Bağımsız eğitim kuruluşu", date: "2022" },
    ],
    languages: [
      { language: "İngilizce", level: "B2 – İyi" },
      { language: "İtalyanca", level: "A2 – Temel" },
    ],
    references: [],
    interests: "Mimari fotoğraf, eskiz defteri tutma, kent yürüyüşleri",
  },
});
