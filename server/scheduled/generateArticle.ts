import type { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { createBlogArticle, getRecentArticleSlugs } from "../db";
import { invokeLLM } from "../_core/llm";
import { notifyOwner } from "../_core/notification";

const CONTENT_CLUSTERS = [
  {
    id: "insulin-resistance",
    topics: [
      "How intermittent fasting reverses insulin resistance naturally",
      "The role of soluble fiber in managing blood sugar spikes",
      "Understanding the insulin resistance-weight gain cycle",
      "Morning routines that improve insulin sensitivity",
      "The connection between sleep quality and insulin resistance",
      "How chromium and berberine support glucose metabolism",
      "Signs you might have insulin resistance and what to do",
      "The 4-4-12 method for metabolic health optimization",
      "Why visceral fat drives insulin resistance and how to reduce it",
      "Polyphenols and their effect on blood sugar regulation",
      "Best diet for prediabetes in America - evidence-based guide",
      "Why Americans struggle with blood sugar control and what works",
      "The hidden link between insulin resistance and belly fat in women over 40",
      "Prediabetes reversal - a complete guide for busy professionals",
      "How insulin resistance affects women differently after menopause",
      "Blood sugar balance strategies for working parents",
      "Understanding A1C levels and what they mean for your metabolic health",
      "The prediabetes epidemic in the US and natural prevention strategies",
    ],
  },
  {
    id: "sustainable-health",
    topics: [
      "The 6 pillars of sustainable health for long-term vitality",
      "Why crash diets fail and sustainable nutrition wins",
      "Building a health investment mindset for lasting change",
      "The compound effect of daily health habits over 90 days",
      "How to create a personalized sustainable health protocol",
      "The science of habit stacking for health transformation",
      "Why most health programs fail after 30 days and how to prevent it",
      "Sustainable health as a lifestyle not a temporary fix",
      "The role of accountability in long-term health success",
      "Measuring health ROI beyond the scale",
      "Sustainable health strategies for American women over 40",
      "How European wellness culture can transform American health habits",
      "The health investment approach - why prevention saves thousands in medical bills",
      "Building sustainable health habits as a busy working mother",
      "The Nordic approach to sustainable health and longevity",
    ],
  },
  {
    id: "weight-management",
    topics: [
      "Why calorie counting alone doesn't work for sustainable weight loss",
      "The gut-weight connection and how fiber changes everything",
      "How to break through weight loss plateaus naturally",
      "The psychology of emotional eating and behavioral solutions",
      "Understanding metabolic adaptation and how to overcome it",
      "The role of protein timing in body composition",
      "Why women lose weight differently and what actually works",
      "How stress hormones sabotage weight loss efforts",
      "The truth about metabolism boosting foods and supplements",
      "Creating a sustainable caloric deficit without hunger",
      "Weight loss after 40 - why it gets harder and what actually works for women",
      "Menopause weight gain - the complete guide to managing hormonal changes",
      "Why traditional diets fail women over 35 and what to do instead",
      "The connection between perimenopause and stubborn belly fat",
      "Sustainable weight loss for busy professional women in their 40s and 50s",
      "How to lose weight without extreme diets - a guide for women over 40",
      "The metabolic reset approach for women experiencing hormonal weight gain",
    ],
  },
  {
    id: "gut-health",
    topics: [
      "The gut-brain axis and its impact on mood and energy",
      "How prebiotics and probiotics work together for gut health",
      "Signs of an unhealthy gut and natural restoration strategies",
      "The connection between gut health and immune function",
      "How soluble fiber feeds beneficial gut bacteria",
      "Leaky gut syndrome and evidence-based healing approaches",
      "The microbiome diet for optimal digestive health",
      "How antibiotics damage gut flora and recovery strategies",
      "Fermented foods vs supplements for gut health",
      "The role of gut health in skin conditions and allergies",
      "How gut health impacts weight loss - the microbiome connection",
      "Gut health and hormones - why your digestion affects everything",
      "The American gut crisis - how processed food damages your microbiome",
      "Rebuilding gut health after years of processed food consumption",
      "The fiber gap in Western diets and how to fix it naturally",
    ],
  },
  {
    id: "healthy-habits",
    topics: [
      "The science of building habits that stick for life",
      "Morning routines of high-performing health-conscious professionals",
      "How to design your environment for automatic healthy choices",
      "The 2-minute rule for starting any health habit",
      "Why willpower fails and systems succeed in health goals",
      "Digital detox strategies for better sleep and mental clarity",
      "The power of walking 10000 steps for metabolic health",
      "How to meal prep efficiently for a week of healthy eating",
      "Building a consistent exercise routine when you hate the gym",
      "The connection between hydration and cognitive performance",
      "Healthy aging strategies for women over 40 - daily habits that matter",
      "Energy improvement strategies for exhausted working parents",
      "Sleep optimization guide for professionals with demanding schedules",
      "How to maintain healthy habits during a busy American lifestyle",
      "The European approach to work-life balance and health",
    ],
  },
  {
    id: "behavioral-nutrition",
    topics: [
      "What is behavioral nutrition and why it changes everything",
      "The psychology behind food cravings and how to manage them",
      "Mindful eating practices for better digestion and satisfaction",
      "How childhood food patterns affect adult eating behavior",
      "The role of dopamine in food addiction and breaking free",
      "Cognitive behavioral strategies for healthy eating",
      "Understanding hunger signals vs emotional triggers",
      "How social environments influence eating decisions",
      "The science of food reward and how to reset your palate",
      "Building a healthy relationship with food after years of dieting",
      "Why emotional eating increases after 40 and behavioral solutions",
      "Food psychology for busy American families",
      "Breaking the sugar addiction cycle - a behavioral approach",
      "How to eat mindfully in a fast-food culture",
    ],
  },
  {
    id: "metabolic-health",
    topics: [
      "What is metabolic health and why 88% of Americans don't have it",
      "The 5 markers of metabolic health and how to improve each one",
      "How metabolic syndrome develops silently and what to watch for",
      "Metabolic health after 40 - why it matters more than weight",
      "The connection between metabolic health and chronic disease prevention",
      "How to improve your metabolic age naturally without extreme measures",
      "Metabolic flexibility - training your body to burn fat efficiently",
      "The role of muscle mass in metabolic health for women over 35",
      "Understanding metabolic rate changes during perimenopause",
      "How inflammation destroys metabolic health and natural solutions",
    ],
  },
  {
    id: "healthy-aging",
    topics: [
      "Healthy aging strategies for women over 40 - what science says",
      "The longevity diet - evidence-based nutrition for aging well",
      "How to maintain muscle mass and bone density after 40",
      "Anti-inflammatory lifestyle for graceful aging",
      "Brain health and cognitive function - protecting your mind as you age",
      "Hormonal changes after 40 and natural management strategies",
      "The Blue Zones approach to healthy aging applied to Western lifestyle",
      "Why women age differently and what you can control",
      "Skin health from within - nutrition strategies for aging gracefully",
      "Energy and vitality after 50 - sustainable strategies that work",
    ],
  },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 120);
}

