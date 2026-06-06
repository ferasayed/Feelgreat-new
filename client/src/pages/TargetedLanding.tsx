import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle, Heart, TrendingUp, Zap, Shield, Star, Users, Brain, Moon, Activity, Leaf, Scale, Baby } from "lucide-react";
import { toast } from "sonner";

// ===== SEGMENT CONFIGURATIONS =====
interface SegmentConfig {
  slug: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescAr: string;
  metaDescEn: string;
  heroGradient: string;
  icon: React.ReactNode;
  benefitsAr: Array<{ icon: React.ReactNode; title: string; desc: string }>;
  benefitsEn: Array<{ icon: React.ReactNode; title: string; desc: string }>;
  ctaAr: string;
  ctaEn: string;
  problemsAr: string[];
  problemsEn: string[];
  solutionAr: string;
  solutionEn: string;
  testimonialsAr: Array<{ name: string; text: string; result: string }>;
  testimonialsEn: Array<{ name: string; text: string; result: string }>;
  relatedArticleCategory: string;
  source: string;
}

const SEGMENTS: Record<string, SegmentConfig> = {
  "for-women": {
    slug: "for-women",
    titleAr: "استعيدي طاقتك وصحتك",
    titleEn: "Reclaim Your Energy & Health",
    subtitleAr: "برنامج Feel Great مصمم خصيصاً لدعم صحة المرأة - الهرمونات، الوزن، الطاقة، والبشرة",
    subtitleEn: "Feel Great is designed to support women's health - hormones, weight, energy, and skin",
    metaTitleAr: "صحة المرأة | Feel Great - استعيدي طاقتك",
    metaTitleEn: "Women's Health | Feel Great - Reclaim Your Energy",
    metaDescAr: "برنامج Feel Great لصحة المرأة: توازن هرموني، إدارة الوزن، طاقة مستدامة، وبشرة مشرقة. ابدئي رحلتك الصحية اليوم.",
    metaDescEn: "Feel Great for women's health: hormonal balance, weight management, sustained energy, and radiant skin. Start your health journey today.",
    heroGradient: "from-rose-900 via-pink-900 to-purple-900",
    icon: <Heart className="w-8 h-8 text-rose-400" />,
    benefitsAr: [
      { icon: <Activity className="w-6 h-6" />, title: "توازن هرموني", desc: "دعم طبيعي لتوازن الهرمونات وتقليل أعراض الدورة الشهرية وانقطاع الطمث" },
      { icon: <Scale className="w-6 h-6" />, title: "إدارة الوزن", desc: "تحكم صحي بالوزن دون حرمان أو أنظمة قاسية" },
      { icon: <Zap className="w-6 h-6" />, title: "طاقة مستدامة", desc: "وداعاً للإرهاق المزمن - طاقة متجددة طوال اليوم" },
      { icon: <Star className="w-6 h-6" />, title: "بشرة مشرقة", desc: "تغذية من الداخل تنعكس على بشرتك وشعرك" },
    ],
    benefitsEn: [
      { icon: <Activity className="w-6 h-6" />, title: "Hormonal Balance", desc: "Natural support for hormone balance, reducing PMS and menopause symptoms" },
      { icon: <Scale className="w-6 h-6" />, title: "Weight Management", desc: "Healthy weight control without deprivation or harsh diets" },
      { icon: <Zap className="w-6 h-6" />, title: "Sustained Energy", desc: "Say goodbye to chronic fatigue - renewed energy all day long" },
      { icon: <Star className="w-6 h-6" />, title: "Radiant Skin", desc: "Nourishment from within that reflects on your skin and hair" },
    ],
    ctaAr: "ابدئي رحلتك الصحية",
    ctaEn: "Start Your Health Journey",
    problemsAr: [
      "تعبت من الإرهاق المستمر وقلة الطاقة؟",
      "تعانين من تقلبات الوزن رغم المحاولات المتكررة؟",
      "تشعرين بتغيرات هرمونية تؤثر على مزاجك وحياتك؟",
      "بشرتك باهتة وشعرك يتساقط؟",
    ],
    problemsEn: [
      "Tired of constant fatigue and low energy?",
      "Struggling with weight fluctuations despite repeated attempts?",
      "Experiencing hormonal changes affecting your mood and life?",
      "Dull skin and hair loss?",
    ],
    solutionAr: "برنامج Feel Great يعالج الأسباب الجذرية من خلال تحسين صحة الأمعاء، تنظيم الإنسولين، وتغذية الجسم بالمغذيات الأساسية التي تحتاجها المرأة.",
    solutionEn: "Feel Great addresses root causes by improving gut health, regulating insulin, and nourishing the body with essential nutrients women need.",
    testimonialsAr: [
      { name: "سارة م.", text: "بعد 3 أشهر من Feel Great، انخفض وزني 8 كيلو وطاقتي تضاعفت", result: "-8 كغ في 3 أشهر" },
      { name: "نورة ع.", text: "أخيراً نومي تحسن وأعراض الدورة خفت بشكل ملحوظ", result: "نوم أفضل 80%" },
      { name: "هدى ك.", text: "بشرتي أصبحت مشرقة وشعري توقف عن التساقط", result: "بشرة مشرقة" },
    ],
    testimonialsEn: [
      { name: "Sarah M.", text: "After 3 months on Feel Great, I lost 8kg and my energy doubled", result: "-8kg in 3 months" },
      { name: "Noura A.", text: "Finally my sleep improved and PMS symptoms reduced significantly", result: "80% better sleep" },
      { name: "Huda K.", text: "My skin became radiant and my hair stopped falling", result: "Radiant skin" },
    ],
    relatedArticleCategory: "womens-health",
    source: "landing-women",
  },
  "for-diabetics": {
    slug: "for-diabetics",
    titleAr: "تحكّم بسكرك طبيعياً",
    titleEn: "Control Your Blood Sugar Naturally",
    subtitleAr: "نظام Feel Great يساعد على تحسين مقاومة الإنسولين وتنظيم السكر بطريقة علمية وآمنة",
    subtitleEn: "Feel Great helps improve insulin resistance and regulate blood sugar scientifically and safely",
    metaTitleAr: "السكري ومقاومة الإنسولين | Feel Great",
    metaTitleEn: "Diabetes & Insulin Resistance | Feel Great",
    metaDescAr: "نظام Feel Great لمرضى السكري ومقاومة الإنسولين: تحسين حساسية الإنسولين، تنظيم السكر، وتقليل الاعتماد على الأدوية بشكل طبيعي.",
    metaDescEn: "Feel Great for diabetes and insulin resistance: improve insulin sensitivity, regulate blood sugar, and reduce medication dependency naturally.",
    heroGradient: "from-blue-900 via-indigo-900 to-slate-900",
    icon: <Activity className="w-8 h-8 text-blue-400" />,
    benefitsAr: [
      { icon: <Activity className="w-6 h-6" />, title: "تحسين حساسية الإنسولين", desc: "Unimate يساعد على تحسين استجابة الخلايا للإنسولين بشكل طبيعي" },
      { icon: <Shield className="w-6 h-6" />, title: "تنظيم السكر", desc: "Balance يبطئ امتصاص الكربوهيدرات ويمنع ارتفاعات السكر المفاجئة" },
      { icon: <TrendingUp className="w-6 h-6" />, title: "تقليل الاعتماد على الأدوية", desc: "كثير من المستخدمين قللوا جرعاتهم تحت إشراف طبي" },
      { icon: <Heart className="w-6 h-6" />, title: "حماية الأعضاء", desc: "حماية القلب والكلى والأعصاب من مضاعفات السكري" },
    ],
    benefitsEn: [
      { icon: <Activity className="w-6 h-6" />, title: "Improve Insulin Sensitivity", desc: "Unimate helps improve cellular insulin response naturally" },
      { icon: <Shield className="w-6 h-6" />, title: "Regulate Blood Sugar", desc: "Balance slows carb absorption and prevents sudden sugar spikes" },
      { icon: <TrendingUp className="w-6 h-6" />, title: "Reduce Medication Dependency", desc: "Many users reduced their dosages under medical supervision" },
      { icon: <Heart className="w-6 h-6" />, title: "Organ Protection", desc: "Protect heart, kidneys, and nerves from diabetes complications" },
    ],
    ctaAr: "ابدأ رحلة التحكم بالسكر",
    ctaEn: "Start Your Sugar Control Journey",
    problemsAr: [
      "سكرك التراكمي مرتفع رغم الأدوية؟",
      "تعاني من ارتفاعات مفاجئة بعد الوجبات؟",
      "تشعر بالتعب والخمول المستمر؟",
      "قلق من مضاعفات السكري على المدى البعيد؟",
    ],
    problemsEn: [
      "Your HbA1c is high despite medications?",
      "Experiencing sudden spikes after meals?",
      "Feeling constant fatigue and lethargy?",
      "Worried about long-term diabetes complications?",
    ],
    solutionAr: "نظام Feel Great (Unimate + Balance) يعمل على تحسين مقاومة الإنسولين من الجذور، مدعوم بأبحاث علمية و16 براءة اختراع.",
    solutionEn: "Feel Great (Unimate + Balance) works on improving insulin resistance at its roots, backed by scientific research and 16 patents.",
    testimonialsAr: [
      { name: "أحمد ر.", text: "سكري التراكمي انخفض من 9.2 إلى 6.8 في 4 أشهر", result: "HbA1c: 9.2 → 6.8" },
      { name: "محمد ع.", text: "قللت جرعة الميتفورمين بإشراف طبيبي بعد 3 أشهر", result: "تقليل الأدوية" },
      { name: "فاطمة س.", text: "لم أعد أشعر بالخمول بعد الوجبات والطاقة عادت", result: "طاقة متجددة" },
    ],
    testimonialsEn: [
      { name: "Ahmed R.", text: "My HbA1c dropped from 9.2 to 6.8 in 4 months", result: "HbA1c: 9.2 → 6.8" },
      { name: "Mohammed A.", text: "Reduced my Metformin dose under doctor supervision after 3 months", result: "Reduced meds" },
      { name: "Fatima S.", text: "No more post-meal lethargy and my energy is back", result: "Renewed energy" },
    ],
    relatedArticleCategory: "diabetes",
    source: "landing-diabetics",
  },
  "for-entrepreneurs": {
    slug: "for-entrepreneurs",
    titleAr: "ابنِ دخلاً من شغفك بالصحة",
    titleEn: "Build Income From Your Health Passion",
    subtitleAr: "انضم لفريق فراس العايد وابنِ مشروعاً صحياً عالمياً يحقق دخلاً مستداماً وتأثيراً حقيقياً",
    subtitleEn: "Join Feras Alayed's team and build a global health business with sustainable income and real impact",
    metaTitleAr: "فرصة شراكة صحية | Feel Great مع فراس",
    metaTitleEn: "Health Partnership Opportunity | Feel Great",
    metaDescAr: "فرصة شراكة مع فراس العايد: ابنِ مشروعاً صحياً عالمياً مع Unicity. دخل مستدام، تدريب مجاني، ومجتمع داعم. لا تحتاج خبرة سابقة.",
    metaDescEn: "Partner with Feras Alayed: build a global health business with Unicity. Sustainable income, free training, and supportive community. No experience needed.",
    heroGradient: "from-emerald-900 via-teal-900 to-slate-900",
    icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
    benefitsAr: [
      { icon: <TrendingUp className="w-6 h-6" />, title: "دخل متنامي", desc: "نظام عمولات متعدد المستويات مع دخل متكرر شهرياً" },
      { icon: <Users className="w-6 h-6" />, title: "مجتمع عالمي", desc: "انضم لفريق يضم شركاء من 30+ دولة" },
      { icon: <Brain className="w-6 h-6" />, title: "تدريب مجاني", desc: "تدريب شامل على المنتجات، المبيعات، والقيادة" },
      { icon: <Leaf className="w-6 h-6" />, title: "عمل ذو معنى", desc: "ساعد الناس على تحسين صحتهم واكسب أثناء ذلك" },
    ],
    benefitsEn: [
      { icon: <TrendingUp className="w-6 h-6" />, title: "Growing Income", desc: "Multi-level commission system with recurring monthly income" },
      { icon: <Users className="w-6 h-6" />, title: "Global Community", desc: "Join a team with partners from 30+ countries" },
      { icon: <Brain className="w-6 h-6" />, title: "Free Training", desc: "Comprehensive training on products, sales, and leadership" },
      { icon: <Leaf className="w-6 h-6" />, title: "Meaningful Work", desc: "Help people improve their health and earn while doing it" },
    ],
    ctaAr: "قدّم طلب الشراكة",
    ctaEn: "Apply for Partnership",
    problemsAr: [
      "تبحث عن مصدر دخل إضافي مرن؟",
      "تريد عملاً ذا معنى يجمع بين الصحة والدخل؟",
      "سئمت من الوظيفة التقليدية وتريد حرية أكثر؟",
      "تريد بناء مشروع عالمي من هاتفك؟",
    ],
    problemsEn: [
      "Looking for a flexible additional income source?",
      "Want meaningful work combining health and income?",
      "Tired of traditional employment and want more freedom?",
      "Want to build a global business from your phone?",
    ],
    solutionAr: "شراكة Feel Great مع فراس العايد تمنحك نظاماً جاهزاً: منتجات مثبتة علمياً، تدريب مستمر، ومجتمع داعم. كل ما تحتاجه هو الشغف بمساعدة الآخرين.",
    solutionEn: "Feel Great partnership with Feras Alayed gives you a ready system: scientifically proven products, continuous training, and a supportive community. All you need is passion for helping others.",
    testimonialsAr: [
      { name: "خالد م.", text: "بدأت كشريك جزئي وخلال 6 أشهر أصبح دخلي يتجاوز راتبي", result: "دخل > الراتب في 6 أشهر" },
      { name: "ريم ح.", text: "أعمل من المنزل وأساعد عائلات على تحسين صحتها", result: "عمل من المنزل" },
      { name: "عبدالله ف.", text: "الفريق والتدريب جعلا البداية سهلة جداً", result: "بداية سهلة" },
    ],
    testimonialsEn: [
      { name: "Khaled M.", text: "Started part-time and within 6 months my income exceeded my salary", result: "Income > salary in 6 months" },
      { name: "Reem H.", text: "I work from home helping families improve their health", result: "Work from home" },
      { name: "Abdullah F.", text: "The team and training made starting incredibly easy", result: "Easy start" },
    ],
    relatedArticleCategory: "sustainable-health",
    source: "landing-entrepreneurs",
  },
  "for-weight-loss": {
    slug: "for-weight-loss",
    titleAr: "انقص وزنك بدون حرمان",
    titleEn: "Lose Weight Without Deprivation",
    subtitleAr: "نظام Feel Great يساعدك على إنقاص الوزن بشكل مستدام من خلال تحسين الأيض وتنظيم الشهية",
    subtitleEn: "Feel Great helps you lose weight sustainably by improving metabolism and regulating appetite",
    metaTitleAr: "إنقاص الوزن المستدام | Feel Great",
    metaTitleEn: "Sustainable Weight Loss | Feel Great",
    metaDescAr: "انقص وزنك بدون حرمان مع Feel Great: تحسين الأيض، تنظيم الشهية، وحرق الدهون بشكل طبيعي. نتائج مثبتة علمياً.",
    metaDescEn: "Lose weight without deprivation with Feel Great: improve metabolism, regulate appetite, and burn fat naturally. Scientifically proven results.",
    heroGradient: "from-orange-900 via-amber-900 to-slate-900",
    icon: <Scale className="w-8 h-8 text-orange-400" />,
    benefitsAr: [
      { icon: <Activity className="w-6 h-6" />, title: "تحسين الأيض", desc: "تسريع عملية حرق الدهون بشكل طبيعي وآمن" },
      { icon: <Shield className="w-6 h-6" />, title: "تنظيم الشهية", desc: "تقليل الرغبة في السكريات والأكل العاطفي" },
      { icon: <Zap className="w-6 h-6" />, title: "طاقة أثناء الحمية", desc: "لا خمول أو تعب أثناء إنقاص الوزن" },
      { icon: <TrendingUp className="w-6 h-6" />, title: "نتائج مستدامة", desc: "لا يويو - نتائج تدوم لأنك تعالج السبب الجذري" },
    ],
    benefitsEn: [
      { icon: <Activity className="w-6 h-6" />, title: "Boost Metabolism", desc: "Speed up fat burning naturally and safely" },
      { icon: <Shield className="w-6 h-6" />, title: "Regulate Appetite", desc: "Reduce sugar cravings and emotional eating" },
      { icon: <Zap className="w-6 h-6" />, title: "Energy During Diet", desc: "No lethargy or fatigue while losing weight" },
      { icon: <TrendingUp className="w-6 h-6" />, title: "Sustainable Results", desc: "No yo-yo - lasting results because you address root causes" },
    ],
    ctaAr: "ابدأ رحلة إنقاص الوزن",
    ctaEn: "Start Your Weight Loss Journey",
    problemsAr: [
      "جربت كل الحميات ولا شيء يعمل على المدى البعيد؟",
      "تفقد الوزن ثم يعود أكثر من قبل؟",
      "تشعر بالجوع المستمر والرغبة في السكريات؟",
      "الحميات تجعلك متعباً وبدون طاقة؟",
    ],
    problemsEn: [
      "Tried every diet and nothing works long-term?",
      "Lose weight only to gain it back and more?",
      "Constant hunger and sugar cravings?",
      "Diets leave you tired and without energy?",
    ],
    solutionAr: "Feel Great يعالج السبب الجذري لزيادة الوزن: مقاومة الإنسولين. عندما تتحسن حساسية الإنسولين، يبدأ جسمك بحرق الدهون بدلاً من تخزينها.",
    solutionEn: "Feel Great addresses the root cause of weight gain: insulin resistance. When insulin sensitivity improves, your body starts burning fat instead of storing it.",
    testimonialsAr: [
      { name: "منى ص.", text: "خسرت 12 كيلو في 4 أشهر بدون حرمان أو جوع", result: "-12 كغ في 4 أشهر" },
      { name: "سعود ل.", text: "لأول مرة أنقص وزني ولا يرجع - مر سنة كاملة", result: "ثبات سنة كاملة" },
      { name: "لمياء ن.", text: "اختفت رغبتي في السكريات تماماً بعد أسبوعين", result: "لا رغبة بالسكر" },
    ],
    testimonialsEn: [
      { name: "Mona S.", text: "Lost 12kg in 4 months without deprivation or hunger", result: "-12kg in 4 months" },
      { name: "Saud L.", text: "First time I lost weight and it didn't come back - been a full year", result: "Stable for 1 year" },
      { name: "Lamia N.", text: "My sugar cravings completely disappeared after 2 weeks", result: "No sugar cravings" },
    ],
    relatedArticleCategory: "weight-management",
    source: "landing-weight-loss",
  },
  "for-gut-health": {
    slug: "for-gut-health",
    titleAr: "أصلح أمعاءك... يتحسن كل شيء",
    titleEn: "Fix Your Gut... Everything Improves",
    subtitleAr: "صحة الأمعاء هي أساس كل شيء: المناعة، المزاج، الوزن، والطاقة. Feel Great يبدأ من هنا.",
    subtitleEn: "Gut health is the foundation of everything: immunity, mood, weight, and energy. Feel Great starts here.",
    metaTitleAr: "صحة الأمعاء | Feel Great - أصلح أمعاءك",
    metaTitleEn: "Gut Health | Feel Great - Fix Your Gut",
    metaDescAr: "صحة الأمعاء أساس كل شيء. Feel Great يحسن الميكروبيوم، يقوي المناعة، ويحسن المزاج والهضم. ابدأ من الجذور.",
    metaDescEn: "Gut health is the foundation of everything. Feel Great improves microbiome, strengthens immunity, and enhances mood and digestion. Start from the roots.",
    heroGradient: "from-green-900 via-emerald-900 to-slate-900",
    icon: <Leaf className="w-8 h-8 text-green-400" />,
    benefitsAr: [
      { icon: <Shield className="w-6 h-6" />, title: "تقوية المناعة", desc: "70% من جهاز المناعة في الأمعاء - حسّنها وتتحسن مناعتك" },
      { icon: <Brain className="w-6 h-6" />, title: "تحسين المزاج", desc: "90% من السيروتونين يُنتج في الأمعاء - أمعاء صحية = مزاج أفضل" },
      { icon: <Activity className="w-6 h-6" />, title: "هضم مريح", desc: "وداعاً للانتفاخ والغازات وعسر الهضم" },
      { icon: <Zap className="w-6 h-6" />, title: "امتصاص أفضل", desc: "امتصاص أفضل للمغذيات يعني طاقة أكثر" },
    ],
    benefitsEn: [
      { icon: <Shield className="w-6 h-6" />, title: "Strengthen Immunity", desc: "70% of immune system is in the gut - improve it and immunity follows" },
      { icon: <Brain className="w-6 h-6" />, title: "Improve Mood", desc: "90% of serotonin is produced in the gut - healthy gut = better mood" },
      { icon: <Activity className="w-6 h-6" />, title: "Comfortable Digestion", desc: "Say goodbye to bloating, gas, and indigestion" },
      { icon: <Zap className="w-6 h-6" />, title: "Better Absorption", desc: "Better nutrient absorption means more energy" },
    ],
    ctaAr: "ابدأ رحلة صحة الأمعاء",
    ctaEn: "Start Your Gut Health Journey",
    problemsAr: [
      "تعاني من انتفاخ مزمن وغازات؟",
      "مناعتك ضعيفة وتمرض كثيراً؟",
      "مزاجك متقلب وتشعر بالقلق؟",
      "جربت بروبيوتيك كثيرة بدون نتيجة؟",
    ],
    problemsEn: [
      "Suffering from chronic bloating and gas?",
      "Weak immunity and getting sick often?",
      "Mood swings and anxiety?",
      "Tried many probiotics without results?",
    ],
    solutionAr: "Balance من Feel Great يحتوي على ألياف بريبيوتيك تغذي البكتيريا النافعة، بينما Unimate يقلل الالتهاب ويدعم بطانة الأمعاء.",
    solutionEn: "Balance from Feel Great contains prebiotic fiber that feeds beneficial bacteria, while Unimate reduces inflammation and supports gut lining.",
    testimonialsAr: [
      { name: "عائشة م.", text: "الانتفاخ اختفى تماماً بعد أسبوعين من الاستخدام", result: "لا انتفاخ" },
      { name: "يوسف ك.", text: "لم أمرض منذ بدأت Feel Great - مناعتي تحسنت بشكل واضح", result: "مناعة أقوى" },
      { name: "دينا ح.", text: "مزاجي تحسن كثيراً والقلق خف بشكل ملحوظ", result: "مزاج أفضل" },
    ],
    testimonialsEn: [
      { name: "Aisha M.", text: "Bloating completely disappeared after 2 weeks of use", result: "No bloating" },
      { name: "Youssef K.", text: "Haven't been sick since starting Feel Great - immunity clearly improved", result: "Stronger immunity" },
      { name: "Dina H.", text: "My mood improved greatly and anxiety reduced noticeably", result: "Better mood" },
    ],
    relatedArticleCategory: "gut-health",
    source: "landing-gut-health",
  },
};

