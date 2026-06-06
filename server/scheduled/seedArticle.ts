import type { Request, Response } from "express";
import { createBlogArticle, getRecentArticleSlugs, getRecentArticleKeywords, getPillarWeights, getTopPerformingPillars } from "../db";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import { notifyOwner } from "../_core/notification";

// ============================================================
// CONTENT PILLARS (subset for seeding)
// ============================================================
const SEED_PILLARS = [
  { id: "insulin-resistance", nameAr: "مقاومة الأنسولين", nameEn: "Insulin Resistance" },
  { id: "gut-health", nameAr: "صحة الأمعاء", nameEn: "Gut Health" },
  { id: "weight-management", nameAr: "إدارة الوزن", nameEn: "Weight Management" },
  { id: "sustainable-health", nameAr: "الصحة المستدامة", nameEn: "Sustainable Health" },
  { id: "diabetes", nameAr: "السكري", nameEn: "Diabetes Management" },
  { id: "fatty-liver", nameAr: "الكبد الدهني", nameEn: "Fatty Liver" },
  { id: "sleep-energy", nameAr: "النوم والطاقة", nameEn: "Sleep & Energy" },
  { id: "womens-health", nameAr: "صحة المرأة", nameEn: "Women's Health" },
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
  
  // Strategy: find the last complete key-value pair and close everything after it
  // Look for the last complete value (ending with ", or number, or ], or })
  const lastCompleteValue = truncated.lastIndexOf('"');
  if (lastCompleteValue > 0) {
    // Check if this quote ends a string value
    let candidate = truncated.slice(0, lastCompleteValue + 1);
    
    // Close any open arrays and objects
    const openBrackets = (candidate.match(/\[/g) || []).length - (candidate.match(/\]/g) || []).length;
    const openBraces = (candidate.match(/\{/g) || []).length - (candidate.match(/\}/g) || []).length;
    
    for (let i = 0; i < openBrackets; i++) candidate += "]";
    for (let i = 0; i < openBraces; i++) candidate += "}";
    
    try { return JSON.parse(candidate); } catch (e) { /* continue */ }
    
    // Try adding a closing quote if we're mid-string
    candidate = truncated.slice(0, lastCompleteValue + 1) + '"';
    const ob2 = (candidate.match(/\[/g) || []).length - (candidate.match(/\]/g) || []).length;
    const oc2 = (candidate.match(/\{/g) || []).length - (candidate.match(/\}/g) || []).length;
    for (let i = 0; i < ob2; i++) candidate += "]";
    for (let i = 0; i < oc2; i++) candidate += "}";
    try { return JSON.parse(candidate); } catch (e) { /* continue */ }
  }
  
  // Last resort: try truncating at various points
  for (let cutoff = truncated.length - 1; cutoff > truncated.length - 500; cutoff--) {
    const slice = truncated.slice(0, cutoff);
    // Find last complete structure point
    if (slice.endsWith('"') || slice.endsWith(']') || slice.endsWith('}')) {
      let attempt = slice;
      const ob = (attempt.match(/\[/g) || []).length - (attempt.match(/\]/g) || []).length;
      const oc = (attempt.match(/\{/g) || []).length - (attempt.match(/\}/g) || []).length;
      for (let i = 0; i < ob; i++) attempt += "]";
      for (let i = 0; i < oc; i++) attempt += "}";
      try { return JSON.parse(attempt); } catch (e) { /* continue */ }
    }
  }
  
  throw new Error(`Failed to parse JSON (length: ${raw.length})`);
}

