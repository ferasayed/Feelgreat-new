import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle2, Target, Zap, Trophy, Heart, Brain, Flame } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const phases = [
  {
    phase: "Phase 1",
    title: "Foundation",
    days: "Days 1–30",
    color: "from-blue-500 to-blue-600",
    icon: Target,
    description: "Build the metabolic foundation. Your body begins adapting to the Feel Great system.",
    milestones: [
      "Start daily Unimate routine (morning energy boost)",
      "Introduce Balance before your 2 largest meals",
      "Establish consistent 16:8 intermittent fasting window",
      "Track baseline: weight, energy levels, sleep quality",
      "Reduce processed sugar intake by 50%",
      "Walk 20+ minutes daily",
    ],
    outcomes: [
      "Reduced cravings within 7–10 days",
      "Improved morning energy by week 2",
      "Better sleep quality by week 3",
      "Initial weight loss of 2–4 lbs (mostly water/inflammation)",
    ],
  },
  {
    phase: "Phase 2",
    title: "Acceleration",
    days: "Days 31–60",
    color: "from-emerald-500 to-emerald-600",
    icon: Zap,
    description: "Your metabolism is optimizing. Fat burning accelerates and insulin sensitivity improves.",
    milestones: [
      "Extend fasting window to 18:6 (if comfortable)",
      "Add strength training 2–3x per week",
      "Optimize meal composition (protein-first approach)",
      "Monitor blood glucose patterns (optional CGM)",
      "Increase water intake to 2.5L daily",
      "Practice stress management (meditation, breathing)",
    ],
    outcomes: [
      "Noticeable body composition changes",
      "Sustained energy without afternoon crashes",
      "Improved digestion and gut health markers",
      "Total weight loss of 6–12 lbs",
      "Improved HbA1c markers (for prediabetic individuals)",
    ],
  },
  {
    phase: "Phase 3",
    title: "Transformation",
    days: "Days 61–90",
    color: "from-amber-500 to-amber-600",
    icon: Trophy,
    description: "Solidify your new metabolic identity. Results become visible and sustainable.",
    milestones: [
      "Fine-tune nutrition based on body's response",
      "Establish long-term exercise routine",
      "Build social accountability (community/partner)",
      "Set next 90-day goals",
      "Consider advanced testing (lipid panel, insulin levels)",
      "Share your story to inspire others",
    ],
    outcomes: [
      "Total weight loss of 10–20+ lbs",
      "Significantly improved insulin sensitivity",
      "Visible physical transformation",
      "Sustainable habits locked in",
      "Improved mental clarity and focus",
      "Foundation for lifelong metabolic health",
    ],
  },
];

const weeklyFocus = [
  { week: "Week 1–2", focus: "Adaptation", tip: "Focus on consistency, not perfection. Your body is adjusting to new metabolic signals." },
  { week: "Week 3–4", focus: "Momentum", tip: "Cravings diminish significantly. Energy stabilizes. Stay the course." },
  { week: "Week 5–6", focus: "Breakthrough", tip: "Fat burning accelerates. You'll notice clothes fitting differently." },
  { week: "Week 7–8", focus: "Optimization", tip: "Fine-tune your approach based on what's working best for your body." },
  { week: "Week 9–10", focus: "Mastery", tip: "Habits become automatic. Your new lifestyle feels natural." },
  { week: "Week 11–12", focus: "Celebration", tip: "Measure your transformation. Set new goals. Share your success." },
];

export default function JourneyRoadmap() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  useEffect(() => {
    document.title = isAr
      ? "خارطة طريق التحول الصحي في 90 يوماً | رحلة Feel Great"
      : "90-Day Health Transformation Roadmap | Feel Great Journey";
  }, [isAr]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-primary">Feel Great</Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> {isAr ? "الرئيسية" : "Home"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center bg-gradient-to-br from-primary/5 via-white to-emerald-50">
        <div className="container max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
            <Flame className="w-4 h-4" />
            {isAr ? "بروتوكول تحول مدعوم بالعلم" : "Science-Backed Transformation Protocol"}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAr ? <>خارطة طريق تحولك الصحي<br />في 90 يوماً</> : <>Your 90-Day Health<br />Transformation Roadmap</>}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isAr ? "نهج مُهيكل ومُرحّل لعكس الخلل الأيضي واستعادة الطاقة وتحقيق فقدان وزن مستدام — بإرشاد العلم ودعم نظام Feel Great." : "A structured, phased approach to reversing metabolic dysfunction, restoring energy, and achieving sustainable weight loss — guided by science and supported by the Feel Great system."}
          </p>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-12 border-b border-border">
        <div className="container max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Target, label: "3 Phases", desc: "Structured progression" },
              { icon: Brain, label: "90 Days", desc: "Complete transformation" },
              { icon: Heart, label: "Sustainable", desc: "Lifelong results" },
              { icon: Trophy, label: "Proven", desc: "Thousands of success stories" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-bold">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="py-16">
        <div className="container max-w-5xl mx-auto space-y-16">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative">
              {/* Phase Header */}
              <div className={`bg-gradient-to-r ${phase.color} rounded-2xl p-8 text-white mb-8`}>
                <div className="flex items-center gap-4">
                  <phase.icon className="w-10 h-10" />
                  <div>
                    <div className="text-sm opacity-80">{phase.phase} • {phase.days}</div>
                    <h2 className="text-2xl md:text-3xl font-bold">{phase.title}</h2>
                  </div>
                </div>
                <p className="mt-4 text-white/90 max-w-2xl">{phase.description}</p>
              </div>

              {/* Milestones & Outcomes */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    {isAr ? "المعالم الرئيسية" : "Key Milestones"}
                  </h3>
                  <ul className="space-y-3">
                    {phase.milestones.map((m, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                        <span className="text-muted-foreground">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-emerald-600" />
                    {isAr ? "النتائج المتوقعة" : "Expected Outcomes"}
                  </h3>
                  <ul className="space-y-3">
                    {phase.outcomes.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700">{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly Focus */}
      <section className="py-16 bg-slate-50">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">{isAr ? "دليل التركيز الأسبوعي" : "Weekly Focus Guide"}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyFocus.map((w, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-border">
                <div className="text-xs font-medium text-primary mb-1">{w.week}</div>
                <div className="font-bold mb-2">{w.focus}</div>
                <p className="text-sm text-muted-foreground">{w.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{isAr ? "مستعد لبدء تحولك في 90 يوماً؟" : "Ready to Start Your 90-Day Transformation?"}</h2>
          <p className="text-muted-foreground mb-8">
            {isAr ? "انضم لآلاف الأشخاص الذين حوّلوا صحتهم الأيضية بالفعل مع نظام Feel Great." : "Join thousands who have already transformed their metabolic health with the Feel Great system."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 gradient-blue text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
              {isAr ? "ابدأ رحلتك ←" : "Start Your Journey →"}
            </a>
            <Link href="/health-assessment" className="inline-flex items-center gap-2 border border-primary text-primary font-bold px-8 py-3 rounded-full hover:bg-primary/5 transition-colors">
              {isAr ? "خذ التقييم المجاني" : "Take Free Assessment"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Feel Great by Feras Alayed. All rights reserved.</p>
          <p className="mt-2 text-xs">This roadmap is for educational purposes. Individual results may vary. Consult your healthcare provider before starting any health program.</p>
        </div>
      </footer>
    </div>
  );
}
