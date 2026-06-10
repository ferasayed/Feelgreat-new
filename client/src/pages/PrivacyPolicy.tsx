import { useLanguage } from "@/contexts/LanguageContext";

const content: Record<string, { title: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: يونيو 2026",
    sections: [
      { heading: "مقدمة", body: "نحن في منصة فراس العايد (\"المنصة\") نلتزم بحماية خصوصيتك. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية عند استخدامك لموقعنا وخدماتنا." },
      { heading: "المعلومات التي نجمعها", body: "نجمع المعلومات التالية: الاسم الكامل، رقم الواتساب، البريد الإلكتروني (اختياري)، الدولة (اختياري)، بيانات التصفح (ملفات تعريف الارتباط، عنوان IP)، والمحادثات مع المساعد الذكي. نجمع هذه المعلومات عند تسجيلك أو تواصلك معنا." },
      { heading: "كيف نستخدم معلوماتك", body: "نستخدم معلوماتك لـ: التواصل معك بخصوص خدماتنا، تقديم استشارات صحية مخصصة، تحسين تجربتك على الموقع، إرسال محتوى تعليمي ذي صلة، وتحليل أداء الموقع. لن نبيع أو نشارك معلوماتك مع أطراف ثالثة لأغراض تسويقية." },
      { heading: "ملفات تعريف الارتباط (Cookies)", body: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك، تتبع الزيارات عبر Google Analytics، وتفعيل بكسلات إعادة الاستهداف (Meta، TikTok، Snapchat). يمكنك تعطيل ملفات تعريف الارتباط من إعدادات متصفحك." },
      { heading: "حماية البيانات", body: "نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. نستخدم تشفير SSL لجميع البيانات المنقولة." },
      { heading: "حقوقك", body: "لديك الحق في: الوصول إلى بياناتك الشخصية، طلب تصحيح أو حذف بياناتك، الانسحاب من القوائم البريدية في أي وقت، وطلب نسخة من بياناتك. للاستفسار، تواصل معنا عبر واتساب: +968 7702 0770." },
      { heading: "التغييرات على هذه السياسة", body: "قد نحدّث هذه السياسة من وقت لآخر. سننشر أي تغييرات على هذه الصفحة مع تحديث تاريخ \"آخر تحديث\"." },
    ],
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: June 2026",
    sections: [
      { heading: "Introduction", body: "At the Feras Alayed platform (\"Platform\"), we are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you use our website and services." },
      { heading: "Information We Collect", body: "We collect the following information: full name, WhatsApp number, email address (optional), country (optional), browsing data (cookies, IP address), and conversations with our AI assistant. We collect this information when you register or communicate with us." },
      { heading: "How We Use Your Information", body: "We use your information to: communicate with you about our services, provide personalized health consultations, improve your website experience, send relevant educational content, and analyze website performance. We will not sell or share your information with third parties for marketing purposes." },
      { heading: "Cookies", body: "We use cookies to improve your experience, track visits via Google Analytics, and enable retargeting pixels (Meta, TikTok, Snapchat). You can disable cookies from your browser settings." },
      { heading: "Data Protection", body: "We take appropriate security measures to protect your information from unauthorized access, modification, disclosure, or destruction. We use SSL encryption for all transmitted data." },
      { heading: "Your Rights", body: "You have the right to: access your personal data, request correction or deletion of your data, opt out of mailing lists at any time, and request a copy of your data. For inquiries, contact us via WhatsApp: +968 7702 0770." },
      { heading: "Changes to This Policy", body: "We may update this policy from time to time. Any changes will be posted on this page with an updated \"Last Updated\" date." },
    ],
  },
  fr: {
    title: "Politique de Confidentialit\u00e9",
    lastUpdated: "Derni\u00e8re mise \u00e0 jour : Juin 2026",
    sections: [
      { heading: "Introduction", body: "Chez la plateforme Feras Alayed (\u00abPlateforme\u00bb), nous nous engageons \u00e0 prot\u00e9ger votre vie priv\u00e9e. Cette politique explique comment nous collectons, utilisons et prot\u00e9geons vos informations personnelles lorsque vous utilisez notre site web et nos services." },
      { heading: "Informations que nous collectons", body: "Nous collectons les informations suivantes : nom complet, num\u00e9ro WhatsApp, adresse e-mail (facultatif), pays (facultatif), donn\u00e9es de navigation (cookies, adresse IP) et conversations avec notre assistant IA." },
      { heading: "Comment nous utilisons vos informations", body: "Nous utilisons vos informations pour : communiquer avec vous concernant nos services, fournir des consultations de sant\u00e9 personnalis\u00e9es, am\u00e9liorer votre exp\u00e9rience sur le site, envoyer du contenu \u00e9ducatif pertinent et analyser les performances du site. Nous ne vendrons ni ne partagerons vos informations avec des tiers \u00e0 des fins marketing." },
      { heading: "Cookies", body: "Nous utilisons des cookies pour am\u00e9liorer votre exp\u00e9rience, suivre les visites via Google Analytics et activer les pixels de reciblage (Meta, TikTok, Snapchat). Vous pouvez d\u00e9sactiver les cookies depuis les param\u00e8tres de votre navigateur." },
      { heading: "Protection des donn\u00e9es", body: "Nous prenons des mesures de s\u00e9curit\u00e9 appropri\u00e9es pour prot\u00e9ger vos informations contre tout acc\u00e8s non autoris\u00e9, modification, divulgation ou destruction. Nous utilisons le chiffrement SSL pour toutes les donn\u00e9es transmises." },
      { heading: "Vos droits", body: "Vous avez le droit de : acc\u00e9der \u00e0 vos donn\u00e9es personnelles, demander la correction ou la suppression de vos donn\u00e9es, vous d\u00e9sinscrire des listes de diffusion \u00e0 tout moment et demander une copie de vos donn\u00e9es. Pour toute question, contactez-nous via WhatsApp : +968 7702 0770." },
      { heading: "Modifications de cette politique", body: "Nous pouvons mettre \u00e0 jour cette politique de temps en temps. Tout changement sera publi\u00e9 sur cette page avec une date de \u00abDerni\u00e8re mise \u00e0 jour\u00bb actualis\u00e9e." },
    ],
  },
  es: {
    title: "Pol\u00edtica de Privacidad",
    lastUpdated: "\u00daltima actualizaci\u00f3n: Junio 2026",
    sections: [
      { heading: "Introducci\u00f3n", body: "En la plataforma Feras Alayed (\u00abPlataforma\u00bb), nos comprometemos a proteger su privacidad. Esta pol\u00edtica explica c\u00f3mo recopilamos, usamos y protegemos su informaci\u00f3n personal cuando utiliza nuestro sitio web y servicios." },
      { heading: "Informaci\u00f3n que recopilamos", body: "Recopilamos la siguiente informaci\u00f3n: nombre completo, n\u00famero de WhatsApp, correo electr\u00f3nico (opcional), pa\u00eds (opcional), datos de navegaci\u00f3n (cookies, direcci\u00f3n IP) y conversaciones con nuestro asistente de IA." },
      { heading: "C\u00f3mo usamos su informaci\u00f3n", body: "Usamos su informaci\u00f3n para: comunicarnos con usted sobre nuestros servicios, proporcionar consultas de salud personalizadas, mejorar su experiencia en el sitio web, enviar contenido educativo relevante y analizar el rendimiento del sitio. No venderemos ni compartiremos su informaci\u00f3n con terceros con fines de marketing." },
      { heading: "Cookies", body: "Usamos cookies para mejorar su experiencia, rastrear visitas a trav\u00e9s de Google Analytics y habilitar p\u00edxeles de retargeting (Meta, TikTok, Snapchat). Puede desactivar las cookies desde la configuraci\u00f3n de su navegador." },
      { heading: "Protecci\u00f3n de datos", body: "Tomamos medidas de seguridad apropiadas para proteger su informaci\u00f3n contra acceso no autorizado, modificaci\u00f3n, divulgaci\u00f3n o destrucci\u00f3n. Usamos cifrado SSL para todos los datos transmitidos." },
      { heading: "Sus derechos", body: "Tiene derecho a: acceder a sus datos personales, solicitar la correcci\u00f3n o eliminaci\u00f3n de sus datos, darse de baja de las listas de correo en cualquier momento y solicitar una copia de sus datos. Para consultas, cont\u00e1ctenos por WhatsApp: +968 7702 0770." },
      { heading: "Cambios en esta pol\u00edtica", body: "Podemos actualizar esta pol\u00edtica de vez en cuando. Cualquier cambio se publicar\u00e1 en esta p\u00e1gina con una fecha de \u00ab\u00daltima actualizaci\u00f3n\u00bb actualizada." },
    ],
  },
  de: {
    title: "Datenschutzrichtlinie",
    lastUpdated: "Letzte Aktualisierung: Juni 2026",
    sections: [
      { heading: "Einleitung", body: "Bei der Feras Alayed Plattform (\u00abPlattform\u00bb) verpflichten wir uns, Ihre Privatsph\u00e4re zu sch\u00fctzen. Diese Richtlinie erkl\u00e4rt, wie wir Ihre pers\u00f6nlichen Daten erfassen, verwenden und sch\u00fctzen, wenn Sie unsere Website und Dienste nutzen." },
      { heading: "Informationen, die wir erfassen", body: "Wir erfassen folgende Informationen: vollst\u00e4ndiger Name, WhatsApp-Nummer, E-Mail-Adresse (optional), Land (optional), Browsing-Daten (Cookies, IP-Adresse) und Gespr\u00e4che mit unserem KI-Assistenten." },
      { heading: "Wie wir Ihre Informationen verwenden", body: "Wir verwenden Ihre Informationen um: mit Ihnen \u00fcber unsere Dienste zu kommunizieren, personalisierte Gesundheitsberatungen anzubieten, Ihre Website-Erfahrung zu verbessern, relevante Bildungsinhalte zu senden und die Website-Leistung zu analysieren. Wir werden Ihre Informationen nicht an Dritte zu Marketingzwecken verkaufen oder weitergeben." },
      { heading: "Cookies", body: "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern, Besuche \u00fcber Google Analytics zu verfolgen und Retargeting-Pixel (Meta, TikTok, Snapchat) zu aktivieren. Sie k\u00f6nnen Cookies in Ihren Browsereinstellungen deaktivieren." },
      { heading: "Datenschutz", body: "Wir ergreifen angemessene Sicherheitsma\u00dfnahmen, um Ihre Informationen vor unbefugtem Zugriff, \u00c4nderung, Offenlegung oder Zerst\u00f6rung zu sch\u00fctzen. Wir verwenden SSL-Verschl\u00fcsselung f\u00fcr alle \u00fcbertragenen Daten." },
      { heading: "Ihre Rechte", body: "Sie haben das Recht: auf Ihre pers\u00f6nlichen Daten zuzugreifen, die Berichtigung oder L\u00f6schung Ihrer Daten zu beantragen, sich jederzeit von Mailinglisten abzumelden und eine Kopie Ihrer Daten anzufordern. F\u00fcr Anfragen kontaktieren Sie uns \u00fcber WhatsApp: +968 7702 0770." },
      { heading: "\u00c4nderungen dieser Richtlinie", body: "Wir k\u00f6nnen diese Richtlinie von Zeit zu Zeit aktualisieren. \u00c4nderungen werden auf dieser Seite mit einem aktualisierten Datum der \u00abLetzten Aktualisierung\u00bb ver\u00f6ffentlicht." },
    ],
  },
  tr: {
    title: "Gizlilik Politikas\u0131",
    lastUpdated: "Son G\u00fcncelleme: Haziran 2026",
    sections: [
      { heading: "Giri\u015f", body: "Feras Alayed platformunda (\u00abPlatform\u00bb), gizlili\u011finizi korumaya kararl\u0131y\u0131z. Bu politika, web sitemizi ve hizmetlerimizi kulland\u0131\u011f\u0131n\u0131zda ki\u015fisel bilgilerinizi nas\u0131l toplad\u0131\u011f\u0131m\u0131z\u0131, kulland\u0131\u011f\u0131m\u0131z\u0131 ve korudu\u011fumuzu a\u00e7\u0131klar." },
      { heading: "Toplad\u0131\u011f\u0131m\u0131z bilgiler", body: "\u015eu bilgileri topluyoruz: tam ad, WhatsApp numaras\u0131, e-posta adresi (iste\u011fe ba\u011fl\u0131), \u00fclke (iste\u011fe ba\u011fl\u0131), g\u00f6zat\u0131m verileri (\u00e7erezler, IP adresi) ve yapay zeka asistan\u0131m\u0131zla yap\u0131lan konu\u015fmalar." },
      { heading: "Bilgilerinizi nas\u0131l kullan\u0131yoruz", body: "Bilgilerinizi \u015funlar i\u00e7in kullan\u0131yoruz: hizmetlerimiz hakk\u0131nda sizinle ileti\u015fim kurmak, ki\u015fisel sa\u011fl\u0131k dan\u0131\u015fmanl\u0131klar\u0131 sa\u011flamak, web sitesi deneyiminizi iyile\u015ftirmek, ilgili e\u011fitim i\u00e7eri\u011fi g\u00f6ndermek ve web sitesi performans\u0131n\u0131 analiz etmek. Bilgilerinizi pazarlama ama\u00e7l\u0131 \u00fc\u00e7\u00fcnc\u00fc taraflara satmayaca\u011f\u0131z veya payla\u015fmayaca\u011f\u0131z." },
      { heading: "\u00c7erezler", body: "Deneyiminizi iyile\u015ftirmek, Google Analytics arac\u0131l\u0131\u011f\u0131yla ziyaretleri izlemek ve yeniden hedefleme piksellerini (Meta, TikTok, Snapchat) etkinle\u015ftirmek i\u00e7in \u00e7erezler kullan\u0131yoruz. \u00c7erezleri taray\u0131c\u0131 ayarlar\u0131n\u0131zdan devre d\u0131\u015f\u0131 b\u0131rakabilirsiniz." },
      { heading: "Veri koruma", body: "Bilgilerinizi yetkisiz eri\u015fim, de\u011fi\u015fiklik, if\u015fa veya imhaya kar\u015f\u0131 korumak i\u00e7in uygun g\u00fcvenlik \u00f6nlemleri al\u0131yoruz. T\u00fcm iletilen veriler i\u00e7in SSL \u015fifreleme kullan\u0131yoruz." },
      { heading: "Haklar\u0131n\u0131z", body: "\u015eu haklara sahipsiniz: ki\u015fisel verilerinize eri\u015fmek, verilerinizin d\u00fczeltilmesini veya silinmesini talep etmek, istedi\u011finiz zaman posta listelerinden \u00e7\u0131kmak ve verilerinizin bir kopyas\u0131n\u0131 talep etmek. Sorular\u0131n\u0131z i\u00e7in WhatsApp \u00fczerinden bize ula\u015f\u0131n: +968 7702 0770." },
      { heading: "Bu politikadaki de\u011fi\u015fiklikler", body: "Bu politikay\u0131 zaman zaman g\u00fcncelleyebiliriz. De\u011fi\u015fiklikler bu sayfada g\u00fcncellenmi\u015f bir \u00abSon G\u00fcncelleme\u00bb tarihi ile yay\u0131nlanacakt\u0131r." },
    ],
  },
};

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{c.title}</h1>
        <p className="text-white/40 text-sm mb-12">{c.lastUpdated}</p>
        <div className="space-y-8">
          {c.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold text-white/90 mb-3">{s.heading}</h2>
              <p className="text-white/60 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
