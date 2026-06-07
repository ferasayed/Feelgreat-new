import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Globe, Heart, Users, Award, BookOpen, Mic, Target, Zap, Shield, Star, CheckCircle, TrendingUp, Briefcase } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useLanguage } from "@/contexts/LanguageContext";

function AboutCounter({ end, suffix, label, icon: Icon, color }: { end: number; suffix: string; label: string; icon: any; color: string }) {
  const { count, ref } = useCountUp(end, 2200);
  return (
    <div ref={ref} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
      <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} />
      <div className={`text-3xl font-bold ${color}`}>{count.toLocaleString()}{suffix}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function About() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  useEffect(() => {
    document.title = isAr
      ? "عن فراس العايد | مدرب عالمي واستراتيجي صحي | Feel Great"
      : "About Feras Alayed | Global Trainer & Health Strategist | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", isAr
      ? "تعرّف على فراس العايد - مدرب عالمي، مرشد قيادي، استراتيجي صحي، أخصائي تغذية سلوكية، ومُثقف في الصحة المستدامة يساعد الناس على تحويل صحتهم وعقليتهم وحياتهم في أكثر من 30 دولة."
      : "Meet Feras Alayed - Global Trainer, Leadership Mentor, Health & Performance Strategist, Behavioral Nutrition Specialist, and Sustainable Health Advocate helping people transform their health, mindset, and life across 30+ countries.");
  }, [isAr]);

  const titles = isAr
    ? ["مدرب عالمي", "مرشد قيادي", "استراتيجي صحي", "أخصائي تغذية سلوكية", "مُثقف في الصحة المستدامة"]
    : ["Global Trainer", "Leadership Mentor", "Health & Performance Strategist", "Behavioral Nutrition Specialist", "Sustainable Health Advocate"];

  const pillars = isAr
    ? [
        { icon: Heart, title: "الصحة المستدامة", desc: "استراتيجيات تغذية ونمط حياة مبنية على الأدلة تُحدث تغييراً دائماً وليس مؤقتاً", color: "text-green-400 bg-green-400/10" },
        { icon: BookOpen, title: "التغذية السلوكية", desc: "فهم سيكولوجية الأكل وبناء عادات تجعل الحياة الصحية تلقائية", color: "text-blue-400 bg-blue-400/10" },
        { icon: Users, title: "تطوير القيادة", desc: "بناء قادة واثقين يُلهمون الآخرين ويُحدثون تأثيراً إيجابياً في مجتمعاتهم", color: "text-purple-400 bg-purple-400/10" },
        { icon: Zap, title: "تحويل العقلية", desc: "تغيير المعتقدات المُقيّدة وتطوير المرونة الذهنية اللازمة للنجاح الدائم", color: "text-amber-400 bg-amber-400/10" },
        { icon: TrendingUp, title: "النمو الشخصي", desc: "التطوير المستمر في جميع أبعاد الحياة — الصحة، العلاقات، المهنة، والهدف", color: "text-cyan-400 bg-cyan-400/10" },
        { icon: Target, title: "التمكين المالي", desc: "خلق فرص للنمو المالي من خلال المهارات والقيادة وريادة الأعمال الصحية", color: "text-red-400 bg-red-400/10" },
      ]
    : [
        { icon: Heart, title: "Sustainable Health", desc: "Evidence-based nutrition and lifestyle strategies that create lasting change, not temporary fixes", color: "text-green-400 bg-green-400/10" },
        { icon: BookOpen, title: "Behavioral Nutrition", desc: "Understanding the psychology of eating and building habits that make healthy living automatic", color: "text-blue-400 bg-blue-400/10" },
        { icon: Users, title: "Leadership Development", desc: "Building confident leaders who inspire others and create positive impact in their communities", color: "text-purple-400 bg-purple-400/10" },
        { icon: Zap, title: "Mindset Transformation", desc: "Shifting limiting beliefs and developing the mental resilience needed for lasting success", color: "text-amber-400 bg-amber-400/10" },
        { icon: TrendingUp, title: "Personal Growth", desc: "Continuous development across all dimensions of life — health, relationships, career, and purpose", color: "text-cyan-400 bg-cyan-400/10" },
        { icon: Target, title: "Financial Empowerment", desc: "Creating opportunities for financial growth through skills, leadership, and health entrepreneurship", color: "text-red-400 bg-red-400/10" },
      ];

  const speakingItems = isAr
    ? [
        { title: "ورش عمل الصحة والعافية", desc: "جلسات مبنية على الأدلة حول الصحة الأيضية ومقاومة الإنسولين والتغذية المستدامة" },
        { title: "برامج تطوير القيادة", desc: "بناء فرق عالية الأداء وتطوير قادة الجيل القادم" },
        { title: "تدريب العقلية والأداء", desc: "إطلاق الأداء الأعلى من خلال علم السلوك وتكوين العادات" },
        { title: "ندوات الأعمال وريادة الأعمال", desc: "إنشاء أعمال هادفة في مجال الصحة والعافية" },
      ]
    : [
        { title: "Health & Wellness Workshops", desc: "Evidence-based sessions on metabolic health, insulin resistance, and sustainable nutrition" },
        { title: "Leadership Development Programs", desc: "Building high-performance teams and developing next-generation leaders" },
        { title: "Mindset & Performance Training", desc: "Unlocking peak performance through behavioral science and habit formation" },
        { title: "Business & Entrepreneurship Seminars", desc: "Creating purpose-driven businesses in the health and wellness space" },
      ];

  const roles = isAr
    ? [
        { icon: Globe, title: "مدرب دولي", desc: "برامج تدريبية في أكثر من 30 دولة" },
        { icon: Users, title: "مرشد قيادي", desc: "تطوير قادة يبنون فرقاً مؤثرة" },
        { icon: Heart, title: "استراتيجي صحي", desc: "تحسين الصحة الأيضية المبني على الأدلة" },
        { icon: Mic, title: "متحدث", desc: "عروض رئيسية عن الصحة والقيادة والنمو" },
        { icon: Shield, title: "بانٍ للمجتمعات", desc: "بناء مجتمعات عالمية من المنجزين المهتمين بالصحة" },
        { icon: Star, title: "مُثقف في التنمية الشخصية", desc: "نمو شامل في جميع أبعاد الحياة" },
      ]
    : [
        { icon: Globe, title: "International Trainer", desc: "Training programs delivered across 30+ countries" },
        { icon: Users, title: "Leadership Mentor", desc: "Developing leaders who build impactful teams" },
        { icon: Heart, title: "Health Strategist", desc: "Evidence-based metabolic health optimization" },
        { icon: Mic, title: "Speaker", desc: "Keynote presentations on health, leadership & growth" },
        { icon: Shield, title: "Community Builder", desc: "Building global communities of health-focused achievers" },
        { icon: Star, title: "Personal Development Advocate", desc: "Holistic growth across all life dimensions" },
      ];

  const credentials = isAr
    ? [
        { icon: Award, title: "Presidential Sapphire - يونيسيتي الدولية", desc: "أعلى رتبة قيادية تم تحقيقها من خلال بناء فريق عالمي في أكثر من 30 دولة" },
        { icon: BookOpen, title: "أخصائي تغذية سلوكية", desc: "شهادة متقدمة في منهجية التغيير السلوكي وتكوين العادات وتعديل نمط الحياة المستدام" },
        { icon: Briefcase, title: "خبير تغذية علاجية", desc: "متخصص في الصحة الأيضية وإدارة مقاومة الإنسولين والوقاية من الأمراض المزمنة من خلال التغذية" },
        { icon: Globe, title: "مُثقف صحي دولي", desc: "أقام ندوات تثقيف صحي وبرامج تدريبية في الشرق الأوسط وأوروبا وأمريكا الشمالية" },
        { icon: TrendingUp, title: "مدرب تحسين الأداء", desc: "الجمع بين علم التغذية وعلم النفس السلوكي لتحقيق نتائج الأداء الأعلى" },
        { icon: Shield, title: "ممارسة متوافقة مع FTC", desc: "جميع الادعاءات الصحية والممارسات التجارية متوافقة تماماً مع إرشادات FTC ومعايير الصناعة" },
      ]
    : [
        { icon: Award, title: "Presidential Sapphire - Unicity International", desc: "Highest leadership rank achieved through building a global team across 30+ countries" },
        { icon: BookOpen, title: "Behavioral Nutrition Specialist", desc: "Advanced certification in behavioral change methodology, habit formation, and sustainable lifestyle modification" },
        { icon: Briefcase, title: "Therapeutic Nutrition Expert", desc: "Specialized in metabolic health, insulin resistance management, and chronic disease prevention through nutrition" },
        { icon: Globe, title: "International Health Educator", desc: "Conducted health education seminars and training programs across the Middle East, Europe, and North America" },
        { icon: TrendingUp, title: "Performance Optimization Coach", desc: "Combining nutrition science with behavioral psychology for peak performance outcomes" },
        { icon: Shield, title: "FTC Compliant Practice", desc: "All health claims and business practices fully compliant with FTC guidelines and industry standards" },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/70 z-10" />
        <div className="container max-w-6xl mx-auto px-4 pt-20 pb-16 relative z-20">
          <div className="text-center mb-6">
            <Link href="/" className="text-amber-400 font-bold text-xl inline-block">Feel Great</Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium mb-6">
                Presidential Sapphire | Unicity International
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {isAr ? "تعرّف على فراس العايد" : "Meet Feras Alayed"}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {titles.map((title) => (
                  <span key={title} className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-sm text-slate-300">
                    {title}
                  </span>
                ))}
              </div>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                {isAr
                  ? "فراس العايد مدرب دولي ومرشد قيادي واستراتيجي صحي مكرّس لمساعدة الناس على إحداث تحول في صحتهم وحياتهم. مهمته تتجاوز التغذية — فهو يساعد الناس على تحسين صحتهم، تقوية عقليتهم، بناء ثقتهم، تطوير مهاراتهم القيادية، خلق عادات مستدامة، وإطلاق مستويات أعلى من النمو الشخصي والمهني."
                  : "Feras Alayed is an international trainer, leadership mentor, and health strategist dedicated to helping people create transformation in both health and life. His mission extends beyond nutrition — he helps people improve their health, strengthen their mindset, build confidence, develop leadership skills, create sustainable habits, and unlock higher levels of personal and professional growth."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/health-assessment" className="px-6 py-3 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center gap-2">
                  {isAr ? "ابدأ رحلتك" : "Start Your Journey"} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/partner-with-feras" className="px-6 py-3 border border-amber-400/50 text-amber-400 font-medium rounded-xl hover:bg-amber-400/10 transition-colors">
                  {isAr ? "شراكة مع فراس" : "Partner With Feras"}
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="/manus-storage/feras-portrait-1_d1f8a83f.png"
                  alt="Feras Alayed - Global Trainer & Health Strategist"
                  className="rounded-2xl shadow-2xl max-h-[500px] object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold text-sm shadow-lg">
                  {isAr ? "+15 سنة خبرة" : "15+ Years Experience"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container max-w-5xl mx-auto px-4 py-16" id="mission">
        <div className="bg-gradient-to-r from-amber-400/5 to-amber-500/5 border border-amber-400/20 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">{isAr ? "الرسالة" : "Mission"}</h2>
          <p className="text-2xl text-slate-200 font-light italic max-w-3xl mx-auto leading-relaxed">
            {isAr
              ? "\"تمكين الناس من بناء أجسام أقوى، عقول أقوى، قيادة أقوى، ومستقبل أفضل.\""
              : "\"To empower people to build stronger bodies, stronger minds, stronger leadership, and better futures.\""}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {(isAr
              ? ["التحول الصحي", "تطوير القيادة", "النمو الشخصي", "تطوير العقلية", "التمكين المالي", "الخبرة الدولية"]
              : ["Health Transformation", "Leadership Development", "Personal Growth", "Mindset Development", "Financial Empowerment", "International Experience"]
            ).map((pillar) => (
              <span key={pillar} className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-300">
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-4">{isAr ? "الركائز الأساسية" : "Core Pillars"}</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-10">
          {isAr
            ? "نهج فراس الفريد يجمع بين تخصصات متعددة لإحداث تحول شامل"
            : "Feras's unique approach combines multiple disciplines to create holistic transformation"}
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-400/30 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pillar.color}`}>
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
              <p className="text-slate-400 text-sm">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Global Impact */}
      <section className="container max-w-5xl mx-auto px-4 py-12" id="global-impact">
        <h2 className="text-3xl font-bold text-center mb-4">{isAr ? "إحداث تأثير يتجاوز الصحة" : "Creating Impact Beyond Health"}</h2>
        <p className="text-slate-400 text-center max-w-3xl mx-auto mb-10">
          {isAr
            ? "على مر السنين، ساعد فراس أفراداً في دول مختلفة على تحسين صحتهم، تطوير أنماط حياة أكثر صحة، تنمية ثقتهم، تعزيز قدراتهم القيادية، وخلق فرص جديدة للنمو الشخصي والمالي. يركز عمله على تمكين الناس ليصبحوا أقوى نسخة من أنفسهم."
            : "Over the years, Feras has helped individuals across different countries improve their wellbeing, develop healthier lifestyles, grow their confidence, strengthen leadership abilities, and create new opportunities for personal and financial growth. His work focuses on empowering people to become the strongest version of themselves."}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <AboutCounter end={30} suffix="+" label={isAr ? "دولة" : "Countries Reached"} icon={Globe} color="text-amber-400" />
          <AboutCounter end={10000} suffix="+" label={isAr ? "حياة تأثرت" : "Lives Impacted"} icon={Users} color="text-green-400" />
          <AboutCounter end={200} suffix="+" label={isAr ? "جلسة تدريبية" : "Training Sessions"} icon={Mic} color="text-blue-400" />
          <AboutCounter end={15} suffix="+" label={isAr ? "سنة خبرة" : "Years Experience"} icon={Award} color="text-purple-400" />
        </div>
      </section>

      {/* Speaking & Training */}
      <section className="container max-w-5xl mx-auto px-4 py-12" id="speaking">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">{isAr ? "التحدث والتدريب" : "Speaking & Training"}</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              {isAr
                ? "فراس متحدث ومدرب مطلوب أقام ورش عمل وندوات وبرامج تدريبية في الشرق الأوسط وأوروبا وأمريكا الشمالية. عروضه تجمع بين المعرفة العلمية والاستراتيجيات العملية والقصص التحفيزية."
                : "Feras is a sought-after speaker and trainer who has conducted workshops, seminars, and training programs across the Middle East, Europe, and North America. His presentations combine scientific knowledge with practical strategies and motivational storytelling."}
            </p>
            <div className="space-y-4">
              {speakingItems.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/manus-storage/feras-portrait-2_61f1860f.jpg"
              alt="Feras Alayed - Speaker & Trainer"
              className="rounded-2xl shadow-2xl max-h-[450px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Photo Gallery - Firas in Action */}
      <section className="container max-w-6xl mx-auto px-4 py-16" id="gallery">
        <h2 className="text-3xl font-bold text-center mb-4">{isAr ? "فراس في الميدان" : "Firas in Action"}</h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12">
          {isAr
            ? "لقطات حقيقية من جلسات التدريب والمحاضرات وورش العمل حول العالم"
            : "Real moments from training sessions, lectures, and workshops around the world"}
        </p>

        {/* Section 1: Speaker & Trainer */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-2 text-amber-400">{isAr ? "فراس كمتحدث ومدرّب" : "Speaker & Trainer"}</h3>
          <p className="text-slate-400 text-sm mb-4">{isAr ? "صور المسرح والمايكروفون والعروض" : "Stage, microphone, and presentations"}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <img src="/manus-storage/IMG_6338_a000f1b3.JPG" alt="Firas speaking on stage" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6339_cf6c0cde.JPG" alt="Firas with microphone" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6344_b48f8b1c.JPG" alt="Firas presenting" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6753_8a108a68.jpeg" alt="Firas at large venue" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
          </div>
        </div>

        {/* Section 2: Impact & Engagement */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-2 text-amber-400">{isAr ? "فراس وصناعة التأثير" : "Creating Impact"}</h3>
          <p className="text-slate-400 text-sm mb-4">{isAr ? "صور الجمهور المتفاعل ورفع الأيدي" : "Engaged audiences and interactive moments"}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <img src="/manus-storage/IMG_6340_3f7f858f.JPG" alt="Audience engagement" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6341_6893f63b.JPG" alt="Interactive session" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6342_d395a1b2.JPG" alt="Crowd interaction" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_5295_7ab0dde0.JPG" alt="Group engagement" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
          </div>
        </div>

        {/* Section 3: Diverse Environments */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-2 text-amber-400">{isAr ? "فراس في بيئات متنوعة" : "Diverse Environments"}</h3>
          <p className="text-slate-400 text-sm mb-4">{isAr ? "صور القاعات المختلفة والجمهور المتنوع" : "Different venues and diverse audiences"}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <img src="/manus-storage/IMG_6343_2d150838.JPG" alt="Training venue" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6345_d9d919cf.JPG" alt="Different environment" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6347_bc642836.JPG" alt="Diverse setting" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6346_beb62ff3.JPG" alt="Another venue" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
          </div>
        </div>

        {/* Section 4: Training Style */}
        <div className="mb-12">
          <h3 className="text-xl font-bold mb-2 text-amber-400">{isAr ? "أسلوب فراس التدريبي" : "Training Style"}</h3>
          <p className="text-slate-400 text-sm mb-4">{isAr ? "صور الشرح، الإشارة، الحركة، والتفاعل المباشر" : "Explaining, gesturing, movement, and direct interaction"}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <img src="/manus-storage/IMG_5327_bf4b169f.JPG" alt="Training style" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/7725012a-64c1-4fb7-a6cd-6cf47ed2ec4e_b73ed242.jpg" alt="Direct interaction" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/ff21e6c0-f6ae-41f4-bf27-bcf823c646aa_7570af89.jpg" alt="Teaching moment" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_5333_6201f21c.jpeg" alt="Coaching" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_5320_da234748.jpeg" alt="Training session" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
          </div>
        </div>

        {/* Section 5: Credibility & Authority */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-amber-400">{isAr ? "المصداقية والسلطة المعرفية" : "Credibility & Authority"}</h3>
          <p className="text-slate-400 text-sm mb-4">{isAr ? "الصور التي تظهر الحضور الكبير والتنظيم الرسمي" : "Large attendance and formal organization"}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <img src="/manus-storage/5E77A9D4-A309-4744-AE57-91FD8EFEF2F8_472123c9.jpg" alt="Large organized event" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_4955_32c556b6.PNG" alt="Professional authority" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/404bb448-c42c-48ca-98c8-49f7be351aa3_20b438be.jpg" alt="Formal setting" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/9FB5609C-0A12-42C9-8A81-E89AFEA20273_f4c031d4.jpg" alt="Large audience" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
            <img src="/manus-storage/IMG_6751_88a39e0b.JPG" alt="Authority presence" className="rounded-xl object-cover w-full h-48 hover:scale-105 transition-transform duration-300 cursor-pointer" />
          </div>
        </div>
      </section>

      {/* Why People Follow Feras */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">{isAr ? "لماذا يتابع الناس فراس" : "Why People Follow Feras"}</h2>
          <p className="text-xl text-slate-300 mb-4">{isAr ? "لأنه يُعلّم أكثر من الصحة." : "Because he teaches more than health."}</p>
          <p className="text-2xl font-bold text-amber-400 mb-6">{isAr ? "يُعلّم التحول." : "He teaches transformation."}</p>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {isAr
              ? "يأتي الناس لتحسين صحتهم. يبقون لأنهم يكتشفون نسخة أفضل من أنفسهم."
              : "People come to improve their health. They stay because they discover a better version of themselves."}
          </p>
        </div>
      </section>

      {/* Authority Roles */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">{isAr ? "السلطة والخبرة" : "Authority & Expertise"}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="w-10 h-10 bg-amber-400/10 rounded-lg flex items-center justify-center shrink-0">
                <role.icon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold">{role.title}</p>
                <p className="text-slate-500 text-xs">{role.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Credentials */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">{isAr ? "المؤهلات المهنية" : "Professional Credentials"}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {credentials.map((cred, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex gap-4">
              <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center shrink-0">
                <cred.icon className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{cred.title}</h3>
                <p className="text-slate-400 text-sm">{cred.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Positioning */}
      <section className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-slate-400 mb-2">
            {isAr ? "يجب أن يرى الزوار فراس العايد كسلطة موثوقة في:" : "Visitors should perceive Feras Alayed as a trusted authority in:"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {(isAr
              ? ["الصحة", "القيادة", "النمو الشخصي", "تغيير السلوك", "الأداء", "تحويل الحياة"]
              : ["Health", "Leadership", "Personal Growth", "Behavior Change", "Performance", "Life Transformation"]
            ).map((area) => (
              <span key={area} className="px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 font-medium">
                {area}
              </span>
            ))}
          </div>
          <p className="text-slate-500 italic">{isAr ? "ليس مجرد مدرب تغذية." : "Not simply as a nutrition coach."}</p>
        </div>
      </section>

      {/* CTAs */}
      <section className="container max-w-3xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">{isAr ? "مستعد لبدء تحولك؟" : "Ready to Start Your Transformation?"}</h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            {isAr
              ? "سواء كنت تبحث عن تحويل صحتك، تطوير قيادتك، أو بناء عمل ذي معنى — فراس هنا لإرشادك."
              : "Whether you're looking to transform your health, develop your leadership, or build a meaningful business — Feras is here to guide you."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/health-assessment" className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors inline-flex items-center justify-center gap-2">
              {isAr ? "خذ التقييم الصحي" : "Take Health Assessment"} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/partner-with-feras" className="px-8 py-4 border border-amber-400/50 text-amber-400 font-bold rounded-xl hover:bg-amber-400/10 transition-colors inline-flex items-center justify-center gap-2">
              {isAr ? "شراكة مع فراس" : "Partner With Feras"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer nav */}
      <div className="container max-w-5xl mx-auto px-4 pb-16 text-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">{isAr ? "الرئيسية" : "Home"}</Link>
          <Link href="/topics" className="hover:text-amber-400 transition-colors">{isAr ? "المواضيع الصحية" : "Health Topics"}</Link>
          <Link href="/blog" className="hover:text-amber-400 transition-colors">{isAr ? "المدونة" : "Blog"}</Link>
          <Link href="/partner-with-feras" className="hover:text-amber-400 transition-colors">{isAr ? "الشراكة" : "Partner"}</Link>
          <Link href="/health-investor" className="hover:text-amber-400 transition-colors">{isAr ? "المستثمر الصحي" : "Health Investor"}</Link>
          <Link href="/faq" className="hover:text-amber-400 transition-colors">{isAr ? "الأسئلة الشائعة" : "FAQ"}</Link>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <a href="https://www.instagram.com/use2lose" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">Instagram</a>
          <a href="https://www.tiktok.com/@feras.alayed" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors text-sm">TikTok</a>
        </div>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: "Feras Al-Ayed",
              jobTitle: "Global Trainer & Health Strategist",
              description: "International trainer, leadership mentor, and health strategist dedicated to helping people create transformation in both health and life.",
              url: "https://feelgreat.us.com/feras-alayed",
              image: "/manus-storage/feras-portrait-1_d1f8a83f.png",
              sameAs: [
                "https://www.instagram.com/use2lose",
                "https://www.tiktok.com/@feras.alayed",
              ],
              knowsAbout: [
                "Therapeutic Nutrition", "Behavioral Nutrition", "Leadership Development",
                "Health Strategy", "Insulin Resistance", "Metabolic Health",
                "Personal Development", "Mindset Transformation"
              ],
              worksFor: { "@type": "Organization", name: "Unicity International" },
            },
          }),
        }}
      />
    </div>
  );
}
