import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Globe, Heart, Brain, Users, TrendingUp, Mic, BookOpen, Award,
  Target, Lightbulb, Handshake, GraduationCap, ArrowRight, ChevronDown, ChevronUp,
  Compass, Sparkles, Crown, Rocket, Library, MessageCircle
} from "lucide-react";

export default function FerasKnowledgeHub() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Live data from database
  const { data: articles } = trpc.blog.list.useQuery({ limit: 6, offset: 0 });
  const { data: research } = trpc.research.list.useQuery({ limit: 6, offset: 0 });

  // Comprehensive Person Knowledge Graph Schema - Strategic positioning
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://feelgreat.us.com/#feras-alayed",
    "name": "Feras Alayed",
    "alternateName": ["فراس العايد", "Feras Al-Ayed"],
    "jobTitle": "Global Health Educator, Therapeutic & Behavioral Nutrition Specialist, Leadership Mentor, Human Potential Coach",
    "description": "Global thinker, educator, and mentor dedicated to sustainable health, behavioral nutrition, leadership development, human potential, entrepreneurship, and financial empowerment. Helping people create meaningful transformation across all dimensions of life.",
    "url": "https://feelgreat.us.com/feras-alayed",
    "image": "https://feelgreat.us.com/manus-storage/feras-professional_115956a2.png",
    "sameAs": [
      "https://www.instagram.com/use2lose",
      "https://www.tiktok.com/@feras.alayed"
    ],
    "knowsAbout": [
      "Sustainable Health", "Behavioral Nutrition", "Therapeutic Nutrition",
      "Metabolic Health", "Leadership Development", "Human Potential",
      "Personal Growth", "Team Building", "Entrepreneurship",
      "Financial Empowerment", "Human Performance", "Burnout Prevention",
      "Success Mindset", "Life Transformation", "Insulin Resistance",
      "Gut Health", "Intermittent Fasting", "Healthy Aging",
      "Women's Health", "Sleep Optimization", "Behavioral Science"
    ],
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Therapeutic Nutrition Specialist" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Behavioral Nutrition Coach" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Health & Performance Strategist" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Leadership Development Mentor" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Human Potential Coach" }
    ],
    "worksFor": { "@type": "Organization", "name": "Feras Alayed - Knowledge Hub", "url": "https://feelgreat.us.com" },
    "mainEntityOfPage": "https://feelgreat.us.com/feras-alayed",
    "award": ["Presidential Sapphire - Unicity International"],
    "nationality": { "@type": "Country", "name": "Saudi Arabia" }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": isAr ? "فراس العايد - مركز المعرفة" : "Feras Alayed - Knowledge Hub",
    "description": isAr
      ? "مفكر ومدرب ومُثقف عالمي في الصحة المستدامة، التغذية السلوكية، القيادة، الإمكانات البشرية، ريادة الأعمال، والتمكين المالي"
      : "Global thinker, educator, and mentor in sustainable health, behavioral nutrition, leadership, human potential, entrepreneurship, and financial empowerment",
    "url": "https://feelgreat.us.com/feras-alayed",
    "mainEntity": { "@id": "https://feelgreat.us.com/#feras-alayed" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://feelgreat.us.com/" },
        { "@type": "ListItem", "position": 2, "name": "Feras Alayed Knowledge Hub", "item": "https://feelgreat.us.com/feras-alayed" }
      ]
    }
  };

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.qEn,
      "acceptedAnswer": { "@type": "Answer", "text": faq.aEn }
    }))
  };

  useEffect(() => {
    document.title = isAr
      ? "فراس العايد | مركز المعرفة - مفكر ومدرب ومُثقف عالمي في الصحة والنمو والتمكين الإنساني"
      : "Feras Alayed | Knowledge Hub - Global Thinker, Educator & Mentor in Health, Growth & Human Empowerment";
    // Inject JSON-LD
    const existing = document.querySelectorAll('script[data-feras-hub]');
    existing.forEach(el => el.remove());
    [personSchema, websiteSchema, faqSchema].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-feras-hub', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => { document.querySelectorAll('script[data-feras-hub]').forEach(el => el.remove()); };
  }, [isAr]);

  // ===== SECTION DATA =====

  const strategicHierarchy = [
    { en: "Sustainable Health", ar: "الصحة المستدامة", icon: Heart, color: "emerald" },
    { en: "Behavioral Nutrition", ar: "التغذية السلوكية", icon: Brain, color: "teal" },
    { en: "Leadership", ar: "القيادة", icon: Crown, color: "purple" },
    { en: "Human Potential", ar: "الإمكانات البشرية", icon: Sparkles, color: "blue" },
    { en: "Entrepreneurship", ar: "ريادة الأعمال", icon: Rocket, color: "orange" },
    { en: "Financial Empowerment", ar: "التمكين المالي", icon: TrendingUp, color: "amber" },
  ];

  const countries = [
    { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
    { en: "Oman", ar: "عُمان" },
    { en: "Kuwait", ar: "الكويت" },
    { en: "Bahrain", ar: "البحرين" },
    { en: "Qatar", ar: "قطر" },
    { en: "Jordan", ar: "الأردن" },
    { en: "Egypt", ar: "مصر" },
    { en: "Turkey", ar: "تركيا" },
    { en: "United States", ar: "الولايات المتحدة" },
    { en: "United Kingdom", ar: "المملكة المتحدة" },
    { en: "Germany", ar: "ألمانيا" },
    { en: "Netherlands", ar: "هولندا" },
    { en: "Sweden", ar: "السويد" },
    { en: "Malaysia", ar: "ماليزيا" },
  ];

  const speakingTopics = [
    { en: "Sustainable Health & Metabolic Optimization", ar: "الصحة المستدامة وتحسين الأيض" },
    { en: "Behavioral Nutrition & Habit Architecture", ar: "التغذية السلوكية وهندسة العادات" },
    { en: "Human Potential & Peak Performance", ar: "الإمكانات البشرية والأداء الأمثل" },
    { en: "Leadership & Team Development", ar: "القيادة وتطوير الفرق" },
    { en: "Burnout Prevention & Energy Management", ar: "الوقاية من الاحتراق وإدارة الطاقة" },
    { en: "Entrepreneurship & Financial Growth", ar: "ريادة الأعمال والنمو المالي" },
    { en: "Success Principles & Mindset", ar: "مبادئ النجاح والعقلية" },
    { en: "Community Building & Social Impact", ar: "بناء المجتمع والأثر الاجتماعي" },
    { en: "Women's Health & Hormonal Balance", ar: "صحة المرأة والتوازن الهرموني" },
  ];

  const healthLibraryHubs = [
    { slug: "sustainable-health", en: "Sustainable Health", ar: "الصحة المستدامة" },
    { slug: "insulin-resistance", en: "Insulin Resistance", ar: "مقاومة الأنسولين" },
    { slug: "gut-health", en: "Gut Health", ar: "صحة الأمعاء" },
    { slug: "weight-loss", en: "Weight Loss", ar: "إنقاص الوزن" },
    { slug: "sleep", en: "Sleep Optimization", ar: "تحسين النوم" },
    { slug: "womens-health", en: "Women's Health", ar: "صحة المرأة" },
    { slug: "metabolic-health", en: "Metabolic Health", ar: "الصحة الأيضية" },
  ];

  return (
    <div className={`min-h-screen bg-background ${isAr ? "rtl" : "ltr"}`}>

      {/* ===== HERO SECTION - Strategic Positioning ===== */}
      <header className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(59,130,246,0.2) 0%, transparent 50%)' }} />
        </div>

        <div className="container max-w-6xl relative z-10">
          <nav className="text-sm text-emerald-300/70 mb-8">
            <Link href="/" className="hover:text-white">{isAr ? "الرئيسية" : "Home"}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{isAr ? "مركز المعرفة" : "Knowledge Hub"}</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="shrink-0">
              <div className="relative">
                <img
                  src="/manus-storage/feras-professional_115956a2.png"
                  alt="Feras Alayed - Global Thinker, Educator & Mentor"
                  className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover object-top shadow-2xl ring-4 ring-emerald-400/30"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  15+ {isAr ? "دولة" : "Countries"}
                </div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-start">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                {isAr ? "فراس العايد" : "Feras Alayed"}
              </h1>
              <p className="text-xl text-emerald-300 font-medium mb-4">
                {isAr
                  ? "مفكر ومدرب ومُثقف عالمي في الصحة والنمو والتمكين الإنساني"
                  : "Global Thinker, Educator & Mentor in Health, Growth & Human Empowerment"}
              </p>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-6">
                {isAr
                  ? "مساعدة الناس على إطلاق إمكاناتهم البشرية الكاملة من خلال الصحة المستدامة، التغذية السلوكية، القيادة، وريادة الأعمال"
                  : "Helping people unlock their full human potential through sustainable health, behavioral nutrition, leadership, and entrepreneurship"}
              </p>

              {/* Strategic Hierarchy Visual */}
              <div className="flex flex-wrap gap-2 mb-6">
                {strategicHierarchy.map((item, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs border-emerald-400/40 text-emerald-200 bg-emerald-900/20">
                      {isAr ? item.ar : item.en}
                    </Badge>
                    {i < strategicHierarchy.length - 1 && <span className="text-emerald-400/60 text-xs">→</span>}
                  </span>
                ))}
              </div>

              <blockquote className="border-s-4 border-emerald-400 ps-4 text-slate-300 italic text-sm leading-relaxed">
                {isAr ? (
                  <>شخص أكثر صحة يبني عائلة أقوى.<br/>عائلة أقوى تبني مجتمعاً أقوى.<br/>مجتمع أقوى يبني عالماً أفضل.</>
                ) : (
                  <>A healthier person creates a stronger family.<br/>A stronger family creates a stronger community.<br/>A stronger community creates a better world.</>
                )}
              </blockquote>
            </div>
          </div>
        </div>
      </header>

      {/* ===== AUDIO INTRO ===== */}
      <section className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-b">
        <div className="container max-w-4xl py-6">
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-2 shrink-0">
              <Mic className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-foreground">
                {isAr ? "رسالة فراس" : lang === 'fr' ? "Message de Feras" : lang === 'es' ? "Mensaje de Feras" : lang === 'de' ? "Feras' Nachricht" : lang === 'tr' ? "Feras'ın Mesajı" : "Feras's Message"}
              </span>
            </div>
            <audio controls className="flex-1 h-10" preload="metadata" key={lang}>
              <source src={{
                ar: '/manus-storage/knowledge-hub-intro-ar_4929473b.wav',
                en: '/manus-storage/knowledge-hub-intro-en_a368a891.wav',
                fr: '/manus-storage/knowledge-hub-intro-fr_b6b09144.wav',
                es: '/manus-storage/knowledge-hub-intro-es_0d4506f9.wav',
                de: '/manus-storage/knowledge-hub-intro-de_5aeae630.wav',
                tr: '/manus-storage/knowledge-hub-intro-tr_2c6da963.wav',
              }[lang] || '/manus-storage/knowledge-hub-intro-en_a368a891.wav'} type="audio/wav" />
            </audio>
          </div>
        </div>
      </section>

      {/* ===== TABLE OF CONTENTS - Quick Navigation ===== */}
      <nav className="bg-muted/50 border-b sticky top-0 z-40 backdrop-blur-sm">
        <div className="container max-w-6xl py-3 overflow-x-auto">
          <div className="flex gap-4 text-xs font-medium whitespace-nowrap">
            {[
              { id: "mission", en: "Mission", ar: "الرسالة" },
              { id: "philosophy", en: "Philosophy", ar: "الفلسفة" },
              { id: "sustainable-health", en: "Health", ar: "الصحة" },
              { id: "behavioral-nutrition", en: "Nutrition", ar: "التغذية" },
              { id: "global-impact", en: "Impact", ar: "الأثر" },
              { id: "speaking", en: "Speaking", ar: "المحاضرات" },
              { id: "leadership", en: "Leadership", ar: "القيادة" },
              { id: "research", en: "Research", ar: "الأبحاث" },
              { id: "success-stories", en: "Stories", ar: "القصص" },
              { id: "articles", en: "Articles", ar: "المقالات" },
              { id: "entrepreneurship", en: "Business", ar: "الأعمال" },
              { id: "work-with-feras", en: "Work Together", ar: "تعاون" },
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
                {isAr ? item.ar : item.en}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="container max-w-6xl py-16 space-y-20">

        {/* ===== SECTION 1: MISSION & VISION ===== */}
        <section id="mission">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Compass className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold">{isAr ? "الرسالة والرؤية" : "Mission & Vision"}</h2>
            </div>
            <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <p className="text-xl font-semibold text-foreground">
                {isAr
                  ? "المهمة ليست مجرد تحسين الصحة. المهمة هي مساعدة الناس على إطلاق إمكاناتهم البشرية الكاملة."
                  : "The mission is not simply to improve health. The mission is to help people unlock their full human potential."}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {isAr
                  ? "من خلال دمج الصحة المستدامة، التغذية السلوكية، تطوير القيادة، والتمكين المالي — نبني جيلاً جديداً من القادة الأصحاء القادرين على إحداث تأثير حقيقي في العالم."
                  : "By integrating sustainable health, behavioral nutrition, leadership development, and financial empowerment — we build a new generation of healthy leaders capable of creating real impact in the world."}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {[
                  { en: "Health", ar: "الصحة" },
                  { en: "Growth", ar: "النمو" },
                  { en: "Leadership", ar: "القيادة" },
                  { en: "Purpose", ar: "الهدف" },
                  { en: "Prosperity", ar: "الازدهار" },
                  { en: "Impact", ar: "الأثر" },
                ].map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-sm px-4 py-2 bg-white dark:bg-slate-800 shadow-sm">
                    {isAr ? item.ar : item.en}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic pt-2">
                {isAr ? "هذه ليست رحلات منفصلة. إنها رحلة واحدة متكاملة." : "These are not separate journeys. They are one integrated journey."}
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2: HEALTH, LEADERSHIP & HUMAN POTENTIAL PHILOSOPHY ===== */}
        <section id="philosophy">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Lightbulb className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">{isAr ? "فلسفة الصحة والقيادة والإمكانات البشرية" : "Health, Leadership & Human Potential Philosophy"}</h2>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 lg:p-10 max-w-4xl mx-auto">
            <div className="space-y-6">
              <blockquote className="text-center space-y-3 text-muted-foreground">
                <p className="text-xl font-semibold text-foreground">
                  {isAr ? "النجاح الحقيقي لا يُقاس بالمال وحده." : "True success is not measured by money alone."}
                </p>
                <p>{isAr ? "النجاح الحقيقي هو القدرة على بناء الصحة دون التضحية بالثروة." : "True success is the ability to build health without sacrificing wealth."}</p>
                <p>{isAr ? "بناء الثروة دون التضحية بالقيم." : "To build wealth without sacrificing values."}</p>
                <p>{isAr ? "النمو شخصياً مع مساعدة الآخرين على النمو." : "To grow personally while helping others grow."}</p>
                <p className="text-xl font-semibold text-foreground pt-2">
                  {isAr ? "إنشاء حياة ناجحة، مستدامة، وذات معنى." : "To create a life that is successful, sustainable, and meaningful."}
                </p>
              </blockquote>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[
                  { en: "Health First", ar: "الصحة أولاً", desc_en: "Without health, nothing else matters. It is the foundation upon which everything is built.", desc_ar: "بدون الصحة، لا شيء آخر مهم. إنها الأساس الذي يُبنى عليه كل شيء." },
                  { en: "Lead Yourself", ar: "قُد نفسك", desc_en: "Before you can lead others, you must master self-leadership through discipline, awareness, and purpose.", desc_ar: "قبل أن تقود الآخرين، يجب أن تتقن قيادة الذات من خلال الانضباط والوعي والهدف." },
                  { en: "Empower Others", ar: "مكّن الآخرين", desc_en: "The ultimate measure of success is how many lives you've helped transform.", desc_ar: "المقياس الحقيقي للنجاح هو عدد الحيوات التي ساعدت في تحويلها." },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4">
                    <h4 className="font-bold mb-2 text-foreground">{isAr ? item.ar : item.en}</h4>
                    <p className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 3: SUSTAINABLE HEALTH FRAMEWORK ===== */}
        <section id="sustainable-health">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold">{isAr ? "إطار الصحة المستدامة" : "Sustainable Health Framework"}</h2>
          </div>
          <p className="text-muted-foreground mb-8 max-w-3xl">
            {isAr
              ? "نهج شامل ومتكامل يجمع بين التغذية العلاجية، العلوم السلوكية، وتحسين الصحة الأيضية لإحداث تحولات دائمة في نمط الحياة. ليس حمية مؤقتة، بل نظام حياة مستدام."
              : "A comprehensive, integrated approach combining therapeutic nutrition, behavioral science, and metabolic health optimization for lasting lifestyle transformations. Not a temporary diet, but a sustainable life system."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { en: "Metabolic Health", ar: "الصحة الأيضية", icon: "⚡", desc_en: "Optimizing insulin sensitivity and cellular energy", desc_ar: "تحسين حساسية الأنسولين وطاقة الخلايا" },
              { en: "Gut Microbiome", ar: "الميكروبيوم", icon: "🦠", desc_en: "Restoring gut health for whole-body wellness", desc_ar: "استعادة صحة الأمعاء لعافية الجسم كله" },
              { en: "Intermittent Fasting", ar: "الصيام المتقطع", icon: "⏰", desc_en: "Strategic fasting for metabolic reset", desc_ar: "صيام استراتيجي لإعادة ضبط الأيض" },
              { en: "Sleep Optimization", ar: "تحسين النوم", icon: "😴", desc_en: "Quality sleep as a health multiplier", desc_ar: "النوم الجيد كمضاعف للصحة" },
              { en: "Stress Management", ar: "إدارة التوتر", icon: "🧘", desc_en: "Cortisol regulation and mental resilience", desc_ar: "تنظيم الكورتيزول والمرونة الذهنية" },
              { en: "Movement & Energy", ar: "الحركة والطاقة", icon: "🏃", desc_en: "Sustainable movement patterns for vitality", desc_ar: "أنماط حركة مستدامة للحيوية" },
            ].map((item, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-sm font-bold mb-1">{isAr ? item.ar : item.en}</p>
                  <p className="text-xs text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/health-library/sustainable-health">
              <Button variant="outline" className="gap-2">
                {isAr ? "استكشف مركز الصحة المستدامة" : "Explore Sustainable Health Hub"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ===== SECTION 4: BEHAVIORAL NUTRITION FRAMEWORK ===== */}
        <section id="behavioral-nutrition">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-teal-600" />
            <h2 className="text-3xl font-bold">{isAr ? "إطار التغذية السلوكية" : "Behavioral Nutrition Framework"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "تغيير العادات الغذائية ليس مجرد معرفة ماذا نأكل، بل فهم لماذا نأكل وكيف نبني سلوكيات صحية مستدامة. هذا هو ما يميز التغذية السلوكية عن الأنظمة الغذائية التقليدية."
              : "Changing eating habits isn't just about knowing what to eat, but understanding why we eat and how to build sustainable healthy behaviors. This is what distinguishes behavioral nutrition from traditional diets."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { en: "Root Cause Analysis", ar: "تحليل الأسباب الجذرية", desc_en: "Identifying the behavioral, emotional, and environmental triggers behind unhealthy eating patterns", desc_ar: "تحديد المحفزات السلوكية والعاطفية والبيئية وراء أنماط الأكل غير الصحية" },
              { en: "Habit Architecture", ar: "هندسة العادات", desc_en: "Building sustainable nutrition habits through behavioral science principles and environmental design", desc_ar: "بناء عادات تغذية مستدامة من خلال مبادئ العلوم السلوكية وتصميم البيئة" },
              { en: "Mindful Nutrition", ar: "التغذية الواعية", desc_en: "Developing deep awareness of hunger, satiety, emotional eating, and food relationship", desc_ar: "تطوير الوعي العميق بالجوع والشبع والأكل العاطفي والعلاقة مع الطعام" },
              { en: "Metabolic Optimization", ar: "التحسين الأيضي", desc_en: "Using evidence-based protocols to improve insulin sensitivity, gut health, and metabolic function", desc_ar: "استخدام بروتوكولات مبنية على الأدلة لتحسين حساسية الأنسولين وصحة الأمعاء والوظيفة الأيضية" },
            ].map((item, i) => (
              <Card key={i} className="border-teal-200 dark:border-teal-800/40">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2 text-teal-700 dark:text-teal-400">{isAr ? item.ar : item.en}</h4>
                  <p className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 5: GLOBAL IMPACT & COUNTRIES SERVED ===== */}
        <section id="global-impact">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold">{isAr ? "الأثر العالمي والدول" : "Global Impact & Countries Served"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "من خلال المحاضرات، ورش العمل، برامج التدريب، مبادرات تطوير القيادة، ومشاريع التثقيف الصحي — عمل فراس مع أفراد وفرق عبر دول وثقافات متعددة، مُحدثاً أثراً ملموساً في حياة الآلاف."
              : "Through speaking engagements, workshops, coaching programs, leadership development initiatives, and health education projects — Feras has worked with individuals and teams across multiple countries and cultures, creating tangible impact in thousands of lives."}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {countries.map((country, i) => (
              <Badge key={i} variant="outline" className="text-sm px-3 py-1.5">
                {isAr ? country.ar : country.en}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "15+", en: "Countries", ar: "دولة" },
              { value: "500+", en: "Partners", ar: "شريك" },
              { value: "1000+", en: "Transformations", ar: "تحول" },
              { value: "5+", en: "Years of Impact", ar: "سنوات من الأثر" },
            ].map((stat, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{isAr ? stat.ar : stat.en}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== SECTION 6: SPEAKING & WORKSHOPS ===== */}
        <section id="speaking">
          <div className="flex items-center gap-3 mb-6">
            <Mic className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">{isAr ? "المحاضرات وورش العمل" : "Speaking & Workshops"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "يقدم فراس محاضرات وورش عمل متخصصة في الصحة المستدامة، التغذية السلوكية، القيادة، والإمكانات البشرية — للمؤسسات، الشركات، المجتمعات، والأفراد."
              : "Feras delivers specialized lectures and workshops on sustainable health, behavioral nutrition, leadership, and human potential — for organizations, corporations, communities, and individuals."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {speakingTopics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="text-sm font-medium">{isAr ? topic.ar : topic.en}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
              <img src="/manus-storage/feras-speaking_97c75a22.jpg" alt="Feras Speaking" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
              <img src="/manus-storage/feras-training_3e46aa5d.jpg" alt="Feras Training" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="rounded-xl overflow-hidden shadow-md aspect-[4/3]">
              <img src="/manus-storage/feras-library_9789048d.jpg" alt="Feras Research" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 7: LEADERSHIP DEVELOPMENT PROGRAMS ===== */}
        <section id="leadership">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold">{isAr ? "برامج تطوير القيادة" : "Leadership Development Programs"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "تمكين الأفراد والفرق من القيادة بهدف، بناء التأثير، إلهام الآخرين، وإحداث أثر حقيقي في مجتمعاتهم. القيادة تبدأ بقيادة الذات — والذات تبدأ بالصحة."
              : "Empowering individuals and teams to lead with purpose, build influence, inspire others, and create meaningful impact. Leadership starts with self-leadership — and self-leadership starts with health."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { en: "Purpose-Driven Leadership", ar: "القيادة الهادفة", desc_en: "Leading with clarity, vision, authentic purpose, and unwavering values", desc_ar: "القيادة بوضوح ورؤية وهدف أصيل وقيم راسخة" },
              { en: "Team Building & Influence", ar: "بناء الفرق والتأثير", desc_en: "Building high-performing teams through trust, empowerment, and shared vision", desc_ar: "بناء فرق عالية الأداء من خلال الثقة والتمكين والرؤية المشتركة" },
              { en: "Self-Leadership Mastery", ar: "إتقان قيادة الذات", desc_en: "Mastering discipline, energy management, and personal excellence", desc_ar: "إتقان الانضباط وإدارة الطاقة والتميز الشخصي" },
            ].map((item, i) => (
              <Card key={i} className="border-purple-200 dark:border-purple-800/40">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2 text-purple-700 dark:text-purple-400">{isAr ? item.ar : item.en}</h4>
                  <p className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== SECTION 8: RESEARCH COMMENTARY CENTER ===== */}
        <section id="research">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-teal-600" />
            <h2 className="text-3xl font-bold">{isAr ? "مركز التعليقات البحثية" : "Research Commentary Center"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "تحليل وتبسيط أحدث الأبحاث العلمية في الصحة الأيضية، التغذية، والسلوك البشري — لمساعدة الناس على اتخاذ قرارات مبنية على العلم."
              : "Analyzing and simplifying the latest scientific research in metabolic health, nutrition, and human behavior — helping people make science-based decisions."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {research?.studies?.slice(0, 6).map((study: any) => (
              <Link key={study.slug} href={`/research/${study.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{study.journal}</Badge>
                      <Badge variant={study.evidenceLevel === "high" ? "default" : "secondary"} className="text-xs">
                        {study.evidenceLevel}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                      {isAr ? study.titleAr : study.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {isAr ? study.summary30sAr : study.summary30sEn}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/research">
              <Button variant="outline" className="gap-2">
                {isAr ? "عرض جميع الأبحاث" : "View All Research"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 9: SUCCESS STORIES HUB ===== */}
        <section id="success-stories">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold">{isAr ? "مركز قصص النجاح" : "Success Stories Hub"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "قصص ملهمة من أشخاص حقيقيين حوّلوا صحتهم، ثقتهم، قدراتهم القيادية، مستقبلهم المالي، وجودة حياتهم — من خلال العمل مع فراس وتطبيق مبادئ الصحة المستدامة."
              : "Inspiring stories from real people who transformed their health, confidence, leadership abilities, financial future, and quality of life — through working with Feras and applying sustainable health principles."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { en: "Health Transformations", ar: "تحولات صحية", count: "200+" },
              { en: "Weight Loss Success", ar: "نجاح إنقاص الوزن", count: "150+" },
              { en: "Leadership Growth", ar: "نمو قيادي", count: "100+" },
              { en: "Financial Freedom", ar: "حرية مالية", count: "80+" },
            ].map((cat, i) => (
              <Card key={i} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-amber-600 mb-1">{cat.count}</div>
                  <p className="text-sm font-medium">{isAr ? cat.ar : cat.en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/success-stories">
              <Button variant="outline" className="gap-2">
                {isAr ? "استكشف قصص النجاح" : "Explore Success Stories"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ===== SECTION 10: MEDIA & INTERVIEWS ===== */}
        <section id="media">
          <h2 className="text-3xl font-bold mb-6">{isAr ? "الإعلام والمقابلات" : "Media & Interviews"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3">{isAr ? "المنصات" : "Platforms"}</h3>
                <div className="space-y-2">
                  {[
                    { en: "Instagram @use2lose - Health & Lifestyle Education", ar: "انستغرام @use2lose - التثقيف الصحي ونمط الحياة", link: "https://www.instagram.com/use2lose" },
                    { en: "TikTok @feras.alayed - Health Tips & Insights", ar: "تيك توك @feras.alayed - نصائح ورؤى صحية", link: "https://www.tiktok.com/@feras.alayed" },
                  ].map((platform, i) => (
                    <a key={i} href={platform.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm">{isAr ? platform.ar : platform.en}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3">{isAr ? "مجالات المحتوى" : "Content Areas"}</h3>
                <div className="space-y-2">
                  {[
                    { en: "Health Education & Scientific Awareness", ar: "التثقيف الصحي والتوعية العلمية" },
                    { en: "Research Summaries & Commentary", ar: "ملخصات وتعليقات بحثية" },
                    { en: "Leadership & Human Development Insights", ar: "رؤى قيادية وتنمية بشرية" },
                    { en: "Success Stories & Transformations", ar: "قصص نجاح وتحولات" },
                    { en: "Behavioral Nutrition & Lifestyle Tips", ar: "نصائح التغذية السلوكية ونمط الحياة" },
                  ].map((area, i) => (
                    <div key={i} className="flex items-center gap-2 p-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm">{isAr ? area.ar : area.en}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 11: FEATURED ARTICLES ===== */}
        <section id="articles">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">{isAr ? "أحدث المقالات" : "Featured Articles"}</h2>
            <Link href="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">
              {isAr ? "عرض الكل" : "View All"} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles?.articles?.slice(0, 6).map((article: any) => (
              <Link key={article.slug} href={`/blog/${article.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <Badge variant="outline" className="mb-2 text-xs">{article.category}</Badge>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-2">
                      {isAr ? article.titleAr : article.titleEn}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {isAr ? article.excerptAr : article.excerptEn}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <img src="/manus-storage/feras-author-photo_7c3e9a1b.jpg" alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span>{isAr ? "فراس العايد" : "Feras Alayed"}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== SECTION 12: LATEST SCIENTIFIC RESEARCH ===== */}
        <section id="latest-research">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">{isAr ? "أحدث الأبحاث العلمية" : "Latest Scientific Research"}</h2>
            <Link href="/research" className="text-sm text-primary hover:underline flex items-center gap-1">
              {isAr ? "عرض الكل" : "View All"} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {research?.studies?.slice(0, 4).map((study: any) => (
              <Link key={study.slug} href={`/research/${study.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{study.topic}</Badge>
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2">{isAr ? study.titleAr : study.titleEn}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{study.journal} | {study.year}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 13: HEALTH LIBRARY ACCESS ===== */}
        <section id="health-library">
          <div className="flex items-center gap-3 mb-6">
            <Library className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold">{isAr ? "المكتبة الصحية" : "Health Library Access"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "مكتبة شاملة من المحتوى الصحي المبني على الأدلة العلمية، منظمة في مراكز معرفية متخصصة — كل مركز يغطي موضوعاً صحياً بعمق."
              : "A comprehensive library of evidence-based health content, organized into specialized knowledge hubs — each covering a health topic in depth."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {healthLibraryHubs.map((hub, i) => (
              <Link key={i} href={`/health-library/${hub.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full text-center">
                  <CardContent className="p-4">
                    <p className="font-medium text-sm">{isAr ? hub.ar : hub.en}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/health-library">
              <Button variant="outline" className="gap-2">
                {isAr ? "استكشف المكتبة الصحية" : "Explore Health Library"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* ===== SECTION 14: ENTREPRENEURSHIP & FINANCIAL EMPOWERMENT ===== */}
        <section id="entrepreneurship">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold">{isAr ? "ريادة الأعمال والتمكين المالي" : "Entrepreneurship & Financial Empowerment"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "مساعدة الناس على اكتشاف الفرص، تطوير التفكير الريادي، إنشاء مصادر دخل إضافية، وبناء حرية ومرونة أكبر في الحياة — من خلال ريادة الأعمال الصحية والتمكين المالي المستدام."
              : "Helping people discover opportunities, develop entrepreneurial thinking, create additional income streams, and build greater freedom — through health entrepreneurship and sustainable financial empowerment."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { en: "Health Entrepreneurship", ar: "ريادة الأعمال الصحية", desc_en: "Building a purpose-driven health business that creates real value", desc_ar: "بناء عمل صحي هادف يخلق قيمة حقيقية" },
              { en: "Income Diversification", ar: "تنويع الدخل", desc_en: "Creating multiple sustainable income streams alongside your career", desc_ar: "إنشاء مصادر دخل متعددة ومستدامة بجانب عملك" },
              { en: "Financial Freedom", ar: "الحرية المالية", desc_en: "Building long-term financial independence through smart entrepreneurship", desc_ar: "بناء استقلال مالي طويل المدى من خلال ريادة أعمال ذكية" },
            ].map((item, i) => (
              <Card key={i} className="border-orange-200 dark:border-orange-800/40">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2 text-orange-700 dark:text-orange-400">{isAr ? item.ar : item.en}</h4>
                  <p className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/partner-with-feras">
              <Button variant="outline" className="gap-2">
                {isAr ? "اكتشف فرصة الشراكة" : "Discover Partnership Opportunity"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 15: STRATEGIC PARTNERSHIPS ===== */}
        <section id="partnerships">
          <div className="flex items-center gap-3 mb-6">
            <Handshake className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold">{isAr ? "الشراكات الاستراتيجية" : "Strategic Partnerships"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "يتعاون فراس بنشاط مع المنظمات، القادة، رواد الأعمال، المعلمين، وصناع التغيير الذين يشاركونه رؤية إنشاء مجتمعات أكثر صحة وقوة وتمكيناً."
              : "Feras actively collaborates with organizations, leaders, entrepreneurs, educators, and change-makers who share a vision of creating healthier, stronger, and more empowered communities."}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { en: "Health Organizations", ar: "المنظمات الصحية" },
              { en: "Educational Institutions", ar: "المؤسسات التعليمية" },
              { en: "Corporate Wellness", ar: "صحة الشركات" },
              { en: "Community Leaders", ar: "قادة المجتمع" },
              { en: "Research Institutions", ar: "مؤسسات البحث" },
              { en: "Health Entrepreneurs", ar: "رواد الأعمال الصحيين" },
            ].map((partner, i) => (
              <Badge key={i} variant="secondary" className="text-sm px-4 py-2">
                {isAr ? partner.ar : partner.en}
              </Badge>
            ))}
          </div>
        </section>

        {/* ===== SECTION 16: MASTERMIND & LEADERSHIP PROJECTS ===== */}
        <section id="mastermind">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-violet-600" />
            <h2 className="text-3xl font-bold">{isAr ? "مشاريع العقل المدبر والقيادة" : "Mastermind & Leadership Projects"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "بيئات نمو تعاونية مصممة للقادة الطموحين الذين يريدون تسريع نموهم الشخصي والمهني من خلال التعلم الجماعي والمساءلة المتبادلة."
              : "Collaborative growth environments designed for ambitious leaders who want to accelerate their personal and professional growth through collective learning and mutual accountability."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { en: "Health Leaders Mastermind", ar: "عقل مدبر للقادة الصحيين", desc_en: "A community of health-focused leaders sharing strategies, insights, and accountability for growth", desc_ar: "مجتمع من القادة المهتمين بالصحة يتشاركون الاستراتيجيات والرؤى والمساءلة من أجل النمو" },
              { en: "Entrepreneurship Circle", ar: "حلقة ريادة الأعمال", desc_en: "Collaborative sessions for entrepreneurs building purpose-driven health businesses", desc_ar: "جلسات تعاونية لرواد الأعمال الذين يبنون أعمالاً صحية هادفة" },
              { en: "Leadership Accelerator", ar: "مسرّع القيادة", desc_en: "Intensive programs for emerging leaders ready to create meaningful impact", desc_ar: "برامج مكثفة للقادة الناشئين المستعدين لإحداث أثر حقيقي" },
              { en: "Personal Growth Lab", ar: "مختبر النمو الشخصي", desc_en: "Experimental space for developing new habits, mindsets, and life systems", desc_ar: "مساحة تجريبية لتطوير عادات وعقليات وأنظمة حياة جديدة" },
            ].map((item, i) => (
              <Card key={i} className="border-violet-200 dark:border-violet-800/40">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2 text-violet-700 dark:text-violet-400">{isAr ? item.ar : item.en}</h4>
                  <p className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 17: HUMAN DEVELOPMENT RESOURCES ===== */}
        <section id="resources">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-8 h-8 text-cyan-600" />
            <h2 className="text-3xl font-bold">{isAr ? "موارد التنمية البشرية" : "Human Development Resources"}</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-3xl">
            {isAr
              ? "أدوات وموارد مجانية مصممة لمساعدتك على بدء رحلة التحول — من التقييمات الصحية إلى برامج الـ 90 يوم إلى المكتبة العلمية."
              : "Free tools and resources designed to help you start your transformation journey — from health assessments to 90-day programs to the scientific library."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { en: "Health Assessments", ar: "التقييمات الصحية", desc_en: "Free tools to evaluate your metabolic health, insulin sensitivity, and wellness score", desc_ar: "أدوات مجانية لتقييم صحتك الأيضية وحساسية الأنسولين ومستوى العافية", link: "/health-assessment" },
              { en: "90-Day Transformation Journey", ar: "رحلة التحول في 90 يوم", desc_en: "A structured transformation program with weekly focus areas and milestones", desc_ar: "برنامج تحول منظم مع مجالات تركيز أسبوعية ومعالم", link: "/90-day-journey" },
              { en: "Health Library", ar: "المكتبة الصحية", desc_en: "Evidence-based articles and research summaries across 7 health domains", desc_ar: "مقالات وملخصات أبحاث مبنية على الأدلة عبر 7 مجالات صحية", link: "/health-library" },
              { en: "Today In Health Science", ar: "اليوم في علوم الصحة", desc_en: "Daily curated health science updates and discoveries", desc_ar: "تحديثات واكتشافات علوم الصحة اليومية المنسقة", link: "/today-in-health-science" },
            ].map((resource, i) => (
              <Link key={i} href={resource.link}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <h4 className="font-bold mb-2">{isAr ? resource.ar : resource.en}</h4>
                    <p className="text-sm text-muted-foreground">{isAr ? resource.desc_ar : resource.desc_en}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== SECTION 18: CORE PRINCIPLES & BELIEFS ===== */}
        <section id="principles">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-yellow-600" />
            <h2 className="text-3xl font-bold">{isAr ? "المبادئ والمعتقدات الأساسية" : "Core Principles & Beliefs"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { en: "Health is the foundation of all success — without it, nothing else matters", ar: "الصحة هي أساس كل نجاح — بدونها، لا شيء آخر مهم" },
              { en: "Every person deserves a better, healthier, more meaningful life", ar: "كل شخص يستحق حياة أفضل وأكثر صحة ومعنى" },
              { en: "Science guides the path, but behavior creates the transformation", ar: "العلم يرشد الطريق، لكن السلوك يصنع التحول" },
              { en: "Leadership starts with self-leadership, and self-leadership starts with health", ar: "القيادة تبدأ بقيادة الذات، وقيادة الذات تبدأ بالصحة" },
              { en: "Growth is a daily practice, not a destination to arrive at", ar: "النمو ممارسة يومية، وليس وجهة نصل إليها" },
              { en: "Community amplifies individual transformation — we grow together", ar: "المجتمع يضاعف التحول الفردي — ننمو معاً" },
              { en: "Financial empowerment is a natural result of creating real value", ar: "التمكين المالي نتيجة طبيعية لخلق قيمة حقيقية" },
              { en: "The world needs healthy leaders, not just successful ones", ar: "العالم يحتاج قادة أصحاء، وليس فقط ناجحين" },
            ].map((principle, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-900/40">
                <div className="w-8 h-8 rounded-full bg-yellow-200 dark:bg-yellow-900 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="font-medium text-sm">{isAr ? principle.ar : principle.en}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 19: FREQUENTLY ASKED QUESTIONS ===== */}
        <section id="faq">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-8 h-8 text-slate-600" />
            <h2 className="text-3xl font-bold">{isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between text-start hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span className="font-medium text-sm pe-4">{isAr ? faq.qAr : faq.qEn}</span>
                  {expandedFaq === i ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {expandedFaq === i && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">{isAr ? faq.aAr : faq.aEn}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== SECTION 20: WORK WITH FERAS ===== */}
        <section id="work-with-feras" className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 lg:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{isAr ? "العمل مع فراس" : "Work With Feras"}</h2>
            <p className="text-muted-foreground mb-8">
              {isAr
                ? "سواء كنت تبحث عن تحسين صحتك، تطوير قيادتك، بناء مصدر دخل إضافي، أو إحداث تأثير أكبر في حياتك — فراس يقدم مسارات متعددة للتعاون والنمو المشترك."
                : "Whether you're looking to improve your health, develop your leadership, build an additional income stream, or create greater impact — Feras offers multiple paths for collaboration and mutual growth."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link href="/health-assessment">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🩺</div>
                    <h4 className="font-bold text-sm mb-1">{isAr ? "استشارة صحية" : "Health Consultation"}</h4>
                    <p className="text-xs text-muted-foreground">{isAr ? "تقييم مجاني لصحتك الأيضية" : "Free metabolic health assessment"}</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/partner-with-feras">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🤝</div>
                    <h4 className="font-bold text-sm mb-1">{isAr ? "شراكة صحية" : "Health Partnership"}</h4>
                    <p className="text-xs text-muted-foreground">{isAr ? "ابنِ عملك الصحي الهادف" : "Build your purpose-driven health business"}</p>
                  </CardContent>
                </Card>
              </Link>
              <a href="https://wa.me/96877020770?text=أرغب بالتواصل مع فراس" target="_blank" rel="noopener noreferrer">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-bold text-sm mb-1">{isAr ? "تواصل مباشر" : "Direct Contact"}</h4>
                    <p className="text-xs text-muted-foreground">{isAr ? "واتساب للاستفسارات" : "WhatsApp for inquiries"}</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>
        </section>

        {/* ===== ENTITY CONNECTIONS FOOTER - Central Hub Links ===== */}
        <section className="text-center text-sm text-muted-foreground space-y-4 pt-8">
          <p className="font-semibold text-foreground text-base">{isAr ? "فراس العايد - مركز المعرفة" : "Feras Alayed - Knowledge Hub"}</p>
          <p>{isAr ? "مفكر ومدرب ومُثقف عالمي في الصحة المستدامة، التغذية السلوكية، القيادة، الإمكانات البشرية، ريادة الأعمال، والتمكين المالي" : "Global thinker, educator & mentor in sustainable health, behavioral nutrition, leadership, human potential, entrepreneurship & financial empowerment"}</p>
          
          {/* Strategic Hierarchy Reminder */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {strategicHierarchy.map((item, i) => (
              <span key={i} className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">{isAr ? item.ar : item.en}</span>
                {i < strategicHierarchy.length - 1 && <span className="text-muted-foreground/50">→</span>}
              </span>
            ))}
          </div>

          {/* Central Hub Navigation */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/blog" className="hover:text-primary transition-colors">{isAr ? "المدونة" : "Blog"}</Link>
            <Link href="/research" className="hover:text-primary transition-colors">{isAr ? "الأبحاث" : "Research"}</Link>
            <Link href="/health-library" className="hover:text-primary transition-colors">{isAr ? "المكتبة الصحية" : "Health Library"}</Link>
            <Link href="/success-stories" className="hover:text-primary transition-colors">{isAr ? "قصص النجاح" : "Success Stories"}</Link>
            <Link href="/health-assessment" className="hover:text-primary transition-colors">{isAr ? "التقييم الصحي" : "Health Assessment"}</Link>
            <Link href="/partner-with-feras" className="hover:text-primary transition-colors">{isAr ? "الشراكة" : "Partnership"}</Link>
            <Link href="/today-in-health-science" className="hover:text-primary transition-colors">{isAr ? "علوم الصحة" : "Health Science"}</Link>
            <Link href="/topics" className="hover:text-primary transition-colors">{isAr ? "المواضيع" : "Topics"}</Link>
          </div>
        </section>

      </main>
    </div>
  );
}

// FAQ Data - extracted for schema usage
const faqs = [
  {
    qEn: "What is Feras Alayed's approach to sustainable health?",
    qAr: "ما هو نهج فراس العايد في الصحة المستدامة؟",
    aEn: "Feras combines therapeutic nutrition, behavioral science, and metabolic health optimization to create lasting lifestyle transformations. His approach focuses on root causes rather than symptoms, using evidence-based protocols that address insulin resistance, gut health, and metabolic function.",
    aAr: "يجمع فراس بين التغذية العلاجية، العلوم السلوكية، وتحسين الصحة الأيضية لإحداث تحولات مستدامة في نمط الحياة. يركز نهجه على الأسباب الجذرية بدلاً من الأعراض، باستخدام بروتوكولات مبنية على الأدلة."
  },
  {
    qEn: "How does Feras integrate leadership with health?",
    qAr: "كيف يدمج فراس القيادة مع الصحة؟",
    aEn: "Feras believes that true leadership starts with self-leadership, which begins with health. A healthy leader has more energy, clarity, and resilience to inspire teams and create impact. His programs combine health optimization with leadership development for holistic transformation.",
    aAr: "يؤمن فراس بأن القيادة الحقيقية تبدأ بقيادة الذات، والتي تبدأ بالصحة. القائد الصحي يمتلك طاقة ووضوح ومرونة أكبر لإلهام الفرق وإحداث الأثر. برامجه تجمع بين تحسين الصحة وتطوير القيادة."
  },
  {
    qEn: "What is behavioral nutrition and how is it different from traditional diets?",
    qAr: "ما هي التغذية السلوكية وكيف تختلف عن الأنظمة الغذائية التقليدية؟",
    aEn: "Behavioral nutrition focuses on understanding WHY we eat (emotional triggers, habits, environment) rather than just WHAT to eat. It uses behavioral science principles to create lasting change, unlike traditional diets that rely on willpower and restriction. This approach addresses the root cause of unhealthy eating patterns.",
    aAr: "التغذية السلوكية تركز على فهم لماذا نأكل (المحفزات العاطفية، العادات، البيئة) بدلاً من مجرد ماذا نأكل. تستخدم مبادئ العلوم السلوكية لإحداث تغيير دائم، على عكس الأنظمة التقليدية التي تعتمد على قوة الإرادة والحرمان."
  },
  {
    qEn: "What countries does Feras work in?",
    qAr: "في أي دول يعمل فراس؟",
    aEn: "Feras has worked with individuals and teams across 15+ countries including Saudi Arabia, UAE, Oman, Kuwait, Jordan, Turkey, USA, UK, Germany, Netherlands, Sweden, and Malaysia through speaking engagements, workshops, coaching programs, and health education projects.",
    aAr: "عمل فراس مع أفراد وفرق في أكثر من 15 دولة تشمل السعودية، الإمارات، عُمان، الكويت، الأردن، تركيا، أمريكا، بريطانيا، ألمانيا، هولندا، السويد، وماليزيا من خلال المحاضرات وورش العمل وبرامج التدريب."
  },
  {
    qEn: "What is the relationship between Feras Alayed and Feel Great?",
    qAr: "ما هي العلاقة بين فراس العايد وبرنامج Feel Great؟",
    aEn: "Feel Great is one of several evidence-based tools that Feras uses within his broader sustainable health framework. It's a science-based metabolic health program combining intermittent fasting with clinically-studied supplements. Feras's work extends far beyond any single program — encompassing behavioral nutrition, leadership development, human potential, and financial empowerment.",
    aAr: "Feel Great هو إحدى الأدوات المبنية على الأدلة التي يستخدمها فراس ضمن إطاره الأوسع للصحة المستدامة. إنه برنامج صحة أيضية مبني على العلم. عمل فراس يمتد أبعد بكثير من أي برنامج واحد — ليشمل التغذية السلوكية، تطوير القيادة، الإمكانات البشرية، والتمكين المالي."
  },
  {
    qEn: "How can I work with Feras?",
    qAr: "كيف يمكنني العمل مع فراس؟",
    aEn: "You can work with Feras through health consultations, leadership coaching, partnership programs, mastermind groups, or attending his workshops and speaking events. Visit the 'Work With Feras' section or contact him via WhatsApp for personalized guidance on which path is right for you.",
    aAr: "يمكنك العمل مع فراس من خلال الاستشارات الصحية، التدريب القيادي، برامج الشراكة، مجموعات العقل المدبر، أو حضور ورشه ومحاضراته. زر قسم 'العمل مع فراس' أو تواصل عبر واتساب للحصول على توجيه شخصي."
  },
  {
    qEn: "What makes Feras's approach unique?",
    qAr: "ما الذي يجعل نهج فراس فريداً؟",
    aEn: "Feras's uniqueness lies in his integrated approach: he doesn't separate health from leadership, or personal growth from financial empowerment. He sees them as one interconnected system. His strategic hierarchy — Health → Nutrition → Leadership → Human Potential → Entrepreneurship → Financial Empowerment — creates holistic transformation rather than isolated improvements.",
    aAr: "تفرد فراس يكمن في نهجه المتكامل: لا يفصل الصحة عن القيادة، أو النمو الشخصي عن التمكين المالي. يراها كنظام واحد مترابط. تسلسله الاستراتيجي — الصحة ← التغذية ← القيادة ← الإمكانات البشرية ← ريادة الأعمال ← التمكين المالي — يخلق تحولاً شاملاً وليس تحسينات منعزلة."
  },
];
