/**
 * Auto-Translation Handler
 * Finds articles and research studies missing translations in any of the 6 languages
 * and translates them using LLM.
 * Runs daily to ensure all content is available in: ar, en, fr, es, de, tr
 */
import type { Request, Response } from "express";
import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { blogArticles, researchStudies } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";

const LANGUAGES = ["fr", "es", "de", "tr"] as const;
type TargetLang = (typeof LANGUAGES)[number];

const LANG_NAMES: Record<TargetLang, string> = {
  fr: "French",
  es: "Spanish",
  de: "German",
  tr: "Turkish",
};

// Max items to translate per run to avoid timeout
const MAX_ARTICLES_PER_RUN = 5;
const MAX_RESEARCH_PER_RUN = 3;

/**
 * Translate text using LLM
 */
async function translateText(
  text: string,
  targetLang: TargetLang,
  context: string = "health and wellness"
): Promise<string> {
  if (!text || text.trim().length === 0) return "";

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a professional translator specializing in ${context} content. Translate the following text to ${LANG_NAMES[targetLang]}. Keep the same formatting (markdown, HTML tags, etc). Only output the translation, nothing else. Do not add explanations or notes.`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  const rawContent = response.choices?.[0]?.message?.content;
  return (typeof rawContent === "string" ? rawContent.trim() : "");
}

/**
 * Translate an article's fields to a target language
 */
async function translateArticle(
  article: { id: number; titleEn: string; excerptEn: string; contentEn: string; titleAr: string; excerptAr: string; contentAr: string },
  lang: TargetLang
): Promise<{ title: string; excerpt: string; content: string }> {
  // Use English as source (more reliable for translation)
  const sourceTitle = article.titleEn || article.titleAr;
  const sourceExcerpt = article.excerptEn || article.excerptAr;
  const sourceContent = article.contentEn || article.contentAr;

  const title = await translateText(sourceTitle, lang, "health article title");
  const excerpt = await translateText(sourceExcerpt, lang, "health article excerpt");
  
  // For content, split into chunks if too long (>4000 chars) to avoid truncation
  let content = "";
  if (sourceContent.length > 4000) {
    const chunks = splitIntoChunks(sourceContent, 3500);
    const translatedChunks: string[] = [];
    for (const chunk of chunks) {
      const translated = await translateText(chunk, lang, "health and wellness blog article");
      translatedChunks.push(translated);
    }
    content = translatedChunks.join("\n\n");
  } else {
    content = await translateText(sourceContent, lang, "health and wellness blog article");
  }

  return { title, excerpt, content };
}

/**
 * Translate a research study's fields to a target language
 */
async function translateResearch(
  study: {
    id: number;
    titleEn: string; summary30sEn: string; summary1minEn: string;
    summary3minEn: string; fullAnalysisEn: string; healthImplicationsEn: string;
  },
  lang: TargetLang
): Promise<{
  title: string; summary30s: string; summary1min: string;
  summary3min: string; fullAnalysis: string; healthImplications: string;
}> {
  const title = await translateText(study.titleEn, lang, "scientific research title");
  const summary30s = await translateText(study.summary30sEn, lang, "scientific research summary");
  const summary1min = await translateText(study.summary1minEn, lang, "scientific research summary");
  const summary3min = await translateText(study.summary3minEn, lang, "scientific research analysis");
  
  // Full analysis may be long
  let fullAnalysis = "";
  if (study.fullAnalysisEn && study.fullAnalysisEn.length > 4000) {
    const chunks = splitIntoChunks(study.fullAnalysisEn, 3500);
    const translatedChunks: string[] = [];
    for (const chunk of chunks) {
      const translated = await translateText(chunk, lang, "scientific research analysis");
      translatedChunks.push(translated);
    }
    fullAnalysis = translatedChunks.join("\n\n");
  } else {
    fullAnalysis = await translateText(study.fullAnalysisEn || "", lang, "scientific research analysis");
  }

  const healthImplications = await translateText(study.healthImplicationsEn || "", lang, "health implications of scientific research");

  return { title, summary30s, summary1min, summary3min, fullAnalysis, healthImplications };
}

/**
 * Split text into chunks at paragraph boundaries
 */
function splitIntoChunks(text: string, maxChunkSize: number): string[] {
  const paragraphs = text.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if (current.length + para.length + 2 > maxChunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

/**
 * Find articles missing translations
 */
async function findUntranslatedArticles(lang: TargetLang, limit: number) {
  const db = (await getDb())!;
  const titleCol = `title_${lang}`;
  const result = await db
    .select({
      id: blogArticles.id,
      titleEn: blogArticles.titleEn,
      titleAr: blogArticles.titleAr,
      excerptEn: blogArticles.excerptEn,
      excerptAr: blogArticles.excerptAr,
      contentEn: blogArticles.contentEn,
      contentAr: blogArticles.contentAr,
    })
    .from(blogArticles)
    .where(
      sql`${sql.raw(titleCol)} IS NULL AND is_published = 1`
    )
    .limit(limit);
  return result;
}

/**
 * Find research studies missing translations
 */
async function findUntranslatedResearch(lang: TargetLang, limit: number) {
  const db = (await getDb())!;
  const titleCol = `title_${lang}`;
  const result = await db
    .select({
      id: researchStudies.id,
      titleEn: researchStudies.titleEn,
      summary30sEn: researchStudies.summary30sEn,
      summary1minEn: researchStudies.summary1minEn,
      summary3minEn: researchStudies.summary3minEn,
      fullAnalysisEn: researchStudies.fullAnalysisEn,
      healthImplicationsEn: researchStudies.healthImplicationsEn,
    })
    .from(researchStudies)
    .where(
      sql`${sql.raw(titleCol)} IS NULL AND is_published = 1`
    )
    .limit(limit);
  return result;
}

/**
 * Main handler
 */
export async function handleTranslateContent(req: Request, res: Response) {
  // Auth check
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.BUILT_IN_FORGE_API_KEY;
  if (!authHeader || !authHeader.includes(expectedToken || "NONE")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const startTime = Date.now();
  const results: { articles: Record<string, number>; research: Record<string, number>; errors: string[] } = {
    articles: {},
    research: {},
    errors: [],
  };

  try {
    // Process each language
    for (const lang of LANGUAGES) {
      let articlesTranslated = 0;
      let researchTranslated = 0;

      // Translate articles
      try {
        const untranslatedArticles = await findUntranslatedArticles(lang, MAX_ARTICLES_PER_RUN);
        
        for (const article of untranslatedArticles) {
          try {
            const translated = await translateArticle(article, lang);
            
            // Update database
            const db = (await getDb())!;
            await db
              .update(blogArticles)
              .set({
                [`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.title,
                [`excerpt${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.excerpt,
                [`content${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.content,
              } as any)
              .where(eq(blogArticles.id, article.id));

            articlesTranslated++;
          } catch (err: any) {
            results.errors.push(`Article ${article.id} → ${lang}: ${err.message}`);
          }

          // Check time limit (4 minutes max per run)
          if (Date.now() - startTime > 240000) break;
        }
      } catch (err: any) {
        results.errors.push(`Articles query ${lang}: ${err.message}`);
      }

      // Translate research
      try {
        const untranslatedResearch = await findUntranslatedResearch(lang, MAX_RESEARCH_PER_RUN);
        
        for (const study of untranslatedResearch) {
          try {
            const translated = await translateResearch(study, lang);
            
            // Update database
            const dbConn = (await getDb())!;
            await dbConn
              .update(researchStudies)
              .set({
                [`title${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.title,
                [`summary30s${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.summary30s,
                [`summary1min${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.summary1min,
                [`summary3min${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.summary3min,
                [`fullAnalysis${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.fullAnalysis,
                [`healthImplications${lang.charAt(0).toUpperCase() + lang.slice(1)}`]: translated.healthImplications,
              } as any)
              .where(eq(researchStudies.id, study.id));

            researchTranslated++;
          } catch (err: any) {
            results.errors.push(`Research ${study.id} → ${lang}: ${err.message}`);
          }

          // Check time limit
          if (Date.now() - startTime > 240000) break;
        }
      } catch (err: any) {
        results.errors.push(`Research query ${lang}: ${err.message}`);
      }

      results.articles[lang] = articlesTranslated;
      results.research[lang] = researchTranslated;

      // Check time limit
      if (Date.now() - startTime > 240000) break;
    }

    const totalArticles = Object.values(results.articles).reduce((a, b) => a + b, 0);
    const totalResearch = Object.values(results.research).reduce((a, b) => a + b, 0);
    const elapsed = Math.round((Date.now() - startTime) / 1000);

    return res.json({
      success: true,
      message: `Translated ${totalArticles} articles and ${totalResearch} research studies in ${elapsed}s`,
      details: results,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message,
      details: results,
    });
  }
}
