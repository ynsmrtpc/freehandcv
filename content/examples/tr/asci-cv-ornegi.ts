import { defineExample } from "../define";

export default defineExample({
  slug: "asci-cv-ornegi",
  title: "Aşçı CV Örneği",
  occupation: "Aşçı",
  category: "hospitality",
  experienceLevel: "mid",
  metaTitle: "Aşçı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Sıcak mutfak, kapasite ve maliyet kontrolüyle yazılmış aşçı CV örneği. Mutfak bölümleri, hijyen belgesi ve HACCP ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Bir mutfak şefi aşçı CV'sine baktığında önce hangi bölümde çalıştığını, hangi mutfakta pişirdiğini ve servis yoğunluğunu kaldırıp kaldıramayacağını anlamak ister. Bu örnek, otel ve a la carte restoranda 8 yıllık deneyimi olan bir sıcak mutfak aşçısının bunu tek sayfada nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: bölüm, mutfak türü ve kapasite",
        body: "Özetin ilk cümlesinde hangi bölümde uzmanlaştığını yaz: sıcak mutfak, soğuk mutfak, pastane, kahvaltı, ızgara ya da banket. Ardından mutfak türünü belirt: Türk mutfağı, Akdeniz mutfağı, et restoranı, deniz ürünleri, dünya mutfağı. Son olarak ölçeği ver: bir akşam serviste kaç kuver çıktığı ya da otelde kaç kişilik açık büfeye üretim yaptığın. Bu bilgiler şefin seni hangi istasyona koyabileceğini gösterir.\n\nOtel mutfağı ile a la carte restoran farklı tempolar ister. Otelde toplu üretim, açık büfe planlaması ve banket öne çıkar; restoranda ise sipariş geldikçe tabak çıkarma hızı ve sunum. İki ortamda da çalıştıysan bunu özette açıkça söyle, çünkü bu esneklik birçok şefin aradığı bir özelliktir.",
      },
      {
        heading: "Unvanları mutfak hiyerarşisiyle yaz",
        body: "Mutfaklarda unvanlar kademelidir ve işveren bunları bilir: komi, demi şef, bölüm şefi (chef de partie), sous chef. Her işte hangi kademede olduğunu ve terfi aldıysan ne zaman yükseldiğini ayrı satırlarda göster. \"Aşçı\" yazıp geçmek, iki yıllık komi ile istasyon yöneten bir bölüm şefini aynı göstermek demektir.\n\nAltında kaç kişi çalıştığını, vardiya düzenini ve hangi istasyondan sorumlu olduğunu maddelere ekle.",
      },
      {
        heading: "Maddelerde hız, kapasite ve maliyet",
        body: "Mutfak işi de rakamla anlatılabilir: serviste çıkan tabak sayısı, tabak bekleme süresi, porsiyon maliyeti, fire oranı, menüye eklediğin ve tutan tabaklar.\n\n- Zayıf: \"Sıcak mutfakta yemek pişirdim.\"\n- Güçlü: \"Akşam servisinde 180 kuverlik a la carte restoranın sıcak mutfak istasyonunu yönettim; tabak çıkış süresini ortalama **14 dakikadan 10 dakikaya** indirdim.\"\n\nReçete kartı hazırladıysan, mal kabulde kontrol yaptıysan ya da sipariş miktarlarını ayarlayarak fireyi düşürdüysen bunları da yaz. Şefler maliyet bilinci olan aşçıyı tercih eder.",
      },
      {
        heading: "Hijyen belgesi, HACCP ve ustalık belgesi",
        body: "Gıda ile çalışan herkesten hijyen eğitimi belgesi istenir; sertifikalar bölümünde en üstte yer almalı. Çalıştığın işletmede HACCP sistemi uygulanıyorsa bu eğitimi aldığını ve sıcaklık kayıtları, kritik kontrol noktaları ve alerjen ayrımı gibi uygulamalara katıldığını belirt. MEB onaylı ustalık belgesi ya da mesleki yeterlilik belgen varsa ekle; özellikle otel mutfaklarında aranan bir belgedir.",
      },
      {
        heading: "Mutfak becerilerini teknikle göster",
        body: "\"Yemek yapmayı seven\" gibi ifadeler yerine bildiğin teknikleri ve ekipmanları yaz: mizanplas, sos hazırlığı, et ve balık temizleme, sous vide, kombi fırın, ızgara ve kuzine kullanımı, porsiyonlama ve tabak sunumu. Menü geliştirme deneyimin varsa yeni eklenen tabakların satışını ya da müşteri geri dönüşünü kısaca belirt. Sezonluk çalışıyorsan hangi sezonlarda nerede olduğunu açıkça yaz; boşluk gibi görünmesini önler.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Bölümü ve kademeyi belirtmeden yalnızca \"aşçı\" yazmak.\n- Hijyen belgesini ya da geçerli sağlık raporunu atlamak.\n- Kapasite ve servis yoğunluğu hakkında hiç bilgi vermemek.\n- Bildiğin mutfakları uzun bir liste halinde sayıp hangisinde gerçekten çalıştığını göstermemek.\n- Sezonluk işler arasındaki boşlukları açıklamamak.",
      },
    ],
  },
  content: {
    settings: {
      template: "boutique",
      color: "#9a3412",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Emre Kılınçarslan",
      title: "Aşçı – Sıcak Mutfak Bölüm Şefi",
      email: "emre.kilincarslan@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      extras: [
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Çalışma tercihi", value: "Tam zamanlı; akşam ve hafta sonu servisine uygun" },
      ],
    },
    summary:
      "Otel ve a la carte restoranlarda 8 yıllık deneyime sahip, sıcak mutfakta uzmanlaşmış aşçıyım. Akdeniz ve modern Türk mutfağında çalışıyor; 180 kuverlik akşam servislerinde 3 kişilik istasyonu yönetiyorum. Reçete kartları ve porsiyon standartlarıyla bölümümün fire oranını belirgin biçimde düşürdüm.",
    experience: [
      {
        position: "Sıcak Mutfak Bölüm Şefi (Chef de Partie)",
        company: "Zeytindalı Akdeniz Mutfağı Restoran",
        location: "İstanbul",
        start: "Şub 2022",
        current: true,
        bullets: [
          "180 kuverlik a la carte restoranda sıcak mutfak istasyonunu 1 demi şef ve 2 komiyle yönettim.",
          "Mizanplas listesini ve servis sırasını yeniden düzenleyerek tabak çıkış süresini **14 dakikadan 10 dakikaya** indirdim.",
          "Sıcak mutfaktaki 22 tabak için reçete kartı ve porsiyon standardı hazırladım; bölüm fire oranı **%9'dan %5'e** düştü.",
          "Menüye eklediğim 6 sezonluk tabaktan 4'ü kalıcı menüde yer aldı.",
          "HACCP kayıtlarını (mal kabul ve soğutucu sıcaklıkları, alerjen ayrımı) eksiksiz tuttum; denetimlerde bölümüm uygunsuzluk almadı.",
        ].join("\n"),
      },
      {
        position: "Demi Şef / Komi",
        company: "Mavi Koy Otel ve Tatil Köyü",
        location: "Bodrum, Muğla",
        start: "Nis 2017",
        end: "Ara 2021",
        bullets: [
          "Komi olarak başladığım otel mutfağında 2019'da sıcak mutfak demi şefliğine yükseldim.",
          "Sezon boyunca **800 kişilik** açık büfe akşam yemeği için et ve sebze yemeklerinin üretimini yaptım.",
          "A la carte restoranda ızgara ve deniz ürünleri istasyonunda çalıştım; yeni komilere istasyon düzenini öğrettim.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Mutfak", items: "Sıcak mutfak, ızgara, sos hazırlığı, et ve balık temizleme, porsiyonlama, tabak sunumu" },
      { category: "Ekipman ve teknik", items: "Kombi fırın, sous vide, kuzine, salamander, mizanplas planlama" },
      { category: "Yönetim ve hijyen", items: "Reçete kartı, fire ve maliyet takibi, HACCP kayıtları, alerjen yönetimi, mal kabul kontrolü" },
    ],
    education: [
      {
        school: "Mesleki ve Teknik Anadolu Lisesi",
        field: "Yiyecek İçecek Hizmetleri Alanı, Aşçılık Dalı",
        degree: "Lise",
        location: "Muğla",
        start: "2012",
        end: "2016",
      },
    ],
    certifications: [
      { name: "Hijyen Eğitimi Belgesi", issuer: "Halk Eğitim Merkezi", date: "2016" },
      { name: "HACCP Temel Eğitimi", issuer: "Kurum içi eğitim", date: "2022" },
      { name: "Aşçılık Ustalık Belgesi", issuer: "Mesleki Eğitim Merkezi (MEB)", date: "2020" },
    ],
    languages: [{ language: "İngilizce", level: "A2 – Temel (mutfak terimleri)" }],
    references: [],
  },
});
