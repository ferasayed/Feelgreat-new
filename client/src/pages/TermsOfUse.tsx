import { useLanguage } from "@/contexts/LanguageContext";

const content: Record<string, { title: string; lastUpdated: string; sections: { heading: string; body: string }[] }> = {
  ar: {
    title: "شروط الاستخدام",
    lastUpdated: "آخر تحديث: يونيو 2026",
    sections: [
      { heading: "القبول بالشروط", body: "باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الموقع." },
      { heading: "طبيعة الخدمة", body: "هذا الموقع يقدم محتوى تعليمي وتثقيفي حول التغذية السلوكية والصحة المستدامة. المعلومات المقدمة هنا لأغراض تعليمية فقط ولا تُعد بديلاً عن الاستشارة الطبية المتخصصة. يجب استشارة طبيبك قبل البدء بأي برنامج غذائي أو صحي جديد." },
      { heading: "منهج فراس العايد™", body: "Feras Alayed Method™ هو برنامج تدريب شخصي في التغذية السلوكية وتغيير نمط الحياة. لا يُقدَّم كعلاج طبي أو نظام حصري من أي شركة مصنعة. المنتجات المستخدمة (مثل Feel Great) هي أدوات داعمة ضمن المنهج وليست المنهج نفسه." },
      { heading: "المنتجات والشراء", body: "المنتجات المذكورة في هذا الموقع تُباع من خلال Unicity International. عمليات الشراء تتم عبر موقع ufeelgreat.com وتخضع لشروط وسياسات Unicity International بما في ذلك سياسة الاسترداد خلال 60 يوماً." },
      { heading: "إخلاء المسؤولية الصحية", body: "النتائج تختلف من شخص لآخر. لا نضمن نتائج محددة. المعلومات المقدمة لا تهدف إلى تشخيص أو علاج أو الوقاية من أي مرض. استشر طبيبك دائماً قبل إجراء تغييرات على نظامك الغذائي أو الصحي." },
      { heading: "الملكية الفكرية", body: "جميع المحتويات على هذا الموقع بما في ذلك النصوص والصور والتصاميم والشعارات هي ملكية فكرية لمنصة فراس العايد. يُحظر نسخ أو إعادة نشر أي محتوى دون إذن كتابي مسبق." },
      { heading: "فرصة الشراكة", body: "فرصة الشراكة المقدمة هي فرصة عمل مستقلة مع Unicity International. النتائج المالية تعتمد على الجهد الفردي ولا نضمن دخلاً محدداً. يرجى مراجعة خطة التعويضات الرسمية من Unicity." },
      { heading: "تعديل الشروط", body: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. التعديلات تصبح سارية فور نشرها على هذه الصفحة." },
      { heading: "التواصل", body: "لأي استفسارات حول هذه الشروط، تواصل معنا عبر واتساب: +968 7702 0770 أو عبر البريد الإلكتروني: amegoooo@live.com" },
    ],
  },
  en: {
    title: "Terms of Use",
    lastUpdated: "Last Updated: June 2026",
    sections: [
      { heading: "Acceptance of Terms", body: "By using this website, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use the website." },
      { heading: "Nature of Service", body: "This website provides educational content about behavioral nutrition and sustainable health. The information provided here is for educational purposes only and is not a substitute for professional medical advice. Consult your doctor before starting any new dietary or health program." },
      { heading: "Feras Alayed Method\u2122", body: "The Feras Alayed Method\u2122 is a personal coaching program in behavioral nutrition and lifestyle change. It is not presented as medical treatment or an exclusive system from any manufacturer. Products used (such as Feel Great) are supportive tools within the method, not the method itself." },
      { heading: "Products and Purchases", body: "Products mentioned on this website are sold through Unicity International. Purchases are made via ufeelgreat.com and are subject to Unicity International's terms and policies, including a 60-day refund policy." },
      { heading: "Health Disclaimer", body: "Results vary from person to person. We do not guarantee specific results. The information provided is not intended to diagnose, treat, or prevent any disease. Always consult your doctor before making changes to your diet or health regimen." },
      { heading: "Intellectual Property", body: "All content on this website including text, images, designs, and logos are the intellectual property of the Feras Alayed platform. Copying or republishing any content without prior written permission is prohibited." },
      { heading: "Partnership Opportunity", body: "The partnership opportunity presented is an independent business opportunity with Unicity International. Financial results depend on individual effort and we do not guarantee specific income. Please review Unicity's official compensation plan." },
      { heading: "Modification of Terms", body: "We reserve the right to modify these terms at any time. Modifications become effective immediately upon posting on this page." },
      { heading: "Contact", body: "For any inquiries about these terms, contact us via WhatsApp: +968 7702 0770 or email: amegoooo@live.com" },
    ],
  },
  fr: {
    title: "Conditions d'Utilisation",
    lastUpdated: "Derni\u00e8re mise \u00e0 jour : Juin 2026",
    sections: [
      { heading: "Acceptation des conditions", body: "En utilisant ce site web, vous acceptez d'\u00eatre li\u00e9 par ces termes et conditions. Si vous n'acceptez pas une partie de ces conditions, veuillez ne pas utiliser le site." },
      { heading: "Nature du service", body: "Ce site fournit du contenu \u00e9ducatif sur la nutrition comportementale et la sant\u00e9 durable. Les informations fournies sont \u00e0 des fins \u00e9ducatives uniquement et ne remplacent pas un avis m\u00e9dical professionnel. Consultez votre m\u00e9decin avant de commencer tout nouveau programme alimentaire ou de sant\u00e9." },
      { heading: "M\u00e9thode Feras Alayed\u2122", body: "La M\u00e9thode Feras Alayed\u2122 est un programme de coaching personnel en nutrition comportementale et changement de mode de vie. Elle n'est pas pr\u00e9sent\u00e9e comme un traitement m\u00e9dical. Les produits utilis\u00e9s (comme Feel Great) sont des outils de soutien au sein de la m\u00e9thode." },
      { heading: "Produits et achats", body: "Les produits mentionn\u00e9s sur ce site sont vendus par Unicity International. Les achats se font via ufeelgreat.com et sont soumis aux conditions d'Unicity International, y compris une politique de remboursement de 60 jours." },
      { heading: "Avertissement sant\u00e9", body: "Les r\u00e9sultats varient d'une personne \u00e0 l'autre. Nous ne garantissons pas de r\u00e9sultats sp\u00e9cifiques. Les informations fournies ne visent pas \u00e0 diagnostiquer, traiter ou pr\u00e9venir une maladie. Consultez toujours votre m\u00e9decin." },
      { heading: "Propri\u00e9t\u00e9 intellectuelle", body: "Tout le contenu de ce site, y compris les textes, images, designs et logos, est la propri\u00e9t\u00e9 intellectuelle de la plateforme Feras Alayed. La copie ou la republication sans autorisation \u00e9crite pr\u00e9alable est interdite." },
      { heading: "Opportunit\u00e9 de partenariat", body: "L'opportunit\u00e9 de partenariat pr\u00e9sent\u00e9e est une opportunit\u00e9 d'affaires ind\u00e9pendante avec Unicity International. Les r\u00e9sultats financiers d\u00e9pendent de l'effort individuel. Veuillez consulter le plan de compensation officiel d'Unicity." },
      { heading: "Modification des conditions", body: "Nous nous r\u00e9servons le droit de modifier ces conditions \u00e0 tout moment. Les modifications prennent effet imm\u00e9diatement apr\u00e8s publication sur cette page." },
      { heading: "Contact", body: "Pour toute question concernant ces conditions, contactez-nous via WhatsApp : +968 7702 0770 ou par e-mail : amegoooo@live.com" },
    ],
  },
  es: {
    title: "T\u00e9rminos de Uso",
    lastUpdated: "\u00daltima actualizaci\u00f3n: Junio 2026",
    sections: [
      { heading: "Aceptaci\u00f3n de t\u00e9rminos", body: "Al usar este sitio web, acepta estar sujeto a estos t\u00e9rminos y condiciones. Si no est\u00e1 de acuerdo con alguna parte de estos t\u00e9rminos, por favor no use el sitio." },
      { heading: "Naturaleza del servicio", body: "Este sitio proporciona contenido educativo sobre nutrici\u00f3n conductual y salud sostenible. La informaci\u00f3n proporcionada es solo con fines educativos y no sustituye el consejo m\u00e9dico profesional. Consulte a su m\u00e9dico antes de comenzar cualquier programa nuevo." },
      { heading: "M\u00e9todo Feras Alayed\u2122", body: "El M\u00e9todo Feras Alayed\u2122 es un programa de coaching personal en nutrici\u00f3n conductual y cambio de estilo de vida. No se presenta como tratamiento m\u00e9dico. Los productos utilizados (como Feel Great) son herramientas de apoyo dentro del m\u00e9todo." },
      { heading: "Productos y compras", body: "Los productos mencionados en este sitio se venden a trav\u00e9s de Unicity International. Las compras se realizan en ufeelgreat.com y est\u00e1n sujetas a los t\u00e9rminos de Unicity International, incluyendo una pol\u00edtica de reembolso de 60 d\u00edas." },
      { heading: "Descargo de responsabilidad de salud", body: "Los resultados var\u00edan de persona a persona. No garantizamos resultados espec\u00edficos. La informaci\u00f3n proporcionada no pretende diagnosticar, tratar o prevenir ninguna enfermedad. Siempre consulte a su m\u00e9dico." },
      { heading: "Propiedad intelectual", body: "Todo el contenido de este sitio, incluyendo textos, im\u00e1genes, dise\u00f1os y logotipos, es propiedad intelectual de la plataforma Feras Alayed. Se proh\u00edbe copiar o republicar cualquier contenido sin permiso escrito previo." },
      { heading: "Oportunidad de asociaci\u00f3n", body: "La oportunidad de asociaci\u00f3n presentada es una oportunidad de negocio independiente con Unicity International. Los resultados financieros dependen del esfuerzo individual. Revise el plan de compensaci\u00f3n oficial de Unicity." },
      { heading: "Modificaci\u00f3n de t\u00e9rminos", body: "Nos reservamos el derecho de modificar estos t\u00e9rminos en cualquier momento. Las modificaciones entran en vigor inmediatamente despu\u00e9s de su publicaci\u00f3n en esta p\u00e1gina." },
      { heading: "Contacto", body: "Para cualquier consulta sobre estos t\u00e9rminos, cont\u00e1ctenos por WhatsApp: +968 7702 0770 o correo electr\u00f3nico: amegoooo@live.com" },
    ],
  },
  de: {
    title: "Nutzungsbedingungen",
    lastUpdated: "Letzte Aktualisierung: Juni 2026",
    sections: [
      { heading: "Annahme der Bedingungen", body: "Durch die Nutzung dieser Website erkl\u00e4ren Sie sich mit diesen Bedingungen einverstanden. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, nutzen Sie die Website bitte nicht." },
      { heading: "Art des Dienstes", body: "Diese Website bietet Bildungsinhalte \u00fcber Verhaltensern\u00e4hrung und nachhaltige Gesundheit. Die bereitgestellten Informationen dienen nur Bildungszwecken und ersetzen keine professionelle medizinische Beratung. Konsultieren Sie Ihren Arzt, bevor Sie ein neues Programm beginnen." },
      { heading: "Feras Alayed Methode\u2122", body: "Die Feras Alayed Methode\u2122 ist ein pers\u00f6nliches Coaching-Programm f\u00fcr Verhaltensern\u00e4hrung und Lebensstil\u00e4nderung. Sie wird nicht als medizinische Behandlung pr\u00e4sentiert. Verwendete Produkte (wie Feel Great) sind unterst\u00fctzende Werkzeuge innerhalb der Methode." },
      { heading: "Produkte und K\u00e4ufe", body: "Die auf dieser Website erw\u00e4hnten Produkte werden \u00fcber Unicity International verkauft. K\u00e4ufe erfolgen \u00fcber ufeelgreat.com und unterliegen den Bedingungen von Unicity International, einschlie\u00dflich einer 60-t\u00e4gigen R\u00fcckerstattungsrichtlinie." },
      { heading: "Gesundheitshaftungsausschluss", body: "Ergebnisse variieren von Person zu Person. Wir garantieren keine bestimmten Ergebnisse. Die bereitgestellten Informationen dienen nicht der Diagnose, Behandlung oder Vorbeugung von Krankheiten. Konsultieren Sie immer Ihren Arzt." },
      { heading: "Geistiges Eigentum", body: "Alle Inhalte auf dieser Website, einschlie\u00dflich Texte, Bilder, Designs und Logos, sind geistiges Eigentum der Feras Alayed Plattform. Das Kopieren oder Wiederveröffentlichen ohne vorherige schriftliche Genehmigung ist untersagt." },
      { heading: "Partnerschaftsm\u00f6glichkeit", body: "Die pr\u00e4sentierte Partnerschaftsm\u00f6glichkeit ist eine unabh\u00e4ngige Gesch\u00e4ftsm\u00f6glichkeit mit Unicity International. Finanzielle Ergebnisse h\u00e4ngen vom individuellen Einsatz ab. Bitte \u00fcberpr\u00fcfen Sie den offiziellen Verg\u00fctungsplan von Unicity." },
      { heading: "\u00c4nderung der Bedingungen", body: "Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu \u00e4ndern. \u00c4nderungen werden sofort nach Ver\u00f6ffentlichung auf dieser Seite wirksam." },
      { heading: "Kontakt", body: "F\u00fcr Fragen zu diesen Bedingungen kontaktieren Sie uns \u00fcber WhatsApp: +968 7702 0770 oder E-Mail: amegoooo@live.com" },
    ],
  },
  tr: {
    title: "Kullan\u0131m Ko\u015fullar\u0131",
    lastUpdated: "Son G\u00fcncelleme: Haziran 2026",
    sections: [
      { heading: "Ko\u015fullar\u0131n kabul\u00fc", body: "Bu web sitesini kullanarak, bu h\u00fck\u00fcm ve ko\u015fullara ba\u011fl\u0131 olmay\u0131 kabul edersiniz. Bu ko\u015fullar\u0131n herhangi bir b\u00f6l\u00fcm\u00fcn\u00fc kabul etmiyorsan\u0131z, l\u00fctfen siteyi kullanmay\u0131n." },
      { heading: "Hizmetin niteli\u011fi", body: "Bu web sitesi, davran\u0131\u015fsal beslenme ve s\u00fcrd\u00fcr\u00fclebilir sa\u011fl\u0131k hakk\u0131nda e\u011fitim i\u00e7eri\u011fi sa\u011flar. Sa\u011flanan bilgiler yaln\u0131zca e\u011fitim ama\u00e7l\u0131d\u0131r ve profesyonel t\u0131bbi tavsiyenin yerini almaz. Yeni bir programa ba\u015flamadan \u00f6nce doktorunuza dan\u0131\u015f\u0131n." },
      { heading: "Feras Alayed Metodu\u2122", body: "Feras Alayed Metodu\u2122, davran\u0131\u015fsal beslenme ve ya\u015fam tarz\u0131 de\u011fi\u015fikli\u011fi konusunda ki\u015fisel bir ko\u00e7luk program\u0131d\u0131r. T\u0131bbi tedavi olarak sunulmaz. Kullan\u0131lan \u00fcr\u00fcnler (Feel Great gibi) metot i\u00e7indeki destekleyici ara\u00e7lard\u0131r." },
      { heading: "\u00dcr\u00fcnler ve sat\u0131n almalar", body: "Bu sitede bahsedilen \u00fcr\u00fcnler Unicity International arac\u0131l\u0131\u011f\u0131yla sat\u0131lmaktad\u0131r. Sat\u0131n almalar ufeelgreat.com \u00fczerinden yap\u0131l\u0131r ve 60 g\u00fcnl\u00fck iade politikas\u0131 dahil Unicity International'\u0131n ko\u015fullar\u0131na tabidir." },
      { heading: "Sa\u011fl\u0131k sorumluluk reddi", body: "Sonu\u00e7lar ki\u015fiden ki\u015fiye de\u011fi\u015fir. Belirli sonu\u00e7lar\u0131 garanti etmiyoruz. Sa\u011flanan bilgiler herhangi bir hastal\u0131\u011f\u0131 te\u015fhis etmeyi, tedavi etmeyi veya \u00f6nlemeyi ama\u00e7lamaz. Her zaman doktorunuza dan\u0131\u015f\u0131n." },
      { heading: "Fikri m\u00fclkiyet", body: "Bu sitedeki t\u00fcm i\u00e7erik, metinler, g\u00f6rseller, tasar\u0131mlar ve logolar dahil, Feras Alayed platformunun fikri m\u00fclkiyetidir. \u00d6nceden yaz\u0131l\u0131 izin al\u0131nmadan kopyalanmas\u0131 veya yeniden yay\u0131nlanmas\u0131 yasakt\u0131r." },
      { heading: "Ortakl\u0131k f\u0131rsat\u0131", body: "Sunulan ortakl\u0131k f\u0131rsat\u0131, Unicity International ile ba\u011f\u0131ms\u0131z bir i\u015f f\u0131rsat\u0131d\u0131r. Finansal sonu\u00e7lar bireysel \u00e7abaya ba\u011fl\u0131d\u0131r. L\u00fctfen Unicity'nin resmi tazminat plan\u0131n\u0131 inceleyin." },
      { heading: "Ko\u015fullar\u0131n de\u011fi\u015ftirilmesi", body: "Bu ko\u015fullar\u0131 herhangi bir zamanda de\u011fi\u015ftirme hakk\u0131m\u0131z\u0131 sakl\u0131 tutuyoruz. De\u011fi\u015fiklikler bu sayfada yay\u0131nland\u0131ktan hemen sonra y\u00fcr\u00fcrl\u00fc\u011fe girer." },
      { heading: "\u0130leti\u015fim", body: "Bu ko\u015fullar hakk\u0131nda sorular\u0131n\u0131z i\u00e7in WhatsApp \u00fczerinden bize ula\u015f\u0131n: +968 7702 0770 veya e-posta: amegoooo@live.com" },
    ],
  },
};

export default function TermsOfUse() {
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
