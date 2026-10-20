import { defineExample } from "../define";

export default defineExample({
  slug: "ui-ux-tasarimci-cv-ornegi",
  title: "UI/UX Tasarımcı CV Örneği",
  occupation: "UI/UX Tasarımcı",
  category: "design-media",
  experienceLevel: "mid",
  metaTitle: "UI/UX Tasarımcı CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Kullanıcı araştırması, kullanılabilirlik testi ve Figma tasarım sistemi deneyimini sonuçlarla anlatan UI/UX tasarımcı CV örneği. Ücretsiz düzenle.",
  guide: {
    intro:
      "Tasarım yöneticileri ve ürün ekipleri bir UI/UX tasarımcı CV'sinde önce portfolyo bağlantısına, ardından hangi ürünlerde hangi problemi çözdüğüne ve tasarım kararlarını neye dayandırdığına bakar. Bu örnek, ajans ve finans teknolojisi şirketinde 6 yıl çalışmış bir ürün tasarımcısının araştırma, arayüz ve tasarım sistemi deneyimini ölçülebilir sonuçlarla nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Portfolyo bağlantısı ve vaka çalışmaları",
        body: "UI/UX başvurularında CV, portfolyoya giden yoldur. Bağlantını iletişim bilgilerinin içine, tıklanabilir ve kısa bir adresle koy. Portfolyoda bitmiş ekranları sıralamak yerine 3–4 vaka çalışması göster: problem, senin rolün, araştırma bulguları, denediğin çözümler, nihai tasarım ve sonuç. CV'deki deneyim maddeleri bu vakalarla örtüşmeli; işe alım yapan kişi maddede okuduğu sonucu portfolyoda ayrıntısıyla görmek ister.\n\nGizlilik sözleşmesi olan işlerde ekranları bulanıklaştır veya akışı yeniden çiz; şirketin izni olmadan iç ekranları paylaşma.",
      },
      {
        heading: "Özet: ürün türü, rol ve uzmanlık",
        body: "UI/UX unvanı geniş bir alanı kapsar: kullanıcı araştırması, etkileşim tasarımı, görsel arayüz tasarımı ve tasarım sistemleri farklı ağırlıklar ister. Özette hangi ürünlerde (mobil uygulama, web uygulaması, kurumsal panel), hangi sektörde ve hangi ağırlıkla çalıştığını yaz. \"Kullanıcı odaklı, yaratıcı\" yerine \"Bir finans uygulamasında hesap açma ve ödeme akışlarını araştırmadan teslime kadar tasarlıyorum\" gibi bir cümle, ekibe senin nerede güçlü olduğunu söyler.",
      },
      {
        heading: "Deneyim maddelerinde ürün metrikleri",
        body: "Tasarımın etkisi ürün metrikleriyle ölçülür: akış tamamlama oranı, görev başarı oranı, hata oranı, destek talebi sayısı, kullanıcı memnuniyeti puanı. Bu rakamlar çoğu zaman ürün ekibiyle birlikte elde edilir; bunu dürüstçe belirt ve rolünü netleştir.\n\n- Zayıf: \"Uygulamanın kayıt ekranlarını yeniden tasarladım.\"\n- Güçlü: \"Kullanılabilirlik testlerinde öne çıkan 4 sorunu çözen yeni hesap açma akışını tasarladım; akış tamamlama oranı **%48'den %67'ye** çıktı.\"\n\nAraştırma yaptığın maddelerde yöntemi ve ölçeği yaz: kaç kullanıcıyla görüşme, kaç katılımcılı test, hangi analiz yöntemi. Sonucu ölçemediğin bir projede rakam uydurmak yerine araştırmanın ürün kararını nasıl değiştirdiğini anlat; örneğin testte ortaya çıkan bir sorunun yol haritasında öne alınması da somut bir etkidir.",
      },
      {
        heading: "Araçlar, yöntemler ve anahtar kelimeler",
        body: "Ürün şirketleri başvuruları aday takip sistemiyle de eler. İlanlarda sık geçen ifadeleri kullan: \"kullanıcı araştırması\", \"kullanılabilirlik testi\", \"wireframe\", \"prototipleme\", \"kullanıcı akışı\", \"bilgi mimarisi\", \"tasarım sistemi\", \"erişilebilirlik (WCAG)\", \"A/B testi\", \"etkileşim tasarımı\". Araçları adıyla yaz: Figma (bileşen, varyant, otomatik yerleşim), FigJam, Maze, Hotjar, Google Analytics gibi. Geliştiricilerle çalışmayı kolaylaştıran temel HTML ve CSS bilgisi, tasarım tokenları ve teslim süreci deneyimi de ayrı bir grupta öne çıkar.",
      },
      {
        heading: "Tasarım sistemi ve ekip çalışması",
        body: "Orta kıdemde ekipler, tek tek ekran tasarlayan değil, ürünün tutarlılığını koruyan tasarımcı arar. Bir tasarım sistemi kurduysan ya da büyüttüysen bileşen sayısını, kaç ekip tarafından kullanıldığını ve tasarım-geliştirme sürecine etkisini yaz. Ürün yöneticisi, geliştirici ve içerik ekipleriyle nasıl çalıştığını, tasarım eleştirisi oturumları düzenleyip düzenlemediğini ve daha genç tasarımcılara rehberlik edip etmediğini de bir maddede göster.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Portfolyo bağlantısı vermemek ya da yalnızca ekran görüntüsü paylaşmak.\n- Araç listesini uzatıp yöntemleri ve sonuçları atlamak.\n- Ekip başarısını tek başına üstlenmek: rolünü ve iş birliğini açıkça yaz.\n- Görsel olarak aşırı süslü bir CV hazırlamak: ATS okuyamayabilir ve tasarım yetkinliği zaten portfolyoda görülür.\n- Erişilebilirlik konusunu hiç anmamak.",
      },
    ],
  },
  content: {
    settings: {
      template: "minimal",
      color: "#6d28d9",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Deniz Erkan",
      title: "UI/UX Tasarımcı",
      email: "deniz.erkan@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      web: "denizerkan-ornek.com",
      linkedin: "linkedin.com/in/denizerkan-ornek",
    },
    summary:
      "Ajans ve finans teknolojisi tarafında 6 yıllık deneyime sahip UI/UX tasarımcıyım. Mobil ve web uygulamalarında hesap açma, ödeme ve onboarding akışlarını kullanıcı araştırmasından geliştirici teslimine kadar tasarlıyorum. Son rolümde 4 ürün ekibinin kullandığı Figma tasarım sistemini kurdum ve büyütüyorum.",
    experience: [
      {
        position: "UI/UX Tasarımcı",
        company: "Pusula Finans Teknolojileri A.Ş.",
        location: "İstanbul",
        start: "Mar 2022",
        current: true,
        bullets: [
          "Mobil uygulamanın hesap açma akışı için 12 kullanıcıyla görüşme ve 2 tur kullanılabilirlik testi yaptım; yeni akışla tamamlama oranı **%48'den %67'ye** çıktı.",
          "4 ürün ekibinin kullandığı Figma tasarım sistemini kurdum; 120'yi aşkın bileşen ve tasarım tokenlarıyla yeni ekranların geliştirme süresi **ekip tahminiyle %30** kısaldı.",
          "Ödeme ekranlarındaki hata mesajlarını içerik ekibiyle yeniden yazıp tasarladım; ödeme kaynaklı destek talepleri **aylık %22** azaldı.",
          "Uygulamanın temel akışlarını WCAG 2.1 AA ölçütlerine göre denetleyip kontrast, odak sırası ve ekran okuyucu etiketlerinde **60'ı aşkın düzeltmeyi** geliştiricilerle tamamladım.",
          "2 genç tasarımcıya rehberlik ettim; haftalık tasarım eleştirisi oturumlarını başlattım.",
        ].join("\n"),
      },
      {
        position: "UI Tasarımcı",
        company: "Ritim Dijital Ajans",
        location: "İstanbul",
        start: "Tem 2020",
        end: "Şub 2022",
        bullets: [
          "Perakende, eğitim ve sağlık sektörlerinden 9 müşteri için web sitesi ve mobil uygulama arayüzü tasarladım.",
          "Bir e-ticaret müşterisinin ürün sayfası için iki varyasyonlu A/B testi tasarladım; kazanan varyasyonda sepete ekleme oranı **%6,1'den %7,4'e** yükseldi.",
          "Figma'da tıklanabilir prototipler hazırlayarak müşteri onay turlarını **ortalama 4'ten 2'ye** indirdim.",
        ].join("\n"),
      },
    ],
    projects: [
      {
        name: "Belediye otobüs saatleri uygulaması (kişisel vaka çalışması)",
        role: "Tasarımcı",
        start: "2023",
        link: "denizerkan-ornek.com/otobus",
        description: "20 katılımcılı anket ve 6 kullanıcıyla görüşmeye dayanan yeniden tasarım; testlerde durak arama görevinin ortalama tamamlanma süresi yarıya indi.",
      },
    ],
    skills: [
      { category: "Araştırma", items: "Kullanıcı görüşmesi, kullanılabilirlik testi, anket, kart sıralama, kullanıcı yolculuğu haritası" },
      { category: "Tasarım", items: "Etkileşim tasarımı, wireframe, prototipleme, bilgi mimarisi, görsel arayüz, tasarım sistemi" },
      { category: "Erişilebilirlik ve veri", items: "WCAG 2.1 AA, A/B testi, ürün metrikleri, ısı haritası analizi" },
      { category: "Araçlar", items: "Figma, FigJam, Maze, Hotjar, Google Analytics, temel HTML ve CSS" },
    ],
    education: [
      {
        school: "Orta Doğu Teknik Üniversitesi",
        field: "Endüstriyel Tasarım",
        degree: "Lisans",
        start: "2015",
        end: "2020",
      },
    ],
    certifications: [{ name: "Google UX Design Professional Certificate", issuer: "Google (Coursera)", date: "2021" }],
    languages: [{ language: "İngilizce", level: "C1 – İleri" }],
    references: [],
    interests: "Tipografi, şehir planlama yazıları, analog fotoğraf",
  },
});
