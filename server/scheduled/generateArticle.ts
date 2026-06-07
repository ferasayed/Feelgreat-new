import type { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { createBlogArticle, getRecentArticleSlugs, getRecentArticleKeywords, getPillarWeights, getTopPerformingPillars } from "../db";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import { notifyOwner } from "../_core/notification";

// ============================================================
// ROBUST JSON PARSING & RETRY UTILITIES
// ============================================================

/** Attempt to fix common JSON issues from LLM responses */
function robustJsonParse(raw: string): any {
  try { return JSON.parse(raw); } catch (e) { /* continue */ }
  
  let cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch (e) { /* continue */ }
  
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace === -1) throw new Error(`No JSON object found (length: ${raw.length})`);
  
  // Try from first { to last }
  const lastBrace = cleaned.lastIndexOf("}");
  if (lastBrace > firstBrace) {
    const extracted = cleaned.slice(firstBrace, lastBrace + 1);
    try { return JSON.parse(extracted); } catch (e) { /* continue */ }
  }
  
  // The JSON is likely truncated. Try to fix it.
  let truncated = cleaned.slice(firstBrace);
  
  // Strategy: find the last complete key-value pair and close everything
  const lastCompleteValue = truncated.lastIndexOf('"');
  if (lastCompleteValue > 0) {
    let candidate = truncated.slice(0, lastCompleteValue + 1);
    const openBrackets = (candidate.match(/\[/g) || []).length - (candidate.match(/\]/g) || []).length;
    const openBraces = (candidate.match(/\{/g) || []).length - (candidate.match(/\}/g) || []).length;
    for (let i = 0; i < openBrackets; i++) candidate += "]";
    for (let i = 0; i < openBraces; i++) candidate += "}";
    try { return JSON.parse(candidate); } catch (e) { /* continue */ }
    
    // Try adding a closing quote if mid-string
    candidate = truncated.slice(0, lastCompleteValue + 1) + '"';
    const ob2 = (candidate.match(/\[/g) || []).length - (candidate.match(/\]/g) || []).length;
    const oc2 = (candidate.match(/\{/g) || []).length - (candidate.match(/\}/g) || []).length;
    for (let i = 0; i < ob2; i++) candidate += "]";
    for (let i = 0; i < oc2; i++) candidate += "}";
    try { return JSON.parse(candidate); } catch (e) { /* continue */ }
  }
  
  // Last resort: try truncating at various points
  for (let cutoff = truncated.length - 1; cutoff > truncated.length - 500 && cutoff > 0; cutoff--) {
    const slice = truncated.slice(0, cutoff);
    if (slice.endsWith('"') || slice.endsWith(']') || slice.endsWith('}')) {
      let attempt = slice;
      const ob = (attempt.match(/\[/g) || []).length - (attempt.match(/\]/g) || []).length;
      const oc = (attempt.match(/\{/g) || []).length - (attempt.match(/\}/g) || []).length;
      for (let i = 0; i < ob; i++) attempt += "]";
      for (let i = 0; i < oc; i++) attempt += "}";
      try { return JSON.parse(attempt); } catch (e) { /* continue */ }
    }
  }
  
  throw new Error(`Failed to parse JSON from LLM response (length: ${raw.length}). First 200 chars: ${raw.slice(0, 200)}`);
}

