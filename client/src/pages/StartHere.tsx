import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Flame, Heart, Rocket, CheckCircle, Phone, MessageCircle } from "lucide-react";

const content: Record<string, {
  pageTitle: string;
  pageSubtitle: string;
  stepsTitle: string;
  steps: { num: string; title: string; desc: string; cta: string; link: string }[];
  methodTitle: string;
  methodSubtitle: string;
  phases: { icon: string; title: string; items: string[] }[];
  disclaimer: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn: string;
  ctaWhatsApp: string;
}> = {
  ar: {
    pageTitle: "ابدأ هنا",
    pageSubtitle: "مسارك واضح من 3 خطوات — اقرأها بدقيقتين واعرف وش تسوي",
    stepsTitle: "خطواتك الثلاث",
    steps: [
      { num: "1", title: "اكتشف وضعك الصحي", desc: "أجب على اختبار سريع لتعرف مستوى مقاومة الإنسولين لديك وهل برنامجنا مناسب لك.", cta: "ابدأ الاختبار", link: "/health-assessment" },
      { num: "2", title: "تعرّف على المنهج", desc: "اقرأ عن منهج فراس العايد™ المكوّن من 4 مراحل للتحول الصحي المستدام خلال 90 يوم.", cta: "اقرأ عن المنهج", link: "#method" },
      { num: "3", title: "تواصل مع فراس", desc: "احجز مكالمة تعريفية مجانية أو أرسل رسالة واتساب لنبدأ رحلتك.", cta: "تواصل الآن", link: "https://wa.me/96877020770?text=أرغب بمعرفة المزيد عن منهج فراس العايد للتحول الصحي" },
    ],
    methodTitle: "Feras Alayed Method™",
    methodSubtitle: "منهج التحول الصحي المستدام — 90 يوم",
    phases: [
      { icon: "brain", title: "المرحلة 1: الوعي", items: ["تقييم صحي شامل", "تحليل نمط الحياة", "تحديد المحفزات السلوكية"] },
      { icon: "flame", title: "المرحلة 2: إعادة الضبط الأيضي", items: ["استراتيجية التغذية", "إرشاد الصيام المتقطع", "دمج Feel Great"] },
      { icon: "heart", title: "المرحلة 3: التحول المستدام", items: ["بناء العادات", "المتابعة والمساءلة", "الاستمرارية طويلة المدى"] },
      { icon: "rocket", title: "المرحلة 4: النمو والتمكين", items: ["القيادة الذاتية", "التطوير الشخصي", "بناء الفرص"] },
    ],
    disclaimer: "هذا المنهج هو برنامج تدريب شخصي في التغذية السلوكية وتغيير نمط الحياة — وليس علاجاً طبياً. المنتجات المستخدمة هي أدوات داعمة ضمن النظام.",
    ctaTitle: "جاهز تبدأ تحولك؟",
    ctaDesc: "تواصل مع فراس العايد مباشرة عبر واتساب أو احجز مكالمة تعريفية مجانية.",
    ctaBtn: "احجز مكالمة مجانية",
    ctaWhatsApp: "أرسل واتساب",
  },
  en: {
    pageTitle: "Start Here",
    pageSubtitle: "Your clear 3-step path — read it in 2 minutes and know exactly what to do",
    stepsTitle: "Your Three Steps",
    steps: [
      { num: "1", title: "Discover Your Health Status", desc: "Take a quick assessment to understand your insulin resistance level and whether our program is right for you.", cta: "Take the Assessment", link: "/health-assessment" },
      { num: "2", title: "Learn the Method", desc: "Read about the Feras Alayed Method™ — a 4-phase system for sustainable health transformation in 90 days.", cta: "Learn the Method", link: "#method" },
      { num: "3", title: "Connect With Feras", desc: "Book a free discovery call or send a WhatsApp message to start your journey.", cta: "Connect Now", link: "https://wa.me/96877020770?text=I'd like to learn more about the Feras Alayed Method" },
    ],
    methodTitle: "Feras Alayed Method™",
    methodSubtitle: "90-Day Sustainable Health Transformation",
    phases: [
      { icon: "brain", title: "Phase 1: Awareness", items: ["Health Assessment", "Lifestyle Evaluation", "Behavioral Triggers"] },
      { icon: "flame", title: "Phase 2: Metabolic Reset", items: ["Nutrition Strategy", "Intermittent Fasting Guidance", "Feel Great Integration"] },
      { icon: "heart", title: "Phase 3: Sustainable Transformation", items: ["Habit Building", "Accountability", "Long-Term Maintenance"] },
      { icon: "rocket", title: "Phase 4: Growth & Empowerment", items: ["Leadership", "Personal Development", "Opportunity Building"] },
    ],
    disclaimer: "This method is a personal coaching program in behavioral nutrition and lifestyle change — not a medical treatment. Products used are supportive tools within the system.",
    ctaTitle: "Ready to Start Your Transformation?",
    ctaDesc: "Connect with Feras Alayed directly via WhatsApp or book a free discovery call.",
    ctaBtn: "Book a Free Call",
    ctaWhatsApp: "Send WhatsApp",
  },
  fr: {
    pageTitle: "Commencez Ici",
    pageSubtitle: "Votre parcours clair en 3 étapes — lisez-le en 2 minutes et sachez exactement quoi faire",
    stepsTitle: "Vos Trois Étapes",
    steps: [
      { num: "1", title: "Découvrez votre état de santé", desc: "Faites une évaluation rapide pour comprendre votre niveau de résistance à l'insuline.", cta: "Commencer l'évaluation", link: "/health-assessment" },
      { num: "2", title: "Apprenez la méthode", desc: "Découvrez la Méthode Feras Alayed™ — un système en 4 phases pour une transformation durable en 90 jours.", cta: "Découvrir la méthode", link: "#method" },
      { num: "3", title: "Contactez Feras", desc: "Réservez un appel découverte gratuit ou envoyez un message WhatsApp.", cta: "Contactez maintenant", link: "https://wa.me/96877020770?text=Je souhaite en savoir plus sur la Méthode Feras Alayed" },
    ],
    methodTitle: "Feras Alayed Method™",
    methodSubtitle: "Transformation Santé Durable — 90 Jours",
    phases: [
      { icon: "brain", title: "Phase 1: Prise de Conscience", items: ["Évaluation de santé", "Analyse du mode de vie", "Déclencheurs comportementaux"] },
      { icon: "flame", title: "Phase 2: Reset Métabolique", items: ["Stratégie nutritionnelle", "Jeûne intermittent", "Intégration Feel Great"] },
      { icon: "heart", title: "Phase 3: Transformation Durable", items: ["Construction d'habitudes", "Responsabilisation", "Maintien à long terme"] },
      { icon: "rocket", title: "Phase 4: Croissance", items: ["Leadership", "Développement personnel", "Construction d'opportunités"] },
    ],
    disclaimer: "Cette méthode est un programme de coaching personnel en nutrition comportementale — pas un traitement médical.",
    ctaTitle: "Prêt à commencer votre transformation?",
    ctaDesc: "Contactez Feras Alayed directement via WhatsApp ou réservez un appel gratuit.",
    ctaBtn: "Réserver un appel gratuit",
    ctaWhatsApp: "Envoyer WhatsApp",
  },
  es: {
    pageTitle: "Empieza Aquí",
    pageSubtitle: "Tu camino claro en 3 pasos — léelo en 2 minutos y sabe exactamente qué hacer",
    stepsTitle: "Tus Tres Pasos",
    steps: [
      { num: "1", title: "Descubre tu estado de salud", desc: "Realiza una evaluación rápida para entender tu nivel de resistencia a la insulina.", cta: "Comenzar evaluación", link: "/health-assessment" },
      { num: "2", title: "Aprende el método", desc: "Conoce el Método Feras Alayed™ — un sistema de 4 fases para transformación sostenible en 90 días.", cta: "Conocer el método", link: "#method" },
      { num: "3", title: "Conecta con Feras", desc: "Reserva una llamada gratuita o envía un mensaje de WhatsApp.", cta: "Conectar ahora", link: "https://wa.me/96877020770?text=Me gustaría saber más sobre el Método Feras Alayed" },
    ],
    methodTitle: "Feras Alayed Method™",
    methodSubtitle: "Transformación de Salud Sostenible — 90 Días",
    phases: [
      { icon: "brain", title: "Fase 1: Conciencia", items: ["Evaluación de salud", "Análisis de estilo de vida", "Disparadores conductuales"] },
      { icon: "flame", title: "Fase 2: Reset Metabólico", items: ["Estrategia nutricional", "Ayuno intermitente", "Integración Feel Great"] },
      { icon: "heart", title: "Fase 3: Transformación Sostenible", items: ["Construcción de hábitos", "Responsabilidad", "Mantenimiento a largo plazo"] },
      { icon: "rocket", title: "Fase 4: Crecimiento", items: ["Liderazgo", "Desarrollo personal", "Construcción de oportunidades"] },
    ],
    disclaimer: "Este método es un programa de coaching personal en nutrición conductual — no un tratamiento médico.",
    ctaTitle: "¿Listo para empezar tu transformación?",
    ctaDesc: "Conecta con Feras Alayed directamente por WhatsApp o reserva una llamada gratuita.",
    ctaBtn: "Reservar llamada gratuita",
    ctaWhatsApp: "Enviar WhatsApp",
  },
  de: {
    pageTitle: "Starte Hier",
    pageSubtitle: "Dein klarer 3-Schritte-Weg — lies ihn in 2 Minuten und wisse genau, was zu tun ist",
    stepsTitle: "Deine Drei Schritte",
    steps: [
      { num: "1", title: "Entdecke deinen Gesundheitsstatus", desc: "Mache eine schnelle Bewertung, um dein Insulinresistenz-Niveau zu verstehen.", cta: "Bewertung starten", link: "/health-assessment" },
      { num: "2", title: "Lerne die Methode", desc: "Erfahre mehr über die Feras Alayed Methode™ — ein 4-Phasen-System für nachhaltige Transformation in 90 Tagen.", cta: "Methode entdecken", link: "#method" },
      { num: "3", title: "Kontaktiere Feras", desc: "Buche ein kostenloses Gespräch oder sende eine WhatsApp-Nachricht.", cta: "Jetzt kontaktieren", link: "https://wa.me/96877020770?text=Ich möchte mehr über die Feras Alayed Methode erfahren" },
    ],
    methodTitle: "Feras Alayed Method™",
    methodSubtitle: "90-Tage Nachhaltige Gesundheitstransformation",
    phases: [
      { icon: "brain", title: "Phase 1: Bewusstsein", items: ["Gesundheitsbewertung", "Lebensstilanalyse", "Verhaltensauslöser"] },
      { icon: "flame", title: "Phase 2: Metabolischer Reset", items: ["Ernährungsstrategie", "Intermittierendes Fasten", "Feel Great Integration"] },
      { icon: "heart", title: "Phase 3: Nachhaltige Transformation", items: ["Gewohnheitsaufbau", "Verantwortlichkeit", "Langfristige Aufrechterhaltung"] },
      { icon: "rocket", title: "Phase 4: Wachstum", items: ["Führung", "Persönliche Entwicklung", "Chancenaufbau"] },
    ],
    disclaimer: "Diese Methode ist ein persönliches Coaching-Programm für Verhaltensernährung — keine medizinische Behandlung.",
    ctaTitle: "Bereit für deine Transformation?",
    ctaDesc: "Kontaktiere Feras Alayed direkt über WhatsApp oder buche ein kostenloses Gespräch.",
    ctaBtn: "Kostenloses Gespräch buchen",
    ctaWhatsApp: "WhatsApp senden",
  },
  tr: {
    pageTitle: "Buradan Başlayın",
    pageSubtitle: "Net 3 adımlık yolunuz — 2 dakikada okuyun ve ne yapacağınızı bilin",
    stepsTitle: "Üç Adımınız",
    steps: [
      { num: "1", title: "Sağlık durumunuzu keşfedin", desc: "İnsülin direnci seviyenizi anlamak için hızlı bir değerlendirme yapın.", cta: "Değerlendirmeyi başlat", link: "/health-assessment" },
      { num: "2", title: "Metodu öğrenin", desc: "Feras Alayed Metodu™ hakkında bilgi edinin — 90 günde sürdürülebilir dönüşüm için 4 aşamalı sistem.", cta: "Metodu keşfet", link: "#method" },
      { num: "3", title: "Feras ile iletişime geçin", desc: "Ücretsiz tanışma görüşmesi ayırtın veya WhatsApp mesajı gönderin.", cta: "Şimdi iletişime geç", link: "https://wa.me/96877020770?text=Feras Alayed Metodu hakkında daha fazla bilgi almak istiyorum" },
    ],
    methodTitle: "Feras Alayed Method™",
    methodSubtitle: "90 Günlük Sürdürülebilir Sağlık Dönüşümü",
    phases: [
      { icon: "brain", title: "Aşama 1: Farkındalık", items: ["Sağlık değerlendirmesi", "Yaşam tarzı analizi", "Davranışsal tetikleyiciler"] },
      { icon: "flame", title: "Aşama 2: Metabolik Reset", items: ["Beslenme stratejisi", "Aralıklı oruç", "Feel Great entegrasyonu"] },
      { icon: "heart", title: "Aşama 3: Sürdürülebilir Dönüşüm", items: ["Alışkanlık oluşturma", "Hesap verebilirlik", "Uzun vadeli sürdürme"] },
      { icon: "rocket", title: "Aşama 4: Büyüme", items: ["Liderlik", "Kişisel gelişim", "Fırsat oluşturma"] },
    ],
    disclaimer: "Bu metod, davranışsal beslenme ve yaşam tarzı değişikliği konusunda kişisel bir koçluk programıdır — tıbbi tedavi değildir.",
    ctaTitle: "Dönüşümünüze başlamaya hazır mısınız?",
    ctaDesc: "Feras Alayed ile doğrudan WhatsApp üzerinden iletişime geçin veya ücretsiz görüşme ayırtın.",
    ctaBtn: "Ücretsiz görüşme ayırt",
    ctaWhatsApp: "WhatsApp gönder",
  },
};

