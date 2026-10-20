import { defineExample } from "../define";

export default defineExample({
  slug: "devops-muhendisi-cv-ornegi",
  title: "DevOps Mühendisi CV Örneği",
  occupation: "DevOps Mühendisi",
  category: "technology",
  experienceLevel: "mid",
  metaTitle: "DevOps Mühendisi CV Örneği ve Yazım Rehberi",
  metaDescription:
    "Kubernetes, Terraform ve CI/CD deneyimiyle yazılmış DevOps mühendisi CV örneği. Dağıtım, maliyet ve gözlemlenebilirlik maddeleri için ipuçları.",
  guide: {
    intro:
      "DevOps ilanlarını değerlendiren platform ve altyapı yöneticileri CV'de önce hangi bulut ve orkestrasyon araçlarını kullandığına, sonra bunlarla geliştirici ekiplerin işini ne kadar hızlandırdığına bakar. Bu örnek, sistem yönetiminden DevOps'a geçmiş 7 yıllık bir mühendisin dağıtım, güvenilirlik ve maliyet sonuçlarını tek sayfada nasıl gösterdiğini anlatıyor.",
    sections: [
      {
        heading: "Özet: platformu ve ölçeği tanımla",
        body: "DevOps özetinde araç saymak yerine sorumlu olduğun platformu tarif et: kaç küme, kaç servis, hangi bulut, kaç geliştiriciye hizmet veren bir altyapı. Ardından en güçlü iki üç aracı (Kubernetes, Terraform, GitLab CI gibi) ve seni ayıran bir sonucu yaz.\n\nÖrneğin: \"AWS üzerinde 3 EKS kümesinde çalışan 120 servisin dağıtım hattından ve gözlemlenebilirlik altyapısından sorumluyum.\" Bu cümle, ilanı yazan kişinin aradığı ölçeği tek seferde verir.",
      },
      {
        heading: "Maddelerde DORA metriklerini ve maliyeti kullan",
        body: "DevOps işinin sonucu çoğunlukla geliştirici ekiplerin hızında ve sistemin kararlılığında görünür. Dağıtım sıklığı, değişiklik için geçen süre, değişiklik kaynaklı hata oranı ve hizmeti geri getirme süresi (DORA metrikleri) bu iş için en anlaşılır ölçütlerdir. Bulut maliyetindeki değişim de güçlü bir kanıttır.\n\n- Zayıf: \"CI/CD süreçlerini yönettim.\"\n- Güçlü: \"GitLab CI hatlarını paralel test ve önbellek kullanacak şekilde yeniden kurdum; ortalama hat süresi **24 dakikadan 9 dakikaya** indi.\"\n\nRakamları gözlemlenebilirlik panellerinden veya fatura raporlarından al; tahmini değerleri kesinmiş gibi yazma.",
      },
      {
        heading: "Yetkinlikler ve ATS anahtar kelimeleri",
        body: "Yetkinlikleri bulut, konteyner ve orkestrasyon, altyapı kodu (IaC), CI/CD, gözlemlenebilirlik ve betik dilleri olarak grupla. İlanlarda en sık geçen ifadeler şunlardır: AWS, Azure, GCP, Kubernetes, Helm, Docker, Terraform, Ansible, GitLab CI, GitHub Actions, Jenkins, Argo CD, GitOps, Prometheus, Grafana, Loki, ELK, Linux, Bash, Python, Go.\n\nİlandaki yazıma sadık kal ve bir aracın hangi sürümüyle ya da hangi ölçekte çalıştığını maddelerde göster. On beş araçlık bir listeden çok, üç aracı derinlemesine bildiğini gösteren maddeler daha ikna edicidir.",
      },
      {
        heading: "Sertifikalar ne zaman işe yarar?",
        body: "DevOps alanında sertifikalar, özellikle iş değiştirirken ya da danışmanlık şirketlerine başvururken öne çıkar. Certified Kubernetes Administrator (CKA), HashiCorp Terraform Associate ve bulut sağlayıcılarının associate düzeyindeki sertifikaları en çok istenenlerdir. Sertifikayı tarihiyle yaz; süreli sertifikalarda geçerliliğin devam ettiğinden emin ol.\n\nSertifika, deneyim maddelerinin yerine geçmez. Bir sertifikayı listeliyorsan o teknolojiyi canlı ortamda nasıl kullandığını da bir maddede göster.",
      },
      {
        heading: "Olay yönetimi, nöbet ve güvenlik",
        body: "DevOps mühendislerinden mesai dışı nöbet ve olay yönetimi beklenir. Bir kesintiyi nasıl tespit ettiğini, ne kadar sürede çözdüğünü ve sonrasında hangi alarmı ya da süreci değiştirdiğini anlatan bir madde, uzun bir araç listesinden daha değerlidir.\n\nGüvenlik tarafında gizli bilgi yönetimi (Vault, bulut sağlayıcısının secret servisleri), imaj taraması ve en az yetki ilkesine göre IAM düzenlemesi yaptıysan bunu ayrı bir maddede yaz; birçok ilanda DevSecOps beklentisi artık açıkça yer alıyor.",
      },
      {
        heading: "Sık yapılan hatalar",
        body: "- Yalnızca araç adlarını sıralamak: hangi sorunu çözdüğünü ve sonucunu yazmadan liste anlam taşımaz.\n- İç IP adresi, hesap numarası veya güvenlik açığı ayrıntısı paylaşmak.\n- Ekibin işini tek başına yapmış gibi anlatmak: rolünü net yaz, \"ekiple birlikte\" demekten çekinme.\n- Artık kullanmadığın eski araçları öne koymak: güncel yığını başa al.\n- Nöbet ve olay yönetimi deneyimini atlamak: bu rolde aranan temel bilgilerden biridir.",
      },
    ],
  },
  content: {
    settings: {
      template: "compact",
      color: "#0e7490",
      showPhoto: false,
      locale: "tr",
      hiddenSections: ["references"],
    },
    personal: {
      name: "Onur Tekgül",
      title: "DevOps Mühendisi",
      email: "onur.tekgul@ornek.com",
      phone: "0500 000 00 00",
      location: "İzmir",
      linkedin: "linkedin.com/in/onurtekgul-ornek",
      github: "github.com/onurtekgul-ornek",
      extras: [{ label: "Askerlik", value: "Tamamlandı" }],
    },
    summary:
      "2 yılı Linux sistem yönetiminde olmak üzere 7 yıllık deneyime sahip DevOps mühendisiyim. AWS üzerinde 3 EKS kümesinde çalışan yaklaşık 120 servisin dağıtım hattından, Terraform ile yönetilen altyapısından ve gözlemlenebilirlik araçlarından sorumluyum. Geliştirici ekiplerin kendi servislerini güvenle canlıya alabileceği ortak şablonlar ve otomasyonlar kuruyorum.",
    experience: [
      {
        position: "DevOps Mühendisi",
        company: "Rüzgârgülü Yazılım A.Ş.",
        location: "İzmir (hibrit)",
        start: "Oca 2023",
        current: true,
        bullets: [
          "Servislerin dağıtımını Helm şablonları ve Argo CD ile GitOps modeline taşıdım; haftalık dağıtım sayısı **15'ten 70'e** çıktı, geri alma süresi birkaç dakikaya indi.",
          "GitLab CI hatlarını paralel test ve önbellek kullanacak şekilde yeniden kurdum; ortalama hat süresi **24 dakikadan 9 dakikaya** indi.",
          "Kullanılmayan kaynakları temizleyip iş yüklerinin bir kısmını spot instance'lara taşıdım; aylık AWS maliyeti **%28** azaldı.",
          "Prometheus, Grafana ve Loki ile servis bazlı paneller ve SLO alarmları kurdum; kritik olaylarda ortalama tespit süresi **25 dakikadan 6 dakikaya** düştü.",
          "6 kişilik nöbet rotasyonunda yer alıyor, olay sonrası kök neden analizlerini yazıyorum.",
        ].join("\n"),
      },
      {
        position: "DevOps Mühendisi",
        company: "Körfez Bulut Hizmetleri Ltd.",
        location: "İzmir",
        start: "Haz 2021",
        end: "Ara 2022",
        bullets: [
          "Müşteri ortamlarının elle kurulan AWS kaynaklarını Terraform modüllerine dönüştürdüm; yeni ortam kurulumu **2 günden 3 saate** indi.",
          "Jenkins üzerinde çalışan 40'tan fazla işi GitLab CI'a taşıyan projeyi yürüttüm.",
          "Konteyner imajlarına Trivy taraması ekleyerek yüksek riskli açıkların canlıya çıkmadan yakalanmasını sağladım.",
        ].join("\n"),
      },
      {
        position: "Linux Sistem Yöneticisi",
        company: "Ege Veri Merkezi Hizmetleri A.Ş.",
        location: "İzmir",
        start: "Tem 2019",
        end: "May 2021",
        bullets: [
          "300'ü aşkın Linux sunucunun yama ve yapılandırma işlerini Ansible ile otomatikleştirdim; aylık yama süresi **4 günden 1 güne** indi.",
          "Zabbix izleme kurallarını sadeleştirerek gereksiz alarm sayısını yarıya düşürdüm.",
          "İlk Docker tabanlı test ortamını geliştirici ekiple birlikte kurarak konteyner ve CI süreçlerine geçişi başlattım.",
        ].join("\n"),
      },
    ],
    skills: [
      { category: "Bulut", items: "AWS (EKS, EC2, RDS, S3, IAM, CloudWatch), temel Azure" },
      { category: "Konteyner ve orkestrasyon", items: "Kubernetes, Helm, Docker, Argo CD" },
      { category: "Altyapı kodu ve otomasyon", items: "Terraform, Ansible, Bash, Python, Go (temel)" },
      { category: "CI/CD", items: "GitLab CI, GitHub Actions, Jenkins" },
      { category: "Gözlemlenebilirlik ve güvenlik", items: "Prometheus, Grafana, Loki, Zabbix, Trivy, HashiCorp Vault" },
    ],
    education: [
      {
        school: "Dokuz Eylül Üniversitesi",
        field: "Bilgisayar Mühendisliği",
        degree: "Lisans",
        start: "2014",
        end: "2019",
      },
    ],
    certifications: [
      { name: "Certified Kubernetes Administrator (CKA)", issuer: "The Linux Foundation", date: "2024" },
      { name: "HashiCorp Certified: Terraform Associate", issuer: "HashiCorp", date: "2023" },
      { name: "AWS Certified Solutions Architect – Associate", issuer: "Amazon Web Services", date: "2022" },
    ],
    languages: [{ language: "İngilizce", level: "B2 – İyi" }],
    references: [],
    interests: "Ev laboratuvarı (homelab), yelken, açık kaynak katkısı",
  },
});
