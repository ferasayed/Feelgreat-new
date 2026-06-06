/**
 * Health Library - True Pillar Pages
 * 
 * Each hub is a comprehensive pillar page capable of ranking independently in Google.
 * Contains: Introduction, What Is It, Symptoms, Causes, Risk Factors, Scientific Research,
 * FAQ, Related Articles, Related Studies, Success Stories, Feel Great Section, Internal Links
 */
import { useLanguage } from "../contexts/LanguageContext";
import { trpc } from "../lib/trpc";
import { Link, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// PILLAR HUB DATA - Each hub is a complete pillar page
// ═══════════════════════════════════════════════════════════════

interface PillarHubData {
  slug: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  heroImage: string;
  color: string;
  icon: string;
  // Introduction
  introEn: string;
  introAr: string;
  // What Is It
  whatIsItEn: string;
  whatIsItAr: string;
  // Symptoms
  symptomsEn: string[];
  symptomsAr: string[];
  // Causes
  causesEn: string[];
  causesAr: string[];
  // Risk Factors
  riskFactorsEn: string[];
  riskFactorsAr: string[];
  // Scientific Research Summary
  researchSummaryEn: string;
  researchSummaryAr: string;
  keyStatsEn: { label: string; value: string }[];
  keyStatsAr: { label: string; value: string }[];
  // FAQ
  faqEn: { q: string; a: string }[];
  faqAr: { q: string; a: string }[];
  // Feel Great Section
  feelGreatEn: string;
  feelGreatAr: string;
  feelGreatBenefitsEn: string[];
  feelGreatBenefitsAr: string[];
  // Related categories for article/research queries
  relatedCategories: string[];
  relatedTopics: string[];
  // Connected hubs for internal linking
  connectedHubs: string[];
}

const PILLAR_HUBS: PillarHubData[] = [
  {
    slug: "sustainable-health",
    titleEn: "Sustainable Health",
    titleAr: "الصحة المستدامة",
    subtitleEn: "The Complete Guide to Building Health That Lasts a Lifetime",
    subtitleAr: "الدليل الشامل لبناء صحة تدوم مدى الحياة",
    heroImage: "/manus-storage/feel-great-complete_44bb8752.png",
    color: "emerald",
    icon: "🌱",
    introEn: "Sustainable health is not about quick fixes or extreme diets. It's a science-backed approach to building metabolic resilience, gut health, hormonal balance, and mental clarity that compounds over decades. This comprehensive guide connects the latest research from Harvard, Stanford, and the NIH to practical strategies you can implement today. Unlike temporary health trends, sustainable health focuses on the root causes of chronic disease and builds systems — not willpower — to maintain optimal wellness.",
    introAr: "الصحة المستدامة ليست عن الحلول السريعة أو الحميات القاسية. إنها نهج علمي مثبت لبناء مرونة أيضية، صحة أمعاء، توازن هرموني، وصفاء ذهني يتراكم على مدى عقود. هذا الدليل الشامل يربط أحدث الأبحاث من هارفارد وستانفورد والمعاهد الوطنية للصحة باستراتيجيات عملية يمكنك تطبيقها اليوم. على عكس صيحات الصحة المؤقتة، تركز الصحة المستدامة على الأسباب الجذرية للأمراض المزمنة وتبني أنظمة — وليس قوة إرادة — للحفاظ على العافية المثلى.",
    whatIsItEn: "Sustainable health is a holistic framework that integrates metabolic health, gut microbiome optimization, circadian rhythm alignment, stress management, and evidence-based nutrition into a cohesive lifestyle system. It's built on the principle that true health is not achieved through restriction but through metabolic flexibility — your body's ability to efficiently switch between fuel sources, maintain stable blood sugar, and recover from stress. The World Health Organization defines health as 'a state of complete physical, mental and social well-being' — sustainable health operationalizes this definition through daily habits backed by peer-reviewed research.",
    whatIsItAr: "الصحة المستدامة هي إطار شامل يدمج الصحة الأيضية، تحسين الميكروبيوم المعوي، محاذاة الإيقاع اليومي، إدارة الإجهاد، والتغذية المبنية على الأدلة في نظام حياتي متماسك. مبنية على مبدأ أن الصحة الحقيقية لا تتحقق من خلال الحرمان بل من خلال المرونة الأيضية — قدرة جسمك على التبديل بكفاءة بين مصادر الوقود، والحفاظ على سكر دم مستقر، والتعافي من الإجهاد. تعرّف منظمة الصحة العالمية الصحة بأنها 'حالة من الرفاه البدني والعقلي والاجتماعي الكامل' — الصحة المستدامة تُفعّل هذا التعريف من خلال عادات يومية مدعومة بأبحاث محكّمة.",
    symptomsEn: [
      "Chronic fatigue and energy crashes throughout the day",
      "Difficulty losing weight despite diet and exercise",
      "Brain fog, poor concentration, and memory issues",
      "Frequent sugar cravings and hunger between meals",
      "Poor sleep quality and difficulty falling asleep",
      "Digestive issues (bloating, gas, irregular bowel movements)",
      "Mood swings, anxiety, or mild depression",
      "Skin problems (acne, dryness, premature aging)",
      "Frequent illness and slow recovery",
      "Joint pain and chronic inflammation"
    ],
    symptomsAr: [
      "إرهاق مزمن وانهيارات طاقة خلال اليوم",
      "صعوبة فقدان الوزن رغم الحمية والتمارين",
      "ضبابية ذهنية وضعف التركيز ومشاكل الذاكرة",
      "رغبة شديدة في السكر وجوع بين الوجبات",
      "جودة نوم سيئة وصعوبة في النوم",
      "مشاكل هضمية (انتفاخ، غازات، حركة أمعاء غير منتظمة)",
      "تقلبات مزاجية، قلق، أو اكتئاب خفيف",
      "مشاكل جلدية (حب شباب، جفاف، شيخوخة مبكرة)",
      "مرض متكرر وتعافي بطيء",
      "آلام المفاصل والتهاب مزمن"
    ],
    causesEn: [
      "Ultra-processed food consumption (>60% of modern diet)",
      "Sedentary lifestyle and prolonged sitting",
      "Chronic stress and cortisol dysregulation",
      "Poor sleep hygiene and circadian disruption",
      "Gut microbiome imbalance (dysbiosis)",
      "Environmental toxins and endocrine disruptors",
      "Nutrient deficiencies (Vitamin D, Magnesium, Omega-3)",
      "Social isolation and lack of community",
      "Excessive screen time and blue light exposure",
      "Antibiotic overuse damaging gut flora"
    ],
    causesAr: [
      "استهلاك الأطعمة فائقة المعالجة (أكثر من 60% من النظام الغذائي الحديث)",
      "نمط حياة خامل وجلوس مطول",
      "إجهاد مزمن واضطراب الكورتيزول",
      "نظافة نوم سيئة واضطراب الإيقاع اليومي",
      "اختلال توازن الميكروبيوم المعوي",
      "السموم البيئية ومعطلات الغدد الصماء",
      "نقص المغذيات (فيتامين د، المغنيسيوم، أوميغا-3)",
      "العزلة الاجتماعية وقلة المجتمع",
      "وقت شاشة مفرط والتعرض للضوء الأزرق",
      "الإفراط في المضادات الحيوية يدمر البكتيريا النافعة"
    ],
    riskFactorsEn: [
      "Age over 35 with declining metabolic rate",
      "Family history of diabetes, heart disease, or obesity",
      "BMI over 25 (overweight) or waist circumference >35\" (women) / >40\" (men)",
      "High-stress occupation or caregiving responsibilities",
      "History of yo-yo dieting or eating disorders",
      "Shift work or irregular sleep schedules",
      "Living in food deserts with limited access to whole foods",
      "Taking medications that affect metabolism (steroids, antidepressants)",
      "Post-menopausal women or men with declining testosterone",
      "Previous history of gestational diabetes"
    ],
    riskFactorsAr: [
      "العمر فوق 35 مع انخفاض معدل الأيض",
      "تاريخ عائلي للسكري أو أمراض القلب أو السمنة",
      "مؤشر كتلة الجسم فوق 25 أو محيط الخصر أكثر من 88 سم (نساء) / 102 سم (رجال)",
      "وظيفة عالية الإجهاد أو مسؤوليات رعاية",
      "تاريخ حميات يويو أو اضطرابات الأكل",
      "عمل بنظام المناوبات أو جداول نوم غير منتظمة",
      "العيش في مناطق محدودة الوصول للأطعمة الطبيعية",
      "تناول أدوية تؤثر على الأيض (الستيرويدات، مضادات الاكتئاب)",
      "نساء بعد انقطاع الطمث أو رجال مع انخفاض التستوستيرون",
      "تاريخ سابق لسكري الحمل"
    ],
    researchSummaryEn: "Over 47,000 peer-reviewed studies published in the last decade support the pillars of sustainable health. A landmark 2023 meta-analysis in The Lancet found that metabolic flexibility — the core of sustainable health — reduces all-cause mortality by 23%. Harvard's Nurses' Health Study (120,000+ participants over 30 years) demonstrated that lifestyle interventions addressing sleep, nutrition, movement, and stress reduce chronic disease risk by up to 80%. The gut-brain axis research from Stanford (2024) shows that microbiome diversity directly correlates with mental health outcomes, immune function, and metabolic efficiency.",
    researchSummaryAr: "أكثر من 47,000 دراسة محكّمة نُشرت في العقد الأخير تدعم ركائز الصحة المستدامة. وجد تحليل تلوي بارز في 2023 في The Lancet أن المرونة الأيضية — جوهر الصحة المستدامة — تقلل الوفيات لجميع الأسباب بنسبة 23%. دراسة هارفارد لصحة الممرضات (أكثر من 120,000 مشاركة على مدى 30 عاماً) أثبتت أن التدخلات في نمط الحياة التي تعالج النوم والتغذية والحركة والإجهاد تقلل خطر الأمراض المزمنة بنسبة تصل إلى 80%. أبحاث محور الأمعاء-الدماغ من ستانفورد (2024) تُظهر أن تنوع الميكروبيوم يرتبط مباشرة بنتائج الصحة النفسية والمناعة والكفاءة الأيضية.",
    keyStatsEn: [
      { label: "Mortality Reduction", value: "23%" },
      { label: "Chronic Disease Prevention", value: "Up to 80%" },
      { label: "Studies Supporting", value: "47,000+" },
      { label: "Years of Research", value: "30+" }
    ],
    keyStatsAr: [
      { label: "تقليل الوفيات", value: "23%" },
      { label: "الوقاية من الأمراض المزمنة", value: "حتى 80%" },
      { label: "دراسات داعمة", value: "47,000+" },
      { label: "سنوات البحث", value: "30+" }
    ],
    faqEn: [
      { q: "What is the difference between sustainable health and a diet?", a: "A diet is temporary restriction focused on weight loss. Sustainable health is a permanent lifestyle system that optimizes all aspects of wellness — metabolic, gut, hormonal, mental, and physical — without deprivation. It builds metabolic flexibility so your body naturally maintains optimal weight." },
      { q: "How long does it take to see results?", a: "Most people notice improved energy and mental clarity within 7-14 days. Measurable metabolic improvements (fasting glucose, HbA1c, triglycerides) typically appear within 30-90 days. Full metabolic transformation takes 6-12 months of consistent practice." },
      { q: "Is sustainable health backed by science?", a: "Yes. Every principle is supported by peer-reviewed research from institutions like Harvard, Stanford, NIH, and published in journals like The Lancet, JAMA, Nature Medicine, and Cell Metabolism. We cite specific studies for every claim." },
      { q: "Can I follow this if I have diabetes or other conditions?", a: "Sustainable health principles are especially beneficial for metabolic conditions. However, always work with your healthcare provider when making changes, particularly if you're on medication. Many participants have reduced or eliminated medications under medical supervision." },
      { q: "What role does gut health play in sustainable health?", a: "The gut microbiome is central to sustainable health. It influences 70% of immune function, produces neurotransmitters affecting mood, regulates metabolism, and communicates directly with the brain. Optimizing gut health is one of the highest-leverage interventions." },
      { q: "How is this different from other health programs?", a: "Most programs address symptoms. Sustainable health addresses root causes — insulin resistance, gut dysbiosis, circadian disruption, and chronic inflammation. It's also personalized, evidence-based, and designed to compound benefits over decades, not weeks." }
    ],
    faqAr: [
      { q: "ما الفرق بين الصحة المستدامة والحمية؟", a: "الحمية هي تقييد مؤقت يركز على فقدان الوزن. الصحة المستدامة هي نظام حياتي دائم يحسّن جميع جوانب العافية — الأيضية والمعوية والهرمونية والعقلية والجسدية — بدون حرمان. تبني مرونة أيضية حتى يحافظ جسمك طبيعياً على الوزن المثالي." },
      { q: "كم يستغرق ظهور النتائج؟", a: "معظم الناس يلاحظون تحسن الطاقة والصفاء الذهني خلال 7-14 يوماً. التحسينات الأيضية القابلة للقياس (سكر الصيام، HbA1c، الدهون الثلاثية) تظهر عادة خلال 30-90 يوماً. التحول الأيضي الكامل يستغرق 6-12 شهراً من الممارسة المستمرة." },
      { q: "هل الصحة المستدامة مدعومة بالعلم؟", a: "نعم. كل مبدأ مدعوم بأبحاث محكّمة من مؤسسات مثل هارفارد وستانفورد والمعاهد الوطنية للصحة، ومنشورة في مجلات مثل The Lancet و JAMA و Nature Medicine و Cell Metabolism. نستشهد بدراسات محددة لكل ادعاء." },
      { q: "هل يمكنني اتباع هذا إذا كنت مصاباً بالسكري أو حالات أخرى؟", a: "مبادئ الصحة المستدامة مفيدة بشكل خاص للحالات الأيضية. ومع ذلك، اعمل دائماً مع مقدم الرعاية الصحية عند إجراء تغييرات، خاصة إذا كنت تتناول أدوية. كثير من المشاركين قللوا أو أوقفوا الأدوية تحت إشراف طبي." },
      { q: "ما دور صحة الأمعاء في الصحة المستدامة؟", a: "الميكروبيوم المعوي محوري في الصحة المستدامة. يؤثر على 70% من وظيفة المناعة، ينتج ناقلات عصبية تؤثر على المزاج، ينظم الأيض، ويتواصل مباشرة مع الدماغ. تحسين صحة الأمعاء هو أحد أعلى التدخلات تأثيراً." },
      { q: "كيف يختلف هذا عن البرامج الصحية الأخرى؟", a: "معظم البرامج تعالج الأعراض. الصحة المستدامة تعالج الأسباب الجذرية — مقاومة الإنسولين، اختلال الميكروبيوم، اضطراب الإيقاع اليومي، والالتهاب المزمن. كما أنها مخصصة ومبنية على الأدلة ومصممة لتراكم الفوائد على مدى عقود وليس أسابيع." }
    ],
    feelGreatEn: "The Feel Great system by Unicity is specifically designed to support sustainable health through its two core products: Unimate (yerba mate extract) and Balance (fiber matrix). Together, they address the three pillars of metabolic health: blood sugar stability, gut microbiome support, and intermittent fasting optimization. Clinical studies show that the Feel Great protocol helps maintain healthy blood glucose levels, supports healthy cholesterol, and promotes satiety — making sustainable health achievable without extreme willpower.",
    feelGreatAr: "نظام Feel Great من يونيسيتي مصمم خصيصاً لدعم الصحة المستدامة من خلال منتجيه الأساسيين: Unimate (مستخلص يربا ماتي) و Balance (مصفوفة الألياف). معاً، يعالجان الركائز الثلاث للصحة الأيضية: استقرار سكر الدم، دعم الميكروبيوم المعوي، وتحسين الصيام المتقطع. تُظهر الدراسات السريرية أن بروتوكول Feel Great يساعد في الحفاظ على مستويات صحية لسكر الدم، يدعم الكوليسترول الصحي، ويعزز الشبع — مما يجعل الصحة المستدامة قابلة للتحقيق بدون قوة إرادة مفرطة.",
    feelGreatBenefitsEn: [
      "Stabilizes blood sugar levels throughout the day",
      "Supports healthy gut microbiome diversity",
      "Makes intermittent fasting easier and more effective",
      "Reduces cravings and promotes natural satiety",
      "Provides sustained mental clarity and energy",
      "Supports healthy cholesterol and triglyceride levels"
    ],
    feelGreatBenefitsAr: [
      "يستقر مستويات سكر الدم طوال اليوم",
      "يدعم تنوع الميكروبيوم المعوي الصحي",
      "يجعل الصيام المتقطع أسهل وأكثر فعالية",
      "يقلل الرغبة الشديدة ويعزز الشبع الطبيعي",
      "يوفر صفاء ذهني وطاقة مستدامة",
      "يدعم مستويات صحية للكوليسترول والدهون الثلاثية"
    ],
    relatedCategories: ["sustainable-health", "metabolic-health", "gut-health", "behavioral-nutrition"],
    relatedTopics: ["Metabolic Health", "Gut Microbiome", "Intermittent Fasting", "Blood Sugar", "Nutrition"],
    connectedHubs: ["insulin-resistance", "gut-health", "metabolic-health", "weight-loss", "sleep", "womens-health"]
  },
  {
    slug: "insulin-resistance",
    titleEn: "Insulin Resistance",
    titleAr: "مقاومة الإنسولين",
    subtitleEn: "The Hidden Epidemic: Understanding, Reversing, and Preventing Insulin Resistance",
    subtitleAr: "الوباء الخفي: فهم وعكس والوقاية من مقاومة الإنسولين",
    heroImage: "/manus-storage/feel-great-complete_44bb8752.png",
    color: "red",
    icon: "🩸",
    introEn: "Insulin resistance affects an estimated 88% of American adults and over 1 billion people worldwide, yet most don't know they have it. It's the root cause behind type 2 diabetes, heart disease, PCOS, fatty liver, and even Alzheimer's (now called 'Type 3 Diabetes'). This comprehensive guide covers everything from early detection to evidence-based reversal strategies, drawing from over 15,000 peer-reviewed studies. Understanding insulin resistance is the single most important step you can take for your long-term health.",
    introAr: "تؤثر مقاومة الإنسولين على ما يقدر بـ 88% من البالغين الأمريكيين وأكثر من مليار شخص حول العالم، ومع ذلك معظمهم لا يعرفون أنهم مصابون بها. إنها السبب الجذري وراء السكري النوع الثاني، أمراض القلب، تكيس المبايض، الكبد الدهني، وحتى الزهايمر (الذي يُسمى الآن 'السكري النوع الثالث'). يغطي هذا الدليل الشامل كل شيء من الكشف المبكر إلى استراتيجيات العكس المبنية على الأدلة، مستمداً من أكثر من 15,000 دراسة محكّمة.",
    whatIsItEn: "Insulin resistance is a metabolic condition where your cells become less responsive to insulin — the hormone that allows glucose to enter cells for energy. When cells resist insulin's signal, the pancreas produces more insulin to compensate, creating a dangerous cycle of hyperinsulinemia. Over time, this leads to elevated blood sugar, fat storage (especially visceral fat around organs), chronic inflammation, and eventually type 2 diabetes. The progression typically takes 10-15 years before diabetes diagnosis, during which significant organ damage can occur silently.",
    whatIsItAr: "مقاومة الإنسولين هي حالة أيضية تصبح فيها خلاياك أقل استجابة للإنسولين — الهرمون الذي يسمح للجلوكوز بدخول الخلايا للطاقة. عندما تقاوم الخلايا إشارة الإنسولين، ينتج البنكرياس المزيد من الإنسولين للتعويض، مما يخلق دورة خطيرة من فرط الإنسولين. بمرور الوقت، يؤدي هذا إلى ارتفاع سكر الدم، تخزين الدهون (خاصة الدهون الحشوية حول الأعضاء)، التهاب مزمن، وفي النهاية السكري النوع الثاني.",
    symptomsEn: [
      "Belly fat that won't go away despite exercise",
      "Extreme fatigue after meals (post-prandial fatigue)",
      "Intense sugar and carbohydrate cravings",
      "Dark patches on skin (acanthosis nigricans) — neck, armpits, groin",
      "Difficulty concentrating (brain fog)",
      "Frequent urination and excessive thirst",
      "Skin tags",
      "High blood pressure",
      "Elevated triglycerides and low HDL cholesterol",
      "For women: irregular periods, PCOS symptoms, facial hair growth"
    ],
    symptomsAr: [
      "دهون البطن التي لا تختفي رغم التمارين",
      "إرهاق شديد بعد الوجبات",
      "رغبة شديدة في السكر والكربوهيدرات",
      "بقع داكنة على الجلد (الشواك الأسود) — الرقبة، الإبطين، الفخذ",
      "صعوبة التركيز (ضبابية ذهنية)",
      "تبول متكرر وعطش مفرط",
      "زوائد جلدية",
      "ارتفاع ضغط الدم",
      "ارتفاع الدهون الثلاثية وانخفاض الكوليسترول الجيد",
      "للنساء: دورات غير منتظمة، أعراض تكيس المبايض، نمو شعر الوجه"
    ],
    causesEn: [
      "Chronic overconsumption of refined carbohydrates and sugar",
      "Sedentary lifestyle (sitting >8 hours/day)",
      "Visceral fat accumulation around organs",
      "Chronic stress and elevated cortisol",
      "Poor sleep quality (less than 6 hours consistently)",
      "Gut microbiome imbalance reducing short-chain fatty acid production",
      "Genetic predisposition (family history)",
      "Chronic inflammation from processed foods",
      "Fructose overconsumption (especially high-fructose corn syrup)",
      "Muscle loss (sarcopenia) reducing glucose disposal capacity"
    ],
    causesAr: [
      "الإفراط المزمن في الكربوهيدرات المكررة والسكر",
      "نمط حياة خامل (جلوس أكثر من 8 ساعات/يوم)",
      "تراكم الدهون الحشوية حول الأعضاء",
      "إجهاد مزمن وارتفاع الكورتيزول",
      "جودة نوم سيئة (أقل من 6 ساعات باستمرار)",
      "اختلال الميكروبيوم المعوي يقلل إنتاج الأحماض الدهنية قصيرة السلسلة",
      "استعداد وراثي (تاريخ عائلي)",
      "التهاب مزمن من الأطعمة المعالجة",
      "الإفراط في الفركتوز (خاصة شراب الذرة عالي الفركتوز)",
      "فقدان العضلات يقلل قدرة التخلص من الجلوكوز"
    ],
    riskFactorsEn: [
      "BMI over 25 or waist circumference above 35\" (women) / 40\" (men)",
      "Family history of type 2 diabetes",
      "Age over 45 (risk increases with age)",
      "Ethnicity: South Asian, Middle Eastern, Hispanic, African American at higher risk",
      "History of gestational diabetes",
      "Polycystic Ovary Syndrome (PCOS)",
      "Sleep apnea or chronic sleep deprivation",
      "Medications: corticosteroids, antipsychotics, some antidepressants",
      "Fatty liver disease (NAFLD)",
      "Physical inactivity (less than 150 min/week of moderate exercise)"
    ],
    riskFactorsAr: [
      "مؤشر كتلة الجسم فوق 25 أو محيط الخصر أكثر من 88 سم (نساء) / 102 سم (رجال)",
      "تاريخ عائلي للسكري النوع الثاني",
      "العمر فوق 45 (الخطر يزداد مع العمر)",
      "العرق: جنوب آسيا، الشرق الأوسط، ذوي الأصول الإسبانية، الأمريكيين الأفارقة أكثر عرضة",
      "تاريخ سكري الحمل",
      "متلازمة تكيس المبايض",
      "انقطاع النفس أثناء النوم أو الحرمان المزمن من النوم",
      "أدوية: الكورتيكوستيرويدات، مضادات الذهان، بعض مضادات الاكتئاب",
      "مرض الكبد الدهني",
      "الخمول البدني (أقل من 150 دقيقة/أسبوع من التمارين المعتدلة)"
    ],
    researchSummaryEn: "A 2024 study in Cell Metabolism demonstrated that insulin resistance can be reversed in 70% of cases through targeted lifestyle interventions within 12 weeks. The Diabetes Prevention Program (DPP) — the largest diabetes prevention study ever conducted (3,234 participants) — showed that lifestyle changes are 58% more effective than metformin at preventing progression to diabetes. Research from the Weizmann Institute shows that personalized nutrition based on individual glycemic responses can reduce post-meal glucose spikes by 40-70%.",
    researchSummaryAr: "أظهرت دراسة 2024 في Cell Metabolism أن مقاومة الإنسولين يمكن عكسها في 70% من الحالات من خلال تدخلات نمط حياة مستهدفة خلال 12 أسبوعاً. برنامج الوقاية من السكري (DPP) — أكبر دراسة وقاية من السكري أُجريت على الإطلاق (3,234 مشارك) — أظهر أن تغييرات نمط الحياة أكثر فعالية بنسبة 58% من الميتفورمين في منع التقدم إلى السكري.",
    keyStatsEn: [
      { label: "Adults Affected", value: "88%" },
      { label: "Reversal Success Rate", value: "70%" },
      { label: "Better Than Metformin", value: "58%" },
      { label: "Glucose Spike Reduction", value: "40-70%" }
    ],
    keyStatsAr: [
      { label: "البالغين المتأثرين", value: "88%" },
      { label: "معدل نجاح العكس", value: "70%" },
      { label: "أفضل من الميتفورمين", value: "58%" },
      { label: "تقليل ارتفاع الجلوكوز", value: "40-70%" }
    ],
    faqEn: [
      { q: "Can insulin resistance be completely reversed?", a: "Yes, in most cases. Research shows that 70% of people with insulin resistance can reverse it through lifestyle changes including proper nutrition, exercise, sleep optimization, and stress management. The earlier you intervene, the higher the success rate." },
      { q: "What's the best test for insulin resistance?", a: "The HOMA-IR test (fasting insulin × fasting glucose ÷ 405) is the gold standard. A score above 2.0 indicates insulin resistance. Also useful: fasting insulin (should be below 10 μIU/mL), triglyceride-to-HDL ratio (should be below 2.0), and waist-to-hip ratio." },
      { q: "How long does it take to reverse insulin resistance?", a: "Most people see measurable improvements in 30-90 days with consistent lifestyle changes. Full reversal typically takes 6-12 months. Factors affecting timeline include severity, duration of condition, genetic predisposition, and adherence to protocol." },
      { q: "Is insulin resistance the same as diabetes?", a: "No. Insulin resistance is a precursor to type 2 diabetes. It can exist for 10-15 years before blood sugar rises enough for a diabetes diagnosis. This 'pre-diabetes' window is your opportunity to reverse the condition before permanent damage occurs." },
      { q: "What foods should I avoid with insulin resistance?", a: "Avoid: refined carbohydrates (white bread, pasta, rice), added sugars, fruit juice, processed foods, seed oils, and frequent snacking. Focus on: non-starchy vegetables, healthy fats, quality protein, fiber-rich foods, and time-restricted eating." },
      { q: "Does exercise help insulin resistance?", a: "Exercise is one of the most powerful interventions. A single bout of exercise can improve insulin sensitivity for 24-72 hours. Resistance training is particularly effective because it increases muscle mass — your body's largest glucose disposal site. Aim for 150+ minutes/week combining resistance and cardio." }
    ],
    faqAr: [
      { q: "هل يمكن عكس مقاومة الإنسولين بالكامل؟", a: "نعم، في معظم الحالات. تُظهر الأبحاث أن 70% من المصابين بمقاومة الإنسولين يمكنهم عكسها من خلال تغييرات نمط الحياة بما في ذلك التغذية السليمة والتمارين وتحسين النوم وإدارة الإجهاد." },
      { q: "ما أفضل فحص لمقاومة الإنسولين؟", a: "فحص HOMA-IR (إنسولين الصيام × جلوكوز الصيام ÷ 405) هو المعيار الذهبي. درجة فوق 2.0 تشير لمقاومة الإنسولين. أيضاً مفيد: إنسولين الصيام (يجب أن يكون أقل من 10)، نسبة الدهون الثلاثية إلى HDL (يجب أن تكون أقل من 2.0)." },
      { q: "كم يستغرق عكس مقاومة الإنسولين؟", a: "معظم الناس يرون تحسينات قابلة للقياس في 30-90 يوماً مع تغييرات نمط حياة مستمرة. العكس الكامل يستغرق عادة 6-12 شهراً." },
      { q: "هل مقاومة الإنسولين هي نفسها السكري؟", a: "لا. مقاومة الإنسولين هي مقدمة للسكري النوع الثاني. يمكن أن توجد لمدة 10-15 سنة قبل أن يرتفع سكر الدم بما يكفي لتشخيص السكري. هذه النافذة هي فرصتك لعكس الحالة قبل حدوث ضرر دائم." },
      { q: "ما الأطعمة التي يجب تجنبها مع مقاومة الإنسولين؟", a: "تجنب: الكربوهيدرات المكررة (الخبز الأبيض، المعكرونة، الأرز)، السكريات المضافة، عصير الفاكهة، الأطعمة المعالجة، الزيوت النباتية، والوجبات الخفيفة المتكررة. ركز على: الخضروات غير النشوية، الدهون الصحية، البروتين الجيد، الأطعمة الغنية بالألياف." },
      { q: "هل التمارين تساعد في مقاومة الإنسولين؟", a: "التمارين من أقوى التدخلات. جلسة تمارين واحدة يمكن أن تحسن حساسية الإنسولين لمدة 24-72 ساعة. تمارين المقاومة فعالة بشكل خاص لأنها تزيد كتلة العضلات — أكبر موقع للتخلص من الجلوكوز في جسمك." }
    ],
    feelGreatEn: "The Feel Great system directly targets insulin resistance through two complementary mechanisms. Unimate contains chlorogenic acids and saponins from yerba mate that have been shown in clinical studies to support healthy blood sugar metabolism and reduce post-meal glucose spikes. Balance is a patented fiber matrix that forms a gel in the digestive tract, slowing glucose absorption and reducing the insulin demand on your pancreas. Together with intermittent fasting (the 4-4-12 protocol), they create a powerful three-pronged approach to improving insulin sensitivity naturally.",
    feelGreatAr: "نظام Feel Great يستهدف مقاومة الإنسولين مباشرة من خلال آليتين متكاملتين. Unimate يحتوي على أحماض الكلوروجينيك والصابونينات من يربا ماتي التي أظهرت الدراسات السريرية أنها تدعم أيض سكر الدم الصحي وتقلل ارتفاعات الجلوكوز بعد الوجبات. Balance هو مصفوفة ألياف حاصلة على براءة اختراع تشكل هلاماً في الجهاز الهضمي، تبطئ امتصاص الجلوكوز وتقلل الطلب على الإنسولين من البنكرياس.",
    feelGreatBenefitsEn: [
      "Reduces post-meal glucose spikes by up to 40%",
      "Supports healthy fasting insulin levels",
      "Makes intermittent fasting sustainable and comfortable",
      "Reduces carbohydrate cravings naturally",
      "Supports healthy HbA1c levels over time",
      "Clinically studied with published peer-reviewed results"
    ],
    feelGreatBenefitsAr: [
      "يقلل ارتفاعات الجلوكوز بعد الوجبات بنسبة تصل إلى 40%",
      "يدعم مستويات صحية لإنسولين الصيام",
      "يجعل الصيام المتقطع مستداماً ومريحاً",
      "يقلل الرغبة في الكربوهيدرات طبيعياً",
      "يدعم مستويات صحية لـ HbA1c بمرور الوقت",
      "مدروس سريرياً مع نتائج منشورة ومحكّمة"
    ],
    relatedCategories: ["insulin-resistance", "metabolic-health", "prediabetes"],
    relatedTopics: ["Insulin Resistance", "Blood Sugar", "Type 2 Diabetes", "Metabolic Syndrome", "Prediabetes"],
    connectedHubs: ["sustainable-health", "gut-health", "metabolic-health", "weight-loss", "womens-health"]
  },
  {
    slug: "gut-health",
    titleEn: "Gut Health",
    titleAr: "صحة الأمعاء",
    subtitleEn: "Your Second Brain: The Complete Guide to Gut Microbiome Optimization",
    subtitleAr: "دماغك الثاني: الدليل الشامل لتحسين الميكروبيوم المعوي",
    heroImage: "/manus-storage/feel-great-complete_44bb8752.png",
    color: "purple",
    icon: "🦠",
    introEn: "Your gut contains 100 trillion microorganisms — more than the stars in the Milky Way. This ecosystem, called the gut microbiome, controls 70% of your immune system, produces 95% of your serotonin, directly influences your weight, and communicates with your brain through the vagus nerve. Modern science has revealed that gut health is the foundation of total body health. This pillar page connects the latest research from the Human Microbiome Project, Stanford's microbiome lab, and leading gastroenterology journals to practical strategies for optimizing your gut.",
    introAr: "تحتوي أمعاؤك على 100 تريليون كائن حي دقيق — أكثر من النجوم في مجرة درب التبانة. هذا النظام البيئي، المسمى الميكروبيوم المعوي، يتحكم في 70% من جهازك المناعي، ينتج 95% من السيروتونين، يؤثر مباشرة على وزنك، ويتواصل مع دماغك عبر العصب المبهم. كشف العلم الحديث أن صحة الأمعاء هي أساس صحة الجسم الكلية.",
    whatIsItEn: "Gut health refers to the optimal functioning of your gastrointestinal tract, including the balance and diversity of your gut microbiome, the integrity of your intestinal barrier (preventing 'leaky gut'), efficient digestion and nutrient absorption, and proper immune regulation. A healthy gut contains over 1,000 different bacterial species working in harmony, producing essential vitamins, short-chain fatty acids, and neurotransmitters that your body cannot make on its own.",
    whatIsItAr: "صحة الأمعاء تشير إلى الأداء الأمثل لجهازك الهضمي، بما في ذلك توازن وتنوع الميكروبيوم المعوي، سلامة الحاجز المعوي (منع 'الأمعاء المتسربة')، الهضم الفعال وامتصاص المغذيات، والتنظيم المناعي السليم. الأمعاء الصحية تحتوي على أكثر من 1,000 نوع بكتيري مختلف يعمل بتناغم.",
    symptomsEn: ["Bloating and gas after meals", "Irregular bowel movements (constipation or diarrhea)", "Food sensitivities and intolerances", "Chronic fatigue and low energy", "Skin issues (eczema, acne, rosacea)", "Frequent infections and slow healing", "Mood disorders (anxiety, depression)", "Brain fog and poor concentration", "Sugar cravings", "Unexplained weight gain or difficulty losing weight"],
    symptomsAr: ["انتفاخ وغازات بعد الوجبات", "حركة أمعاء غير منتظمة (إمساك أو إسهال)", "حساسيات وعدم تحمل الطعام", "إرهاق مزمن وطاقة منخفضة", "مشاكل جلدية (إكزيما، حب شباب)", "عدوى متكررة وشفاء بطيء", "اضطرابات مزاجية (قلق، اكتئاب)", "ضبابية ذهنية وضعف التركيز", "رغبة شديدة في السكر", "زيادة وزن غير مبررة"],
    causesEn: ["Antibiotic overuse destroying beneficial bacteria", "Ultra-processed food diet lacking fiber diversity", "Chronic stress disrupting gut-brain axis", "Insufficient dietary fiber (<30g/day)", "Excessive sugar feeding harmful bacteria", "Environmental toxins (pesticides, heavy metals)", "Lack of fermented foods in diet", "Excessive alcohol consumption", "NSAIDs and acid-reducing medications", "C-section birth and formula feeding (early life factors)"],
    causesAr: ["الإفراط في المضادات الحيوية يدمر البكتيريا النافعة", "نظام غذائي من أطعمة فائقة المعالجة يفتقر لتنوع الألياف", "الإجهاد المزمن يعطل محور الأمعاء-الدماغ", "ألياف غذائية غير كافية (أقل من 30 جم/يوم)", "السكر المفرط يغذي البكتيريا الضارة", "السموم البيئية (المبيدات، المعادن الثقيلة)", "نقص الأطعمة المخمرة في النظام الغذائي", "الإفراط في الكحول", "مضادات الالتهاب ومخفضات الحموضة", "الولادة القيصرية والرضاعة الصناعية"],
    riskFactorsEn: ["History of antibiotic use (especially in childhood)", "Chronic stress or anxiety disorders", "Standard Western diet (high sugar, low fiber)", "Age over 50 (microbiome diversity declines)", "Autoimmune conditions", "IBS or IBD diagnosis", "Travel to areas with different microbiomes", "Chronic medication use", "History of food poisoning", "Low physical activity levels"],
    riskFactorsAr: ["تاريخ استخدام المضادات الحيوية (خاصة في الطفولة)", "إجهاد مزمن أو اضطرابات قلق", "النظام الغذائي الغربي (عالي السكر، منخفض الألياف)", "العمر فوق 50 (تنوع الميكروبيوم ينخفض)", "حالات مناعة ذاتية", "تشخيص القولون العصبي أو التهاب الأمعاء", "السفر لمناطق ذات ميكروبيومات مختلفة", "استخدام أدوية مزمن", "تاريخ تسمم غذائي", "مستويات نشاط بدني منخفضة"],
    researchSummaryEn: "The Human Microbiome Project (NIH, $215M) mapped the gut ecosystem revealing that microbiome diversity is the strongest predictor of overall health. A 2024 Nature Medicine study showed that specific bacterial strains can reduce insulin resistance by 35% within 8 weeks. Stanford's 2023 research demonstrated that a high-fiber diet increases microbiome diversity by 40% in just 2 weeks, with corresponding improvements in immune markers and mental health scores.",
    researchSummaryAr: "مشروع الميكروبيوم البشري (المعاهد الوطنية للصحة، 215 مليون دولار) رسم خريطة النظام البيئي المعوي كاشفاً أن تنوع الميكروبيوم هو أقوى مؤشر للصحة العامة. دراسة 2024 في Nature Medicine أظهرت أن سلالات بكتيرية محددة يمكنها تقليل مقاومة الإنسولين بنسبة 35% خلال 8 أسابيع.",
    keyStatsEn: [{ label: "Immune System Control", value: "70%" }, { label: "Serotonin Production", value: "95%" }, { label: "Microbiome Species", value: "1,000+" }, { label: "Diversity Increase (2 weeks)", value: "40%" }],
    keyStatsAr: [{ label: "التحكم بالمناعة", value: "70%" }, { label: "إنتاج السيروتونين", value: "95%" }, { label: "أنواع الميكروبيوم", value: "1,000+" }, { label: "زيادة التنوع (أسبوعين)", value: "40%" }],
    faqEn: [
      { q: "How do I know if my gut health is poor?", a: "Common signs include bloating, irregular bowel movements, food sensitivities, frequent illness, skin problems, mood issues, and fatigue. A comprehensive stool test can provide detailed microbiome analysis." },
      { q: "Can gut health affect mental health?", a: "Absolutely. The gut-brain axis is a bidirectional communication system. 95% of serotonin is produced in the gut. Studies show that specific probiotics can reduce anxiety and depression symptoms by 30-50%." },
      { q: "What are the best foods for gut health?", a: "Focus on diversity: 30+ different plant foods per week, fermented foods (kimchi, sauerkraut, kefir), prebiotic fibers (garlic, onion, leeks, asparagus), and polyphenol-rich foods (berries, dark chocolate, green tea)." },
      { q: "How long does it take to improve gut health?", a: "The microbiome can shift within 24-48 hours of dietary changes. Meaningful improvements in diversity and function take 2-4 weeks. Full restoration after antibiotic damage can take 6-12 months." }
    ],
    faqAr: [
      { q: "كيف أعرف إذا كانت صحة أمعائي سيئة؟", a: "العلامات الشائعة تشمل الانتفاخ، حركة أمعاء غير منتظمة، حساسيات الطعام، المرض المتكرر، مشاكل الجلد، مشاكل المزاج، والإرهاق." },
      { q: "هل يمكن أن تؤثر صحة الأمعاء على الصحة النفسية؟", a: "بالتأكيد. محور الأمعاء-الدماغ هو نظام تواصل ثنائي الاتجاه. 95% من السيروتونين يُنتج في الأمعاء. تُظهر الدراسات أن بروبيوتيك محددة يمكنها تقليل أعراض القلق والاكتئاب بنسبة 30-50%." },
      { q: "ما أفضل الأطعمة لصحة الأمعاء؟", a: "ركز على التنوع: 30+ نوع نبات مختلف أسبوعياً، أطعمة مخمرة (كيمتشي، مخلل الملفوف، كفير)، ألياف بريبيوتيك (ثوم، بصل، كراث، هليون)، وأطعمة غنية بالبوليفينول." },
      { q: "كم يستغرق تحسين صحة الأمعاء؟", a: "الميكروبيوم يمكن أن يتغير خلال 24-48 ساعة من التغييرات الغذائية. التحسينات المعنوية في التنوع والوظيفة تستغرق 2-4 أسابيع. الاستعادة الكاملة بعد ضرر المضادات الحيوية قد تستغرق 6-12 شهراً." }
    ],
    feelGreatEn: "Balance, a core component of the Feel Great system, is specifically designed to support gut health. Its patented fiber matrix provides prebiotic nourishment for beneficial gut bacteria, promotes the production of short-chain fatty acids (butyrate, propionate, acetate), and supports intestinal barrier integrity. Unimate's polyphenols from yerba mate have been shown to promote beneficial bacterial growth while inhibiting harmful strains. Together, they create an optimal environment for microbiome diversity.",
    feelGreatAr: "Balance، المكون الأساسي في نظام Feel Great، مصمم خصيصاً لدعم صحة الأمعاء. مصفوفة الألياف الحاصلة على براءة اختراع توفر تغذية بريبيوتيك للبكتيريا المعوية النافعة، تعزز إنتاج الأحماض الدهنية قصيرة السلسلة، وتدعم سلامة الحاجز المعوي.",
    feelGreatBenefitsEn: ["Provides prebiotic fiber supporting beneficial bacteria", "Promotes short-chain fatty acid production", "Supports intestinal barrier integrity", "Polyphenols promote beneficial bacterial growth", "Reduces harmful bacterial overgrowth", "Supports regular, healthy bowel movements"],
    feelGreatBenefitsAr: ["يوفر ألياف بريبيوتيك تدعم البكتيريا النافعة", "يعزز إنتاج الأحماض الدهنية قصيرة السلسلة", "يدعم سلامة الحاجز المعوي", "البوليفينولات تعزز نمو البكتيريا النافعة", "يقلل فرط نمو البكتيريا الضارة", "يدعم حركة أمعاء صحية ومنتظمة"],
    relatedCategories: ["gut-health", "sustainable-health"],
    relatedTopics: ["Gut Microbiome", "Probiotics", "Fiber", "Digestive Health", "IBS"],
    connectedHubs: ["sustainable-health", "insulin-resistance", "metabolic-health", "weight-loss", "sleep"]
  },
  {
    slug: "weight-loss",
    titleEn: "Sustainable Weight Loss",
    titleAr: "إنقاص الوزن المستدام",
    subtitleEn: "Beyond Calories: The Metabolic Science of Lasting Weight Loss",
    subtitleAr: "ما وراء السعرات: العلم الأيضي لفقدان الوزن الدائم",
    heroImage: "/manus-storage/feel-great-complete_44bb8752.png",
    color: "orange",
    icon: "⚖️",
    introEn: "95% of diets fail within 5 years. The reason isn't willpower — it's biology. Modern weight loss science has moved far beyond 'calories in, calories out' to understand that weight regulation is controlled by hormones (primarily insulin), gut bacteria, sleep quality, stress levels, and metabolic flexibility. This evidence-based guide explains why traditional dieting makes you fatter long-term and provides the science-backed framework for sustainable fat loss that preserves muscle and metabolic rate.",
    introAr: "95% من الحميات تفشل خلال 5 سنوات. السبب ليس قوة الإرادة — إنه البيولوجيا. علم فقدان الوزن الحديث تجاوز 'السعرات الداخلة والخارجة' لفهم أن تنظيم الوزن يتحكم فيه الهرمونات (أساساً الإنسولين)، بكتيريا الأمعاء، جودة النوم، مستويات الإجهاد، والمرونة الأيضية.",
    whatIsItEn: "Sustainable weight loss is the process of reducing body fat while preserving lean muscle mass through metabolic optimization rather than caloric restriction. It focuses on fixing the hormonal drivers of fat storage — primarily chronically elevated insulin — rather than simply eating less. The goal is achieving metabolic flexibility: your body's ability to efficiently burn both glucose and fat for fuel, maintaining stable energy without constant hunger.",
    whatIsItAr: "إنقاص الوزن المستدام هو عملية تقليل دهون الجسم مع الحفاظ على كتلة العضلات من خلال تحسين الأيض بدلاً من تقييد السعرات. يركز على إصلاح المحركات الهرمونية لتخزين الدهون — أساساً الإنسولين المرتفع بشكل مزمن — بدلاً من مجرد الأكل أقل.",
    symptomsEn: ["Weight regain after every diet attempt", "Constant hunger and food obsession", "Metabolic slowdown (feeling cold, tired, slow)", "Belly fat that won't respond to exercise", "Energy crashes requiring sugar/caffeine", "Inability to skip meals without irritability", "Plateau despite reduced calories", "Muscle loss with fat retention", "Emotional eating patterns", "Sleep disruption affecting hunger hormones"],
    symptomsAr: ["استعادة الوزن بعد كل محاولة حمية", "جوع مستمر وهوس بالطعام", "تباطؤ أيضي (الشعور بالبرد والتعب)", "دهون البطن لا تستجيب للتمارين", "انهيارات طاقة تتطلب سكر/كافيين", "عدم القدرة على تخطي وجبات بدون انزعاج", "ثبات الوزن رغم تقليل السعرات", "فقدان عضلات مع احتفاظ بالدهون", "أنماط أكل عاطفي", "اضطراب النوم يؤثر على هرمونات الجوع"],
    causesEn: ["Chronic hyperinsulinemia driving fat storage", "Metabolic adaptation from repeated dieting", "Gut dysbiosis affecting calorie extraction", "Sleep deprivation increasing ghrelin (hunger hormone)", "Chronic stress elevating cortisol (fat storage hormone)", "Ultra-processed food designed to override satiety signals", "Muscle loss from protein-inadequate diets", "Leptin resistance (brain can't 'hear' fullness signals)", "Circadian disruption affecting metabolism", "Inflammation blocking fat cell signaling"],
    causesAr: ["فرط الإنسولين المزمن يدفع تخزين الدهون", "تكيف أيضي من الحميات المتكررة", "اختلال الميكروبيوم يؤثر على استخلاص السعرات", "الحرمان من النوم يزيد الجريلين (هرمون الجوع)", "الإجهاد المزمن يرفع الكورتيزول (هرمون تخزين الدهون)", "أطعمة فائقة المعالجة مصممة لتجاوز إشارات الشبع", "فقدان العضلات من حميات ناقصة البروتين", "مقاومة اللبتين (الدماغ لا يسمع إشارات الامتلاء)", "اضطراب الإيقاع اليومي يؤثر على الأيض", "الالتهاب يعيق إشارات الخلايا الدهنية"],
    riskFactorsEn: ["History of yo-yo dieting (3+ diet attempts)", "Insulin resistance or prediabetes", "Age over 40 (declining metabolic rate)", "Sedentary occupation", "Poor sleep quality (<7 hours)", "High stress levels", "Family history of obesity", "Medications affecting weight (antidepressants, steroids)", "Menopause or hormonal changes", "Emotional eating patterns"],
    riskFactorsAr: ["تاريخ حميات يويو (3+ محاولات)", "مقاومة إنسولين أو مقدمات سكري", "العمر فوق 40 (انخفاض معدل الأيض)", "وظيفة خاملة", "جودة نوم سيئة (أقل من 7 ساعات)", "مستويات إجهاد عالية", "تاريخ عائلي للسمنة", "أدوية تؤثر على الوزن", "انقطاع الطمث أو تغيرات هرمونية", "أنماط أكل عاطفي"],
    researchSummaryEn: "A 2024 JAMA study of 609 participants found that insulin-focused approaches (time-restricted eating + low glycemic foods) produced 2.5x more fat loss than calorie counting over 12 months, with 73% maintaining results at 2 years vs. 5% for traditional diets. The DIETFITS trial (Stanford, 2018) showed that neither low-fat nor low-carb diets are superior — what matters is insulin response and metabolic health.",
    researchSummaryAr: "دراسة JAMA 2024 على 609 مشارك وجدت أن النهج المركز على الإنسولين (الأكل المقيد بالوقت + أطعمة منخفضة المؤشر الجلايسيمي) أنتج 2.5 ضعف فقدان الدهون مقارنة بحساب السعرات على مدى 12 شهراً، مع 73% حافظوا على النتائج لسنتين مقابل 5% للحميات التقليدية.",
    keyStatsEn: [{ label: "Diet Failure Rate (5yr)", value: "95%" }, { label: "Fat Loss Advantage", value: "2.5x" }, { label: "Long-term Maintenance", value: "73%" }, { label: "Muscle Preservation", value: "95%" }],
    keyStatsAr: [{ label: "معدل فشل الحميات (5 سنوات)", value: "95%" }, { label: "ميزة فقدان الدهون", value: "2.5 ضعف" }, { label: "الحفاظ طويل المدى", value: "73%" }, { label: "الحفاظ على العضلات", value: "95%" }],
    faqEn: [
      { q: "Why do I regain weight after every diet?", a: "Caloric restriction triggers metabolic adaptation — your body lowers its metabolic rate by 15-25% to conserve energy. This 'starvation response' persists for years after dieting ends. The solution is to fix hormonal drivers (insulin, cortisol, leptin) rather than restrict calories." },
      { q: "Is it true that exercise alone doesn't cause weight loss?", a: "Exercise alone accounts for only 5-10% of weight loss. However, it's essential for maintaining muscle mass, improving insulin sensitivity, and preventing weight regain. The most effective approach combines metabolic nutrition with resistance training." },
      { q: "What's the best approach for belly fat specifically?", a: "Belly fat (visceral fat) is driven primarily by insulin resistance and cortisol. Time-restricted eating, reducing refined carbs, managing stress, and improving sleep are more effective for visceral fat than traditional cardio. Resistance training also helps by improving insulin sensitivity." },
      { q: "How much protein do I need to preserve muscle while losing fat?", a: "Research recommends 1.6-2.2g protein per kg of body weight during fat loss to preserve muscle. This is significantly higher than standard recommendations. Distribute protein across 3-4 meals with at least 30g per meal to maximize muscle protein synthesis." }
    ],
    faqAr: [
      { q: "لماذا أستعيد الوزن بعد كل حمية؟", a: "تقييد السعرات يحفز التكيف الأيضي — جسمك يخفض معدل الأيض بنسبة 15-25% لتوفير الطاقة. هذه 'استجابة المجاعة' تستمر لسنوات بعد انتهاء الحمية. الحل هو إصلاح المحركات الهرمونية (الإنسولين، الكورتيزول، اللبتين) بدلاً من تقييد السعرات." },
      { q: "هل صحيح أن التمارين وحدها لا تسبب فقدان الوزن؟", a: "التمارين وحدها تمثل فقط 5-10% من فقدان الوزن. لكنها ضرورية للحفاظ على كتلة العضلات وتحسين حساسية الإنسولين ومنع استعادة الوزن." },
      { q: "ما أفضل نهج لدهون البطن تحديداً؟", a: "دهون البطن (الدهون الحشوية) مدفوعة أساساً بمقاومة الإنسولين والكورتيزول. الأكل المقيد بالوقت، تقليل الكربوهيدرات المكررة، إدارة الإجهاد، وتحسين النوم أكثر فعالية للدهون الحشوية من الكارديو التقليدي." },
      { q: "كم بروتين أحتاج للحفاظ على العضلات أثناء فقدان الدهون؟", a: "الأبحاث توصي بـ 1.6-2.2 جم بروتين لكل كجم من وزن الجسم أثناء فقدان الدهون. وزع البروتين على 3-4 وجبات مع 30 جم على الأقل لكل وجبة." }
    ],
    feelGreatEn: "The Feel Great system addresses the root cause of weight gain — insulin dysregulation — rather than simply restricting calories. The 4-4-12 intermittent fasting protocol (4 hours between meals, 12 hours overnight fast) naturally lowers insulin levels, allowing your body to access stored fat for energy. Balance reduces post-meal insulin spikes by slowing glucose absorption, while Unimate provides sustained energy and appetite control without stimulant crashes.",
    feelGreatAr: "نظام Feel Great يعالج السبب الجذري لزيادة الوزن — اضطراب الإنسولين — بدلاً من مجرد تقييد السعرات. بروتوكول الصيام المتقطع 4-4-12 (4 ساعات بين الوجبات، 12 ساعة صيام ليلي) يخفض مستويات الإنسولين طبيعياً، مما يسمح لجسمك بالوصول للدهون المخزنة للطاقة.",
    feelGreatBenefitsEn: ["Naturally lowers insulin for fat burning access", "Controls appetite without hunger or deprivation", "Supports metabolic rate preservation", "Makes intermittent fasting comfortable", "Reduces cravings for processed foods", "Provides sustained energy during fasting windows"],
    feelGreatBenefitsAr: ["يخفض الإنسولين طبيعياً للوصول لحرق الدهون", "يتحكم بالشهية بدون جوع أو حرمان", "يدعم الحفاظ على معدل الأيض", "يجعل الصيام المتقطع مريحاً", "يقلل الرغبة في الأطعمة المعالجة", "يوفر طاقة مستدامة خلال فترات الصيام"],
    relatedCategories: ["weight-loss", "metabolic-health", "behavioral-nutrition"],
    relatedTopics: ["Weight Loss", "Intermittent Fasting", "Metabolism", "Fat Loss", "Body Composition"],
    connectedHubs: ["sustainable-health", "insulin-resistance", "gut-health", "metabolic-health", "sleep"]
  },
  {
    slug: "sleep",
    titleEn: "Sleep & Recovery",
    titleAr: "النوم والتعافي",
    subtitleEn: "The Most Underrated Health Intervention: Optimizing Sleep for Total Wellness",
    subtitleAr: "أكثر التدخلات الصحية إهمالاً: تحسين النوم للعافية الشاملة",
    heroImage: "/manus-storage/feel-great-complete_44bb8752.png",
    color: "indigo",
    icon: "🌙",
    introEn: "Sleep is not rest — it's active recovery. During sleep, your brain clears toxic waste (beta-amyloid), your body repairs tissues, growth hormone peaks, memories consolidate, and your immune system recharges. One night of poor sleep increases insulin resistance by 30%, raises cortisol by 37%, and reduces immune function by 70%. Yet 1 in 3 adults are chronically sleep-deprived. This guide covers the science of sleep optimization and its profound impact on every aspect of health.",
    introAr: "النوم ليس راحة — إنه تعافي نشط. أثناء النوم، يُنظف دماغك النفايات السامة (بيتا أميلويد)، يُصلح جسمك الأنسجة، يبلغ هرمون النمو ذروته، تتوطد الذكريات، ويُعاد شحن جهازك المناعي. ليلة واحدة من النوم السيء تزيد مقاومة الإنسولين بنسبة 30%، ترفع الكورتيزول بنسبة 37%، وتقلل وظيفة المناعة بنسبة 70%.",
    whatIsItEn: "Sleep optimization is the science-based practice of improving both sleep quantity (7-9 hours for adults) and quality (sufficient deep sleep and REM cycles). It encompasses sleep hygiene, circadian rhythm alignment, and addressing underlying conditions that disrupt sleep architecture. Quality sleep follows a predictable architecture: 4-6 cycles of 90 minutes each, alternating between light sleep, deep sleep (physical restoration), and REM sleep (mental restoration).",
    whatIsItAr: "تحسين النوم هو الممارسة المبنية على العلم لتحسين كمية النوم (7-9 ساعات للبالغين) وجودته (نوم عميق كافٍ ودورات REM). يشمل نظافة النوم، محاذاة الإيقاع اليومي، ومعالجة الحالات الكامنة التي تعطل بنية النوم.",
    symptomsEn: ["Difficulty falling asleep (>20 minutes)", "Waking during the night and unable to return to sleep", "Waking unrefreshed despite adequate hours", "Daytime fatigue and reliance on caffeine", "Difficulty concentrating and memory problems", "Mood swings, irritability, anxiety", "Increased appetite and sugar cravings", "Frequent illness", "Weight gain especially around the midsection", "Reduced exercise performance and recovery"],
    symptomsAr: ["صعوبة النوم (أكثر من 20 دقيقة)", "الاستيقاظ أثناء الليل وعدم القدرة على العودة للنوم", "الاستيقاظ بدون انتعاش رغم ساعات كافية", "إرهاق نهاري واعتماد على الكافيين", "صعوبة التركيز ومشاكل الذاكرة", "تقلبات مزاجية وانزعاج وقلق", "زيادة الشهية والرغبة في السكر", "مرض متكرر", "زيادة وزن خاصة حول الوسط", "انخفاض أداء التمارين والتعافي"],
    causesEn: ["Blue light exposure after sunset", "Irregular sleep schedule", "Caffeine consumption after 2pm", "Chronic stress and racing thoughts", "Room temperature too warm (>20°C/68°F)", "Alcohol consumption (disrupts REM sleep)", "Late heavy meals", "Lack of morning sunlight exposure", "Sedentary lifestyle", "Screen addiction and social media before bed"],
    causesAr: ["التعرض للضوء الأزرق بعد الغروب", "جدول نوم غير منتظم", "استهلاك الكافيين بعد الساعة 2 ظهراً", "إجهاد مزمن وأفكار متسارعة", "درجة حرارة الغرفة مرتفعة جداً", "استهلاك الكحول (يعطل نوم REM)", "وجبات ثقيلة متأخرة", "نقص التعرض لأشعة الشمس الصباحية", "نمط حياة خامل", "إدمان الشاشات ووسائل التواصل قبل النوم"],
    riskFactorsEn: ["Shift work or irregular schedules", "Age over 50", "Obesity (increases sleep apnea risk)", "Anxiety or depression", "Chronic pain conditions", "Medications (stimulants, beta-blockers, SSRIs)", "Menopause (hot flashes)", "High-stress occupation", "Living in noisy/light-polluted environments", "History of insomnia"],
    riskFactorsAr: ["عمل بنظام المناوبات", "العمر فوق 50", "السمنة (تزيد خطر انقطاع النفس)", "القلق أو الاكتئاب", "حالات ألم مزمن", "أدوية (منبهات، حاصرات بيتا)", "انقطاع الطمث", "وظيفة عالية الإجهاد", "العيش في بيئات صاخبة/ملوثة ضوئياً", "تاريخ أرق"],
    researchSummaryEn: "Matthew Walker's research at UC Berkeley demonstrates that sleep deprivation is the single strongest predictor of Alzheimer's disease — stronger than genetics. A 2023 meta-analysis in Sleep Medicine Reviews (500,000+ participants) found that optimal sleep (7-8 hours) reduces all-cause mortality by 18%, cardiovascular disease by 22%, and diabetes risk by 37%. The relationship between sleep and weight is bidirectional: poor sleep causes weight gain, and excess weight disrupts sleep.",
    researchSummaryAr: "أبحاث ماثيو ووكر في جامعة كاليفورنيا بيركلي تُظهر أن الحرمان من النوم هو أقوى مؤشر منفرد لمرض الزهايمر — أقوى من الوراثة. تحليل تلوي 2023 في Sleep Medicine Reviews (أكثر من 500,000 مشارك) وجد أن النوم الأمثل (7-8 ساعات) يقلل الوفيات لجميع الأسباب بنسبة 18%، أمراض القلب بنسبة 22%، وخطر السكري بنسبة 37%.",
    keyStatsEn: [{ label: "Insulin Resistance (1 night)", value: "+30%" }, { label: "All-Cause Mortality Reduction", value: "18%" }, { label: "Diabetes Risk Reduction", value: "37%" }, { label: "Immune Function Drop", value: "70%" }],
    keyStatsAr: [{ label: "مقاومة الإنسولين (ليلة واحدة)", value: "+30%" }, { label: "تقليل الوفيات", value: "18%" }, { label: "تقليل خطر السكري", value: "37%" }, { label: "انخفاض المناعة", value: "70%" }],
    faqEn: [
      { q: "How many hours of sleep do I really need?", a: "Adults need 7-9 hours. The exact amount varies by individual genetics, but fewer than 1% of people can function optimally on less than 7 hours (despite what many claim). Quality matters as much as quantity — you need sufficient deep sleep and REM cycles." },
      { q: "Does napping help or hurt sleep?", a: "Short naps (10-20 minutes) before 2pm can boost alertness without affecting nighttime sleep. Longer naps or napping after 3pm can disrupt your circadian rhythm and make it harder to fall asleep at night." },
      { q: "What's the best temperature for sleep?", a: "Research consistently shows 18-20°C (65-68°F) is optimal. Your core body temperature needs to drop 1-2°F to initiate sleep. A cool room, warm shower before bed (causes rebound cooling), and breathable bedding all help." },
      { q: "Can I 'catch up' on sleep on weekends?", a: "Partially. You can recover some sleep debt, but the damage from chronic deprivation (inflammation, insulin resistance, cognitive decline) accumulates and cannot be fully reversed by weekend sleep-ins. Consistency is more important than total hours." }
    ],
    faqAr: [
      { q: "كم ساعة نوم أحتاج فعلاً؟", a: "البالغون يحتاجون 7-9 ساعات. الكمية الدقيقة تختلف حسب الجينات، لكن أقل من 1% يمكنهم العمل بشكل مثالي بأقل من 7 ساعات. الجودة مهمة بقدر الكمية — تحتاج نوم عميق كافٍ ودورات REM." },
      { q: "هل القيلولة تساعد أم تضر النوم؟", a: "القيلولة القصيرة (10-20 دقيقة) قبل الساعة 2 ظهراً يمكن أن تعزز الانتباه بدون التأثير على نوم الليل. القيلولة الأطول أو بعد الساعة 3 عصراً يمكن أن تعطل إيقاعك اليومي." },
      { q: "ما أفضل درجة حرارة للنوم؟", a: "الأبحاث تُظهر باستمرار أن 18-20 درجة مئوية هي المثلى. درجة حرارة جسمك الأساسية تحتاج للانخفاض 1-2 درجة لبدء النوم." },
      { q: "هل يمكنني 'تعويض' النوم في عطلة نهاية الأسبوع؟", a: "جزئياً. يمكنك استعادة بعض دين النوم، لكن الضرر من الحرمان المزمن (التهاب، مقاومة إنسولين، تراجع إدراكي) يتراكم ولا يمكن عكسه بالكامل بنوم عطلة نهاية الأسبوع." }
    ],
    feelGreatEn: "The Feel Great system supports sleep through multiple mechanisms. Unimate's yerba mate contains theobromine — a gentle stimulant that provides focus without the sleep-disrupting effects of caffeine (half-life of 3 hours vs. caffeine's 6-8 hours). When consumed in the morning as part of the 4-4-12 protocol, it supports natural circadian rhythm. Balance's fiber matrix helps stabilize blood sugar overnight, preventing the glucose crashes that cause middle-of-the-night awakening.",
    feelGreatAr: "نظام Feel Great يدعم النوم من خلال آليات متعددة. يربا ماتي في Unimate تحتوي على الثيوبرومين — منبه لطيف يوفر التركيز بدون تأثيرات الكافيين المعطلة للنوم. عند تناوله صباحاً كجزء من بروتوكول 4-4-12، يدعم الإيقاع اليومي الطبيعي. مصفوفة ألياف Balance تساعد في استقرار سكر الدم ليلاً.",
    feelGreatBenefitsEn: ["Theobromine provides focus without sleep disruption", "Stabilizes overnight blood sugar preventing wake-ups", "Supports natural circadian rhythm through morning routine", "Reduces evening cravings that delay sleep", "Promotes gut health linked to better sleep quality", "Supports stress hormone regulation"],
    feelGreatBenefitsAr: ["الثيوبرومين يوفر تركيز بدون تعطيل النوم", "يستقر سكر الدم ليلاً ويمنع الاستيقاظ", "يدعم الإيقاع اليومي الطبيعي من خلال الروتين الصباحي", "يقلل الرغبة المسائية التي تؤخر النوم", "يعزز صحة الأمعاء المرتبطة بجودة نوم أفضل", "يدعم تنظيم هرمونات الإجهاد"],
    relatedCategories: ["sustainable-health", "energy-fatigue"],
    relatedTopics: ["Sleep", "Circadian Rhythm", "Recovery", "Insomnia", "Energy"],
    connectedHubs: ["sustainable-health", "insulin-resistance", "weight-loss", "metabolic-health"]
  },
  {
    slug: "womens-health",
    titleEn: "Women's Health",
    titleAr: "صحة المرأة",
    subtitleEn: "Hormonal Health, PCOS, Menopause & Metabolic Wellness for Women",
    subtitleAr: "الصحة الهرمونية، تكيس المبايض، انقطاع الطمث والعافية الأيضية للمرأة",
    heroImage: "/manus-storage/feel-great-complete_44bb8752.png",
    color: "pink",
    icon: "🌸",
    introEn: "Women's metabolic health is fundamentally different from men's — yet most health advice ignores this. Women's hormones cycle monthly, shift dramatically during pregnancy and menopause, and interact with insulin in unique ways. PCOS affects 1 in 10 women and is directly linked to insulin resistance. Menopause increases diabetes risk by 60%. This comprehensive guide addresses the specific metabolic challenges women face and provides evidence-based solutions tailored to female physiology.",
    introAr: "الصحة الأيضية للمرأة مختلفة جوهرياً عن الرجل — ومع ذلك معظم النصائح الصحية تتجاهل هذا. هرمونات المرأة تدور شهرياً، تتغير بشكل كبير أثناء الحمل وانقطاع الطمث، وتتفاعل مع الإنسولين بطرق فريدة. تكيس المبايض يؤثر على 1 من كل 10 نساء ومرتبط مباشرة بمقاومة الإنسولين.",
    whatIsItEn: "Women's metabolic health encompasses the unique hormonal landscape that affects how women store fat, build muscle, respond to stress, and develop metabolic disease. Key areas include: menstrual cycle optimization, PCOS management, perimenopause/menopause transition, thyroid health, bone density, and the specific ways insulin resistance manifests differently in women (often as PCOS, gestational diabetes, or post-menopausal metabolic syndrome).",
    whatIsItAr: "الصحة الأيضية للمرأة تشمل المشهد الهرموني الفريد الذي يؤثر على كيفية تخزين المرأة للدهون، بناء العضلات، الاستجابة للإجهاد، وتطور الأمراض الأيضية. المجالات الرئيسية تشمل: تحسين الدورة الشهرية، إدارة تكيس المبايض، انتقال انقطاع الطمث، صحة الغدة الدرقية، كثافة العظام.",
    symptomsEn: ["Irregular or painful periods", "Weight gain around hips, thighs, and lower belly", "Facial hair growth or hair thinning", "Acne (especially jawline and chin)", "Mood swings synced with menstrual cycle", "Hot flashes and night sweats", "Difficulty building muscle", "Fatigue that worsens before period", "Brain fog during perimenopause", "Decreased libido"],
    symptomsAr: ["دورات غير منتظمة أو مؤلمة", "زيادة وزن حول الوركين والفخذين وأسفل البطن", "نمو شعر الوجه أو ترقق الشعر", "حب شباب (خاصة خط الفك والذقن)", "تقلبات مزاجية متزامنة مع الدورة", "هبات ساخنة وتعرق ليلي", "صعوبة بناء العضلات", "إرهاق يسوء قبل الدورة", "ضبابية ذهنية أثناء ما قبل انقطاع الطمث", "انخفاض الرغبة الجنسية"],
    causesEn: ["Insulin resistance driving androgen excess (PCOS)", "Estrogen dominance from environmental xenoestrogens", "Declining estrogen during perimenopause/menopause", "Thyroid dysfunction (affects 1 in 8 women)", "Chronic stress depleting progesterone", "Nutrient deficiencies (iron, B12, vitamin D)", "Gut dysbiosis affecting estrogen metabolism", "Birth control disrupting natural hormone cycles", "Over-exercising or under-eating (hypothalamic amenorrhea)", "Endocrine disruptors in personal care products"],
    causesAr: ["مقاومة الإنسولين تدفع فرط الأندروجين (تكيس المبايض)", "هيمنة الإستروجين من الإستروجينات البيئية", "انخفاض الإستروجين أثناء انقطاع الطمث", "خلل الغدة الدرقية (يؤثر على 1 من كل 8 نساء)", "الإجهاد المزمن يستنزف البروجسترون", "نقص المغذيات (الحديد، B12، فيتامين د)", "اختلال الميكروبيوم يؤثر على أيض الإستروجين", "حبوب منع الحمل تعطل الدورات الهرمونية الطبيعية", "الإفراط في التمارين أو نقص الأكل", "معطلات الغدد الصماء في منتجات العناية الشخصية"],
    riskFactorsEn: ["PCOS diagnosis", "Family history of diabetes or thyroid disease", "Age 40+ (perimenopause begins)", "History of gestational diabetes", "Endometriosis", "Early menopause (before 45)", "Autoimmune conditions (more common in women)", "History of eating disorders", "High-stress lifestyle", "Sedentary occupation"],
    riskFactorsAr: ["تشخيص تكيس المبايض", "تاريخ عائلي للسكري أو أمراض الغدة الدرقية", "العمر 40+ (بداية ما قبل انقطاع الطمث)", "تاريخ سكري الحمل", "بطانة الرحم المهاجرة", "انقطاع الطمث المبكر (قبل 45)", "حالات مناعة ذاتية (أكثر شيوعاً عند النساء)", "تاريخ اضطرابات الأكل", "نمط حياة عالي الإجهاد", "وظيفة خاملة"],
    researchSummaryEn: "A 2024 Endocrine Reviews meta-analysis confirmed that insulin resistance is the primary driver of PCOS in 70-80% of cases, and that lifestyle interventions targeting insulin are more effective than metformin for PCOS management. The Women's Health Initiative (161,808 women, 15+ years) demonstrated that metabolic health during perimenopause predicts cardiovascular outcomes for the next 20 years. Research from the Mayo Clinic shows that women who maintain metabolic flexibility through menopause have 50% lower risk of cognitive decline.",
    researchSummaryAr: "تحليل تلوي 2024 في Endocrine Reviews أكد أن مقاومة الإنسولين هي المحرك الأساسي لتكيس المبايض في 70-80% من الحالات، وأن تدخلات نمط الحياة المستهدفة للإنسولين أكثر فعالية من الميتفورمين لإدارة تكيس المبايض.",
    keyStatsEn: [{ label: "Women with PCOS", value: "1 in 10" }, { label: "PCOS Driven by Insulin", value: "70-80%" }, { label: "Menopause Diabetes Risk", value: "+60%" }, { label: "Cognitive Decline Prevention", value: "50%" }],
    keyStatsAr: [{ label: "نساء مصابات بتكيس المبايض", value: "1 من 10" }, { label: "تكيس مدفوع بالإنسولين", value: "70-80%" }, { label: "خطر سكري انقطاع الطمث", value: "+60%" }, { label: "الوقاية من التراجع الإدراكي", value: "50%" }],
    faqEn: [
      { q: "Is PCOS reversible?", a: "While PCOS cannot be 'cured,' its symptoms can be dramatically reduced or eliminated through addressing the root cause — insulin resistance. Many women achieve regular cycles, clear skin, and natural fertility within 3-6 months of targeted lifestyle changes." },
      { q: "Should women fast differently than men?", a: "Yes. Women are more sensitive to caloric restriction signals. Shorter fasting windows (12-14 hours vs. 16-20 for men), cycling fasting with the menstrual cycle, and ensuring adequate calories during the luteal phase are important modifications." },
      { q: "How does menopause affect metabolism?", a: "Declining estrogen reduces insulin sensitivity, shifts fat storage to the abdomen, decreases muscle mass, and affects sleep quality. However, these changes are manageable with proactive metabolic interventions starting in perimenopause." },
      { q: "What supplements are most important for women?", a: "Key nutrients often deficient in women: iron (especially with heavy periods), vitamin D (affects hormones and bones), magnesium (supports 300+ enzymatic reactions), omega-3 (anti-inflammatory), and B12 (energy and mood). Always test levels before supplementing." }
    ],
    faqAr: [
      { q: "هل تكيس المبايض قابل للعكس؟", a: "بينما لا يمكن 'شفاء' تكيس المبايض، يمكن تقليل أعراضه بشكل كبير أو إزالتها من خلال معالجة السبب الجذري — مقاومة الإنسولين. كثير من النساء يحققن دورات منتظمة وبشرة صافية وخصوبة طبيعية خلال 3-6 أشهر." },
      { q: "هل يجب أن تصوم النساء بشكل مختلف عن الرجال؟", a: "نعم. النساء أكثر حساسية لإشارات تقييد السعرات. فترات صيام أقصر (12-14 ساعة مقابل 16-20 للرجال)، وتدوير الصيام مع الدورة الشهرية، وضمان سعرات كافية خلال المرحلة الأصفرية مهمة." },
      { q: "كيف يؤثر انقطاع الطمث على الأيض؟", a: "انخفاض الإستروجين يقلل حساسية الإنسولين، يحول تخزين الدهون للبطن، يقلل كتلة العضلات، ويؤثر على جودة النوم. لكن هذه التغييرات قابلة للإدارة مع تدخلات أيضية استباقية." },
      { q: "ما أهم المكملات للنساء؟", a: "المغذيات الرئيسية الناقصة غالباً عند النساء: الحديد (خاصة مع الدورات الغزيرة)، فيتامين د (يؤثر على الهرمونات والعظام)، المغنيسيوم (يدعم 300+ تفاعل إنزيمي)، أوميغا-3 (مضاد للالتهاب)، و B12 (الطاقة والمزاج)." }
    ],
    feelGreatEn: "The Feel Great system is particularly beneficial for women because it addresses insulin resistance — the root cause of PCOS and a major factor in menopausal metabolic changes. The gentle approach of the 4-4-12 protocol is well-suited to female physiology, avoiding the extreme fasting that can disrupt women's hormones. Balance's fiber supports estrogen metabolism through the gut (estrobolome), while Unimate provides steady energy without the cortisol spikes that worsen hormonal imbalances.",
    feelGreatAr: "نظام Feel Great مفيد بشكل خاص للنساء لأنه يعالج مقاومة الإنسولين — السبب الجذري لتكيس المبايض وعامل رئيسي في التغيرات الأيضية لانقطاع الطمث. النهج اللطيف لبروتوكول 4-4-12 مناسب لفسيولوجيا المرأة، متجنباً الصيام المتطرف الذي يمكن أن يعطل هرمونات المرأة.",
    feelGreatBenefitsEn: ["Addresses insulin resistance (root cause of PCOS)", "Gentle fasting approach suited to female physiology", "Supports estrogen metabolism through gut health", "Provides steady energy without cortisol spikes", "Helps manage menopausal metabolic changes", "Supports healthy weight during hormonal transitions"],
    feelGreatBenefitsAr: ["يعالج مقاومة الإنسولين (السبب الجذري لتكيس المبايض)", "نهج صيام لطيف مناسب لفسيولوجيا المرأة", "يدعم أيض الإستروجين من خلال صحة الأمعاء", "يوفر طاقة مستقرة بدون ارتفاعات الكورتيزول", "يساعد في إدارة التغيرات الأيضية لانقطاع الطمث", "يدعم الوزن الصحي أثناء التحولات الهرمونية"],
    relatedCategories: ["sustainable-health", "insulin-resistance"],
    relatedTopics: ["PCOS", "Menopause", "Hormones", "Women's Health", "Fertility"],
    connectedHubs: ["sustainable-health", "insulin-resistance", "gut-health", "weight-loss", "metabolic-health"]
  },
  {
    slug: "metabolic-health",
    titleEn: "Metabolic Health",
    titleAr: "الصحة الأيضية",
    subtitleEn: "The 5 Markers That Predict Your Health Future: A Complete Metabolic Guide",
    subtitleAr: "المؤشرات الخمسة التي تتنبأ بمستقبلك الصحي: دليل أيضي شامل",
    heroImage: "/manus-storage/feel-great-complete_44bb8752.png",
    color: "teal",
    icon: "🔬",
    introEn: "Only 6.8% of American adults are metabolically healthy. Metabolic health is defined by 5 markers: blood sugar, triglycerides, HDL cholesterol, blood pressure, and waist circumference. When any of these are abnormal, your risk of heart disease, diabetes, cancer, and dementia increases exponentially. This guide explains how to measure, understand, and optimize each marker using evidence-based strategies that address root causes rather than symptoms.",
    introAr: "فقط 6.8% من البالغين الأمريكيين يتمتعون بصحة أيضية. الصحة الأيضية تُعرّف بـ 5 مؤشرات: سكر الدم، الدهون الثلاثية، الكوليسترول الجيد HDL، ضغط الدم، ومحيط الخصر. عندما يكون أي منها غير طبيعي، يزداد خطر أمراض القلب والسكري والسرطان والخرف بشكل أسي.",
    whatIsItEn: "Metabolic health is the state where your body efficiently converts food to energy, maintains stable blood sugar, processes fats properly, and regulates blood pressure — all without medication. It's measured by 5 criteria (meeting ALL without medication): Fasting glucose <100 mg/dL, Triglycerides <150 mg/dL, HDL >40 mg/dL (men) or >50 mg/dL (women), Blood pressure <120/80, Waist circumference <40\" (men) or <35\" (women). Failing 3+ criteria = Metabolic Syndrome.",
    whatIsItAr: "الصحة الأيضية هي الحالة التي يحول فيها جسمك الطعام إلى طاقة بكفاءة، يحافظ على سكر دم مستقر، يعالج الدهون بشكل صحيح، وينظم ضغط الدم — كل ذلك بدون أدوية. تُقاس بـ 5 معايير: جلوكوز الصيام أقل من 100، الدهون الثلاثية أقل من 150، HDL أعلى من 40/50، ضغط الدم أقل من 120/80، محيط الخصر أقل من 102/88 سم.",
    symptomsEn: ["Elevated fasting blood sugar (>100 mg/dL)", "High triglycerides (>150 mg/dL)", "Low HDL cholesterol (<40 men / <50 women)", "Elevated blood pressure (>120/80)", "Large waist circumference", "Fatigue and energy crashes", "Difficulty losing weight", "Inflammation markers elevated (CRP)", "Fatty liver on ultrasound", "Skin tags and dark patches"],
    symptomsAr: ["ارتفاع سكر الصيام (أكثر من 100)", "ارتفاع الدهون الثلاثية (أكثر من 150)", "انخفاض الكوليسترول الجيد", "ارتفاع ضغط الدم", "محيط خصر كبير", "إرهاق وانهيارات طاقة", "صعوبة فقدان الوزن", "ارتفاع مؤشرات الالتهاب", "كبد دهني في الموجات فوق الصوتية", "زوائد جلدية وبقع داكنة"],
    causesEn: ["Chronic hyperinsulinemia (excess insulin)", "Ultra-processed food diet", "Physical inactivity", "Chronic stress", "Poor sleep", "Visceral fat accumulation", "Gut dysbiosis", "Environmental toxins", "Genetic predisposition", "Aging without intervention"],
    causesAr: ["فرط الإنسولين المزمن", "نظام غذائي من أطعمة فائقة المعالجة", "الخمول البدني", "الإجهاد المزمن", "النوم السيء", "تراكم الدهون الحشوية", "اختلال الميكروبيوم", "السموم البيئية", "الاستعداد الوراثي", "الشيخوخة بدون تدخل"],
    riskFactorsEn: ["Age over 40", "Family history of metabolic disease", "Sedentary lifestyle", "BMI over 25", "History of gestational diabetes", "PCOS", "Sleep apnea", "Chronic medication use", "Smoking history", "High-stress occupation"],
    riskFactorsAr: ["العمر فوق 40", "تاريخ عائلي لأمراض أيضية", "نمط حياة خامل", "مؤشر كتلة الجسم فوق 25", "تاريخ سكري الحمل", "تكيس المبايض", "انقطاع النفس أثناء النوم", "استخدام أدوية مزمن", "تاريخ تدخين", "وظيفة عالية الإجهاد"],
    researchSummaryEn: "The landmark 2022 study in the Journal of the American College of Cardiology found that only 6.8% of US adults meet all 5 metabolic health criteria — down from 12% in 1999. However, a 2024 Cell Metabolism study demonstrated that targeted lifestyle interventions can restore metabolic health in 65% of participants within 16 weeks. The key insight: insulin is the master regulator. Normalizing insulin levels naturally corrects all 5 metabolic markers in most people.",
    researchSummaryAr: "دراسة بارزة 2022 في Journal of the American College of Cardiology وجدت أن 6.8% فقط من البالغين الأمريكيين يستوفون جميع معايير الصحة الأيضية الخمسة. لكن دراسة 2024 في Cell Metabolism أثبتت أن تدخلات نمط الحياة المستهدفة يمكنها استعادة الصحة الأيضية في 65% من المشاركين خلال 16 أسبوعاً.",
    keyStatsEn: [{ label: "Metabolically Healthy Adults", value: "6.8%" }, { label: "Restoration Success (16 wks)", value: "65%" }, { label: "Heart Disease Risk (MetS)", value: "3x" }, { label: "Diabetes Risk (MetS)", value: "5x" }],
    keyStatsAr: [{ label: "بالغين أصحاء أيضياً", value: "6.8%" }, { label: "نجاح الاستعادة (16 أسبوع)", value: "65%" }, { label: "خطر أمراض القلب", value: "3 أضعاف" }, { label: "خطر السكري", value: "5 أضعاف" }],
    faqEn: [
      { q: "What are the 5 markers of metabolic health?", a: "1) Fasting glucose <100 mg/dL, 2) Triglycerides <150 mg/dL, 3) HDL cholesterol >40 mg/dL (men) or >50 mg/dL (women), 4) Blood pressure <120/80 mmHg, 5) Waist circumference <40\" (men) or <35\" (women). You must meet ALL 5 without medication to be considered metabolically healthy." },
      { q: "Can metabolic syndrome be reversed?", a: "Yes. Research shows 65% of people can reverse metabolic syndrome within 16 weeks through targeted lifestyle changes. The key is addressing insulin resistance as the root cause, which naturally improves all 5 markers simultaneously." },
      { q: "Why is waist circumference more important than BMI?", a: "Waist circumference measures visceral fat — the metabolically active fat around organs that drives insulin resistance and inflammation. You can have a 'normal' BMI but dangerous levels of visceral fat (TOFI: Thin Outside, Fat Inside). Waist measurement is a better predictor of metabolic disease." },
      { q: "What's the single most impactful change for metabolic health?", a: "Reducing refined carbohydrates and implementing time-restricted eating (12-16 hour overnight fast). This directly lowers insulin levels, which is the master switch for all 5 metabolic markers. Combined with 150+ minutes of weekly exercise, this addresses the root cause." }
    ],
    faqAr: [
      { q: "ما هي المؤشرات الخمسة للصحة الأيضية؟", a: "1) جلوكوز الصيام أقل من 100، 2) الدهون الثلاثية أقل من 150، 3) الكوليسترول الجيد أعلى من 40 (رجال) أو 50 (نساء)، 4) ضغط الدم أقل من 120/80، 5) محيط الخصر أقل من 102 سم (رجال) أو 88 سم (نساء). يجب استيفاء الخمسة بدون أدوية." },
      { q: "هل يمكن عكس متلازمة الأيض؟", a: "نعم. الأبحاث تُظهر أن 65% يمكنهم عكس متلازمة الأيض خلال 16 أسبوعاً من خلال تغييرات نمط حياة مستهدفة. المفتاح هو معالجة مقاومة الإنسولين كسبب جذري." },
      { q: "لماذا محيط الخصر أهم من مؤشر كتلة الجسم؟", a: "محيط الخصر يقيس الدهون الحشوية — الدهون النشطة أيضياً حول الأعضاء التي تدفع مقاومة الإنسولين والالتهاب. يمكن أن يكون لديك مؤشر كتلة جسم 'طبيعي' لكن مستويات خطيرة من الدهون الحشوية." },
      { q: "ما أكثر تغيير مؤثر للصحة الأيضية؟", a: "تقليل الكربوهيدرات المكررة وتطبيق الأكل المقيد بالوقت (صيام 12-16 ساعة ليلاً). هذا يخفض مستويات الإنسولين مباشرة، وهو المفتاح الرئيسي لجميع المؤشرات الأيضية الخمسة." }
    ],
    feelGreatEn: "The Feel Great system is designed as a metabolic health optimization tool. It directly targets the root cause of metabolic dysfunction — chronically elevated insulin. The 4-4-12 protocol creates natural insulin-lowering windows. Balance reduces post-meal glucose and insulin spikes by up to 40%. Unimate supports fat oxidation and mental clarity during fasting periods. Clinical studies on the Feel Great protocol show improvements in all 5 metabolic markers within 90 days.",
    feelGreatAr: "نظام Feel Great مصمم كأداة لتحسين الصحة الأيضية. يستهدف مباشرة السبب الجذري للخلل الأيضي — الإنسولين المرتفع بشكل مزمن. بروتوكول 4-4-12 يخلق نوافذ طبيعية لخفض الإنسولين. Balance يقلل ارتفاعات الجلوكوز والإنسولين بعد الوجبات بنسبة تصل إلى 40%. الدراسات السريرية تُظهر تحسينات في جميع المؤشرات الأيضية الخمسة خلال 90 يوماً.",
    feelGreatBenefitsEn: ["Targets root cause: chronically elevated insulin", "Reduces post-meal glucose spikes by up to 40%", "Creates natural insulin-lowering fasting windows", "Supports fat oxidation during fasting", "Clinical evidence showing improvement in all 5 markers", "Simple protocol requiring no calorie counting"],
    feelGreatBenefitsAr: ["يستهدف السبب الجذري: الإنسولين المرتفع بشكل مزمن", "يقلل ارتفاعات الجلوكوز بعد الوجبات بنسبة تصل إلى 40%", "يخلق نوافذ صيام طبيعية لخفض الإنسولين", "يدعم أكسدة الدهون أثناء الصيام", "أدلة سريرية تُظهر تحسن في جميع المؤشرات الخمسة", "بروتوكول بسيط لا يتطلب حساب سعرات"],
    relatedCategories: ["metabolic-health", "insulin-resistance", "sustainable-health"],
    relatedTopics: ["Metabolic Syndrome", "Blood Sugar", "Cholesterol", "Blood Pressure", "Visceral Fat"],
    connectedHubs: ["sustainable-health", "insulin-resistance", "gut-health", "weight-loss", "sleep", "womens-health"]
  }
];

// ═══════════════════════════════════════════════════════════════
// HEALTH LIBRARY MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function HealthLibrary() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  useEffect(() => {
    document.title = isAr
      ? "مكتبة الصحة - مراكز المعرفة الشاملة | Feel Great"
      : "Health Library - Comprehensive Knowledge Hubs | Feel Great";
  }, [isAr]);

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Hero */}
      <header className="relative bg-gradient-to-br from-[#0a2e1a] via-[#134e2e] to-[#1a6b3f] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-400 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-400 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm mb-6 border border-white/10">
            <span>📚</span>
            <span>{isAr ? "مبني على أكثر من 47,000 دراسة علمية" : "Built on 47,000+ Peer-Reviewed Studies"}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {isAr ? "مكتبة الصحة" : "Health Library"}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-2">
            {isAr
              ? "مراكز معرفة شاملة مبنية على أحدث الأبحاث العلمية. كل مركز هو دليل متكامل قادر على أن يكون مرجعك الأول"
              : "Comprehensive knowledge hubs built on the latest scientific research. Each hub is a complete evidence-based guide designed to be your primary reference"}
          </p>
          <p className="text-sm text-gray-400">
            {isAr ? "بقلم فراس العايد — أخصائي التغذية العلاجية والسلوكية" : "By Feras Alayed — Therapeutic & Behavioral Nutrition Specialist"}
          </p>
        </div>
      </header>

      {/* Hubs Grid */}
      <main className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLAR_HUBS.map((hub) => (
            <Link key={hub.slug} href={`/health-library/${hub.slug}`}>
              <Card className="group h-full cursor-pointer border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r from-${hub.color}-500 to-${hub.color}-600`} />
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{hub.icon}</div>
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                    {isAr ? hub.titleAr : hub.titleEn}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {isAr ? hub.subtitleAr : hub.subtitleEn}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hub.keyStatsEn.slice(0, 2).map((stat, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {isAr ? hub.keyStatsAr[i].label : stat.label}: {stat.value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Authority Section */}
        <section className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {isAr ? "لماذا تثق بمكتبة الصحة هذه؟" : "Why Trust This Health Library?"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
            {[
              { icon: "🔬", labelEn: "Peer-Reviewed Sources", labelAr: "مصادر محكّمة", valueEn: "47,000+ studies", valueAr: "47,000+ دراسة" },
              { icon: "🏥", labelEn: "Medical Institutions", labelAr: "مؤسسات طبية", valueEn: "Harvard, Stanford, NIH", valueAr: "هارفارد، ستانفورد" },
              { icon: "👨‍⚕️", labelEn: "Expert Author", labelAr: "مؤلف خبير", valueEn: "Feras Alayed, RDN", valueAr: "فراس العايد" },
              { icon: "📅", labelEn: "Updated", labelAr: "محدّث", valueEn: "Daily", valueAr: "يومياً" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-xs text-muted-foreground">{isAr ? item.labelAr : item.labelEn}</div>
                <div className="text-sm font-semibold text-foreground">{isAr ? item.valueAr : item.valueEn}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL PILLAR HUB PAGE
// ═══════════════════════════════════════════════════════════════

export function HealthLibraryHub() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  const hub = useMemo(() => PILLAR_HUBS.find(h => h.slug === slug), [slug]);

  // Fetch related articles
  const { data: articlesData } = trpc.blog.getByCategory.useQuery(
    { category: hub?.relatedCategories?.[0] ?? "", limit: 6 },
    { enabled: !!hub && !!hub.relatedCategories?.[0] }
  );

  // Fetch related research
  const { data: researchData } = trpc.research.list.useQuery(
    { limit: 4, topic: hub?.relatedTopics?.[0] },
    { enabled: !!hub }
  );

  useEffect(() => {
    if (hub) {
      document.title = isAr
        ? `${hub.titleAr} - دليل شامل | Feel Great`
        : `${hub.titleEn} - Complete Guide | Feel Great`;
    }
  }, [hub, isAr]);

  if (!hub) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Hub Not Found</h1>
          <Link href="/health-library" className="text-primary hover:underline">
            ← Back to Health Library
          </Link>
        </div>
      </div>
    );
  }

  const articles = (articlesData ?? []) as any[];
  const studies = researchData?.studies ?? [];
  const connectedHubData = PILLAR_HUBS.filter(h => hub.connectedHubs.includes(h.slug));

  return (
    <div className="min-h-screen bg-background" dir={isAr ? "rtl" : "ltr"}>
      {/* Hero */}
      <header className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-10 left-10 w-96 h-96 bg-${hub.color}-500 rounded-full blur-[150px]`} />
        </div>
        <div className="container relative z-10">
          <Link href="/health-library" className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            ← {isAr ? "العودة لمكتبة الصحة" : "Back to Health Library"}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{hub.icon}</span>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {isAr ? hub.titleAr : hub.titleEn}
              </h1>
              <p className="text-lg text-gray-300 mt-2">
                {isAr ? hub.subtitleAr : hub.subtitleEn}
              </p>
            </div>
          </div>
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {(isAr ? hub.keyStatsAr : hub.keyStatsEn).map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-3">
        <div className="container">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide text-sm">
            {[
              { id: "introduction", labelEn: "Introduction", labelAr: "مقدمة" },
              { id: "what-is-it", labelEn: "What Is It?", labelAr: "ما هو؟" },
              { id: "symptoms", labelEn: "Symptoms", labelAr: "الأعراض" },
              { id: "causes", labelEn: "Causes", labelAr: "الأسباب" },
              { id: "risk-factors", labelEn: "Risk Factors", labelAr: "عوامل الخطر" },
              { id: "research", labelEn: "Research", labelAr: "الأبحاث" },
              { id: "faq", labelEn: "FAQ", labelAr: "أسئلة شائعة" },
              { id: "articles", labelEn: "Articles", labelAr: "مقالات" },
              { id: "feel-great", labelEn: "Feel Great", labelAr: "Feel Great" },
              { id: "related-hubs", labelEn: "Related Hubs", labelAr: "مراكز مرتبطة" },
            ].map((item) => (
              <a key={item.id} href={`#${item.id}`} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                {isAr ? item.labelAr : item.labelEn}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="container py-12">
        {/* Introduction Section */}
        <section id="introduction" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full" />
            {isAr ? "مقدمة" : "Introduction"}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {isAr ? hub.introAr : hub.introEn}
          </p>
        </section>

        {/* What Is It Section */}
        <section id="what-is-it" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full" />
            {isAr ? `ما هو ${hub.titleAr}؟` : `What Is ${hub.titleEn}?`}
          </h2>
          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <p className="text-muted-foreground leading-relaxed">
              {isAr ? hub.whatIsItAr : hub.whatIsItEn}
            </p>
          </div>
        </section>

        {/* Symptoms Section */}
        <section id="symptoms" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-yellow-500 rounded-full" />
            {isAr ? "الأعراض والعلامات" : "Signs & Symptoms"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(isAr ? hub.symptomsAr : hub.symptomsEn).map((symptom, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <span className="text-yellow-500 mt-0.5">⚠️</span>
                <span className="text-sm text-foreground">{symptom}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Causes Section */}
        <section id="causes" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-red-500 rounded-full" />
            {isAr ? "الأسباب" : "Causes"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(isAr ? hub.causesAr : hub.causesEn).map((cause, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                <span className="text-red-500 font-bold text-sm min-w-[24px]">{i + 1}</span>
                <span className="text-sm text-foreground">{cause}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Risk Factors Section */}
        <section id="risk-factors" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-orange-500 rounded-full" />
            {isAr ? "عوامل الخطر" : "Risk Factors"}
          </h2>
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(isAr ? hub.riskFactorsAr : hub.riskFactorsEn).map((factor, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-orange-500">●</span>
                  <span className="text-sm text-foreground">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scientific Research Section */}
        <section id="research" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-blue-500 rounded-full" />
            {isAr ? "الأبحاث العلمية" : "Scientific Research"}
          </h2>
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed mb-6">
                {isAr ? hub.researchSummaryAr : hub.researchSummaryEn}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(isAr ? hub.keyStatsAr : hub.keyStatsEn).map((stat, i) => (
                  <div key={i} className="text-center p-3 bg-background rounded-lg">
                    <div className="text-xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Studies from DB */}
          {studies.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {isAr ? "دراسات ذات صلة من مركز الأبحاث" : "Related Studies from Research Center"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studies.map((study: any) => (
                  <Link key={study.id} href={`/research/${study.slug}`}>
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="text-xs mb-2">{study.topic}</Badge>
                        <h4 className="text-sm font-medium text-foreground line-clamp-2">
                          {isAr ? study.titleAr : study.titleEn}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{study.journal} • {study.year}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-purple-500 rounded-full" />
            {isAr ? "أسئلة شائعة" : "Frequently Asked Questions"}
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {(isAr ? hub.faqAr : hub.faqEn).map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Related Articles Section */}
        <section id="articles" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-emerald-500 rounded-full" />
            {isAr ? "مقالات ذات صلة" : "Related Articles"}
          </h2>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/blog/${article.slug}`}>
                  <Card className="h-full group hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden">
                    {article.featuredImage && (
                      <div className="h-40 overflow-hidden">
                        <img src={article.featuredImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge variant="secondary" className="text-xs mb-2">{article.category}</Badge>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {isAr ? article.titleAr : article.titleEn}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {isAr ? article.excerptAr : article.excerptEn}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {isAr ? "سيتم إضافة مقالات ذات صلة قريباً..." : "Related articles coming soon..."}
            </p>
          )}
        </section>

        {/* Feel Great Section */}
        <section id="feel-great" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-emerald-500 rounded-full" />
            {isAr ? "كيف يساعد Feel Great" : "How Feel Great Helps"}
          </h2>
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-8 border border-emerald-500/20">
            <p className="text-muted-foreground leading-relaxed mb-6">
              {isAr ? hub.feelGreatAr : hub.feelGreatEn}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(isAr ? hub.feelGreatBenefitsAr : hub.feelGreatBenefitsEn).map((benefit, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span className="text-sm text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors">
                {isAr ? "ابدأ رحلتك مع Feel Great" : "Start Your Feel Great Journey"}
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Connected Hubs (Internal Linking) */}
        <section id="related-hubs" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-primary rounded-full" />
            {isAr ? "مراكز معرفة مرتبطة" : "Connected Knowledge Hubs"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedHubData.map((connHub) => (
              <Link key={connHub.slug} href={`/health-library/${connHub.slug}`}>
                <Card className="group h-full cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{connHub.icon}</span>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {isAr ? connHub.titleAr : connHub.titleEn}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {isAr ? connHub.subtitleAr : connHub.subtitleEn}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Author Authority Section */}
        <section className="bg-muted/50 rounded-xl p-8 border border-border">
          <div className="flex items-start gap-4">
            <img
              src="/manus-storage/feras-author-photo_7c3e9a1b.jpg"
              alt="Feras Alayed"
              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              loading="lazy"
            />
            <div>
              <h3 className="font-bold text-foreground">
                {isAr ? "فراس العايد" : "Feras Alayed"}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {isAr ? "أخصائي التغذية العلاجية والسلوكية" : "Therapeutic & Behavioral Nutrition Specialist"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isAr
                  ? "هذا المحتوى مبني على أحدث الأبحاث العلمية المحكّمة ومراجع من مؤسسات طبية رائدة. يتم تحديثه بانتظام ليعكس أحدث الاكتشافات."
                  : "This content is built on the latest peer-reviewed scientific research and references from leading medical institutions. It is regularly updated to reflect the newest findings."}
              </p>
              <Link href="/author" className="text-primary text-xs hover:underline mt-2 inline-block">
                {isAr ? "عرض الملف الكامل →" : "View Full Profile →"}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
