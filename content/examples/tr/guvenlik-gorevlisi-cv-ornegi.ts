import { defineExample } from "../define";

export default defineExample({
  slug: "guvenlik-gorevlisi-cv-ornegi",
  title: "Güvenlik Görevlisi CV Örneği",
  occupation: "Güvenlik Görevlisi",
  category: "operations",
  experienceLevel: "mid",
  metaTitle: "Güvenlik Görevlisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Özel güvenlik kimlik kartı, silahlı görev ve vardiya deneyimiyle yazılmış güvenlik görevlisi CV örneği. Tek sayfa ipuçları; ücretsiz düzenle, PDF indir.",
  guide: {
    intro:
      "Özel güvenlik şirketleri ve tesis yöneticileri güvenlik görevlisi CV'sinde önce kimlik kartının türüne ve geçerliliğine, sonra hangi tür tesiste ve hangi vardiya düzeninde çalıştığına bakar. Bu örnek, AVM ve hastanede 7 yıllık silahlı özel güvenlik deneyimi olan bir görevlinin bunları tek sayfada nasıl verdiğini gösteriyor.",
    sections: [
      {
        heading: "Kimlik kartı bilgisi en başta",
        body: "Özel güvenlik kimlik kartı bu meslekte işe girişin ön şartıdır. Kartın silahlı mı silahsız mı olduğunu ve geçerlilik tarihini kişisel bilgilerde ya da sertifikalar bölümünün en üstünde açıkça yaz. Kartın yenilenmesi yaklaşıyorsa yenileme eğitimini ne zaman alacağını belirtmek işverenin planlama yapmasını kolaylaştırır.\n\nSilahlı görev yapan adaylar için atış eğitimini düzenli tamamladığını belirtmek artıdır. Silahsız kart sahibiysen bunu da saklama; birçok tesis silahsız görevli arar ve doğru ilana başvurmanı sağlar.",
      },
      {
        heading: "Özet: tesis tipi, görev ve vardiya",
        body: "İki cümlelik bir özet yeterli. Çalıştığın tesis türlerini (AVM, hastane, fabrika, plaza, site, şantiye, etkinlik alanı) ve üstlendiğin görevleri (giriş kontrolü, kamera izleme, devriye, ekip şefliği) yaz. Gece ve hafta sonu dahil vardiyalı çalışmaya uygun olduğunu belirt; bu sektörde en sık sorulan konu budur.\n\nTesis tipi işverene çok şey anlatır. Hastanede çalışan biri hasta yakınlarıyla iletişime, AVM'de çalışan biri kalabalık ve giriş kontrolüne, fabrikada çalışan biri araç ve malzeme çıkış kontrolüne alışkındır. Birden fazla tesis türünde çalıştıysan hepsini yaz; esneklik, güvenlik şirketlerinin seni farklı projelere yönlendirebilmesini sağlar.",
      },
      {
        heading: "Görevleri somut ve ölçülü anlat",
        body: "Güvenlik işinde başarı çoğu zaman \"olay olmamasıdır\" ve bunu anlatmak zor görünür. Yine de somut bilgi verebilirsin: günlük ziyaretçi sayısı, izlediğin kamera sayısı, devriye noktaları, katıldığın tatbikatlar, tuttuğun tutanaklar.\n\n- Zayıf: \"AVM'de güvenlik görevlisi olarak çalıştım.\"\n- Güçlü: \"Günde ortalama **15.000 ziyaretçinin** geçtiği AVM girişinde X-ray cihazı ve el dedektörüyle kontrol yaptım; kayıp çocuk ve şüpheli paket durumlarında prosedürü uyguladım.\"\n\nRakamları abartma; tesisin büyüklüğünü gösterecek kadarı yeterlidir. Yaşanan olayları anlatırken kişi bilgisi verme, yalnızca nasıl davrandığını yaz.",
      },
      {
        heading: "Ekipman ve beceriler",
        body: "Yetkinlikleri kısa gruplara ayır. Ekipman: X-ray cihazı, kapı ve el tipi metal dedektör, kamera izleme sistemleri, telsiz, kartlı geçiş sistemi. Prosedürler: ziyaretçi kaydı, araç kontrolü, devriye, olay tutanağı, acil durum ve tahliye. İlk yardım sertifikan ve yangın söndürme eğitimin varsa bunları sertifikalar bölümüne ekle; hastane ve AVM gibi kalabalık tesislerde özellikle aranır.",
      },
      {
        heading: "İletişim ve sakinlik de beceridir",
        body: "Güvenlik görevlisi çoğu zaman kurumun ilk temas noktasıdır. Hasta yakınlarıyla, öfkeli bir müşteriyle ya da kurallara uymayan bir ziyaretçiyle nasıl konuştuğun önemlidir. \"Hastane acil girişinde gerginleşen durumları sözlü iletişimle yatıştırdım\" gibi bir madde, işverene sahada nasıl davrandığını gösterir. Ekip şefliği yaptıysan kaç kişilik vardiyayı yönettiğini ve görev dağılımını nasıl yaptığını yaz. Vardiya teslim raporlarını eksiksiz tutman da bu düzeyde önemsenen bir beceridir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Kimlik kartının türünü ve geçerlilik tarihini yazmamak.\n- Tesis tipini belirtmeden \"güvenlik görevlisi\" yazıp geçmek.\n- Olayları anlatırken kişi ya da kurum bilgisi paylaşmak.\n- İlk yardım ve yangın eğitimlerini unutmak.\n- CV'yi iki sayfaya uzatmak: tek sayfada belgeler ve son iki üç görev yeterlidir.",
      },
    ],
  },
  content: {
    settings: {
      template: "classic",
      color: "#1f2937",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Murat Çevik",
      title: "Özel Güvenlik Görevlisi (Silahlı)",
      email: "murat.cevik@ornek.com",
      phone: "0500 000 00 00",
      location: "Ankara",
      extras: [
        { label: "Kimlik kartı", value: "Silahlı özel güvenlik kimlik kartı, geçerlilik: 2028" },
        { label: "Askerlik", value: "Tamamlandı" },
        { label: "Vardiya", value: "Gece ve hafta sonu dahil vardiyalı çalışmaya uygun" },
      ],
    },
    summary:
      "AVM ve hastanede 7 yıllık silahlı özel güvenlik deneyimine sahip güvenlik görevlisiyim. Giriş kontrolü, kamera izleme, devriye ve acil durum prosedürlerinde çalıştım; son 2 yıldır 6 kişilik gece vardiyasında ekip şefliği yapıyorum.",
    experience: [
      {
        position: "Güvenlik Görevlisi / Vardiya Ekip Şefi",
        company: "Atlıhan Özel Güvenlik Hizmetleri A.Ş.",
        location: "Ankara",
        start: "Mar 2021",
        current: true,
        bullets: [
          "Özel bir hastanenin ana giriş ve acil servis noktalarında giriş kontrolü ve ziyaretçi yönlendirmesi yaptım.",
          "2023'ten bu yana 6 kişilik gece vardiyasının görev dağılımını, devriye çizelgesini ve vardiya teslim raporlarını yönettim.",
          "Acil servis girişinde gerginleşen durumları sözlü iletişimle yatıştırdım; gerektiğinde kolluk ile koordinasyonu sağladım.",
          "Yılda 2 kez yapılan yangın ve tahliye tatbikatlarında kat sorumlularıyla birlikte tahliyeyi **8 dakikanın altında** tamamladık.",
        ].join("\n"),
      },
      {
        position: "Güvenlik Görevlisi",
        company: "Ergazi Koruma ve Güvenlik Ltd. Şti.",
        location: "Ankara",
        start: "Nis 2018",
        end: "Şub 2021",
        bullets: [
          "Günde ortalama **15.000 ziyaretçinin** geldiği bir AVM girişinde X-ray cihazı ve el dedektörüyle kontrol yaptım.",
          "Kontrol odasında 60'tan fazla kamerayı izleyerek şüpheli durumları sahadaki ekibe telsizle bildirdim.",
          "Kayıp çocuk, şüpheli paket ve sağlık sorunu yaşayan ziyaretçi durumlarında prosedürü uygulayıp olay tutanağı tuttum.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Görevler", items: "Giriş ve ziyaretçi kontrolü, devriye, kamera izleme, araç kontrolü, olay tutanağı, vardiya teslimi" },
      { category: "Ekipman", items: "X-ray cihazı, kapı ve el tipi metal dedektör, kamera izleme sistemleri, telsiz, kartlı geçiş sistemi" },
      { category: "Acil durum", items: "Yangın ve tahliye prosedürleri, temel ilk yardım, kalabalık yönetimi" },
    ],
    education: [
      {
        school: "Anadolu Lisesi",
        degree: "Lise",
        location: "Ankara",
        start: "2009",
        end: "2013",
      },
    ],
    certifications: [
      { name: "Özel Güvenlik Temel Eğitimi (Silahlı)", issuer: "Özel güvenlik eğitim kurumu", date: "2018" },
      { name: "Özel Güvenlik Yenileme Eğitimi", issuer: "Özel güvenlik eğitim kurumu", date: "2023" },
      { name: "İlk Yardım Sertifikası", issuer: "Sağlık Bakanlığı onaylı eğitim merkezi", date: "2024" },
      { name: "Yangın Söndürme ve Tahliye Eğitimi", issuer: "Kurum içi eğitim", date: "2024" },
    ],
    references: [],
  },
});
