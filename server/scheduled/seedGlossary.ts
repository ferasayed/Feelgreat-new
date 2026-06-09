/**
 * Seed Glossary Terms - Initial health terms for SEO
 * Run once to populate the glossary with essential health terms
 */
import { bulkCreateGlossaryTerms } from "../db";

const INITIAL_TERMS = [
  {
    slug: "insulin-resistance",
    termAr: "مقاومة الإنسولين",
    termEn: "Insulin Resistance",
    definitionAr: "مقاومة الإنسولين هي حالة يفقد فيها الجسم قدرته على الاستجابة بشكل طبيعي لهرمون الإنسولين، مما يؤدي إلى ارتفاع مستويات السكر في الدم. تعتبر من أهم عوامل الخطر للإصابة بمرض السكري من النوع الثاني وأمراض القلب والأوعية الدموية.",
    definitionEn: "Insulin resistance is a condition in which the body's cells become less responsive to the hormone insulin, leading to elevated blood sugar levels. It is a major risk factor for type 2 diabetes, cardiovascular disease, and metabolic syndrome.",
    category: "metabolism",
    relatedTerms: JSON.stringify(["metabolic-syndrome", "blood-sugar", "type-2-diabetes", "intermittent-fasting"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "NIH - Insulin Resistance", url: "https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance" },
      { title: "Harvard Health - Insulin Resistance", url: "https://www.health.harvard.edu/diseases-and-conditions/insulin-resistance" }
    ]),
  },
  {
    slug: "metabolic-syndrome",
    termAr: "متلازمة الأيض",
    termEn: "Metabolic Syndrome",
    definitionAr: "متلازمة الأيض هي مجموعة من الحالات الصحية التي تحدث معاً وتزيد من خطر الإصابة بأمراض القلب والسكتة الدماغية والسكري من النوع الثاني. تشمل ارتفاع ضغط الدم، ارتفاع السكر، زيادة الدهون حول الخصر، ومستويات غير طبيعية من الكوليسترول.",
    definitionEn: "Metabolic syndrome is a cluster of conditions that occur together, increasing the risk of heart disease, stroke, and type 2 diabetes. These conditions include high blood pressure, high blood sugar, excess body fat around the waist, and abnormal cholesterol or triglyceride levels.",
    category: "metabolism",
    relatedTerms: JSON.stringify(["insulin-resistance", "blood-sugar", "visceral-fat"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "Mayo Clinic - Metabolic Syndrome", url: "https://www.mayoclinic.org/diseases-conditions/metabolic-syndrome/symptoms-causes/syc-20351916" },
      { title: "AHA - Metabolic Syndrome", url: "https://www.heart.org/en/health-topics/metabolic-syndrome" }
    ]),
  },
  {
    slug: "intermittent-fasting",
    termAr: "الصيام المتقطع",
    termEn: "Intermittent Fasting",
    definitionAr: "الصيام المتقطع هو نمط غذائي يتناوب بين فترات الأكل وفترات الصيام. لا يحدد ما تأكله بل متى تأكل. أشهر أنماطه 16:8 (صيام 16 ساعة وأكل خلال 8 ساعات) و4-4-12 الذي يعتمده برنامج Feel Great.",
    definitionEn: "Intermittent fasting is an eating pattern that cycles between periods of eating and fasting. It doesn't specify which foods to eat but rather when to eat. Popular methods include 16:8 (fasting 16 hours, eating within 8) and the 4-4-12 approach used in the Feel Great program.",
    category: "intermittent-fasting",
    relatedTerms: JSON.stringify(["autophagy", "insulin-resistance", "blood-sugar"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "NEJM - Intermittent Fasting", url: "https://www.nejm.org/doi/full/10.1056/NEJMra1905136" },
      { title: "Harvard Health - Intermittent Fasting", url: "https://www.health.harvard.edu/blog/intermittent-fasting-surprising-update-2018062914156" }
    ]),
  },
  {
    slug: "autophagy",
    termAr: "الالتهام الذاتي",
    termEn: "Autophagy",
    definitionAr: "الالتهام الذاتي هو عملية بيولوجية طبيعية تقوم فيها الخلايا بتنظيف وإعادة تدوير مكوناتها التالفة أو غير الضرورية. يُحفَّز بشكل رئيسي أثناء الصيام ويلعب دوراً مهماً في مكافحة الشيخوخة والوقاية من الأمراض المزمنة.",
    definitionEn: "Autophagy is a natural biological process where cells clean up and recycle their damaged or unnecessary components. It is primarily triggered during fasting and plays a crucial role in anti-aging and prevention of chronic diseases.",
    category: "metabolism",
    relatedTerms: JSON.stringify(["intermittent-fasting", "cellular-health"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "Nobel Prize - Autophagy", url: "https://www.nobelprize.org/prizes/medicine/2016/press-release/" },
      { title: "Nature - Autophagy Mechanisms", url: "https://www.nature.com/articles/s41580-018-0003-4" }
    ]),
  },
  {
    slug: "gut-microbiome",
    termAr: "ميكروبيوم الأمعاء",
    termEn: "Gut Microbiome",
    definitionAr: "ميكروبيوم الأمعاء هو مجتمع الكائنات الحية الدقيقة (بكتيريا، فيروسات، فطريات) التي تعيش في الجهاز الهضمي. يحتوي على تريليونات من البكتيريا التي تلعب دوراً حيوياً في الهضم، المناعة، إنتاج الفيتامينات، والصحة النفسية.",
    definitionEn: "The gut microbiome is the community of microorganisms (bacteria, viruses, fungi) living in the digestive tract. It contains trillions of bacteria that play vital roles in digestion, immunity, vitamin production, and mental health through the gut-brain axis.",
    category: "gut-health",
    relatedTerms: JSON.stringify(["probiotics", "prebiotics", "gut-brain-axis", "fiber"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "NIH - Human Microbiome Project", url: "https://www.hmpdacc.org/" },
      { title: "Harvard Health - Gut Microbiome", url: "https://www.health.harvard.edu/staying-healthy/can-gut-bacteria-improve-your-health" }
    ]),
  },
  {
    slug: "probiotics",
    termAr: "البروبيوتيك",
    termEn: "Probiotics",
    definitionAr: "البروبيوتيك هي كائنات حية دقيقة (بكتيريا نافعة) عند تناولها بكميات كافية تقدم فوائد صحية للمضيف. تساعد في تحسين توازن البكتيريا في الأمعاء، تعزيز المناعة، وتحسين الهضم.",
    definitionEn: "Probiotics are live microorganisms (beneficial bacteria) that, when consumed in adequate amounts, provide health benefits to the host. They help improve the balance of gut bacteria, boost immunity, and enhance digestion.",
    category: "gut-health",
    relatedTerms: JSON.stringify(["gut-microbiome", "prebiotics", "fiber"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "WHO - Probiotics Definition", url: "https://www.who.int/foodsafety/fs_management/en/probiotic_guidelines.pdf" },
      { title: "Cleveland Clinic - Probiotics", url: "https://my.clevelandclinic.org/health/articles/14598-probiotics" }
    ]),
  },
  {
    slug: "blood-sugar",
    termAr: "سكر الدم",
    termEn: "Blood Sugar (Glucose)",
    definitionAr: "سكر الدم هو مستوى الجلوكوز في مجرى الدم. يُعد المصدر الرئيسي للطاقة في الجسم. المستوى الطبيعي للصائم يتراوح بين 70-100 ملغ/ديسيلتر. ارتفاعه المزمن يؤدي لمقاومة الإنسولين والسكري.",
    definitionEn: "Blood sugar (glucose) is the level of glucose in the bloodstream. It is the body's primary energy source. Normal fasting levels range from 70-100 mg/dL. Chronic elevation leads to insulin resistance and diabetes.",
    category: "metabolism",
    relatedTerms: JSON.stringify(["insulin-resistance", "glycemic-index", "hba1c"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "ADA - Blood Sugar Levels", url: "https://diabetes.org/about-diabetes/diagnosis" },
      { title: "Mayo Clinic - Blood Sugar", url: "https://www.mayoclinic.org/diseases-conditions/diabetes/in-depth/blood-sugar/art-20046628" }
    ]),
  },
  {
    slug: "fiber",
    termAr: "الألياف الغذائية",
    termEn: "Dietary Fiber",
    definitionAr: "الألياف الغذائية هي أجزاء من الأطعمة النباتية لا يستطيع الجسم هضمها أو امتصاصها. تنقسم إلى ألياف قابلة للذوبان (تبطئ الهضم وتنظم السكر) وغير قابلة للذوبان (تحسن حركة الأمعاء). منتج Balance يحتوي على ألياف قابلة للذوبان.",
    definitionEn: "Dietary fiber is the parts of plant foods that the body cannot digest or absorb. It is divided into soluble fiber (slows digestion, regulates blood sugar) and insoluble fiber (improves bowel movement). The Balance product contains soluble fiber.",
    category: "nutrition",
    relatedTerms: JSON.stringify(["gut-microbiome", "blood-sugar", "prebiotics"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "Mayo Clinic - Fiber", url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/fiber/art-20043983" },
      { title: "Harvard - Fiber Benefits", url: "https://www.hsph.harvard.edu/nutritionsource/carbohydrates/fiber/" }
    ]),
  },
  {
    slug: "polyphenols",
    termAr: "البوليفينولات",
    termEn: "Polyphenols",
    definitionAr: "البوليفينولات هي مركبات طبيعية موجودة في النباتات تعمل كمضادات أكسدة قوية. توجد بكثرة في الشاي الأخضر، التوت، الشوكولاتة الداكنة، ونبات المتة (Yerba Mate) المستخدم في منتج Unimate. تحمي الخلايا من التلف وتدعم صحة القلب والدماغ.",
    definitionEn: "Polyphenols are natural compounds found in plants that act as powerful antioxidants. They are abundant in green tea, berries, dark chocolate, and Yerba Mate (used in Unimate). They protect cells from damage and support heart and brain health.",
    category: "nutrition",
    relatedTerms: JSON.stringify(["antioxidants", "yerba-mate", "chlorogenic-acid"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "NCBI - Polyphenols Review", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5465813/" },
      { title: "Harvard - Polyphenols", url: "https://www.hsph.harvard.edu/nutritionsource/food-features/dark-chocolate/" }
    ]),
  },
  {
    slug: "visceral-fat",
    termAr: "الدهون الحشوية",
    termEn: "Visceral Fat",
    definitionAr: "الدهون الحشوية هي الدهون المتراكمة حول الأعضاء الداخلية في منطقة البطن. تختلف عن الدهون تحت الجلد وتُعد أكثر خطورة لأنها تفرز مواد التهابية تزيد من خطر أمراض القلب والسكري ومقاومة الإنسولين.",
    definitionEn: "Visceral fat is fat stored around internal organs in the abdominal area. Unlike subcutaneous fat, it is more dangerous as it releases inflammatory substances that increase the risk of heart disease, diabetes, and insulin resistance.",
    category: "weight-management",
    relatedTerms: JSON.stringify(["metabolic-syndrome", "insulin-resistance", "bmi"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "Harvard Health - Visceral Fat", url: "https://www.health.harvard.edu/staying-healthy/abdominal-fat-and-what-to-do-about-it" },
      { title: "Mayo Clinic - Belly Fat", url: "https://www.mayoclinic.org/healthy-lifestyle/mens-health/in-depth/belly-fat/art-20045685" }
    ]),
  },
  {
    slug: "cortisol",
    termAr: "الكورتيزول",
    termEn: "Cortisol",
    definitionAr: "الكورتيزول هو هرمون التوتر الرئيسي الذي تفرزه الغدة الكظرية. يلعب دوراً في تنظيم الأيض، المناعة، والاستجابة للضغوط. ارتفاعه المزمن يؤدي لزيادة الوزن (خاصة حول البطن)، اضطرابات النوم، وضعف المناعة.",
    definitionEn: "Cortisol is the primary stress hormone produced by the adrenal glands. It plays a role in regulating metabolism, immunity, and stress response. Chronic elevation leads to weight gain (especially around the abdomen), sleep disturbances, and weakened immunity.",
    category: "hormones",
    relatedTerms: JSON.stringify(["stress-management", "visceral-fat", "sleep-quality"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "Cleveland Clinic - Cortisol", url: "https://my.clevelandclinic.org/health/articles/22187-cortisol" },
      { title: "Mayo Clinic - Chronic Stress", url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress/art-20046037" }
    ]),
  },
  {
    slug: "yerba-mate",
    termAr: "المتة (يربا ماتي)",
    termEn: "Yerba Mate",
    definitionAr: "المتة (يربا ماتي) هي نبات من أمريكا الجنوبية يُستخدم كمشروب تقليدي غني بالبوليفينولات ومضادات الأكسدة. يحتوي على الكافيين والثيوبرومين اللذين يعززان التركيز والطاقة الذهنية. يُستخدم مستخلصه المركز في منتج Unimate.",
    definitionEn: "Yerba Mate is a South American plant used as a traditional beverage rich in polyphenols and antioxidants. It contains caffeine and theobromine that enhance focus and mental energy. Its concentrated extract is used in the Unimate product.",
    category: "supplements",
    relatedTerms: JSON.stringify(["polyphenols", "antioxidants", "chlorogenic-acid"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "NCBI - Yerba Mate Health Effects", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4531670/" },
      { title: "Examine - Yerba Mate", url: "https://examine.com/supplements/yerba-mate/" }
    ]),
  },
  {
    slug: "glycemic-index",
    termAr: "المؤشر الجلايسيمي",
    termEn: "Glycemic Index (GI)",
    definitionAr: "المؤشر الجلايسيمي هو مقياس يصنف الأطعمة الكربوهيدراتية حسب سرعة رفعها لمستوى السكر في الدم. الأطعمة ذات المؤشر المنخفض (أقل من 55) ترفع السكر ببطء وتُعد أفضل لمرضى السكري ولإدارة الوزن.",
    definitionEn: "The Glycemic Index (GI) is a scale that ranks carbohydrate foods by how quickly they raise blood sugar levels. Low-GI foods (below 55) raise blood sugar slowly and are better for diabetes management and weight control.",
    category: "nutrition",
    relatedTerms: JSON.stringify(["blood-sugar", "insulin-resistance", "fiber"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "Harvard - Glycemic Index", url: "https://www.health.harvard.edu/diseases-and-conditions/glycemic-index-and-glycemic-load-for-100-foods" },
      { title: "Diabetes Australia - GI", url: "https://www.diabetesaustralia.com.au/food-activity/eating-well/glycaemic-index/" }
    ]),
  },
  {
    slug: "prebiotics",
    termAr: "البريبيوتيك",
    termEn: "Prebiotics",
    definitionAr: "البريبيوتيك هي ألياف غذائية غير قابلة للهضم تعمل كغذاء للبكتيريا النافعة في الأمعاء. تساعد في نمو وتكاثر البكتيريا المفيدة مما يحسن صحة الجهاز الهضمي والمناعة. توجد في الثوم، البصل، الموز، والشوفان.",
    definitionEn: "Prebiotics are non-digestible dietary fibers that serve as food for beneficial gut bacteria. They help promote the growth of good bacteria, improving digestive health and immunity. Found in garlic, onions, bananas, and oats.",
    category: "gut-health",
    relatedTerms: JSON.stringify(["probiotics", "gut-microbiome", "fiber"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "ISAPP - Prebiotics", url: "https://isappscience.org/for-consumers/learn/prebiotics/" },
      { title: "Mayo Clinic - Prebiotics", url: "https://www.mayoclinic.org/prebiotics-probiotics-and-your-health/art-20390058" }
    ]),
  },
  {
    slug: "chlorogenic-acid",
    termAr: "حمض الكلوروجينيك",
    termEn: "Chlorogenic Acid",
    definitionAr: "حمض الكلوروجينيك هو مركب بوليفينولي موجود بكثرة في القهوة الخضراء والمتة. يُعرف بخصائصه المضادة للأكسدة وقدرته على تنظيم مستويات السكر في الدم وتقليل امتصاص الكربوهيدرات. يوجد بتركيز عالٍ في منتج Unimate.",
    definitionEn: "Chlorogenic acid is a polyphenolic compound abundant in green coffee and yerba mate. It is known for its antioxidant properties and ability to regulate blood sugar levels and reduce carbohydrate absorption. Found in high concentration in the Unimate product.",
    category: "supplements",
    relatedTerms: JSON.stringify(["polyphenols", "yerba-mate", "blood-sugar"]),
    relatedArticles: JSON.stringify([]),
    sources: JSON.stringify([
      { title: "NCBI - Chlorogenic Acid", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6213159/" },
      { title: "Examine - Chlorogenic Acid", url: "https://examine.com/supplements/chlorogenic-acid/" }
    ]),
  },
];

export async function seedGlossaryTerms() {
  console.log("[SeedGlossary] Starting glossary seed with", INITIAL_TERMS.length, "terms...");
  
  try {
    await bulkCreateGlossaryTerms(INITIAL_TERMS as any);
    console.log("[SeedGlossary] Successfully seeded", INITIAL_TERMS.length, "glossary terms");
    return { success: true, count: INITIAL_TERMS.length };
  } catch (error: any) {
    // If duplicate key error, terms already exist
    if (error.message?.includes("Duplicate")) {
      console.log("[SeedGlossary] Terms already exist, skipping...");
      return { success: true, count: 0, message: "Already seeded" };
    }
    console.error("[SeedGlossary] Error:", error.message);
    return { success: false, error: error.message };
  }
}
