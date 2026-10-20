import { defineExample } from "../define";

export default defineExample({
  slug: "temizlik-gorevlisi-cv-ornegi",
  title: "Temizlik Görevlisi CV Örneği",
  occupation: "Temizlik Görevlisi",
  category: "hospitality",
  experienceLevel: "mid",
  metaTitle: "Temizlik Görevlisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Çalışılan alan, kimyasal kullanımı, makine bilgisi ve hijyen kurallarıyla yazılmış tek sayfalık temizlik görevlisi CV örneği. Ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Temizlik hizmeti veren bir firma ya da bir hastanenin destek hizmetleri sorumlusu, temizlik görevlisi CV'sinde hangi alanlarda çalıştığını, hangi makineleri kullanabildiğini ve hijyen kurallarını bilip bilmediğini arar. Bu örnek, ofis ve hastane temizliğinde 6 yıllık deneyimi olan bir görevlinin bunu tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Çalıştığın alanları adıyla yaz",
        body: "Temizlik işi çalışılan yere göre çok değişir: ofis, alışveriş merkezi, hastane, okul, fabrika, otel. Özette hangi alanlarda çalıştığını ve kaç yıllık deneyimin olduğunu yaz. Hastane ya da sağlık kuruluşunda çalıştıysan bunu özellikle belirt; enfeksiyon kontrolü kurallarını bilen birini bulmak işveren için önemlidir.\n\nTemizlik firmaları çoğu zaman personelini müşteri binalarına yerleştirir. Bu yüzden hangi firmada çalıştığın kadar hangi projede, yani hangi tür binada görev yaptığın da önemlidir. Deneyim bölümünde firma adının yanına \"Özel hastane projesi\" ya da \"AVM projesi\" gibi kısa bir açıklama eklemek, okuyanın deneyimini doğru değerlendirmesini sağlar. Aynı firmada farklı projelere geçtiysen bunları tek rol altında, ayrı maddelerle anlatabilirsin.",
      },
      {
        heading: "Makine ve kimyasal bilgisi",
        body: "Deneyimli bir temizlik görevlisini yeni başlayandan ayıran şey ekipman bilgisidir. Kullanabildiğin makineleri yaz: zemin yıkama makinesi, otomatik ovma makinesi, cila makinesi, endüstriyel süpürge, buharlı temizlik makinesi. Kimyasallarda dozaj ve seyreltme kurallarına uyduğunu, ürünlerin güvenlik bilgi formlarını okuyabildiğini ve farklı yüzeyler için doğru ürünü seçebildiğini belirt. Renk kodlu temizlik sistemi biliyorsan ekle; özellikle hastanelerde aranır.",
      },
      {
        heading: "Maddelerde alan, düzen ve sonuç",
        body: "Temizlik işinde de somut bilgi verebilirsin: sorumlu olduğun alan büyüklüğü, kat sayısı, vardiya düzeni, denetimden aldığın puan.\n\n- Zayıf: \"Ofis temizliği yaptım.\"\n- Güçlü: \"6 katlı ofis binasında 2 katın günlük temizliğinden sorumlu oldum; aylık hizmet denetimlerinde **ortalama 95 puan** aldık.\"\n\nYeni başlayanlara iş gösterdiysen ya da ekipte vardiya sorumluluğu üstlendiysen bunları ayrı maddelerde yaz. Hastanede taburcu sonrası oda hazırlığını ne kadar sürede tamamladığın, ofiste mesai başlamadan hangi alanları hazır ettiğin gibi bilgiler de işinin temposunu gösterir.",
      },
      {
        heading: "Eğitim ve belgeler",
        body: "Hijyen eğitimi ve iş sağlığı ve güvenliği eğitimi belgelerini sertifikalar bölümüne tarihleriyle ekle. Hastane temizliğinde aldığın enfeksiyon kontrolü ya da tıbbi atık eğitimi varsa yaz. Bazı firmalar mesleki yeterlilik belgesi ister; sende varsa belirt, yoksa uydurma bir belge adı yazma. Okul diplomanı da eğitim bölümüne ekle; ilkokul ya da ortaokul mezunu olmak bu iş için engel değildir, ancak boş bırakılmış bir eğitim bölümü okuyanda soru işareti bırakır. Firma içinde aldığın kimyasal güvenliği ya da makine kullanım eğitimlerini de yılıyla birlikte yazabilirsin.",
      },
      {
        heading: "Vardiya, ikamet ve güven",
        body: "Temizlik işleri çoğunlukla sabah erken, akşam ya da gece vardiyasında yapılır. Hangi vardiyalara uygun olduğunu ve oturduğun ilçeyi kişisel bilgilere ekle. Uzun süre aynı işyerinde çalışmak bu meslekte güven göstergesidir; işyerini değiştirmediğin yılları ve firmanın seni başka bir binaya ya da sorumluluğa geçirdiği durumları yazmaktan çekinme.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Çalıştığın alanı yazmadan yalnızca \"temizlik yaptım\" demek.\n- Makine ve kimyasal bilgisini atlamak.\n- Hastane deneyimini ve hijyen kurallarını öne çıkarmamak.\n- Vardiya uygunluğunu ve ikamet ilçesini belirtmemek.\n- CV'yi gereksiz uzatmak: tek sayfa yeterli.",
      },
    ],
  },
  content: {
    settings: {
      template: "compact",
      color: "#15803d",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Fatma Özkan",
      title: "Temizlik Görevlisi",
      email: "fatma.ozkan@ornek.com",
      phone: "0500 000 00 00",
      location: "Bornova, İzmir",
      extras: [{ label: "Vardiya", value: "Sabah ve akşam vardiyasına uygun" }],
    },
    summary:
      "Ofis ve hastane temizliğinde 6 yıllık deneyimi olan temizlik görevlisiyim. Zemin yıkama ve ovma makinelerini kullanıyor, kimyasalları doğru dozajla hazırlıyorum. Son 3 yıldır özel bir hastanede renk kodlu temizlik sistemi ve enfeksiyon kontrolü kurallarına göre çalışıyorum.",
    experience: [
      {
        position: "Temizlik Görevlisi",
        company: "Ege Tesis Hizmetleri A.Ş. – Özel hastane projesi",
        location: "Bornova, İzmir",
        start: "Eyl 2023",
        current: true,
        bullets: [
          "Poliklinik ve servis katlarında renk kodlu temizlik sistemine ve enfeksiyon kontrolü talimatlarına göre günlük temizlik yaptım.",
          "Hasta taburcu olduktan sonra oda dezenfeksiyonunu **45 dakika içinde** tamamlayıp odayı yeni hastaya hazırladım.",
          "Tıbbi atık ve evsel atık ayrımını kurallara uygun yaptım; iç denetimlerde **uygunsuzluk almadım**.",
          "Yeni başlayan 4 görevliye kimyasal dozajı ve makine kullanımını gösterdim.",
        ].join("\n"),
      },
      {
        position: "Temizlik Görevlisi",
        company: "Kordon Temizlik Hizmetleri Ltd. Şti. – Ofis binası projesi",
        location: "Konak, İzmir",
        start: "Mar 2020",
        end: "Ağu 2023",
        bullets: [
          "6 katlı ofis binasında 2 katın ofis, toplantı salonu, mutfak ve tuvalet temizliğinden sorumlu oldum.",
          "Akşam vardiyasında otomatik ovma makinesiyle lobi ve koridor zeminlerinin bakımını yaptım.",
          "Aylık hizmet denetimlerinde ekip olarak **ortalama 95 puan** aldık; 2022'de vardiya sorumlusu yardımcılığına getirildim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Alanlar", items: "Hastane ve poliklinik, ofis binası, ortak alanlar, ıslak hacimler" },
      { category: "Ekipman", items: "Zemin yıkama makinesi, otomatik ovma makinesi, cila makinesi, endüstriyel süpürge, buharlı temizlik makinesi" },
      { category: "Hijyen", items: "Renk kodlu temizlik sistemi, kimyasal dozaj ve seyreltme, enfeksiyon kontrolü, tıbbi atık ayrımı" },
    ],
    education: [
      {
        school: "İlköğretim Okulu",
        degree: "İlköğretim",
        location: "İzmir",
        end: "2008",
      },
    ],
    certifications: [
      { name: "Hijyen Eğitimi Belgesi", issuer: "Halk Eğitim Merkezi", date: "2023" },
      { name: "Temel İş Sağlığı ve Güvenliği Eğitimi", issuer: "Kurum içi eğitim", date: "2025" },
      { name: "Enfeksiyon Kontrolü ve Tıbbi Atık Eğitimi", issuer: "Hastane eğitim birimi", date: "2024" },
    ],
    references: [],
  },
});
