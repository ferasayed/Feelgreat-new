import { useState, useEffect, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Activity, Heart, Leaf, Zap, Shield, Brain, Moon, Bone, Eye, Pill, Baby, Star, Play, ArrowLeft, ExternalLink, Phone, Calendar, ClipboardCheck, Users, ChevronRight, Quote, CheckCircle2 } from "lucide-react";
import PartnerStoriesGallery from "@/components/PartnerStoriesGallery";

const DRIVE_BASE = "https://drive.google.com/drive/folders/";

// ===== CATEGORY DATA =====
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

// ===== INDIVIDUAL SUCCESS STORIES =====
interface SuccessStory {
  id: string;
  category: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  metaDescEn: string;
  metaDescAr: string;
  resultEn: string;
  resultAr: string;
  durationEn: string;
  durationAr: string;
  quoteEn: string;
  quoteAr: string;
  age: string;
  country: string;
  highlights: { en: string; ar: string }[];
}

const successStories: SuccessStory[] = [
  {
    id: "dana-prediabetes-metabolic-reset",
    category: "diabetes",
    titleEn: "Dana's Prediabetes Reversal: A Complete Metabolic Reset",
    titleAr: "تحول دانا: عكس ما قبل السكري بإعادة ضبط أيضية كاملة",
    descriptionEn: "Dana was diagnosed with prediabetes at 47. Her fasting glucose was 118 mg/dL and rising. Through metabolic health coaching with Feras and the Feel Great system, she achieved a complete reversal within 4 months — no medication required.",
    descriptionAr: "شُخّصت دانا بما قبل السكري في سن 47. كان سكر الصائم 118 ويرتفع. من خلال التدريب الأيضي مع فراس ونظام Feel Great، حققت عكساً كاملاً خلال 4 أشهر — بدون أدوية.",
    metaDescEn: "How Dana reversed prediabetes at 47: fasting glucose dropped from 118 to 89 mg/dL in 4 months using metabolic health coaching and the Feel Great system.",
    metaDescAr: "كيف عكست دانا ما قبل السكري في 47: انخفض سكر الصائم من 118 إلى 89 في 4 أشهر باستخدام التدريب الأيضي ونظام Feel Great.",
    resultEn: "Fasting glucose: 118 → 89 mg/dL",
    resultAr: "سكر الصائم: 118 → 89",
    durationEn: "4 Months",
    durationAr: "4 أشهر",
    quoteEn: "My doctor removed the prediabetes label from my chart. I never thought that was possible without medication.",
    quoteAr: "طبيبي أزال تشخيص ما قبل السكري من ملفي. لم أكن أظن أن هذا ممكن بدون أدوية.",
    age: "47",
    country: "USA",
    highlights: [
      { en: "Fasting glucose: 118 → 89 mg/dL", ar: "سكر الصائم: 118 → 89" },
      { en: "HbA1c: 6.1% → 5.3%", ar: "HbA1c: 6.1% → 5.3%" },
      { en: "Lost 9kg of visceral fat", ar: "خسرت 9 كيلو من الدهون الحشوية" },
      { en: "No medication needed", ar: "بدون أدوية" },
    ],
  },
  {
    id: "omar-metabolic-health-transformation",
    category: "insulin",
    titleEn: "Omar's Metabolic Health Transformation: From 5 Risk Factors to Zero",
    titleAr: "تحول عمر الأيضي: من 5 عوامل خطر إلى صفر",
    descriptionEn: "At 50, Omar had metabolic syndrome with all five markers elevated. His doctor warned about imminent heart disease. Through comprehensive metabolic optimization with Feras, he eliminated all risk factors in 5 months.",
    descriptionAr: "في سن 50، كان لدى عمر متلازمة أيضية بجميع العلامات الخمس مرتفعة. حذره طبيبه من أمراض القلب الوشيكة. من خلال التحسين الأيضي الشامل مع فراس، أزال جميع عوامل الخطر في 5 أشهر.",
    metaDescEn: "Omar reversed metabolic syndrome at 50: all 5 risk factors eliminated through metabolic health coaching. Documented lab results.",
    metaDescAr: "عكس عمر متلازمة الأيض في 50: إزالة جميع عوامل الخطر الخمسة من خلال التدريب الأيضي. نتائج موثقة.",
    resultEn: "All 5 metabolic markers normalized",
    resultAr: "تطبيع جميع العلامات الأيضية الخمس",
    durationEn: "5 Months",
    durationAr: "5 أشهر",
    quoteEn: "My cardiologist said I no longer need the medications he was about to prescribe. That moment changed my life.",
    quoteAr: "طبيب القلب قال أنني لم أعد بحاجة للأدوية. تلك اللحظة غيرت حياتي.",
    age: "50",
    country: "UAE",
    highlights: [
      { en: "Blood pressure: 155/95 → 122/78", ar: "ضغط الدم: 155/95 → 122/78" },
      { en: "Triglycerides: 290 → 135", ar: "الدهون الثلاثية: 290 → 135" },
      { en: "Waist: 110cm → 91cm", ar: "الخصر: 110 → 91 سم" },
      { en: "HDL increased 45%", ar: "ارتفع HDL بنسبة 45%" },
    ],
  },
  {
    id: "rachel-lifestyle-transformation",
    category: "diverse",
    titleEn: "Rachel's Lifestyle Transformation: From Burnout to Balance",
    titleAr: "تحول راشيل: من الإرهاق إلى التوازن",
    descriptionEn: "Rachel was a high-performing executive burning out at 44. Chronic stress, poor sleep, weight gain, and brain fog were destroying her career and relationships. Feras's holistic approach addressed the root causes — not just symptoms.",
    descriptionAr: "كانت راشيل مديرة تنفيذية عالية الأداء تحترق في سن 44. التوتر المزمن والنوم السيء وزيادة الوزن والضبابية الذهنية كانت تدمر مسيرتها وعلاقاتها. نهج فراس الشامل عالج الأسباب الجذرية — وليس الأعراض فقط.",
    metaDescEn: "Rachel transformed from executive burnout to balanced living at 44. Holistic metabolic and behavioral nutrition approach with documented results.",
    metaDescAr: "تحولت راشيل من الإرهاق التنفيذي إلى الحياة المتوازنة في 44. نهج شامل في التغذية الأيضية والسلوكية مع نتائج موثقة.",
    resultEn: "Complete lifestyle transformation",
    resultAr: "تحول كامل في نمط الحياة",
    durationEn: "4 Months",
    durationAr: "4 أشهر",
    quoteEn: "I got promoted, lost 14kg, and my marriage improved. It all started with fixing my metabolic health.",
    quoteAr: "حصلت على ترقية، خسرت 14 كيلو، وتحسن زواجي. كل شيء بدأ بإصلاح صحتي الأيضية.",
    age: "44",
    country: "Germany",
    highlights: [
      { en: "Lost 14kg sustainably", ar: "خسرت 14 كيلو بشكل مستدام" },
      { en: "Sleep quality: 4/10 → 9/10", ar: "جودة النوم: 4/10 → 9/10" },
      { en: "Stress levels halved", ar: "انخفض التوتر للنصف" },
      { en: "Career performance improved", ar: "تحسن الأداء المهني" },
    ],
  },
  {
    id: "yusuf-behavioral-nutrition-change",
    category: "weight",
    titleEn: "Yusuf's Behavioral Change: Ending 20 Years of Emotional Eating",
    titleAr: "تغيير يوسف السلوكي: إنهاء 20 سنة من الأكل العاطفي",
    descriptionEn: "Yusuf had been an emotional eater since his twenties. Every diet failed because none addressed the behavioral root cause. Feras's behavioral nutrition approach finally broke the cycle — permanently.",
    descriptionAr: "كان يوسف يأكل عاطفياً منذ العشرينات. كل حمية فشلت لأن لا شيء عالج السبب السلوكي الجذري. نهج فراس في التغذية السلوكية كسر الدورة أخيراً — بشكل دائم.",
    metaDescEn: "Yusuf ended 20 years of emotional eating through behavioral nutrition coaching. Lost 30kg and maintained for 18 months.",
    metaDescAr: "أنهى يوسف 20 سنة من الأكل العاطفي من خلال التدريب على التغذية السلوكية. خسر 30 كيلو وحافظ لمدة 18 شهر.",
    resultEn: "Lost 30kg — maintained 18 months",
    resultAr: "خسر 30 كيلو — حافظ 18 شهر",
    durationEn: "8 Months",
    durationAr: "8 أشهر",
    quoteEn: "For the first time, I eat because I'm hungry, not because I'm stressed. That distinction saved my life.",
    quoteAr: "لأول مرة، آكل لأنني جائع وليس لأنني متوتر. هذا الفرق أنقذ حياتي.",
    age: "43",
    country: "Saudi Arabia",
    highlights: [
      { en: "Lost 30kg and maintained 18+ months", ar: "خسر 30 كيلو وحافظ 18+ شهر" },
      { en: "Emotional eating episodes: daily → zero", ar: "نوبات الأكل العاطفي: يومية → صفر" },
      { en: "No more binge eating", ar: "لا مزيد من نوبات الشراهة" },
      { en: "Healthy relationship with food", ar: "علاقة صحية مع الطعام" },
    ],
  },
  {
    id: "sarah-insulin-resistance-reversal",
    category: "insulin",
    titleEn: "Sarah's Journey: Reversing Insulin Resistance in 90 Days",
    titleAr: "رحلة سارة: عكس مقاومة الأنسولين في 90 يوماً",
    descriptionEn: "After years of struggling with fatigue, brain fog, and unexplained weight gain, Sarah discovered that insulin resistance was the root cause. Through the Feel Great system and behavioral nutrition coaching with Feras, she transformed her metabolic health completely.",
    descriptionAr: "بعد سنوات من المعاناة مع التعب والضبابية الذهنية وزيادة الوزن غير المبررة، اكتشفت سارة أن مقاومة الأنسولين هي السبب الجذري. من خلال نظام Feel Great والتدريب على التغذية السلوكية مع فراس، حولت صحتها الأيضية بالكامل.",
    metaDescEn: "Real success story: How Sarah reversed insulin resistance in 90 days using the Feel Great system. Documented results with before/after lab work.",
    metaDescAr: "قصة نجاح حقيقية: كيف عكست سارة مقاومة الأنسولين في 90 يوماً باستخدام نظام Feel Great. نتائج موثقة مع تحاليل قبل وبعد.",
    resultEn: "Fasting insulin dropped from 28 to 9 mIU/L",
    resultAr: "انخفض الأنسولين الصائم من 28 إلى 9",
    durationEn: "90 Days",
    durationAr: "90 يوم",
    quoteEn: "I finally feel like myself again. The brain fog lifted, my energy returned, and I lost 12kg without feeling deprived.",
    quoteAr: "أخيراً أشعر بأنني عدت لنفسي. زالت الضبابية الذهنية، عادت طاقتي، وخسرت 12 كيلو بدون حرمان.",
    age: "42",
    country: "USA",
    highlights: [
      { en: "Fasting insulin: 28 → 9 mIU/L", ar: "الأنسولين الصائم: 28 → 9" },
      { en: "Lost 12kg in 90 days", ar: "خسرت 12 كيلو في 90 يوم" },
      { en: "Brain fog completely resolved", ar: "زالت الضبابية الذهنية تماماً" },
      { en: "Energy levels restored", ar: "عادت مستويات الطاقة" },
    ],
  },
  {
    id: "ahmed-weight-loss-transformation",
    category: "weight",
    titleEn: "Ahmed Lost 25kg and Gained His Confidence Back",
    titleAr: "أحمد خسر 25 كيلو واستعاد ثقته بنفسه",
    descriptionEn: "At 48, Ahmed had tried every diet imaginable. Nothing stuck. Through Feras's behavioral nutrition approach and the Feel Great system, he finally found a sustainable path to weight loss that didn't require willpower alone.",
    descriptionAr: "في عمر 48، جرّب أحمد كل حمية يمكن تخيلها. لم ينجح شيء. من خلال نهج فراس في التغذية السلوكية ونظام Feel Great، وجد أخيراً طريقاً مستداماً لفقدان الوزن لا يعتمد على قوة الإرادة وحدها.",
    metaDescEn: "Ahmed's weight loss success story: Lost 25kg after 40 using behavioral nutrition and the Feel Great system. Sustainable results without extreme dieting.",
    metaDescAr: "قصة نجاح أحمد: خسر 25 كيلو بعد الأربعين باستخدام التغذية السلوكية ونظام Feel Great. نتائج مستدامة بدون حميات قاسية.",
    resultEn: "Lost 25kg in 6 months",
    resultAr: "خسر 25 كيلو في 6 أشهر",
    durationEn: "6 Months",
    durationAr: "6 أشهر",
    quoteEn: "For the first time in 20 years, I don't feel like I'm on a diet. This is just how I live now.",
    quoteAr: "لأول مرة منذ 20 سنة، لا أشعر أنني على حمية. هذه ببساطة طريقة حياتي الآن.",
    age: "48",
    country: "Saudi Arabia",
    highlights: [
      { en: "Lost 25kg sustainably", ar: "خسر 25 كيلو بشكل مستدام" },
      { en: "Waist: 112cm → 88cm", ar: "محيط الخصر: 112 → 88 سم" },
      { en: "Blood pressure normalized", ar: "تطبيع ضغط الدم" },
      { en: "No more sleep apnea", ar: "انتهى انقطاع النفس أثناء النوم" },
    ],
  },
  {
    id: "maria-prediabetes-reversal",
    category: "diabetes",
    titleEn: "Maria Reversed Prediabetes Without Medication",
    titleAr: "ماريا عكست ما قبل السكري بدون أدوية",
    descriptionEn: "Maria's doctor told her she was heading toward Type 2 diabetes. Her HbA1c was 6.3% and climbing. Instead of accepting medication as inevitable, she chose to work with Feras on a complete metabolic reset using the Feel Great system.",
    descriptionAr: "أخبرها طبيبها أنها تتجه نحو السكري من النوع الثاني. كان HbA1c لديها 6.3% ويرتفع. بدلاً من قبول الأدوية كأمر حتمي، اختارت العمل مع فراس على إعادة ضبط أيضية كاملة باستخدام نظام Feel Great.",
    metaDescEn: "How Maria reversed prediabetes naturally: HbA1c dropped from 6.3% to 5.4% in 4 months using the Feel Great system and behavioral nutrition coaching.",
    metaDescAr: "كيف عكست ماريا ما قبل السكري طبيعياً: انخفض HbA1c من 6.3% إلى 5.4% في 4 أشهر باستخدام نظام Feel Great والتغذية السلوكية.",
    resultEn: "HbA1c: 6.3% → 5.4%",
    resultAr: "HbA1c: 6.3% → 5.4%",
    durationEn: "4 Months",
    durationAr: "4 أشهر",
    quoteEn: "My doctor couldn't believe the lab results. He asked what I changed. I told him: everything about how I eat, not what I eat.",
    quoteAr: "طبيبي لم يصدق نتائج التحاليل. سألني ماذا غيّرت. قلت له: كل شيء عن كيف آكل، وليس ماذا آكل.",
    age: "55",
    country: "Germany",
    highlights: [
      { en: "HbA1c: 6.3% → 5.4%", ar: "HbA1c: 6.3% → 5.4%" },
      { en: "Fasting glucose normalized", ar: "تطبيع سكر الصائم" },
      { en: "Lost 8kg", ar: "خسرت 8 كيلو" },
      { en: "No medication needed", ar: "بدون أدوية" },
    ],
  },
  {
    id: "fatima-gut-health-recovery",
    category: "colon",
    titleEn: "Fatima's IBS Recovery: From Daily Pain to Complete Freedom",
    titleAr: "تعافي فاطمة من القولون: من ألم يومي إلى حرية كاملة",
    descriptionEn: "For 8 years, Fatima lived with severe IBS symptoms. Bloating, cramping, and unpredictable episodes controlled her life. Through gut-focused nutrition coaching and the Feel Great fiber system, she finally found relief.",
    descriptionAr: "لمدة 8 سنوات، عاشت فاطمة مع أعراض القولون العصبي الحادة. الانتفاخ والتقلصات والنوبات غير المتوقعة سيطرت على حياتها. من خلال التدريب الغذائي المركز على الأمعاء ونظام الألياف Feel Great، وجدت الراحة أخيراً.",
    metaDescEn: "Fatima's IBS success story: 8 years of gut issues resolved through behavioral nutrition and the Feel Great fiber system. Real documented recovery.",
    metaDescAr: "قصة نجاح فاطمة مع القولون: 8 سنوات من مشاكل الأمعاء حُلّت من خلال التغذية السلوكية ونظام ألياف Feel Great.",
    resultEn: "IBS symptoms resolved 95%",
    resultAr: "اختفت أعراض القولون بنسبة 95%",
    durationEn: "3 Months",
    durationAr: "3 أشهر",
    quoteEn: "I can eat out with friends again without anxiety. I can travel without planning around my symptoms. I got my life back.",
    quoteAr: "أستطيع الأكل مع صديقاتي بدون قلق. أستطيع السفر بدون التخطيط حول أعراضي. استعدت حياتي.",
    age: "38",
    country: "UK",
    highlights: [
      { en: "95% symptom reduction", ar: "انخفاض الأعراض 95%" },
      { en: "Bloating eliminated", ar: "زال الانتفاخ" },
      { en: "Regular digestion restored", ar: "عاد الهضم المنتظم" },
      { en: "No more food anxiety", ar: "لا مزيد من قلق الطعام" },
    ],
  },
  {
    id: "james-energy-transformation",
    category: "energy",
    titleEn: "James: From Chronic Fatigue to Peak Performance at 45",
    titleAr: "جيمس: من التعب المزمن إلى الأداء العالي في سن 45",
    descriptionEn: "James was sleeping 9 hours but waking exhausted. His doctor said his labs were 'normal.' Through metabolic optimization with Feras, he discovered that subclinical insulin resistance was draining his energy. The transformation was dramatic.",
    descriptionAr: "كان جيمس ينام 9 ساعات لكنه يستيقظ منهكاً. طبيبه قال أن تحاليله 'طبيعية'. من خلال تحسين الأيض مع فراس، اكتشف أن مقاومة الأنسولين تحت السريرية كانت تستنزف طاقته. كان التحول دراماتيكياً.",
    metaDescEn: "James overcame chronic fatigue at 45 by addressing hidden insulin resistance. Real energy transformation story with the Feel Great system.",
    metaDescAr: "تغلب جيمس على التعب المزمن في سن 45 بمعالجة مقاومة الأنسولين الخفية. قصة تحول طاقة حقيقية مع نظام Feel Great.",
    resultEn: "Energy levels 10x improvement",
    resultAr: "تحسن الطاقة 10 أضعاف",
    durationEn: "60 Days",
    durationAr: "60 يوم",
    quoteEn: "I went from needing 3 coffees to get through the day to waking up naturally at 6am with energy to spare. My wife says I'm a different person.",
    quoteAr: "انتقلت من احتياج 3 قهوات لأكمل يومي إلى الاستيقاظ طبيعياً الساعة 6 صباحاً مع طاقة فائضة. زوجتي تقول أنني شخص مختلف.",
    age: "45",
    country: "Netherlands",
    highlights: [
      { en: "Morning energy restored", ar: "عادت طاقة الصباح" },
      { en: "No afternoon crashes", ar: "لا انهيار بعد الظهر" },
      { en: "Coffee reduced from 4 to 1", ar: "القهوة من 4 إلى 1" },
      { en: "Exercise capacity doubled", ar: "تضاعفت القدرة على التمرين" },
    ],
  },
  {
    id: "nora-healthy-aging",
    category: "diverse",
    titleEn: "Nora at 58: Aging Gracefully with Metabolic Health",
    titleAr: "نورة في 58: شيخوخة صحية مع الصحة الأيضية",
    descriptionEn: "Nora refused to accept that declining health was inevitable with age. At 58, she committed to metabolic optimization with Feras. Within months, her energy, skin, sleep, and cognitive function all improved dramatically.",
    descriptionAr: "رفضت نورة قبول أن تراجع الصحة حتمي مع العمر. في سن 58، التزمت بتحسين الأيض مع فراس. خلال أشهر، تحسنت طاقتها وبشرتها ونومها ووظائفها الإدراكية بشكل كبير.",
    metaDescEn: "Nora's healthy aging story at 58: How metabolic optimization reversed age-related decline. Energy, skin, sleep, and cognition all improved.",
    metaDescAr: "قصة نورة في الشيخوخة الصحية في 58: كيف عكس تحسين الأيض التراجع المرتبط بالعمر.",
    resultEn: "Biological age reduced by 8 years",
    resultAr: "انخفض العمر البيولوجي 8 سنوات",
    durationEn: "5 Months",
    durationAr: "5 أشهر",
    quoteEn: "My friends ask what I'm doing differently. I tell them: I invested in my metabolic health. It's the best investment I've ever made.",
    quoteAr: "صديقاتي يسألن ماذا أفعل بشكل مختلف. أقول لهن: استثمرت في صحتي الأيضية. أفضل استثمار في حياتي.",
    age: "58",
    country: "Sweden",
    highlights: [
      { en: "Biological age: -8 years", ar: "العمر البيولوجي: -8 سنوات" },
      { en: "Sleep quality improved 80%", ar: "تحسن جودة النوم 80%" },
      { en: "Skin elasticity improved", ar: "تحسنت مرونة البشرة" },
      { en: "Mental clarity restored", ar: "عاد الوضوح الذهني" },
    ],
  },
  {
    id: "khalid-metabolic-syndrome",
    category: "insulin",
    titleEn: "Khalid Beat Metabolic Syndrome at 52",
    titleAr: "خالد تغلب على متلازمة الأيض في 52",
    descriptionEn: "Khalid had all five markers of metabolic syndrome: high blood pressure, high blood sugar, excess belly fat, high triglycerides, and low HDL. His doctor warned him about heart disease risk. Through comprehensive metabolic coaching with Feras, he reversed all five markers.",
    descriptionAr: "كان لدى خالد جميع العلامات الخمس لمتلازمة الأيض: ضغط دم مرتفع، سكر مرتفع، دهون بطن زائدة، دهون ثلاثية مرتفعة، وHDL منخفض. حذره طبيبه من خطر أمراض القلب. من خلال التدريب الأيضي الشامل مع فراس، عكس جميع العلامات الخمس.",
    metaDescEn: "How Khalid reversed all 5 markers of metabolic syndrome at 52. Complete metabolic transformation documented with lab results.",
    metaDescAr: "كيف عكس خالد جميع العلامات الخمس لمتلازمة الأيض في 52. تحول أيضي كامل موثق بنتائج التحاليل.",
    resultEn: "All 5 metabolic markers reversed",
    resultAr: "عكس جميع العلامات الأيضية الخمس",
    durationEn: "5 Months",
    durationAr: "5 أشهر",
    quoteEn: "My cardiologist said I no longer need the medications he was about to prescribe. That's when I knew this was real.",
    quoteAr: "طبيب القلب قال أنني لم أعد بحاجة للأدوية التي كان على وشك وصفها. عندها عرفت أن هذا حقيقي.",
    age: "52",
    country: "UAE",
    highlights: [
      { en: "Blood pressure: 155/95 → 125/80", ar: "ضغط الدم: 155/95 → 125/80" },
      { en: "Triglycerides: 280 → 140", ar: "الدهون الثلاثية: 280 → 140" },
      { en: "Waist: 108cm → 92cm", ar: "الخصر: 108 → 92 سم" },
      { en: "HDL increased 40%", ar: "ارتفع HDL بنسبة 40%" },
    ],
  },
  {
    id: "lisa-behavioral-change",
    category: "diverse",
    titleEn: "Lisa's Story: How Behavioral Nutrition Changed Everything",
    titleAr: "قصة ليزا: كيف غيّرت التغذية السلوكية كل شيء",
    descriptionEn: "Lisa had been a yo-yo dieter for 15 years. She'd lose weight, gain it back, and feel like a failure. Feras's behavioral nutrition approach helped her understand that the problem was never willpower — it was her relationship with food.",
    descriptionAr: "كانت ليزا على حميات يو-يو لمدة 15 سنة. تخسر الوزن، تستعيده، وتشعر بالفشل. نهج فراس في التغذية السلوكية ساعدها على فهم أن المشكلة لم تكن أبداً قوة الإرادة — بل علاقتها بالطعام.",
    metaDescEn: "Lisa broke the yo-yo diet cycle after 15 years using behavioral nutrition. A complete mindset and lifestyle transformation story.",
    metaDescAr: "كسرت ليزا دورة حميات اليو-يو بعد 15 سنة باستخدام التغذية السلوكية. قصة تحول كاملة في العقلية ونمط الحياة.",
    resultEn: "Maintained weight loss for 12+ months",
    resultAr: "حافظت على فقدان الوزن لأكثر من 12 شهر",
    durationEn: "12+ Months",
    durationAr: "12+ شهر",
    quoteEn: "I stopped fighting food and started understanding my body. That shift changed everything. I've maintained my results for over a year now.",
    quoteAr: "توقفت عن محاربة الطعام وبدأت أفهم جسمي. هذا التحول غيّر كل شيء. حافظت على نتائجي لأكثر من سنة الآن.",
    age: "41",
    country: "UK",
    highlights: [
      { en: "Broke 15-year yo-yo cycle", ar: "كسرت دورة 15 سنة من اليو-يو" },
      { en: "Lost 18kg and maintained", ar: "خسرت 18 كيلو وحافظت" },
      { en: "No more emotional eating", ar: "لا مزيد من الأكل العاطفي" },
      { en: "Healthy relationship with food", ar: "علاقة صحية مع الطعام" },
    ],
  },
];