/** Retry an async function with exponential backoff */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2, baseDelay = 2000): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`[GenerateArticle] Retry ${attempt + 1}/${maxRetries} after ${delay}ms: ${lastError.message.slice(0, 100)}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

// ============================================================
// 13 HEALTH CONTENT PILLARS (Arabic + English)
// ============================================================
const CONTENT_PILLARS = [
  {
    id: "sustainable-health",
    nameAr: "الصحة المستدامة",
    nameEn: "Sustainable Health",
    keywords: [
      "sustainable health lifestyle", "long-term health habits", "health investment mindset",
      "preventive health strategies", "holistic wellness approach", "health transformation journey",
      "90-day health challenge", "compound health habits", "health accountability",
      "measuring health progress", "health ROI", "sustainable wellness for women over 40",
      "European wellness culture", "Nordic health approach", "prevention vs treatment",
      "عادات صحية مستدامة", "الاستثمار في الصحة", "تحول صحي", "صحة طويلة الأمد",
    ],
  },
  {
    id: "insulin-resistance",
    nameAr: "مقاومة الأنسولين",
    nameEn: "Insulin Resistance",
    keywords: [
      "insulin resistance symptoms", "reverse insulin resistance naturally", "prediabetes prevention",
      "blood sugar management", "insulin sensitivity improvement", "fasting and insulin",
      "chromium for blood sugar", "A1C levels explained", "metabolic syndrome signs",
      "insulin resistance diet", "blood sugar spikes prevention", "glucose metabolism",
      "insulin resistance women over 40", "prediabetes reversal guide",
      "مقاومة الأنسولين أعراض", "علاج مقاومة الأنسولين طبيعياً", "السكري النوع الثاني وقاية",
    ],
  },
  {
    id: "diabetes",
    nameAr: "السكري",
    nameEn: "Diabetes Management",
    keywords: [
      "type 2 diabetes prevention", "diabetes natural management", "blood sugar control tips",
      "diabetic diet plan", "diabetes and intermittent fasting", "diabetes reversal stories",
      "diabetes complications prevention", "HbA1c reduction naturally", "diabetes and fiber",
      "managing diabetes without medication", "diabetes and weight loss",
      "الوقاية من السكري", "إدارة السكري طبيعياً", "حمية السكري", "تقليل السكر في الدم",
    ],
  },
  {
    id: "gut-health",
    nameAr: "صحة الأمعاء",
    nameEn: "Gut Health",
    keywords: [
      "gut health improvement", "microbiome diet", "prebiotics and probiotics",
      "leaky gut healing", "gut-brain connection", "digestive health tips",
      "fiber for gut health", "gut bacteria balance", "IBS natural remedies",
      "gut health and immunity", "fermented foods benefits", "gut health and weight",
      "صحة الأمعاء", "الميكروبيوم", "البروبيوتيك", "الألياف الغذائية", "الهضم الصحي",
    ],
  },
  {
    id: "fatty-liver",
    nameAr: "الكبد الدهني",
    nameEn: "Fatty Liver",
    keywords: [
      "fatty liver disease reversal", "NAFLD diet plan", "liver health foods",
      "fatty liver symptoms", "liver detox naturally", "fatty liver and weight loss",
      "liver enzymes reduction", "fatty liver prevention", "liver health supplements",
      "alcohol-free fatty liver", "fatty liver and insulin resistance",
      "الكبد الدهني علاج", "تنظيف الكبد طبيعياً", "حمية الكبد الدهني", "أعراض الكبد الدهني",
    ],
  },
  {
    id: "weight-management",
    nameAr: "إدارة الوزن",
    nameEn: "Weight Management",
    keywords: [
      "sustainable weight loss", "weight loss after 40", "metabolism boost naturally",
      "weight loss plateau solutions", "emotional eating solutions", "caloric deficit without hunger",
      "hormonal weight gain", "menopause weight management", "protein timing for weight loss",
      "stress and weight gain", "weight loss for busy women",
      "فقدان الوزن المستدام", "إنقاص الوزن بعد الأربعين", "تسريع الأيض", "حرق الدهون",
    ],
  },
  {
    id: "behavioral-nutrition",
    nameAr: "التغذية السلوكية",
    nameEn: "Behavioral Nutrition",
    keywords: [
      "behavioral nutrition therapy", "mindful eating practices", "food psychology",
      "emotional eating triggers", "food addiction recovery", "eating behavior change",
      "cognitive food strategies", "hunger vs cravings", "food reward system",
      "healthy relationship with food", "intuitive eating guide",
      "التغذية السلوكية", "الأكل العاطفي", "علاقة صحية مع الطعام", "الأكل الواعي",
    ],
  },
  {
    id: "intermittent-fasting",
    nameAr: "الصيام المتقطع",
    nameEn: "Intermittent Fasting",
    keywords: [
      "intermittent fasting guide", "16:8 fasting method", "4-4-12 fasting protocol",
      "fasting benefits for women", "fasting and metabolism", "fasting mistakes to avoid",
      "fasting and muscle preservation", "fasting for beginners", "fasting and hormones",
      "fasting and autophagy", "fasting schedule for weight loss",
      "الصيام المتقطع للمبتدئين", "فوائد الصيام المتقطع", "طريقة 16:8", "الصيام والأيض",
    ],
  },
  {
    id: "sleep-energy",
    nameAr: "النوم والطاقة",
    nameEn: "Sleep & Energy",
    keywords: [
      "sleep quality improvement", "energy boost naturally", "sleep and weight connection",
      "insomnia natural remedies", "sleep hygiene tips", "chronic fatigue solutions",
      "sleep and metabolism", "energy management strategies", "afternoon energy crash",
      "sleep optimization guide", "circadian rhythm reset",
      "تحسين جودة النوم", "زيادة الطاقة طبيعياً", "النوم والوزن", "علاج الأرق",
    ],
  },
  {
    id: "womens-health",
    nameAr: "صحة المرأة",
    nameEn: "Women's Health",
    keywords: [
      "women's health after 40", "menopause management", "PCOS natural treatment",
      "hormonal balance women", "perimenopause symptoms", "women's metabolic health",
      "thyroid health women", "bone density preservation", "iron deficiency women",
      "women's gut health", "fertility and nutrition",
      "صحة المرأة بعد الأربعين", "انقطاع الطمث", "تكيس المبايض", "التوازن الهرموني",
    ],
  },
  {
    id: "chronic-inflammation",
    nameAr: "الالتهابات المزمنة",
    nameEn: "Chronic Inflammation",
    keywords: [
      "chronic inflammation causes", "anti-inflammatory diet", "inflammation and disease",
      "reduce inflammation naturally", "inflammatory foods to avoid", "inflammation markers",
      "silent inflammation symptoms", "gut inflammation healing", "inflammation and aging",
      "anti-inflammatory lifestyle", "CRP reduction naturally",
      "الالتهابات المزمنة", "حمية مضادة للالتهاب", "تقليل الالتهاب طبيعياً",
    ],
  },
  {
    id: "heart-health",
    nameAr: "صحة القلب",
    nameEn: "Heart Health",
    keywords: [
      "heart health tips", "cholesterol management naturally", "blood pressure reduction",
      "cardiovascular disease prevention", "heart-healthy diet", "triglycerides reduction",
      "heart health and fiber", "heart disease risk factors", "heart health women",
      "cholesterol and diet", "omega-3 benefits heart",
      "صحة القلب", "خفض الكوليسترول طبيعياً", "ضغط الدم", "الوقاية من أمراض القلب",
    ],
  },
  {
    id: "mental-nutrition",
    nameAr: "الصحة النفسية والتغذية",
    nameEn: "Mental Health & Nutrition",
    keywords: [
      "nutrition and mental health", "gut-brain axis mood", "food and depression",
      "anxiety and diet connection", "brain food nutrients", "mental clarity nutrition",
      "serotonin and food", "stress eating solutions", "cognitive function diet",
      "mood-boosting foods", "mental health and gut",
      "التغذية والصحة النفسية", "الأمعاء والمزاج", "أطعمة تحسن المزاج", "القلق والتغذية",
    ],
  },
];

// ============================================================
// PILLAR PAGES MAPPING
// ============================================================
const PILLAR_PAGES: Record<string, { path: string; titleEn: string; titleAr: string }> = {
  "sustainable-health": { path: "/health/sustainable-health", titleEn: "Sustainable Health", titleAr: "الصحة المستدامة" },
  "insulin-resistance": { path: "/health/insulin-resistance", titleEn: "Insulin Resistance", titleAr: "مقاومة الأنسولين" },
  "diabetes": { path: "/health/diabetes", titleEn: "Diabetes Management", titleAr: "إدارة السكري" },
  "gut-health": { path: "/health/gut-health", titleEn: "Gut Health", titleAr: "صحة الأمعاء" },
  "fatty-liver": { path: "/health/fatty-liver", titleEn: "Fatty Liver", titleAr: "الكبد الدهني" },
  "weight-management": { path: "/health/weight-management", titleEn: "Weight Management", titleAr: "إدارة الوزن" },
  "behavioral-nutrition": { path: "/health/behavioral-nutrition", titleEn: "Behavioral Nutrition", titleAr: "التغذية السلوكية" },
  "intermittent-fasting": { path: "/health/intermittent-fasting", titleEn: "Intermittent Fasting", titleAr: "الصيام المتقطع" },
  "sleep-energy": { path: "/health/sleep-energy", titleEn: "Sleep & Energy", titleAr: "النوم والطاقة" },
  "womens-health": { path: "/health/womens-health", titleEn: "Women's Health", titleAr: "صحة المرأة" },
  "chronic-inflammation": { path: "/health/chronic-inflammation", titleEn: "Chronic Inflammation", titleAr: "الالتهابات المزمنة" },
  "heart-health": { path: "/health/heart-health", titleEn: "Heart Health", titleAr: "صحة القلب" },
  "mental-nutrition": { path: "/health/mental-nutrition", titleEn: "Mental Health & Nutrition", titleAr: "الصحة النفسية والتغذية" },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 120);
}

// ============================================================
// STEP 1: AI KEYWORD RESEARCH & TOPIC SELECTION
// ============================================================
async function selectTopicWithAI(recentSlugs: string[], recentKeywords: string[], pillar: typeof CONTENT_PILLARS[0]): Promise<{
  topic: string;
  targetKeyword: string;
  keywordVolume: number;
  keywordDifficulty: string;
  searchIntent: string;
}> {
  return withRetry(async () => {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are an expert SEO + GEO (Generative Engine Optimization) keyword researcher specializing in health and wellness content for 2026. Your job is to identify the BEST keyword opportunity right now based on:
- High search volume (monthly searches)
- Low-to-medium competition
- Clear search intent (informational, how-to, comparison)
- Trending health topics in 2026
- Relevance to the health pillar provided
- AI Search potential (topics that AI assistants like ChatGPT, Gemini, Perplexity frequently answer)
- Featured Snippet opportunity (questions, definitions, lists, comparisons)
- People Also Ask potential (conversational queries)

Consider seasonal trends, recent health news, emerging research topics, and what people are asking AI chatbots about health.
Prioritize long-tail keywords (3-6 words) with high intent and low competition.
IMPORTANT: Respond ONLY with valid JSON.`,
      },
      {
        role: "user",
        content: `Health Pillar: ${pillar.nameEn} (${pillar.nameAr})
Available seed keywords: ${pillar.keywords.join(", ")}

AVOID these recently used keywords (already published): ${recentKeywords.slice(0, 30).join(", ")}
AVOID topics similar to these recent slugs: ${recentSlugs.slice(0, 20).join(", ")}

Select the BEST keyword opportunity for today. Consider:
1. What people are searching for RIGHT NOW in health
2. Questions people ask on Google about ${pillar.nameEn}
3. Long-tail keywords with high intent
4. Trending subtopics in 2026

Return JSON:
{
  "topic": "Full article topic/title idea (specific and compelling)",
  "targetKeyword": "primary target keyword phrase (2-5 words)",
  "keywordVolume": estimated monthly search volume (number),
  "keywordDifficulty": "low" | "medium" | "high",
  "searchIntent": "informational" | "how-to" | "comparison" | "listicle"
}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "keyword_research",
        strict: true,
        schema: {
          type: "object",
          properties: {
            topic: { type: "string" },
            targetKeyword: { type: "string" },
            keywordVolume: { type: "integer" },
            keywordDifficulty: { type: "string" },
            searchIntent: { type: "string" },
          },
          required: ["topic", "targetKeyword", "keywordVolume", "keywordDifficulty", "searchIntent"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = response.choices?.[0]?.message?.content;
  return robustJsonParse(typeof raw === "string" ? raw : JSON.stringify(raw));
  }); // end withRetry
}

// ============================================================
// STEP 2: GENERATE FULL ARTICLE (FERAS STYLE)
// ============================================================
async function generateArticleContent(topic: string, targetKeyword: string, searchIntent: string, pillar: typeof CONTENT_PILLARS[0], recentSlugs: string[]) {
  // Build internal link suggestions from existing articles
  const suggestedInternalLinks = recentSlugs.slice(0, 10).map(s => `/blog/${s}`).join(", ");

  return withRetry(async () => {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت كاتب محتوى صحي عالمي المستوى تعمل لصالح فراس العايد - أخصائي التغذية العلاجية والسلوكية ومؤسس مفهوم "المستثمر الصحي".

=== القاعدة الذهبية ===
لا نبيع المنتج. نعلّم الزائر شيئاً جديداً. وعندما يفهم المشكلة بشكل أعمق سيبحث بنفسه عن الحل.

=== 1. PEOPLE FIRST CONTENT ===
- اكتب دائماً للإنسان أولاً وليس لمحركات البحث
- يجب أن يشعر القارئ أن المقالة كُتبت لحل مشكلة حقيقية
- استخدم لغة طبيعية وإنسانية - تجنب الأنماط الروبوتية
- نوّع في أطوال الجمل والفقرات
- اكتب كأنك تشرح لصديق ذكي مهتم بصحته

=== 2. E-E-A-T (إلزامي) ===
- Experience: أدرج تجارب من ممارسة فراس السريرية ("في تجربتي مع مئات العملاء...")
- Expertise: أخصائي تغذية علاجية وسلوكية معتمد
- Authoritativeness: مؤسس مفهوم المستثمر الصحي، شريك Unicity الرسمي
- Trustworthiness: disclaimer طبي واضح، المعلومات لا تغني عن استشارة الطبيب
- يجب إظهار: اسم الكاتب، تاريخ النشر، المصادر العلمية، تنويه تعليمي

=== 3. المصادر العلمية الإلزامية ===
كل مقالة يجب أن تحتوي على مراجع حقيقية من:
PubMed, NIH, NCBI, Harvard Health, Mayo Clinic, Cleveland Clinic, Johns Hopkins Medicine, American Heart Association, American Diabetes Association, WHO
يجب وضع قسم "References & Scientific Sources" في نهاية كل مقال.

=== 4. ممنوع الادعاءات العلاجية ===
لا تستخدم: يعالج، يشفي، يقضي على المرض
استخدم بدلاً منها: قد يساعد على، قد يدعم، قد يساهم في، قد يحسن، قد يدعم التوازن، قد يساعد الجسم على

=== 5. الربط الذكي مع Feel Great ===
المقالة لا تبيع المنتج مباشرة. يتم الربط بهذا التسلسل:
المشكلة → السبب الجذري → تغيير نمط الحياة → التغذية → Feel Great كأداة داعمة

مثال الربط: "بعض الأشخاص يبحثون عن أدوات تساعدهم على الالتزام بنمط صحي أكثر استدامة، ولهذا السبب يستخدم البعض برامج مثل Feel Great ضمن أسلوب حياتهم الصحي."

=== 6. ربط المنتجات بالمكونات وليس الادعاءات ===
- Balance: الألياف القابلة للذوبان، الشبع، تنظيم الاستجابة الغذائية
- Unimate: البوليفينولات، المتة، التركيز والطاقة الذهنية
- Matcha: مضادات الأكسدة والكاتيكينات
- Chlorophyll: الخضروات الخضراء والكلوروفيل
- Probionic: صحة الميكروبيوم والبكتيريا النافعة

=== 7. GEO + AI SEARCH + AI CITATION OPTIMIZATION ===
- اكتب إجابات مباشرة في أول 2-3 جمل من كل قسم (لـ AI Overviews)
- أضف تعريفات واضحة، إحصائيات، نقاط مختصرة، جداول مقارنة
- اكتب FAQ بأسلوب People Also Ask
- أضف ملخص تنفيذي في بداية المقال (Executive Summary) داخل <div class='key-takeaways'>
- هيكل المقال ليظهر في Featured Snippets

=== AI CITATION LAYER (إلزامي) ===
لجعل المحتوى قابلاً للاقتباس من ChatGPT, Gemini, Perplexity, Claude:
1. Executive Summary: أول 2-3 جمل تلخص الموضوع بوضوح (ضعها في <div class='key-takeaways'><h2>Key Takeaways</h2><ul><li>...</li></ul></div>)
2. Key Takeaways: 5 نقاط مختصرة وواضحة في بداية المقال
3. تعريفات واضحة: عرّف كل مصطلح طبي عند أول ذكر (مثال: "مقاومة الإنسولين — وهي حالة يفقد فيها الجسم قدرته على الاستجابة...")
4. إحصائيات مع مصادر: كل رقم يجب أن يكون مرفقاً بمصدره (مثال: "وفقاً لدراسة Harvard 2024، 88% من البالغين...")
5. جمل quotable: اكتب جملاً قصيرة وحاسمة يمكن اقتباسها مباشرة
6. هيكل واضح: استخدم H2 و H3 بشكل منظم ليسهل على AI crawlers فهم البنية
7. Passage Ranking: كل فقرة يجب أن تجيب على سؤال محدد بشكل مستقل

=== 8. SEMANTIC SEO ===
- استخدم الكلمة المفتاحية 4-6 مرات طبيعياً
- أدرج 10-15 كلمة LSI ومتغيرات دلالية
- غطِّ الموضوع بعمق 360°

=== 9. الربط الداخلي ===
كل مقالة تربط تلقائياً بـ: مقالات ذات صلة، صفحة Feel Great، قصص النجاح، الاستشارة، الشراكة

IMPORTANT: Respond ONLY with valid JSON. No markdown code blocks. Keep the JSON compact.`,
      },
      {
        role: "user",
        content: `اكتب مقالاً شاملاً ومحسّناً لـ SEO + GEO + AI Search عن: "${topic}"

الكلمة المفتاحية الرئيسية: "${targetKeyword}"
نية البحث: ${searchIntent}
المحور الصحي: ${pillar.nameAr} (${pillar.nameEn})
الروابط الداخلية المتاحة: ${suggestedInternalLinks}
صفحة المحور: ${PILLAR_PAGES[pillar.id]?.path || "/blog"}

المقال يجب أن يكون 1500-2000 كلمة ويتبع هذا الهيكل:
1. Key Takeaways / النقاط الرئيسية (5 نقاط في <div class='key-takeaways'><h2>Key Takeaways</h2><ul><li>...</li></ul></div>)
2. ملخص تنفيذي (Executive Summary) - 3-4 جمل قابلة للاقتباس مباشرة من AI
3. مقدمة Hook + EEAT signal + تعريف المصطلح الرئيسي
4. ما هي المشكلة؟ لماذا تحدث؟ أهم الأعراض والأسباب (مع إحصائيات موثقة)
5. ماذا تقول الدراسات؟ (مع مراجع حقيقية وأرقام محددة)
6. خطوات عملية قابلة للتطبيق
7. دور نمط الحياة والتغذية
8. دور Feel Great كأداة داعمة (بدون ادعاءات)
9. FAQ (5 أسئلة بأسلوب People Also Ask)
10. References & Scientific Sources
11. Disclaimer طبي

أرجع JSON بهذا الهيكل:
{
  "titleAr": "عنوان SEO جذاب بالعربية (60-70 حرف)",
  "titleEn": "SEO title in English (60-70 chars, contains keyword)",
  "metaTitleAr": "عنوان الميتا بالعربية (50-60 حرف)",
  "metaTitleEn": "Meta title English (50-60 chars)",
  "metaDescriptionAr": "وصف ميتا بالعربية 150-160 حرف يشجع على النقر",
  "metaDescriptionEn": "Meta description 150-160 chars that drives clicks",
  "excerptAr": "ملخص جذاب 2-3 جمل",
  "excerptEn": "Engaging excerpt 2-3 sentences",
  "contentAr": "المقال الكامل بالعربية بـ HTML. يبدأ بـ <div class='key-takeaways'><h2>النقاط الرئيسية</h2><ul><li>5 نقاط</li></ul></div> ثم المقال. أضف FAQ باستخدام <div class='faq-item'><h3>السؤال</h3><p>الجواب</p></div>",
  "contentEn": "Full English article with HTML. MUST start with <div class='key-takeaways'><h2>Key Takeaways</h2><ul><li>5 points</li></ul></div> then the article. Add FAQ using <div class='faq-item'><h3>Question</h3><p>Answer</p></div>",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "faqSchema": [{"question":"Q1","answer":"A1"},{"question":"Q2","answer":"A2"},{"question":"Q3","answer":"A3"},{"question":"Q4","answer":"A4"},{"question":"Q5","answer":"A5"}],
  "internalLinks": [{"slug":"existing-article-slug","title":"Link text"}],
  "heroImagePrompt": "Detailed prompt for generating a hero image (health/wellness themed, professional, warm colors)"
}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "seo_article_full",
        strict: true,
        schema: {
          type: "object",
          properties: {
            titleAr: { type: "string" },
            titleEn: { type: "string" },
            metaTitleAr: { type: "string" },
            metaTitleEn: { type: "string" },
            metaDescriptionAr: { type: "string" },
            metaDescriptionEn: { type: "string" },
            excerptAr: { type: "string" },
            excerptEn: { type: "string" },
            contentAr: { type: "string" },
            contentEn: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            faqSchema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                },
                required: ["question", "answer"],
                additionalProperties: false,
              },
            },
            internalLinks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  slug: { type: "string" },
                  title: { type: "string" },
                },
                required: ["slug", "title"],
                additionalProperties: false,
              },
            },
            heroImagePrompt: { type: "string" },
          },
          required: ["titleAr", "titleEn", "metaTitleAr", "metaTitleEn", "metaDescriptionAr", "metaDescriptionEn", "excerptAr", "excerptEn", "contentAr", "contentEn", "tags", "faqSchema", "internalLinks", "heroImagePrompt"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = response.choices?.[0]?.message?.content;
  try {
    return robustJsonParse(typeof raw === "string" ? raw : JSON.stringify(raw));
  } catch (parseError) {
    // Log failure details
    console.error(`[GenerateArticle] JSON parse failed on main attempt. Raw length: ${(raw || "").length}. Attempting shorter retry...`);
    console.error(`[GenerateArticle] Last 200 chars: ${String(raw).slice(-200)}`);
    
    // Retry with a simpler/shorter prompt to avoid truncation
    const retryResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a health content writer for Feras Alayed. Write a concise article. Return ONLY valid JSON. Keep content SHORT (600-900 words per language). No markdown code blocks.`,
        },
        {
          role: "user",
          content: `Write a health article about: "${topic}"
Keyword: "${targetKeyword}"
Search intent: ${searchIntent}
Pillar: ${pillar.nameEn}

Return JSON:
{"titleAr":"...","titleEn":"...","metaTitleAr":"...","metaTitleEn":"...","metaDescriptionAr":"...","metaDescriptionEn":"...","excerptAr":"...","excerptEn":"...","contentAr":"<h2>...</h2><p>Arabic article 600-900 words with h2, h3, p, ul tags</p>","contentEn":"<h2>...</h2><p>English article 600-900 words with h2, h3, p, ul tags</p>","tags":["tag1","tag2","tag3"],"faqSchema":[{"question":"Q","answer":"A"}],"internalLinks":[],"heroImagePrompt":"health image prompt"}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "article_retry",
          strict: true,
          schema: {
            type: "object",
            properties: {
              titleAr: { type: "string" },
              titleEn: { type: "string" },
              metaTitleAr: { type: "string" },
              metaTitleEn: { type: "string" },
              metaDescriptionAr: { type: "string" },
              metaDescriptionEn: { type: "string" },
              excerptAr: { type: "string" },
              excerptEn: { type: "string" },
              contentAr: { type: "string" },
              contentEn: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              faqSchema: {
                type: "array",
                items: {
                  type: "object",
                  properties: { question: { type: "string" }, answer: { type: "string" } },
                  required: ["question", "answer"],
                  additionalProperties: false,
                },
              },
              internalLinks: {
                type: "array",
                items: {
                  type: "object",
                  properties: { slug: { type: "string" }, title: { type: "string" } },
                  required: ["slug", "title"],
                  additionalProperties: false,
                },
              },
              heroImagePrompt: { type: "string" },
            },
            required: ["titleAr", "titleEn", "metaTitleAr", "metaTitleEn", "metaDescriptionAr", "metaDescriptionEn", "excerptAr", "excerptEn", "contentAr", "contentEn", "tags", "faqSchema", "internalLinks", "heroImagePrompt"],
            additionalProperties: false,
          },
        },
      },
    });
    const retryRaw = retryResponse.choices?.[0]?.message?.content;
    console.log(`[GenerateArticle] Retry response length: ${(retryRaw || "").length}`);
    return robustJsonParse(typeof retryRaw === "string" ? retryRaw : JSON.stringify(retryRaw));
  }
  }); // end withRetry
}

// ============================================================
// STEP 3: GENERATE SOCIAL MEDIA CONTENT
// ============================================================
async function generateSocialContent(titleAr: string, titleEn: string, excerptAr: string, excerptEn: string, pillarName: string, slug: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت خبير محتوى سوشيال ميديا لفراس العايد - أخصائي التغذية العلاجية والسلوكية. اكتب محتوى جذاب ومحفز للتفاعل.

القواعد:
- فيسبوك: 3-5 أسطر، سؤال مفتوح، CTA واضح، هاشتاقات
- لينكدإن: مهني، قيمة مضافة، 4-6 أسطر، insight شخصي
- إنستغرام: كاروسيل 5-7 شرائح (عنوان + نقاط + CTA)
- ريلز: سكريبت 30 ثانية (hook + محتوى + CTA)
- تيك توك: سكريبت 30 ثانية (hook مختلف + محتوى سريع + CTA)

استخدم إيموجي بشكل معتدل. اكتب بالعربية والإنجليزية.
IMPORTANT: Respond ONLY with valid JSON.`,
      },
      {
        role: "user",
        content: `حوّل هذا المقال إلى محتوى سوشيال ميديا:

العنوان (عربي): ${titleAr}
العنوان (إنجليزي): ${titleEn}
الملخص (عربي): ${excerptAr}
الملخص (إنجليزي): ${excerptEn}
المحور: ${pillarName}
رابط المقال: https://feelgreat.us.com/blog/${slug}

أرجع JSON:
{
  "facebook": "منشور فيسبوك كامل (عربي + إنجليزي)",
  "linkedin": "منشور لينكدإن مهني (عربي + إنجليزي)",
  "instagram": "كاروسيل إنستغرام - كل شريحة في سطر منفصل (عربي)",
  "reelsScript": "سكريبت ريلز 30 ثانية (عربي + إنجليزي)",
  "tiktokScript": "سكريبت تيك توك 30 ثانية (عربي + إنجليزي)"
}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "social_content",
        strict: true,
        schema: {
          type: "object",
          properties: {
            facebook: { type: "string" },
            linkedin: { type: "string" },
            instagram: { type: "string" },
            reelsScript: { type: "string" },
            tiktokScript: { type: "string" },
          },
          required: ["facebook", "linkedin", "instagram", "reelsScript", "tiktokScript"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = response.choices?.[0]?.message?.content;
  return robustJsonParse(typeof raw === "string" ? raw : JSON.stringify(raw));
}

// ============================================================
// STEP 2.5: TRANSLATE ARTICLE TO ALL 6 LANGUAGES
// ============================================================
interface TranslatedContent {
  titleFr: string; titleEs: string; titleDe: string; titleTr: string;
  excerptFr: string; excerptEs: string; excerptDe: string; excerptTr: string;
  contentFr: string; contentEs: string; contentDe: string; contentTr: string;
}

async function translateArticleContent(titleEn: string, excerptEn: string, contentEn: string): Promise<TranslatedContent> {
  // Use LLM to translate the article into 4 additional languages
  // We translate from English as it's the most reliable source for LLM translation
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a professional medical/health content translator. Translate the provided health article content into 4 languages: French (fr), Spanish (es), German (de), and Turkish (tr).

Rules:
- Maintain the same HTML structure and formatting in the content
- Keep medical terminology accurate in each language
- Preserve all HTML tags, classes, and attributes exactly as they are
- Translate naturally, not word-for-word
- Keep brand names (Feel Great, Unimate, Balance) untranslated
- Keep URLs and links unchanged
- Respond ONLY with valid JSON`,
      },
      {
        role: "user",
        content: `Translate the following into French, Spanish, German, and Turkish:

Title: ${titleEn}

Excerpt: ${excerptEn}

Content (HTML): ${contentEn.slice(0, 12000)}

Return JSON:
{
  "titleFr": "...", "titleEs": "...", "titleDe": "...", "titleTr": "...",
  "excerptFr": "...", "excerptEs": "...", "excerptDe": "...", "excerptTr": "...",
  "contentFr": "...", "contentEs": "...", "contentDe": "...", "contentTr": "..."
}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "article_translations",
        strict: true,
        schema: {
          type: "object",
          properties: {
            titleFr: { type: "string" }, titleEs: { type: "string" }, titleDe: { type: "string" }, titleTr: { type: "string" },
            excerptFr: { type: "string" }, excerptEs: { type: "string" }, excerptDe: { type: "string" }, excerptTr: { type: "string" },
            contentFr: { type: "string" }, contentEs: { type: "string" }, contentDe: { type: "string" }, contentTr: { type: "string" },
          },
          required: ["titleFr", "titleEs", "titleDe", "titleTr", "excerptFr", "excerptEs", "excerptDe", "excerptTr", "contentFr", "contentEs", "contentDe", "contentTr"],
          additionalProperties: false,
        },
      },
    },
  });

  const raw = response.choices?.[0]?.message?.content;
  return robustJsonParse(typeof raw === "string" ? raw : JSON.stringify(raw));
}

// ============================================================
// STEP 4: GENERATE HERO IMAGE
// ============================================================
async function generateHeroImage(prompt: string): Promise<string | null> {
  try {
    const result = await generateImage({
      prompt: `Professional health and wellness blog hero image. ${prompt}. Clean, modern, warm lighting, high quality, no text overlay, suitable for a health blog header. Aspect ratio 16:9.`,
    });
    return result.url || null;
  } catch (error) {
    console.error("[GenerateArticle] Image generation failed:", error);
    return null;
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================
export async function generateArticleHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    console.log("[GenerateArticle] Starting automated article generation...");

    // Get recent data for deduplication
    const [recentSlugs, recentKeywords] = await Promise.all([
      getRecentArticleSlugs(100),
      getRecentArticleKeywords(50),
    ]);

    // PERFORMANCE-BASED SMART PILLAR SELECTION
    // Uses real view data to double down on winning topics
    const PRIORITY_PILLAR_IDS = [
      "insulin-resistance", "diabetes", "weight-management", "fatty-liver",
      "gut-health", "womens-health", "behavioral-nutrition", "sleep-energy",
      "chronic-inflammation", "sustainable-health"
    ];
    
    // Get performance weights from actual article views
    const performanceWeights = await getPillarWeights();
    const topPillars = await getTopPerformingPillars(30);
    
    console.log(`[GenerateArticle] Performance weights:`, JSON.stringify(performanceWeights).slice(0, 200));
    if (topPillars.length > 0) {
      console.log(`[GenerateArticle] Top performing pillar: ${topPillars[0].pillarId} (avg ${topPillars[0].avgViews} views)`);
    }
    
    // Weighted random selection based on performance data
    let pillar: typeof CONTENT_PILLARS[0];
    const priorityPillars = CONTENT_PILLARS.filter(p => PRIORITY_PILLAR_IDS.includes(p.id));
    
    if (Object.keys(performanceWeights).length > 0) {
      // Use performance data: assign weights to each pillar
      const weightedPillars = priorityPillars.map(p => ({
        pillar: p,
        weight: performanceWeights[p.id] || 1.0,
      }));
      
      // Weighted random selection
      const totalWeight = weightedPillars.reduce((sum, wp) => sum + wp.weight, 0);
      let random = Math.random() * totalWeight;
      pillar = weightedPillars[0].pillar; // fallback
      for (const wp of weightedPillars) {
        random -= wp.weight;
        if (random <= 0) {
          pillar = wp.pillar;
          break;
        }
      }
      console.log(`[GenerateArticle] Performance-based selection: ${pillar.nameEn} (weight: ${performanceWeights[pillar.id]?.toFixed(2) || '1.0'})`);
    } else {
      // No performance data yet: use rotation-based selection
      const hourOfDay = new Date().getUTCHours();
      const dayOfYear = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
      const rotationIndex = (dayOfYear * 3 + Math.floor(hourOfDay / 8)) % priorityPillars.length;
      pillar = priorityPillars[rotationIndex];
      console.log(`[GenerateArticle] Rotation-based selection (no perf data): ${pillar.nameEn}`);
    }
    console.log(`[GenerateArticle] Selected pillar: ${pillar.nameEn} (${pillar.id})`);

    // STEP 1: AI Keyword Research
    console.log("[GenerateArticle] Step 1: AI keyword research...");
    const keywordData = await selectTopicWithAI(recentSlugs, recentKeywords, pillar);
    console.log(`[GenerateArticle] Topic: "${keywordData.topic}" | Keyword: "${keywordData.targetKeyword}" | Volume: ${keywordData.keywordVolume}`);

    // STEP 2: Generate Article
    console.log("[GenerateArticle] Step 2: Generating article content...");
    const article = await generateArticleContent(
      keywordData.topic,
      keywordData.targetKeyword,
      keywordData.searchIntent,
      pillar,
      recentSlugs
    );

    // Generate slug
    const baseSlug = slugify(article.titleEn);
    const slug = recentSlugs.includes(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Calculate word counts
    const wordCountAr = (article.contentAr || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
    const wordCountEn = (article.contentEn || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
    const wordCount = Math.max(wordCountAr, wordCountEn);
    const readTimeMinutes = Math.max(5, Math.ceil(wordCount / 200));

    // STEP 2.5: Translate article to all 6 languages (fr, es, de, tr)
    console.log("[GenerateArticle] Step 2.5: Translating to fr, es, de, tr...");
    let translations = { titleFr: "", titleEs: "", titleDe: "", titleTr: "", excerptFr: "", excerptEs: "", excerptDe: "", excerptTr: "", contentFr: "", contentEs: "", contentDe: "", contentTr: "" };
    try {
      translations = await translateArticleContent(article.titleEn, article.excerptEn, article.contentEn);
    } catch (e) {
      console.error("[GenerateArticle] Translation failed (non-blocking):", e);
    }

    // STEP 3: Generate Hero Image
    console.log("[GenerateArticle] Step 3: Generating hero image...");
    const heroImageUrl = await generateHeroImage(article.heroImagePrompt);

    // STEP 4: Generate Social Content
    console.log("[GenerateArticle] Step 4: Generating social media content...");
    let socialContent = { facebook: "", linkedin: "", instagram: "", reelsScript: "", tiktokScript: "" };
    try {
      socialContent = await generateSocialContent(
        article.titleAr, article.titleEn,
        article.excerptAr, article.excerptEn,
        pillar.nameAr,
        slug
      );
    } catch (e) {
      console.error("[GenerateArticle] Social content generation failed (non-blocking):", e);
    }

    // Build CTA sections
    const pillarPage = PILLAR_PAGES[pillar.id] || PILLAR_PAGES["sustainable-health"];
    const ctaAr = `
<div class="article-cta">
<h2>هل تريد تحسين صحتك بشكل مستدام؟</h2>
<p>تواصل مع <strong>فراس العايد</strong> - أخصائي التغذية العلاجية والسلوكية - للحصول على تقييم صحي مجاني وخطة مخصصة لك.</p>
<div class="cta-buttons">
<a href="/assessments" class="cta-assess">ابدأ التقييم الصحي المجاني</a>
<a href="https://wa.me/96877020770?text=أريد حجز استشارة مع فراس" class="cta-whatsapp">احجز استشارة مجانية</a>
<a href="/success-stories" class="cta-stories">شاهد قصص النجاح</a>
<a href="/partner-with-feras" class="cta-partner">اكتشف فرصة الشراكة</a>
</div>
<p class="pillar-link">اقرأ المزيد عن <a href="${pillarPage.path}">${pillarPage.titleAr}</a> | <a href="/health-investor">مفهوم المستثمر الصحي</a></p>
</div>`;

    const ctaEn = `
<div class="article-cta">
<h2>Ready to Transform Your Health Sustainably?</h2>
<p>Connect with <strong>Feras Alayed</strong> - Therapeutic & Behavioral Nutrition Specialist - for a free health assessment and personalized wellness plan.</p>
<div class="cta-buttons">
<a href="/assessments" class="cta-assess">Take Free Health Assessment</a>
<a href="https://wa.me/96877020770?text=I want to book a free consultation" class="cta-whatsapp">Book Free Consultation</a>
<a href="/success-stories" class="cta-stories">View Success Stories</a>
<a href="/partner-with-feras" class="cta-partner">Discover Partnership Opportunity</a>
</div>
<p class="pillar-link">Learn more about <a href="${pillarPage.path}">${pillarPage.titleEn}</a> | <a href="/health-investor">The Health Investor Concept</a></p>
</div>`;

    const fullContentAr = article.contentAr + ctaAr;
    const fullContentEn = article.contentEn + ctaEn;

    // Build structured data
    const faqSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: (article.faqSchema || []).map((faq: any) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });

    const articleSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.titleEn,
      description: article.metaDescriptionEn,
      image: heroImageUrl || undefined,
      author: {
        "@type": "Person",
        "@id": "https://feelgreat.us.com/#feras-alayed",
        name: "Feras Alayed",
        url: "https://feelgreat.us.com/feras-alayed",
        jobTitle: "Global Health Educator, Therapeutic & Behavioral Nutrition Specialist, Leadership Mentor",
      },
      publisher: { "@type": "Organization", name: "Feel Great Partner", url: "https://feelgreat.us.com" },
      datePublished: new Date().toISOString(),
      mainEntityOfPage: `https://feelgreat.us.com/blog/${slug}`,
      keywords: keywordData.targetKeyword,
      wordCount: wordCountEn,
      articleSection: pillar.nameEn,
    });

    // Pack schemas in keywords field for backward compatibility
    const keywordsWithSchema = `${keywordData.targetKeyword}|${article.metaDescriptionEn || ""}|FAQ_SCHEMA:${faqSchemaJson}|ARTICLE_SCHEMA:${articleSchemaJson}`;

    // ============================================================
    // QUALITY CONTROL ENGINE - Pre-publish validation
    // ============================================================
    const { validateArticleQuality, autoFixArticle } = await import("./qualityControl");

    // Run Quality Control checks
    console.log("[GenerateArticle] Running Quality Control validation...");
    const qcResult = validateArticleQuality({
      contentEn: article.contentEn || "",
      contentAr: article.contentAr || "",
      titleEn: article.titleEn || "",
      titleAr: article.titleAr || "",
      faqSchema: article.faqSchema,
      internalLinks: article.internalLinks,
      keywords: keywordsWithSchema,
    });

    console.log(`[GenerateArticle] QC Score: ${qcResult.score}/100 | Passed: ${qcResult.passed}`);
    if (qcResult.criticalFailures.length > 0) {
      console.warn(`[GenerateArticle] QC Critical Failures: ${qcResult.criticalFailures.join(", ")}`);
    }
    if (qcResult.warnings.length > 0) {
      console.warn(`[GenerateArticle] QC Warnings: ${qcResult.warnings.join(", ")}`);
    }

    // Auto-fix any issues
    const fixResult = autoFixArticle({
      contentEn: article.contentEn || "",
      contentAr: article.contentAr || "",
    });
    article.contentEn = fixResult.contentEn;
    article.contentAr = fixResult.contentAr;
    if (fixResult.fixes.length > 0) {
      console.log(`[GenerateArticle] QC Auto-fixes applied: ${fixResult.fixes.join(", ")}`);
    }

    // Final quality gates
    const meetsMinWordCount = wordCountEn >= 400;
    const hasFaq = (article.faqSchema && article.faqSchema.length >= 3);
    const passesQC = qcResult.passed || qcResult.score >= 50; // Allow if score >= 50 after auto-fix

    if (!passesQC) {
      console.warn(`[GenerateArticle] ⚠️ Article failed QC (score: ${qcResult.score}). Saving as draft for review.`);
    }

    // ============================================================
    // CONTENT CLUSTER ENGINE - Auto-generate internal links
    // ============================================================
    const { generateInternalLinks, identifyCluster } = await import("./contentCluster");
    
    // Get existing articles for cross-linking
    const existingArticleSlugs = await getRecentArticleSlugs(20);
    const existingArticlesForLinks = existingArticleSlugs.map((s: string) => ({
      slug: s,
      titleEn: s.replace(/-/g, ' '),
      titleAr: s.replace(/-/g, ' '),
      category: pillar.id,
    }));
    
    // Generate cluster-based internal links
    const clusterLinks = generateInternalLinks(
      article.contentEn || "",
      pillar.id,
      existingArticlesForLinks
    );
    
    // Merge LLM-generated links with cluster engine links
    const mergedInternalLinks = [
      ...(article.internalLinks || []),
      ...clusterLinks.map(cl => ({ slug: cl.url, title: cl.anchorTextEn })),
    ].slice(0, 10); // Keep max 10 links
    
    console.log(`[GenerateArticle] Content Cluster: ${pillar.id} | Internal links: ${mergedInternalLinks.length}`);

    // Save to database
    console.log("[GenerateArticle] Saving to database...");
    await createBlogArticle({
      slug,
      titleAr: article.titleAr,
      titleEn: article.titleEn,
      excerptAr: article.excerptAr,
      excerptEn: article.excerptEn,
      contentAr: fullContentAr,
      contentEn: fullContentEn,
      // Translated content (fr, es, de, tr)
      titleFr: translations.titleFr || null,
      titleEs: translations.titleEs || null,
      titleDe: translations.titleDe || null,
      titleTr: translations.titleTr || null,
      excerptFr: translations.excerptFr || null,
      excerptEs: translations.excerptEs || null,
      excerptDe: translations.excerptDe || null,
      excerptTr: translations.excerptTr || null,
      contentFr: translations.contentFr || null,
      contentEs: translations.contentEs || null,
      contentDe: translations.contentDe || null,
      contentTr: translations.contentTr || null,
      category: pillar.id,
      tags: article.tags || [],
      keywords: keywordsWithSchema,
      // New enhanced fields
      metaTitleAr: article.metaTitleAr,
      metaTitleEn: article.metaTitleEn,
      metaDescriptionAr: article.metaDescriptionAr,
      metaDescriptionEn: article.metaDescriptionEn,
      heroImageUrl: heroImageUrl,
      ogImageUrl: heroImageUrl, // Use same image for OG
      socialFacebook: socialContent.facebook,
      socialLinkedin: socialContent.linkedin,
      socialInstagram: socialContent.instagram,
      socialReelsScript: socialContent.reelsScript,
      socialTiktokScript: socialContent.tiktokScript,
      pillarId: pillar.id,
      clusterId: pillar.id,
      targetKeyword: keywordData.targetKeyword,
      keywordVolume: keywordData.keywordVolume,
      keywordDifficulty: keywordData.keywordDifficulty,
      wordCount,
      status: (meetsMinWordCount && passesQC) ? "published" : "draft",
      language: "both",
      faqSchema: article.faqSchema,
      internalLinks: mergedInternalLinks,
      publishedAt: (meetsMinWordCount && passesQC) ? new Date() : null,
      readTimeMinutes,
      isPublished: meetsMinWordCount && passesQC,
    });

    // Notify owner with comprehensive report
    const notificationContent = `📝 مقال SEO جديد تم توليده ونشره تلقائياً!

🎯 الكلمة المفتاحية: ${keywordData.targetKeyword}
📊 حجم البحث: ~${keywordData.keywordVolume}/شهر | الصعوبة: ${keywordData.keywordDifficulty}
🔍 نية البحث: ${keywordData.searchIntent}

📄 العنوان (AR): ${article.titleAr}
📄 العنوان (EN): ${article.titleEn}
📂 المحور: ${pillar.nameAr}
🔗 الرابط: /blog/${slug}
📏 عدد الكلمات: EN ~${wordCountEn} | AR ~${wordCountAr}
⏱️ وقت القراءة: ${readTimeMinutes} دقائق
🖼️ صورة: ${heroImageUrl ? "✅ تم التوليد" : "❌ فشل"}
📱 محتوى سوشيال: ${socialContent.facebook ? "✅" : "❌"}

✅ الحالة: ${meetsMinWordCount ? "منشور" : "مسودة (كلمات قليلة)"}
🌐 الرابط الكامل: https://feelgreat.us.com/blog/${slug}`;

    await notifyOwner({
      title: `📝 مقال جديد: ${article.titleAr}`,
      content: notificationContent,
    }).catch((e) => console.error("[GenerateArticle] Notification failed:", e));

    console.log(`[GenerateArticle] ✅ Complete! Slug: ${slug}, Words: ${wordCount}, Published: ${meetsMinWordCount}`);

    // Ping IndexNow to notify search engines of new content
    if (meetsMinWordCount) {
      pingIndexNow(slug).catch((e) => console.error("[IndexNow] Ping failed:", e));
      // Send push notifications to all subscribers about the new article
      import("../pushNotifications").then(({ notifyNewArticle: pushNotify }) => {
        pushNotify({ titleAr: article.titleAr, titleEn: article.titleEn, slug }).catch((e: any) => console.error("[Push] Notification failed:", e));
      }).catch((e: any) => console.error("[Push] Import failed:", e));
    }

    return res.json({
      ok: true,
      slug,
      titleEn: article.titleEn,
      titleAr: article.titleAr,
      pillar: pillar.id,
      targetKeyword: keywordData.targetKeyword,
      keywordVolume: keywordData.keywordVolume,
      keywordDifficulty: keywordData.keywordDifficulty,
      wordCount,
      readTimeMinutes,
      heroImage: !!heroImageUrl,
      socialContent: !!socialContent.facebook,
      published: meetsMinWordCount,
      faqCount: article.faqSchema?.length || 0,
      internalLinksCount: article.internalLinks?.length || 0,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[GenerateArticle] Handler error:", error);
    return res.status(500).json({
      error: errMsg,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Notify all search engines about new article using the comprehensive indexing module.
 */
async function pingIndexNow(slug: string): Promise<void> {
  try {
    const { notifyNewArticle } = await import("../seo/indexing");
    await notifyNewArticle(slug);
    console.log(`[IndexNow] All search engines notified for: /blog/${slug}`);
  } catch (e: unknown) {
    console.error("[IndexNow] Notification failed:", e);
  }
}
