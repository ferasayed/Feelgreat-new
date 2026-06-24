import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountUp } from "@/hooks/useCountUp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, ChevronDown, Zap, Heart, TrendingUp, Users, DollarSign, Clock, GraduationCap, Star, MessageCircle, X, Send, ArrowUp, Shield, Brain, Moon, Activity, Leaf, Target, MapPin, Award, Phone, Play, Sparkles, BarChart3, Calendar, BookOpen, FlaskConical, Library, ArrowRight, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ChatWidget from "@/components/ChatWidget";
import { NewsletterSection } from "@/components/NewsletterSection";
import { SocialProofBar } from "@/components/SocialProofBar";
import { PriceDisplay } from "@/components/PriceDisplay";

function LanguageSwitcher() {
  const { lang, setLang, languages } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm"
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find(l => l.code === lang)?.nativeName}</span>
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute top-full mt-2 end-0 bg-white rounded-xl shadow-xl border border-border p-2 min-w-[160px] z-50">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`w-full text-start px-3 py-2 rounded-lg text-sm transition-colors ${lang === l.code ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'}`}
            >
              <span className="me-2">{l.flag}</span>
              {l.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Navbar() {
  const { t, lang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLabels: Record<string, Record<string, string>> = {
    ar: { blog: "المدونة", research: "الأبحاث", library: "المكتبة الصحية", knowledgeHub: "مركز المعرفة", compare: "لماذا نحن؟", opportunity: "الشراكة", register: "سجّل الآن", quiz: "اختبر صحتك", fasting: "حاسبة الصيام" },
    en: { blog: "Blog", research: "Research", library: "Health Library", knowledgeHub: "Knowledge Hub", compare: "Why Us?", opportunity: "Partnership", register: "Register", quiz: "Health Quiz", fasting: "Fasting Calculator" },
    fr: { blog: "Blog", research: "Recherche", library: "Bibliothèque Santé", knowledgeHub: "Centre de Savoir", compare: "Pourquoi nous?", opportunity: "Partenariat", register: "S'inscrire", quiz: "Quiz Santé", fasting: "Calculateur Jeûne" },
    es: { blog: "Blog", research: "Investigación", library: "Biblioteca de Salud", knowledgeHub: "Centro de Conocimiento", compare: "¿Por qué nosotros?", opportunity: "Asociación", register: "Regístrate", quiz: "Quiz de Salud", fasting: "Calculadora Ayuno" },
    de: { blog: "Blog", research: "Forschung", library: "Gesundheitsbibliothek", knowledgeHub: "Wissenszentrum", compare: "Warum wir?", opportunity: "Partnerschaft", register: "Registrieren", quiz: "Gesundheitstest", fasting: "Fasten-Rechner" },
    tr: { blog: "Blog", research: "Araştırma", library: "Sağlık Kütüphanesi", knowledgeHub: "Bilgi Merkezi", compare: "Neden biz?", opportunity: "Ortaklık", register: "Kaydol", quiz: "Sağlık Testi", fasting: "Oruç Hesaplayıcı" },
  };
  const nav = navLabels[lang] || navLabels.en;

  return (
    <nav className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${scrolled ? 'glass-effect shadow-md' : 'bg-transparent'}`}>
      <div className="container flex items-center justify-between h-16">
        <a href="#" className="text-xl font-bold text-primary">
          Feel Great
        </a>

        <div className="hidden lg:flex items-center gap-5">
          <a href="/blog" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{nav.blog}</a>
          <a href="/research" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{nav.research}</a>
          <a href="/health-library" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{nav.library}</a>
          <a href="/feras-alayed" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{nav.knowledgeHub}</a>
          <a href="/comparison" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{nav.compare}</a>
          <a href="/business-opportunity" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors">{lang === "ar" ? "فرص الاستثمار" : "Business Opp."}</a>
          <a href="#partnership" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{nav.opportunity}</a>
          <a href="/health-assessment" className="text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors">{nav.quiz}</a>
          <a href="/fasting-calculator" className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors">{nav.fasting}</a>
          <a href="#register" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">{nav.register}</a>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="hidden sm:inline-flex gradient-blue text-white border-0">{lang === "ar" ? "ابدأ رحلتك" : "Start Now"}</Button>
          </a>
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white p-4 space-y-3">
          <a href="/blog" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{nav.blog}</a>
          <a href="/research" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{nav.research}</a>
          <a href="/health-library" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{nav.library}</a>
          <a href="/feras-alayed" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{nav.knowledgeHub}</a>
          <a href="/comparison" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{nav.compare}</a>
          <a href="/business-opportunity" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-emerald-600">{lang === "ar" ? "فرص الاستثمار" : "Business Opportunities"}</a>
          <a href="#partnership" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{nav.opportunity}</a>
          <a href="/health-assessment" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-amber-600">{nav.quiz}</a>
          <a href="/fasting-calculator" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-emerald-600">{nav.fasting}</a>
          <a href="#register" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium">{nav.register}</a>
        </div>
      )}
    </nav>
  );
}

function ContentButtons({ lang, cta5, cta6 }: { lang: string; cta5: string; cta6: string }) {
  const { data: blogData } = trpc.blog.list.useQuery({ limit: 1, offset: 0 });
  const { data: researchData } = trpc.research.list.useQuery({ limit: 1 });
  const articleCount = blogData?.total ?? 0;
  const researchCount = researchData?.total ?? 0;

  // Business opportunity labels
  const businessLabel = {
    ar: "فرص الاستثمار",
    en: "Business Opportunities",
    fr: "Opportunités d'Affaires",
    es: "Oportunidades de Negocio",
    de: "Geschäftsmöglichkeiten",
    tr: "İş Fırsatları",
  }[lang] || "Business Opportunities";

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-3 animate-fade-in-up stagger-3">
      <a href="/blog">
        <Button size="lg" variant="outline" className="text-base px-5 sm:px-8 py-5 border-blue-400/40 text-blue-300 hover:bg-blue-500/10 bg-transparent w-full sm:w-auto">
          <BookOpen className="w-5 h-5 me-2" />
          {cta5}{articleCount > 0 && ` (${articleCount})`}
        </Button>
      </a>
      <a href="/research">
        <Button size="lg" variant="outline" className="text-base px-5 sm:px-8 py-5 border-purple-400/40 text-purple-300 hover:bg-purple-500/10 bg-transparent w-full sm:w-auto">
          <FlaskConical className="w-5 h-5 me-2" />
          {cta6}{researchCount > 0 && ` (${researchCount})`}
        </Button>
      </a>
      <a href="/business-opportunity">
        <Button size="lg" variant="outline" className="text-base px-5 sm:px-8 py-5 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 bg-transparent w-full sm:w-auto">
          <Briefcase className="w-5 h-5 me-2" />
          {businessLabel}
        </Button>
      </a>
    </div>
  );
}

function AutoPlayAudio({ lang }: { lang: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioSrc = {
    ar: '/manus-storage/feras-intro-ar_1c71ae49.mp3',
    en: '/manus-storage/feras-intro-en_b0d13d24.mp3',
    fr: '/manus-storage/feras-intro-fr_3c79eebe.mp3',
    es: '/manus-storage/feras-intro-es_0c39002f.mp3',
    de: '/manus-storage/feras-intro-de_fbfb9252.mp3',
    tr: '/manus-storage/feras-intro-tr_b1a2d71b.mp3',
  }[lang] || '/manus-storage/feras-intro-en_b0d13d24.mp3';

  const audioLabel = {
    ar: 'استمع لرسالة فراس',
    en: "Listen to Feras's Message",
    fr: 'Écoutez le message de Feras',
    es: 'Escucha el mensaje de Feras',
    de: 'Hören Sie Feras\' Nachricht',
    tr: "Feras'ın mesajını dinleyin",
  }[lang] || "Listen to Feras's Message";

  useEffect(() => {
    // Try to auto-play on first user interaction with the page
    const tryAutoPlay = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.volume = 0.7;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Browser blocked autoplay, that's fine
        });
      }
    };

    // Also try immediate autoplay (works on some browsers)
    if (audioRef.current && !hasInteracted) {
      audioRef.current.volume = 0.7;
      audioRef.current.play().then(() => {
        setHasInteracted(true);
        setIsPlaying(true);
      }).catch(() => {
        // Blocked - wait for user interaction
      });
    }

    document.addEventListener('click', tryAutoPlay, { once: true });
    document.addEventListener('touchstart', tryAutoPlay, { once: true });
    document.addEventListener('scroll', tryAutoPlay, { once: true });

    return () => {
      document.removeEventListener('click', tryAutoPlay);
      document.removeEventListener('touchstart', tryAutoPlay);
      document.removeEventListener('scroll', tryAutoPlay);
    };
  }, [hasInteracted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onEnded = () => setIsPlaying(false);
      audio.addEventListener('ended', onEnded);
      return () => audio.removeEventListener('ended', onEnded);
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="mt-8 animate-fade-in-up stagger-4">
      <button
        onClick={togglePlay}
        className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPlaying ? 'bg-amber-400/20 animate-pulse' : 'bg-amber-400/10'}`}>
          <Play className={`w-4 h-4 text-amber-400 ${isPlaying ? 'hidden' : ''}`} />
          {isPlaying && (
            <div className="flex items-center gap-0.5">
              <span className="w-0.5 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
        <span className="text-white/80 text-sm">{audioLabel}</span>
      </button>
      <audio ref={audioRef} key={lang} src={audioSrc} preload="auto" />
    </div>
  );
}

function HeroSection() {
  const { lang } = useLanguage();

  const content: Record<string, { title: string; subtitle: string; credentials: string; subtitle_pills: string[]; cta1: string; cta2: string; cta3: string; cta4: string; cta5: string; cta6: string }> = {
    ar: {
      title: "حوّل صحتك.\nحوّل حياتك.",
      subtitle: "اكتشف المنهج المُثبت الذي ساعد المئات على تحسين طاقتهم وصحتهم الأيضية وعاداتهم اليومية خلال 90 يوم.",
      credentials: "أخصائي التغذية السلوكية | مستشار الصحة المستدامة",
      subtitle_pills: ["مدرج في PDR المرجع الطبي الأمريكي", "50+ دراسة علمية", "نتائج خلال 90 يوم", "ضمان استرداد كامل"],
      cta1: "ابدأ تحولك الآن",
      cta2: "اعمل مع فراس",
      cta3: "احجز مكالمة تعريفية",
      cta4: "اختبر صحتك مجاناً",
      cta5: "المقالات",
      cta6: "الأبحاث العلمية",
    },
    en: {
      title: "Transform Your Health.\nTransform Your Life.",
      subtitle: "Discover the proven system that has helped people improve energy, metabolic health, lifestyle habits, and long-term wellbeing.",
      credentials: "Behavioral Nutrition Specialist | Sustainable Health Coach",
      subtitle_pills: ["Listed in PDR (Physicians' Desk Reference)", "50+ Clinical Studies", "Results in 90 Days", "Money-Back Guarantee"],
      cta1: "Start Your Transformation",
      cta2: "Work With Feras",
      cta3: "Book a Discovery Call",
      cta4: "Free Health Quiz",
      cta5: "Articles",
      cta6: "Research",
    },
    fr: {
      title: "Transformez votre santé.\nTransformez votre vie.",
      subtitle: "Découvrez le système éprouvé qui a aidé des centaines de personnes à améliorer leur énergie et leur santé métabolique en 90 jours.",
      credentials: "Spécialiste en Nutrition Comportementale | Coach Santé Durable",
      subtitle_pills: ["Référencé dans le PDR américain", "50+ études cliniques", "Résultats en 90 jours", "Garantie satisfait ou remboursé"],
      cta1: "Commencez votre transformation",
      cta2: "Travaillez avec Feras",
      cta3: "Réservez un appel",
      cta4: "Quiz Santé Gratuit",
      cta5: "Articles",
      cta6: "Recherche",
    },
    es: {
      title: "Transforma tu salud.\nTransforma tu vida.",
      subtitle: "Descubre el sistema probado que ha ayudado a cientos a mejorar su energía y salud metabólica en 90 días.",
      credentials: "Especialista en Nutrición Conductual | Coach de Salud Sostenible",
      subtitle_pills: ["Listado en el PDR (Referencia Médica)", "50+ estudios clínicos", "Resultados en 90 días", "Garantía de devolución"],
      cta1: "Comienza tu transformación",
      cta2: "Trabaja con Feras",
      cta3: "Reserva una llamada",
      cta4: "Quiz de Salud Gratis",
      cta5: "Artículos",
      cta6: "Investigación",
    },
    de: {
      title: "Transformiere deine Gesundheit.\nTransformiere dein Leben.",
      subtitle: "Entdecke das bewährte System, das Hunderten geholfen hat, ihre Energie und metabolische Gesundheit in 90 Tagen zu verbessern.",
      credentials: "Spezialist für Verhaltensernährung | Nachhaltiger Gesundheitscoach",
      subtitle_pills: ["Im PDR (Ärzte-Referenz) gelistet", "50+ klinische Studien", "Ergebnisse in 90 Tagen", "Geld-zurück-Garantie"],
      cta1: "Starte deine Transformation",
      cta2: "Arbeite mit Feras",
      cta3: "Buche ein Gespräch",
      cta4: "Kostenloser Gesundheitstest",
      cta5: "Artikel",
      cta6: "Forschung",
    },
    tr: {
      title: "Sağlığınızı dönüştürün.\nHayatınızı dönüştürün.",
      subtitle: "Yüzlerce kişinin enerjisini ve metabolik sağlığını 90 günde iyileştirmesine yardımcı olan kanıtlanmış sistemi keşfedin.",
      credentials: "Davranışsal Beslenme Uzmanı | Sürdürülebilir Sağlık Koçu",
      subtitle_pills: ["PDR'de (Amerikan Tıp Referansı) listelendi", "50+ klinik çalışma", "90 günde sonuç", "Para iade garantisi"],
      cta1: "Dönüşümünüze başlayın",
      cta2: "Feras ile çalışın",
      cta3: "Tanışma görüşmesi ayırtın",
      cta4: "Ücretsiz Sağlık Testi",
      cta5: "Makaleler",
      cta6: "Araştırma",
    },
  };

  const c = content[lang] || content.en;

  return (
    <section className="gradient-hero min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Feras watermark background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/manus-storage/feras-hero-bg_f4e10bc1.jpg"
          alt={lang === 'ar' ? 'فراس العايد - خبير الصحة المستدامة والتغذية السلوكية' : 'Feras Alayed - Sustainable Health & Behavioral Nutrition Expert'}
          className="w-full h-full object-cover opacity-[0.12] scale-110"
          style={{ filter: 'grayscale(30%) blur(1px)' }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/40 to-slate-950/80"></div>
      </div>
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 start-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 end-10 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
                    {/* Authority Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm mb-4 animate-fade-in-up backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Feras Alayed Method™</span>
          </div>
          {/* Credentials */}
          <p className="text-amber-300/90 text-sm md:text-base mb-6 animate-fade-in-up font-medium tracking-wide">
            {c.credentials}
          </p>
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up stagger-1 leading-tight whitespace-pre-line">
            {c.title}
          </h1>
          {/* Subtitle Description */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-2 leading-relaxed">
            {c.subtitle}
          </p>
          {/* Trust Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up stagger-2">
            {c.subtitle_pills.map((item, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm backdrop-blur-sm">
                {item}
              </span>
            ))}
          </div>

          {/* CTAs - Main Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up stagger-3">
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-6 gradient-gold text-foreground font-bold border-0 hover:opacity-90 w-full sm:w-auto">
                {c.cta1}
                <ArrowUp className="w-5 h-5 ms-2 rotate-45" />
              </Button>
            </a>
            <a href="/partner">
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-6 border-white/30 text-white hover:bg-white/10 bg-transparent w-full sm:w-auto">
                {c.cta2}
              </Button>
            </a>
            <a href="https://wa.me/96877020770?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D9%85%D8%B9%D8%B1%D9%81%D8%A9%20%D8%A7%D9%84%D9%85%D8%B2%D9%8A%D8%AF%20%D8%B9%D9%86%20%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20%D8%A7%D9%84%D8%B5%D8%AD%D8%A9%20%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D8%AF%D8%A7%D9%85%D8%A9%20%D9%88%D9%81%D8%B1%D8%B5%D8%A9%20%D8%A7%D9%84%D8%B4%D8%B1%D8%A7%D9%83%D8%A9" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-6 border-green-400/50 text-green-300 hover:bg-green-500/10 bg-transparent w-full sm:w-auto">
                <Phone className="w-5 h-5 me-2" />
                {c.cta3}
              </Button>
            </a>
            <a href="/health-assessment">
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-6 border-amber-400/40 text-amber-300 hover:bg-amber-500/10 bg-transparent w-full sm:w-auto">
                <Sparkles className="w-5 h-5 me-2" />
                {c.cta4}
              </Button>
            </a>
          </div>

          {/* CTAs - Content (Articles & Research) - Separate Row */}
          <ContentButtons lang={lang} cta5={c.cta5} cta6={c.cta6} />

          {/* Audio Introduction - Auto-play */}
          <AutoPlayAudio lang={lang} />
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats: Record<string, Array<{ value: string; label: string }>> = {
    ar: [
      { value: "50+", label: "دولة حول العالم" },
      { value: "10K+", label: "عميل سعيد" },
      { value: "500+", label: "شريك نشط" },
      { value: "25K+", label: "برنامج مكتمل" },
    ],
    en: [
      { value: "50+", label: "Countries Worldwide" },
      { value: "10K+", label: "Happy Clients" },
      { value: "500+", label: "Active Partners" },
      { value: "25K+", label: "Programs Completed" },
    ],
    fr: [
      { value: "50+", label: "Pays dans le monde" },
      { value: "10K+", label: "Clients satisfaits" },
      { value: "500+", label: "Partenaires actifs" },
      { value: "25K+", label: "Programmes complétés" },
    ],
    es: [
      { value: "50+", label: "Países en el mundo" },
      { value: "10K+", label: "Clientes felices" },
      { value: "500+", label: "Socios activos" },
      { value: "25K+", label: "Programas completados" },
    ],
    de: [
      { value: "50+", label: "Länder weltweit" },
      { value: "10K+", label: "Zufriedene Kunden" },
      { value: "500+", label: "Aktive Partner" },
      { value: "25K+", label: "Abgeschlossene Programme" },
    ],
    tr: [
      { value: "50+", label: "Dünya genelinde ülke" },
      { value: "10K+", label: "Mutlu müşteri" },
      { value: "500+", label: "Aktif ortak" },
      { value: "25K+", label: "Tamamlanan program" },
    ],
  };

  const s = stats[lang] || stats.en;

  return (
    <section ref={ref} className="py-16 bg-white border-b border-border">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {s.map((stat, i) => (
            <div key={i} className={`text-center ${visible ? 'animate-count-up' : 'opacity-0'}`} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="text-3xl md:text-4xl font-bold text-gradient-blue mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const { t, lang } = useLanguage();

  const labels: Record<string, { title: string; subtitle: string }> = {
    ar: { title: "نظام Feel Great", subtitle: "مكونان بسيطان، نتائج استثنائية" },
    en: { title: "The Feel Great System", subtitle: "Two simple components, extraordinary results" },
    fr: { title: "Le Système Feel Great", subtitle: "Deux composants simples, résultats extraordinaires" },
    es: { title: "El Sistema Feel Great", subtitle: "Dos componentes simples, resultados extraordinarios" },
    de: { title: "Das Feel Great System", subtitle: "Zwei einfache Komponenten, außergewöhnliche Ergebnisse" },
    tr: { title: "Feel Great Sistemi", subtitle: "İki basit bileşen, olağanüstü sonuçlar" },
  };
  const l = labels[lang] || labels.en;

  return (
    <section id="products" className="py-24 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{l.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{l.subtitle}</p>
        </div>

        <div className="flex justify-center mb-12">
          <img loading="lazy"
            src="/manus-storage/feel-great-system_b22dc6e2.png"
            alt={lang === 'ar' ? 'باقة فيل جريت - يوني ميت + بالانس' : 'Feel Great Pack - Unimate + Balance'}
            className="w-64 md:w-80 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"

            decoding="async"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-600"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img loading="lazy" src="/manus-storage/unimate-product_c205b611.png" alt={lang === 'ar' ? 'منتج يوني ميت - مشروب الطاقة والتركيز' : 'Unimate - Energy and Focus Drink'} className="w-24 h-24 object-contain rounded-xl" decoding="async" />
                <div>
                  <h3 className="text-2xl font-bold">{t("products.unimate.title")}</h3>
                  <p className="text-sm text-green-600 font-medium">Energy | Performance | Attitude</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t("products.unimate.desc")}</p>
              <ul className="space-y-3">
                {["b1", "b2", "b3", "b4"].map(key => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-sm text-foreground/80">{t(`products.unimate.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="h-3 gradient-blue"></div>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img loading="lazy" src="/manus-storage/balance-product_c1f1843f.png" alt={lang === 'ar' ? 'منتج بالانس - مسجل بالمرجع الطبي PDR' : 'Balance - Listed in PDR Medical Reference'} className="w-24 h-24 object-contain rounded-xl" decoding="async" />
                <div>
                  <h3 className="text-2xl font-bold">{t("products.balance.title")}</h3>
                  <p className="text-sm text-primary font-medium">Fiber | Metabolism | Wellness</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                    <Shield className="w-3 h-3" />
                    {lang === 'ar' ? 'مدرج في PDR المرجع الطبي الأمريكي' : "Listed in PDR (Physicians' Desk Reference)"}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t("products.balance.desc")}</p>
              <ul className="space-y-3">
                {["b1", "b2", "b3", "b4"].map(key => (
                  <li key={key} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-sm text-foreground/80">{t(`products.balance.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function SustainableHealthSection() {
  const { lang } = useLanguage();

  const content: Record<string, { title: string; subtitle: string; pillars: Array<{ icon: string; title: string; desc: string }> }> = {
    ar: {
      title: "الصحة المستدامة",
      subtitle: "نهج شامل ومتكامل لحياة صحية مستدامة - ليس مجرد حمية، بل أسلوب حياة",
      pillars: [
        { icon: "leaf", title: "التغذية الذكية", desc: "نظام غذائي متوازن مدعوم بالعلم يغذي جسمك من الداخل" },
        { icon: "activity", title: "الحركة اليومية", desc: "نشاط بدني منتظم يناسب نمط حياتك ويعزز طاقتك" },
        { icon: "moon", title: "النوم العميق", desc: "نوم مريح ومنتظم يجدد خلاياك ويشحن طاقتك" },
        { icon: "brain", title: "إدارة التوتر", desc: "أدوات وتقنيات للتعامل مع ضغوط الحياة بذكاء" },
        { icon: "heart", title: "التوازن الهرموني", desc: "دعم طبيعي لتوازن هرموناتك وصحتك الأيضية" },
        { icon: "target", title: "الاستمرارية", desc: "نظام مستدام يمكنك الالتزام به مدى الحياة" },
      ],
    },
    en: {
      title: "Sustainable Health",
      subtitle: "A holistic, integrated approach to lasting health — not just a diet, but a lifestyle",
      pillars: [
        { icon: "leaf", title: "Smart Nutrition", desc: "A science-backed balanced diet that nourishes your body from within" },
        { icon: "activity", title: "Daily Movement", desc: "Regular physical activity that fits your lifestyle and boosts your energy" },
        { icon: "moon", title: "Deep Sleep", desc: "Restful, consistent sleep that regenerates your cells and recharges you" },
        { icon: "brain", title: "Stress Management", desc: "Tools and techniques to handle life's pressures intelligently" },
        { icon: "heart", title: "Hormonal Balance", desc: "Natural support for your hormonal and metabolic health" },
        { icon: "target", title: "Consistency", desc: "A sustainable system you can commit to for life" },
      ],
    },
    fr: {
      title: "Santé Durable",
      subtitle: "Une approche holistique et intégrée pour une santé durable — pas un régime, un mode de vie",
      pillars: [
        { icon: "leaf", title: "Nutrition Intelligente", desc: "Un régime équilibré soutenu par la science" },
        { icon: "activity", title: "Mouvement Quotidien", desc: "Activité physique régulière adaptée à votre style de vie" },
        { icon: "moon", title: "Sommeil Profond", desc: "Un sommeil réparateur qui régénère vos cellules" },
        { icon: "brain", title: "Gestion du Stress", desc: "Outils pour gérer les pressions de la vie" },
        { icon: "heart", title: "Équilibre Hormonal", desc: "Soutien naturel pour votre santé hormonale" },
        { icon: "target", title: "Constance", desc: "Un système durable pour la vie" },
      ],
    },
    es: {
      title: "Salud Sostenible",
      subtitle: "Un enfoque holístico e integrado para una salud duradera — no solo una dieta, un estilo de vida",
      pillars: [
        { icon: "leaf", title: "Nutrición Inteligente", desc: "Dieta equilibrada respaldada por la ciencia" },
        { icon: "activity", title: "Movimiento Diario", desc: "Actividad física regular adaptada a tu estilo de vida" },
        { icon: "moon", title: "Sueño Profundo", desc: "Sueño reparador que regenera tus células" },
        { icon: "brain", title: "Gestión del Estrés", desc: "Herramientas para manejar las presiones de la vida" },
        { icon: "heart", title: "Equilibrio Hormonal", desc: "Apoyo natural para tu salud hormonal" },
        { icon: "target", title: "Constancia", desc: "Un sistema sostenible para toda la vida" },
      ],
    },
    de: {
      title: "Nachhaltige Gesundheit",
      subtitle: "Ein ganzheitlicher Ansatz für dauerhafte Gesundheit — keine Diät, sondern ein Lebensstil",
      pillars: [
        { icon: "leaf", title: "Intelligente Ernährung", desc: "Wissenschaftlich fundierte ausgewogene Ernährung" },
        { icon: "activity", title: "Tägliche Bewegung", desc: "Regelmäßige körperliche Aktivität" },
        { icon: "moon", title: "Tiefer Schlaf", desc: "Erholsamer Schlaf, der Ihre Zellen regeneriert" },
        { icon: "brain", title: "Stressmanagement", desc: "Werkzeuge für den intelligenten Umgang mit Druck" },
        { icon: "heart", title: "Hormonelles Gleichgewicht", desc: "Natürliche Unterstützung für Ihre Gesundheit" },
        { icon: "target", title: "Beständigkeit", desc: "Ein nachhaltiges System fürs Leben" },
      ],
    },
    tr: {
      title: "Sürdürülebilir Sağlık",
      subtitle: "Kalıcı sağlık için bütünsel bir yaklaşım — sadece diyet değil, bir yaşam tarzı",
      pillars: [
        { icon: "leaf", title: "Akıllı Beslenme", desc: "Bilim destekli dengeli beslenme" },
        { icon: "activity", title: "Günlük Hareket", desc: "Yaşam tarzınıza uygun düzenli fiziksel aktivite" },
        { icon: "moon", title: "Derin Uyku", desc: "Hücrelerinizi yenileyen dinlendirici uyku" },
        { icon: "brain", title: "Stres Yönetimi", desc: "Hayatın baskılarıyla başa çıkma araçları" },
        { icon: "heart", title: "Hormonal Denge", desc: "Hormonal sağlığınız için doğal destek" },
        { icon: "target", title: "Süreklilik", desc: "Ömür boyu sürdürebileceğiniz bir sistem" },
      ],
    },
  };

  const c = content[lang] || content.en;

  const iconMap: Record<string, React.ReactNode> = {
    leaf: <Leaf className="w-7 h-7" />,
    activity: <Activity className="w-7 h-7" />,
    moon: <Moon className="w-7 h-7" />,
    brain: <Brain className="w-7 h-7" />,
    heart: <Heart className="w-7 h-7" />,
    target: <Target className="w-7 h-7" />,
  };

  return (
    <section id="sustainable-health" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            Sustainable Health
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{c.title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{c.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {c.pillars.map((pillar, i) => (
            <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {iconMap[pillar.icon]}
                </div>
                <h3 className="text-lg font-bold mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HealthInvestorSection() {
  const { lang } = useLanguage();

  const content: Record<string, { title: string; subtitle: string; points: Array<{ icon: string; title: string; desc: string }> }> = {
    ar: {
      title: "المستثمر الصحي",
      subtitle: "أفضل استثمار في الحياة هو الاستثمار في صحتك — العائد مضمون ومستمر",
      points: [
        { icon: "heart", title: "العائد الصحي", desc: "جسم أقوى، مناعة أفضل، وعمر أطول بجودة حياة عالية" },
        { icon: "zap", title: "الطاقة والحيوية", desc: "طاقة مستدامة طوال اليوم تمكنك من الإنجاز والإبداع" },
        { icon: "trending", title: "الإنتاجية", desc: "تركيز أعلى وأداء أفضل في العمل والحياة الشخصية" },
        { icon: "star", title: "جودة الحياة", desc: "نوم أفضل، مزاج إيجابي، وعلاقات أقوى" },
        { icon: "shield", title: "الوقاية طويلة المدى", desc: "حماية من الأمراض المزمنة وتقليل تكاليف العلاج المستقبلية" },
      ],
    },
    en: {
      title: "Health Investor",
      subtitle: "The best investment in life is investing in your health — guaranteed and continuous returns",
      points: [
        { icon: "heart", title: "Health Returns", desc: "Stronger body, better immunity, and longer life with high quality" },
        { icon: "zap", title: "Energy & Vitality", desc: "Sustainable energy throughout the day for achievement and creativity" },
        { icon: "trending", title: "Productivity", desc: "Higher focus and better performance in work and personal life" },
        { icon: "star", title: "Quality of Life", desc: "Better sleep, positive mood, and stronger relationships" },
        { icon: "shield", title: "Long-term Prevention", desc: "Protection from chronic diseases and reduced future treatment costs" },
      ],
    },
    fr: {
      title: "Investisseur Santé",
      subtitle: "Le meilleur investissement est dans votre santé — des rendements garantis et continus",
      points: [
        { icon: "heart", title: "Rendement Santé", desc: "Corps plus fort, meilleure immunité, vie plus longue" },
        { icon: "zap", title: "Énergie et Vitalité", desc: "Énergie durable toute la journée" },
        { icon: "trending", title: "Productivité", desc: "Meilleure concentration et performance" },
        { icon: "star", title: "Qualité de Vie", desc: "Meilleur sommeil, humeur positive" },
        { icon: "shield", title: "Prévention", desc: "Protection contre les maladies chroniques" },
      ],
    },
    es: {
      title: "Inversor en Salud",
      subtitle: "La mejor inversión es en tu salud — retornos garantizados y continuos",
      points: [
        { icon: "heart", title: "Retorno de Salud", desc: "Cuerpo más fuerte, mejor inmunidad, vida más larga" },
        { icon: "zap", title: "Energía y Vitalidad", desc: "Energía sostenible todo el día" },
        { icon: "trending", title: "Productividad", desc: "Mayor enfoque y mejor rendimiento" },
        { icon: "star", title: "Calidad de Vida", desc: "Mejor sueño, humor positivo" },
        { icon: "shield", title: "Prevención", desc: "Protección contra enfermedades crónicas" },
      ],
    },
    de: {
      title: "Gesundheitsinvestor",
      subtitle: "Die beste Investition ist in Ihre Gesundheit — garantierte und kontinuierliche Renditen",
      points: [
        { icon: "heart", title: "Gesundheitsrendite", desc: "Stärkerer Körper, bessere Immunität" },
        { icon: "zap", title: "Energie und Vitalität", desc: "Nachhaltige Energie den ganzen Tag" },
        { icon: "trending", title: "Produktivität", desc: "Höherer Fokus und bessere Leistung" },
        { icon: "star", title: "Lebensqualität", desc: "Besserer Schlaf, positive Stimmung" },
        { icon: "shield", title: "Langfristige Prävention", desc: "Schutz vor chronischen Krankheiten" },
      ],
    },
    tr: {
      title: "Sağlık Yatırımcısı",
      subtitle: "En iyi yatırım sağlığınıza yapılan yatırımdır — garantili ve sürekli getiriler",
      points: [
        { icon: "heart", title: "Sağlık Getirisi", desc: "Daha güçlü vücut, daha iyi bağışıklık" },
        { icon: "zap", title: "Enerji ve Canlılık", desc: "Gün boyu sürdürülebilir enerji" },
        { icon: "trending", title: "Verimlilik", desc: "Daha yüksek odaklanma ve performans" },
        { icon: "star", title: "Yaşam Kalitesi", desc: "Daha iyi uyku, pozitif ruh hali" },
        { icon: "shield", title: "Uzun Vadeli Önleme", desc: "Kronik hastalıklardan korunma" },
      ],
    },
  };

  const c = content[lang] || content.en;

  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart className="w-6 h-6" />,
    zap: <Zap className="w-6 h-6" />,
    trending: <TrendingUp className="w-6 h-6" />,
    star: <Star className="w-6 h-6" />,
    shield: <Shield className="w-6 h-6" />,
  };

  return (
    <section className="py-24 gradient-section">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4 text-accent" />
            Health Investor
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{c.title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{c.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {c.points.map((point, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0 text-white">
                {iconMap[point.icon]}
              </div>
              <div>
                <h3 className="font-bold mb-1">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnershipSection() {
  const { lang } = useLanguage();

  const content: Record<string, { title: string; subtitle: string; benefits: Array<{ icon: string; title: string; desc: string }>; cta: string }> = {
    ar: {
      title: "لماذا ينضم الناس كشركاء؟",
      subtitle: "انضم لشبكة يونيسيتي العالمية وابنِ مصدر دخل إضافي مستدام مع فريق داعم",
      benefits: [
        { icon: "dollar", title: "دخل إضافي متنامي", desc: "اكسب عمولات من مبيعاتك ومبيعات فريقك بنظام تعويضات سخي" },
        { icon: "clock", title: "حرية الوقت", desc: "اعمل بالوقت الذي يناسبك بدون دوام أو التزامات ثابتة" },
        { icon: "globe", title: "العمل من أي مكان", desc: "كل ما تحتاجه هاتفك واتصال بالإنترنت - اعمل من أي مكان في العالم" },
        { icon: "users", title: "بناء فريق", desc: "ابنِ فريقاً دولياً وطوّر مهاراتك القيادية" },
        { icon: "graduation", title: "تطوير قيادي", desc: "تدريب احترافي مستمر وأدوات تسويقية متقدمة" },
        { icon: "award", title: "مكافآت وسفر", desc: "رحلات عالمية ومكافآت حصرية للشركاء المتميزين" },
      ],
      cta: "سجّل كشريك الآن",
    },
    en: {
      title: "Why Do People Join as Partners?",
      subtitle: "Join Unicity's global network and build a sustainable additional income with a supportive team",
      benefits: [
        { icon: "dollar", title: "Growing Income", desc: "Earn commissions from your sales and your team's sales with a generous plan" },
        { icon: "clock", title: "Time Freedom", desc: "Work on your own schedule with no fixed commitments" },
        { icon: "globe", title: "Work From Anywhere", desc: "All you need is your phone and internet — work from anywhere in the world" },
        { icon: "users", title: "Team Building", desc: "Build an international team and develop your leadership skills" },
        { icon: "graduation", title: "Leadership Development", desc: "Continuous professional training and advanced marketing tools" },
        { icon: "award", title: "Rewards & Travel", desc: "Global trips and exclusive rewards for top partners" },
      ],
      cta: "Register as a Partner Now",
    },
    fr: {
      title: "Pourquoi les gens deviennent partenaires ?",
      subtitle: "Rejoignez le réseau mondial Unicity et construisez un revenu supplémentaire durable",
      benefits: [
        { icon: "dollar", title: "Revenus Croissants", desc: "Gagnez des commissions sur vos ventes et celles de votre équipe" },
        { icon: "clock", title: "Liberté de Temps", desc: "Travaillez à votre rythme sans contraintes fixes" },
        { icon: "globe", title: "Travail à Distance", desc: "Travaillez de n'importe où dans le monde" },
        { icon: "users", title: "Construction d'Équipe", desc: "Construisez une équipe internationale" },
        { icon: "graduation", title: "Développement Leadership", desc: "Formation professionnelle continue" },
        { icon: "award", title: "Récompenses et Voyages", desc: "Voyages mondiaux et récompenses exclusives" },
      ],
      cta: "Devenir Partenaire",
    },
    es: {
      title: "¿Por qué la gente se une como socios?",
      subtitle: "Únete a la red global de Unicity y construye ingresos adicionales sostenibles",
      benefits: [
        { icon: "dollar", title: "Ingresos Crecientes", desc: "Gana comisiones de tus ventas y las de tu equipo" },
        { icon: "clock", title: "Libertad de Tiempo", desc: "Trabaja a tu ritmo sin compromisos fijos" },
        { icon: "globe", title: "Trabajo Remoto", desc: "Trabaja desde cualquier lugar del mundo" },
        { icon: "users", title: "Construcción de Equipo", desc: "Construye un equipo internacional" },
        { icon: "graduation", title: "Desarrollo de Liderazgo", desc: "Formación profesional continua" },
        { icon: "award", title: "Recompensas y Viajes", desc: "Viajes globales y recompensas exclusivas" },
      ],
      cta: "Regístrate como Socio",
    },
    de: {
      title: "Warum werden Menschen Partner?",
      subtitle: "Treten Sie dem globalen Unicity-Netzwerk bei und bauen Sie nachhaltiges Zusatzeinkommen auf",
      benefits: [
        { icon: "dollar", title: "Wachsendes Einkommen", desc: "Verdienen Sie Provisionen aus Ihren Verkäufen und denen Ihres Teams" },
        { icon: "clock", title: "Zeitfreiheit", desc: "Arbeiten Sie nach Ihrem eigenen Zeitplan" },
        { icon: "globe", title: "Ortsunabhängig", desc: "Arbeiten Sie von überall auf der Welt" },
        { icon: "users", title: "Teamaufbau", desc: "Bauen Sie ein internationales Team auf" },
        { icon: "graduation", title: "Führungsentwicklung", desc: "Kontinuierliche professionelle Schulung" },
        { icon: "award", title: "Belohnungen und Reisen", desc: "Globale Reisen und exklusive Belohnungen" },
      ],
      cta: "Jetzt Partner werden",
    },
    tr: {
      title: "İnsanlar Neden Ortak Oluyor?",
      subtitle: "Unicity'nin küresel ağına katılın ve sürdürülebilir ek gelir oluşturun",
      benefits: [
        { icon: "dollar", title: "Büyüyen Gelir", desc: "Satışlarınızdan ve ekibinizin satışlarından komisyon kazanın" },
        { icon: "clock", title: "Zaman Özgürlüğü", desc: "Kendi programınıza göre çalışın" },
        { icon: "globe", title: "Her Yerden Çalışma", desc: "Dünyanın her yerinden çalışın" },
        { icon: "users", title: "Ekip Kurma", desc: "Uluslararası bir ekip kurun" },
        { icon: "graduation", title: "Liderlik Gelişimi", desc: "Sürekli profesyonel eğitim" },
        { icon: "award", title: "Ödüller ve Seyahat", desc: "Küresel geziler ve özel ödüller" },
      ],
      cta: "Şimdi Ortak Olun",
    },
  };

  const c = content[lang] || content.en;

  const iconMap: Record<string, React.ReactNode> = {
    dollar: <DollarSign className="w-7 h-7" />,
    clock: <Clock className="w-7 h-7" />,
    globe: <Globe className="w-7 h-7" />,
    users: <Users className="w-7 h-7" />,
    graduation: <GraduationCap className="w-7 h-7" />,
    award: <Award className="w-7 h-7" />,
  };

  return (
    <section id="partnership" className="py-24 gradient-hero text-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{c.title}</h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">{c.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {c.benefits.map((b, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4 text-amber-300">
                {iconMap[b.icon]}
              </div>
              <h3 className="text-lg font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="text-lg px-10 py-6 gradient-gold text-foreground font-bold border-0 hover:opacity-90">
              {c.cta}
              <ArrowUp className="w-5 h-5 ms-2 rotate-45" />
            </Button>
          </a>
          <a href="/partner">
            <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-white/30 text-white hover:bg-white/10 bg-transparent">
              {lang === "ar" ? "تعرّف على خطوات الشراكة" : "Learn Partnership Steps"}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t, lang } = useLanguage();

  const successImages = [
    { src: "/manus-storage/weight-before-after-1_f52d86b8.jpg", alt: "Weight loss transformation" },
    { src: "/manus-storage/weight-before-after-3_70016147.jpg", alt: "29.5 kg lost with Feel Great" },
    { src: "/manus-storage/weight-before-after-4_6bc9871a.jpg", alt: "Before and after Feel Great" },
    { src: "/manus-storage/weight-before-after-5_3564c26b.jpg", alt: "Feel Great transformation" },
  ];

  const realStories: Record<string, Array<{text: string; name: string; country: string; result: string}>> = {
    ar: [
      { text: "خسرت 29.5 كيلو مع برنامج Feel Great بدون حرمان! من 101.4 كيلو إلى 72 كيلو في أقل من سنة.", name: "أم محمد", country: "السعودية", result: "-29.5 كغ" },
      { text: "كنت صاحبة وزن وأحب الأكل، ومع ذلك نزلت وزني بسهولة مع Feel Great.", name: "سارة", country: "الإمارات", result: "تحول كامل" },
      { text: "مستوى السكر عندي انضبط بشكل ملحوظ بعد شهرين من استخدام Unimate و Balance.", name: "أبو خالد", country: "الكويت", result: "سكر منضبط" },
      { text: "طاقتي تغيرت بالكامل! صرت أصحى نشيطة وأنام مرتاحة.", name: "نورة", country: "البحرين", result: "طاقة عالية" },
    ],
    en: [
      { text: "I lost 29.5 kg with Feel Great without any deprivation! From 101.4 kg to 72 kg in less than a year.", name: "Sarah M.", country: "Saudi Arabia", result: "-29.5 kg" },
      { text: "I loved food and struggled with weight, yet Feel Great made it effortless.", name: "Amira K.", country: "UAE", result: "Full transformation" },
      { text: "My blood sugar levels normalized significantly after 2 months of Unimate and Balance.", name: "Ahmed R.", country: "Kuwait", result: "Balanced glucose" },
      { text: "My energy completely transformed! I wake up energized and sleep peacefully.", name: "Noura H.", country: "Bahrain", result: "High energy" },
    ],
    fr: [
      { text: "J'ai perdu 29,5 kg avec Feel Great sans aucune privation !", name: "Sarah M.", country: "Arabie Saoudite", result: "-29,5 kg" },
      { text: "J'adorais manger mais Feel Great a rendu cela facile.", name: "Amira K.", country: "Émirats", result: "Transformation" },
      { text: "Ma glycémie s'est normalisée après 2 mois.", name: "Ahmed R.", country: "Koweït", result: "Glycémie stable" },
      { text: "Mon énergie a complètement changé !", name: "Noura H.", country: "Bahreïn", result: "Pleine énergie" },
    ],
    es: [
      { text: "Perdí 29,5 kg con Feel Great sin privaciones.", name: "Sarah M.", country: "Arabia Saudita", result: "-29,5 kg" },
      { text: "Me encantaba comer pero Feel Great lo hizo fácil.", name: "Amira K.", country: "Emiratos", result: "Transformación" },
      { text: "Mi glucosa se normalizó después de 2 meses.", name: "Ahmed R.", country: "Kuwait", result: "Glucosa estable" },
      { text: "¡Mi energía cambió por completo!", name: "Noura H.", country: "Bahréin", result: "Alta energía" },
    ],
    de: [
      { text: "Ich habe 29,5 kg mit Feel Great verloren, ohne Verzicht!", name: "Sarah M.", country: "Saudi-Arabien", result: "-29,5 kg" },
      { text: "Ich liebte Essen aber Feel Great machte es mühelos.", name: "Amira K.", country: "VAE", result: "Transformation" },
      { text: "Mein Blutzucker normalisierte sich nach 2 Monaten.", name: "Ahmed R.", country: "Kuwait", result: "Stabile Glukose" },
      { text: "Meine Energie hat sich komplett verändert!", name: "Noura H.", country: "Bahrain", result: "Hohe Energie" },
    ],
    tr: [
      { text: "Feel Great ile 29,5 kg verdim, hiçbir mahrumiyet olmadan!", name: "Sarah M.", country: "Suudi Arabistan", result: "-29,5 kg" },
      { text: "Yemek yemeyi seviyordum ama Feel Great bunu kolaylaştırdı.", name: "Amira K.", country: "BAE", result: "Dönüşüm" },
      { text: "Kan şekerim 2 ay sonra belirgin şekilde düzeldi.", name: "Ahmed R.", country: "Kuveyt", result: "Dengeli glukoz" },
      { text: "Enerjim tamamen değişti!", name: "Noura H.", country: "Bahreyn", result: "Yüksek enerji" },
    ],
  };

  const stories = realStories[lang] || realStories.en;
  const titleLabels: Record<string, { title: string; subtitle: string }> = {
    ar: { title: "قصص نجاح حقيقية", subtitle: "اكتشف كيف غيّر برنامج Feel Great حياة آلاف الأشخاص" },
    en: { title: "Real Success Stories", subtitle: "Discover how Feel Great has changed thousands of lives" },
    fr: { title: "Histoires de Réussite", subtitle: "Découvrez comment Feel Great a changé des milliers de vies" },
    es: { title: "Historias de Éxito", subtitle: "Descubre cómo Feel Great ha cambiado miles de vidas" },
    de: { title: "Echte Erfolgsgeschichten", subtitle: "Entdecken Sie, wie Feel Great tausende Leben verändert hat" },
    tr: { title: "Gerçek Başarı Hikayeleri", subtitle: "Feel Great'in binlerce hayatı nasıl değiştirdiğini keşfedin" },
  };
  const tl = titleLabels[lang] || titleLabels.en;

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{tl.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{tl.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          {successImages.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow aspect-[3/4]">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stories.map((story, i) => (
            <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{story.result}</span>
                </div>
                <p className="text-sm text-foreground/80 mb-4 leading-relaxed italic">"{story.text}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold text-sm">{story.name}</p>
                  <p className="text-xs text-muted-foreground">{story.country}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegistrationForm() {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ fullName: "", phone: "", interestPath: "" as "consumer" | "investor" | "" });
  const [submitted, setSubmitted] = useState(false);

  const registerMutation = trpc.leads.register.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t("form.success"));
      // Track conversion events for retargeting pixels
      if (typeof window !== 'undefined') {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead', { content_name: 'Feel Great Registration', content_category: formData.interestPath || 'undecided' });
        }
        if ((window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', { event_category: 'registration', event_label: formData.interestPath || 'undecided' });
        }
      }
    },
    onError: () => {
      toast.error(t("form.error"));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;
    registerMutation.mutate({
      fullName: formData.fullName,
      phone: formData.phone,
      source: `landing-${lang}`,
      interestPath: formData.interestPath || "undecided",
      language: lang,
    });
  };

  const countries = ["sa", "ae", "eg", "jo", "us", "uk", "fr", "de", "es", "tr", "other"];
  const pathLabels: Record<string, { consumer: string; investor: string; question: string }> = {
    ar: { consumer: "\ud83c\udf3f \u0623\u0631\u064a\u062f \u062a\u062d\u0633\u064a\u0646 \u0635\u062d\u062a\u064a", investor: "\ud83d\udcbc \u0623\u0631\u064a\u062f \u0628\u0646\u0627\u0621 \u062f\u062e\u0644 \u0625\u0636\u0627\u0641\u064a", question: "\u0645\u0627 \u0647\u062f\u0641\u0643 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u061f" },
    en: { consumer: "\ud83c\udf3f Improve my health", investor: "\ud83d\udcbc Build extra income", question: "What's your main goal?" },
    fr: { consumer: "\ud83c\udf3f Am\u00e9liorer ma sant\u00e9", investor: "\ud83d\udcbc G\u00e9n\u00e9rer un revenu", question: "Quel est votre objectif?" },
    es: { consumer: "\ud83c\udf3f Mejorar mi salud", investor: "\ud83d\udcbc Generar ingresos", question: "\u00bfCu\u00e1l es tu objetivo?" },
    de: { consumer: "\ud83c\udf3f Gesundheit verbessern", investor: "\ud83d\udcbc Einkommen aufbauen", question: "Was ist Ihr Ziel?" },
    tr: { consumer: "\ud83c\udf3f Sa\u011fl\u0131\u011f\u0131m\u0131 iyile\u015ftirmek", investor: "\ud83d\udcbc Gelir olu\u015fturmak", question: "Hedefiniz nedir?" },
  };
  const pl = pathLabels[lang] || pathLabels.en;

  if (submitted) {
    const isInvestor = formData.interestPath === "investor";
    const successLabels: Record<string, { title: string; subtitle: string; cta: string }> = {
      ar: {
        title: "\u062a\u0645 \u0627\u0644\u062a\u0633\u062c\u064a\u0644 \u0628\u0646\u062c\u0627\u062d! \ud83c\udf89",
        subtitle: isInvestor ? "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u062a\u0641\u0627\u0635\u064a\u0644 \u062e\u0637\u0629 \u0627\u0644\u062f\u062e\u0644. \u0627\u0644\u062e\u0637\u0648\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629: \u0633\u062c\u0651\u0644 \u062d\u0633\u0627\u0628\u0643 \u0627\u0644\u0645\u062c\u0627\u0646\u064a" : "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a. \u0627\u0644\u062e\u0637\u0648\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629: \u0627\u0637\u0644\u0628 \u0645\u0646\u062a\u062c\u0627\u062a\u0643 \u0627\u0644\u0622\u0646",
        cta: isInvestor ? "\u0633\u062c\u0651\u0644 \u0643\u0634\u0631\u064a\u0643 \u0627\u0644\u0622\u0646" : "\u0627\u0637\u0644\u0628 Feel Great \u0627\u0644\u0622\u0646",
      },
      en: {
        title: "Registration Successful! \ud83c\udf89",
        subtitle: isInvestor ? "Check your email for income plan details. Next step: Create your free account" : "Check your email. Next step: Order your products now",
        cta: isInvestor ? "Register as Partner" : "Order Feel Great Now",
      },
      fr: {
        title: "Inscription r\u00e9ussie! \ud83c\udf89",
        subtitle: isInvestor ? "V\u00e9rifiez votre email. Prochaine \u00e9tape: Cr\u00e9ez votre compte" : "V\u00e9rifiez votre email. Prochaine \u00e9tape: Commandez vos produits",
        cta: isInvestor ? "S'inscrire comme partenaire" : "Commander Feel Great",
      },
      es: {
        title: "\u00a1Registro exitoso! \ud83c\udf89",
        subtitle: isInvestor ? "Revisa tu email. Siguiente paso: Crea tu cuenta" : "Revisa tu email. Siguiente paso: Ordena tus productos",
        cta: isInvestor ? "Reg\u00edstrate como socio" : "Ordenar Feel Great",
      },
      de: {
        title: "Registrierung erfolgreich! \ud83c\udf89",
        subtitle: isInvestor ? "Pr\u00fcfen Sie Ihre E-Mail. N\u00e4chster Schritt: Konto erstellen" : "Pr\u00fcfen Sie Ihre E-Mail. N\u00e4chster Schritt: Produkte bestellen",
        cta: isInvestor ? "Als Partner registrieren" : "Feel Great bestellen",
      },
      tr: {
        title: "Kay\u0131t ba\u015far\u0131l\u0131! \ud83c\udf89",
        subtitle: isInvestor ? "E-postan\u0131z\u0131 kontrol edin. Sonraki ad\u0131m: Hesab\u0131n\u0131z\u0131 olu\u015fturun" : "E-postan\u0131z\u0131 kontrol edin. Sonraki ad\u0131m: \u00dcr\u00fcnlerinizi sipari\u015f edin",
        cta: isInvestor ? "Ortak olarak kaydol" : "Feel Great sipari\u015f et",
      },
    };
    const sl = successLabels[lang] || successLabels.en;
    return (
      <section id="register" className="py-24 gradient-section">
        <div className="container">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">{sl.title}</h3>
            <p className="text-muted-foreground mb-6">{sl.subtitle}</p>
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="text-lg px-8 py-6 gradient-gold text-foreground font-bold border-0 hover:opacity-90">
                {sl.cta} <ArrowRight className="w-5 h-5 ms-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="py-24 gradient-section">
      <div className="container">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("form.title")}</h2>
            <p className="text-muted-foreground">{t("form.subtitle")}</p>
          </div>

          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Path Classification */}
                <div>
                  <label className="block text-sm font-medium mb-3">{pl.question}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, interestPath: "consumer" }))}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                        formData.interestPath === "consumer"
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-md scale-[1.02]"
                          : "border-border hover:border-green-300 hover:bg-green-50/50 dark:hover:bg-green-950/10"
                      }`}
                    >
                      <span className="text-sm font-medium">{pl.consumer}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, interestPath: "investor" }))}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                        formData.interestPath === "investor"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-md scale-[1.02]"
                          : "border-border hover:border-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/10"
                      }`}
                    >
                      <span className="text-sm font-medium">{pl.investor}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("form.name")}</label>
                  <Input value={formData.fullName} onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))} placeholder={t("form.name")} required className="h-12" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{lang === 'ar' ? 'رقم الواتساب' : 'WhatsApp Number'}</label>
                  <Input type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder={lang === 'ar' ? '+966 5xx xxx xxxx' : '+1 xxx xxx xxxx'} required className="h-12" />
                </div>
                <Button type="submit" size="lg" className="w-full h-12 text-lg font-bold gradient-blue border-0" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "..." : t("form.submit")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { lang } = useLanguage();

  const labels: Record<string, { rights: string; disclaimer: string; follow: string }> = {
    ar: { rights: "جميع الحقوق محفوظة", disclaimer: "هذه المنتجات ليست مخصصة لتشخيص أو علاج أو الوقاية من أي مرض", follow: "تابعنا" },
    en: { rights: "All rights reserved", disclaimer: "These products are not intended to diagnose, treat, cure, or prevent any disease", follow: "Follow Us" },
    fr: { rights: "Tous droits réservés", disclaimer: "Ces produits ne sont pas destinés à diagnostiquer, traiter ou prévenir une maladie", follow: "Suivez-nous" },
    es: { rights: "Todos los derechos reservados", disclaimer: "Estos productos no están destinados a diagnosticar, tratar o prevenir ninguna enfermedad", follow: "Síguenos" },
    de: { rights: "Alle Rechte vorbehalten", disclaimer: "Diese Produkte sind nicht zur Diagnose, Behandlung oder Vorbeugung von Krankheiten bestimmt", follow: "Folgen Sie uns" },
    tr: { rights: "Tüm hakları saklıdır", disclaimer: "Bu ürünler herhangi bir hastalığı teşhis, tedavi veya önleme amacı taşımamaktadır", follow: "Bizi Takip Edin" },
  };
  const l = labels[lang] || labels.en;

  return (
    <footer className="py-12 bg-foreground text-white/60">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Feel Great</h3>
            <p className="text-sm leading-relaxed">{lang === "ar" ? "منصة الصحة المستدامة والاستثمار الصحي وبناء الشراكات" : "Sustainable Health & Partnership Platform"}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-3">{lang === "ar" ? "روابط سريعة" : "Quick Links"}</h4>
            <div className="space-y-2 text-sm">
              <a href="/feras-alayed" className="block hover:text-white transition-colors">{lang === "ar" ? "مركز المعرفة" : "Knowledge Hub"}</a>
              <a href="/blog" className="block hover:text-white transition-colors">{lang === "ar" ? "المدونة الصحية" : "Health Blog"}</a>
              <a href="/research" className="block hover:text-white transition-colors">{lang === "ar" ? "مركز الأبحاث" : "Research Hub"}</a>
              <a href="/today-in-health-science" className="block hover:text-white transition-colors">{lang === "ar" ? "اليوم في العلوم الصحية" : "Today in Health Science"}</a>
              <a href="/health-library" className="block hover:text-white transition-colors">{lang === "ar" ? "المكتبة الصحية" : "Health Library"}</a>
              <a href="/partner" className="block hover:text-white transition-colors">{lang === "ar" ? "كن شريكاً" : "Become a Partner"}</a>
              <a href="/faq" className="block hover:text-white transition-colors">{lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}</a>
              <a href="/about" className="block hover:text-white transition-colors">{lang === "ar" ? "عن المنصة" : "About"}</a>
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-bold text-white mb-3">{l.follow}</h4>
            <div className="flex gap-3 mb-4">
              <a href="https://www.instagram.com/use2lose" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-pink-500/20 flex items-center justify-center transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@feras.alayed" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="TikTok">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.88 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.82.11V9.4a6.33 6.33 0 00-.82-.05A6.34 6.34 0 003.15 15.7 6.34 6.34 0 009.49 22a6.34 6.34 0 006.34-6.34V9.01a8.24 8.24 0 004.76 1.5v-3.4a4.85 4.85 0 01-1-.42z"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1Ey17WcWyT/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500/20 flex items-center justify-center transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-green-500/20 flex items-center justify-center transition-colors" aria-label="WhatsApp">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
            <p className="text-sm">Feras Al-Ayed</p>
            <p className="text-xs">Presidential Sapphire | Unicity International</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-sm mb-2">© 2024 Feel Great. {l.rights}</p>
          <p className="text-xs mb-3">{l.disclaimer}</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/privacy" className="hover:text-white transition-colors">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a>
            <span className="text-white/30">|</span>
            <a href="/terms" className="hover:text-white transition-colors">{lang === "ar" ? "شروط الاستخدام" : "Terms of Use"}</a>
            <span className="text-white/30">|</span>
            <a href="/start" className="hover:text-white transition-colors">{lang === "ar" ? "ابدأ هنا" : "Start Here"}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/96877020770?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D9%85%D8%B9%D8%B1%D9%81%D8%A9%20%D8%A7%D9%84%D9%85%D8%B2%D9%8A%D8%AF%20%D8%B9%D9%86%20%D8%A8%D8%B1%D9%86%D8%A7%D9%85%D8%AC%20%D8%A7%D9%84%D8%B5%D8%AD%D8%A9%20%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D8%AF%D8%A7%D9%85%D8%A9%20%D9%88%D9%81%D8%B1%D8%B5%D8%A9%20%D8%A7%D9%84%D8%B4%D8%B1%D8%A7%D9%83%D8%A9"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 start-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-200"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

function StickyCTA() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/98 to-slate-800/98 backdrop-blur-md border-t border-amber-500/20 shadow-2xl py-3 px-4 animate-in slide-in-from-bottom duration-300">
      <div className="container flex items-center justify-between gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <p className="text-sm font-medium text-white/90">
            {lang === "ar" ? "ابدأ رحلتك الصحية مع فراس" : "Start your health journey with Feras"}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-center">
          {/* Primary CTA: Book Consultation */}
          <a href="https://wa.me/96877020770?text=I'd%20like%20to%20book%20a%20free%20consultation" target="_blank" rel="noopener noreferrer" className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-full text-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/25">
            <Phone className="w-3.5 h-3.5" />
            {lang === "ar" ? "احجز استشارة مجانية" : "Book Free Consultation"}
          </a>
          {/* Secondary CTA: Take Assessment */}
          <a href="/health-assessment" className="border border-white/30 hover:border-amber-400/50 text-white font-medium px-4 py-2.5 rounded-full text-sm transition-all hover:bg-white/5 whitespace-nowrap hidden md:inline-flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            {lang === "ar" ? "تقييم صحتك" : "Health Assessment"}
          </a>
          {/* Tertiary CTA: WhatsApp */}
          <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-400 text-white font-bold w-10 h-10 rounded-full text-sm transition-all inline-flex items-center justify-center sm:hidden">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function SchemaMarkup() {
  useEffect(() => {
    // Set page title and meta description
    document.title = "Feel Great | Sustainable Health by Feras Alayed";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Feel Great by Feras Alayed - Science-backed sustainable health system. Transform your health and build income with Unicity.');
    const metaCanonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    metaCanonical.setAttribute('rel', 'canonical');
    metaCanonical.setAttribute('href', 'https://feelgreat.us.com/');
    if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(metaCanonical);

    // Organization Schema
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Feel Great by Feras Alayed",
      url: "https://feelgreat.us.com",
      logo: "https://feelgreat.us.com/favicon.ico",
      description: "Sustainable health and wellness platform by Feras Alayed - Therapeutic & Behavioral Nutrition Specialist",
      founder: {
        "@type": "Person",
        name: "Feras Alayed",
        jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
        url: "https://feelgreat.us.com/feras-alayed",
        sameAs: [
          "https://www.instagram.com/use2lose",
          "https://www.tiktok.com/@feras.alayed"
        ]
      },
      sameAs: [
        "https://www.instagram.com/use2lose",
        "https://www.tiktok.com/@feras.alayed"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+96877020770",
        contactType: "customer service",
        availableLanguage: ["Arabic", "English"]
      }
    };

    // WebSite Schema with SearchAction
    const webSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Feel Great",
      url: "https://feelgreat.us.com",
      description: "Invest in your health today. Sustainable health, behavioral nutrition, and partnership opportunities.",
      publisher: { "@type": "Organization", name: "Feel Great by Feras Alayed" },
      inLanguage: ["ar", "en", "fr", "de", "tr", "es"]
    };

    const orgEl = document.createElement("script");
    orgEl.id = "org-schema";
    orgEl.type = "application/ld+json";
    orgEl.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(orgEl);

    const webEl = document.createElement("script");
    webEl.id = "web-schema";
    webEl.type = "application/ld+json";
    webEl.textContent = JSON.stringify(webSchema);
    document.head.appendChild(webEl);

    return () => {
      document.getElementById("org-schema")?.remove();
      document.getElementById("web-schema")?.remove();
    };
  }, []);

  return null;
}

function ProblemSection() {
  const { lang } = useLanguage();

  const content: Record<string, { title: string; subtitle: string; problems: Array<{ stat: string; desc: string }> }> = {
    ar: {
      title: "المشكلة التي لا يتحدث عنها أحد",
      subtitle: "88% من البالغين يعانون من خلل أيضي — وأغلبهم لا يعرفون",
      problems: [
        { stat: "1 من 3", desc: "بالغين لديهم مقاومة إنسولين بدون تشخيص" },
        { stat: "73%", desc: "من الحميات تفشل خلال أول 6 أشهر" },
        { stat: "$4.1T", desc: "تكلفة الأمراض المزمنة سنوياً في أمريكا" },
        { stat: "10-15", desc: "سنة من العمر تُفقد بسبب الإهمال الصحي" },
      ],
    },
    en: {
      title: "The Problem No One Talks About",
      subtitle: "88% of adults have suboptimal metabolic health — and most don't know it",
      problems: [
        { stat: "1 in 3", desc: "adults have undiagnosed insulin resistance" },
        { stat: "73%", desc: "of diets fail within the first 6 months" },
        { stat: "$4.1T", desc: "annual cost of chronic disease in the US" },
        { stat: "10-15", desc: "quality years lost to preventable health decline" },
      ],
    },
    fr: {
      title: "Le Problème Dont Personne Ne Parle",
      subtitle: "88% des adultes ont une santé métabolique sous-optimale",
      problems: [
        { stat: "1 sur 3", desc: "adultes ont une résistance à l'insuline non diagnostiquée" },
        { stat: "73%", desc: "des régimes échouent dans les 6 premiers mois" },
        { stat: "4,1T$", desc: "coût annuel des maladies chroniques aux USA" },
        { stat: "10-15", desc: "années de qualité perdues" },
      ],
    },
    es: {
      title: "El Problema Del Que Nadie Habla",
      subtitle: "88% de los adultos tienen salud metabólica subóptima",
      problems: [
        { stat: "1 de 3", desc: "adultos tienen resistencia a la insulina sin diagnosticar" },
        { stat: "73%", desc: "de las dietas fracasan en los primeros 6 meses" },
        { stat: "$4.1T", desc: "costo anual de enfermedades crónicas en EE.UU." },
        { stat: "10-15", desc: "años de calidad perdidos" },
      ],
    },
    de: {
      title: "Das Problem, Über Das Niemand Spricht",
      subtitle: "88% der Erwachsenen haben suboptimale Stoffwechselgesundheit",
      problems: [
        { stat: "1 von 3", desc: "Erwachsenen haben unerkannte Insulinresistenz" },
        { stat: "73%", desc: "der Diäten scheitern in den ersten 6 Monaten" },
        { stat: "4,1T$", desc: "jährliche Kosten chronischer Krankheiten in den USA" },
        { stat: "10-15", desc: "Qualitätsjahre gehen verloren" },
      ],
    },
    tr: {
      title: "Kimsenin Konuşmadığı Sorun",
      subtitle: "Yetişkinlerin %88'i optimal altı metabolik sağlığa sahip",
      problems: [
        { stat: "3'te 1", desc: "yetişkinin teşhis edilmemiş insülin direnci var" },
        { stat: "%73", desc: "diyetler ilk 6 ayda başarısız oluyor" },
        { stat: "4,1T$", desc: "ABD'de kronik hastalıkların yıllık maliyeti" },
        { stat: "10-15", desc: "önlenebilir sağlık düşüşüne kaybedilen yıl" },
      ],
    },
  };

  const c = content[lang] || content.en;

  return (
    <section className="py-20 bg-slate-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{c.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {c.problems.map((p, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-red-100">
              <div className="text-2xl md:text-3xl font-bold text-red-500 mb-2">{p.stat}</div>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-muted-foreground italic max-w-xl mx-auto">
            {lang === "ar" ? "ماذا لو كان هناك نهج مختلف — نهج يعالج السبب الجذري بدلاً من الأعراض؟" : "What if there was a different approach — one that addresses the root cause, not just the symptoms?"}
          </p>
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(end, 2000);
  return (
    <div ref={ref} className="bg-primary/5 rounded-xl p-4 text-center">
      <div className="text-2xl font-bold text-primary">{count}{suffix}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function TrustAuthoritySection() {
  const { lang } = useLanguage();

  const content: Record<string, { title: string; subtitle: string }> = {
    ar: { title: "لماذا يثق الناس بفراس العايد؟", subtitle: "أكثر من عقد من الخبرة في التحول الصحي والقيادة العالمية" },
    en: { title: "Why People Trust Feras Alayed", subtitle: "Over a decade of experience in health transformation and global leadership" },
    fr: { title: "Pourquoi Faire Confiance à Feras Alayed", subtitle: "Plus d'une décennie d'expérience en transformation santé" },
    es: { title: "Por Qué Confiar en Feras Alayed", subtitle: "Más de una década de experiencia en transformación de salud" },
    de: { title: "Warum Menschen Feras Alayed Vertrauen", subtitle: "Über ein Jahrzehnt Erfahrung in Gesundheitstransformation" },
    tr: { title: "İnsanlar Neden Feras Alayed'e Güveniyor", subtitle: "Sağlık dönüşümünde on yılı aşkın deneyim" },
  };
  const c = content[lang] || content.en;

  const stats = [
    { end: 50, suffix: "+", label: lang === "ar" ? "دولة" : "Countries" },
    { end: 10000, suffix: "+", label: lang === "ar" ? "عميل" : "Clients" },
    { end: 5000, suffix: "+", label: lang === "ar" ? "استشارة" : "Consultations" },
    { end: 12, suffix: "+", label: lang === "ar" ? "سنة خبرة" : "Years" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{c.title}</h2>
            <p className="text-muted-foreground mb-6">{c.subtitle}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((s, i) => (
                <AnimatedCounter key={i} end={s.end} suffix={s.suffix} label={s.label} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {["Global Trainer", "Health Strategist", "Leadership Mentor", "Behavioral Nutrition", "Presidential Sapphire"].map((badge, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">{badge}</span>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img loading="lazy"
              src="/manus-storage/feras-portrait-1_d1f8a83f.png"
              alt="Feras Alayed"
              className="rounded-2xl shadow-xl max-h-[400px] object-cover"

            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TransformationSection() {
  const { lang } = useLanguage();

  const content: Record<string, { title: string; subtitle: string; steps: Array<{ before: string; after: string }> }> = {
    ar: {
      title: "التحول الذي ينتظرك",
      subtitle: "من حيث أنت الآن… إلى حيث تستحق أن تكون",
      steps: [
        { before: "تعب مزمن وطاقة منخفضة", after: "طاقة مستدامة طوال اليوم" },
        { before: "حميات فاشلة ووزن متذبذب", after: "نظام مستدام بنتائج دائمة" },
        { before: "مقاومة إنسولين صامتة", after: "صحة أيضية متوازنة" },
        { before: "قلق على المستقبل الصحي", after: "ثقة وسيطرة على صحتك" },
      ],
    },
    en: {
      title: "The Transformation Awaiting You",
      subtitle: "From where you are now… to where you deserve to be",
      steps: [
        { before: "Chronic fatigue and low energy", after: "Sustained energy all day long" },
        { before: "Failed diets and fluctuating weight", after: "Sustainable system with lasting results" },
        { before: "Silent insulin resistance", after: "Balanced metabolic health" },
        { before: "Anxiety about future health", after: "Confidence and control over your health" },
      ],
    },
    fr: {
      title: "La Transformation Qui Vous Attend",
      subtitle: "De là où vous êtes… à là où vous méritez d'être",
      steps: [
        { before: "Fatigue chronique", after: "Énergie durable toute la journée" },
        { before: "Régimes échoués", after: "Système durable avec résultats" },
        { before: "Résistance à l'insuline silencieuse", after: "Santé métabolique équilibrée" },
        { before: "Anxiété sur la santé future", after: "Confiance et contrôle" },
      ],
    },
    es: {
      title: "La Transformación Que Te Espera",
      subtitle: "De donde estás ahora… a donde mereces estar",
      steps: [
        { before: "Fatiga crónica y baja energía", after: "Energía sostenida todo el día" },
        { before: "Dietas fallidas y peso fluctuante", after: "Sistema sostenible con resultados" },
        { before: "Resistencia a la insulina silenciosa", after: "Salud metabólica equilibrada" },
        { before: "Ansiedad sobre la salud futura", after: "Confianza y control" },
      ],
    },
    de: {
      title: "Die Transformation, Die Auf Sie Wartet",
      subtitle: "Von wo Sie jetzt sind… zu wo Sie es verdienen zu sein",
      steps: [
        { before: "Chronische Müdigkeit", after: "Nachhaltige Energie den ganzen Tag" },
        { before: "Gescheiterte Diäten", after: "Nachhaltiges System mit Ergebnissen" },
        { before: "Stille Insulinresistenz", after: "Ausgeglichene Stoffwechselgesundheit" },
        { before: "Gesundheitsangst", after: "Vertrauen und Kontrolle" },
      ],
    },
    tr: {
      title: "Sizi Bekleyen Dönüşüm",
      subtitle: "Şu an olduğunuz yerden… olmayı hak ettiğiniz yere",
      steps: [
        { before: "Kronik yorgunluk", after: "Gün boyu sürdürülebilir enerji" },
        { before: "Başarısız diyetler", after: "Kalıcı sonuçlarla sürdürülebilir sistem" },
        { before: "Sessiz insülin direnci", after: "Dengeli metabolik sağlık" },
        { before: "Gelecek sağlık kaygısı", after: "Güven ve kontrol" },
      ],
    },
  };
  const c = content[lang] || content.en;

  return (
    <section className="py-20 gradient-section">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{c.title}</h2>
          <p className="text-lg text-muted-foreground">{c.subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {c.steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-red-400 line-through text-sm">{step.before}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-600 font-medium">→ {step.after}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SuccessStoriesSection() {
  const { lang } = useLanguage();
  const content: Record<string, { title: string; subtitle: string; cta: string; categories: Array<{ name: string; count: string; icon: any; color: string }> }> = {
    ar: {
      title: "قصص نجاح حقيقية",
      subtitle: "أكثر من 500 قصة نجاح موثقة في 14 فئة صحية مختلفة",
      cta: "شاهد جميع القصص",
      categories: [
        { name: "نزول الوزن", count: "120+", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
        { name: "مقاومة الأنسولين", count: "85+", icon: Activity, color: "from-blue-500 to-indigo-600" },
        { name: "السكري", count: "70+", icon: Heart, color: "from-red-500 to-rose-600" },
        { name: "القولون والهضم", count: "60+", icon: Leaf, color: "from-amber-500 to-orange-600" },
        { name: "الطاقة والنشاط", count: "55+", icon: Zap, color: "from-yellow-500 to-amber-600" },
        { name: "صحة المرأة", count: "45+", icon: Shield, color: "from-pink-500 to-rose-600" },
      ],
    },
    en: {
      title: "Real Success Stories",
      subtitle: "Over 500 documented success stories across 14 different health categories",
      cta: "View All Stories",
      categories: [
        { name: "Weight Loss", count: "120+", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
        { name: "Insulin Resistance", count: "85+", icon: Activity, color: "from-blue-500 to-indigo-600" },
        { name: "Diabetes", count: "70+", icon: Heart, color: "from-red-500 to-rose-600" },
        { name: "Gut Health", count: "60+", icon: Leaf, color: "from-amber-500 to-orange-600" },
        { name: "Energy & Vitality", count: "55+", icon: Zap, color: "from-yellow-500 to-amber-600" },
        { name: "Women's Health", count: "45+", icon: Shield, color: "from-pink-500 to-rose-600" },
      ],
    },
    fr: {
      title: "Histoires de Réussite Réelles",
      subtitle: "Plus de 500 histoires documentées dans 14 catégories de santé",
      cta: "Voir Toutes les Histoires",
      categories: [
        { name: "Perte de Poids", count: "120+", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
        { name: "Résistance à l'Insuline", count: "85+", icon: Activity, color: "from-blue-500 to-indigo-600" },
        { name: "Diabète", count: "70+", icon: Heart, color: "from-red-500 to-rose-600" },
        { name: "Santé Intestinale", count: "60+", icon: Leaf, color: "from-amber-500 to-orange-600" },
        { name: "Énergie & Vitalité", count: "55+", icon: Zap, color: "from-yellow-500 to-amber-600" },
        { name: "Santé Féminine", count: "45+", icon: Shield, color: "from-pink-500 to-rose-600" },
      ],
    },
    es: {
      title: "Historias de Éxito Reales",
      subtitle: "Más de 500 historias documentadas en 14 categorías de salud",
      cta: "Ver Todas las Historias",
      categories: [
        { name: "Pérdida de Peso", count: "120+", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
        { name: "Resistencia a la Insulina", count: "85+", icon: Activity, color: "from-blue-500 to-indigo-600" },
        { name: "Diabetes", count: "70+", icon: Heart, color: "from-red-500 to-rose-600" },
        { name: "Salud Intestinal", count: "60+", icon: Leaf, color: "from-amber-500 to-orange-600" },
        { name: "Energía & Vitalidad", count: "55+", icon: Zap, color: "from-yellow-500 to-amber-600" },
        { name: "Salud Femenina", count: "45+", icon: Shield, color: "from-pink-500 to-rose-600" },
      ],
    },
    de: {
      title: "Echte Erfolgsgeschichten",
      subtitle: "Über 500 dokumentierte Erfolgsgeschichten in 14 Gesundheitskategorien",
      cta: "Alle Geschichten Ansehen",
      categories: [
        { name: "Gewichtsverlust", count: "120+", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
        { name: "Insulinresistenz", count: "85+", icon: Activity, color: "from-blue-500 to-indigo-600" },
        { name: "Diabetes", count: "70+", icon: Heart, color: "from-red-500 to-rose-600" },
        { name: "Darmgesundheit", count: "60+", icon: Leaf, color: "from-amber-500 to-orange-600" },
        { name: "Energie & Vitalität", count: "55+", icon: Zap, color: "from-yellow-500 to-amber-600" },
        { name: "Frauengesundheit", count: "45+", icon: Shield, color: "from-pink-500 to-rose-600" },
      ],
    },
    tr: {
      title: "Gerçek Başarı Hikayeleri",
      subtitle: "14 farklı sağlık kategorisinde 500'den fazla belgelenmiş başarı hikayesi",
      cta: "Tüm Hikayeleri Gör",
      categories: [
        { name: "Kilo Kaybı", count: "120+", icon: TrendingUp, color: "from-green-500 to-emerald-600" },
        { name: "İnsülin Direnci", count: "85+", icon: Activity, color: "from-blue-500 to-indigo-600" },
        { name: "Diyabet", count: "70+", icon: Heart, color: "from-red-500 to-rose-600" },
        { name: "Bağırsak Sağlığı", count: "60+", icon: Leaf, color: "from-amber-500 to-orange-600" },
        { name: "Enerji & Canlılık", count: "55+", icon: Zap, color: "from-yellow-500 to-amber-600" },
        { name: "Kadın Sağlığı", count: "45+", icon: Shield, color: "from-pink-500 to-rose-600" },
      ],
    },
  };
  const c = content[lang] || content.en;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-4">
            <Star className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">500+ Documented Results</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{c.title}</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {c.categories.map((cat, i) => (
            <div key={i} className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700 p-6 hover:border-slate-500 transition-all duration-300 hover:scale-[1.02]">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <cat.icon className="w-8 h-8 text-slate-300 mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{cat.count}</div>
              <div className="text-sm text-slate-400">{cat.name}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/success-stories"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5" />
            {c.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

function LatestArticlesSection() {
  const { lang } = useLanguage();
  const { data, isLoading } = trpc.blog.list.useQuery({ limit: 6, offset: 0 });

  const labels: Record<string, { title: string; subtitle: string; cta: string; readTime: string }> = {
    ar: { title: "أحدث المقالات الصحية", subtitle: "محتوى يومي مبني على العلم والخبرة", cta: "تصفح جميع المقالات", readTime: "دقيقة قراءة" },
    en: { title: "Latest Health Articles", subtitle: "Daily science-backed content for your health journey", cta: "Browse All Articles", readTime: "min read" },
    fr: { title: "Derniers Articles Santé", subtitle: "Contenu quotidien basé sur la science", cta: "Voir Tous les Articles", readTime: "min de lecture" },
    es: { title: "Últimos Artículos de Salud", subtitle: "Contenido diario basado en ciencia", cta: "Ver Todos los Artículos", readTime: "min de lectura" },
    de: { title: "Neueste Gesundheitsartikel", subtitle: "Tägliche wissenschaftlich fundierte Inhalte", cta: "Alle Artikel Ansehen", readTime: "Min. Lesezeit" },
    tr: { title: "En Son Sağlık Makaleleri", subtitle: "Bilime dayalı günlük içerik", cta: "Tüm Makaleleri Gör", readTime: "dk okuma" },
  };
  const l = labels[lang] || labels.en;
  const isAr = lang === "ar";

  const getTitle = (article: any) => {
    const map: Record<string, string> = { ar: article.titleAr, en: article.titleEn, fr: article.titleFr, es: article.titleEs, de: article.titleDe, tr: article.titleTr };
    return map[lang] || article.titleEn || article.titleAr;
  };
  const getExcerpt = (article: any) => {
    const map: Record<string, string> = { ar: article.excerptAr, en: article.excerptEn, fr: article.excerptFr, es: article.excerptEs, de: article.excerptDe, tr: article.excerptTr };
    return map[lang] || article.excerptEn || article.excerptAr;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-3">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">3 {lang === 'ar' ? 'مقالات يومياً' : lang === 'fr' ? 'articles par jour' : lang === 'es' ? 'artículos diarios' : lang === 'de' ? 'Artikel täglich' : lang === 'tr' ? 'günlük makale' : 'articles daily'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{l.title}</h2>
            <p className="text-muted-foreground mt-2">{l.subtitle}</p>
          </div>
          <a href="/blog" className="hidden md:inline-flex items-center gap-2 text-primary font-medium hover:underline">
            {l.cta} <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl border border-border p-5">
                <Skeleton className="h-40 w-full rounded-xl mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.articles?.slice(0, 6).map((article: any) => (
              <a key={article.id} href={`/blog/${article.slug}`} className="group rounded-2xl border border-border bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
                {article.heroImageUrl && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={article.heroImageUrl} alt={getTitle(article)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.readTimeMinutes} {l.readTime}</span>
                  </div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">{getTitle(article)}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{getExcerpt(article)}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <a href="/blog" className="inline-flex items-center gap-2 text-primary font-medium">
            {l.cta} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function LatestResearchSection() {
  const { lang } = useLanguage();
  const { data, isLoading } = trpc.research.list.useQuery({ limit: 4 });

  const labels: Record<string, { title: string; subtitle: string; cta: string }> = {
    ar: { title: "أحدث الأبحاث العلمية", subtitle: "ملخصات علمية من أهم المجلات الطبية العالمية", cta: "استكشف مركز الأبحاث" },
    en: { title: "Latest Scientific Research", subtitle: "Curated summaries from top medical journals worldwide", cta: "Explore Research Hub" },
    fr: { title: "Dernières Recherches Scientifiques", subtitle: "Résumés des meilleures revues médicales mondiales", cta: "Explorer le Centre de Recherche" },
    es: { title: "Últimas Investigaciones Científicas", subtitle: "Resúmenes de las principales revistas médicas del mundo", cta: "Explorar Centro de Investigación" },
    de: { title: "Neueste Wissenschaftliche Forschung", subtitle: "Zusammenfassungen aus führenden medizinischen Fachzeitschriften", cta: "Forschungszentrum Erkunden" },
    tr: { title: "En Son Bilimsel Araştırmalar", subtitle: "Dünyanın önde gelen tıp dergilerinden özetler", cta: "Araştırma Merkezini Keşfedin" },
  };
  const l = labels[lang] || labels.en;

  const getTitle = (study: any) => {
    const map: Record<string, string> = { ar: study.titleAr, en: study.titleEn, fr: study.titleFr, es: study.titleEs, de: study.titleDe, tr: study.titleTr };
    return map[lang] || study.titleEn || study.titleAr;
  };
  const getSummary = (study: any) => {
    const map: Record<string, string> = { ar: study.summary30sAr, en: study.summary30sEn, fr: study.summary30sFr, es: study.summary30sEs, de: study.summary30sDe, tr: study.summary30sTr };
    return map[lang] || study.summary30sEn || study.summary30sAr;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 mb-3">
              <FlaskConical className="w-4 h-4 text-purple-600" />
              <span className="text-purple-700 text-sm font-medium">PubMed + Multi-Source</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{l.title}</h2>
            <p className="text-muted-foreground mt-2">{l.subtitle}</p>
          </div>
          <a href="/research" className="hidden md:inline-flex items-center gap-2 text-purple-600 font-medium hover:underline">
            {l.cta} <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="rounded-2xl border border-border p-6">
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {data?.studies?.slice(0, 4).map((study: any) => (
              <a key={study.id} href={`/research/${study.slug}`} className="group rounded-2xl border border-border bg-white hover:shadow-lg hover:border-purple-200 transition-all duration-300 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">{study.topic}</span>
                  <span className="text-xs text-muted-foreground">{study.journal}</span>
                </div>
                <h3 className="font-bold text-foreground group-hover:text-purple-700 transition-colors line-clamp-2 mb-2">{getTitle(study)}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{getSummary(study)}</p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{study.evidenceLevel}</span>
                  {study.impactScore > 0 && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">★ {study.impactScore}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <a href="/research" className="inline-flex items-center gap-2 text-purple-600 font-medium">
            {l.cta} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function HealthLibraryPreview() {
  const { lang } = useLanguage();

  const labels: Record<string, { title: string; subtitle: string; cta: string }> = {
    ar: { title: "المكتبة الصحية", subtitle: "7 مراكز معرفية شاملة لكل جانب من صحتك", cta: "استكشف المكتبة" },
    en: { title: "Health Library", subtitle: "7 comprehensive knowledge hubs covering every aspect of your health", cta: "Explore Library" },
    fr: { title: "Bibliothèque Santé", subtitle: "7 centres de connaissances couvrant chaque aspect de votre santé", cta: "Explorer la Bibliothèque" },
    es: { title: "Biblioteca de Salud", subtitle: "7 centros de conocimiento que cubren cada aspecto de tu salud", cta: "Explorar Biblioteca" },
    de: { title: "Gesundheitsbibliothek", subtitle: "7 umfassende Wissenszentren für jeden Aspekt Ihrer Gesundheit", cta: "Bibliothek Erkunden" },
    tr: { title: "Sağlık Kütüphanesi", subtitle: "Sağlığınızın her yönünü kapsayan 7 kapsamlı bilgi merkezi", cta: "Kütüphaneyi Keşfedin" },
  };
  const l = labels[lang] || labels.en;

  const hubs: Record<string, Array<{ slug: string; title: string; icon: any; color: string }>> = {
    ar: [
      { slug: "insulin-resistance", title: "مقاومة الإنسولين", icon: Activity, color: "from-blue-500 to-indigo-600" },
      { slug: "gut-health", title: "صحة الأمعاء", icon: Leaf, color: "from-green-500 to-emerald-600" },
      { slug: "sustainable-health", title: "الصحة المستدامة", icon: Heart, color: "from-rose-500 to-pink-600" },
      { slug: "weight-loss", title: "إنقاص الوزن", icon: TrendingUp, color: "from-amber-500 to-orange-600" },
      { slug: "sleep-health", title: "صحة النوم", icon: Moon, color: "from-indigo-500 to-purple-600" },
      { slug: "womens-health", title: "صحة المرأة", icon: Shield, color: "from-pink-500 to-rose-600" },
      { slug: "metabolic-health", title: "الصحة الأيضية", icon: Zap, color: "from-yellow-500 to-amber-600" },
    ],
    en: [
      { slug: "insulin-resistance", title: "Insulin Resistance", icon: Activity, color: "from-blue-500 to-indigo-600" },
      { slug: "gut-health", title: "Gut Health", icon: Leaf, color: "from-green-500 to-emerald-600" },
      { slug: "sustainable-health", title: "Sustainable Health", icon: Heart, color: "from-rose-500 to-pink-600" },
      { slug: "weight-loss", title: "Weight Loss", icon: TrendingUp, color: "from-amber-500 to-orange-600" },
      { slug: "sleep-health", title: "Sleep Health", icon: Moon, color: "from-indigo-500 to-purple-600" },
      { slug: "womens-health", title: "Women's Health", icon: Shield, color: "from-pink-500 to-rose-600" },
      { slug: "metabolic-health", title: "Metabolic Health", icon: Zap, color: "from-yellow-500 to-amber-600" },
    ],
    fr: [
      { slug: "insulin-resistance", title: "Résistance à l'Insuline", icon: Activity, color: "from-blue-500 to-indigo-600" },
      { slug: "gut-health", title: "Santé Intestinale", icon: Leaf, color: "from-green-500 to-emerald-600" },
      { slug: "sustainable-health", title: "Santé Durable", icon: Heart, color: "from-rose-500 to-pink-600" },
      { slug: "weight-loss", title: "Perte de Poids", icon: TrendingUp, color: "from-amber-500 to-orange-600" },
      { slug: "sleep-health", title: "Santé du Sommeil", icon: Moon, color: "from-indigo-500 to-purple-600" },
      { slug: "womens-health", title: "Santé Féminine", icon: Shield, color: "from-pink-500 to-rose-600" },
      { slug: "metabolic-health", title: "Santé Métabolique", icon: Zap, color: "from-yellow-500 to-amber-600" },
    ],
    es: [
      { slug: "insulin-resistance", title: "Resistencia a la Insulina", icon: Activity, color: "from-blue-500 to-indigo-600" },
      { slug: "gut-health", title: "Salud Intestinal", icon: Leaf, color: "from-green-500 to-emerald-600" },
      { slug: "sustainable-health", title: "Salud Sostenible", icon: Heart, color: "from-rose-500 to-pink-600" },
      { slug: "weight-loss", title: "Pérdida de Peso", icon: TrendingUp, color: "from-amber-500 to-orange-600" },
      { slug: "sleep-health", title: "Salud del Sueño", icon: Moon, color: "from-indigo-500 to-purple-600" },
      { slug: "womens-health", title: "Salud Femenina", icon: Shield, color: "from-pink-500 to-rose-600" },
      { slug: "metabolic-health", title: "Salud Metabólica", icon: Zap, color: "from-yellow-500 to-amber-600" },
    ],
    de: [
      { slug: "insulin-resistance", title: "Insulinresistenz", icon: Activity, color: "from-blue-500 to-indigo-600" },
      { slug: "gut-health", title: "Darmgesundheit", icon: Leaf, color: "from-green-500 to-emerald-600" },
      { slug: "sustainable-health", title: "Nachhaltige Gesundheit", icon: Heart, color: "from-rose-500 to-pink-600" },
      { slug: "weight-loss", title: "Gewichtsverlust", icon: TrendingUp, color: "from-amber-500 to-orange-600" },
      { slug: "sleep-health", title: "Schlafgesundheit", icon: Moon, color: "from-indigo-500 to-purple-600" },
      { slug: "womens-health", title: "Frauengesundheit", icon: Shield, color: "from-pink-500 to-rose-600" },
      { slug: "metabolic-health", title: "Stoffwechselgesundheit", icon: Zap, color: "from-yellow-500 to-amber-600" },
    ],
    tr: [
      { slug: "insulin-resistance", title: "İnsülin Direnci", icon: Activity, color: "from-blue-500 to-indigo-600" },
      { slug: "gut-health", title: "Bağırsak Sağlığı", icon: Leaf, color: "from-green-500 to-emerald-600" },
      { slug: "sustainable-health", title: "Sürdürülebilir Sağlık", icon: Heart, color: "from-rose-500 to-pink-600" },
      { slug: "weight-loss", title: "Kilo Kaybı", icon: TrendingUp, color: "from-amber-500 to-orange-600" },
      { slug: "sleep-health", title: "Uyku Sağlığı", icon: Moon, color: "from-indigo-500 to-purple-600" },
      { slug: "womens-health", title: "Kadın Sağlığı", icon: Shield, color: "from-pink-500 to-rose-600" },
      { slug: "metabolic-health", title: "Metabolik Sağlık", icon: Zap, color: "from-yellow-500 to-amber-600" },
    ],
  };
  const hubList = hubs[lang] || hubs.en;

  return (
    <section className="py-20 gradient-section">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-3">
            <Library className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-medium">7 {lang === 'ar' ? 'مراكز معرفية' : 'Knowledge Hubs'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{l.title}</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{l.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {hubList.map((hub) => (
            <a key={hub.slug} href={`/health-library/${hub.slug}`} className="group relative overflow-hidden rounded-2xl bg-white border border-border p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 text-center">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hub.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <hub.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">{hub.title}</h3>
            </a>
          ))}
          {/* Explore All Hub */}
          <a href="/health-library" className="group relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/20 p-5 hover:shadow-lg hover:bg-primary/10 transition-all duration-300 hover:-translate-y-1 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-primary">{l.cta}</h3>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SchemaMarkup />
      <Navbar />
      <SocialProofBar />
      <HeroSection />
      {/* Knowledge Platform Flow: Authority → Content → Research → Library → Problem → Solution → Partnership */}
      <TrustAuthoritySection />
      <LatestArticlesSection />
      <LatestResearchSection />
      <HealthLibraryPreview />
      <ProblemSection />
      <SustainableHealthSection />
      <TransformationSection />
      <SuccessStoriesSection />
      <TestimonialsSection />
      <HealthInvestorSection />
      <ProductsSection />
      <PriceDisplay />
      <PartnershipSection />
      <NewsletterSection />
      <RegistrationForm />
      <Footer />
      <ChatWidget />
      <WhatsAppFloat />
      <StickyCTA />
    </div>
  );
}
