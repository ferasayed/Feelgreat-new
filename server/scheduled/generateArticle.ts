import type { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { createBlogArticle, getRecentArticleSlugs, getRecentArticleKeywords } from "../db";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import { notifyOwner } from "../_core/notification";

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
  const parsed = JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw));
  return parsed;
}

// ============================================================
// STEP 2: GENERATE FULL ARTICLE (FERAS STYLE)
// ============================================================
async function generateArticleContent(topic: string, targetKeyword: string, searchIntent: string, pillar: typeof CONTENT_PILLARS[0], recentSlugs: string[]) {
  // Build internal link suggestions from existing articles
  const suggestedInternalLinks = recentSlugs.slice(0, 10).map(s => `/blog/${s}`).join(", ");

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `أنت كاتب محتوى صحي عالمي المستوى تعمل لصالح فراس العايد - أخصائي التغذية العلاجية والسلوكية ومؤسس مفهوم "المستثمر الصحي".

=== أسلوب الكتابة (FERAS STYLE) ===
- اكتب بأسلوب دافئ، موثوق، تعليمي مع لمسة شخصية
- استخدم لغة طبيعية وإنسانية - تجنب الأنماط الروبوتية
- نوّع في أطوال الجمل والفقرات
- أدرج رؤى شخصية ونصائح عملية قابلة للتطبيق
- استشهد بدراسات علمية بشكل طبيعي (The Lancet, JAMA, Nature Medicine, BMJ, Cell Metabolism)
- استخدم القصص والتشبيهات والأمثلة الواقعية
- اكتب كأنك تشرح لصديق ذكي مهتم بصحته
- أدرج إحصائيات من مصادر موثوقة (CDC, WHO, NIH)
- امزج بين الفقرات القصيرة المؤثرة والفقرات التوضيحية الطويلة

=== الجمهور المستهدف ===
- الأساسي: النساء 35-60 سنة في أمريكا والخليج العربي
- الثانوي: المهنيون المهتمون بالصحة في أوروبا
- تحدث مباشرة عن مشاكلهم اليومية

=== E-E-A-T OPTIMIZATION (2026) ===
- Experience: أدرج تجارب حقيقية من ممارسة فراس السريرية ("في تجربتي مع مئات العملاء..."، "لاحظت خلال 15 سنة من الممارسة...")
- Expertise: استشهد بالتخصص الدقيق لفراس (أخصائي تغذية علاجية وسلوكية معتمد)
- Authoritativeness: اذكر إنجازاته (مؤسس مفهوم المستثمر الصحي، شريك Unicity الرسمي)
- Trustworthiness: أضف disclaimers طبية عند الحاجة، اذكر أن المعلومات لا تغني عن استشارة الطبيب
- أضف "Author Box" info: اسم المؤلف، تخصصه، خبرته، روابط ملفاته المهنية
- استخدم مصادر peer-reviewed فقط (لا مدونات أو مواقع تجارية)

=== GEO OPTIMIZATION (Generative Engine Optimization) ===
- اكتب إجابات مباشرة وواضحة في أول 2-3 جمل من كل قسم (لاستهداف AI Overviews)
- استخدم تنسيق "Definition → Explanation → Evidence → Action" في كل H2
- أضف ملخصات قابلة للاقتباس (quotable summaries) بعد كل قسم رئيسي
- اكتب بأسلوب يسهل على AI استخراج الحقائق منه (factual density عالية)
- أدرج statistics + numbers + percentages (AI يفضل البيانات الكمية)
- استخدم bullet points للنصائح العملية (AI يقتبسها بسهولة)

=== AI SEARCH OPTIMIZATION ===
- هيكل المقال ليظهر في Featured Snippets: paragraph snippet (40-60 كلمة)، list snippet، table snippet
- أضف "TL;DR" أو "الخلاصة" في بداية المقال (3-4 جمل تلخص الإجابة)
- اكتب FAQ بأسلوب "People Also Ask" (أسئلة طبيعية كما يسألها الناس)
- أدرج comparison tables عند المقارنة بين خيارات
- استخدم schema-friendly formatting: تعريفات واضحة، خطوات مرقمة، قوائم
- أضف "Key Takeaways" section قبل الخاتمة

=== SEMANTIC SEO & TOPICAL AUTHORITY ===
- استخدم الكلمة المفتاحية الرئيسية 4-6 مرات بشكل طبيعي
- أدرج 10-15 كلمة LSI ومتغيرات دلالية (semantic variations)
- غطِّ الموضوع بعمق 360° (لا تترك سؤالاً بدون إجابة)
- اربط بالمحور الأم (Pillar Page) وبمقالات داعمة أخرى
- استخدم NLP-friendly structure: entity mentions، co-occurrence terms، topic clusters

=== قواعد SEO 2026 ===
- اكتب meta description جذاب (150-160 حرف) يحتوي CTA ضمني
- هيكل واضح بـ H2 و H3 (الكلمة المفتاحية في H2 واحد على الأقل)
- قسم FAQ مع 5-7 أسئلة (لاستهداف Featured Snippets + People Also Ask)
- 3-5 روابط داخلية مقترحة (مقالات + صفحات محاور)
- 3-5 مراجع خارجية (NIH, Mayo Clinic, Harvard Health, PubMed, WHO)
- محتوى يجيب على نية البحث مباشرة في أول 100 كلمة
- Passage Ranking optimization: كل H2 section يجب أن يكون self-contained

=== CONTENT CLUSTER STRATEGY ===
- اربط المقال بصفحة المحور (Pillar Page) في المقدمة والخاتمة
- أشر إلى 2-3 مقالات داعمة أخرى في نفس المحور
- استخدم anchor text وصفي (لا "اضغط هنا")
- أضف "مقالات ذات صلة" section قبل CTA

=== قواعد المحتوى ===
- لا تستخدم لغة التسويق الشبكي أبداً
- لا تدعي علاج أي مرض
- ركز على تغيير نمط الحياة والوقاية
- عزز مكانة فراس كخبير استراتيجي صحي
- روّج لمفهوم "المستثمر الصحي" بشكل طبيعي
- أضف disclaimer طبي في نهاية المقال

IMPORTANT: Respond ONLY with valid JSON. No markdown code blocks.`,
      },
      {
        role: "user",
        content: `اكتب مقالاً شاملاً ومحسّناً لـ SEO + GEO + AI Search عن: "${topic}"

الكلمة المفتاحية الرئيسية: "${targetKeyword}"
نية البحث: ${searchIntent}
المحور الصحي: ${pillar.nameAr} (${pillar.nameEn})
الروابط الداخلية المتاحة: ${suggestedInternalLinks}
صفحة المحور: ${PILLAR_PAGES[pillar.id]?.path || "/blog"}

المقال يجب أن يكون 1800-2500 كلمة ويتضمن:
1. TL;DR / الخلاصة (3-4 جمل تلخص الإجابة مباشرة - لـ AI Overviews)
2. مقدمة جذابة مع hook قوي + EEAT signal (تجربة فراس الشخصية)
3. جسم منظم بـ H2/H3 (كل H2 = self-contained passage لـ Passage Ranking)
4. نصائح عملية قابلة للتطبيق (بـ bullet points لـ AI extraction)
5. Key Takeaways section (5-7 نقاط ملخصة)
6. مراجع علمية (3-5 peer-reviewed sources)
7. قسم FAQ (5-7 أسئلة بأسلوب People Also Ask)
8. "مقالات ذات صلة" section مع روابط داخلية
9. خاتمة قوية مع CTA
10. Disclaimer طبي في النهاية

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
  "contentAr": "المقال الكامل بالعربية بـ HTML (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>). أضف FAQ باستخدام <div class='faq-item'><h3>السؤال</h3><p>الجواب</p></div>",
  "contentEn": "Full English article with HTML. Add FAQ using <div class='faq-item'><h3>Question</h3><p>Answer</p></div>",
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
  return JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw));
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
  return JSON.parse(typeof raw === "string" ? raw : JSON.stringify(raw));
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

    // Smart pillar selection: prioritize the 10 requested domains with weighted rotation
    // Priority pillars (user requested): insulin-resistance, diabetes, weight-management, 
    // fatty-liver, gut-health, womens-health, behavioral-nutrition, sleep-energy, 
    // chronic-inflammation, sustainable-health
    const PRIORITY_PILLAR_IDS = [
      "insulin-resistance", "diabetes", "weight-management", "fatty-liver",
      "gut-health", "womens-health", "behavioral-nutrition", "sleep-energy",
      "chronic-inflammation", "sustainable-health"
    ];
    
    // Use hour-based rotation for multiple articles per day
    const hourOfDay = new Date().getUTCHours();
    const dayOfYear = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    const rotationIndex = (dayOfYear * 3 + Math.floor(hourOfDay / 8)) % CONTENT_PILLARS.length;
    
    // 80% chance to pick from priority pillars, 20% from all pillars
    const usePriority = Math.random() < 0.8;
    let pillar: typeof CONTENT_PILLARS[0];
    if (usePriority) {
      const priorityIndex = rotationIndex % PRIORITY_PILLAR_IDS.length;
      pillar = CONTENT_PILLARS.find(p => p.id === PRIORITY_PILLAR_IDS[priorityIndex]) || CONTENT_PILLARS[rotationIndex];
    } else {
      pillar = CONTENT_PILLARS[rotationIndex];
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
        name: "Feras Alayed",
        url: "https://feelgreat.us.com/about",
        jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
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

    // Content quality validation
    const meetsMinWordCount = wordCountEn >= 800;
    const hasFaq = (article.faqSchema && article.faqSchema.length >= 3);

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
      status: meetsMinWordCount ? "published" : "draft",
      language: "both",
      faqSchema: article.faqSchema,
      internalLinks: article.internalLinks,
      publishedAt: meetsMinWordCount ? new Date() : null,
      readTimeMinutes,
      isPublished: meetsMinWordCount,
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
 * Ping IndexNow to notify Bing, Yandex, and other search engines of new content.
 * Google doesn't support IndexNow but we also ping Google's sitemap endpoint.
 */
async function pingIndexNow(slug: string): Promise<void> {
  const baseUrl = "https://feelgreat.us.com";
  const articleUrl = `${baseUrl}/blog/${slug}`;
  const key = "feelgreat-indexnow-2026";

  // IndexNow ping (Bing, Yandex, Seznam, Naver)
  try {
    await fetch(`https://api.indexnow.org/indexnow?url=${encodeURIComponent(articleUrl)}&key=${key}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
    console.log(`[IndexNow] Pinged: ${articleUrl}`);
  } catch (e: unknown) {
    console.error("[IndexNow] IndexNow ping failed:", e);
  }

  // Google sitemap ping
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${baseUrl}/sitemap.xml`)}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
    console.log(`[IndexNow] Google sitemap ping sent`);
  } catch (e: unknown) {
    console.error("[IndexNow] Google ping failed:", e);
  }
}
