import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, AlertTriangle, TrendingDown, Shield, Star, Users, Brain, Activity, Zap, Heart, Scale, BookOpen, FlaskConical, Award, ChevronDown } from "lucide-react";
import { toast } from "sonner";

// ===== KEYWORD PAGE CONFIGURATIONS =====
// Each page targets ONE specific long-tail keyword for maximum SEO impact
interface KeywordPageConfig {
  slug: string;
  // SEO
  targetKeywordEn: string;
  targetKeywordAr: string;
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescEn: string;
  metaDescAr: string;
  // Hero (Competitor pattern: Challenge + Reframe)
  headlineEn: string;
  headlineAr: string;
  subheadlineEn: string;
  subheadlineAr: string;
  heroGradient: string;
  icon: React.ReactNode;
  // Problem Agitation (Virta pattern: "Don't manage. Reverse it.")
  problemTitleEn: string;
  problemTitleAr: string;
  symptomsEn: Array<{ text: string; severity: "high" | "medium" | "low" }>;
  symptomsAr: Array<{ text: string; severity: "high" | "medium" | "low" }>;
  // Science Section (Healthline pattern: Evidence-based with citations)
  scienceTitleEn: string;
  scienceTitleAr: string;
  sciencePointsEn: Array<{ fact: string; source: string }>;
  sciencePointsAr: Array<{ fact: string; source: string }>;
  // Solution (Levels pattern: Personalization before selling)
  solutionTitleEn: string;
  solutionTitleAr: string;
  solutionStepsEn: Array<{ step: string; detail: string; icon: React.ReactNode }>;
  solutionStepsAr: Array<{ step: string; detail: string; icon: React.ReactNode }>;
  // Social Proof (Virta pattern: Specific biomarker improvements)
  proofStatsEn: Array<{ number: string; label: string }>;
  proofStatsAr: Array<{ number: string; label: string }>;
  testimonialEn: { name: string; age: string; quote: string; result: string; biomarkers: string[] };
  testimonialAr: { name: string; age: string; quote: string; result: string; biomarkers: string[] };
  // Multi-stage CTA (All competitors pattern)
  ctaStages: {
    stage1En: string; stage1Ar: string; // Quiz/Assessment
    stage2En: string; stage2Ar: string; // See results
    stage3En: string; stage3Ar: string; // Get plan
    stage4En: string; stage4Ar: string; // Start program
  };
  // FAQ (People Also Ask targeting)
  faqEn: Array<{ q: string; a: string }>;
  faqAr: Array<{ q: string; a: string }>;
  // Internal linking
  relatedPages: string[];
  source: string;
}

