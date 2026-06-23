/**
 * PriceDisplay Component
 * Shows transparent pricing to increase conversion
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Check, Zap } from "lucide-react";

const content: Record<string, {
  title: string;
  subtitle: string;
  starter: { name: string; price: string; features: string[] };
  popular: { name: string; price: string; features: string[]; badge: string };
  guarantee: string;
  cta: string;
}> = {
  ar: {
    title: "اسعار شفافة",
    subtitle: "اختر الباقة المناسبة لرحلتك الصحية",
    starter: {
      name: "باقة أساسية",
      price: "$99",
      features: ["منتج Unimate", "دليل التغذية", "متابعة شهر واحد"]
    },
    popular: {
      name: "باقة كاملة",
      price: "$149",
      badge: "الأكثر طلباً",
      features: ["Unimate + Balance", "خطة 90 يوم", "متابعة مستمرة", "دعم WhatsApp", "محتوى حصري"]
    },
    guarantee: "ضمان استرداد كامل خلال 90 يوم",
    cta: "ابدأ الآن"
  },
  en: {
    title: "Transparent Pricing",
    subtitle: "Choose the package that fits your health journey",
    starter: {
      name: "Starter Pack",
      price: "$99",
      features: ["Unimate Product", "Nutrition Guide", "1 Month Support"]
    },
    popular: {
      name: "Complete Pack",
      price: "$149",
      badge: "Most Popular",
      features: ["Unimate + Balance", "90-Day Plan", "Ongoing Support", "WhatsApp Support", "Exclusive Content"]
    },
    guarantee: "90-Day Money-Back Guarantee",
    cta: "Get Started"
  },
  fr: {
    title: "Tarification Transparente",
    subtitle: "Choisissez le forfait qui correspond à votre parcours santé",
    starter: {
      name: "Pack Débutant",
      price: "99€",
      features: ["Produit Unimate", "Guide Nutrition", "Support 1 Mois"]
    },
    popular: {
      name: "Pack Complet",
      price: "149€",
      badge: "Le Plus Populaire",
      features: ["Unimate + Balance", "Plan 90 Jours", "Support Continu", "Support WhatsApp", "Contenu Exclusif"]
    },
    guarantee: "Garantie 90 Jours",
    cta: "Commencer"
  },
  es: {
    title: "Precios Transparentes",
    subtitle: "Elige el paquete que se adapte a tu viaje de salud",
    starter: {
      name: "Paquete Inicial",
      price: "$99",
      features: ["Producto Unimate", "Guía de Nutrición", "Soporte 1 Mes"]
    },
    popular: {
      name: "Paquete Completo",
      price: "$149",
      badge: "Más Popular",
      features: ["Unimate + Balance", "Plan 90 Días", "Soporte Continuo", "Soporte WhatsApp", "Contenido Exclusivo"]
    },
    guarantee: "Garantía de 90 Días",
    cta: "Comenzar"
  },
  de: {
    title: "Transparente Preisgestaltung",
    subtitle: "Wählen Sie das Paket für Ihre Gesundheitsreise",
    starter: {
      name: "Starter-Paket",
      price: "99€",
      features: ["Unimate Produkt", "Ernährungsleitfaden", "1 Monat Support"]
    },
    popular: {
      name: "Komplettpaket",
      price: "149€",
      badge: "Am Beliebtesten",
      features: ["Unimate + Balance", "90-Tage-Plan", "Fortlaufender Support", "WhatsApp Support", "Exklusiver Inhalt"]
    },
    guarantee: "90-Tage Geld-zurück-Garantie",
    cta: "Loslegen"
  },
  tr: {
    title: "Şeffaf Fiyatlandırma",
    subtitle: "Sağlık yolculuğunuza uygun paketi seçin",
    starter: {
      name: "Başlangıç Paketi",
      price: "$99",
      features: ["Unimate Ürünü", "Beslenme Rehberi", "1 Ay Destek"]
    },
    popular: {
      name: "Tam Paket",
      price: "$149",
      badge: "En Popüler",
      features: ["Unimate + Balance", "90 Gün Planı", "Sürekli Destek", "WhatsApp Desteği", "Özel İçerik"]
    },
    guarantee: "90 Gün Para İadesi Garantisi",
    cta: "Başla"
  }
};

export function PriceDisplay() {
  const { lang } = useLanguage();
  const c = content[lang] || content.en;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{c.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{c.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Starter Pack */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{c.starter.name}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{c.starter.price}</span>
              <span className="text-gray-500 dark:text-gray-400">/once</span>
            </div>
            <ul className="space-y-3 mb-8">
              {c.starter.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://ufeelgreat.com/c/GBP556"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-6 text-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {c.cta}
            </a>
          </div>

          {/* Popular Pack */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-amber-400 text-amber-900 text-sm font-bold px-4 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {c.popular.badge}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2 mt-2">{c.popular.name}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white">{c.popular.price}</span>
              <span className="text-white/70">/once</span>
            </div>
            <ul className="space-y-3 mb-8">
              {c.popular.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <Check className="w-5 h-5 text-amber-300 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://ufeelgreat.com/c/GBP556"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-6 text-center bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors"
            >
              {c.cta}
            </a>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
          <div className="text-center">
            <p className="font-bold text-gray-900 dark:text-white">{c.guarantee}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {lang === "ar" ? "بدون أي مخاطرة" : "No risk involved"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PriceDisplay;
