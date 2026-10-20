import { defineExample } from "../define";

export default defineExample({
  slug: "gida-muhendisi-cv-ornegi",
  title: "Gıda Mühendisi CV Örneği",
  occupation: "Gıda Mühendisi",
  category: "engineering",
  experienceLevel: "entry",
  metaTitle: "Gıda Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Staj, laboratuvar analizi ve HACCP bilgisiyle yazılmış yeni mezun gıda mühendisi CV örneği. Tek sayfa ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Gıda fabrikalarının kalite ve üretim müdürleri yeni mezun bir gıda mühendisinin CV'sinde staj yaptığı tesisleri, laboratuvarda bizzat yaptığı analizleri ve gıda güvenliği sistemlerini ne kadar tanıdığını arar. Bu örnek, süt ürünleri ve unlu mamul tesislerinde iki staj yapmış yeni bir mezunun sınırlı deneyimini tek sayfada nasıl güçlü gösterdiğini anlatıyor.",
    sections: [
      {
        heading: "Özet: hangi alanda başlamak istiyorsun?",
        body: "Gıda mühendisliği mezunları kalite kontrol, kalite güvence, üretim, Ar-Ge ve gıda denetimi gibi farklı yollara gidebilir. Özetin ilk cümlesinde mezuniyet bilgisini, ikinci cümlesinde hedeflediğin alanı ve bu alana yakın deneyimini (staj, bitirme projesi, laboratuvar çalışması) yaz.\n\nBelirli bir sektöre ilgin varsa, örneğin süt ürünleri, et ürünleri, unlu mamuller ya da içecek, bunu açıkça söyle. \"Her alanda çalışmaya açığım\" ifadesi yeni mezun CV'sinde bile zayıf durur; ilan değiştikçe özeti uyarlamak daha etkilidir.",
      },
      {
        heading: "Stajları gerçek iş gibi anlat",
        body: "Yeni mezunun en değerli deneyimi stajdır, ama çoğu CV stajı \"kalite kontrol biriminde staj yaptım\" diye tek satırla geçer. Bunun yerine hangi analizleri yaptığını, hangi hattı takip ettiğini, hangi kaydı tuttuğunu ve varsa küçük bir iyileştirmeyi yaz.\n\n- Zayıf: \"Kalite kontrol laboratuvarında staj yaptım.\"\n- Güçlü: \"Süt kabul ve yoğurt hattında günde ortalama 25 numunede pH, titrasyon asitliği, yağ ve kuru madde analizi yaparak sonuçları **kalite kayıt sistemine** işledim.\"\n\nYaptığın işi abartma. Bir HACCP planını tek başına kurmadıysan \"HACCP planının güncellenmesine destek verdim\" yazmak hem dürüst hem de yeterlidir.",
      },
      {
        heading: "Gıda güvenliği sistemleri ve anahtar kelimeler",
        body: "Gıda sektöründeki ilanların neredeyse tamamında HACCP ve ISO 22000 geçer; ihracat yapan tesislerde BRCGS ve IFS gibi standartlar da sık görülür. Bu sistemlerle staj ya da eğitim yoluyla tanıştıysan yetkinliklerde belirt, ama nasıl tanıştığını dürüstçe yaz.\n\nATS için şu kavramları ilandaki yazımıyla kullan: kalite kontrol, kalite güvence, HACCP, ISO 22000, iyi üretim uygulamaları (GMP), hijyen ve sanitasyon, izlenebilirlik, kritik kontrol noktası, mikrobiyolojik analiz, fiziksel ve kimyasal analiz, raf ömrü, etiketleme. Yetkinlikleri \"Analiz\", \"Gıda güvenliği\" ve \"Yazılım\" gibi gruplara ayırmak okumayı kolaylaştırır.",
      },
      {
        heading: "Sertifikalar ve bitirme projesi",
        body: "Yeni mezunlar için HACCP ve ISO 22000 temel eğitimleri, iç denetçi eğitimi ve iş sağlığı ve güvenliği eğitimi sık eklenen belgelerdir. Belgeyi veren kurumu ve eğitim süresini yaz; kapsamı belirsiz çevrim içi kursları uzun bir liste halinde sıralama.\n\nBitirme projesi ya da araştırma projesi gerçek bir ürün veya analizle ilgiliyse ayrı bir proje bölümünde anlat: ne denediniz, hangi yöntemi kullandınız, sonuç ne oldu? Bir Ar-Ge pozisyonuna başvuruyorsan bu bölüm, staj kadar önemlidir.",
      },
      {
        heading: "Vardiya, saha ve kişisel bilgiler",
        body: "Gıda tesislerinin önemli bir kısmı organize sanayi bölgelerinde ve vardiyalı çalışır. Vardiyalı çalışmaya ve şehir dışındaki tesislere uygunsan bunu özet ya da kişisel bilgiler bölümünde belirt. Erkek adaylar için askerlik durumu Türkiye'de hâlâ sık sorulur; tecil ya da tamamlanma bilgisini tek satırla ekle. Ehliyet zorunlu değildir ama servis olmayan tesislerde avantaj sağlar.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Tüm üniversite derslerini sıralamak: yalnızca ilanla ilgili ders ve projeleri seç.\n- Staj görevlerini tek satırla geçmek.\n- HACCP ya da ISO 22000'i, yalnızca derste gördüğün halde uygulamış gibi yazmak.\n- İki sayfaya uzanmak: yeni mezun CV'si tek sayfaya sığmalı.\n- Vardiya ve konum esnekliğini belirtmemek: üretim ilanlarında ilk elemede bakılır.",
      },
    ],
  },
  content: {
    settings: {
      template: "graduate",
      color: "#15803d",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Zeynep Ilgaz",
      title: "Gıda Mühendisi (Yeni Mezun)",
      email: "zeynep.ilgaz@ornek.com",
      phone: "0500 000 00 00",
      location: "İzmir (vardiyalı çalışmaya ve şehir dışına uygun)",
      linkedin: "linkedin.com/in/zeynepilgaz-ornek",
      extras: [{ label: "Ehliyet", value: "B sınıfı" }],
    },
    summary:
      "2026 yılında Ege Üniversitesi Gıda Mühendisliği bölümünden 3,05 ortalamayla mezun oldum. Kalite kontrol ve kalite güvence alanında çalışmak istiyorum; süt ürünleri ve unlu mamul tesislerindeki iki stajımda fiziksel, kimyasal ve mikrobiyolojik analizler yaptım, HACCP kayıtlarının takibine destek verdim. Bitirme projemde doğal katkılı bir ekmeğin raf ömrünü inceledim.",
    experience: [
      {
        position: "Kalite Kontrol Stajyeri",
        company: "Gediz Süt Ürünleri San. A.Ş.",
        location: "Manisa",
        start: "Tem 2025",
        end: "Eyl 2025",
        bullets: [
          "Süt kabul ve yoğurt hattında günde ortalama 25 numunede pH, titrasyon asitliği, yağ ve kuru madde analizi yaparak sonuçları **kalite kayıt sistemine** işledim.",
          "Mikrobiyoloji laboratuvarında toplam bakteri, koliform ve maya-küf sayımlarına analist gözetiminde katıldım.",
          "Kritik kontrol noktalarından pastörizasyon sıcaklığı kayıtlarını haftalık olarak kontrol edip sapma raporlarını kalite sorumlusuna sundum.",
          "Hat hijyen denetimleri için kullanılan kontrol listesini sadeleştirmeye destek verdim; denetim süresi **yaklaşık 15 dakika** kısaldı.",
        ].join("\n"),
      },
      {
        position: "Üretim Stajyeri",
        company: "Körfez Unlu Mamuller Ltd. Şti.",
        location: "İzmir",
        start: "Tem 2024",
        end: "Ağu 2024",
        bullets: [
          "Ekmek ve kek hatlarında hamur sıcaklığı, fermantasyon süresi ve fırın çıkış ağırlıklarını ölçerek üretim formlarına kaydettim.",
          "Hammadde kabulünde un ve katkı maddelerinin parti numaralarını izlenebilirlik kayıtlarıyla eşleştirdim.",
          "Hat sonu ağırlık kontrollerinde tespit ettiğim sapmaları vardiya amirine bildirdim; ağırlık sapmalı ürün oranının takibi için **günlük tablo** hazırladım.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Doğal katkılı ekmekte raf ömrü çalışması (bitirme projesi)",
        role: "Proje ekibi (3 kişi)",
        start: "Eyl 2025",
        end: "Haz 2026",
        description:
          "Ekşi maya ve kurutulmuş meyve tozu kullanılan ekmek formülasyonlarında 7 gün boyunca nem, sertlik ve küf oluşumunu ölçtük; en iyi formülasyonda gözle görülür küf oluşumu kontrol örneğine göre **2 gün geç** başladı.",
      },
    ],
    skills: [
      { category: "Analiz", items: "pH, titrasyon asitliği, yağ ve kuru madde tayini, temel mikrobiyolojik analizler, duyusal analiz" },
      { category: "Gıda güvenliği", items: "HACCP, ISO 22000 (temel), GMP, hijyen ve sanitasyon, izlenebilirlik" },
      { category: "Yazılım", items: "Microsoft Excel, Word, Minitab (temel)" },
    ],
    education: [
      {
        school: "Ege Üniversitesi",
        field: "Gıda Mühendisliği",
        degree: "Lisans",
        start: "2021",
        end: "2026",
        gpa: "3,05 / 4,00",
      },
    ],
    certifications: [
      { name: "HACCP Temel Eğitimi (16 saat)", issuer: "Akredite eğitim kuruluşu", date: "2025" },
      { name: "ISO 22000:2018 Gıda Güvenliği Yönetim Sistemi Temel Eğitimi", issuer: "Akredite eğitim kuruluşu", date: "2026" },
      { name: "Temel İş Sağlığı ve Güvenliği Eğitimi", issuer: "Yetkili İSG eğitim kurumu", date: "2024" },
    ],
    languages: [{ language: "İngilizce", level: "B1 – Orta" }],
    references: [],
    interests: "Ekşi maya ekmek yapımı, gönüllü gıda bankası çalışmaları",
  },
});