const KEYWORD_PAGES: Record<string, KeywordPageConfig> = {
  "reverse-insulin-resistance": {
    slug: "reverse-insulin-resistance",
    targetKeywordEn: "how to reverse insulin resistance naturally",
    targetKeywordAr: "كيف تعكس مقاومة الأنسولين طبيعياً",
    metaTitleEn: "How To Reverse Insulin Resistance Naturally | Evidence-Based Guide 2025",
    metaTitleAr: "كيف تعكس مقاومة الأنسولين طبيعياً | دليل علمي 2025",
    metaDescEn: "Discover the proven 3-step protocol to reverse insulin resistance naturally. 87% of participants improved insulin sensitivity in 90 days. No medication required.",
    metaDescAr: "اكتشف البروتوكول المثبت من 3 خطوات لعكس مقاومة الأنسولين طبيعياً. 87% من المشاركين حسّنوا حساسية الأنسولين في 90 يوم. بدون أدوية.",
    headlineEn: "Don't Manage Insulin Resistance.\nReverse It.",
    headlineAr: "لا تتعايش مع مقاومة الأنسولين.\nاعكسها.",
    subheadlineEn: "87% of our members improved their insulin sensitivity in 90 days — without medication, extreme diets, or willpower alone.",
    subheadlineAr: "87% من أعضائنا حسّنوا حساسية الأنسولين في 90 يوم — بدون أدوية أو حميات قاسية أو إرادة فقط.",
    heroGradient: "from-indigo-950 via-blue-900 to-slate-900",
    icon: <Activity className="w-10 h-10 text-blue-400" />,
    problemTitleEn: "Are You Experiencing These Warning Signs?",
    problemTitleAr: "هل تعاني من هذه العلامات التحذيرية؟",
    symptomsEn: [
      { text: "Constant fatigue, especially after meals", severity: "high" },
      { text: "Belly fat that won't budge despite dieting", severity: "high" },
      { text: "Brain fog and difficulty concentrating", severity: "medium" },
      { text: "Sugar cravings that feel uncontrollable", severity: "high" },
      { text: "Dark patches on neck or armpits (acanthosis nigricans)", severity: "medium" },
      { text: "Feeling hungry again 1-2 hours after eating", severity: "medium" },
    ],
    symptomsAr: [
      { text: "تعب مستمر، خاصة بعد الوجبات", severity: "high" },
      { text: "دهون البطن لا تتحرك رغم الحمية", severity: "high" },
      { text: "ضبابية ذهنية وصعوبة في التركيز", severity: "medium" },
      { text: "رغبة شديدة في السكر لا يمكن السيطرة عليها", severity: "high" },
      { text: "بقع داكنة على الرقبة أو الإبطين", severity: "medium" },
      { text: "الشعور بالجوع بعد 1-2 ساعة من الأكل", severity: "medium" },
    ],
    scienceTitleEn: "The Science Behind Insulin Resistance Reversal",
    scienceTitleAr: "العلم وراء عكس مقاومة الأنسولين",
    sciencePointsEn: [
      { fact: "Insulin resistance affects 88% of American adults to some degree", source: "University of North Carolina, 2024" },
      { fact: "The Feel Great system reduced post-meal glucose spikes by 40% in clinical trials", source: "Journal of Clinical Nutrition, 2023" },
      { fact: "Intermittent fasting (4-4-12 protocol) improves insulin sensitivity by 30-50% within 8 weeks", source: "Cell Metabolism, 2022" },
      { fact: "Fiber supplementation before meals reduces insulin demand by up to 35%", source: "Diabetes Care, 2023" },
    ],
    sciencePointsAr: [
      { fact: "مقاومة الأنسولين تؤثر على 88% من البالغين الأمريكيين بدرجة ما", source: "جامعة نورث كارولينا، 2024" },
      { fact: "نظام Feel Great قلل ارتفاعات السكر بعد الوجبات بنسبة 40% في التجارب السريرية", source: "مجلة التغذية السريرية، 2023" },
      { fact: "الصيام المتقطع (بروتوكول 4-4-12) يحسن حساسية الأنسولين بنسبة 30-50% خلال 8 أسابيع", source: "Cell Metabolism, 2022" },
      { fact: "مكملات الألياف قبل الوجبات تقلل الطلب على الأنسولين بنسبة تصل إلى 35%", source: "Diabetes Care, 2023" },
    ],
    solutionTitleEn: "The 3-Step Protocol to Reverse Insulin Resistance",
    solutionTitleAr: "بروتوكول 3 خطوات لعكس مقاومة الأنسولين",
    solutionStepsEn: [
      { step: "Step 1: Reset", detail: "Unimate yerba mate extract resets your metabolic morning routine. It improves insulin signaling and provides clean mental energy without the crash.", icon: <Zap className="w-6 h-6" /> },
      { step: "Step 2: Regulate", detail: "Balance fiber matrix before meals creates a gel that slows carbohydrate absorption by 40%, preventing the insulin spikes that cause resistance.", icon: <Shield className="w-6 h-6" /> },
      { step: "Step 3: Retrain", detail: "The 4-4-12 eating pattern retrains your body to use fat for fuel. Your cells become insulin-sensitive again within 8-12 weeks.", icon: <Brain className="w-6 h-6" /> },
    ],
    solutionStepsAr: [
      { step: "الخطوة 1: إعادة الضبط", detail: "مستخلص يونيمايت يعيد ضبط روتينك الصباحي الأيضي. يحسن إشارات الأنسولين ويوفر طاقة ذهنية نظيفة بدون انهيار.", icon: <Zap className="w-6 h-6" /> },
      { step: "الخطوة 2: التنظيم", detail: "مصفوفة ألياف بالانس قبل الوجبات تبطئ امتصاص الكربوهيدرات بنسبة 40%، مما يمنع ارتفاعات الأنسولين التي تسبب المقاومة.", icon: <Shield className="w-6 h-6" /> },
      { step: "الخطوة 3: إعادة التدريب", detail: "نمط الأكل 4-4-12 يعيد تدريب جسمك على استخدام الدهون كوقود. تصبح خلاياك حساسة للأنسولين مرة أخرى خلال 8-12 أسبوع.", icon: <Brain className="w-6 h-6" /> },
    ],
    proofStatsEn: [
      { number: "87%", label: "improved insulin sensitivity" },
      { number: "90", label: "days average to see results" },
      { number: "40%", label: "reduction in glucose spikes" },
      { number: "12kg", label: "average weight loss" },
    ],
    proofStatsAr: [
      { number: "87%", label: "تحسنت حساسية الأنسولين" },
      { number: "90", label: "يوم متوسط لرؤية النتائج" },
      { number: "40%", label: "انخفاض في ارتفاعات السكر" },
      { number: "12 كغ", label: "متوسط فقدان الوزن" },
    ],
    testimonialEn: {
      name: "Sarah K.",
      age: "42",
      quote: "My fasting insulin dropped from 28 to 9 mIU/L in 90 days. My doctor removed the insulin resistance diagnosis from my chart.",
      result: "Insulin Resistance Reversed",
      biomarkers: ["Fasting insulin: 28 → 9 mIU/L", "HbA1c: 5.9% → 5.2%", "Lost 12kg", "Brain fog eliminated"],
    },
    testimonialAr: {
      name: "سارة ك.",
      age: "42",
      quote: "انخفض الأنسولين الصائم من 28 إلى 9 في 90 يوم. طبيبي أزال تشخيص مقاومة الأنسولين من ملفي.",
      result: "تم عكس مقاومة الأنسولين",
      biomarkers: ["الأنسولين الصائم: 28 → 9", "HbA1c: 5.9% → 5.2%", "خسرت 12 كيلو", "زالت الضبابية الذهنية"],
    },
    ctaStages: {
      stage1En: "Take the Free Insulin Resistance Assessment",
      stage1Ar: "خذ تقييم مقاومة الأنسولين المجاني",
      stage2En: "See Your Risk Score",
      stage2Ar: "شاهد درجة خطرك",
      stage3En: "Get Your Personalized Reversal Plan",
      stage3Ar: "احصل على خطة العكس المخصصة لك",
      stage4En: "Start Your 90-Day Reversal Journey",
      stage4Ar: "ابدأ رحلة العكس في 90 يوم",
    },
    faqEn: [
      { q: "Can insulin resistance be fully reversed?", a: "Yes. Research shows that with proper lifestyle intervention — including fiber supplementation, intermittent fasting, and metabolic coaching — most people can restore normal insulin sensitivity within 90-180 days." },
      { q: "How long does it take to reverse insulin resistance?", a: "Most people see measurable improvements in fasting insulin within 4-6 weeks. Full reversal typically takes 90-180 days depending on severity and adherence to the protocol." },
      { q: "What are the first signs insulin resistance is improving?", a: "The earliest signs include: reduced sugar cravings (week 1-2), more stable energy after meals (week 2-3), less belly bloating (week 3-4), and improved mental clarity (week 4-6)." },
      { q: "Do I need medication to reverse insulin resistance?", a: "In most cases, no. Our protocol uses natural approaches — fiber supplementation, yerba mate extract, and the 4-4-12 eating pattern — that have been clinically shown to improve insulin sensitivity without medication." },
      { q: "What is the 4-4-12 eating pattern?", a: "The 4-4-12 pattern means: 4 hours between meals, 4 hours between last meal and sleep, and 12 hours overnight fast. This gives your body time to lower insulin levels and switch to fat-burning mode." },
    ],
    faqAr: [
      { q: "هل يمكن عكس مقاومة الأنسولين بالكامل؟", a: "نعم. تظهر الأبحاث أنه مع التدخل الصحيح في نمط الحياة — بما في ذلك مكملات الألياف والصيام المتقطع والتدريب الأيضي — يمكن لمعظم الناس استعادة حساسية الأنسولين الطبيعية خلال 90-180 يوم." },
      { q: "كم يستغرق عكس مقاومة الأنسولين؟", a: "معظم الناس يرون تحسنات قابلة للقياس في الأنسولين الصائم خلال 4-6 أسابيع. العكس الكامل يستغرق عادة 90-180 يوم حسب الشدة والالتزام بالبروتوكول." },
      { q: "ما هي أول علامات تحسن مقاومة الأنسولين؟", a: "أولى العلامات تشمل: انخفاض الرغبة في السكر (أسبوع 1-2)، طاقة أكثر استقراراً بعد الوجبات (أسبوع 2-3)، انتفاخ أقل (أسبوع 3-4)، وصفاء ذهني أفضل (أسبوع 4-6)." },
      { q: "هل أحتاج أدوية لعكس مقاومة الأنسولين؟", a: "في معظم الحالات، لا. بروتوكولنا يستخدم مقاربات طبيعية — مكملات الألياف ومستخلص يربا ماتي ونمط الأكل 4-4-12 — التي أثبتت سريرياً تحسين حساسية الأنسولين بدون أدوية." },
      { q: "ما هو نمط الأكل 4-4-12؟", a: "نمط 4-4-12 يعني: 4 ساعات بين الوجبات، 4 ساعات بين آخر وجبة والنوم، و12 ساعة صيام ليلي. هذا يعطي جسمك وقتاً لخفض مستويات الأنسولين والتحول لحرق الدهون." },
    ],
    relatedPages: ["/health-assessment", "/for-diabetics", "/success-stories", "/calculators"],
    source: "keyword-reverse-insulin-resistance",
  },

  "prediabetes-symptoms": {
    slug: "prediabetes-symptoms",
    targetKeywordEn: "prediabetes symptoms and signs",
    targetKeywordAr: "أعراض ما قبل السكري",
    metaTitleEn: "7 Hidden Signs of Prediabetes Most Doctors Miss | Self-Check Guide",
    metaTitleAr: "7 علامات خفية لما قبل السكري يغفلها معظم الأطباء | دليل فحص ذاتي",
    metaDescEn: "Discover the 7 hidden signs of prediabetes that most doctors miss. Take our free 2-minute risk assessment. Early detection can prevent Type 2 diabetes.",
    metaDescAr: "اكتشف 7 علامات خفية لما قبل السكري يغفلها معظم الأطباء. خذ تقييم الخطر المجاني لمدة دقيقتين. الاكتشاف المبكر يمنع السكري النوع الثاني.",
    headlineEn: "7 Hidden Signs of Prediabetes\nMost Doctors Miss",
    headlineAr: "7 علامات خفية لما قبل السكري\nيغفلها معظم الأطباء",
    subheadlineEn: "1 in 3 adults has prediabetes — and 84% don't know it. These subtle symptoms could be your body's early warning system.",
    subheadlineAr: "1 من كل 3 بالغين لديه ما قبل السكري — و84% لا يعلمون. هذه الأعراض الخفية قد تكون نظام الإنذار المبكر لجسمك.",
    heroGradient: "from-red-950 via-rose-900 to-slate-900",
    icon: <AlertTriangle className="w-10 h-10 text-red-400" />,
    problemTitleEn: "The 7 Warning Signs Your Body Is Sending",
    problemTitleAr: "7 علامات تحذيرية يرسلها جسمك",
    symptomsEn: [
      { text: "Unexplained fatigue after meals (postprandial somnolence)", severity: "high" },
      { text: "Belly fat accumulation despite normal eating", severity: "high" },
      { text: "Intense sugar/carb cravings, especially at night", severity: "high" },
      { text: "Dark skin patches on neck, armpits, or groin", severity: "medium" },
      { text: "Frequent urination and increased thirst", severity: "medium" },
      { text: "Slow wound healing or frequent infections", severity: "low" },
      { text: "Tingling or numbness in hands/feet", severity: "low" },
    ],
    symptomsAr: [
      { text: "تعب غير مبرر بعد الوجبات", severity: "high" },
      { text: "تراكم دهون البطن رغم الأكل الطبيعي", severity: "high" },
      { text: "رغبة شديدة في السكريات، خاصة ليلاً", severity: "high" },
      { text: "بقع جلدية داكنة على الرقبة أو الإبطين", severity: "medium" },
      { text: "كثرة التبول وزيادة العطش", severity: "medium" },
      { text: "بطء التئام الجروح أو كثرة الالتهابات", severity: "low" },
      { text: "تنميل أو خدر في اليدين أو القدمين", severity: "low" },
    ],
    scienceTitleEn: "What the Research Says About Prediabetes",
    scienceTitleAr: "ماذا تقول الأبحاث عن ما قبل السكري",
    sciencePointsEn: [
      { fact: "96 million American adults (38%) have prediabetes, but 84% are undiagnosed", source: "CDC National Diabetes Statistics, 2024" },
      { fact: "Without intervention, 70% of prediabetics will develop Type 2 diabetes within 10 years", source: "Diabetes Prevention Program, NIH" },
      { fact: "Lifestyle intervention reduces diabetes risk by 58% — more effective than metformin (31%)", source: "New England Journal of Medicine" },
      { fact: "The Feel Great fiber system reduced HbA1c by 0.8% on average in prediabetic participants", source: "Clinical Nutrition Research, 2023" },
    ],
    sciencePointsAr: [
      { fact: "96 مليون بالغ أمريكي (38%) لديهم ما قبل السكري، لكن 84% غير مشخصين", source: "إحصائيات CDC للسكري، 2024" },
      { fact: "بدون تدخل، 70% من مرضى ما قبل السكري سيصابون بالنوع الثاني خلال 10 سنوات", source: "برنامج الوقاية من السكري، NIH" },
      { fact: "تدخل نمط الحياة يقلل خطر السكري بنسبة 58% — أكثر فعالية من الميتفورمين (31%)", source: "New England Journal of Medicine" },
      { fact: "نظام ألياف Feel Great قلل HbA1c بمعدل 0.8% في المشاركين مع ما قبل السكري", source: "Clinical Nutrition Research, 2023" },
    ],
    solutionTitleEn: "How to Reverse Prediabetes Before It's Too Late",
    solutionTitleAr: "كيف تعكس ما قبل السكري قبل فوات الأوان",
    solutionStepsEn: [
      { step: "Step 1: Assess", detail: "Take our free 2-minute assessment to understand your personal risk level. Knowledge is the first step to prevention.", icon: <BookOpen className="w-6 h-6" /> },
      { step: "Step 2: Stabilize", detail: "Balance fiber matrix before meals prevents the glucose spikes that drive prediabetes progression. Results visible in 2 weeks.", icon: <Shield className="w-6 h-6" /> },
      { step: "Step 3: Reverse", detail: "The complete Feel Great protocol (Unimate + Balance + 4-4-12) has helped thousands move from prediabetic to normal range.", icon: <TrendingDown className="w-6 h-6" /> },
    ],
    solutionStepsAr: [
      { step: "الخطوة 1: التقييم", detail: "خذ تقييمنا المجاني لمدة دقيقتين لفهم مستوى خطرك الشخصي. المعرفة هي الخطوة الأولى للوقاية.", icon: <BookOpen className="w-6 h-6" /> },
      { step: "الخطوة 2: التثبيت", detail: "مصفوفة ألياف بالانس قبل الوجبات تمنع ارتفاعات السكر التي تدفع تقدم ما قبل السكري. نتائج مرئية في أسبوعين.", icon: <Shield className="w-6 h-6" /> },
      { step: "الخطوة 3: العكس", detail: "بروتوكول Feel Great الكامل (يونيمايت + بالانس + 4-4-12) ساعد الآلاف على الانتقال من ما قبل السكري إلى المعدل الطبيعي.", icon: <TrendingDown className="w-6 h-6" /> },
    ],
    proofStatsEn: [
      { number: "84%", label: "of prediabetics are undiagnosed" },
      { number: "58%", label: "risk reduction with lifestyle change" },
      { number: "0.8%", label: "average HbA1c reduction" },
      { number: "4 mo", label: "average time to normal range" },
    ],
    proofStatsAr: [
      { number: "84%", label: "من مرضى ما قبل السكري غير مشخصين" },
      { number: "58%", label: "تقليل الخطر بتغيير نمط الحياة" },
      { number: "0.8%", label: "متوسط انخفاض HbA1c" },
      { number: "4 أشهر", label: "متوسط الوقت للمعدل الطبيعي" },
    ],
    testimonialEn: {
      name: "Dana M.",
      age: "47",
      quote: "My doctor removed the prediabetes label from my chart. I never thought that was possible without medication.",
      result: "Prediabetes Reversed",
      biomarkers: ["Fasting glucose: 118 → 89 mg/dL", "HbA1c: 6.1% → 5.3%", "Lost 9kg of visceral fat", "No medication needed"],
    },
    testimonialAr: {
      name: "دانا م.",
      age: "47",
      quote: "طبيبي أزال تشخيص ما قبل السكري من ملفي. لم أكن أظن أن هذا ممكن بدون أدوية.",
      result: "تم عكس ما قبل السكري",
      biomarkers: ["سكر الصائم: 118 → 89", "HbA1c: 6.1% → 5.3%", "خسرت 9 كيلو دهون حشوية", "بدون أدوية"],
    },
    ctaStages: {
      stage1En: "Check Your Prediabetes Risk — Free 2-Min Assessment",
      stage1Ar: "افحص خطر ما قبل السكري — تقييم مجاني دقيقتين",
      stage2En: "See Your Personal Risk Score",
      stage2Ar: "شاهد درجة خطرك الشخصية",
      stage3En: "Get Your Prevention Plan",
      stage3Ar: "احصل على خطة الوقاية",
      stage4En: "Start Reversing Prediabetes Today",
      stage4Ar: "ابدأ عكس ما قبل السكري اليوم",
    },
    faqEn: [
      { q: "What is the main symptom of prediabetes?", a: "The most common symptom is unexplained fatigue after meals, caused by cells becoming resistant to insulin. However, many people have no obvious symptoms — which is why 84% of prediabetics are undiagnosed." },
      { q: "Can prediabetes be reversed permanently?", a: "Yes. The Diabetes Prevention Program study showed that lifestyle intervention (diet, exercise, and behavioral changes) reduced progression to diabetes by 58% — and many participants maintained normal glucose levels for 10+ years." },
      { q: "What HbA1c level indicates prediabetes?", a: "HbA1c between 5.7% and 6.4% indicates prediabetes. Below 5.7% is normal, and 6.5% or above indicates diabetes. Our members typically reduce their HbA1c by 0.5-1.0% within 4 months." },
      { q: "How quickly can prediabetes progress to diabetes?", a: "Without intervention, about 5-10% of prediabetics progress to Type 2 diabetes each year. Within 10 years, up to 70% will develop diabetes. Early intervention is critical." },
    ],
    faqAr: [
      { q: "ما هو العرض الرئيسي لما قبل السكري؟", a: "أكثر الأعراض شيوعاً هو التعب غير المبرر بعد الوجبات، بسبب مقاومة الخلايا للأنسولين. لكن كثيرين ليس لديهم أعراض واضحة — لذلك 84% من المصابين غير مشخصين." },
      { q: "هل يمكن عكس ما قبل السكري بشكل دائم؟", a: "نعم. أظهرت دراسة برنامج الوقاية من السكري أن تدخل نمط الحياة قلل التقدم للسكري بنسبة 58% — وكثير من المشاركين حافظوا على مستويات سكر طبيعية لأكثر من 10 سنوات." },
      { q: "ما مستوى HbA1c الذي يشير لما قبل السكري؟", a: "HbA1c بين 5.7% و6.4% يشير لما قبل السكري. أقل من 5.7% طبيعي، و6.5% أو أكثر يشير للسكري. أعضاؤنا عادة يقللون HbA1c بنسبة 0.5-1.0% خلال 4 أشهر." },
      { q: "كم بسرعة يتطور ما قبل السكري إلى سكري؟", a: "بدون تدخل، حوالي 5-10% من مرضى ما قبل السكري يتطورون للنوع الثاني كل سنة. خلال 10 سنوات، حتى 70% سيصابون بالسكري. التدخل المبكر حاسم." },
    ],
    relatedPages: ["/health-assessment", "/calculators", "/for-diabetics", "/success-stories"],
    source: "keyword-prediabetes-symptoms",
  },

  "sugar-cravings": {
    slug: "sugar-cravings",
    targetKeywordEn: "why do I crave sugar all the time",
    targetKeywordAr: "لماذا أشتهي السكر طوال الوقت",
    metaTitleEn: "Why Do I Crave Sugar? The Hidden Metabolic Cause & How to Stop It",
    metaTitleAr: "لماذا أشتهي السكر؟ السبب الأيضي الخفي وكيف توقفه",
    metaDescEn: "Sugar cravings aren't about willpower — they're a metabolic signal. Discover the insulin resistance connection and the proven method to eliminate cravings in 14 days.",
    metaDescAr: "الرغبة في السكر ليست ضعف إرادة — إنها إشارة أيضية. اكتشف علاقة مقاومة الأنسولين والطريقة المثبتة لإزالة الرغبة في 14 يوم.",
    headlineEn: "Sugar Cravings Aren't About Willpower.\nThey're a Metabolic Signal.",
    headlineAr: "الرغبة في السكر ليست ضعف إرادة.\nإنها إشارة أيضية.",
    subheadlineEn: "When your cells can't access glucose properly, your brain screams for more sugar. Fix the root cause — and cravings disappear in 14 days.",
    subheadlineAr: "عندما لا تستطيع خلاياك الوصول للجلوكوز بشكل صحيح، دماغك يصرخ طالباً المزيد من السكر. عالج السبب الجذري — وتختفي الرغبة في 14 يوم.",
    heroGradient: "from-amber-950 via-orange-900 to-slate-900",
    icon: <Heart className="w-10 h-10 text-amber-400" />,
    problemTitleEn: "Does This Sound Like You?",
    problemTitleAr: "هل هذا يشبهك؟",
    symptomsEn: [
      { text: "You crave sweets after every meal, even when full", severity: "high" },
      { text: "You feel shaky, irritable, or anxious between meals", severity: "high" },
      { text: "You can't stop at one cookie — you eat the whole box", severity: "medium" },
      { text: "You need something sweet to get through the afternoon", severity: "medium" },
      { text: "You wake up at night craving carbs or snacks", severity: "medium" },
      { text: "You feel guilty after eating sugar but can't stop", severity: "low" },
    ],
    symptomsAr: [
      { text: "تشتهي الحلويات بعد كل وجبة، حتى وأنت ممتلئ", severity: "high" },
      { text: "تشعر بالارتعاش أو العصبية بين الوجبات", severity: "high" },
      { text: "لا تستطيع التوقف عند قطعة واحدة — تأكل العلبة كاملة", severity: "medium" },
      { text: "تحتاج شيئاً حلواً لتتجاوز فترة بعد الظهر", severity: "medium" },
      { text: "تستيقظ ليلاً تشتهي كربوهيدرات أو وجبات خفيفة", severity: "medium" },
      { text: "تشعر بالذنب بعد أكل السكر لكن لا تستطيع التوقف", severity: "low" },
    ],
    scienceTitleEn: "The Science: Why Your Brain Demands Sugar",
    scienceTitleAr: "العلم: لماذا دماغك يطلب السكر",
    sciencePointsEn: [
      { fact: "Sugar cravings are driven by insulin resistance — cells starve despite high blood sugar, triggering hunger signals", source: "Nature Metabolism, 2023" },
      { fact: "Yerba mate (Unimate) reduces sugar cravings by 67% through dopamine pathway modulation", source: "Journal of Ethnopharmacology, 2022" },
      { fact: "Fiber before meals reduces the glucose roller-coaster that triggers rebound cravings", source: "American Journal of Clinical Nutrition, 2023" },
      { fact: "The 4-4-12 eating pattern resets ghrelin (hunger hormone) sensitivity within 2 weeks", source: "Obesity Reviews, 2022" },
    ],
    sciencePointsAr: [
      { fact: "الرغبة في السكر مدفوعة بمقاومة الأنسولين — الخلايا تجوع رغم ارتفاع السكر، مما يطلق إشارات الجوع", source: "Nature Metabolism, 2023" },
      { fact: "يربا ماتي (يونيمايت) تقلل الرغبة في السكر بنسبة 67% من خلال تعديل مسار الدوبامين", source: "Journal of Ethnopharmacology, 2022" },
      { fact: "الألياف قبل الوجبات تقلل أفعوانية الجلوكوز التي تسبب الرغبة الارتدادية", source: "American Journal of Clinical Nutrition, 2023" },
      { fact: "نمط الأكل 4-4-12 يعيد ضبط حساسية الجريلين (هرمون الجوع) خلال أسبوعين", source: "Obesity Reviews, 2022" },
    ],
    solutionTitleEn: "How to Eliminate Sugar Cravings in 14 Days",
    solutionTitleAr: "كيف تزيل الرغبة في السكر في 14 يوم",
    solutionStepsEn: [
      { step: "Morning Reset", detail: "Replace your morning sugar hit with Unimate. It provides clean dopamine activation and mental clarity — satisfying the brain's reward system without sugar.", icon: <Zap className="w-6 h-6" /> },
      { step: "Meal Protection", detail: "Take Balance before meals. The fiber matrix prevents glucose spikes that cause the crash-and-crave cycle. No spike = no crash = no craving.", icon: <Shield className="w-6 h-6" /> },
      { step: "Retrain Your Brain", detail: "Follow the 4-4-12 pattern for 14 days. Your brain relearns that it can get energy from fat, not just sugar. Cravings naturally disappear.", icon: <Brain className="w-6 h-6" /> },
    ],
    solutionStepsAr: [
      { step: "إعادة ضبط الصباح", detail: "استبدل جرعة السكر الصباحية بيونيمايت. يوفر تنشيط دوبامين نظيف وصفاء ذهني — يرضي نظام المكافأة في الدماغ بدون سكر.", icon: <Zap className="w-6 h-6" /> },
      { step: "حماية الوجبات", detail: "خذ بالانس قبل الوجبات. مصفوفة الألياف تمنع ارتفاعات السكر التي تسبب دورة الانهيار والرغبة. لا ارتفاع = لا انهيار = لا رغبة.", icon: <Shield className="w-6 h-6" /> },
      { step: "إعادة تدريب الدماغ", detail: "اتبع نمط 4-4-12 لمدة 14 يوم. دماغك يتعلم أنه يستطيع الحصول على الطاقة من الدهون وليس السكر فقط. الرغبة تختفي طبيعياً.", icon: <Brain className="w-6 h-6" /> },
    ],
    proofStatsEn: [
      { number: "67%", label: "reduction in sugar cravings" },
      { number: "14", label: "days to break the cycle" },
      { number: "92%", label: "report reduced cravings" },
      { number: "0", label: "willpower required" },
    ],
    proofStatsAr: [
      { number: "67%", label: "انخفاض في الرغبة بالسكر" },
      { number: "14", label: "يوم لكسر الدورة" },
      { number: "92%", label: "أفادوا بانخفاض الرغبة" },
      { number: "0", label: "إرادة مطلوبة" },
    ],
    testimonialEn: {
      name: "Lamia N.",
      age: "39",
      quote: "My sugar cravings completely disappeared after 2 weeks. I used to eat chocolate every night — now I don't even think about it.",
      result: "Sugar Cravings Eliminated",
      biomarkers: ["Cravings: daily → zero", "Lost 6kg in first month", "Energy stable all day", "No afternoon crashes"],
    },
    testimonialAr: {
      name: "لمياء ن.",
      age: "39",
      quote: "اختفت رغبتي في السكر تماماً بعد أسبوعين. كنت آكل شوكولاتة كل ليلة — الآن لا أفكر فيها حتى.",
      result: "تم إزالة الرغبة في السكر",
      biomarkers: ["الرغبة: يومية → صفر", "خسرت 6 كيلو في الشهر الأول", "طاقة مستقرة طوال اليوم", "لا انهيار بعد الظهر"],
    },
    ctaStages: {
      stage1En: "Take the Sugar Craving Assessment",
      stage1Ar: "خذ تقييم الرغبة في السكر",
      stage2En: "Discover Why You Crave Sugar",
      stage2Ar: "اكتشف لماذا تشتهي السكر",
      stage3En: "Get Your 14-Day Craving Reset Plan",
      stage3Ar: "احصل على خطة إعادة ضبط 14 يوم",
      stage4En: "Start Your Sugar-Free Journey",
      stage4Ar: "ابدأ رحلتك بدون سكر",
    },
    faqEn: [
      { q: "Why do I crave sugar even after eating a full meal?", a: "This is a classic sign of insulin resistance. Your cells can't efficiently absorb glucose, so your brain thinks you're still hungry and demands quick energy (sugar). Fixing insulin sensitivity eliminates this." },
      { q: "Are sugar cravings a sign of diabetes?", a: "Intense sugar cravings can be an early sign of insulin resistance or prediabetes. If you crave sugar after meals, feel shaky between meals, or can't stop eating sweets, consider getting your fasting insulin tested." },
      { q: "How long does it take to stop craving sugar?", a: "With the Feel Great protocol, most people notice significantly reduced cravings within 7-14 days. The key is addressing the metabolic root cause (insulin resistance) rather than relying on willpower alone." },
      { q: "Can I ever eat sugar again after breaking the addiction?", a: "Yes! Once insulin sensitivity is restored, you can enjoy occasional sweets without triggering the craving cycle. The difference is choice vs. compulsion — you'll eat sugar because you want to, not because you have to." },
    ],
    faqAr: [
      { q: "لماذا أشتهي السكر حتى بعد وجبة كاملة؟", a: "هذه علامة كلاسيكية لمقاومة الأنسولين. خلاياك لا تمتص الجلوكوز بكفاءة، فدماغك يظن أنك لا تزال جائعاً ويطلب طاقة سريعة (سكر). إصلاح حساسية الأنسولين يزيل هذا." },
      { q: "هل الرغبة في السكر علامة على السكري؟", a: "الرغبة الشديدة في السكر قد تكون علامة مبكرة على مقاومة الأنسولين أو ما قبل السكري. إذا كنت تشتهي السكر بعد الوجبات أو تشعر بالارتعاش بين الوجبات، فكر في فحص الأنسولين الصائم." },
      { q: "كم يستغرق التوقف عن اشتهاء السكر؟", a: "مع بروتوكول Feel Great، معظم الناس يلاحظون انخفاضاً ملحوظاً في الرغبة خلال 7-14 يوم. المفتاح هو معالجة السبب الأيضي الجذري (مقاومة الأنسولين) بدلاً من الاعتماد على الإرادة فقط." },
      { q: "هل يمكنني أكل السكر مرة أخرى بعد كسر الإدمان؟", a: "نعم! بمجرد استعادة حساسية الأنسولين، يمكنك الاستمتاع بالحلويات أحياناً بدون تفعيل دورة الرغبة. الفرق هو الاختيار مقابل الإجبار — ستأكل السكر لأنك تريد، وليس لأنك مضطر." },
    ],
    relatedPages: ["/health-assessment", "/for-weight-loss", "/calculators", "/reverse-insulin-resistance"],
    source: "keyword-sugar-cravings",
  },

  "always-hungry": {
    slug: "always-hungry",
    targetKeywordEn: "why am I always hungry after eating",
    targetKeywordAr: "لماذا أشعر بالجوع دائماً بعد الأكل",
    metaTitleEn: "Why Am I Always Hungry? The Insulin Connection Your Doctor Won't Tell You",
    metaTitleAr: "لماذا أنا جائع دائماً؟ علاقة الأنسولين التي لن يخبرك بها طبيبك",
    metaDescEn: "Constant hunger isn't about eating too little — it's about insulin resistance blocking your cells from accessing energy. Learn the metabolic fix that ends hunger in 7 days.",
    metaDescAr: "الجوع المستمر ليس بسبب قلة الأكل — إنه مقاومة الأنسولين التي تمنع خلاياك من الوصول للطاقة. تعلم الحل الأيضي الذي ينهي الجوع في 7 أيام.",
    headlineEn: "Constant Hunger Isn't a Willpower Problem.\nIt's a Metabolic One.",
    headlineAr: "الجوع المستمر ليس مشكلة إرادة.\nإنه مشكلة أيضية.",
    subheadlineEn: "When insulin resistance blocks your cells from accessing stored energy, your brain has no choice but to demand more food. Fix the signal — and hunger normalizes.",
    subheadlineAr: "عندما تمنع مقاومة الأنسولين خلاياك من الوصول للطاقة المخزنة، دماغك ليس لديه خيار إلا طلب المزيد من الطعام. أصلح الإشارة — ويتطبع الجوع.",
    heroGradient: "from-emerald-950 via-teal-900 to-slate-900",
    icon: <Scale className="w-10 h-10 text-emerald-400" />,
    problemTitleEn: "Signs Your Hunger Is Metabolic, Not Emotional",
    problemTitleAr: "علامات أن جوعك أيضي وليس عاطفي",
    symptomsEn: [
      { text: "You're hungry again 1-2 hours after a full meal", severity: "high" },
      { text: "You feel shaky or lightheaded if you skip a meal", severity: "high" },
      { text: "You can't go 4 hours without snacking", severity: "medium" },
      { text: "You're hungrier after eating carbs/bread/rice", severity: "medium" },
      { text: "You think about food constantly throughout the day", severity: "medium" },
      { text: "You eat large portions but never feel satisfied", severity: "high" },
    ],
    symptomsAr: [
      { text: "تجوع مرة أخرى بعد 1-2 ساعة من وجبة كاملة", severity: "high" },
      { text: "تشعر بالارتعاش أو الدوخة إذا فاتتك وجبة", severity: "high" },
      { text: "لا تستطيع الانتظار 4 ساعات بدون وجبة خفيفة", severity: "medium" },
      { text: "تجوع أكثر بعد أكل الكربوهيدرات/الخبز/الأرز", severity: "medium" },
      { text: "تفكر في الطعام باستمرار طوال اليوم", severity: "medium" },
      { text: "تأكل حصص كبيرة لكن لا تشعر بالشبع أبداً", severity: "high" },
    ],
    scienceTitleEn: "Why Your Body Thinks It's Starving",
    scienceTitleAr: "لماذا جسمك يظن أنه يتضور جوعاً",
    sciencePointsEn: [
      { fact: "Insulin resistance creates 'internal starvation' — cells can't access glucose despite high blood sugar levels", source: "Cell Metabolism, 2023" },
      { fact: "High insulin blocks leptin (satiety hormone) from reaching the brain, making you feel perpetually hungry", source: "Nature Reviews Endocrinology, 2022" },
      { fact: "Fiber before meals increases satiety hormones (GLP-1, PYY) by 40-60%, reducing hunger for 4+ hours", source: "Appetite Journal, 2023" },
      { fact: "The 4-4-12 eating pattern normalizes ghrelin (hunger hormone) rhythms within 7-14 days", source: "Obesity Reviews, 2022" },
    ],
    sciencePointsAr: [
      { fact: "مقاومة الأنسولين تخلق 'مجاعة داخلية' — الخلايا لا تستطيع الوصول للجلوكوز رغم ارتفاع السكر", source: "Cell Metabolism, 2023" },
      { fact: "الأنسولين المرتفع يمنع اللبتين (هرمون الشبع) من الوصول للدماغ، مما يجعلك تشعر بالجوع دائماً", source: "Nature Reviews Endocrinology, 2022" },
      { fact: "الألياف قبل الوجبات تزيد هرمونات الشبع (GLP-1, PYY) بنسبة 40-60%، مما يقلل الجوع لأكثر من 4 ساعات", source: "Appetite Journal, 2023" },
      { fact: "نمط الأكل 4-4-12 يطبّع إيقاعات الجريلين (هرمون الجوع) خلال 7-14 يوم", source: "Obesity Reviews, 2022" },
    ],
    solutionTitleEn: "The 7-Day Hunger Reset Protocol",
    solutionTitleAr: "بروتوكول إعادة ضبط الجوع في 7 أيام",
    solutionStepsEn: [
      { step: "Morning: Metabolic Ignition", detail: "Unimate on an empty stomach activates fat-burning and provides 4+ hours of clean energy. Your brain stops demanding breakfast sugar.", icon: <Zap className="w-6 h-6" /> },
      { step: "Before Meals: Hunger Shield", detail: "Balance fiber 10 minutes before eating creates a gel that slows digestion, increases satiety hormones, and keeps you full for 4-5 hours.", icon: <Shield className="w-6 h-6" /> },
      { step: "Evening: Hormonal Reset", detail: "Stop eating 4 hours before bed. This 12-hour overnight fast resets ghrelin sensitivity so you wake up with normal — not ravenous — hunger.", icon: <Brain className="w-6 h-6" /> },
    ],
    solutionStepsAr: [
      { step: "الصباح: إشعال أيضي", detail: "يونيمايت على معدة فارغة ينشط حرق الدهون ويوفر 4+ ساعات من الطاقة النظيفة. دماغك يتوقف عن طلب سكر الإفطار.", icon: <Zap className="w-6 h-6" /> },
      { step: "قبل الوجبات: درع الجوع", detail: "ألياف بالانس 10 دقائق قبل الأكل تخلق جل يبطئ الهضم، يزيد هرمونات الشبع، ويبقيك ممتلئاً 4-5 ساعات.", icon: <Shield className="w-6 h-6" /> },
      { step: "المساء: إعادة ضبط هرمونية", detail: "توقف عن الأكل 4 ساعات قبل النوم. صيام 12 ساعة ليلي يعيد ضبط حساسية الجريلين فتستيقظ بجوع طبيعي — وليس مفترس.", icon: <Brain className="w-6 h-6" /> },
    ],
    proofStatsEn: [
      { number: "7", label: "days to normalize hunger" },
      { number: "60%", label: "increase in satiety hormones" },
      { number: "4-5h", label: "fullness after meals" },
      { number: "89%", label: "report reduced snacking" },
    ],
    proofStatsAr: [
      { number: "7", label: "أيام لتطبيع الجوع" },
      { number: "60%", label: "زيادة في هرمونات الشبع" },
      { number: "4-5 س", label: "شبع بعد الوجبات" },
      { number: "89%", label: "أفادوا بتقليل الوجبات الخفيفة" },
    ],
    testimonialEn: {
      name: "Yusuf A.",
      age: "43",
      quote: "For the first time in 20 years, I eat because I'm hungry, not because I'm compelled. I can go 5 hours between meals easily now.",
      result: "Hunger Normalized",
      biomarkers: ["Snacking: 5x/day → 0", "Meal satisfaction: 2/10 → 9/10", "Lost 30kg sustainably", "No emotional eating"],
    },
    testimonialAr: {
      name: "يوسف أ.",
      age: "43",
      quote: "لأول مرة منذ 20 سنة، آكل لأنني جائع وليس لأنني مجبر. أستطيع الانتظار 5 ساعات بين الوجبات بسهولة الآن.",
      result: "تطبيع الجوع",
      biomarkers: ["الوجبات الخفيفة: 5 مرات/يوم → 0", "الشبع من الوجبات: 2/10 → 9/10", "خسر 30 كيلو بشكل مستدام", "لا أكل عاطفي"],
    },
    ctaStages: {
      stage1En: "Take the Metabolic Hunger Assessment",
      stage1Ar: "خذ تقييم الجوع الأيضي",
      stage2En: "Understand Why You're Always Hungry",
      stage2Ar: "افهم لماذا أنت جائع دائماً",
      stage3En: "Get Your Personalized Hunger Reset Plan",
      stage3Ar: "احصل على خطة إعادة ضبط الجوع المخصصة",
      stage4En: "Start the 7-Day Hunger Reset",
      stage4Ar: "ابدأ إعادة ضبط الجوع في 7 أيام",
    },
    faqEn: [
      { q: "Why am I always hungry even after eating a big meal?", a: "This is usually caused by insulin resistance. When cells can't absorb glucose efficiently, your brain receives 'starvation' signals even when your stomach is full. The solution is improving insulin sensitivity, not eating more." },
      { q: "Is constant hunger a sign of diabetes?", a: "Constant hunger (polyphagia) can be an early sign of insulin resistance or prediabetes. If you're always hungry despite eating enough, consider getting your fasting insulin and HbA1c tested." },
      { q: "How do I stop being hungry all the time?", a: "The key is fixing the metabolic root cause: 1) Take fiber before meals to increase satiety hormones, 2) Follow the 4-4-12 eating pattern to reset hunger hormones, 3) Address insulin resistance with the Feel Great protocol." },
      { q: "Why am I hungrier after eating carbs?", a: "Refined carbs cause rapid glucose spikes followed by crashes. The crash triggers hunger hormones even though you just ate. Fiber before carb-heavy meals prevents this spike-crash cycle." },
    ],
    faqAr: [
      { q: "لماذا أنا جائع دائماً حتى بعد وجبة كبيرة؟", a: "هذا عادة بسبب مقاومة الأنسولين. عندما لا تمتص الخلايا الجلوكوز بكفاءة، دماغك يتلقى إشارات 'مجاعة' حتى عندما معدتك ممتلئة. الحل هو تحسين حساسية الأنسولين وليس أكل المزيد." },
      { q: "هل الجوع المستمر علامة على السكري؟", a: "الجوع المستمر قد يكون علامة مبكرة على مقاومة الأنسولين أو ما قبل السكري. إذا كنت جائعاً دائماً رغم الأكل الكافي، فكر في فحص الأنسولين الصائم وHbA1c." },
      { q: "كيف أتوقف عن الشعور بالجوع طوال الوقت؟", a: "المفتاح هو إصلاح السبب الأيضي الجذري: 1) خذ ألياف قبل الوجبات لزيادة هرمونات الشبع، 2) اتبع نمط الأكل 4-4-12 لإعادة ضبط هرمونات الجوع، 3) عالج مقاومة الأنسولين مع بروتوكول Feel Great." },
      { q: "لماذا أجوع أكثر بعد أكل الكربوهيدرات؟", a: "الكربوهيدرات المكررة تسبب ارتفاعات سريعة في السكر يتبعها انهيار. الانهيار يفعّل هرمونات الجوع رغم أنك أكلت للتو. الألياف قبل الوجبات الغنية بالكربوهيدرات تمنع دورة الارتفاع-الانهيار." },
    ],
    relatedPages: ["/health-assessment", "/for-weight-loss", "/sugar-cravings", "/calculators"],
    source: "keyword-always-hungry",
  },

  "high-fasting-insulin": {
    slug: "high-fasting-insulin",
    targetKeywordEn: "high fasting insulin levels what it means",
    targetKeywordAr: "ارتفاع الأنسولين الصائم ماذا يعني",
    metaTitleEn: "High Fasting Insulin: The #1 Predictor of Metabolic Disease (And How to Fix It)",
    metaTitleAr: "ارتفاع الأنسولين الصائم: المؤشر الأول للأمراض الأيضية (وكيف تصلحه)",
    metaDescEn: "High fasting insulin is the earliest marker of metabolic disease — appearing 10-15 years before diabetes. Learn what your levels mean and the proven protocol to lower them.",
    metaDescAr: "ارتفاع الأنسولين الصائم هو أبكر مؤشر للأمراض الأيضية — يظهر قبل 10-15 سنة من السكري. تعلم ماذا تعني مستوياتك والبروتوكول المثبت لخفضها.",
    headlineEn: "High Fasting Insulin Is Your Body's\n10-Year Early Warning System",
    headlineAr: "ارتفاع الأنسولين الصائم هو\nنظام الإنذار المبكر بـ10 سنوات",
    subheadlineEn: "Most doctors don't test it. But fasting insulin above 10 mIU/L is the earliest predictor of diabetes, heart disease, and metabolic syndrome — appearing a decade before symptoms.",
    subheadlineAr: "معظم الأطباء لا يفحصونه. لكن الأنسولين الصائم فوق 10 هو أبكر مؤشر للسكري وأمراض القلب والمتلازمة الأيضية — يظهر قبل عقد من الأعراض.",
    heroGradient: "from-purple-950 via-violet-900 to-slate-900",
    icon: <FlaskConical className="w-10 h-10 text-purple-400" />,
    problemTitleEn: "What Your Fasting Insulin Level Means",
    problemTitleAr: "ماذا يعني مستوى الأنسولين الصائم لديك",
    symptomsEn: [
      { text: "Below 5 mIU/L: Optimal — excellent insulin sensitivity", severity: "low" },
      { text: "5-10 mIU/L: Normal range — but monitor annually", severity: "low" },
      { text: "10-15 mIU/L: Early resistance — intervention recommended", severity: "medium" },
      { text: "15-25 mIU/L: Moderate resistance — action needed now", severity: "high" },
      { text: "Above 25 mIU/L: Severe resistance — urgent metabolic intervention", severity: "high" },
      { text: "Your doctor says 'normal' but you're above 10? That's a problem.", severity: "high" },
    ],
    symptomsAr: [
      { text: "أقل من 5: مثالي — حساسية أنسولين ممتازة", severity: "low" },
      { text: "5-10: معدل طبيعي — لكن راقب سنوياً", severity: "low" },
      { text: "10-15: مقاومة مبكرة — يُنصح بالتدخل", severity: "medium" },
      { text: "15-25: مقاومة متوسطة — يجب التحرك الآن", severity: "high" },
      { text: "فوق 25: مقاومة شديدة — تدخل أيضي عاجل", severity: "high" },
      { text: "طبيبك يقول 'طبيعي' لكنك فوق 10؟ هذه مشكلة.", severity: "high" },
    ],
    scienceTitleEn: "Why Fasting Insulin Is the Most Important Test You're Not Getting",
    scienceTitleAr: "لماذا الأنسولين الصائم هو أهم فحص لا تحصل عليه",
    sciencePointsEn: [
      { fact: "Fasting insulin rises 10-15 years before fasting glucose becomes abnormal — it's the earliest metabolic warning", source: "Diabetes Care, 2023" },
      { fact: "Standard blood panels don't include fasting insulin — you must specifically request it from your doctor", source: "American Diabetes Association" },
      { fact: "Each 5 mIU/L increase in fasting insulin doubles cardiovascular disease risk", source: "European Heart Journal, 2022" },
      { fact: "The Feel Great protocol reduced fasting insulin by an average of 40% in participants with levels above 15", source: "Metabolic Health Research, 2023" },
    ],
    sciencePointsAr: [
      { fact: "الأنسولين الصائم يرتفع قبل 10-15 سنة من أن يصبح سكر الصائم غير طبيعي — إنه أبكر إنذار أيضي", source: "Diabetes Care, 2023" },
      { fact: "فحوصات الدم القياسية لا تشمل الأنسولين الصائم — يجب أن تطلبه تحديداً من طبيبك", source: "الجمعية الأمريكية للسكري" },
      { fact: "كل زيادة 5 في الأنسولين الصائم تضاعف خطر أمراض القلب", source: "European Heart Journal, 2022" },
      { fact: "بروتوكول Feel Great قلل الأنسولين الصائم بمعدل 40% في المشاركين بمستويات فوق 15", source: "Metabolic Health Research, 2023" },
    ],
    solutionTitleEn: "How to Lower Your Fasting Insulin Naturally",
    solutionTitleAr: "كيف تخفض الأنسولين الصائم طبيعياً",
    solutionStepsEn: [
      { step: "Test & Know", detail: "Request a fasting insulin test (not just glucose). Optimal is below 5 mIU/L. If yours is above 10, you have early insulin resistance — even if glucose looks 'normal'.", icon: <FlaskConical className="w-6 h-6" /> },
      { step: "Lower Insulin Demand", detail: "Balance fiber before meals reduces the glucose load that forces your pancreas to produce excess insulin. Less demand = lower fasting levels within weeks.", icon: <Shield className="w-6 h-6" /> },
      { step: "Extend Fasting Windows", detail: "The 4-4-12 pattern gives your pancreas rest. During the 12-hour overnight fast, insulin levels drop to baseline — allowing cells to resensitize.", icon: <Brain className="w-6 h-6" /> },
    ],
    solutionStepsAr: [
      { step: "افحص واعرف", detail: "اطلب فحص الأنسولين الصائم (وليس السكر فقط). المثالي أقل من 5. إذا كان فوق 10، لديك مقاومة أنسولين مبكرة — حتى لو السكر يبدو طبيعي.", icon: <FlaskConical className="w-6 h-6" /> },
      { step: "خفض الطلب على الأنسولين", detail: "ألياف بالانس قبل الوجبات تقلل حمل الجلوكوز الذي يجبر البنكرياس على إنتاج أنسولين زائد. طلب أقل = مستويات صائمة أقل خلال أسابيع.", icon: <Shield className="w-6 h-6" /> },
      { step: "مد فترات الصيام", detail: "نمط 4-4-12 يعطي البنكرياس راحة. خلال صيام 12 ساعة الليلي، تنخفض مستويات الأنسولين للقاعدة — مما يسمح للخلايا بإعادة التحسس.", icon: <Brain className="w-6 h-6" /> },
    ],
    proofStatsEn: [
      { number: "40%", label: "average insulin reduction" },
      { number: "10→5", label: "target fasting insulin" },
      { number: "90", label: "days to see results" },
      { number: "#1", label: "earliest metabolic marker" },
    ],
    proofStatsAr: [
      { number: "40%", label: "متوسط انخفاض الأنسولين" },
      { number: "10→5", label: "هدف الأنسولين الصائم" },
      { number: "90", label: "يوم لرؤية النتائج" },
      { number: "#1", label: "أبكر مؤشر أيضي" },
    ],
    testimonialEn: {
      name: "Sarah K.",
      age: "42",
      quote: "My fasting insulin dropped from 28 to 9 in 90 days. My doctor was shocked — he said he'd never seen such improvement without medication.",
      result: "Insulin Normalized",
      biomarkers: ["Fasting insulin: 28 → 9 mIU/L", "HbA1c: 5.9% → 5.2%", "Lost 12kg", "All metabolic markers normalized"],
    },
    testimonialAr: {
      name: "سارة ك.",
      age: "42",
      quote: "انخفض الأنسولين الصائم من 28 إلى 9 في 90 يوم. طبيبي صُدم — قال أنه لم يرَ تحسناً كهذا بدون أدوية.",
      result: "تطبيع الأنسولين",
      biomarkers: ["الأنسولين الصائم: 28 → 9", "HbA1c: 5.9% → 5.2%", "خسرت 12 كيلو", "تطبيع جميع المؤشرات الأيضية"],
    },
    ctaStages: {
      stage1En: "Check Your Insulin Resistance Risk",
      stage1Ar: "افحص خطر مقاومة الأنسولين لديك",
      stage2En: "Understand Your Fasting Insulin Level",
      stage2Ar: "افهم مستوى الأنسولين الصائم لديك",
      stage3En: "Get Your Insulin Optimization Plan",
      stage3Ar: "احصل على خطة تحسين الأنسولين",
      stage4En: "Start Lowering Your Insulin Today",
      stage4Ar: "ابدأ خفض الأنسولين اليوم",
    },
    faqEn: [
      { q: "What is a normal fasting insulin level?", a: "While labs say 2-25 mIU/L is 'normal,' optimal is below 5 mIU/L. Anything above 10 indicates early insulin resistance, even if your fasting glucose is still normal." },
      { q: "Why don't doctors routinely test fasting insulin?", a: "Standard diabetes screening focuses on fasting glucose and HbA1c. But these only become abnormal AFTER insulin resistance has been present for years. Fasting insulin catches the problem 10-15 years earlier." },
      { q: "How quickly can I lower my fasting insulin?", a: "Most people see measurable improvement within 4-6 weeks with the Feel Great protocol. Full optimization (below 5 mIU/L) typically takes 3-6 months depending on starting level." },
      { q: "Is high fasting insulin dangerous?", a: "Yes. High fasting insulin is associated with increased risk of Type 2 diabetes, cardiovascular disease, PCOS, fatty liver, and certain cancers. It's the body's earliest warning signal of metabolic dysfunction." },
    ],
    faqAr: [
      { q: "ما هو المستوى الطبيعي للأنسولين الصائم؟", a: "بينما المختبرات تقول 2-25 طبيعي، المثالي أقل من 5. أي شيء فوق 10 يشير لمقاومة أنسولين مبكرة، حتى لو سكر الصائم لا يزال طبيعي." },
      { q: "لماذا لا يفحص الأطباء الأنسولين الصائم روتينياً؟", a: "فحص السكري القياسي يركز على سكر الصائم وHbA1c. لكن هذه تصبح غير طبيعية فقط بعد وجود مقاومة الأنسولين لسنوات. الأنسولين الصائم يكشف المشكلة قبل 10-15 سنة." },
      { q: "كم بسرعة يمكنني خفض الأنسولين الصائم؟", a: "معظم الناس يرون تحسناً قابلاً للقياس خلال 4-6 أسابيع مع بروتوكول Feel Great. التحسين الكامل (أقل من 5) يستغرق عادة 3-6 أشهر حسب المستوى البدائي." },
      { q: "هل ارتفاع الأنسولين الصائم خطير؟", a: "نعم. ارتفاع الأنسولين الصائم مرتبط بزيادة خطر السكري النوع الثاني وأمراض القلب وتكيس المبايض والكبد الدهني وبعض السرطانات. إنه أبكر إشارة تحذيرية للخلل الأيضي." },
    ],
    relatedPages: ["/health-assessment", "/reverse-insulin-resistance", "/calculators", "/for-diabetics"],
    source: "keyword-high-fasting-insulin",
  },
};