const phaseIcons: Record<string, React.ReactNode> = {
  brain: <Brain className="w-8 h-8" />,
  flame: <Flame className="w-8 h-8" />,
  heart: <Heart className="w-8 h-8" />,
  rocket: <Rocket className="w-8 h-8" />,
};

const phaseColors = [
  "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  "from-green-500/20 to-green-600/10 border-green-500/30",
  "from-purple-500/20 to-purple-600/10 border-purple-500/30",
];

const phaseIconColors = ["text-blue-400", "text-orange-400", "text-green-400", "text-purple-400"];

export default function StartHere() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
            {c.pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            {c.pageSubtitle}
          </p>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white/90">{c.stepsTitle}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {c.steps.map((step, i) => (
              <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-slate-900 group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-white/60 mb-6 leading-relaxed">{step.desc}</p>
                  <a href={step.link} target={step.link.startsWith("http") ? "_blank" : undefined} rel={step.link.startsWith("http") ? "noopener noreferrer" : undefined}>
                    <Button variant="outline" className="border-amber-400/50 text-amber-300 hover:bg-amber-400/10 bg-transparent">
                      {step.cta}
                      <ArrowRight className="w-4 h-4 ms-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Method Framework */}
      <section id="method" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 font-medium text-sm tracking-widest uppercase mb-3">{c.methodTitle}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{c.methodSubtitle}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.phases.map((phase, i) => (
              <div key={i} className={`rounded-2xl border bg-gradient-to-b ${phaseColors[i]} p-6 backdrop-blur-sm`}>
                <div className={`${phaseIconColors[i]} mb-4`}>
                  {phaseIcons[phase.icon]}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-white/70 text-sm">
                      <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-white/40 text-xs mt-10 max-w-3xl mx-auto italic">
            {c.disclaimer}
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{c.ctaTitle}</h2>
          <p className="text-white/60 text-lg mb-8">{c.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gradient-gold text-foreground font-bold px-8 py-6 text-lg">
                <Rocket className="w-5 h-5 me-2" />
                {lang === "ar" ? "سجّل كشريك الآن" : lang === "en" ? "Register as Partner" : c.ctaWhatsApp}
              </Button>
            </a>
            <a href="https://wa.me/96877020770?text=أرغب بمعرفة المزيد عن منهج فراس العايد للتحول الصحي" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent px-8 py-6 text-lg">
                <MessageCircle className="w-5 h-5 me-2" />
                {c.ctaWhatsApp}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