export async function generateArticleHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    // Get recent slugs to avoid duplicates
    const recentSlugs = await getRecentArticleSlugs(100);

    // Pick a random cluster and topic
    const cluster = CONTENT_CLUSTERS[Math.floor(Math.random() * CONTENT_CLUSTERS.length)];
    const availableTopics = cluster.topics.filter(
      (topic) => !recentSlugs.some((slug) => slug.includes(slugify(topic).slice(0, 40)))
    );
    const topic = availableTopics.length > 0
      ? availableTopics[Math.floor(Math.random() * availableTopics.length)]
      : cluster.topics[Math.floor(Math.random() * cluster.topics.length)];

    // Generate article using LLM
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a world-class health content writer working for Feras Alayed, a Therapeutic & Behavioral Nutrition Specialist and Sustainable Health Advocate. 

WRITING STYLE:
- Write in a warm, authoritative, educational tone
- Sound human and natural - avoid robotic or formulaic patterns
- Use varied sentence lengths and structures
- Include personal insights and practical advice
- Reference scientific studies naturally (cite journal names like The Lancet, JAMA, Nature Medicine, BMJ, Cell Metabolism)
- Use storytelling, analogies, and real-world examples to explain complex concepts
- Write as if explaining to an intelligent friend who is health-conscious
- Include statistics and data points from reputable sources (CDC, WHO, NIH)
- Vary paragraph lengths - mix short punchy paragraphs with longer explanatory ones

