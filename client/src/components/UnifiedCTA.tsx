import { Link } from "wouter";

interface UnifiedCTAProps {
  isAr: boolean;
  lang: string;
}

export default function UnifiedCTA({ isAr, lang }: UnifiedCTAProps) {
  const content = {
    ar: {
      question: "هل تعاني من مقاومة الإنسولين أو صعوبة خسارة الوزن؟",
      subtitle: "احجز استشارة مجانية أو ابدأ برنامج Feel Great لمدة 90 يوم",
      primaryBtn: "ابدأ الآن مجاناً",
      secondaryBtn: "اقرأ قصص النجاح",
      trustText: "✓ أكثر من 10,000 شخص حول العالم بدأوا رحلتهم الصحية معنا",
    },
    en: {
      question: "Struggling with insulin resistance or weight loss?",
      subtitle: "Book a free consultation or start your 90-day Feel Great program today",
      primaryBtn: "Start Free Consultation",
      secondaryBtn: "Read Success Stories",
      trustText: "✓ Over 10,000 people worldwide started their health journey with us",
    },
    fr: {
      question: "Vous souffrez de résistance à l'insuline ou de difficultés à perdre du poids ?",
      subtitle: "Réservez une consultation gratuite ou commencez votre programme Feel Great de 90 jours",
      primaryBtn: "Commencer gratuitement",
      secondaryBtn: "Lire les témoignages",
      trustText: "✓ Plus de 10 000 personnes dans le monde ont commencé leur parcours santé",
    },
    es: {
      question: "¿Sufres de resistencia a la insulina o dificultad para perder peso?",
      subtitle: "Reserva una consulta gratuita o inicia tu programa Feel Great de 90 días",
      primaryBtn: "Comenzar gratis",
      secondaryBtn: "Leer historias de éxito",
      trustText: "✓ Más de 10,000 personas en todo el mundo iniciaron su camino hacia la salud",
    },
    de: {
      question: "Leiden Sie unter Insulinresistenz oder Schwierigkeiten beim Abnehmen?",
      subtitle: "Buchen Sie eine kostenlose Beratung oder starten Sie Ihr 90-Tage Feel Great Programm",
      primaryBtn: "Kostenlos starten",
      secondaryBtn: "Erfolgsgeschichten lesen",
      trustText: "✓ Über 10.000 Menschen weltweit haben ihre Gesundheitsreise begonnen",
    },
    tr: {
      question: "İnsülin direnci veya kilo verme zorluğu mu çekiyorsunuz?",
      subtitle: "Ücretsiz danışmanlık rezervasyonu yapın veya 90 günlük Feel Great programınıza başlayın",
      primaryBtn: "Ücretsiz başla",
      secondaryBtn: "Başarı hikayelerini oku",
      trustText: "✓ Dünya genelinde 10.000'den fazla kişi sağlık yolculuğuna bizimle başladı",
    },
  };

  const t = content[lang as keyof typeof content] || content.en;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#132240] to-[#1a365d] py-16 px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(200,169,81,0.3) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#c8a951]/20 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Question */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
          {t.question}
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#c8a951] font-medium mb-8">
          {t.subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          {/* Primary CTA - WhatsApp */}
          <a
            href="https://wa.me/96877020770?text=قرأت مقالك وأريد أن أبدأ برنامج Feel Great لمدة 90 يوم"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-green-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-105 transition-all duration-300"
          >
            {/* WhatsApp Icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t.primaryBtn}
          </a>

          {/* Secondary CTA - Success Stories */}
          <Link href="/success-stories">
            <span className="cursor-pointer inline-flex items-center gap-2 px-6 py-4 bg-white/10 text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {t.secondaryBtn}
            </span>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-white/90">{t.trustText}</span>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#c8a951]/10 rounded-full blur-3xl" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
