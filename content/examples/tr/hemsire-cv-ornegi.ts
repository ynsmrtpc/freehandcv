import { defineExample } from "../define";

export default defineExample({
  slug: "hemsire-cv-ornegi",
  title: "Hemşire CV Örneği",
  occupation: "Hemşire",
  category: "healthcare",
  experienceLevel: "mid",
  metaTitle: "Hemşire CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Yoğun bakım ve servis deneyimiyle yazılmış hemşire CV örneği. Klinik beceri, sertifika ve deneyim maddeleri için ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Hemşirelik hizmetleri müdürleri bir CV'de önce hangi birimlerde, kaç hastaya ve hangi klinik becerilerle çalıştığını arar. Bu örnek, servis ve yoğun bakım deneyimi olan 6 yıllık bir hemşirenin bu bilgileri tek sayfada nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: birimini ve uzmanlığını belirt",
        body: "\"Hasta odaklı, özverili hemşire\" cümlesi her CV'de vardır ve seni ayırt etmez. Özette kaç yıldır hemşirelik yaptığını, hangi birimlerde çalıştığını (dahiliye servisi, cerrahi yoğun bakım, acil, ameliyathane) ve en güçlü klinik becerilerini yaz. Başvurduğun birimle ilgili bir sertifikan varsa onu da özette an.\n\nÖrneğin: \"3 yıllık dahiliye servisi ve 3 yıllık cerrahi yoğun bakım deneyimine sahibim; mekanik ventilasyon takibi ve invaziv monitörizasyonda deneyimliyim.\" Bu iki cümle, CV'nin geri kalanını okumadan seni doğru birime yerleştirmeye yeter.",
      },
      {
        heading: "Deneyim maddelerini klinik sonuçla yaz",
        body: "Hemşirelikte iş tanımı herkes için benzer olduğundan \"hasta bakımı yaptım\" gibi maddeler bilgi vermez. Bunun yerine birimin büyüklüğünü, vardiya başına baktığın hasta sayısını ve katkı sağladığın kalite göstergelerini yaz: bası yarası, düşme, kateter ilişkili enfeksiyon, ilaç hatası bildirimleri gibi.\n\n- Zayıf: \"Bası yarası önleme çalışmalarına katıldım.\"\n- Güçlü: \"Braden ölçeğiyle risk değerlendirmesini ve pozisyon takibini standartlaştırdım; ünitede yeni bası yarası oranı bir yılda **%4,1'den %1,8'e** indi.\"\n\nSayıları kalite birimi raporlarından ya da birim toplantılarından al; hatırlamadığın bir oranı tahminle yazma. Oryantasyon sorumluluğu, sorumlu hemşire vekilliği ve hasta eğitimi gibi görevleri de ekle; kıdemli pozisyonlarda bunlar aranır.",
      },
      {
        heading: "Klinik becerileri gruplandır",
        body: "Hastanelerin insan kaynakları birimleri çoğu zaman aday takip sistemi (ATS) kullanır ve ilandaki kelimeleri arar. Becerilerini \"Klinik uygulamalar\", \"Kalite ve hasta güvenliği\", \"Kayıt ve sistemler\" gibi başlıklar altında topla.\n\nYoğun bakım için mekanik ventilatör takibi, arter kan gazı alma, invaziv arter ve CVP monitörizasyonu, inotrop infüzyonu; servis için ilaç hazırlama ve uygulama, yara bakımı, taburculuk eğitimi gibi ifadeler kullan. Sağlıkta Kalite Standartları (SKS), enfeksiyon kontrolü, İtaki düşme riski ölçeği ve HBYS kullanımı hem özel hem kamu hastanelerinde aranan anahtar kelimelerdir.",
      },
      {
        heading: "Sertifikaları tarihiyle listele",
        body: "Hemşirelikte sertifikalar, CV'nin en çok kontrol edilen bölümlerinden biridir. Temel Yaşam Desteği ve İleri Kardiyak Yaşam Desteği gibi eğitimleri, Sağlık Bakanlığı sertifikalı yoğun bakım, diyaliz veya acil hemşireliği programlarını sertifikayı veren kurum ve yılıyla yaz. Süreli eğitimlerin güncel olduğundan emin ol; süresi geçmiş bir yaşam desteği sertifikası mülakatta soru işareti yaratır.\n\nLisans diplomanı ve mezun olduğun fakülteyi eğitim bölümünde belirt. Yüksek lisansın varsa (örneğin İç Hastalıkları Hemşireliği) ilgili birime başvururken bunu özette de an.",
      },
      {
        heading: "Kamu ve özel hastane başvuruları",
        body: "Kamu hastanelerine atama KPSS ile yapılır; bu yüzden CV'n özel hastane, özel klinik ya da evde sağlık hizmeti başvurularında daha belirleyicidir. Özel hastaneler genellikle JCI veya SKS denetim deneyimine, vardiya düzenine uyuma ve yabancı hastalarla iletişime önem verir. Yabancı dil seviyeni Avrupa Ortak Çerçevesi (A2, B1) ile yaz; uluslararası hasta birimine başvuruyorsan bu bilgi öne çıkar.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Her birimi aynı cümlelerle anlatmak: servis ve yoğun bakım deneyimini farklı becerilerle yaz.\n- Hasta bilgisi paylaşmak: maddelerde hasta adı, tanı ayrıntısı ya da kimliği belli edecek vaka anlatma.\n- Sertifikaları tarihsiz yazmak: hangi eğitimin güncel olduğu anlaşılmaz.\n- Nöbet ve vardiya düzenini belirtmemek: gece nöbeti tutabildiğini ya da tuttuğunu yazmak özel hastanelerde önemlidir.\n- T.C. kimlik no, medeni hal ve açık adres eklemek: başvurunun ilk aşamasında gerekmez.",
      },
    ],
  },
  content: {
    settings: {
      template: "modern",
      color: "#0f766e",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Seda Arıkan",
      title: "Yoğun Bakım Hemşiresi",
      email: "seda.arikan@ornek.com",
      phone: "0500 000 00 00",
      location: "İzmir",
      linkedin: "linkedin.com/in/sedaarikan-ornek",
    },
    summary:
      "6 yıllık deneyime sahip hemşireyim; 2,5 yıl dahiliye servisinde, son 3,5 yıldır erişkin cerrahi yoğun bakımda çalışıyorum. Mekanik ventilasyon takibi, invaziv monitörizasyon ve yüksek riskli ilaç infüzyonlarında deneyimliyim. Bası yarası ve kateter enfeksiyonlarını önlemeye yönelik ünite içi kalite çalışmalarında aktif görev alıyor, yeni başlayan hemşirelerin oryantasyonunu yürütüyorum.",
    experience: [
      {
        position: "Yoğun Bakım Hemşiresi",
        company: "Özel Çınaraltı Hastanesi",
        location: "İzmir",
        start: "Nis 2023",
        current: true,
        bullets: [
          "14 yataklı erişkin cerrahi yoğun bakım ünitesinde vardiya başına 2–3 hastaya mekanik ventilasyon, invaziv monitörizasyon ve inotrop tedavisi takibiyle bakım veriyorum.",
          "Braden ölçeğiyle risk değerlendirmesini ve 2 saatlik pozisyon takibini standartlaştırdım; ünitede yeni bası yarası oranı bir yılda **%4,1'den %1,8'e** indi.",
          "Enfeksiyon kontrol hemşiresiyle santral kateter bakım demetinin uygulanmasını izledim; aylık denetimlerde demete uyum **%78'den %95'e** yükseldi.",
          "Üniteye katılan 6 yeni hemşirenin 4 haftalık oryantasyon programını yürüttüm; tamamı ilk 3 ayda bağımsız vardiya almaya başladı.",
          "SKS değerlendirmesine hazırlık sürecinde ünite talimatlarını ve hemşirelik kayıt formlarını güncelleyen ekipte görev aldım.",
        ].join("\n"),
      },
      {
        position: "Servis Hemşiresi (Dahiliye)",
        company: "Kıyı Eğitim ve Araştırma Hastanesi",
        location: "İzmir",
        start: "Eyl 2020",
        end: "Mar 2023",
        bullets: [
          "32 yataklı dahiliye servisinde gündüz vardiyasında 8–10, gece nöbetinde 14–16 hastanın ilaç uygulamasını, vital bulgu takibini ve hemşirelik kayıtlarını yürüttüm.",
          "İtaki ölçeğiyle düşme riski değerlendirmesini kabul anında ve her vardiyada yaptım; serviste düşme bildirimleri bir yılda **11'den 4'e** indi.",
          "Yeni insülin başlanan diyabetli hastalara enjeksiyon ve kan şekeri takibi eğitimi verdim; ayda ortalama 15 hastaya taburculuk eğitimi planladım.",
          "COVID-19 döneminde 3 ay pandemi servisinde görevlendirildim; kişisel koruyucu ekipman kullanımı ve izolasyon önlemlerinde ekip arkadaşlarına yardımcı oldum.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Klinik uygulamalar",
        items:
          "Mekanik ventilatör takibi, arter kan gazı alma, invaziv arter ve CVP monitörizasyonu, inotrop ve sedasyon infüzyonu, santral kateter bakımı, yara bakımı",
      },
      {
        category: "Kalite ve hasta güvenliği",
        items: "Sağlıkta Kalite Standartları (SKS), enfeksiyon kontrolü, Braden ve İtaki risk değerlendirmesi, güvenli ilaç uygulaması",
      },
      { category: "Kayıt ve sistemler", items: "HBYS, elektronik hemşirelik kayıtları, infüzyon ve enteral beslenme pompaları" },
      { category: "İletişim", items: "Hasta ve yakını eğitimi, taburculuk planlaması, ekip içi vaka devri" },
    ],
    education: [
      {
        school: "Ege Üniversitesi",
        field: "Hemşirelik",
        degree: "Lisans",
        start: "2016",
        end: "2020",
      },
    ],
    certifications: [
      { name: "Yoğun Bakım Hemşireliği Sertifikası", issuer: "T.C. Sağlık Bakanlığı", date: "2024" },
      { name: "İleri Kardiyak Yaşam Desteği", issuer: "Özel Çınaraltı Hastanesi Eğitim Birimi", date: "2025" },
      { name: "Temel Yaşam Desteği", issuer: "Özel Çınaraltı Hastanesi Eğitim Birimi", date: "2025" },
    ],
    languages: [{ language: "İngilizce", level: "B1 – Orta" }],
    references: [],
    interests: "Yüzme, gönüllü ilk yardım eğitimleri, fotoğrafçılık",
  },
});