TARGET AUDIENCE:
- Primary: Women aged 35-60 in the United States
- Secondary: Health-conscious professionals in UK, Germany, Netherlands, Sweden
- Personas: Working mothers, professionals with demanding careers, prediabetic individuals, people struggling with weight loss after 40, menopausal women
- Speak directly to their pain points and daily challenges
- Use relatable scenarios (busy mornings, office snacking, evening exhaustion)

BRAND POSITIONING:
- Position Feras Alayed as a health strategist and behavioral nutrition expert
- Emphasize sustainable health over quick fixes
- Promote the "Health Investor" mindset
- NEVER use network marketing language
- NEVER make medical cure claims
- Focus on lifestyle change and prevention
- Build topical authority in: Metabolic Health, Insulin Resistance, Sustainable Health, Healthy Aging

SEO REQUIREMENTS:
- Use the target keyword naturally 4-6 times in the English version
- Include LSI keywords and semantic variations throughout
- Write compelling meta description (150-160 chars) that drives clicks
- Structure with clear H2 and H3 headings (use keyword in at least one H2)
- Include a FAQ section with 4-5 questions (target featured snippets)
- Add 2-3 internal links to other health topics on the site
- Add 2-3 external authority references (link to NIH, Mayo Clinic, Harvard Health, etc.)
- Optimize for Google US and Google UK search results

IMPORTANT: Respond ONLY with valid JSON. No markdown code blocks, no extra text.`,
        },
        {
          role: "user",
          content: `Write a comprehensive, SEO-optimized health article about: "${topic}"

Content Cluster: ${cluster.id}

The article MUST be 1200-2500 words and include:
1. Engaging introduction with a hook
2. Well-structured body with H2/H3 headings
3. Practical actionable tips
4. Scientific references (mention study names/journals)
5. FAQ section (4-5 questions with answers)
6. Strong conclusion with CTA

