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
  // ============================================
  // NEW SEO ARTICLES - UNIMATE & BALANCE PRODUCTS
  // ============================================
  {
    slug: "metabolic-syndrome",
    titleAr: "متلازمة التمثيل الغذائي: السبب الجذري للأمراض غير المعدية",
    titleEn: "Metabolic Syndrome: The Root Cause of Non-Communicable Diseases",
    descAr: "متلازمة التمثيل الغذائي هي مجموعة من الاضطرابات تحدث معاً وتزيد من خطر الإصابة بأمراض القلب والسكري والسكتة الدماغية. ترتبط ارتباطاً وثيقاً بمقاومة الإنسولين ونمط الحياة الحديث.",
    descEn: "Metabolic syndrome is a cluster of conditions occurring together that increase the risk of heart disease, diabetes, and stroke. It's closely linked to insulin resistance and modern lifestyle factors.",
    symptomsAr: ["السمنة المركزية (بطن كبيرة)", "ارتفاع السكر الصائم", "ارتفاع ضغط الدم", "ارتفاع الدهون الثلاثية", "انخفاض الكوليسترول الحميد HDL", "الإرهاق المزمن", "الرغبة الشديدة في السكريات"],
    symptomsEn: ["Central obesity (large waist)", "Elevated fasting blood sugar", "High blood pressure", "Elevated triglycerides", "Low HDL cholesterol", "Chronic fatigue", "Intense sugar cravings"],
    howHelpAr: ["Unimate + Balance يحسنان حساسية الإنسولين بشكل جذري", "نظام 4-4-12 يعكس مقاومة الإنسولين", "الألياف الذائبة في Balance تقلل امتصاص الدهون والسكر", "تحسين_profile الدهون الطبيعي", "دعم الطاقة المستدامة بدون تقلبات في السكر"],
    howHelpEn: ["Unimate + Balance dramatically improves insulin sensitivity", "The 4-4-12 system reverses insulin resistance", "Soluble fiber in Balance reduces fat and sugar absorption", "Natural lipid profile improvement", "Sustained energy support without blood sugar spikes"],
    factsAr: ["1 من كل 4 بالغين مصاب بمتلازمة التمثيل الغذائي", "تحدث متلازمة التمثيل الغذائي بسبب مقاومة الإنسولين في 80% من الحالات", "يمكن عكس متلازمة التمثيل الغذائي بتغييرات نمط الحياة في 6 أشهر"],
    factsEn: ["1 in 4 adults has metabolic syndrome", "Metabolic syndrome is caused by insulin resistance in 80% of cases", "Metabolic syndrome can be reversed with lifestyle changes in 6 months"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "chronic-inflammation",
    titleAr: "الالتهابات المزمنة: القاتل الصامت وأسرار صحة الجسم",
    titleEn: "Chronic Inflammation: The Silent Killer and Body Health Secrets",
    descAr: "الالتهاب المزمن هو استجابة مناعية مستمرة تؤدي إلى تلف الأنسجة وأمراض مزمنة. يرتبط بالسمنة ومقاومة الإنسولين وأمراض القلب والسرطان. التغذية السليمة هي المفتاح للسيطرة عليه.",
    descEn: "Chronic inflammation is a sustained immune response that leads to tissue damage and chronic diseases. It's linked to obesity, insulin resistance, heart disease, and cancer. Proper nutrition is the key to controlling it.",
    symptomsAr: ["إرهاق مزمن غير مبرر", "آلام المفاصل والعضلات", "مشاكل في الهضم", "زيادة الوزن", "أرق وصعوبة في النوم", "ضبابية الذهن", "اكتئاب خفيف", "أمراض جلدية متكررة"],
    symptomsEn: ["Unexplained chronic fatigue", "Joint and muscle pain", "Digestive problems", "Weight gain", "Insomnia and sleep difficulty", "Brain fog", "Mild depression", "Recurring skin issues"],
    howHelpAr: ["Balance يحتوي على مضادات أكسدة قوية تحارب الالتهاب", "Unimate يدعم التوازن المناعي الصحي", "الصيام المتقطع 4-4-12 يقلل علامات الالتهاب", "الألياف الذائبة تغذي بكتيريا الأمعاء المفيدة", "تحسين بيئة الأمعاء يقلل الالتهاب العام"],
    howHelpEn: ["Balance contains powerful antioxidants that fight inflammation", "Unimate supports healthy immune balance", "The 4-4-12 intermittent fasting reduces inflammation markers", "Soluble fiber feeds beneficial gut bacteria", "Improving gut environment reduces systemic inflammation"],
    factsAr: ["الالتهاب المزمن يرتبط بـ 90% من الأمراض غير المعدية", "50% من الوفيات العالمية سببها أمراض مرتبطة بالالتهاب", "تغيير نمط الحياة يمكن أن يقلل الالتهاب في 3 أشهر"],
    factsEn: ["Chronic inflammation is linked to 90% of non-communicable diseases", "50% of global deaths are from inflammation-related diseases", "Lifestyle changes can reduce inflammation within 3 months"],
    relatedCategory: "sustainable-health",
  },
  {
    slug: "prediabetes-warning",
    titleAr: "ما قبل السكري: сигналالتحذيري الذي لا يجب تجاهله",
    titleEn: "Prediabetes: The Warning Signal You Cannot Ignore",
    descAr: "ما قبل السكري هو حالة يكون فيها مستوى السكر في الدم أعلى من الطبيعي لكن ليس مرتفعاً بما يكفي لتشخيص السكري. هذه المرحلة قابلة للعكس تماماً إذا تم التدخل مبكراً.",
    descEn: "Prediabetes is a condition where blood sugar levels are higher than normal but not high enough to diagnose diabetes. This stage is completely reversible if intervened early.",
    symptomsAr: ["بقع داكنة في الجلد (الرقبة والإبط)", "الرغبة الشديدة في السكريات", "إرهاق بعد الأكل", "صعوبة التركيز", "زيادة العطش", "كثرة التبول", "ضبابية الرؤية المؤقتة"],
    symptomsEn: ["Dark patches on skin (neck and armpits)", "Intense sugar cravings", "Fatigue after eating", "Difficulty concentrating", "Increased thirst", "Frequent urination", "Temporary blurred vision"],
    howHelpAr: ["نظام Feel Great هو الحل الأمثل لما قبل السكري", "Balance يبطئ امتصاص الكربوهيدرات ويقلل القمم السكرية", "Unimate يوفر طاقة نظيفة بدون رفع السكر", "الصيام 4-4-12 يعيد حساسية البنكرياس", "فقدان 5-7% من الوزن يقلل خطر الإصابة بالسكري بـ 58%"],
    howHelpEn: ["Feel Great system is the perfect solution for prediabetes", "Balance slows carbohydrate absorption and reduces sugar spikes", "Unimate provides clean energy without raising blood sugar", "The 4-4-12 fasting restores pancreatic sensitivity", "Losing 5-7% of weight reduces diabetes risk by 58%"],
    factsAr: ["88 مليون أمريكي مصاب بما قبل السكري", "90% لا يعرفون أنهم مصابون", "يمكن الوقاية من 60% من حالات السكري النوع 2"],
    factsEn: ["88 million Americans have prediabetes", "90% don't know they have it", "60% of type 2 diabetes cases can be prevented"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "cardiovascular-health",
    titleAr: "صحة القلب والأوعية: كيف تحمي قلبك من الأمراض",
    titleEn: "Cardiovascular Health: How to Protect Your Heart from Disease",
    descAr: "أمراض القلب والأوعية هي السبب الأول للوفاة عالمياً. مقاومة الإنسولين والالتهابات المزمنة والتغذية غير الصحية هي الأسباب الرئيسية. الكشف المبكر والتدخل بنمط الحياة يمكن أن يغير المسار.",
    descEn: "Heart and vascular diseases are the leading cause of death globally. Insulin resistance, chronic inflammation, and poor nutrition are the main causes. Early detection and lifestyle intervention can change the course.",
    symptomsAr: ["ألم أو ضغط في الصدر", "ضيق التنفس", "إرهاق غير طبيعي", "تورم القدمين", "نبض قلب غير منتظم", "ألم في الرقبة أو الفك أو الظهر", "دوخة متكررة"],
    symptomsEn: ["Chest pain or pressure", "Shortness of breath", "Unusual fatigue", "Swelling in feet", "Irregular heartbeat", "Pain in neck, jaw, or back", "Frequent dizziness"],
    howHelpAr: ["Balance يحتوي على Bios Cardio Matrix لصحة القلب", "تحسين حساسية الإنسولين يحمي جدران الأوعية", "الألياف الذائبة تخفض الكوليسترول الضار", "نظام 4-4-12 يقلل الدهون الحشوية حول القلب", "Unimate يدعم طاقة القلب الصحية"],
    howHelpEn: ["Balance contains Bios Cardio Matrix for heart health", "Improving insulin sensitivity protects blood vessel walls", "Soluble fiber lowers harmful cholesterol", "The 4-4-12 system reduces visceral fat around the heart", "Unimate supports healthy heart energy"],
    factsAr: ["17.9 مليون شخص يموتون سنوياً بسبب أمراض القلب", "80% من أمراض القلب يمكن الوقاية منها", "مقاومة الإنسولين تضاعف خطر أمراض القلب"],
    factsEn: ["17.9 million people die annually from heart disease", "80% of heart disease is preventable", "Insulin resistance doubles the risk of heart disease"],
    relatedCategory: "sustainable-health",
  },
  {
    slug: "non-communicable-diseases",
    titleAr: "الأمراض غير المعدية (NCDs): وباء العصر الحديث",
    titleEn: "Non-Communicable Diseases (NCDs): The Modern Era Epidemic",
    descAr: "الأمراض غير المعدية مثل السكري وأمراض القلب والسرطان وأمراض التنفس المزمنة تمثل 74% من الوفيات عالمياً. كلها ترتبط بمقاومة الإنسولين ونمط الحياة الحديث. الوقاية ممكنة بتغييرات بسيطة.",
    descEn: "Non-communicable diseases like diabetes, heart disease, cancer, and chronic respiratory diseases represent 74% of global deaths. They are all linked to insulin resistance and modern lifestyle. Prevention is possible with simple changes.",
    symptomsAr: ["إرهاق مزمن", "زيادة الوزن", "صعوبة التركيز", "تقلبات مزاجية", "اضطرابات النوم", "ضعف المناعة", "ألم مزمن", "مشاكل في الهضم"],
    symptomsEn: ["Chronic fatigue", "Weight gain", "Difficulty concentrating", "Mood swings", "Sleep disturbances", "Weak immunity", "Chronic pain", "Digestive issues"],
    howHelpAr: ["Unimate + Balance يعالج السبب الجذري للأمراض غير المعدية", "تحسين حساسية الإنسولين يحمي من 4 من أصل 5 NCDs", "نظام 4-4-12 يحفز إصلاح الخلايا", "الألياف ومضادات الأكسدة تحمي من السرطان", "دعم المناعة المتوازنة يقلل الالتهاب"],
    howHelpEn: ["Unimate + Balance addresses the root cause of NCDs", "Improving insulin sensitivity protects against 4 out of 5 NCDs", "The 4-4-12 system stimulates cell repair", "Fiber and antioxidants protect against cancer", "Balanced immune support reduces inflammation"],
    factsAr: ["41 مليون شخص يموتون سنوياً بسبب NCDs", "77% من هذه الوفيات في الدول النامية", "تغيير نمط الحياة يمكن أن يمنع 80% من أمراض القلب و 90% من السكري"],
    factsEn: ["41 million people die annually from NCDs", "77% of these deaths are in developing countries", "Lifestyle changes can prevent 80% of heart disease and 90% of diabetes"],
    relatedCategory: "sustainable-health",
  },
  // ============================================
  // CANADIAN MARKET SEO ARTICLES (10 ARTICLES)
  // ============================================
  {
    slug: "prediabetes-canada",
    titleAr: "ما قبل السكري في كندا: وباء صامت يصيب 11 مليون كندي",
    titleEn: "Prediabetes in Canada: The Silent Epidemic Affecting 11 Million Canadians",
    descAr: "ما قبل السكري هو حالة خطيرة تسبق الإصابة بالسكري من النوع الثاني. في كندا، يصيب 11 مليون شخص لكن 90% لا يعرفون أنهم مصابون. الكشف المبكر والتدخل يمكن أن يمنع تطور المرض.",
    descEn: "Prediabetes is a serious condition that precedes type 2 diabetes. In Canada, it affects 11 million people but 90% don't know they have it. Early detection and intervention can prevent the disease from developing.",
    symptomsAr: ["بقع داكنة في الجلد (الرقبة والإبط)", "الرغبة الشديدة في السكريات", "إرهاق بعد الأكل", "صعوبة التركيز", "زيادة العطش", "كثرة التبول", "ضبابية الرؤية المؤقتة"],
    symptomsEn: ["Dark patches on skin (neck and armpits)", "Intense sugar cravings", "Fatigue after eating", "Difficulty concentrating", "Increased thirst", "Frequent urination", "Temporary blurred vision"],
    howHelpAr: ["نظام Feel Great هو الحل الكندي الأول لما قبل السكري", "Balance يبطئ امتصاص الكربوهيدرات ويقلل القمم السكرية", "Unimate يوفر طاقة نظيفة بدون رفع السكر", "الصيام 4-4-12 يعيد حساسية البنكرياس", "Shipping مجاني لجميع المقاطعات الكندية"],
    howHelpEn: ["Feel Great is Canada's first solution for prediabetes", "Balance slows carbohydrate absorption and reduces sugar spikes", "Unimate provides clean energy without raising blood sugar", "The 4-4-12 fasting restores pancreatic sensitivity", "Free shipping to all Canadian provinces"],
    factsAr: ["11 مليون كندي مصاب بالسكري أو ما قبل السكري", "90% من الكنديين لا يعرفون إصابتهم", "يمكن الوقاية من 60% من حالات السكري النوع 2"],
    factsEn: ["11 million Canadians have diabetes or prediabetes", "90% of Canadians don't know they have it", "60% of type 2 diabetes cases can be prevented"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "insulin-resistance-diet-canada",
    titleAr: "حمية مقاومة الإنسولين في كندا: الدليل الكندي الشامل",
    titleEn: "Insulin Resistance Diet in Canada: The Complete Canadian Guide",
    descAr: "حمية مقاومة الإنسولين هي المفتاح للوقاية من السكري وأمراض القلب. في كندا، يمكننا الاستفادة من المصادر الغذائية المحلية وتحسين حساسية الإنسولين بشكل طبيعي.",
    descEn: "The insulin resistance diet is the key to preventing diabetes and heart disease. In Canada, we can benefit from local food sources and naturally improve insulin sensitivity.",
    symptomsAr: ["زيادة الوزن خاصة حول البطن", "الإرهاق المستمر بعد الوجبات", "الرغبة الشديدة في تناول السكريات", "صعوبة فقدان الوزن", "ارتفاع ضغط الدم", "ارتفاع الدهون الثلاثية"],
    symptomsEn: ["Weight gain especially around the abdomen", "Persistent fatigue after meals", "Intense sugar cravings", "Difficulty losing weight", "High blood pressure", "Elevated triglycerides"],
    howHelpAr: ["Balance يحتوي على ألياف ذائبة من مصادر كندية طبيعية", "نظام 4-4-12 يحسن حساسية الإنسولين", "Unimate يدعم الطاقة بدون تقلبات السكر", "مناسب للنظام الغذائي الكندي"],
    howHelpEn: ["Balance contains soluble fiber from natural Canadian sources", "The 4-4-12 system improves insulin sensitivity", "Unimate supports energy without blood sugar spikes", "Perfect for Canadian dietary preferences"],
    factsAr: ["1 من كل 3 كنديين مصاب بمقاومة الإنسولين", "الحمية الصحيحة يمكن أن تعكس الحالة في 3-6 أشهر", "كندا من أعلى الدول في معدلات السكري"],
    factsEn: ["1 in 3 Canadians has insulin resistance", "The right diet can reverse the condition in 3-6 months", "Canada has some of the highest diabetes rates globally"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "blood-sugar-levels-canada",
    titleAr: "مستويات السكر في الدم في كندا: القيم الطبيعية والحدود",
    titleEn: "Blood Sugar Levels in Canada: Normal Values and What They Mean",
    descAr: "فهم مستويات السكر في الدم ضروري للوقاية من السكري. في هذا الدليل، نشرح القيم الطبيعية وكيف يمكن للكنديين الحفاظ على مستويات صحية.",
    descEn: "Understanding blood sugar levels is essential for diabetes prevention. In this guide, we explain normal values and how Canadians can maintain healthy levels.",
    symptomsAr: ["تنميل في الأطراف", "كثرة التبول", "العطش المفرط", "ضبابية الرؤية", "إرهاق غير مبرر", "بطء التئام الجروح"],
    symptomsEn: ["Numbness in extremities", "Frequent urination", "Excessive thirst", "Blurred vision", "Unexplained fatigue", "Slow wound healing"],
    howHelpAr: ["Feel Great يساعد في الحفاظ على مستويات سكر طبيعية", "Balance يبطئ امتصاص السكر من الوجبات", "Unimate يحافظ على طاقة مستقرة", "بديل طبيعي للأدوية"],
    howHelpEn: ["Feel Great helps maintain normal blood sugar levels", "Balance slows sugar absorption from meals", "Unimate maintains stable energy", "Natural alternative to medication"],
    factsAr: ["مستوى السكر الصائم الطبيعي: 4.0-5.6 mmol/L", "ما قبل السكري: 5.7-6.9 mmol/L", "السكري: 7.0 mmol/L أو أعلى"],
    factsEn: ["Normal fasting blood sugar: 4.0-5.6 mmol/L", "Prediabetes: 5.7-6.9 mmol/L", "Diabetes: 7.0 mmol/L or higher"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "type2-diabetes-prevention-canada",
    titleAr: "الوقاية من السكري النوع 2 في كندا: دليل شامل",
    titleEn: "Type 2 Diabetes Prevention in Canada: A Complete Guide",
    descAr: "80% من حالات السكري النوع 2 يمكن الوقاية منها. في كندا، يمكننا الاستفادة من نظام healthcare المتقدم والتدخل المبكر.",
    descEn: "80% of type 2 diabetes cases are preventable. In Canada, we can benefit from the advanced healthcare system and early intervention.",
    symptomsAr: ["كثرة التبول", "العطش المفرط", "إرهاق مزمن", "ضبابية الرؤية", "بطء التئام الجروح", "تنميل القدمين", "عدوى متكررة"],
    symptomsEn: ["Frequent urination", "Excessive thirst", "Chronic fatigue", "Blurred vision", "Slow wound healing", "Numbness in feet", "Recurring infections"],
    howHelpAr: ["Feel Great يمنع تطور السكري قبل أن يبدأ", "نظام 4-4-12 يعكس مقاومة الإنسولين", "Balance يحمي خلايا البنكرياس", "Shipping كندي سريع وآمن"],
    howHelpEn: ["Feel Great prevents diabetes development before it starts", "The 4-4-12 system reverses insulin resistance", "Balance protects pancreatic cells", "Fast and safe Canadian shipping"],
    factsAr: ["3.6 مليون كندي مصاب بالسكري", "اضافية 5.3 مليون مصاب بما قبل السكري", "السكري يكلف نظام الصحة الكندي $3.8 مليار سنوياً"],
    factsEn: ["3.6 million Canadians have diabetes", "An additional 5.3 million have prediabetes", "Diabetes costs the Canadian healthcare system $3.8 billion annually"],
    relatedCategory: "insulin-resistance",
  },
  {
    slug: "heart-health-canada",
    titleAr: "صحة القلب في كندا: الوقاية من أمراض القلب",
    titleEn: "Heart Health in Canada: Preventing Cardiovascular Disease",
    descAr: "أمراض القلب هي السبب الأول للوفاة في كندا. مقاومة الإنسولين والتغذية غير الصحية هي الأسباب الرئيسية. التدخل المبكر يمكن أن ينقذ حياتك.",
    descEn: "Heart disease is the leading cause of death in Canada. Insulin resistance and poor nutrition are the main causes. Early intervention can save your life.",
    symptomsAr: ["ألم أو ضغط في الصدر", "ضيق التنفس", "إرهاق غير طبيعي", "تورم القدمين", "نبض قلب غير منتظم", "ألم في الرقبة أو الفك"],
    symptomsEn: ["Chest pain or pressure", "Shortness of breath", "Unusual fatigue", "Swelling in feet", "Irregular heartbeat", "Pain in neck or jaw"],
    howHelpAr: ["Balance يحتوي على Bios Cardio Matrix الكندي", "تحسين حساسية الإنسولين يحمي القلب", "الألياف الذائبة تخفض الكوليسترول", "Unimate يدعم طاقة القلب الصحية"],
    howHelpEn: ["Balance contains Canadian Bios Cardio Matrix", "Improving insulin sensitivity protects the heart", "Soluble fiber lowers cholesterol", "Unimate supports healthy heart energy"],
    factsAr: ["1.6 مليون كندي مصاب بأمراض القلب", "كل 7 دقائق يموت كندي بسبب أمراض القلب", "80% من أمراض القلب يمكن الوقاية منها"],
    factsEn: ["1.6 million Canadians have heart disease", "Every 7 minutes a Canadian dies from heart disease", "80% of heart disease is preventable"],
    relatedCategory: "sustainable-health",
  },
  {
    slug: "intermittent-fasting-canada",
    titleAr: "الصيام المتقطع في كندا: الدليل الكندي للنتائج",
    titleEn: "Intermittent Fasting in Canada: The Canadian Guide to Results",
    descAr: "الصيام المتقطع أصبح من أكثر الطرق شعبية لتحسين الصحة في كندا. الدليل الكندي يشرح أفضل الطرق والنتائج المتوقعة.",
    descEn: "Intermittent fasting has become one of the most popular health methods in Canada. The Canadian guide explains the best approaches and expected results.",
    symptomsAr: ["زيادة الوزن", "إرهاق مزمن", "صعوبة التركيز", "مقاومة الإنسولين", "ارتفاع السكر", "ارتفاع الدهون الثلاثية"],
    symptomsEn: ["Weight gain", "Chronic fatigue", "Difficulty concentrating", "Insulin resistance", "High blood sugar", "High triglycerides"],
    howHelpAr: ["نظام 4-4-12 مصمم خصيصاً للسوق الكندي", "Balance يدعم الجسم أثناء فترات الصيام", "Unimate يوفر طاقة نظيفة خالية من السكر", "يساعد في حرق الدهون المخزنة"],
    howHelpEn: ["The 4-4-12 system designed specifically for the Canadian market", "Balance supports the body during fasting periods", "Unimate provides clean sugar-free energy", "Helps burn stored fat"],
    factsAr: ["الصيام المتقطع يحسن حساسية الإنسولين بنسبة 20-30%", "يساعد في فقدان 3-8% من الوزن في 3 أشهر", "آمن ومُعتمد من خبراء كنديين"],
    factsEn: ["Intermittent fasting improves insulin sensitivity by 20-30%", "Helps lose 3-8% of weight in 3 months", "Safe and approved by Canadian experts"],
    relatedCategory: "weight-management",
  },
  {
    slug: "pcos-canada",
    titleAr: "تكيس المبايض في كندا: الحلول الطبيعية للمرأة الكندية",
    titleEn: "PCOS in Canadian Women: Natural Solutions for Canadian Women",
    descAr: "متلازمة تكيس المبايض تصيب 1 من كل 10 نساء في كندا. مقاومة الإنسولين هي السبب الجذري ويمكن علاجتها بشكل طبيعي.",
    descEn: "Polycystic ovary syndrome affects 1 in 10 women in Canada. Insulin resistance is the root cause and can be treated naturally.",
    symptomsAr: ["عدم انتظام الدورة الشهرية", "زيادة الوزن خاصة حول البطن", "حب الشباب المستمر", "نمو شعر زائد", "تساقط الشعر", "صعوبة الحمل"],
    symptomsEn: ["Irregular periods", "Weight gain especially around abdomen", "Persistent acne", "Excess hair growth", "Hair loss", "Difficulty conceiving"],
    howHelpAr: ["Feel Great يحسن حساسية الإنسولين (السبب الجذري)", "تقليل الالتهاب من خلال التغذية السليمة", "دعم التوازن الهرموني طبيعياً", "صُممت للنساء الكنديات"],
    howHelpEn: ["Feel Great improves insulin sensitivity (the root cause)", "Reducing inflammation through proper nutrition", "Supporting hormonal balance naturally", "Designed for Canadian women"],
    factsAr: ["1 من كل 10 نساء كنديات مصابة بتكيس المبايض", "70% من حالات PCOS مرتبطة بمقاومة الإنسولين", "تحسين حساسية الإنسولين يعيد الدورة الشهرية لطبيعتها"],
    factsEn: ["1 in 10 Canadian women has PCOS", "70% of PCOS cases are linked to insulin resistance", "Improving insulin sensitivity can restore regular menstrual cycles"],
    relatedCategory: "hormonal-balance",
  },
  {
    slug: "natural-supplements-canada",
    titleAr: "المكملات الطبيعية في كندا: الفيتوستيرولات والألياف",
    titleEn: "Natural Supplements in Canada: Phytosterols and Fiber",
    descAr: "المكملات الطبيعية مثل الفيتوستيرولات والألياف الذائبة يمكن أن تحسن صحة القلب والتمثيل الغذائي. كندا من أفضل مصادر هذه المكملات.",
    descEn: "Natural supplements like phytosterols and soluble fiber can improve heart health and metabolism. Canada has some of the best sources for these supplements.",
    symptomsAr: ["ارتفاع الكوليسترول", "ارتفاع الدهون الثلاثية", "مشاكل في الهضم", "إمساك مزمن", "زيادة الوزن", "ارتفاع السكر"],
    symptomsEn: ["High cholesterol", "High triglycerides", "Digestive problems", "Chronic constipation", "Weight gain", "High blood sugar"],
    howHelpAr: ["Balance يحتوي على فيتوستيرولات نباتية طبيعية", "الألياف الذائبة الكندية تحسن الهضم", "يساعد في خفض الكوليسترول بشكل طبيعي", "بديل آمن للأدوية"],
    howHelpEn: ["Balance contains natural plant phytosterols", "Canadian soluble fiber improves digestion", "Helps lower cholesterol naturally", "Safe alternative to medication"],
    factsAr: ["الألياف الذائبة تخفض الكوليسترول بنسبة 5-10%", "الفيتوستيرولات تقلل امتصاص الكوليسترول بنسبة 30%", "Health Canada يوافق على هذه المكملات"],
    factsEn: ["Soluble fiber lowers cholesterol by 5-10%", "Phytosterols reduce cholesterol absorption by 30%", "Health Canada approves these supplements"],
    relatedCategory: "sustainable-health",
  },
  {
    slug: "weight-loss-programs-canada",
    titleAr: "برامج إنقاص الوزن في كندا: الحلول الطبية المعتمدة",
    titleEn: "Weight Loss Programs in Canada: Approved Medical Solutions",
    descAr: "برامج إنقاص الوزن المعتمدة طبياً في كندا تركز على تغيير نمط الحياة طويل الأمد. النتائج المستدامة تحتاج نهج شامل.",
    descEn: "Medically approved weight loss programs in Canada focus on long-term lifestyle change. Sustainable results require a comprehensive approach.",
    symptomsAr: ["السمنة (BMI فوق 30)", "مقاومة الإنسولين", "ارتفاع ضغط الدم", "ارتفاع الكوليسترول", "ارهاق مزمن", "آلام المفاصل"],
    symptomsEn: ["Obesity (BMI above 30)", "Insulin resistance", "High blood pressure", "High cholesterol", "Chronic fatigue", "Joint pain"],
    howHelpAr: ["Feel Great يوفر نهج شامل لإنقاص الوزن", "نظام 4-4-12 يحفز حرق الدهون", "Balance يعزز الشبع بشكل طبيعي", "Unimate يدعم الطاقة أثناء إنقاص الوزن"],
    howHelpEn: ["Feel Great provides a comprehensive weight loss approach", "The 4-4-12 system stimulates fat burning", "Balance enhances satiety naturally", "Unimate supports energy during weight loss"],
    factsAr: ["فقدان 5-10% من الوزن يحسن جميع المؤشرات الصحية", "95% من الحميات التقليدية تفشل على المدى الطويل", "نظام 4-4-12 يحافظ على الكتلة العضلية"],
    factsEn: ["Losing 5-10% of body weight improves all health markers", "95% of traditional diets fail long-term", "The 4-4-12 system preserves muscle mass"],
    relatedCategory: "weight-management",
  },
  {
    slug: "diabetes-canada-statistics",
    titleAr: "إحصائيات السكري في كندا: الأرقام التي يجب أن تعرفها",
    titleEn: "Diabetes Statistics in Canada: Numbers You Need to Know",
    descAr: "السكري في كندا وصل إلى مستويات وبائية. 11 مليون كندي مصاب أو في مرحلة ما قبل السكري. الوعي والفحص المبكر ضروريان.",
    descEn: "Diabetes in Canada has reached epidemic levels. 11 million Canadians have or are on the path to diabetes. Awareness and early screening are essential.",
    symptomsAr: ["كثرة التبول", "العطش المفرط", "إرهاق مزمن", "ضبابية الرؤية", "بطء التئام الجروح", "تنميل الأطراف"],
    symptomsEn: ["Frequent urination", "Excessive thirst", "Chronic fatigue", "Blurred vision", "Slow wound healing", "Numbness in extremities"],
    howHelpAr: ["Feel Great يمنع السكري قبل أن يبدأ", "فحص مبكر + تدخل = وقاية", "منتجات معتمدة في كندا", "Shipping لجميع المقاطعات"],
    howHelpEn: ["Feel Great prevents diabetes before it starts", "Early screening + intervention = prevention", "Products approved in Canada", "Shipping to all provinces"],
    factsAr: ["3.6 مليون كندي مصاب بالسكري", "5.3 مليون إضافية في مرحلة ما قبل السكري", "السكري هو السبب السابع للوفاة في كندا"],
    factsEn: ["3.6 million Canadians have diabetes", "An additional 5.3 million are in prediabetes stage", "Diabetes is the seventh leading cause of death in Canada"],
    relatedCategory: "insulin-resistance",
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

  useEffect(() => {
    document.title = isAr ? 'الحالات الصحية | Feel Great - دليلك للصحة المستدامة' : 'Health Conditions | Feel Great - Your Guide to Sustainable Health';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', isAr ? 'تعرف على كيف يدعم نظام Feel Great صحتك في مواجهة مقاومة الإنسولين، السكري، الكبد الدهني، والسمنة.' : 'Learn how the Feel Great system supports your health against insulin resistance, diabetes, fatty liver, obesity, and more.');
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://feelgreat.us.com/health');
    if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);
    return () => { document.querySelector('link[rel="canonical"]')?.remove(); };
  }, [isAr]);

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

      // Meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', isAr ? condition.descAr : condition.descEn);
      // Canonical
      const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', `https://feelgreat.us.com/health/${condition.slug}`);
      if (!document.querySelector('link[rel="canonical"]')) document.head.appendChild(canonical);

      const el = document.createElement("script");
      el.id = "condition-schema";
      el.type = "application/ld+json";
      el.textContent = JSON.stringify(schema);
      document.head.appendChild(el);

      return () => {
        document.getElementById("condition-schema")?.remove();
        document.querySelector('link[rel="canonical"]')?.remove();
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