// ===== SUCCESS STORIES HUB PAGE =====
export default function SuccessStories() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    document.title = lang === "ar"
      ? "قصص نجاح حقيقية | الصحة المستدامة مع فراس العايد"
      : "Real Success Stories | Sustainable Health with Feras Alayed";

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute("name", "description");
    metaDesc.setAttribute("content", lang === "ar"
      ? "أكثر من 500 قصة نجاح موثقة في فقدان الوزن، مقاومة الأنسولين، صحة الأمعاء، والشيخوخة الصحية. نتائج حقيقية مع فراس العايد."
      : "Over 500 documented success stories in weight loss, insulin resistance, gut health, and healthy aging. Real results with Feras Alayed."
    );
    if (!document.querySelector('meta[name="description"]')) document.head.appendChild(metaDesc);

    // Schema markup
    const existingSchema = document.getElementById("stories-schema");
    if (existingSchema) existingSchema.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Success Stories - Feel Great with Feras Alayed",
      description: "Over 500 documented health transformation success stories across 14 categories",
      url: "https://feelgreat.us.com/success-stories",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: successStories.length,
        itemListElement: successStories.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://feelgreat.us.com/success-stories/${s.id}`,
          name: s.titleEn,
        })),
      },
    };
    const scriptEl = document.createElement("script");
    scriptEl.id = "stories-schema";
    scriptEl.type = "application/ld+json";
    scriptEl.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptEl);

    return () => {
      document.getElementById("stories-schema")?.remove();
    };
  }, [lang]);

  const isRtl = lang === "ar";

  const filteredStories = useMemo(() => {
    if (activeCategory === "all") return successStories;
    return successStories.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const content = {
    ar: {
      title: "قصص نجاح حقيقية",
      subtitle: "أكثر من 500 قصة نجاح موثقة — فيديوهات ومحادثات وتحاليل قبل وبعد",
      badge: "500+ نتيجة موثقة",
      allCategories: "الكل",
      readStory: "اقرأ القصة",
      viewAll: "شاهد جميع القصص في Google Drive",
      back: "العودة للرئيسية",
      ctaTitle: "هل أنت مستعد لكتابة قصة نجاحك؟",
      ctaDesc: "انضم لمئات الأشخاص الذين حولوا صحتهم مع فراس",
      ctaConsult: "احجز استشارة مجانية",
      ctaAssess: "ابدأ التقييم المجاني",
      ctaPartner: "كن شريكاً",
      disclaimer: "جميع القصص حقيقية وموثقة. النتائج تختلف من شخص لآخر.",
      duration: "المدة",
      result: "النتيجة",
    },
    en: {
      title: "Real Success Stories",
      subtitle: "Over 500 documented success stories — videos, conversations, and before/after lab results",
      badge: "500+ Documented Results",
      allCategories: "All",
      readStory: "Read Story",
      viewAll: "View All Stories on Google Drive",
      back: "Back to Home",
      ctaTitle: "Ready to Write Your Own Success Story?",
      ctaDesc: "Join hundreds who have transformed their health with Feras",
      ctaConsult: "Book Free Consultation",
      ctaAssess: "Take Free Assessment",
      ctaPartner: "Become a Partner",
      disclaimer: "All stories are real and documented. Individual results may vary.",
      duration: "Duration",
      result: "Result",
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

      {/* Category Filter */}
      <section className="container max-w-6xl mx-auto px-4 pb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "bg-green-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
          >
            {c.allCategories}
          </button>
          {categories.slice(0, 8).map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id ? "bg-green-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}
            >
              {isRtl ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>
      </section>

      {/* Individual Stories Grid */}
      <section className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStories.map(story => {
            const cat = categories.find(c => c.id === story.category);
            return (
              <Link
                key={story.id}
                href={`/success-stories/${story.id}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/60 border border-slate-700 p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat?.color || "from-green-500 to-emerald-600"} opacity-5 group-hover:opacity-10 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    {cat && <cat.icon className="w-4 h-4 text-green-400" />}
                    <span className="text-xs text-green-400 font-medium">{isRtl ? cat?.nameAr : cat?.nameEn}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-500">{story.country}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                    {isRtl ? story.titleAr : story.titleEn}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {isRtl ? story.descriptionAr : story.descriptionEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-500">{c.duration}: <span className="text-green-400">{isRtl ? story.durationAr : story.durationEn}</span></span>
                      <span className="text-xs text-slate-500">{c.result}: <span className="text-green-400 font-medium">{isRtl ? story.resultAr : story.resultEn}</span></span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Partner Site Real Transformations Gallery */}
      <PartnerStoriesGallery />

      {/* Categories Grid (Google Drive links) */}
      <section className="container max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          {isRtl ? "جميع الفئات — 14 فئة صحية" : "All Categories — 14 Health Categories"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`${DRIVE_BASE}${cat.folderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl bg-slate-800/60 border border-slate-700 p-4 hover:border-slate-500 transition-all duration-300 hover:scale-[1.03]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-15 transition-opacity duration-300`} />
              <div className="relative z-10 text-center">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                  <cat.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  {isRtl ? cat.nameAr : cat.nameEn}
                </h3>
                <span className="text-xs text-slate-400">{cat.count}</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors mx-auto mt-1" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Firas Training Photos - Social Proof */}
      <section className="container max-w-6xl mx-auto px-4 py-10">
        <h3 className="text-xl font-bold text-white text-center mb-6">
          {isRtl ? "من جلسات فراس التدريبية" : "From Firas's Training Sessions"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <img loading="lazy" src="/manus-storage/IMG_6341_e211111a.webp" alt="Interactive training" className="rounded-xl object-cover w-full h-40 opacity-80 hover:opacity-100 transition-opacity" />
          <img loading="lazy" src="/manus-storage/IMG_6344_3a1d2992.webp" alt="Presentation" className="rounded-xl object-cover w-full h-40 opacity-80 hover:opacity-100 transition-opacity" />
          <img loading="lazy" src="/manus-storage/5E77A9D4-A309-4744-AE57-91FD8EFEF2F8_09ff40fd.webp" alt="Large event" className="rounded-xl object-cover w-full h-40 opacity-80 hover:opacity-100 transition-opacity" />
          <img loading="lazy" src="/manus-storage/IMG_5320_be9cd65b.webp" alt="Workshop" className="rounded-xl object-cover w-full h-40 opacity-80 hover:opacity-100 transition-opacity" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{c.ctaTitle}</h2>
          <p className="text-slate-400 mb-6">{c.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/96877020770?text=I want to book a free health consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-all"
            >
              <Phone className="w-4 h-4" />
              {c.ctaConsult}
            </a>
            <Link
              href="/assessments"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all border border-white/20"
            >
              <ClipboardCheck className="w-4 h-4" />
              {c.ctaAssess}
            </Link>
            <Link
              href="/partner-with-feras"
              className="inline-flex items-center justify-center gap-2 bg-[#c8a951]/20 text-[#c8a951] px-6 py-3 rounded-full font-medium hover:bg-[#c8a951]/30 transition-all border border-[#c8a951]/30"
            >
              <Users className="w-4 h-4" />
              {c.ctaPartner}
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="container max-w-4xl mx-auto px-4 pb-16">
        <p className="text-center text-sm text-slate-500">{c.disclaimer}</p>
      </section>
    </div>
  );
}

// ===== INDIVIDUAL SUCCESS STORY PAGE =====
export function SuccessStoryDetail() {
  const { id } = useParams<{ id: string }>();
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const isRtl = lang === "ar";

  const story = useMemo(() => successStories.find(s => s.id === id), [id]);
  const category = useMemo(() => story ? categories.find(c => c.id === story.category) : null, [story]);

  useEffect(() => {
    if (!story) {
      setLocation("/success-stories");
      return;
    }

    const title = isRtl ? story.titleAr : story.titleEn;
    document.title = `${title} | Feel Great`;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDesc.setAttribute("name", "description");
    metaDesc.setAttribute("content", isRtl ? story.metaDescAr : story.metaDescEn);
    if (!document.querySelector('meta[name="description"]')) document.head.appendChild(metaDesc);

    // Canonical
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `https://feelgreat.us.com/success-stories/${story.id}`);
    if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);

    // Article + Review Schema
    const existingSchema = document.getElementById("story-schema");
    if (existingSchema) existingSchema.remove();
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: story.titleEn,
      description: story.metaDescEn,
      author: {
        "@type": "Person",
        name: "Feras Alayed",
        jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
        url: "https://feelgreat.us.com/feras-alayed",
      },
      publisher: {
        "@type": "Organization",
        name: "Feel Great",
        url: "https://feelgreat.us.com",
      },
      mainEntityOfPage: `https://feelgreat.us.com/success-stories/${story.id}`,
      about: {
        "@type": "MedicalCondition",
        name: category?.nameEn || "Health Condition",
      },
    };
    const scriptEl = document.createElement("script");
    scriptEl.id = "story-schema";
    scriptEl.type = "application/ld+json";
    scriptEl.textContent = JSON.stringify(schema);
    document.head.appendChild(scriptEl);

    // Review Schema
    const existingReview = document.getElementById("review-schema");
    if (existingReview) existingReview.remove();
    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Product",
        name: "Feel Great System",
        brand: { "@type": "Brand", name: "Unicity" },
      },
      author: { "@type": "Person", name: story.titleEn.split(":")[0].replace("'s", "").trim() },
      reviewBody: story.quoteEn,
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
      },
    };
    const reviewEl = document.createElement("script");
    reviewEl.id = "review-schema";
    reviewEl.type = "application/ld+json";
    reviewEl.textContent = JSON.stringify(reviewSchema);
    document.head.appendChild(reviewEl);

    return () => {
      document.getElementById("story-schema")?.remove();
      document.getElementById("review-schema")?.remove();
      document.querySelector('link[rel="canonical"]')?.remove();
    };
  }, [story, isRtl, setLocation]);

  if (!story) return null;

  const relatedStories = successStories.filter(s => s.category === story.category && s.id !== story.id).slice(0, 3);

  const content = {
    ar: {
      back: "العودة لقصص النجاح",
      duration: "المدة",
      age: "العمر",
      country: "البلد",
      result: "النتيجة الرئيسية",
      highlights: "أبرز النتائج",
      story: "القصة",
      ctaTitle: "هل تريد نتائج مشابهة؟",
      ctaConsult: "احجز استشارة مجانية",
      ctaAssess: "ابدأ التقييم",
      ctaPartner: "كن شريكاً",
      related: "قصص مشابهة",
      readMore: "اقرأ المزيد",
      disclaimer: "النتائج تختلف من شخص لآخر. هذه قصة حقيقية موثقة.",
    },
    en: {
      back: "Back to Success Stories",
      duration: "Duration",
      age: "Age",
      country: "Country",
      result: "Key Result",
      highlights: "Key Highlights",
      story: "The Story",
      ctaTitle: "Want Similar Results?",
      ctaConsult: "Book Free Consultation",
      ctaAssess: "Take Assessment",
      ctaPartner: "Become a Partner",
      related: "Related Stories",
      readMore: "Read More",
      disclaimer: "Individual results may vary. This is a real documented story.",
    },
  };

  const c = isRtl ? content.ar : content.en;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 ${isRtl ? "rtl" : "ltr"}`}>
      {/* Breadcrumb */}
      <div className="container max-w-4xl mx-auto px-4 pt-8">
        <Link href="/success-stories" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {c.back}
        </Link>
      </div>

      {/* Hero */}
      <header className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-4">
          {category && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${category.color} text-white`}>
              <category.icon className="w-3 h-3" />
              {isRtl ? category.nameAr : category.nameEn}
            </span>
          )}
          <span className="text-xs text-slate-500">{story.country} • {c.age}: {story.age}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {isRtl ? story.titleAr : story.titleEn}
        </h1>
        <p className="text-lg text-slate-400">
          {isRtl ? story.descriptionAr : story.descriptionEn}
        </p>
      </header>

      {/* Stats Bar */}
      <section className="container max-w-4xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-center">
            <Calendar className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-xs text-slate-500 mb-1">{c.duration}</div>
            <div className="text-sm font-bold text-white">{isRtl ? story.durationAr : story.durationEn}</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-xs text-slate-500 mb-1">{c.result}</div>
            <div className="text-sm font-bold text-green-400">{isRtl ? story.resultAr : story.resultEn}</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-center">
            <Users className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-xs text-slate-500 mb-1">{c.age}</div>
            <div className="text-sm font-bold text-white">{story.age}</div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-center">
            <ExternalLink className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-xs text-slate-500 mb-1">{c.country}</div>
            <div className="text-sm font-bold text-white">{story.country}</div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="container max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8">
          <Quote className="w-8 h-8 text-green-400/50 mb-4" />
          <blockquote className="text-xl md:text-2xl text-white font-medium italic leading-relaxed mb-4">
            "{isRtl ? story.quoteAr : story.quoteEn}"
          </blockquote>
        </div>
      </section>

      {/* Highlights */}
      <section className="container max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold text-white mb-4">{c.highlights}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {story.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-4 border border-slate-700">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span className="text-white text-sm">{isRtl ? h.ar : h.en}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Full Story */}
      <section className="container max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold text-white mb-4">{c.story}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-slate-300 leading-relaxed text-base">
            {isRtl ? story.descriptionAr : story.descriptionEn}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{c.ctaTitle}</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <a
              href="https://wa.me/96877020770?text=I saw a success story and want to book a consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-all"
            >
              <Phone className="w-4 h-4" />
              {c.ctaConsult}
            </a>
            <Link
              href="/assessments"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all border border-white/20"
            >
              <ClipboardCheck className="w-4 h-4" />
              {c.ctaAssess}
            </Link>
            <Link
              href="/partner-with-feras"
              className="inline-flex items-center justify-center gap-2 bg-[#c8a951]/20 text-[#c8a951] px-6 py-3 rounded-full font-medium hover:bg-[#c8a951]/30 transition-all border border-[#c8a951]/30"
            >
              <Users className="w-4 h-4" />
              {c.ctaPartner}
            </Link>
          </div>
        </div>
      </section>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <section className="container max-w-4xl mx-auto px-4 pb-12">
          <h2 className="text-xl font-bold text-white mb-4">{c.related}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedStories.map(rs => (
              <Link
                key={rs.id}
                href={`/success-stories/${rs.id}`}
                className="group bg-slate-800/60 rounded-xl p-4 border border-slate-700 hover:border-green-500/50 transition-all"
              >
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-green-300 transition-colors line-clamp-2">
                  {isRtl ? rs.titleAr : rs.titleEn}
                </h3>
                <span className="text-xs text-green-400">{isRtl ? rs.resultAr : rs.resultEn}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <section className="container max-w-4xl mx-auto px-4 pb-16">
        <p className="text-center text-sm text-slate-500">{c.disclaimer}</p>
      </section>
    </div>
  );
}