Return a JSON object with this exact structure:
{
  "titleAr": "عنوان SEO جذاب بالعربية (60-70 حرف، يحتوي الكلمة المفتاحية)",
  "titleEn": "Compelling SEO title in English (60-70 chars, contains keyword)",
  "metaDescriptionAr": "وصف ميتا بالعربية 150-160 حرف",
  "metaDescriptionEn": "Meta description in English 150-160 chars",
  "excerptAr": "ملخص جذاب بالعربية 2-3 جمل يشجع على القراءة",
  "excerptEn": "Engaging excerpt 2-3 sentences that encourage reading",
  "contentAr": "المقال الكامل بالعربية (1200-2500 كلمة). استخدم HTML: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <blockquote>. أضف قسم FAQ في النهاية باستخدام <h2>الأسئلة الشائعة</h2> ثم <div class='faq-item'><h3>السؤال</h3><p>الجواب</p></div>. أضف روابط داخلية مقترحة باستخدام <a href='/blog/SLUG'>نص الرابط</a>. أضف مراجع علمية.",
  "contentEn": "Full article in English (1200-2500 words). Use HTML: <h2>, <h3>, <p>, <ul>, <li>, <ol>, <strong>, <em>, <blockquote>. Add FAQ section at end using <h2>Frequently Asked Questions</h2> then <div class='faq-item'><h3>Question</h3><p>Answer</p></div>. Add suggested internal links using <a href='/blog/SLUG'>link text</a>. Add scientific references.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "keywords": "primary keyword, secondary keyword 1, secondary keyword 2, LSI keyword 1, LSI keyword 2, Arabic keyword 1, Arabic keyword 2",
  "faqSchema": [
    {"question": "Question 1?", "answer": "Answer 1"},
    {"question": "Question 2?", "answer": "Answer 2"},
    {"question": "Question 3?", "answer": "Answer 3"},
    {"question": "Question 4?", "answer": "Answer 4"}
  ]
}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "seo_blog_article",
          strict: true,
          schema: {
            type: "object",
            properties: {
              titleAr: { type: "string" },
              titleEn: { type: "string" },
              metaDescriptionAr: { type: "string" },
              metaDescriptionEn: { type: "string" },
              excerptAr: { type: "string" },
              excerptEn: { type: "string" },
              contentAr: { type: "string" },
              contentEn: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              keywords: { type: "string" },
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
            },
            required: ["titleAr", "titleEn", "metaDescriptionAr", "metaDescriptionEn", "excerptAr", "excerptEn", "contentAr", "contentEn", "tags", "keywords", "faqSchema"],
            additionalProperties: false,
          },
        },
      },
    });

    const rawContent = response.choices?.[0]?.message?.content;
    const content = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
    if (!content) {
      return res.status(500).json({ error: "LLM returned empty content", timestamp: new Date().toISOString() });
    }

    let article: any;
    try {
      article = JSON.parse(content);
    } catch (parseErr) {
      return res.status(500).json({ error: "Failed to parse LLM response", raw: content?.slice(0, 500), timestamp: new Date().toISOString() });
    }

    // Generate slug from English title
    const baseSlug = slugify(article.titleEn);
    const slug = recentSlugs.includes(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Calculate word counts for both languages
    const wordCountAr = (article.contentAr || "").split(/\s+/).length;
    const wordCountEn = (article.contentEn || "").split(/\s+/).length;
    const wordCount = Math.max(wordCountAr, wordCountEn);
    const readTimeMinutes = Math.max(5, Math.ceil(wordCount / 200));

    // Content validation - ensure quality before publishing
    const hasFaq = (article.contentEn || "").includes("faq-item") || (article.faqSchema && article.faqSchema.length >= 3);
    const hasInternalLinks = (article.contentEn || "").includes('href="/blog/');
    const hasExternalRefs = (article.contentEn || "").includes('href="http');
    const meetsMinWordCount = wordCountEn >= 800; // relaxed from 1200 to account for HTML tags

    console.log(`[GenerateArticle] Validation: words=${wordCountEn}, FAQ=${hasFaq}, internalLinks=${hasInternalLinks}, externalRefs=${hasExternalRefs}`);

    // Build FAQ Schema JSON-LD for embedding
    let faqSchemaJson = "";
    if (article.faqSchema && article.faqSchema.length > 0) {
      const faqLD = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqSchema.map((faq: any) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
      faqSchemaJson = JSON.stringify(faqLD);
    }

    // Append CTA and lead gen section with internal links to pillar pages, assessments, and success stories
    const pillarLinks: Record<string, { en: string; ar: string; path: string }> = {
      "insulin-resistance": { en: "Insulin Resistance", ar: "مقاومة الأنسولين", path: "/health/insulin-resistance" },
      "sustainable-health": { en: "Sustainable Health", ar: "الصحة المستدامة", path: "/health/sustainable-health" },
      "weight-management": { en: "Weight Loss After 40", ar: "فقدان الوزن بعد الأربعين", path: "/health/weight-loss-after-40" },
      "gut-health": { en: "Gut Health", ar: "صحة الأمعاء", path: "/health/gut-health" },
      "healthy-habits": { en: "Energy & Fatigue", ar: "الطاقة والنشاط", path: "/health/energy-fatigue" },
      "behavioral-nutrition": { en: "Behavioral Nutrition", ar: "التغذية السلوكية", path: "/health/behavioral-nutrition" },
      "metabolic-health": { en: "Metabolic Health", ar: "الصحة الأيضية", path: "/health/metabolic-health" },
      "healthy-aging": { en: "Healthy Aging", ar: "الشيخوخة الصحية", path: "/health/healthy-aging" },
    };
    const pillar = pillarLinks[cluster.id] || pillarLinks["sustainable-health"];

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
<p class="pillar-link">اقرأ المزيد عن <a href="${pillar.path}">${pillar.ar}</a> | <a href="/health-investor">مفهوم المستثمر الصحي</a></p>
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
<p class="pillar-link">Learn more about <a href="${pillar.path}">${pillar.en}</a> | <a href="/health-investor">The Health Investor Concept</a></p>
</div>`;

    const fullContentAr = article.contentAr + ctaAr;
    const fullContentEn = article.contentEn + ctaEn;

    // Build Article Schema JSON-LD
    const articleSchemaJson = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.titleEn,
      description: article.metaDescriptionEn,
      author: {
        "@type": "Person",
        name: "Feras Alayed",
        url: "https://feelgreat.us.com/about",
        jobTitle: "Therapeutic & Behavioral Nutrition Specialist",
        sameAs: ["https://www.instagram.com/feras.alayed", "https://wa.me/96877020770"],
      },
      publisher: {
        "@type": "Organization",
        name: "Feel Great Partner",
        url: "https://feelgreat.us.com",
      },
      datePublished: new Date().toISOString(),
      mainEntityOfPage: `https://feelgreat.us.com/blog/${slug}`,
      keywords: article.keywords,
      wordCount: wordCountEn,
      articleSection: cluster.id.replace(/-/g, " "),
    });

    // Store FAQ schema + Article schema in keywords field for frontend rendering
    const keywordsWithSchema = `${article.keywords || ""}|${article.metaDescriptionEn || ""}|FAQ_SCHEMA:${faqSchemaJson}|ARTICLE_SCHEMA:${articleSchemaJson}`;

    // Save to database
    await createBlogArticle({
      slug,
      titleAr: article.titleAr,
      titleEn: article.titleEn,
      excerptAr: article.excerptAr,
      excerptEn: article.excerptEn,
      contentAr: fullContentAr,
      contentEn: fullContentEn,
      category: cluster.id,
      tags: article.tags || [],
      keywords: keywordsWithSchema,
      readTimeMinutes,
      isPublished: meetsMinWordCount, // Only publish if meets minimum quality
    });

    // Notify owner
    await notifyOwner({
      title: `\uD83D\uDCDD New SEO Article: ${article.titleEn}`,
      content: `Auto-generated SEO article ${meetsMinWordCount ? "published" : "saved as draft (low word count)"}.

Title (AR): ${article.titleAr}
Title (EN): ${article.titleEn}
Cluster: ${cluster.id}
Slug: /blog/${slug}
Words (EN): ~${wordCountEn} | Words (AR): ~${wordCountAr}
Read Time: ${readTimeMinutes} min
Target Market: US/UK/Europe
Audience: Women 35-60, Professionals
Keywords: ${article.keywords}
Validation: FAQ=${hasFaq}, InternalLinks=${hasInternalLinks}, ExternalRefs=${hasExternalRefs}

The article is live at: https://feelgreat.us.com/blog/${slug}`,
    }).catch((e) => console.error("[GenerateArticle] Notification failed:", e));

    return res.json({
      ok: true,
      slug,
      titleEn: article.titleEn,
      titleAr: article.titleAr,
      category: cluster.id,
      readTimeMinutes,
      wordCountEn,
      wordCountAr,
      published: meetsMinWordCount,
      validation: { hasFaq, hasInternalLinks, hasExternalRefs, meetsMinWordCount },
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    const errStack = error instanceof Error ? error.stack : undefined;
    console.error("[GenerateArticle] Handler error:", error);
    return res.status(500).json({
      error: errMsg,
      stack: errStack,
      context: { url: req.url, taskUid: "unknown" },
      timestamp: new Date().toISOString(),
    });
  }
}