// ===== MAIN COMPONENT =====
export default function TargetedLanding() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  // Extract segment from current path (e.g., /for-women -> for-women)
  const path = window.location.pathname;
  const segmentMatch = path.match(/\/(for-[\w-]+)/);
  const segment = segmentMatch ? segmentMatch[1] : "";
  const config = SEGMENTS[segment];

  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", country: "" });
  const [submitted, setSubmitted] = useState(false);

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
    if (!formData.fullName || !formData.email || !formData.phone || !formData.country) {
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
          <p className="text-white/70 mb-6">{isAr ? "سيتواصل معك فراس خلال 24 ساعة لمساعدتك في رحلتك الصحية." : "Feras will contact you within 24 hours to help you on your health journey."}</p>
          <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="block px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors mb-3">
            {isAr ? "تواصل عبر واتساب الآن" : "Contact via WhatsApp Now"}
          </a>
          <Link href="/" className="block text-white/50 hover:text-white transition-colors">{isAr ? "العودة للرئيسية" : "Return Home"}</Link>
        </div>
      </div>
    );
  }

  const title = isAr ? config.titleAr : config.titleEn;
  const subtitle = isAr ? config.subtitleAr : config.subtitleEn;
  const benefits = isAr ? config.benefitsAr : config.benefitsEn;
  const cta = isAr ? config.ctaAr : config.ctaEn;
  const problems = isAr ? config.problemsAr : config.problemsEn;
  const solution = isAr ? config.solutionAr : config.solutionEn;
  const testimonials = isAr ? config.testimonialsAr : config.testimonialsEn;

  return (
    <div className={`min-h-screen bg-gradient-to-b ${config.heroGradient} text-white`} dir={isAr ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            {config.icon}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{title}</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">{subtitle}</p>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-xl" onClick={() => document.getElementById("register-form")?.scrollIntoView({ behavior: "smooth" })}>
            {cta} <ArrowRight className="w-5 h-5 ms-2" />
          </Button>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {isAr ? "هل تعاني من هذه المشاكل؟" : "Are you experiencing these problems?"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {problems.map((problem, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-sm">✗</span>
                </div>
                <p className="text-white/90">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {isAr ? "الحل: نظام Feel Great" : "The Solution: Feel Great System"}
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">{solution}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <Card key={i} className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {isAr ? "نتائج حقيقية من أشخاص حقيقيين" : "Real Results From Real People"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-white/80 text-sm mb-4">"{t.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.name}</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">{t.result}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="register-form" className="py-20 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-2 text-white">
                {isAr ? "سجّل الآن مجاناً" : "Register Now - Free"}
              </h2>
              <p className="text-white/60 text-center text-sm mb-6">
                {isAr ? "سيتواصل معك فراس شخصياً خلال 24 ساعة" : "Feras will personally contact you within 24 hours"}
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
                <Button type="submit" className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold py-6 text-lg rounded-xl" disabled={registerLead.isPending}>
                  {registerLead.isPending ? (isAr ? "جاري التسجيل..." : "Registering...") : cta}
                </Button>
              </form>
              <p className="text-white/40 text-xs text-center mt-4">
                {isAr ? "بياناتك محمية ولن نشاركها مع أي طرف ثالث" : "Your data is protected and will never be shared with third parties"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-4 bg-black/30 text-center">
        <p className="text-white/60 mb-4">{isAr ? "لديك أسئلة؟ تواصل مباشرة" : "Have questions? Contact directly"}</p>
        <a href="https://wa.me/96877020770" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors">
          WhatsApp <ArrowRight className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}

// Export segment slugs for routing
export const LANDING_SEGMENTS = Object.keys(SEGMENTS);
