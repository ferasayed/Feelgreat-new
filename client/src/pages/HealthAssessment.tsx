import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CheckCircle, Heart, Activity, Brain, Scale, Zap, Moon, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "assessment" | "loading" | "results" | "consultation";

interface AssessmentAnswers {
  age: string;
  gender: string;
  primaryGoal: string;
  healthConcerns: string[];
  currentEnergy: string;
  sleepQuality: string;
  stressLevel: string;
  exerciseFrequency: string;
  dietQuality: string;
  previousDiets: string;
}

export default function HealthAssessment() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const [step, setStep] = useState<Step>("assessment");
  const [aiReport, setAiReport] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({
    age: "",
    gender: "",
    primaryGoal: "",
    healthConcerns: [],
    currentEnergy: "",
    sleepQuality: "",
    stressLevel: "",
    exerciseFrequency: "",
    dietQuality: "",
    previousDiets: "",
  });

  useEffect(() => {
    document.title = isAr ? "تقييم صحي مجاني | Feel Great" : "Free Health Assessment | Feel Great";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", isAr
      ? "خذ تقييمنا الصحي المجاني لمدة دقيقتين لاكتشاف درجة صحتك الأيضية والحصول على توصيات مخصصة."
      : "Take our free 2-minute health assessment to discover your metabolic health score and get personalized recommendations for sustainable wellness.");
  }, [isAr]);

  const questions = [
    {
      key: "age",
      question: "What is your age range?",
      options: ["25-34", "35-44", "45-54", "55-64", "65+"],
      icon: Heart,
    },
    {
      key: "gender",
      question: "What is your gender?",
      options: ["Female", "Male", "Prefer not to say"],
      icon: Heart,
    },
    {
      key: "primaryGoal",
      question: "What is your primary health goal?",
      options: [
        "Lose weight sustainably",
        "Manage blood sugar / prediabetes",
        "Increase energy levels",
        "Improve gut health",
        "Better sleep quality",
        "Overall wellness & longevity",
      ],
      icon: Scale,
    },
    {
      key: "currentEnergy",
      question: "How would you rate your daily energy levels?",
      options: ["Very low - exhausted most of the day", "Low - frequent afternoon crashes", "Moderate - some good hours", "Good - mostly energized", "Excellent - consistent energy"],
      icon: Zap,
    },
    {
      key: "sleepQuality",
      question: "How is your sleep quality?",
      options: ["Poor - difficulty falling/staying asleep", "Fair - wake up tired", "Average - could be better", "Good - mostly restful", "Excellent - wake refreshed"],
      icon: Moon,
    },
    {
      key: "stressLevel",
      question: "How would you describe your stress levels?",
      options: ["Overwhelming - constant stress", "High - frequently stressed", "Moderate - manageable", "Low - rarely stressed", "Minimal - very calm"],
      icon: Brain,
    },
    {
      key: "exerciseFrequency",
      question: "How often do you exercise?",
      options: ["Never / rarely", "1-2 times per week", "3-4 times per week", "5+ times per week", "Daily movement + structured exercise"],
      icon: Activity,
    },
    {
      key: "dietQuality",
      question: "How would you describe your current diet?",
      options: [
        "Mostly processed / fast food",
        "Mixed - some healthy, some not",
        "Fairly healthy with occasional indulgences",
        "Very healthy - whole foods focused",
        "Strict health-focused diet",
      ],
      icon: Heart,
    },
    {
      key: "previousDiets",
      question: "How many diets have you tried in the past 5 years?",
      options: ["None", "1-2 diets", "3-5 diets", "6-10 diets", "More than 10"],
      icon: Scale,
    },
  ];

  const registerLead = trpc.leads.register.useMutation();
  const generateReport = trpc.assessment.generateAIReport.useMutation({
    onSuccess: (data) => {
      if (data.success && data.report) {
        setAiReport(data.report);
        setStep("results");
      }
    },
    onError: () => {
      // Fallback to basic results
      setStep("results");
    },
  });

  const handleAnswer = (value: string) => {
    const key = questions[currentQuestion].key as keyof AssessmentAnswers;
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setStep("loading");
      // Generate AI-powered report
      generateReport.mutate({
        answers: updated,
        language: lang,
        source: "health-assessment",
      });
      // Track assessment completion
      registerLead.mutate({
        fullName: "Health Assessment",
        email: "",
        phone: "",
        country: "",
        source: "health-assessment-completion",
      });
    }
  };

  const calculateScore = (): number => {
    let score = 50;
    // Energy
    const energyScores: Record<string, number> = { "Very low - exhausted most of the day": -15, "Low - frequent afternoon crashes": -10, "Moderate - some good hours": 0, "Good - mostly energized": 10, "Excellent - consistent energy": 15 };
    score += energyScores[answers.currentEnergy] || 0;
    // Sleep
    const sleepScores: Record<string, number> = { "Poor - difficulty falling/staying asleep": -15, "Fair - wake up tired": -10, "Average - could be better": 0, "Good - mostly restful": 10, "Excellent - wake refreshed": 15 };
    score += sleepScores[answers.sleepQuality] || 0;
    // Stress
    const stressScores: Record<string, number> = { "Overwhelming - constant stress": -15, "High - frequently stressed": -10, "Moderate - manageable": 0, "Low - rarely stressed": 10, "Minimal - very calm": 15 };
    score += stressScores[answers.stressLevel] || 0;
    // Exercise
    const exerciseScores: Record<string, number> = { "Never / rarely": -10, "1-2 times per week": -5, "3-4 times per week": 5, "5+ times per week": 10, "Daily movement + structured exercise": 15 };
    score += exerciseScores[answers.exerciseFrequency] || 0;
    // Diet
    const dietScores: Record<string, number> = { "Mostly processed / fast food": -15, "Mixed - some healthy, some not": -5, "Fairly healthy with occasional indulgences": 5, "Very healthy - whole foods focused": 10, "Strict health-focused diet": 12 };
    score += dietScores[answers.dietQuality] || 0;
    return Math.max(10, Math.min(100, score));
  };

  const getRecommendations = () => {
    const recs = [];
    if (answers.currentEnergy.includes("low") || answers.currentEnergy.includes("Low")) {
      recs.push({ title: "Energy Restoration Protocol", desc: "Unimate yerba mate provides clean, sustained energy without crashes. Combined with blood sugar stabilization, most people feel a difference within 7 days.", icon: Zap });
    }
    if (answers.sleepQuality.includes("Poor") || answers.sleepQuality.includes("Fair")) {
      recs.push({ title: "Sleep Optimization", desc: "The 4-4-12 eating pattern helps regulate circadian rhythms. No eating 12 hours before breakfast allows deep restorative sleep.", icon: Moon });
    }
    if (answers.primaryGoal.includes("weight") || answers.primaryGoal.includes("Lose")) {
      recs.push({ title: "Sustainable Fat Loss", desc: "Balance fiber matrix before meals reduces glucose spikes by 40%, promoting fat burning. No calorie counting required.", icon: Scale });
    }
    if (answers.primaryGoal.includes("blood sugar") || answers.primaryGoal.includes("prediabetes")) {
      recs.push({ title: "Blood Sugar Management", desc: "Clinical studies show Balance reduces post-meal glucose by 40% and cholesterol by 12%. The 4-4-12 approach improves insulin sensitivity naturally.", icon: Activity });
    }
    if (answers.stressLevel.includes("Overwhelming") || answers.stressLevel.includes("High")) {
      recs.push({ title: "Stress & Cortisol Support", desc: "Chronic stress promotes belly fat and insulin resistance. Our behavioral nutrition approach addresses the root cause, not just symptoms.", icon: Brain });
    }
    if (recs.length === 0) {
      recs.push({ title: "Optimize Your Health", desc: "Even with good baseline health, the Feel Great system can help you reach the next level of energy, body composition, and longevity.", icon: Heart });
    }
    return recs;
  };

  const renderAssessment = () => {
    const q = questions[currentQuestion];
    const Icon = q.icon;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
        {/* Progress bar */}
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-700">
          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
            <p className="text-slate-400 text-sm">{isAr ? `السؤال ${currentQuestion + 1} من ${questions.length}` : `Question ${currentQuestion + 1} of ${questions.length}`}</p>
          </div>

          {/* Question */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{q.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-4 rounded-xl border border-slate-700 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          {/* Back button */}
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="mt-6 text-slate-400 hover:text-white transition-colors text-sm"
            >
              {isAr ? "→ السؤال السابق" : "← Previous question"}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const score = calculateScore();
    const recommendations = getRecommendations();
    const scoreColor = score >= 70 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-400";
    const scoreLabel = score >= 70 ? (isAr ? "جيد" : "Good") : score >= 50 ? (isAr ? "يحتاج تحسين" : "Needs Improvement") : (isAr ? "يحتاج اهتمام" : "Needs Attention");

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
        <div className="container max-w-3xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{isAr ? "نتائج تقييمك الصحي" : "Your Health Assessment Results"}</h1>
            <p className="text-slate-400">{isAr ? "بناءً على إجاباتك، إليك ملفك الصحي المخصص" : "Based on your responses, here's your personalized health profile"}</p>
          </div>

          {/* Score */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center mb-10">
            <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">{isAr ? "درجة صحتك الأيضية" : "Your Metabolic Health Score"}</p>
            <div className={`text-6xl font-bold ${scoreColor} mb-2`}>{score}</div>
            <p className={`text-lg ${scoreColor}`}>{scoreLabel}</p>
            <div className="w-full bg-slate-700 rounded-full h-3 mt-6">
              <div className={`h-3 rounded-full transition-all duration-1000 ${score >= 70 ? "bg-green-400" : score >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${score}%` }} />
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">{isAr ? "توصياتك المخصصة" : "Your Personalized Recommendations"}</h2>
            <div className="space-y-4">
              {recommendations.map((rec, i) => {
                const Icon = rec.icon;
                return (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex gap-4">
                    <div className="w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{rec.title}</h3>
                      <p className="text-slate-400">{rec.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">{isAr ? "مستعد لتحويل صحتك؟" : "Ready to Transform Your Health?"}</h3>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              {isAr ? "بناءً على تقييمك، يمكن لنظام Feel Great مساعدتك في تحقيق تحسينات كبيرة في الطاقة وإدارة الوزن والصحة العامة خلال 30 يوماً." : "Based on your assessment, the Feel Great system can help you achieve significant improvements in energy, weight management, and overall wellness within 30 days."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStep("consultation")}
                className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                {isAr ? "احجز استشارة مجانية" : "Book Free Consultation"} <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://wa.me/96877020770?text=I%20just%20completed%20the%20health%20assessment%20and%20would%20like%20to%20learn%20more%20about%20the%20Feel%20Great%20system"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-green-500 text-green-400 font-bold rounded-xl hover:bg-green-500/10 transition-colors"
              >
                {isAr ? "تحدث عبر واتساب" : "Chat on WhatsApp"}
              </a>
            </div>
          </div>

          {/* Trust elements */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">10,000+</div>
              <div className="text-sm text-slate-400">{isAr ? "شخص تمت مساعدته" : "People Helped"}</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">30+</div>
              <div className="text-sm text-slate-400">{isAr ? "دولة" : "Countries"}</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">15+ yrs</div>
              <div className="text-sm text-slate-400">{isAr ? "سنوات خبرة" : "Experience"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConsultation = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
          <div className="w-16 h-16 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{isAr ? "احجز استشارتك المجانية" : "Book Your Free Consultation"}</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            {isAr ? "تواصل مع فراس العايد، أخصائي التغذية العلاجية والسلوكية، لاستشارة شخصية لمدة 15 دقيقة لمناقشة أهدافك الصحية." : "Connect with Feras Al-Ayed, Therapeutic & Behavioral Nutrition Specialist, for a personalized 15-minute consultation to discuss your health goals."}
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6">What to Expect:</h3>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              <span>Review of your health assessment results</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              <span>Personalized recommendations based on your goals</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              <span>Introduction to the Feel Great system</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
              <span>No pressure, no obligation - just helpful guidance</span>
            </li>
          </ul>

          <div className="space-y-4">
            <a
              href="https://wa.me/96877020770?text=I%20completed%20the%20health%20assessment%20and%20would%20like%20to%20book%20a%20free%20consultation%20with%20Feras"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
            >
              {isAr ? "احجز عبر واتساب" : "Book via WhatsApp"} <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/"
              className="w-full px-8 py-4 border border-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-700/50 transition-colors flex items-center justify-center"
            >
              {isAr ? "العودة للرئيسية" : "Return to Homepage"}
            </Link>
          </div>
        </div>

        {/* Specialist info */}
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">Your consultation will be with:</p>
          <p className="font-semibold text-lg mt-1">Feras Al-Ayed</p>
          <p className="text-amber-400 text-sm">Therapeutic & Behavioral Nutrition Specialist</p>
          <p className="text-slate-500 text-sm">Presidential Sapphire | 15+ Years Experience</p>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center" dir={isAr ? "rtl" : "ltr"}>
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-8"></div>
        <h2 className="text-2xl font-bold mb-3">{isAr ? "جاري تحليل إجاباتك بالذكاء الاصطناعي..." : "AI is analyzing your answers..."}</h2>
        <p className="text-slate-400 max-w-md mx-auto">{isAr ? "نقوم بإنشاء تقرير صحي مخصص لك بناءً على أحدث الأبحاث العلمية" : "Creating your personalized health report based on the latest scientific research"}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: "0.2s"}}></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: "0.4s"}}></div>
        </div>
      </div>
    </div>
  );

  const renderAIResults = () => {
    if (!aiReport) return null;
    const scoreColor = aiReport.score >= 70 ? "text-green-400" : aiReport.score >= 50 ? "text-amber-400" : "text-red-400";
    const riskBg = aiReport.riskLevel === "critical" ? "bg-red-500/10 border-red-500/30" : aiReport.riskLevel === "high" ? "bg-orange-500/10 border-orange-500/30" : aiReport.riskLevel === "moderate" ? "bg-amber-500/10 border-amber-500/30" : "bg-green-500/10 border-green-500/30";

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white" dir={isAr ? "rtl" : "ltr"}>
        <div className="container max-w-3xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <Link href="/" className="text-amber-400 font-bold text-xl mb-8 inline-block">Feel Great</Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{isAr ? "تقريرك الصحي المخصص بالذكاء الاصطناعي" : "Your AI-Powered Health Report"}</h1>
            <p className="text-slate-400">{isAr ? "تم تحليل إجاباتك بواسطة خوارزمية متقدمة مبنية على أحدث الأبحاث" : "Your answers were analyzed by an advanced algorithm based on the latest research"}</p>
          </div>

          {/* Score Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center mb-8">
            <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">{isAr ? "درجة صحتك الأيضية" : "Metabolic Health Score"}</p>
            <div className={`text-7xl font-bold ${scoreColor} mb-2`}>{aiReport.score}</div>
            <p className={`text-lg font-medium ${scoreColor} capitalize`}>{aiReport.riskLevel === "critical" ? (isAr ? "يحتاج تدخل فوري" : "Needs Immediate Action") : aiReport.riskLevel === "high" ? (isAr ? "خطورة عالية" : "High Risk") : aiReport.riskLevel === "moderate" ? (isAr ? "يحتاج تحسين" : "Needs Improvement") : (isAr ? "جيد" : "Good")}</p>
            <div className="w-full bg-slate-700 rounded-full h-3 mt-6">
              <div className={`h-3 rounded-full transition-all duration-1000 ${aiReport.score >= 70 ? "bg-green-400" : aiReport.score >= 50 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${aiReport.score}%` }} />
            </div>
          </div>

          {/* Risk Alerts */}
          {aiReport.topRisks && aiReport.topRisks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                {isAr ? "المخاطر المحددة" : "Identified Risks"}
              </h2>
              <div className="space-y-3">
                {aiReport.topRisks.map((risk: any, i: number) => (
                  <div key={i} className={`p-4 rounded-xl border ${risk.urgency === "immediate" ? "border-red-500/40 bg-red-500/5" : risk.urgency === "soon" ? "border-amber-500/40 bg-amber-500/5" : "border-slate-600 bg-slate-800/30"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{risk.risk}</h3>
                        <p className="text-sm text-slate-400 mt-1">{risk.explanation}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${risk.urgency === "immediate" ? "bg-red-500/20 text-red-300" : risk.urgency === "soon" ? "bg-amber-500/20 text-amber-300" : "bg-slate-600 text-slate-300"}`}>
                        {risk.urgency === "immediate" ? (isAr ? "فوري" : "Urgent") : risk.urgency === "soon" ? (isAr ? "قريباً" : "Soon") : (isAr ? "مراقبة" : "Monitor")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 90-Day Action Plan */}
          {aiReport.actionPlan && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                {isAr ? "خطة العمل لـ 90 يوم" : "Your 90-Day Action Plan"}
              </h2>
              <div className="space-y-4">
                {[aiReport.actionPlan.phase1, aiReport.actionPlan.phase2, aiReport.actionPlan.phase3].map((phase: any, i: number) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400 font-bold text-sm">{i + 1}</div>
                      <h3 className="font-semibold">{phase?.title}</h3>
                    </div>
                    <ul className="space-y-2 ms-11">
                      {phase?.actions?.map((action: string, j: number) => (
                        <li key={j} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {aiReport.products && aiReport.products.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-400" />
                {isAr ? "المنتجات الموصى بها" : "Recommended Products"}
              </h2>
              <div className="space-y-3">
                {aiReport.products.map((product: any, i: number) => (
                  <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-start gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${product.priority === "essential" ? "bg-red-500/20 text-red-300" : product.priority === "recommended" ? "bg-amber-500/20 text-amber-300" : "bg-slate-600 text-slate-300"}`}>
                      {product.priority === "essential" ? (isAr ? "أساسي" : "Essential") : product.priority === "recommended" ? (isAr ? "موصى" : "Recommended") : (isAr ? "اختياري" : "Optional")}
                    </div>
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-slate-400 mt-1">{product.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {aiReport.timeline && aiReport.timeline.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                {isAr ? "الجدول الزمني المتوقع" : "Expected Timeline"}
              </h2>
              <div className="relative">
                <div className="absolute top-0 bottom-0 start-4 w-0.5 bg-amber-400/20"></div>
                <div className="space-y-4">
                  {aiReport.timeline.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 ps-4">
                      <div className="w-3 h-3 bg-amber-400 rounded-full mt-1.5 -ms-[7px] relative z-10"></div>
                      <div>
                        <p className="font-medium text-amber-300">{item.week}</p>
                        <p className="text-sm text-slate-400">{item.expectedChange}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Motivation */}
          {aiReport.motivation && (
            <div className={`${riskBg} border rounded-xl p-6 mb-8 text-center`}>
              <p className="text-lg italic text-slate-200">"{aiReport.motivation}"</p>
            </div>
          )}

          {/* Multi-stage CTA */}
          <div className="bg-gradient-to-r from-amber-400/10 to-amber-500/10 border border-amber-400/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-3">{isAr ? "ابدأ رحلة التحول الآن" : "Start Your Transformation Journey"}</h3>
            <p className="text-slate-300 mb-6 max-w-lg mx-auto">
              {isAr ? "بناءً على تقريرك، يمكن لنظام Feel Great مساعدتك في تحقيق تحسينات ملموسة خلال 90 يوماً." : "Based on your report, the Feel Great system can help you achieve measurable improvements within 90 days."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStep("consultation")}
                className="px-8 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
              >
                {isAr ? "احجز استشارة مجانية" : "Book Free Consultation"} <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="https://wa.me/96877020770?text=I%20just%20completed%20the%20AI%20health%20assessment%20and%20would%20like%20to%20learn%20more"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border border-green-500 text-green-400 font-bold rounded-xl hover:bg-green-500/10 transition-colors"
              >
                {isAr ? "تحدث عبر واتساب" : "Chat on WhatsApp"}
              </a>
            </div>
          </div>

          {/* Trust */}
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">10,000+</div>
              <div className="text-sm text-slate-400">{isAr ? "شخص تمت مساعدته" : "People Helped"}</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">30+</div>
              <div className="text-sm text-slate-400">{isAr ? "دولة" : "Countries"}</div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-amber-400">15+ yrs</div>
              <div className="text-sm text-slate-400">{isAr ? "سنوات خبرة" : "Experience"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {step === "assessment" && renderAssessment()}
      {step === "loading" && renderLoading()}
      {step === "results" && (aiReport ? renderAIResults() : renderResults())}
      {step === "consultation" && renderConsultation()}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Free Health Assessment",
            description: "Take our free 2-minute health assessment to discover your metabolic health score and get personalized recommendations.",
            url: "https://feelgreat.us.com/health-assessment",
            isPartOf: { "@type": "WebSite", name: "Feel Great", url: "https://feelgreat.us.com" },
            author: {
              "@type": "Person",
              name: "Feras Al-Ayed",
              jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
            },
          }),
        }}
      />
    </>
  );
}
