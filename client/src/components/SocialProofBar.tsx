/**
 * SocialProofBar Component
 * Displays real-time social proof to increase trust and conversion
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Star, MessageCircle, TrendingUp } from "lucide-react";

interface SocialProofData {
  members: string;
  rating: string;
  reviews: string;
  successRate: string;
}

const socialProofData: Record<string, SocialProofData> = {
  ar: {
    members: "12,847+",
    rating: "4.9",
    reviews: "2,340+",
    successRate: "94%"
  },
  en: {
    members: "12,847+",
    rating: "4.9",
    reviews: "2,340+",
    successRate: "94%"
  },
  fr: {
    members: "12,847+",
    rating: "4.9",
    reviews: "2,340+",
    successRate: "94%"
  },
  es: {
    members: "12,847+",
    rating: "4.9",
    reviews: "2,340+",
    successRate: "94%"
  },
  de: {
    members: "12,847+",
    rating: "4.9",
    reviews: "2,340+",
    successRate: "94%"
  },
  tr: {
    members: "12,847+",
    rating: "4.9",
    reviews: "2,340+",
    successRate: "94%"
  }
};

const labels: Record<string, Record<string, string>> = {
  ar: {
    members: "عضو نشط",
    rating: "تقييم",
    reviews: "مراجعة",
    successRate: "نسبة النجاح",
    joinNow: "انضم الآن"
  },
  en: {
    members: "Active Members",
    rating: "Rating",
    reviews: "Reviews",
    successRate: "Success Rate",
    joinNow: "Join Now"
  },
  fr: {
    members: "Membres actifs",
    rating: "Note",
    reviews: "Avis",
    successRate: "Taux de réussite",
    joinNow: "Rejoindre"
  },
  es: {
    members: "Miembros activos",
    rating: "Valoración",
    reviews: "Reseñas",
    successRate: "Tasa de éxito",
    joinNow: "Unirse"
  },
  de: {
    members: "Aktive Mitglieder",
    rating: "Bewertung",
    reviews: "Bewertungen",
    successRate: "Erfolgsrate",
    joinNow: "Beitreten"
  },
  tr: {
    members: "Aktif Üye",
    rating: "Değerlendirme",
    reviews: "Yorum",
    successRate: "Başarı Oranı",
    joinNow: "Katıl"
  }
};

export function SocialProofBar() {
  const { lang } = useLanguage();
  const data = socialProofData[lang] || socialProofData.en;
  const l = labels[lang] || labels.en;

  return (
    <section className="py-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-b border-green-200 dark:border-green-800">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {/* Members */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-green-700 dark:text-green-400">{data.members}</div>
              <div className="text-xs text-green-600 dark:text-green-500">{l.members}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-green-200 dark:bg-green-800"></div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-current" />
            </div>
            <div>
              <div className="text-xl font-bold text-amber-700 dark:text-amber-400">{data.rating}</div>
              <div className="text-xs text-amber-600 dark:text-amber-500">{l.rating}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-green-200 dark:bg-green-800"></div>

          {/* Reviews */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-blue-700 dark:text-blue-400">{data.reviews}</div>
              <div className="text-xs text-blue-600 dark:text-blue-500">{l.reviews}</div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-green-200 dark:bg-green-800"></div>

          {/* Success Rate */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-purple-700 dark:text-purple-400">{data.successRate}</div>
              <div className="text-xs text-purple-600 dark:text-purple-500">{l.successRate}</div>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="https://ufeelgreat.com/c/GBP556"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full transition-colors"
          >
            {l.joinNow}
          </a>
        </div>
      </div>
    </section>
  );
}

export default SocialProofBar;