// ============================================================
// SEED ARTICLE HANDLER - No cron auth required
// ============================================================
export async function seedArticleHandler(req: Request, res: Response) {
  try {
    console.log("[SeedArticle] Starting article generation...");

    // Get recent data for deduplication
    const [recentSlugs, recentKeywords] = await Promise.all([
      getRecentArticleSlugs(100),
      getRecentArticleKeywords(50),
    ]);

    // Select a random pillar
    const pillar = SEED_PILLARS[Math.floor(Math.random() * SEED_PILLARS.length)];
    console.log(`[SeedArticle] Selected pillar: ${pillar.nameEn}`);

    // STEP 1: Generate topic
    console.log("[SeedArticle] Step 1: Selecting topic...");
    const topicResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are an SEO keyword researcher for health content. Select a specific, compelling article topic for the health pillar provided. Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: `Health Pillar: ${pillar.nameEn} (${pillar.nameAr})
AVOID these recent slugs: ${recentSlugs.slice(0, 10).join(", ")}
AVOID these recent keywords: ${recentKeywords.slice(0, 10).join(", ")}

Return JSON: {"topic":"specific article topic","targetKeyword":"2-4 word keyword","searchIntent":"informational"}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "topic_selection",
          strict: true,
          schema: {
            type: "object",
            properties: {
              topic: { type: "string" },
              targetKeyword: { type: "string" },
              searchIntent: { type: "string" },
            },
            required: ["topic", "targetKeyword", "searchIntent"],
            additionalProperties: false,
          },
        },
      },
    });

    const topicRaw = topicResponse.choices?.[0]?.message?.content;
    const topicData = robustJsonParse(typeof topicRaw === "string" ? topicRaw : JSON.stringify(topicRaw));
    console.log(`[SeedArticle] Topic: "${topicData.topic}" | Keyword: "${topicData.targetKeyword}"`);

    // STEP 2: Generate article content
    console.log("[SeedArticle] Step 2: Generating article...");
    const articleResponse = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `أنت كاتب محتوى صحي عالمي المستوى تعمل لصالح فراس العايد - أخصائي التغذية العلاجية والسلوكية.

القواعد الأساسية:
1. PEOPLE FIRST: اكتب للإنسان أولاً. المقالة تحل مشكلة حقيقية.
2. E-E-A-T: أظهر الخبرة والتجربة والمصداقية والموثوقية.
3. مصادر علمية إلزامية من: PubMed, NIH, Harvard Health, Mayo Clinic, WHO
4. ممنوع الادعاءات العلاجية: استخدم "قد يساعد"، "قد يدعم"، "قد يحسن"
5. الربط مع Feel Great: المشكلة → السبب → نمط الحياة → التغذية → Feel Great كأداة داعمة
6. Balance = ألياف قابلة للذوبان، Unimate = بوليفينولات ومتة، Probionic = ميكروبيوم

اكتب بأسلوب دافئ وموثوق. أدرج تجارب فراس السريرية. أضف disclaimer طبي.

IMPORTANT: Return ONLY valid JSON. Keep content concise (800-1200 words per language). No markdown code blocks.`,
        },
        {
          role: "user",
          content: `اكتب مقالاً عن: "${topicData.topic}"
الكلمة المفتاحية: "${topicData.targetKeyword}"
المحور: ${pillar.nameAr} (${pillar.nameEn})

الهيكل: ملخص تنفيذي → مقدمة → المشكلة والأسباب → ماذا تقول الدراسات → خطوات عملية → دور Feel Great → FAQ (3 أسئلة) → مراجع → disclaimer

أرجع JSON:
{
  "titleAr": "عنوان عربي (50-65 حرف)",
  "titleEn": "English title (50-65 chars)",
  "metaTitleAr": "ميتا عربي (50-60 حرف)",
  "metaTitleEn": "Meta English (50-60 chars)",
  "metaDescriptionAr": "وصف 120-150 حرف",
  "metaDescriptionEn": "Description 120-150 chars",
  "excerptAr": "ملخص 2 جمل",
  "excerptEn": "2 sentence excerpt",
  "contentAr": "HTML article in Arabic with h2, h3, p, ul, li tags",
  "contentEn": "HTML article in English with h2, h3, p, ul, li tags",
  "tags": ["tag1","tag2","tag3"],
  "faqSchema": [{"question":"Q","answer":"A"}],
  "internalLinks": [],
  "heroImagePrompt": "image description"
}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "article_content",
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

    const articleRaw = articleResponse.choices?.[0]?.message?.content;
    let article: any;
    try {
      article = robustJsonParse(typeof articleRaw === "string" ? articleRaw : JSON.stringify(articleRaw));
    } catch (parseError) {
      // Log the raw response for debugging and retry once
      console.error(`[SeedArticle] JSON parse failed. Raw length: ${(articleRaw || "").length}. Retrying...`);
      console.error(`[SeedArticle] First 300 chars: ${String(articleRaw).slice(0, 300)}`);
      console.error(`[SeedArticle] Last 300 chars: ${String(articleRaw).slice(-300)}`);
      
      // Retry with a simpler prompt asking for shorter content
      const retryResponse = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a health content writer. Write a concise article. Return ONLY valid JSON. Keep content SHORT (500-800 words per language). No markdown.`,
          },
          {
            role: "user",
            content: `Write a short health article about: "${topicData.topic}"
Keyword: "${topicData.targetKeyword}"
Pillar: ${pillar.nameEn}

Return JSON with these exact fields:
{"titleAr":"Arabic title","titleEn":"English title","metaTitleAr":"meta ar","metaTitleEn":"meta en","metaDescriptionAr":"desc ar","metaDescriptionEn":"desc en","excerptAr":"excerpt ar","excerptEn":"excerpt en","contentAr":"<h2>Title</h2><p>Short Arabic article with h2, p tags</p>","contentEn":"<h2>Title</h2><p>Short English article with h2, p tags</p>","tags":["tag1","tag2"],"faqSchema":[{"question":"Q","answer":"A"}],"internalLinks":[],"heroImagePrompt":"health image"}`,
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
      article = robustJsonParse(typeof retryRaw === "string" ? retryRaw : JSON.stringify(retryRaw));
    }
    console.log(`[SeedArticle] Article generated: "${article.titleEn}"`);

    // Generate slug
    const baseSlug = slugify(article.titleEn);
    const slug = recentSlugs.includes(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;

    // Word counts
    const wordCountAr = (article.contentAr || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
    const wordCountEn = (article.contentEn || "").replace(/<[^>]*>/g, "").split(/\s+/).length;
    const wordCount = Math.max(wordCountAr, wordCountEn);
    const readTimeMinutes = Math.max(3, Math.ceil(wordCount / 200));

    // STEP 3: Generate hero image (non-blocking)
    console.log("[SeedArticle] Step 3: Generating hero image...");
    let heroImageUrl: string | null = null;
    try {
      const imgResult = await generateImage({
        prompt: `Professional health blog hero image. ${article.heroImagePrompt}. Clean, modern, warm lighting, no text. 16:9 aspect ratio.`,
      });
      heroImageUrl = imgResult.url || null;
    } catch (e) {
      console.error("[SeedArticle] Image generation failed (non-blocking):", e);
    }

    // Add CTA section
    const ctaAr = `<div class="article-cta"><h2>هل تريد تحسين صحتك؟</h2><p>تواصل مع <strong>فراس العايد</strong> للحصول على تقييم صحي مجاني.</p><p><a href="https://wa.me/96877020770?text=أريد استشارة صحية مجانية">احجز استشارة مجانية عبر واتساب</a> | <a href="/assessments">ابدأ التقييم الصحي</a></p></div>`;
    const ctaEn = `<div class="article-cta"><h2>Ready to Improve Your Health?</h2><p>Connect with <strong>Feras Alayed</strong> for a free health assessment.</p><p><a href="https://wa.me/96877020770?text=I want a free health consultation">Book Free Consultation via WhatsApp</a> | <a href="/assessments">Take Health Assessment</a></p></div>`;

    const fullContentAr = article.contentAr + ctaAr;
    const fullContentEn = article.contentEn + ctaEn;

    // Save to database
    console.log("[SeedArticle] Saving to database...");
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
      keywords: topicData.targetKeyword,
      metaTitleAr: article.metaTitleAr,
      metaTitleEn: article.metaTitleEn,
      metaDescriptionAr: article.metaDescriptionAr,
      metaDescriptionEn: article.metaDescriptionEn,
      heroImageUrl: heroImageUrl,
      ogImageUrl: heroImageUrl,
      pillarId: pillar.id,
      clusterId: pillar.id,
      targetKeyword: topicData.targetKeyword,
      keywordVolume: 1000,
      keywordDifficulty: "medium",
      wordCount,
      status: "published",
      language: "both",
      faqSchema: article.faqSchema,
      internalLinks: article.internalLinks || [],
      publishedAt: new Date(),
      readTimeMinutes,
      isPublished: true,
    });

    console.log(`[SeedArticle] ✅ Article saved: ${slug} (${wordCount} words)`);

    return res.json({
      ok: true,
      slug,
      titleEn: article.titleEn,
      titleAr: article.titleAr,
      pillar: pillar.id,
      targetKeyword: topicData.targetKeyword,
      wordCount,
      published: true,
      heroImage: !!heroImageUrl,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("[SeedArticle] Handler error:", error);
    return res.status(500).json({ error: errMsg, timestamp: new Date().toISOString() });
  }
}