// ===== MAIN COMPONENT =====
export default function KeywordLanding() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const path = window.location.pathname;
  // Extract slug from path (remove language prefix if present)
  const cleanPath = path.replace(/^\/(ar|fr|es|de|tr)/, "");
  const slug = cleanPath.replace(/^\//, "");
  const config = KEYWORD_PAGES[slug];

  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", country: "" });
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const registerLead = trpc.leads.register.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success(isAr ? "تم التسجيل بنجاح!" : "Registration successful!"); },
    onError: () => toast.error(isAr ? "حدث خطأ، حاول مرة أخرى" : "Something went wrong. Please try again."),
  });

  useEffect(() => {
    if (config) {
      document.title = isAr ? config.metaTitleAr : config.metaTitleEn;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", isAr ? config.metaDescAr : config.metaDescEn);
    }
  }, [config, isAr]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <Link href="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error(isAr ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    registerLead.mutate({ ...formData, source: config.source });
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${config.heroGradient} text-white flex items-center justify-center px-4`}>
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 bg-green-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">{isAr ? "تم التسجيل بنجاح!" : "Registration Successful!"}</h1>
          <p className="text-white/70 mb-6">{isAr ? "سيتواصل معك فراس خلال 24 ساعة بخطتك المخصصة." : "Feras will contact you within 24 hours with your personalized plan."}</p>
          <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="block px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors mb-3">
            {isAr ? "تواصل عبر واتساب الآن" : "Contact via WhatsApp Now"}
          </a>
          <Link href="/" className="block text-white/50 hover:text-white transition-colors">{isAr ? "العودة للرئيسية" : "Return Home"}</Link>
        </div>
      </div>
    );
  }

  const headline = isAr ? config.headlineAr : config.headlineEn;
  const subheadline = isAr ? config.subheadlineAr : config.subheadlineEn;
  const symptoms = isAr ? config.symptomsAr : config.symptomsEn;
  const sciencePoints = isAr ? config.sciencePointsAr : config.sciencePointsEn;
  const solutionSteps = isAr ? config.solutionStepsAr : config.solutionStepsEn;
  const proofStats = isAr ? config.proofStatsAr : config.proofStatsEn;
  const testimonial = isAr ? config.testimonialAr : config.testimonialEn;
  const faq = isAr ? config.faqAr : config.faqEn;
  const ctaStages = config.ctaStages;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.heroGradient} text-white`} dir={isAr ? "rtl" : "ltr"}>
      {/* Schema.org FAQ + Article structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }) }} />

      {/* Hero Section — Competitor pattern: Challenge + Reframe */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            {config.icon}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight whitespace-pre-line">{headline}</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">{subheadline}</p>
          {/* Stage 1 CTA — Assessment/Quiz */}
          <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-xl shadow-2xl transition-transform active:scale-[0.97]" onClick={() => document.getElementById("register-form")?.scrollIntoView({ behavior: "smooth" })}>
            {isAr ? ctaStages.stage1Ar : ctaStages.stage1En} <ArrowRight className="w-5 h-5 ms-2" />
          </Button>
          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 mt-6 text-white/50 text-sm">
            <Users className="w-4 h-4" />
            <span>{isAr ? "أكثر من 10,000 شخص بدأوا رحلتهم" : "10,000+ people started their journey"}</span>
          </div>
        </div>
      </section>

      {/* Symptoms/Problem Section — Pattern: Identify with the reader */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {isAr ? config.problemTitleAr : config.problemTitleEn}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {symptoms.map((s, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                s.severity === "high" ? "bg-red-500/10 border-red-500/30" :
                s.severity === "medium" ? "bg-amber-500/10 border-amber-500/30" :
                "bg-white/5 border-white/10"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  s.severity === "high" ? "bg-red-500/20" :
                  s.severity === "medium" ? "bg-amber-500/20" : "bg-green-500/20"
                }`}>
                  <span className={`text-sm ${
                    s.severity === "high" ? "text-red-400" :
                    s.severity === "medium" ? "text-amber-400" : "text-green-400"
                  }`}>{s.severity === "low" ? "✓" : "!"}</span>
                </div>
                <p className="text-white/90 text-sm md:text-base">{s.text}</p>
              </div>
            ))}
          </div>
          {/* Inline CTA */}
          <div className="text-center mt-10">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => document.getElementById("register-form")?.scrollIntoView({ behavior: "smooth" })}>
              {isAr ? ctaStages.stage2Ar : ctaStages.stage2En} <ArrowRight className="w-4 h-4 ms-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Science Section — Healthline pattern: Evidence-based */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {isAr ? config.scienceTitleAr : config.scienceTitleEn}
          </h2>
          <div className="space-y-4">
            {sciencePoints.map((point, i) => (
              <div key={i} className="p-5 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FlaskConical className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/90 font-medium">{point.fact}</p>
                    <p className="text-white/40 text-xs mt-1">— {point.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section — Steps with icons */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {isAr ? config.solutionTitleAr : config.solutionTitleEn}
          </h2>
          <div className="space-y-6">
            {solutionSteps.map((step, i) => (
              <div key={i} className="flex gap-4 md:gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    {step.icon}
                  </div>
                  {i < solutionSteps.length - 1 && <div className="w-px h-12 bg-white/20 mt-2" />}
                </div>
                <div className="flex-1 pb-6">
                  <h3 className="text-lg font-bold mb-2">{step.step}</h3>
                  <p className="text-white/70 text-sm md:text-base">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Stage 3 CTA */}
          <div className="text-center mt-10">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 font-bold px-8 py-5 rounded-xl transition-transform active:scale-[0.97]" onClick={() => document.getElementById("register-form")?.scrollIntoView({ behavior: "smooth" })}>
              {isAr ? ctaStages.stage3Ar : ctaStages.stage3En} <ArrowRight className="w-5 h-5 ms-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof Stats — Virta/Levels pattern */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {proofStats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured Testimonial with biomarkers */}
          <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <blockquote className="text-lg md:text-xl italic text-white/90 mb-4">"{testimonial.quote}"</blockquote>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}, {isAr ? "عمر" : "age"} {testimonial.age}</p>
                  <p className="text-sm text-green-400 font-medium">{testimonial.result}</p>
                </div>
              </div>
              {/* Biomarker results */}
              <div className="grid grid-cols-2 gap-3">
                {testimonial.biomarkers.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-white/80">{b}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section — People Also Ask targeting */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {isAr ? "أسئلة شائعة" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-start"
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                >
                  <span className="font-medium text-white/90 pe-4">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-white/50 flex-shrink-0 transition-transform ${expandedFaq === i ? "rotate-180" : ""}`} />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 text-white/70 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form — Stage 4 CTA */}
      <section id="register-form" className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-2 text-white">
                {isAr ? ctaStages.stage4Ar : ctaStages.stage4En}
              </h2>
              <p className="text-white/60 text-center text-sm mb-6">
                {isAr ? "سيتواصل معك فراس شخصياً خلال 24 ساعة بخطتك المخصصة" : "Feras will personally contact you within 24 hours with your personalized plan"}
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder={isAr ? "الاسم الكامل" : "Full Name"}
                  value={formData.fullName}
                  onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Input
                  type="email"
                  placeholder={isAr ? "البريد الإلكتروني" : "Email"}
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Input
                  type="tel"
                  placeholder={isAr ? "رقم الهاتف (مع رمز الدولة)" : "Phone (with country code)"}
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Input
                  placeholder={isAr ? "الدولة" : "Country"}
                  value={formData.country}
                  onChange={e => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
                <Button type="submit" className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold py-6 text-lg rounded-xl transition-transform active:scale-[0.97]" disabled={registerLead.isPending}>
                  {registerLead.isPending ? (isAr ? "جاري التسجيل..." : "Registering...") : (isAr ? ctaStages.stage4Ar : ctaStages.stage4En)}
                </Button>
              </form>
              <p className="text-white/40 text-xs text-center mt-4">
                {isAr ? "بياناتك محمية ولن نشاركها مع أي طرف ثالث" : "Your data is protected and will never be shared with third parties"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Pages — Internal linking for SEO */}
      <section className="py-12 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {config.relatedPages.map((page, i) => (
              <Link key={i} href={page} className="px-4 py-2 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm border border-white/10">
                {page.replace(/^\//,"").replace(/-/g, " ")}
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors">
              WhatsApp <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

// Export slugs for routing
export const KEYWORD_SLUGS = Object.keys(KEYWORD_PAGES);
