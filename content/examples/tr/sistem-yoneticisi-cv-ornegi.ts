import { defineExample } from "../define";

export default defineExample({
  slug: "sistem-yoneticisi-cv-ornegi",
  title: "Sistem Yöneticisi CV Örneği",
  occupation: "Sistem Yöneticisi",
  category: "technology",
  experienceLevel: "senior",
  metaTitle: "Sistem Yöneticisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Linux, Windows Server ve sanallaştırma deneyimiyle kıdemli sistem yöneticisi CV örneği. Altyapı, yedekleme ve sertifika ipuçları; ücretsiz düzenle.",
  guide: {
    intro:
      "Bilgi işlem müdürleri kıdemli bir sistem yöneticisi CV'sinde önce altyapının büyüklüğünü, hangi platformlardan sorumlu olduğunu ve kesintisiz çalışmayı nasıl sağladığını arar. Bu örnek, 13 yıllık deneyime sahip bir sistem yöneticisinin üç farklı işyerindeki sorumluluklarını iki sayfayı aşmadan nasıl anlattığını gösteriyor.",
    sections: [
      {
        heading: "Özet: altyapının ölçeğini ilk cümlede ver",
        body: "Sistem yöneticisi özetinde \"sunucu ve ağ yönetimi\" demek yetmez; kaç sunucu, kaç kullanıcı, kaç lokasyon ve hangi platformlar olduğunu yaz. Linux ve Windows dengeni, sanallaştırma platformunu ve bulut deneyimini belirt.\n\nÖrneğin: \"Yaklaşık 350 sanal sunucu ve 1.800 kullanıcılı, iki veri merkezli hibrit altyapıdan sorumluyum.\" Bu tek cümle, seni daha küçük ölçekte çalışmış adaylardan hemen ayırır. Ekip yönetiyorsan kaç kişiyle çalıştığını da özete ekle.",
      },
      {
        heading: "Deneyim maddelerinde süreklilik ve otomasyon",
        body: "Bu meslekte en güçlü sonuçlar erişilebilirlik oranı, kesinti süresi, geri dönüş (restore) testleri, yama süreleri ve otomasyonla kazanılan zamandır. Her maddeyi bir sorun ve onun ölçülebilir çözümü olarak kur.\n\n- Zayıf: \"Yedekleme sistemlerinden sorumluydum.\"\n- Güçlü: \"3-2-1 kuralına göre yedekleme mimarisini yeniden kurdum ve üç ayda bir geri dönüş testi başlattım; kritik sistemlerde geri dönüş süresi **6 saatten 90 dakikaya** indi.\"\n\nKıdemli rollerde teknik işlerin yanında tedarikçi yönetimi, bütçe, değişiklik yönetimi ve denetim hazırlıklarını da yaz; bunlar seni operasyon personelinden ayırır.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "İlanlarda en sık aranan kelimeler: Linux (RHEL, Ubuntu), Windows Server, Active Directory, Group Policy, VMware vSphere, Hyper-V, Veeam, Microsoft 365, Azure veya AWS, Ansible, PowerShell, Bash, Zabbix veya PRTG, DNS, DHCP, güvenlik duvarı ve yük dengeleyici. Bunları \"İşletim sistemleri\", \"Sanallaştırma ve depolama\", \"Otomasyon\", \"İzleme\" gibi gruplara ayır.\n\nATS uyumu için sade bir şablon kullan ve platform adlarını resmî yazımıyla yaz. Sürüm bilgisi (örneğin vSphere 8) ilan istiyorsa eklenir; her araca sürüm yazmak gereksizdir.",
      },
      {
        heading: "Sertifikalar: üretici sertifikaları öne çıkar",
        body: "Sistem yönetiminde Red Hat (RHCSA, RHCE), VMware (VCP-DCV), Microsoft (Azure Administrator Associate) ve ITIL 4 Foundation gibi sertifikalar ilanlarda sıkça istenir. Sertifikanın adını, veren kurumu ve yılını yaz. Süresi dolan ya da yeniden sınav gerektiren sertifikalarda güncel olup olmadığını kontrol et; geçerliliği bitmiş bir sertifikayı \"geçerli\" gibi göstermek mülakatta sorun yaratır.",
      },
      {
        heading: "Nöbet, olay yönetimi ve dokümantasyon",
        body: "Kıdemli sistem yöneticilerinden mesai dışı nöbet, olay (incident) yönetimi ve kök neden analizi beklenir. Bir kesintiyi nasıl yönettiğini, sonrasında ne değiştirdiğini ve dokümantasyonu nasıl tuttuğunu bir maddede anlat. ISO 27001 veya bağımsız denetim süreçlerine katıldıysan bunu da ekle; özellikle finans ve sağlık sektöründeki işverenler bu deneyimi arar.\n\nFelaket kurtarma (DR) tatbikatı yaptıysan hedeflenen ve gerçekleşen geri dönüş sürelerini yaz; bu bilgi, yedekleme altyapısını yalnızca kurmadığını, gerçekten sınadığını gösterir.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- 15 yıllık her aracı listelemek: artık kullanmadığın eski sürümleri ve platformları çıkar.\n- İlk işlerin ayrıntısını son işinle aynı uzunlukta yazmak: eski rollere bir iki madde yeter.\n- İç IP adresi, sunucu adı veya güvenlik açığı ayrıntısı paylaşmak.\n- Sonucu yazmadan görev listelemek: \"yama yönetimi yapıldı\" yerine yama süresinin nasıl değiştiğini söyle.\n- CV'yi üç sayfaya uzatmak: kıdemli bir rol için bile iki sayfa yeterli.",
      },
    ],
  },
  content: {
    settings: {
      template: "ats",
      color: "#1e3a5f",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Murat Aydemir",
      title: "Kıdemli Sistem Yöneticisi",
      email: "murat.aydemir@ornek.com",
      phone: "0500 000 00 00",
      location: "İstanbul",
      linkedin: "linkedin.com/in/murataydemir-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "13 yıllık deneyime sahip sistem yöneticisiyim. Yaklaşık 350 sanal sunucu ve 1.800 kullanıcılı, iki veri merkezli hibrit altyapının işletiminden ve 4 kişilik sistem ekibinin yönetiminden sorumluyum. Linux ve Windows Server ortamlarında VMware sanallaştırma, Veeam yedekleme, Ansible otomasyonu ve Microsoft 365 / Azure geçişlerinde deneyimliyim; ISO 27001 denetim süreçlerini yürüttüm.",
    experience: [
      {
        position: "Kıdemli Sistem Yöneticisi",
        company: "Dorukhan Lojistik Holding A.Ş.",
        location: "İstanbul",
        start: "Haz 2020",
        current: true,
        bullets: [
          "İki veri merkezinde yaklaşık 350 sanal sunucudan oluşan VMware vSphere altyapısını yönetiyorum; kritik sistemlerde yıllık erişilebilirlik **%99,95** seviyesinde.",
          "3-2-1 kuralına göre Veeam yedekleme mimarisini yeniden kurdum ve üç ayda bir geri dönüş testi başlattım; kritik sistemlerde geri dönüş süresi **6 saatten 90 dakikaya** indi.",
          "1.800 kullanıcının e-posta ve dosya sunucularını Microsoft 365'e taşıyan projeyi yönettim; geçiş 4 ayda, iş saatlerinde kesinti yaşanmadan tamamlandı.",
          "Ansible ile Linux sunucu kurulumunu ve aylık yama sürecini otomatikleştirdim; yama döngüsü **10 iş gününden 3 iş gününe** düştü.",
          "4 kişilik sistem ekibinin nöbet planını, değişiklik yönetimini ve ISO 27001 denetim hazırlıklarını yürüttüm; son iki denetim büyük uygunsuzluk olmadan kapandı.",
        ].join("\n"),
      },
      {
        position: "Sistem Yöneticisi",
        company: "Ulupınar Sigorta Hizmetleri A.Ş.",
        location: "İstanbul",
        start: "Mar 2016",
        end: "May 2020",
        bullets: [
          "12 şubeli yapıda Active Directory, Group Policy, DNS ve DHCP hizmetlerini yönettim; şubelerdeki kullanıcı açılış süresini GPO düzenlemeleriyle **%40** kısalttım.",
          "Fiziksel sunucuların 60'ını Hyper-V'den VMware'e konsolide ederek enerji ve donanım bakım giderlerini yıllık **%25** azalttım.",
          "Zabbix ile merkezi izleme kurdum; disk, servis ve sertifika süresi uyarıları sayesinde planlanmamış kesintiler bir yılda **18'den 5'e** indi.",
          "PowerShell betikleriyle işe giriş ve çıkış hesap işlemlerini otomatikleştirerek yardım masasının haftalık iş yükünü yaklaşık 6 saat azalttım.",
        ].join("\n"),
      },
      {
        position: "Sistem ve Ağ Uzmanı",
        company: "Güneybey Tekstil San. ve Tic. A.Ş.",
        location: "Bursa",
        start: "Eyl 2013",
        end: "Şub 2016",
        bullets: [
          "Fabrika ve genel müdürlükteki 250 kullanıcılı Windows Server ve Linux ortamında sunucu, yazıcı ve ağ hizmetlerini yönettim.",
          "Üretim planlama sisteminin veritabanı sunucusu için günlük yedekleme ve aylık geri dönüş testi düzenini kurdum.",
          "Fabrika ağında VLAN yapılandırmasıyla ofis ve üretim ağlarını ayırdım; yayın (broadcast) kaynaklı yavaşlama şikâyetleri büyük ölçüde sona erdi.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "İşletim sistemleri", items: "Red Hat Enterprise Linux, Ubuntu Server, Windows Server 2016–2022" },
      { category: "Kimlik ve iş birliği", items: "Active Directory, Group Policy, Microsoft Entra ID, Exchange Online, Microsoft 365" },
      { category: "Sanallaştırma ve depolama", items: "VMware vSphere, Hyper-V, Veeam Backup & Replication, SAN/NAS yönetimi" },
      { category: "Otomasyon ve izleme", items: "Ansible, PowerShell, Bash, Zabbix, Grafana" },
      { category: "Ağ ve güvenlik", items: "DNS, DHCP, VLAN, VPN, güvenlik duvarı kural yönetimi, yama yönetimi" },
      { category: "Süreç", items: "ITIL tabanlı olay ve değişiklik yönetimi, ISO 27001 denetimleri, tedarikçi yönetimi" },
    ],
    education: [
      {
        school: "Kocaeli Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2009",
        end: "2013",
      },
    ],
    certifications: [
      { name: "Red Hat Certified System Administrator (RHCSA)", issuer: "Red Hat", date: "2022" },
      { name: "VMware Certified Professional – Data Center Virtualization (VCP-DCV)", issuer: "VMware", date: "2021" },
      { name: "Microsoft Certified: Azure Administrator Associate", issuer: "Microsoft", date: "2023" },
      { name: "ITIL 4 Foundation", issuer: "PeopleCert", date: "2022" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – Orta üstü" }],
    references: [],
  },
});
