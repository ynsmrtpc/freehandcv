import { defineExample } from "../define";

export default defineExample({
  slug: "tibbi-laboratuvar-teknisyeni-cv-ornegi",
  title: "Tıbbi Laboratuvar Teknisyeni CV Örneği",
  occupation: "Tıbbi Laboratuvar Teknisyeni",
  category: "healthcare",
  experienceLevel: "mid",
  metaTitle: "Tıbbi Laboratuvar Teknisyeni CV Örneği ve Rehberi",
  metaDescription:
    "Biyokimya, hematoloji ve kan merkezi deneyimiyle laboratuvar teknisyeni CV örneği. Kalite kontrol ve cihaz ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Laboratuvar sorumluları bir teknisyen CV'sinde önce hangi bölümlerde çalıştığını, günde ne kadar numuneyle ve hangi cihazlarla iş yaptığını, kalite kontrolü ne kadar bildiğini arar. Bu örnek, kan merkezi ve mikrobiyolojiden merkez laboratuvara geçmiş 9 yıllık bir teknisyenin bu bilgileri tek sayfada nasıl sunduğunu gösteriyor.",
    sections: [
      {
        heading: "Özet: bölümünü ve iş yükünü belirt",
        body: "\"Titiz ve dikkatli laboratuvar çalışanı\" ifadesi sana bir şey kazandırmaz; dikkat, laboratuvarda zaten temel beklentidir. Özetinde toplam deneyimini, çalıştığın bölümleri (biyokimya, hematoloji, mikrobiyoloji, kan merkezi, patoloji) ve laboratuvarın günlük numune hacmini yaz. Başvurduğun ilan hangi bölümü arıyorsa o deneyimi ilk cümleye taşı.\n\nÖrneğin: \"Günde yaklaşık 1.800 numunenin çalışıldığı merkez laboratuvarda biyokimya ve hematoloji otoanalizörlerinde 5 yıllık deneyimim var.\" Bu cümle, sorumlunun seni hangi tezgâha koyabileceğini hemen gösterir.",
      },
      {
        heading: "Deneyim maddelerinde hacim, süre ve hata oranı",
        body: "Laboratuvarda başarı üç ölçüyle görünür: kaç numuneyi işlediğin, sonucu ne kadar sürede verdiğin ve preanalitik ya da analitik hataları ne kadar azalttığın. Numune red oranı, acil testlerde sonuç verme süresi (TAT), panik değer bildirimi ve dış kalite değerlendirme sonuçları bu yüzden en güçlü madde konularıdır.\n\n- Zayıf: \"Numune kabul işlemlerini yaptım.\"\n- Güçlü: \"Hemoliz ve yetersiz hacim kaynaklı redleri kayıt altına alıp servislere aylık geri bildirim verilmesini önerdim; numune red oranı **%2,6'dan %1,1'e** indi.\"\n\nOranları laboratuvar bilgi sisteminin raporlarından al; ölçmediğin bir iyileşmeyi tahminle yazma.",
      },
      {
        heading: "Kalite kontrol bilgisini somut yaz",
        body: "Kalite kontrol, teknisyen mülakatlarında en çok sorulan konudur. \"Kalite kontrol yaptım\" demek yerine ne yaptığını anlat: vardiya başında iç kalite kontrol çalışmak, sonuçları Westgard kurallarıyla değerlendirmek, kural dışı sonuçta cihazı durdurup sorumluya bildirmek, kalibrasyon ve günlük bakım kayıtlarını tutmak. Dış kalite değerlendirme programına numune çalıştıysan ve SKS denetimine hazırlıkta görev aldıysan bunları da ekle.\n\nKalite kontrolde yaşadığın bir sorunu nasıl çözdüğünü anlatan tek bir madde, uzun bir beceri listesinden daha ikna edicidir: örneğin bir parametrede kayma fark edip reaktif lotunu değiştirdiğin ve hastaya giden hatalı sonucu önlediğin bir durum.",
      },
      {
        heading: "Cihazlar, testler ve anahtar kelimeler",
        body: "Hastane ve özel laboratuvar ilanları çoğu zaman aday takip sistemiyle (ATS) taranır. Becerilerini bölüm bölüm grupla ve ilandaki ifadeleri kullan: biyokimya ve immünoassay otoanalizörleri, tam kan sayımı, koagülasyon, periferik yayma, idrar analizi, kültür ekimi, Gram boyama, antibiyogram, ABO/Rh kan grubu tayini, çapraz karşılaştırma. Kullandığın cihazların marka ve modelini biliyorsan beceriler bölümünde yazabilirsin; aynı cihazla çalışan laboratuvarlar için bu bilgi uyum süresini kısaltır.\n\nLaboratuvar bilgi sistemi (LIS) ve HBYS kullanımını da belirt.",
      },
      {
        heading: "Eğitim, unvan ve sertifikalar",
        body: "Lise, önlisans ya da lisans mezuniyetini okul ve alan adıyla yaz. İlanlarda teknisyen ve tekniker unvanları çoğu zaman birbirinin yerine kullanılır; CV'nde diplomanda yazan unvanı kullan. Transfüzyon güvenliği, biyogüvenlik, numune taşıma ve enfeksiyon kontrolü gibi hizmet içi eğitimleri veren kurum ve yılıyla listele. Kan merkezi ilanlarına başvuruyorsan transfüzyonla ilgili eğitimleri en üste al.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Bütün bölümleri tek maddede \"laboratuvar işlemleri\" diye geçmek.\n- Cihaz ve test listesini bölümlere ayırmadan uzun bir satır halinde yazmak.\n- Hasta adı, test sonucu ya da kimliği belli edecek bilgi paylaşmak.\n- Vardiya ve nöbet düzenini belirtmemek: 24 saat çalışan laboratuvarlarda ilk sorulardandır.\n- Pandemi döneminde PCR laboratuvarında çalıştıysan bunu atlamak: moleküler çalışma deneyimi olarak değerlidir.",
      },
    ],
  },
  content: {
    settings: {
      template: "technical",
      color: "#1d4ed8",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Cansu Ergin",
      title: "Tıbbi Laboratuvar Teknisyeni",
      email: "cansu.ergin@ornek.com",
      phone: "0500 000 00 00",
      location: "Ankara",
      linkedin: "linkedin.com/in/cansuergin-ornek",
      extras: [{ label: "Çalışma düzeni", value: "Vardiyalı ve gece nöbetli çalışmaya uygun" }],
    },
    summary:
      "9 yıllık deneyime sahip tıbbi laboratuvar teknisyeniyim. İlk 4 yılımı bir devlet hastanesinin kan merkezi ve mikrobiyoloji laboratuvarında, son 5 yılımı günde yaklaşık 1.800 numunenin çalışıldığı özel hastane merkez laboratuvarında geçirdim. Biyokimya, immünoassay ve hematoloji otoanalizörlerinde numune çalışma, iç kalite kontrol, kalibrasyon ve panik değer bildirimi konularında deneyimliyim.",
    experience: [
      {
        position: "Tıbbi Laboratuvar Teknisyeni (Biyokimya ve Hematoloji)",
        company: "Özel Kayalıpark Hastanesi – Merkez Laboratuvar",
        location: "Ankara",
        start: "Haz 2021",
        current: true,
        bullets: [
          "Biyokimya, immünoassay ve hematoloji otoanalizörlerinde rutin ve acil numuneleri çalışıyor, cihazların günlük bakımını ve kalibrasyonlarını yapıyorum.",
          "Vardiya başında iç kalite kontrol sonuçlarını Westgard kurallarıyla değerlendiriyor, kural dışı sonuçlarda cihazı durdurup sorumlu uzmana bildiriyorum.",
          "Hemoliz, yetersiz hacim ve yanlış tüp kaynaklı redleri kayıt altına alıp servislere aylık geri bildirim verilmesini önerdim; numune red oranı **%2,6'dan %1,1'e** indi.",
          "Acil testlerin sonuç verme süresini izleyen günlük raporu hazırladım; 60 dakika içinde sonuçlanan acil biyokimya testlerinin oranı **%82'den %95'e** yükseldi.",
          "Dış kalite değerlendirme programı numunelerini çalışıp sonuçları sisteme giriyorum; son 2 yılda biyokimya parametrelerinde **kabul dışı sonuç çıkmadı**.",
        ].join("\n"),
      },
      {
        position: "Laboratuvar Teknisyeni (Kan Merkezi ve Mikrobiyoloji)",
        company: "Karaçam Devlet Hastanesi",
        location: "Çorum",
        start: "Eyl 2017",
        end: "May 2021",
        bullets: [
          "Kan merkezinde ABO/Rh kan grubu tayini, antikor tarama ve çapraz karşılaştırma testlerini çalıştım; ayda ortalama 450 ünite kan bileşeninin stok kayıtlarını tuttum.",
          "Mikrobiyoloji laboratuvarında idrar, kan ve yara kültürlerinin ekimini, Gram boyamayı ve antibiyogram hazırlığını yaptım.",
          "Biyogüvenlik kabini, otoklav ve buzdolabı sıcaklık kayıtlarını tek bir takip formunda topladım; SKS değerlendirmesinde laboratuvar kayıtları **eksiksiz** sunuldu.",
          "Pandemi döneminde 8 ay PCR laboratuvarında görevlendirildim; numune kabul ve nükleik asit izolasyonu adımlarında günde 300'e kadar numunenin hazırlığına destek verdim.",
        ].join("\n"),
      },
    ],
    skills: [
      {
        category: "Analitik çalışma",
        items: "Biyokimya ve immünoassay otoanalizörleri, tam kan sayımı, koagülasyon testleri, periferik yayma hazırlama, idrar analizi",
      },
      {
        category: "Kan merkezi ve mikrobiyoloji",
        items: "ABO/Rh kan grubu tayini, antikor tarama, çapraz karşılaştırma, kültür ekimi, Gram boyama, antibiyogram",
      },
      {
        category: "Kalite",
        items: "İç kalite kontrol, Westgard kuralları, dış kalite değerlendirme, kalibrasyon ve cihaz bakımı, preanalitik hata takibi, SKS",
      },
      { category: "Sistemler", items: "Laboratuvar bilgi sistemi (LIS), HBYS, Excel" },
    ],
    education: [
      {
        school: "Mesleki ve Teknik Anadolu Lisesi",
        field: "Sağlık Hizmetleri Alanı – Tıbbi Laboratuvar",
        degree: "Lise",
        location: "Çorum",
        start: "2013",
        end: "2017",
      },
    ],
    certifications: [
      { name: "Transfüzyon Güvenliği Eğitimi", issuer: "Karaçam Devlet Hastanesi Eğitim Birimi", date: "2019" },
      { name: "Biyogüvenlik ve Numune Taşıma Eğitimi", issuer: "Kayalıpark Hastanesi Eğitim Birimi", date: "2024" },
      { name: "Enfeksiyon Kontrolü Hizmet İçi Eğitimi", issuer: "Kayalıpark Hastanesi Eğitim Birimi", date: "2025" },
    ],
    languages: [{ language: "İngilizce", level: "A2 – Temel" }],
    references: [],
    interests: "Bisiklet, bulmaca, ev bitkileri yetiştirme",
  },
});
