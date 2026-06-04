import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Phone, Heart, AlertTriangle, CheckCircle, BookOpen } from "lucide-react";

interface ConditionData {
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  symptomsAr: string[];
  symptomsEn: string[];
  howHelpAr: string[];
  howHelpEn: string[];
  factsAr: string[];
  factsEn: string[];
  relatedCategory: string;
}

const CONDITIONS: ConditionData[] = [
  {
    slug: "insulin-resistance",
    titleAr: "مقاومة الإنسولين",
    titleEn: "Insulin Resistance",
    descAr: "مقاومة الإنسولين هي حالة لا تستجيب فيها خلايا الجسم بشكل فعال للإنسولين، مما يؤدي إلى ارتفاع مستويات السكر في الدم. تُعد من أهم عوامل الخطر للإصابة بالسكري من النوع الثاني وأمراض القلب.",
    descEn: "Insulin resistance is a condition where your body's cells don't respond effectively to insulin, leading to elevated blood sugar levels. It's one of the most significant risk factors for type 2 diabetes and cardiovascular disease.",
    symptomsAr: ["زيادة الوزن خاصة حول البطن", "الإرهاق المستمر بعد الوجبات", "الرغبة الشديدة في تناول السكريات", "صعوبة فقدان الوزن", "ارتفاع ضغط الدم", "ارتفاع الدهون الثلاثية"],
    symptomsEn: ["Weight gain especially around the abdomen", "Persistent fatigue after meals", "Intense sugar cravings", "Difficulty losing weight", "High blood pressure", "Elevated triglycerides"],
    howHelpAr: ["Balance يساعد في إبطاء امتصاص الكربوهيدرات وتقليل ارتفاع السكر بعد الوجبات", "Unimate يدعم الطاقة والتركيز دون رفع مستوى الأنسولين", "نظام 4-4-12 يمنح البنكرياس فترات راحة لتحسين حساسية الإنسولين", "الألياف الذكية في Balance تشكل جلاً يبطئ إفراغ المعدة"],
    howHelpEn: ["Balance helps slow carbohydrate absorption and reduce post-meal blood sugar spikes", "Unimate supports energy and focus without raising insulin levels", "The 4-4-12 system gives your pancreas rest periods to improve insulin sensitivity", "Smart fibers in Balance form a gel that slows stomach emptying"],
    factsAr: ["أكثر من 40% من البالغين يعانون من مقاومة الإنسولين دون معرفتهم", "يمكن عكس مقاومة الإنسولين بتغييرات نمط الحياة", "الصيام المتقطع من أفضل الطرق لتحسين حساسية الإنسولين"],
    factsEn: ["Over 40% of adults have insulin resistance without knowing it", "Insulin resistance can be reversed with lifestyle changes", "Intermittent fasting is one of the best ways to improve insulin sensitivity"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "diabetes-type2",
    titleAr: "السكري من النوع الثاني",
    titleEn: "Type 2 Diabetes",
    descAr: "السكري من النوع الثاني هو حالة مزمنة تؤثر على طريقة استقلاب الجسم للسكر. يحدث عندما يصبح الجسم مقاوماً للإنسولين أو عندما لا ينتج البنكرياس كمية كافية منه.",
    descEn: "Type 2 diabetes is a chronic condition that affects how your body metabolizes sugar. It occurs when your body becomes resistant to insulin or when the pancreas doesn't produce enough of it.",
    symptomsAr: ["العطش المفرط", "كثرة التبول", "التعب والإرهاق", "بطء التئام الجروح", "تنميل في الأطراف", "ضبابية الرؤية"],
    symptomsEn: ["Excessive thirst", "Frequent urination", "Fatigue and exhaustion", "Slow wound healing", "Numbness in extremities", "Blurred vision"],
    howHelpAr: ["نظام Feel Great يدعم إدارة مستويات السكر بشكل طبيعي", "الألياف في Balance تقلل من ارتفاع السكر بعد الوجبات", "الصيام المتقطع 4-4-12 يحسن حساسية الإنسولين", "Unimate يوفر طاقة مستدامة دون التأثير على مستوى السكر"],
    howHelpEn: ["The Feel Great system supports natural blood sugar management", "Fiber in Balance reduces post-meal blood sugar spikes", "The 4-4-12 intermittent fasting improves insulin sensitivity", "Unimate provides sustained energy without affecting blood sugar levels"],
    factsAr: ["537 مليون شخص مصاب بالسكري حول العالم", "80% من حالات السكري النوع 2 يمكن الوقاية منها", "إدارة نمط الحياة هي الخط الأول في العلاج"],
    factsEn: ["537 million people worldwide have diabetes", "80% of type 2 diabetes cases are preventable", "Lifestyle management is the first line of treatment"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "fatty-liver",
    titleAr: "الكبد الدهني",
    titleEn: "Fatty Liver Disease",
    descAr: "مرض الكبد الدهني غير الكحولي (NAFLD) هو تراكم الدهون في خلايا الكبد. يرتبط ارتباطاً وثيقاً بمقاومة الإنسولين والسمنة ويمكن أن يتطور إلى التهاب وتليف الكبد.",
    descEn: "Non-alcoholic fatty liver disease (NAFLD) is the accumulation of fat in liver cells. It's closely linked to insulin resistance and obesity and can progress to inflammation and liver fibrosis.",
    symptomsAr: ["إرهاق مزمن", "ألم في الجانب الأيمن العلوي", "انتفاخ البطن", "ارتفاع إنزيمات الكبد", "صعوبة فقدان الوزن", "اضطرابات هضمية"],
    symptomsEn: ["Chronic fatigue", "Upper right abdominal pain", "Abdominal bloating", "Elevated liver enzymes", "Difficulty losing weight", "Digestive issues"],
    howHelpAr: ["تقليل الدهون الحشوية من خلال نظام الصيام المتقطع", "Balance يقلل امتصاص الدهون والكربوهيدرات الزائدة", "تحسين حساسية الإنسولين يساعد الكبد على التخلص من الدهون", "دعم عملية الأيض الصحي"],
    howHelpEn: ["Reducing visceral fat through intermittent fasting", "Balance reduces absorption of excess fats and carbohydrates", "Improving insulin sensitivity helps the liver shed fat", "Supporting healthy metabolism"],
    factsAr: ["25% من سكان العالم يعانون من الكبد الدهني", "الكبد الدهني قابل للعكس في مراحله المبكرة", "فقدان 5-10% من الوزن يحسن صحة الكبد بشكل ملحوظ"],
    factsEn: ["25% of the world's population has fatty liver", "Fatty liver is reversible in its early stages", "Losing 5-10% of body weight significantly improves liver health"],
    relatedCategory: "sustainable-health",
  },
  {
    slug: "ibs",
    titleAr: "القولون العصبي (IBS)",
    titleEn: "Irritable Bowel Syndrome (IBS)",
    descAr: "متلازمة القولون العصبي هي اضطراب وظيفي في الجهاز الهضمي يسبب آلاماً في البطن وتغيرات في حركة الأمعاء. يؤثر على جودة الحياة بشكل كبير ويرتبط بالتوتر وصحة الأمعاء.",
    descEn: "Irritable Bowel Syndrome is a functional digestive disorder causing abdominal pain and changes in bowel habits. It significantly impacts quality of life and is linked to stress and gut health.",
    symptomsAr: ["آلام وتقلصات في البطن", "انتفاخ وغازات", "إسهال أو إمساك أو كلاهما", "شعور بعدم إفراغ الأمعاء بالكامل", "مخاط في البراز", "تفاقم الأعراض مع التوتر"],
    symptomsEn: ["Abdominal pain and cramps", "Bloating and gas", "Diarrhea, constipation, or both", "Feeling of incomplete bowel emptying", "Mucus in stool", "Worsening symptoms with stress"],
    howHelpAr: ["الألياف القابلة للذوبان في Balance تدعم صحة الأمعاء", "نظام الصيام المتقطع يمنح الجهاز الهضمي فترات راحة", "تحسين توازن البكتيريا النافعة في الأمعاء", "تقليل الالتهاب في الجهاز الهضمي"],
    howHelpEn: ["Soluble fiber in Balance supports gut health", "Intermittent fasting gives the digestive system rest periods", "Improving beneficial bacteria balance in the gut", "Reducing inflammation in the digestive system"],
    factsAr: ["10-15% من سكان العالم يعانون من القولون العصبي", "صحة الأمعاء ترتبط مباشرة بالصحة النفسية (محور الأمعاء-الدماغ)", "الألياف القابلة للذوبان أفضل من غير القابلة للذوبان لمرضى IBS"],
    factsEn: ["10-15% of the world's population suffers from IBS", "Gut health is directly linked to mental health (gut-brain axis)", "Soluble fiber is better than insoluble fiber for IBS patients"],
    relatedCategory: "gut-health",
  },
  {
    slug: "obesity",
    titleAr: "السمنة وإدارة الوزن",
    titleEn: "Obesity & Weight Management",
    descAr: "السمنة ليست مجرد مشكلة جمالية بل هي حالة صحية معقدة تزيد من خطر الإصابة بأمراض القلب والسكري وبعض أنواع السرطان. الحل المستدام يكمن في تغيير نمط الحياة وليس الحميات القاسية.",
    descEn: "Obesity isn't just a cosmetic issue—it's a complex health condition that increases the risk of heart disease, diabetes, and certain cancers. The sustainable solution lies in lifestyle change, not crash diets.",
    symptomsAr: ["مؤشر كتلة الجسم أعلى من 30", "صعوبة في النشاط البدني", "آلام المفاصل", "ضيق التنفس", "مشاكل في النوم", "تعب مزمن"],
    symptomsEn: ["BMI above 30", "Difficulty with physical activity", "Joint pain", "Shortness of breath", "Sleep problems", "Chronic fatigue"],
    howHelpAr: ["Balance يعزز الشبع ويقلل الشهية بشكل طبيعي", "نظام 4-4-12 يحفز حرق الدهون المخزنة", "Unimate يدعم الطاقة أثناء فترات الصيام", "نهج مستدام بدون حرمان أو حميات قاسية"],
    howHelpEn: ["Balance enhances satiety and naturally reduces appetite", "The 4-4-12 system stimulates stored fat burning", "Unimate supports energy during fasting periods", "A sustainable approach without deprivation or crash diets"],
    factsAr: ["95% من الحميات التقليدية تفشل على المدى الطويل", "الصيام المتقطع يحافظ على الكتلة العضلية أثناء فقدان الوزن", "إنقاص 5% فقط من الوزن يحسن المؤشرات الصحية بشكل ملحوظ"],
    factsEn: ["95% of traditional diets fail long-term", "Intermittent fasting preserves muscle mass during weight loss", "Losing just 5% of body weight significantly improves health markers"],
    relatedCategory: "weight-management",
  },
  {
    slug: "pcos",
    titleAr: "تكيس المبايض (PCOS)",
    titleEn: "Polycystic Ovary Syndrome (PCOS)",
    descAr: "متلازمة تكيس المبايض هي اضطراب هرموني شائع يصيب النساء في سن الإنجاب. ترتبط ارتباطاً وثيقاً بمقاومة الإنسولين وتؤثر على الخصوبة والوزن والصحة العامة.",
    descEn: "Polycystic Ovary Syndrome is a common hormonal disorder affecting women of reproductive age. It's closely linked to insulin resistance and affects fertility, weight, and overall health.",
    symptomsAr: ["عدم انتظام الدورة الشهرية", "زيادة الوزن خاصة حول البطن", "حب الشباب المستمر", "نمو شعر زائد", "تساقط الشعر", "صعوبة الحمل"],
    symptomsEn: ["Irregular periods", "Weight gain especially around the abdomen", "Persistent acne", "Excess hair growth", "Hair loss", "Difficulty conceiving"],
    howHelpAr: ["تحسين حساسية الإنسولين (السبب الجذري لـ PCOS)", "تقليل الالتهاب من خلال التغذية السليمة", "دعم التوازن الهرموني عبر إدارة الوزن", "الصيام المتقطع يساعد في تنظيم الهرمونات"],
    howHelpEn: ["Improving insulin sensitivity (the root cause of PCOS)", "Reducing inflammation through proper nutrition", "Supporting hormonal balance through weight management", "Intermittent fasting helps regulate hormones"],
    factsAr: ["1 من كل 10 نساء مصابة بتكيس المبايض", "70% من حالات PCOS مرتبطة بمقاومة الإنسولين", "تحسين حساسية الإنسولين يمكن أن يعيد الدورة الشهرية لطبيعتها"],
    factsEn: ["1 in 10 women has PCOS", "70% of PCOS cases are linked to insulin resistance", "Improving insulin sensitivity can restore regular menstrual cycles"],
    relatedCategory: "hormonal-balance",
  },
  {
    slug: "high-cholesterol",
    titleAr: "ارتفاع الكوليسترول",
    titleEn: "High Cholesterol",
    descAr: "ارتفاع الكوليسترول يزيد من خطر الإصابة بأمراض القلب والسكتة الدماغية. يمكن إدارته بفعالية من خلال تغييرات نمط الحياة والتغذية السليمة.",
    descEn: "High cholesterol increases the risk of heart disease and stroke. It can be effectively managed through lifestyle changes and proper nutrition.",
    symptomsAr: ["لا أعراض واضحة (القاتل الصامت)", "يُكتشف فقط عبر فحص الدم", "قد يظهر كترسبات دهنية حول العينين", "ارتفاع ضغط الدم المصاحب", "تاريخ عائلي لأمراض القلب", "زيادة الوزن"],
    symptomsEn: ["No obvious symptoms (the silent killer)", "Only detected through blood tests", "May appear as fatty deposits around eyes", "Associated high blood pressure", "Family history of heart disease", "Weight gain"],
    howHelpAr: ["Balance يحتوي على فيتوستيرولات نباتية تقلل امتصاص الكوليسترول", "الألياف القابلة للذوبان ترتبط بالكوليسترول في الأمعاء وتطرده", "تحسين نسبة HDL/LDL من خلال نمط حياة صحي", "دعم صحة القلب والأوعية الدموية"],
    howHelpEn: ["Balance contains plant phytosterols that reduce cholesterol absorption", "Soluble fiber binds to cholesterol in the gut and eliminates it", "Improving HDL/LDL ratio through healthy lifestyle", "Supporting cardiovascular health"],
    factsAr: ["الألياف القابلة للذوبان يمكن أن تخفض الكوليسترول بنسبة 5-10%", "Balance يحتوي على Bios Cardio Matrix لدعم صحة القلب", "تغيير نمط الحياة يمكن أن يغني عن الأدوية في كثير من الحالات"],
    factsEn: ["Soluble fiber can lower cholesterol by 5-10%", "Balance contains Bios Cardio Matrix for heart health support", "Lifestyle changes can eliminate the need for medication in many cases"],
    relatedCategory: "sustainable-health",
  },
  {
    slug: "hypertension",
    titleAr: "ارتفاع ضغط الدم",
    titleEn: "Hypertension",
    descAr: "ارتفاع ضغط الدم هو حالة مزمنة تزيد من خطر الإصابة بأمراض القلب والسكتة الدماغية وأمراض الكلى. يُعرف بالقاتل الصامت لأنه غالباً لا يسبب أعراضاً واضحة.",
    descEn: "Hypertension is a chronic condition that increases the risk of heart disease, stroke, and kidney disease. It's known as the silent killer because it often causes no obvious symptoms.",
    symptomsAr: ["صداع متكرر", "ضيق في التنفس", "نزيف الأنف", "دوخة", "ألم في الصدر", "مشاكل في الرؤية"],
    symptomsEn: ["Frequent headaches", "Shortness of breath", "Nosebleeds", "Dizziness", "Chest pain", "Vision problems"],
    howHelpAr: ["إدارة الوزن تقلل الضغط على القلب والأوعية", "الألياف تدعم صحة الأوعية الدموية", "تقليل مقاومة الإنسولين يحسن ضغط الدم", "نمط حياة صحي ومتوازن"],
    howHelpEn: ["Weight management reduces pressure on heart and vessels", "Fiber supports blood vessel health", "Reducing insulin resistance improves blood pressure", "A healthy and balanced lifestyle"],
    factsAr: ["1.28 مليار شخص يعانون من ارتفاع ضغط الدم عالمياً", "فقدان كل 1 كجم من الوزن يخفض الضغط بمقدار 1 mmHg", "مقاومة الإنسولين من الأسباب الخفية لارتفاع الضغط"],
    factsEn: ["1.28 billion people worldwide have hypertension", "Every 1 kg of weight loss reduces pressure by 1 mmHg", "Insulin resistance is a hidden cause of high blood pressure"],
    relatedCategory: "sustainable-health",
  },
];

function ConditionCard({ condition, lang }: { condition: ConditionData; lang: string }) {
  const isAr = lang === "ar";
  return (
    <Link href={`/health/${condition.slug}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 h-full">
        <CardContent className="p-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {isAr ? condition.titleAr : condition.titleEn}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {isAr ? condition.descAr : condition.descEn}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export function HealthConditionsList() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-white py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <Link href="/">
            <Button variant="ghost" className="mb-6 gap-2 text-white/80 hover:text-white hover:bg-white/10">
              <BackArrow className="w-4 h-4" />
              {isAr ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isAr ? "الحالات الصحية" : "Health Conditions"}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {isAr
              ? "تعرّف على كيف يمكن لنظام Feel Great أن يدعم صحتك في مواجهة التحديات الصحية المختلفة"
              : "Learn how the Feel Great system can support your health against various health challenges"}
          </p>
        </div>
      </header>

      {/* Conditions Grid */}
      <main className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CONDITIONS.map((condition) => (
            <ConditionCard key={condition.slug} condition={condition} lang={lang} />
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-16 p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto mb-3" />
          <p className="text-sm text-amber-800">
            {isAr
              ? "هذه المعلومات للأغراض التعليمية فقط ولا تُغني عن الاستشارة الطبية المتخصصة. يُرجى استشارة طبيبك قبل البدء بأي برنامج صحي جديد."
              : "This information is for educational purposes only and does not replace professional medical advice. Please consult your doctor before starting any new health program."}
          </p>
        </div>

        {/* Cross-links */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/blog" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "المدونة الصحية" : "Health Blog"}</a>
            <a href="/partner" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "كن شريكاً" : "Become a Partner"}</a>
            <a href="/faq" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "الأسئلة الشائعة" : "FAQ"}</a>
            <a href="/founder" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "عن المؤسس" : "About the Founder"}</a>
          </div>
        </div>
      </main>
    </div>
  );
}

export function HealthConditionDetail() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  const params = useParams<{ slug: string }>();
  const condition = CONDITIONS.find((c) => c.slug === params.slug);
  const BackArrow = isAr ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (condition) {
      const title = isAr ? `${condition.titleAr} - Feel Great` : `${condition.titleEn} - Feel Great`;
      document.title = title;

      // Add condition-specific JSON-LD
      const schema = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: isAr ? condition.titleAr : condition.titleEn,
        description: isAr ? condition.descAr : condition.descEn,
        url: `https://feelgreat.us.com/health/${condition.slug}`,
        mainEntity: {
          "@type": "MedicalCondition",
          name: isAr ? condition.titleAr : condition.titleEn,
          description: isAr ? condition.descAr : condition.descEn,
        },
        author: {
          "@type": "Person",
          name: "Feras Alayed",
          jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
        },
      };

      const el = document.createElement("script");
      el.id = "condition-schema";
      el.type = "application/ld+json";
      el.textContent = JSON.stringify(schema);
      document.head.appendChild(el);

      return () => {
        document.getElementById("condition-schema")?.remove();
      };
    }
  }, [condition, isAr]);

  if (!condition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{isAr ? "الصفحة غير موجودة" : "Page Not Found"}</h1>
          <Link href="/health">
            <Button>{isAr ? "عرض جميع الحالات" : "View All Conditions"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-white py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <Link href="/health">
            <Button variant="ghost" className="mb-6 gap-2 text-white/80 hover:text-white hover:bg-white/10">
              <BackArrow className="w-4 h-4" />
              {isAr ? "جميع الحالات" : "All Conditions"}
            </Button>
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {isAr ? condition.titleAr : condition.titleEn}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            {isAr ? condition.descAr : condition.descEn}
          </p>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Symptoms */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            {isAr ? "الأعراض والعلامات" : "Signs & Symptoms"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {(isAr ? condition.symptomsAr : condition.symptomsEn).map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span className="text-foreground/80">{s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How Feel Great Helps */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            {isAr ? "كيف يساعد نظام Feel Great" : "How Feel Great Helps"}
          </h2>
          <div className="space-y-3">
            {(isAr ? condition.howHelpAr : condition.howHelpEn).map((h, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/80">{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Key Facts */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            {isAr ? "حقائق مهمة" : "Key Facts"}
          </h2>
          <div className="space-y-3">
            {(isAr ? condition.factsAr : condition.factsEn).map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <span className="text-primary font-bold text-lg">#{i + 1}</span>
                <span className="text-foreground/80">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {isAr ? "هل تريد استشارة مجانية؟" : "Want a Free Consultation?"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            {isAr
              ? "تواصل مع فراس العايد - أخصائي التغذية العلاجية والسلوكية - للحصول على خطة مخصصة"
              : "Connect with Feras Alayed - Therapeutic & Behavioral Nutrition Specialist - for a personalized plan"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/96877020770?text=أريد استشارة بخصوص " target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gradient-blue text-white border-0">
                <Phone className="w-5 h-5 me-2" />
                {isAr ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
              </Button>
            </a>
            <a href="https://ufeelgreat.com/c/GBP556" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                {isAr ? "ابدأ رحلتك الصحية" : "Start Your Health Journey"}
              </Button>
            </a>
          </div>
        </section>

        {/* Related Articles Link */}
        <section className="text-center">
          <a href={`/blog?category=${condition.relatedCategory}`} className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
            <BookOpen className="w-4 h-4" />
            {isAr ? "اقرأ مقالات ذات صلة" : "Read Related Articles"}
          </a>
        </section>

        {/* Disclaimer */}
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <AlertTriangle className="w-5 h-5 text-amber-600 mx-auto mb-2" />
          <p className="text-xs text-amber-800">
            {isAr
              ? "هذه المعلومات للأغراض التعليمية فقط. منتجات Feel Great ليست مخصصة لتشخيص أو علاج أو الوقاية من أي مرض. يُرجى استشارة طبيبك."
              : "This information is for educational purposes only. Feel Great products are not intended to diagnose, treat, cure, or prevent any disease. Please consult your doctor."}
          </p>
        </div>

        {/* Cross-links */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <a href="/health" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "جميع الحالات" : "All Conditions"}</a>
            <a href="/blog" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "المدونة" : "Blog"}</a>
            <a href="/partner" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "كن شريكاً" : "Partner"}</a>
            <a href="/" className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm">{isAr ? "الرئيسية" : "Home"}</a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HealthConditionsList;
