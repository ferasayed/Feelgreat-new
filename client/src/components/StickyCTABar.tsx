/**
 * StickyCTABar Component
 * A sticky bar that appears on scroll to drive conversions
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, ArrowRight, Sparkles } from "lucide-react";

const content: Record<string, { title: string; subtitle: string; cta: string }> = {
  ar: {
    title: "🎁 عرض خاص: ابدأ رحلتك الصحية اليوم",
    subtitle: "احصل على استشارتك المجانية + خطة مخصصة",
    cta: "سجل الآن"
  },
  en: {
    title: "🎁 Special Offer: Start Your Health Journey Today",
    subtitle: "Get your free consultation + customized plan",
    cta: "Register Now"
  },
  fr: {
    title: "🎁 Offre Spéciale: Commencez Votre Voyage Santé Aujourd'hui",
    subtitle: "Obtenez votre consultation gratuite + plan personnalisé",
    cta: "S'inscrire"
  },
  es: {
    title: "🎁 Oferta Especial: Comienza Tu Viaje de Salud Hoy",
    subtitle: "Obtén tu consulta gratuita + plan personalizado",
    cta: "Regístrate"
  },
  de: {
    title: "🎁 Sonderangebot: Starten Sie Ihre Gesundheitsreise Heute",
    subtitle: "Erhalten Sie Ihre kostenlose Beratung + personalisierten Plan",
    cta: "Registrieren"
  },
  tr: {
    title: "🎁 Özel Teklif: Sağlık Yolculuğunuza Bugün Başlayın",
    subtitle: "Ücretsiz danışmanlık + özelleştirilmiş plan alın",
    cta: "Kaydol"
  }
};

export function StickyCTABar() {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const c = content[lang] || content.en;

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 500px
      if (window.scrollY > 500 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    // Store in localStorage to not show again in this session
    sessionStorage.setItem("stickyCTAdismissed", "true");
  };

  // Check if dismissed in this session
  useEffect(() => {
    if (sessionStorage.getItem("stickyCTAdismissed")) {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl">
        <div className="container">
          <div className="flex items-center justify-between py-3 px-4">
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                <span className="font-bold text-sm md:text-base truncate">{c.title}</span>
              </div>
              <p className="text-xs md:text-sm text-white/80 truncate hidden sm:block">{c.subtitle}</p>
            </div>

            {/* CTA Button */}
            <a
              href="https://ufeelgreat.com/c/GBP556"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-700 font-bold text-sm rounded-full hover:bg-green-50 transition-colors flex-shrink-0 ml-4"
            >
              {c.cta}
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StickyCTABar;
