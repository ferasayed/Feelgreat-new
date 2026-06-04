import { useEffect } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Activity, Heart, Leaf, Zap, Shield, Brain, Moon, Bone, Eye, Pill, Baby, Star, Play, ArrowLeft, ExternalLink } from "lucide-react";

const DRIVE_BASE = "https://drive.google.com/drive/folders/";

const categories = [
  { id: "weight", nameAr: "نزول الوزن", nameEn: "Weight Loss", count: "120+", icon: TrendingUp, color: "from-green-500 to-emerald-600", folderId: "1SMHJHnuMaiVEyWLrvky93i3cW-DJB8O2" },
  { id: "insulin", nameAr: "مقاومة الأنسولين", nameEn: "Insulin Resistance", count: "85+", icon: Activity, color: "from-blue-500 to-indigo-600", folderId: "1YRH-hClf8GYNpIL1Nr27zGn454Oo_yHs" },
  { id: "diabetes", nameAr: "السكري", nameEn: "Diabetes", count: "70+", icon: Heart, color: "from-red-500 to-rose-600", folderId: "1Xo3XorjdEHB0aGhMnWyH1aA_fc2b7iDL" },
  { id: "colon", nameAr: "القولون والهضم", nameEn: "Gut Health & IBS", count: "60+", icon: Leaf, color: "from-amber-500 to-orange-600", folderId: "1RjIxvLRyMPIbflCaFB-jUUNYPi2za8h_" },
  { id: "energy", nameAr: "تعب وخمول", nameEn: "Energy & Fatigue", count: "55+", icon: Zap, color: "from-yellow-500 to-amber-600", folderId: "13tJMZLtKnOPek8WZA5zfJ3w5Kn_dQgiP" },
  { id: "women", nameAr: "صحة المرأة", nameEn: "Women's Health", count: "45+", icon: Baby, color: "from-pink-500 to-rose-600", folderId: "1NLiU9ytyWBkpeqVpTogl8_9OQIBEf3-L" },
  { id: "skin", nameAr: "البشرة والجلد", nameEn: "Skin & Dermatology", count: "35+", icon: Eye, color: "from-purple-500 to-violet-600", folderId: "1H2aKNbqeFx2f34-LsaBgQQRTtFpo1fOm" },
  { id: "stomach", nameAr: "جرثومة المعدة", nameEn: "H. Pylori", count: "30+", icon: Shield, color: "from-teal-500 to-cyan-600", folderId: "1SdDDPuWhxMxmrsiltrNLF3tuIdFehdLE" },
  { id: "bones", nameAr: "العظام والمفاصل", nameEn: "Bones & Joints", count: "25+", icon: Bone, color: "from-slate-500 to-gray-600", folderId: "14A6ei0Yr-Tq2fK8evSkGL8mTKMDBtJDU" },
  { id: "headache", nameAr: "صداع", nameEn: "Headaches & Migraines", count: "20+", icon: Brain, color: "from-indigo-500 to-blue-600", folderId: "1tBvxWFvNFig7GhG0XPcZzXPvUkVnqOAA" },
  { id: "cancer", nameAr: "السرطان", nameEn: "Cancer Support", count: "15+", icon: Moon, color: "from-rose-500 to-pink-600", folderId: "10IvBqMoObnVhM9iJDZR4sATa5-oHraYa" },
  { id: "injections", nameAr: "إبر التنحيف", nameEn: "Weight Loss Injections", count: "30+", icon: Pill, color: "from-cyan-500 to-blue-600", folderId: "1hgD02ojTtcTBljUeJLYu2KAt63vs4DKC" },
  { id: "general", nameAr: "ستوري عام", nameEn: "General Stories", count: "40+", icon: Star, color: "from-amber-400 to-yellow-600", folderId: "1C7k4wehdGJGTXzLKyNqduTHBE0MXHhLn" },
  { id: "diverse", nameAr: "قصص نجاح متنوعة", nameEn: "Diverse Success Stories", count: "50+", icon: Play, color: "from-emerald-500 to-green-600", folderId: "1TOoxwhaRruuXC4zPuMu7qJWJ6Lfo3_lr" },
];

export default function SuccessStories() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.title = lang === "ar"
      ? "قصص نجاح حقيقية | الصحة المستدامة مع فراس العايد"
      : "Real Success Stories | Sustainable Health with Feras Alayed";
  }, [lang]);

  const isRtl = lang === "ar";

  const content = {
    ar: {
      title: "قصص نجاح حقيقية",
      subtitle: "أكثر من 500 قصة نجاح موثقة في 14 فئة صحية مختلفة — فيديوهات ومحادثات وصور قبل وبعد",
      badge: "500+ نتيجة موثقة",
      viewFolder: "شاهد القصص",
      stories: "قصة",
      back: "العودة للرئيسية",
      disclaimer: "جميع القصص حقيقية وموثقة من عملاء فعليين. النتائج تختلف من شخص لآخر.",
    },
    en: {
      title: "Real Success Stories",
      subtitle: "Over 500 documented success stories across 14 health categories — videos, conversations, and before/after photos",
      badge: "500+ Documented Results",
      viewFolder: "View Stories",
      stories: "stories",
      back: "Back to Home",
      disclaimer: "All stories are real and documented from actual clients. Individual results may vary.",
    },
  };

  const c = lang === "ar" ? content.ar : content.en;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 ${isRtl ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className="container max-w-6xl mx-auto px-4 pt-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {c.back}
        </Link>
      </div>

      {/* Hero */}
      <section className="container max-w-6xl mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
          <Star className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm font-medium">{c.badge}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{c.title}</h1>
        <p className="text-lg text-slate-400 max-w-3xl mx-auto">{c.subtitle}</p>
      </section>

      {/* Categories Grid */}
      <section className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`${DRIVE_BASE}${cat.folderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-slate-800/60 border border-slate-700 p-6 hover:border-slate-500 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/20"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-15 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <cat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {isRtl ? cat.nameAr : cat.nameEn}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">{cat.count} {c.stories}</span>
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Total Stats */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
          <div className="text-5xl font-bold text-green-400 mb-2">500+</div>
          <div className="text-lg text-slate-300 mb-4">{c.badge}</div>
          <a
            href="https://drive.google.com/drive/folders/1Ov_UcUzaomzqbfVFOlhHhXOqrZLUJLqt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5" />
            {c.viewFolder}
          </a>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container max-w-4xl mx-auto px-4 pb-16">
        <p className="text-center text-sm text-slate-500">{c.disclaimer}</p>
      </section>
    </div>
  );
}
