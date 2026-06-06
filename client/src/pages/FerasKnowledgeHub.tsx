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
  Target, Lightbulb, Handshake, GraduationCap, ArrowRight, ChevronDown, ChevronUp
} from "lucide-react";

export default function FerasKnowledgeHub() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Live data from database
  const { data: articles } = trpc.blog.list.useQuery({ limit: 6, offset: 0 });
  const { data: research } = trpc.research.list.useQuery({ limit: 6, offset: 0 });

  // Comprehensive Person Knowledge Graph Schema
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://feelgreat.us.com/#feras-alayed",
    "name": "Feras Alayed",
    "alternateName": ["فراس العايد", "Feras Al-Ayed"],
    "jobTitle": "Global Health Educator, Therapeutic & Behavioral Nutrition Specialist, Leadership Mentor",
    "description": "Global educator, speaker, entrepreneur, therapeutic and behavioral nutrition specialist, and leadership mentor dedicated to helping people create meaningful transformation in health, mindset, leadership, and financial future.",
    "url": "https://feelgreat.us.com/feras-alayed",
    "image": "https://feelgreat.us.com/manus-storage/feras-professional_115956a2.png",
    "sameAs": [
      "https://www.instagram.com/use2lose",
      "https://www.tiktok.com/@feras.alayed"
    ],
    "knowsAbout": [
      "Sustainable Health", "Behavioral Nutrition", "Metabolic Health",
      "Leadership Development", "Personal Growth", "Team Building",
      "Entrepreneurship", "Financial Empowerment", "Human Performance",
      "Burnout Prevention", "Success Mindset", "Life Transformation",
      "Insulin Resistance", "Gut Health", "Intermittent Fasting",
      "Healthy Aging", "Women's Health", "Sleep Optimization"
    ],
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Therapeutic Nutrition Specialist" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Behavioral Nutrition Coach" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Health & Performance Strategist" },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Professional Certification", "name": "Leadership Development Mentor" }
    ],
    "worksFor": { "@type": "Organization", "name": "Feel Great", "url": "https://feelgreat.us.com" },
    "mainEntityOfPage": "https://feelgreat.us.com/feras-alayed",
    "alumniOf": { "@type": "Organization", "name": "Unicity International" },
    "award": ["Presidential Sapphire - Unicity International"],
    "nationality": { "@type": "Country", "name": "Saudi Arabia" }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": isAr ? "فراس العايد - مركز المعرفة" : "Feras Alayed - Knowledge Hub",
    "description": isAr
      ? "مفكر ومدرب ومُثقف عالمي في الصحة المستدامة والنمو الشخصي والقيادة والتمكين الإنساني"
      : "Global educator, speaker, and mentor in sustainable health, personal growth, leadership, and human empowerment",
    "url": "https://feelgreat.us.com/feras-alayed",
    "mainEntity": { "@id": "https://feelgreat.us.com/#feras-alayed" },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://feelgreat.us.com/" },
        { "@type": "ListItem", "position": 2, "name": "Feras Alayed", "item": "https://feelgreat.us.com/feras-alayed" }
      ]
    }
  };

  useEffect(() => {
    document.title = isAr
      ? "فراس العايد | مركز المعرفة - الصحة المستدامة، القيادة، التمكين الإنساني"
      : "Feras Alayed | Knowledge Hub - Sustainable Health, Leadership, Human Empowerment";
    // Inject JSON-LD
    const existing = document.querySelectorAll('script[data-feras-hub]');
    existing.forEach(el => el.remove());
    [personSchema, websiteSchema].forEach(schema => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-feras-hub', 'true');
      s.textContent = JSON.stringify(schema);
      document.head.appendChild(s);
    });
    return () => { document.querySelectorAll('script[data-feras-hub]').forEach(el => el.remove()); };
  }, [isAr]);

  const fourPillars = [
    {
      icon: Heart,
      titleEn: "Sustainable Health",
      titleAr: "الصحة المستدامة",
      descEn: "Helping people improve their wellbeing through science, behavior change, metabolic health, sustainable nutrition, and lifestyle transformation.",
      descAr: "مساعدة الناس على تحسين صحتهم من خلال العلم، تغيير السلوك، الصحة الأيضية، التغذية المستدامة، وتحول نمط الحياة.",
      link: "/health-library/sustainable-health",
      color: "emerald"
    },
    {
      icon: Brain,
      titleEn: "Personal Growth",
      titleAr: "النمو الشخصي",
      descEn: "Developing awareness, discipline, resilience, emotional intelligence, and the habits required to create lasting success.",
      descAr: "تطوير الوعي، الانضباط، المرونة، الذكاء العاطفي، والعادات المطلوبة لتحقيق نجاح دائم.",
      link: "/about",
      color: "blue"
    },
    {
      icon: Users,
      titleEn: "Leadership & Human Development",
      titleAr: "القيادة والتنمية البشرية",
      descEn: "Empowering individuals and teams to lead with purpose, build influence, inspire others, and create meaningful impact.",
      descAr: "تمكين الأفراد والفرق من القيادة بهدف، بناء التأثير، إلهام الآخرين، وإحداث أثر حقيقي.",
      link: "/partner-with-feras",
      color: "purple"
    },
    {
      icon: TrendingUp,
      titleEn: "Entrepreneurship & Financial Empowerment",
      titleAr: "ريادة الأعمال والتمكين المالي",
      descEn: "Helping people discover opportunities, develop entrepreneurial thinking, create additional income streams, and build greater freedom.",
      descAr: "مساعدة الناس على اكتشاف الفرص، تطوير التفكير الريادي، إنشاء مصادر دخل إضافية، وبناء حرية أكبر.",
      link: "/partner",
      color: "amber"
    }
  ];

  const areasOfImpact = [
    { en: "Sustainable Health", ar: "الصحة المستدامة" },
    { en: "Behavioral Nutrition", ar: "التغذية السلوكية" },
    { en: "Metabolic Health", ar: "الصحة الأيضية" },
    { en: "Leadership Development", ar: "تطوير القيادة" },
    { en: "Personal Growth", ar: "النمو الشخصي" },
    { en: "Team Building", ar: "بناء الفرق" },
    { en: "Entrepreneurship", ar: "ريادة الأعمال" },
    { en: "Financial Empowerment", ar: "التمكين المالي" },
    { en: "Human Performance", ar: "الأداء البشري" },
    { en: "Burnout Prevention", ar: "الوقاية من الاحتراق" },
    { en: "Success Mindset", ar: "عقلية النجاح" },
    { en: "Life Transformation", ar: "تحول الحياة" },
  ];

  const speakingTopics = [
    { en: "Sustainable Health", ar: "الصحة المستدامة" },
    { en: "Human Potential", ar: "الإمكانات البشرية" },
    { en: "Leadership", ar: "القيادة" },
    { en: "Behavioral Change", ar: "التغيير السلوكي" },
    { en: "Burnout Prevention", ar: "الوقاية من الاحتراق" },
    { en: "Entrepreneurship", ar: "ريادة الأعمال" },
    { en: "Financial Growth", ar: "النمو المالي" },
    { en: "Success Principles", ar: "مبادئ النجاح" },
    { en: "Team Development", ar: "تطوير الفرق" },
  ];

  const featuredPrograms = [
    { en: "Sustainable Health Program", ar: "برنامج الصحة المستدامة", link: "/health-library/sustainable-health" },
    { en: "Feel Great Protocol", ar: "بروتوكول Feel Great", link: "/" },
    { en: "Leadership Development", ar: "تطوير القيادة", link: "/partner-with-feras" },
    { en: "Human Potential Workshops", ar: "ورش الإمكانات البشرية", link: "/about" },
    { en: "Burnout & Wellbeing Programs", ar: "برامج الاحتراق والرفاهية", link: "/health-library/metabolic-health" },
    { en: "Mastermind Groups", ar: "مجموعات العقل المدبر", link: "/partner-with-feras" },
    { en: "Personal Growth Initiatives", ar: "مبادرات النمو الشخصي", link: "/about" },
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
      qEn: "What countries does Feras work in?",
      qAr: "في أي دول يعمل فراس؟",
      aEn: "Feras has worked with individuals and teams across 15+ countries including Saudi Arabia, UAE, Oman, Kuwait, Jordan, Turkey, USA, UK, Germany, Netherlands, Sweden, and Malaysia through speaking engagements, workshops, and coaching programs.",
      aAr: "عمل فراس مع أفراد وفرق في أكثر من 15 دولة تشمل السعودية، الإمارات، عُمان، الكويت، الأردن، تركيا، أمريكا، بريطانيا، ألمانيا، هولندا، السويد، وماليزيا."
    },
    {
      qEn: "What is the Feel Great program?",
      qAr: "ما هو برنامج Feel Great؟",
      aEn: "Feel Great is a science-based metabolic health program combining intermittent fasting with two clinically-studied supplements (Unimate and Balance) to support insulin sensitivity, gut health, and sustainable weight management. It's one of several programs Feras uses in his holistic health approach.",
      aAr: "Feel Great هو برنامج صحة أيضية مبني على العلم يجمع بين الصيام المتقطع ومكملين مدروسين سريرياً (Unimate وBalance) لدعم حساسية الأنسولين، صحة الأمعاء، وإدارة الوزن المستدامة."
    },
    {
      qEn: "How can I work with Feras?",
      qAr: "كيف يمكنني العمل مع فراس؟",
      aEn: "You can work with Feras through health consultations, leadership coaching, partnership programs, or attending his workshops and speaking events. Visit the 'Work With Feras' section or contact him via WhatsApp for personalized guidance.",
      aAr: "يمكنك العمل مع فراس من خلال الاستشارات الصحية، التدريب القيادي، برامج الشراكة، أو حضور ورشه ومحاضراته. زر قسم 'العمل مع فراس' أو تواصل عبر واتساب."
    },
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

      {/* ===== HERO SECTION ===== */}
      <header className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(59,130,246,0.2) 0%, transparent 50%)' }} />
        </div>

        <div className="container max-w-6xl relative z-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-emerald-300/70 mb-8">
            <Link href="/" className="hover:text-white">{isAr ? "الرئيسية" : "Home"}</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{isAr ? "فراس العايد" : "Feras Alayed"}</span>
          </nav>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Photo */}
            <div className="shrink-0">
              <div className="relative">
                <img
                  src="/manus-storage/feras-professional_115956a2.png"
                  alt="Feras Alayed - Global Health Educator & Leadership Mentor"
                  className="w-48 h-48 lg:w-56 lg:h-56 rounded-full object-cover object-top shadow-2xl ring-4 ring-emerald-400/30"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  15+ {isAr ? "دولة" : "Countries"}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-start">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">
                {isAr ? "فراس العايد" : "Feras Alayed"}
              </h1>
              <p className="text-xl text-emerald-300 font-medium mb-4">
                {isAr
                  ? "مُثقف عالمي | أخصائي تغذية علاجية وسلوكية | مرشد قيادة"
                  : "Global Educator | Therapeutic & Behavioral Nutrition Specialist | Leadership Mentor"}
              </p>
              <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-6">
                {isAr
                  ? "بناء حياة أفضل من خلال الصحة، القيادة، النمو، والإمكانات البشرية"
                  : "Building Better Lives Through Health, Leadership, Growth, and Human Potential"}
              </p>

              {/* Core Belief */}
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

      {/* ===== MAIN CONTENT ===== */}
      <main className="container max-w-6xl py-16 space-y-20">

        {/* ===== 1. MISSION & VISION ===== */}
        <section id="mission">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">{isAr ? "الرسالة والرؤية" : "Mission & Vision"}</h2>
            <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {isAr
                  ? "المهمة ليست مجرد تحسين الصحة. المهمة هي مساعدة الناس على إطلاق إمكاناتهم البشرية الكاملة."
                  : "The mission is not simply to improve health. The mission is to help people unlock their full human potential."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Health", "Growth", "Leadership", "Purpose", "Prosperity"].map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-sm px-4 py-2 bg-white dark:bg-slate-800 shadow-sm">
                    {isAr ? ["الصحة", "النمو", "القيادة", "الهدف", "الازدهار"][i] : item}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">
                {isAr ? "هذه ليست رحلات منفصلة. إنها رحلة واحدة." : "These are not separate journeys. They are one journey."}
              </p>
            </div>
          </div>
        </section>

        {/* ===== 2. HEALTH, LEADERSHIP & HUMAN POTENTIAL PHILOSOPHY ===== */}
        <section id="philosophy">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "الفلسفة: الصحة، القيادة، والإمكانات البشرية" : "Philosophy: Health, Leadership & Human Potential"}</h2>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-8 max-w-3xl mx-auto">
            <blockquote className="text-center space-y-4 text-muted-foreground">
              <p className="text-lg font-medium text-foreground">
                {isAr ? "النجاح الحقيقي لا يُقاس بالمال وحده." : "True success is not measured by money alone."}
              </p>
              <p>{isAr ? "النجاح الحقيقي هو القدرة على بناء الصحة دون التضحية بالثروة." : "True success is the ability to build health without sacrificing wealth."}</p>
              <p>{isAr ? "بناء الثروة دون التضحية بالقيم." : "To build wealth without sacrificing values."}</p>
              <p>{isAr ? "النمو شخصياً مع مساعدة الآخرين على النمو." : "To grow personally while helping others grow."}</p>
              <p className="text-lg font-medium text-foreground">
                {isAr ? "إنشاء حياة ناجحة، مستدامة، وذات معنى." : "To create a life that is successful, sustainable, and meaningful."}
              </p>
            </blockquote>
          </div>
        </section>

        {/* ===== 3. THE FOUR PILLARS ===== */}
        <section id="pillars">
          <h2 className="text-3xl font-bold mb-8 text-center">{isAr ? "الأركان الأربعة" : "The Four Pillars"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fourPillars.map((pillar, i) => (
              <Link key={i} href={pillar.link}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-emerald-300 dark:hover:border-emerald-700">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-${pillar.color}-100 dark:bg-${pillar.color}-900/30 flex items-center justify-center shrink-0`}>
                        <pillar.icon className={`w-6 h-6 text-${pillar.color}-600 dark:text-${pillar.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{isAr ? pillar.titleAr : pillar.titleEn}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{isAr ? pillar.descAr : pillar.descEn}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== 4. SUSTAINABLE HEALTH FRAMEWORK ===== */}
        <section id="sustainable-health">
          <h2 className="text-3xl font-bold mb-4">{isAr ? "إطار الصحة المستدامة" : "Sustainable Health Framework"}</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            {isAr
              ? "نهج شامل يجمع بين التغذية العلاجية، العلوم السلوكية، وتحسين الصحة الأيضية لإحداث تحولات دائمة."
              : "A comprehensive approach combining therapeutic nutrition, behavioral science, and metabolic health optimization for lasting transformations."}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { en: "Metabolic Health", ar: "الصحة الأيضية", icon: "⚡" },
              { en: "Insulin Sensitivity", ar: "حساسية الأنسولين", icon: "🩺" },
              { en: "Gut Microbiome", ar: "الميكروبيوم", icon: "🦠" },
              { en: "Intermittent Fasting", ar: "الصيام المتقطع", icon: "⏰" },
              { en: "Sleep Optimization", ar: "تحسين النوم", icon: "😴" },
              { en: "Stress Management", ar: "إدارة التوتر", icon: "🧘" },
            ].map((item, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-sm font-medium">{isAr ? item.ar : item.en}</p>
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

        {/* ===== 5. BEHAVIORAL NUTRITION FRAMEWORK ===== */}
        <section id="behavioral-nutrition">
          <h2 className="text-3xl font-bold mb-4">{isAr ? "إطار التغذية السلوكية" : "Behavioral Nutrition Framework"}</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            {isAr
              ? "تغيير العادات الغذائية ليس مجرد معرفة ماذا نأكل، بل فهم لماذا نأكل وكيف نبني سلوكيات صحية مستدامة."
              : "Changing eating habits isn't just about knowing what to eat, but understanding why we eat and how to build sustainable healthy behaviors."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { en: "Root Cause Analysis", ar: "تحليل الأسباب الجذرية", desc_en: "Identifying the behavioral and emotional triggers behind unhealthy eating patterns", desc_ar: "تحديد المحفزات السلوكية والعاطفية وراء أنماط الأكل غير الصحية" },
              { en: "Habit Architecture", ar: "هندسة العادات", desc_en: "Building sustainable nutrition habits through behavioral science principles", desc_ar: "بناء عادات تغذية مستدامة من خلال مبادئ العلوم السلوكية" },
              { en: "Mindful Nutrition", ar: "التغذية الواعية", desc_en: "Developing awareness of hunger, satiety, and emotional eating patterns", desc_ar: "تطوير الوعي بالجوع والشبع وأنماط الأكل العاطفي" },
              { en: "Metabolic Optimization", ar: "التحسين الأيضي", desc_en: "Using evidence-based protocols to improve insulin sensitivity and metabolic function", desc_ar: "استخدام بروتوكولات مبنية على الأدلة لتحسين حساسية الأنسولين والوظيفة الأيضية" },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2">{isAr ? item.ar : item.en}</h4>
                  <p className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== 6. GLOBAL IMPACT & COUNTRIES ===== */}
        <section id="global-impact">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold">{isAr ? "الأثر العالمي والدول" : "Global Impact & Countries Served"}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {isAr
              ? "من خلال المحاضرات، ورش العمل، برامج التدريب، مبادرات تطوير القيادة، ومشاريع التثقيف الصحي، عمل فراس مع أفراد وفرق عبر دول وثقافات متعددة."
              : "Through speaking engagements, workshops, coaching programs, leadership development initiatives, and health education projects, Feras has worked with individuals and teams across multiple countries and cultures."}
          </p>
          <div className="flex flex-wrap gap-2">
            {countries.map((country, i) => (
              <Badge key={i} variant="outline" className="text-sm px-3 py-1.5">
                {isAr ? country.ar : country.en}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { value: "15+", en: "Countries", ar: "دولة" },
              { value: "500+", en: "Partners", ar: "شريك" },
              { value: "1000+", en: "Transformations", ar: "تحول" },
              { value: "5+", en: "Years", ar: "سنوات" },
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

        {/* ===== 7. SPEAKING & WORKSHOPS ===== */}
        <section id="speaking">
          <div className="flex items-center gap-3 mb-6">
            <Mic className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">{isAr ? "المحاضرات وورش العمل" : "Speaking & Workshops"}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {isAr
              ? "مواضيع المحاضرات والورش تشمل:"
              : "Speaking and workshop topics include:"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {speakingTopics.map((topic, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">{isAr ? topic.ar : topic.en}</span>
              </div>
            ))}
          </div>
          {/* Photo gallery */}
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

        {/* ===== 8. LEADERSHIP DEVELOPMENT PROGRAMS ===== */}
        <section id="leadership">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold">{isAr ? "برامج تطوير القيادة" : "Leadership Development Programs"}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {isAr
              ? "تمكين الأفراد والفرق من القيادة بهدف، بناء التأثير، إلهام الآخرين، وإحداث أثر حقيقي في مجتمعاتهم."
              : "Empowering individuals and teams to lead with purpose, build influence, inspire others, and create meaningful impact in their communities."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { en: "Purpose-Driven Leadership", ar: "القيادة الهادفة", desc_en: "Leading with clarity, vision, and authentic purpose", desc_ar: "القيادة بوضوح ورؤية وهدف أصيل" },
              { en: "Team Building & Influence", ar: "بناء الفرق والتأثير", desc_en: "Building high-performing teams through trust and empowerment", desc_ar: "بناء فرق عالية الأداء من خلال الثقة والتمكين" },
              { en: "Mastermind Groups", ar: "مجموعات العقل المدبر", desc_en: "Collaborative growth environments for ambitious leaders", desc_ar: "بيئات نمو تعاونية للقادة الطموحين" },
            ].map((item, i) => (
              <Card key={i} className="border-purple-200 dark:border-purple-800">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2 text-purple-700 dark:text-purple-400">{isAr ? item.ar : item.en}</h4>
                  <p className="text-sm text-muted-foreground">{isAr ? item.desc_ar : item.desc_en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== 9. RESEARCH COMMENTARY CENTER ===== */}
        <section id="research">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-teal-600" />
            <h2 className="text-3xl font-bold">{isAr ? "مركز التعليقات البحثية" : "Research Commentary Center"}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {isAr
              ? "مجموعة من المقالات، ملخصات الأبحاث، الموارد التعليمية، والأطر العملية المصممة لمساعدة الناس على اتخاذ قرارات أفضل في الصحة والقيادة والأعمال والحياة."
              : "A collection of articles, research summaries, educational resources, and practical frameworks designed to help people make better decisions in health, leadership, business, and life."}
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

        {/* ===== 10. SUCCESS STORIES HUB ===== */}
        <section id="success-stories">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold">{isAr ? "مركز قصص النجاح" : "Success Stories Hub"}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {isAr
              ? "استكشف قصصاً ملهمة من أشخاص حوّلوا صحتهم، ثقتهم، قدراتهم القيادية، مستقبلهم المالي، وجودة حياتهم."
              : "Explore inspiring stories from people who transformed their health, confidence, leadership abilities, financial future, and quality of life."}
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

        {/* ===== 11. MEDIA & INTERVIEWS ===== */}
        <section id="media">
          <h2 className="text-3xl font-bold mb-6">{isAr ? "الإعلام والمقابلات" : "Media & Interviews"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3">{isAr ? "المنصات" : "Platforms"}</h3>
                <div className="space-y-2">
                  {[
                    { en: "Instagram @use2lose - Health & Lifestyle", ar: "انستغرام @use2lose - الصحة ونمط الحياة", link: "https://www.instagram.com/use2lose" },
                    { en: "TikTok @feras.alayed - Short Health Tips", ar: "تيك توك @feras.alayed - نصائح صحية قصيرة", link: "https://www.tiktok.com/@feras.alayed" },
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
                    { en: "Health Education & Awareness", ar: "التثقيف والتوعية الصحية" },
                    { en: "Scientific Research Summaries", ar: "ملخصات الأبحاث العلمية" },
                    { en: "Leadership Insights", ar: "رؤى قيادية" },
                    { en: "Success Stories & Testimonials", ar: "قصص نجاح وشهادات" },
                    { en: "Lifestyle Transformation Tips", ar: "نصائح تحول نمط الحياة" },
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

        {/* ===== 12. FEATURED ARTICLES ===== */}
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

        {/* ===== 13. LATEST SCIENTIFIC RESEARCH ===== */}
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

        {/* ===== 14. HEALTH LIBRARY ACCESS ===== */}
        <section id="health-library">
          <h2 className="text-3xl font-bold mb-6">{isAr ? "المكتبة الصحية" : "Health Library"}</h2>
          <p className="text-muted-foreground mb-6">
            {isAr
              ? "مكتبة شاملة من المحتوى الصحي المبني على الأدلة العلمية، منظمة في مراكز معرفية متخصصة."
              : "A comprehensive library of evidence-based health content, organized into specialized knowledge hubs."}
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

        {/* ===== 15. ENTREPRENEURSHIP & FINANCIAL EMPOWERMENT ===== */}
        <section id="entrepreneurship">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold">{isAr ? "ريادة الأعمال والتمكين المالي" : "Entrepreneurship & Financial Empowerment"}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            {isAr
              ? "مساعدة الناس على اكتشاف الفرص، تطوير التفكير الريادي، إنشاء مصادر دخل إضافية، وبناء حرية ومرونة أكبر في الحياة."
              : "Helping people discover opportunities, develop entrepreneurial thinking, create additional income streams, and build greater freedom and flexibility in life."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { en: "Health Entrepreneurship", ar: "ريادة الأعمال الصحية", desc_en: "Building a purpose-driven health business", desc_ar: "بناء عمل صحي هادف" },
              { en: "Income Diversification", ar: "تنويع الدخل", desc_en: "Creating multiple sustainable income streams", desc_ar: "إنشاء مصادر دخل متعددة ومستدامة" },
              { en: "Financial Freedom", ar: "الحرية المالية", desc_en: "Building long-term financial independence", desc_ar: "بناء استقلال مالي طويل المدى" },
            ].map((item, i) => (
              <Card key={i} className="border-amber-200 dark:border-amber-800">
                <CardContent className="p-5">
                  <h4 className="font-bold mb-2 text-amber-700 dark:text-amber-400">{isAr ? item.ar : item.en}</h4>
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

        {/* ===== 16. STRATEGIC PARTNERSHIPS ===== */}
        <section id="partnerships">
          <div className="flex items-center gap-3 mb-6">
            <Handshake className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold">{isAr ? "الشراكات الاستراتيجية" : "Strategic Partnerships"}</h2>
          </div>
          <p className="text-muted-foreground mb-6">
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
            ].map((partner, i) => (
              <Badge key={i} variant="secondary" className="text-sm px-4 py-2">
                {isAr ? partner.ar : partner.en}
              </Badge>
            ))}
          </div>
        </section>

        {/* ===== 17. FEATURED PROGRAMS ===== */}
        <section id="programs">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-rose-600" />
            <h2 className="text-3xl font-bold">{isAr ? "البرامج المميزة" : "Featured Programs"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPrograms.map((program, i) => (
              <Link key={i} href={program.link}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-sm shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-medium text-sm">{isAr ? program.ar : program.en}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== 18. HUMAN DEVELOPMENT RESOURCES ===== */}
        <section id="resources">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-8 h-8 text-cyan-600" />
            <h2 className="text-3xl font-bold">{isAr ? "موارد التنمية البشرية" : "Human Development Resources"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { en: "Health Assessments", ar: "التقييمات الصحية", desc_en: "Free tools to evaluate your metabolic health, insulin sensitivity, and wellness score", desc_ar: "أدوات مجانية لتقييم صحتك الأيضية وحساسية الأنسولين ومستوى العافية", link: "/health-assessment" },
              { en: "90-Day Journey", ar: "رحلة الـ 90 يوم", desc_en: "A structured transformation program with weekly focus areas and milestones", desc_ar: "برنامج تحول منظم مع مجالات تركيز أسبوعية ومعالم", link: "/90-day-journey" },
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

        {/* ===== 19. AREAS OF IMPACT ===== */}
        <section id="impact-areas">
          <h2 className="text-3xl font-bold mb-6">{isAr ? "مجالات التأثير" : "Areas of Impact"}</h2>
          <div className="flex flex-wrap gap-2">
            {areasOfImpact.map((area, i) => (
              <Badge key={i} variant="outline" className="text-sm px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
                {isAr ? area.ar : area.en}
              </Badge>
            ))}
          </div>
        </section>

        <Separator />

        {/* ===== 20. CORE PRINCIPLES & BELIEFS ===== */}
        <section id="principles">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-8 h-8 text-yellow-600" />
            <h2 className="text-3xl font-bold">{isAr ? "المبادئ والمعتقدات الأساسية" : "Core Principles & Beliefs"}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { en: "Health is the foundation of all success", ar: "الصحة هي أساس كل نجاح" },
              { en: "Every person deserves a better life", ar: "كل شخص يستحق حياة أفضل" },
              { en: "Science guides, behavior transforms", ar: "العلم يرشد، والسلوك يُحوّل" },
              { en: "Leadership starts with self-leadership", ar: "القيادة تبدأ بقيادة الذات" },
              { en: "Growth is a daily practice, not a destination", ar: "النمو ممارسة يومية وليس وجهة" },
              { en: "Community amplifies individual transformation", ar: "المجتمع يضاعف التحول الفردي" },
            ].map((principle, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-900">
                <div className="w-8 h-8 rounded-full bg-yellow-200 dark:bg-yellow-900 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <p className="font-medium text-sm">{isAr ? principle.ar : principle.en}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== 21. FAQ ===== */}
        <section id="faq">
          <h2 className="text-3xl font-bold mb-6">{isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}</h2>
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

        {/* ===== 22. WORK WITH FERAS ===== */}
        <section id="work-with-feras" className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 lg:p-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{isAr ? "العمل مع فراس" : "Work With Feras"}</h2>
            <p className="text-muted-foreground mb-8">
              {isAr
                ? "سواء كنت تبحث عن تحسين صحتك، تطوير قيادتك، أو بناء مصدر دخل إضافي - فراس يقدم مسارات متعددة للتعاون."
                : "Whether you're looking to improve your health, develop your leadership, or build an additional income stream - Feras offers multiple paths for collaboration."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Link href="/health-assessment">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🩺</div>
                    <h4 className="font-bold text-sm mb-1">{isAr ? "استشارة صحية" : "Health Consultation"}</h4>
                    <p className="text-xs text-muted-foreground">{isAr ? "تقييم مجاني لصحتك" : "Free health assessment"}</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/partner-with-feras">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🤝</div>
                    <h4 className="font-bold text-sm mb-1">{isAr ? "شراكة صحية" : "Health Partnership"}</h4>
                    <p className="text-xs text-muted-foreground">{isAr ? "ابنِ عملك الصحي" : "Build your health business"}</p>
                  </CardContent>
                </Card>
              </Link>
              <a href="https://wa.me/96877020770?text=أرغب بالتواصل مع فراس" target="_blank" rel="noopener noreferrer">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-bold text-sm mb-1">{isAr ? "تواصل مباشر" : "Direct Contact"}</h4>
                    <p className="text-xs text-muted-foreground">{isAr ? "واتساب" : "WhatsApp"}</p>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>
        </section>

        {/* ===== ENTITY CONNECTIONS FOOTER ===== */}
        <section className="text-center text-sm text-muted-foreground space-y-2 pt-8">
          <p className="font-medium text-foreground">{isAr ? "فراس العايد - مركز المعرفة" : "Feras Alayed - Knowledge Hub"}</p>
          <p>{isAr ? "مُثقف عالمي | أخصائي تغذية علاجية وسلوكية | مرشد قيادة | رائد أعمال صحي" : "Global Educator | Therapeutic & Behavioral Nutrition Specialist | Leadership Mentor | Health Entrepreneur"}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/blog" className="hover:text-primary">{isAr ? "المدونة" : "Blog"}</Link>
            <Link href="/research" className="hover:text-primary">{isAr ? "الأبحاث" : "Research"}</Link>
            <Link href="/health-library" className="hover:text-primary">{isAr ? "المكتبة الصحية" : "Health Library"}</Link>
            <Link href="/success-stories" className="hover:text-primary">{isAr ? "قصص النجاح" : "Success Stories"}</Link>
            <Link href="/health-assessment" className="hover:text-primary">{isAr ? "التقييم الصحي" : "Health Assessment"}</Link>
            <Link href="/partner-with-feras" className="hover:text-primary">{isAr ? "الشراكة" : "Partnership"}</Link>
          </div>
        </section>

      </main>
    </div>
  );
}
