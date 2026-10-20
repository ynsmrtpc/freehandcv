import { defineExample } from "../define";

export default defineExample({
  slug: "garson-cv-ornegi",
  title: "Garson CV Örneği",
  occupation: "Garson",
  category: "hospitality",
  experienceLevel: "entry",
  metaTitle: "Garson CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Sezonluk ve yarı zamanlı deneyimi tek sayfada anlatan garson CV örneği. Servis türleri, dil ve hijyen belgesi ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Restoran ve otel yöneticileri garson CV'sinde uzun bir kariyer değil; hangi tür serviste çalıştığını, yoğun saatlerde ne kadar masaya baktığını ve hangi vardiyalara uyabildiğini görmek ister. Bu örnek, bir sezonluk otel deneyimi ve yarı zamanlı kafe işi olan genç bir garsonun bunları tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: iki cümle yeterli",
        body: "Garson CV'sinde özet kısa olmalı. İlk cümlede kaç sezon ya da kaç aydır servis yaptığını ve hangi ortamda çalıştığını (otel restoranı, a la carte restoran, kafe, banket) yaz. İkinci cümlede işverenin en çok merak ettiği bilgileri ver: konuşabildiğin yabancı diller, hafta sonu ve gece vardiyasına uygunluğun, sezonluk ya da kadrolu çalışmak isteyip istemediğin.\n\nDeneyimin azsa bunu saklamaya çalışma; öğrenmeye açık olduğunu \"çalışkanım\" diye değil, aldığın eğitimle ve kısa sürede üstlendiğin sorumlulukla göster.",
      },
      {
        heading: "Servis deneyimini somut anlat",
        body: "Garsonlukta rakam, satış kadar belirgin olmasa da vardır: baktığın masa sayısı, bir öğünde servis verilen kişi sayısı, çalıştığın vardiya düzeni. Bunlar işverenin seni hangi bölüme koyabileceğini anlamasını sağlar. Servis türlerini de adıyla yaz: açık büfe, a la carte, oda servisi, banket, bar servisi.\n\n- Zayıf: \"Otel restoranında garsonluk yaptım.\"\n- Güçlü: \"A la carte restoranda akşam servisinde 10 masalık bölüme baktım; masa başı şarap ve tatlı önerileriyle **ek sipariş** aldım.\"\n\nŞikâyeti çözdüğün, yeni gelen birine işi gösterdiğin ya da kasa kapanışına yardım ettiğin durumlar da kısa birer madde olabilir.",
      },
      {
        heading: "Dil, hijyen ve POS: ilk bakılan bilgiler",
        body: "Turistik bölgelerde yabancı dil çoğu zaman deneyimden önce gelir. Dilleri dürüst seviyelerle yaz: \"İngilizce B1, Rusça A2 – menü ve sipariş düzeyinde\" gibi bir ifade, \"iyi derecede\" demekten daha güven verir.\n\nHijyen eğitimi belgen varsa sertifikalar bölümüne mutlaka ekle; gıda ile çalışan işletmeler bunu ister. Adisyon ve POS sistemleri, el terminaliyle sipariş alma, temel barista becerileri gibi pratik yetkinlikleri de ayrı bir grupta göster.",
      },
      {
        heading: "Eğitim: meslek lisesi ve staj",
        body: "Turizm ya da yiyecek içecek hizmetleri alanında bir meslek lisesi veya önlisans programı okuduysan bunu öne çıkar; işletmede beceri eğitimi ve stajlar gerçek deneyim sayılır. Staj yaptığın işletmeyi, süresini ve hangi bölümde çalıştığını deneyim bölümüne ayrı bir satır olarak ekleyebilirsin. Hâlâ okuyorsan beklenen mezuniyet yılını yaz ve ders programına uygun çalışma saatlerini belirt.",
      },
      {
        heading: "Vardiya ve uygunluk bilgisi",
        body: "Garson alımında en sık sorulan soru \"Ne zaman çalışabilirsin?\" sorusudur. Kişisel bilgilere sezonluk, yarı zamanlı ya da tam zamanlı çalışma tercihini, hafta sonu ve gece vardiyasına uygunluğunu ve gerekiyorsa lojmanda kalabileceğini ekle. Erkek adaylar askerlik durumunu da yazmalı; tecilli isen tecil tarihini belirtmek işverenin planlama yapmasını kolaylaştırır.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- CV'yi iki sayfaya uzatmak: giriş seviyesinde tek sayfa yeterli ve daha kolay okunur.\n- Servis türlerini yazmamak: açık büfe ile a la carte deneyimi işveren için farklı anlam taşır.\n- Dil seviyesini abartmak: misafirle konuşurken birkaç dakikada anlaşılır.\n- Uygun olduğun vardiya ve başlama tarihini atlamak: sezon öncesi alımlarda ilk elemede bakılır.\n- Gayriresmî bir e-posta adresi kullanmak: adınla oluşturduğun sade bir adres seç.",
      },
    ],
  },
  content: {
    settings: {
      template: "airy",
      color: "#0f766e",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Selin Karataş",
      title: "Garson",
      email: "selin.karatas@ornek.com",
      phone: "0500 000 00 00",
      location: "Antalya",
      extras: [{ label: "Çalışma tercihi", value: "Sezonluk veya tam zamanlı; hafta sonu ve akşam vardiyasına uygun" }],
    },
    summary:
      "Otel restoranında bir sezon ve kafede bir yıl yarı zamanlı servis deneyimi olan garsonum. A la carte ve açık büfe servisinde çalıştım; İngilizce ve temel Rusça ile misafirlerden sipariş alabiliyorum.",
    experience: [
      {
        position: "Garson (Sezonluk)",
        company: "Mavikıyı Otel İşletmeleri",
        location: "Antalya",
        start: "Nis 2025",
        end: "Eki 2025",
        bullets: [
          "Açık büfe restoranda kahvaltı ve akşam yemeği servislerinde masa düzeni, içecek servisi ve masa toplama işlerini yürüttüm.",
          "Sezonun ikinci yarısında a la carte restorana geçerek akşam servisinde **10 masalık** bölüme baktım.",
          "El terminaliyle sipariş alıp mutfak ve barla koordinasyonu sağladım; yoğun akşamlarda 120 kişiye kadar servis veren ekipte çalıştım.",
          "İngilizce ve temel Rusça ile menü tanıttım; alerjen sorularını mutfak şefine doğru şekilde ilettim.",
        ].join("\n"),
      },
      {
        position: "Garson (Yarı Zamanlı)",
        company: "Liman Kahve Evi",
        location: "Antalya",
        start: "Eyl 2023",
        end: "Mar 2025",
        bullets: [
          "Hafta sonu ve akşam vardiyalarında 14 masalık salonda sipariş alma, servis ve POS üzerinden hesap kapatma işlerini yaptım.",
          "Temel espresso ve filtre kahve hazırlığını öğrenerek yoğun saatlerde bara destek verdim.",
          "Yeni başlayan 2 çalışana masa düzeni ve adisyon sistemini gösterdim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Servis", items: "A la carte, açık büfe, içecek servisi, masa düzeni ve mizanplas" },
      { category: "Araçlar", items: "POS ve adisyon sistemleri, el terminaliyle sipariş" },
      { category: "Diğer", items: "Temel barista becerileri, alerjen bilgisi, misafir iletişimi" },
    ],
    education: [
      {
        school: "Mesleki ve Teknik Anadolu Lisesi",
        field: "Yiyecek İçecek Hizmetleri Alanı",
        degree: "Lise",
        location: "Antalya",
        start: "2019",
        end: "2023",
      },
    ],
    certifications: [{ name: "Hijyen Eğitimi Belgesi", issuer: "Halk Eğitim Merkezi", date: "2023" }],
    languages: [
      { language: "İngilizce", level: "B1 – Orta" },
      { language: "Rusça", level: "A2 – Temel" },
    ],
    references: [],
  },
});
