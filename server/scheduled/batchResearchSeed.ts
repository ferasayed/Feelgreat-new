import type { Request, Response } from "express";
import { discoverResearchHandler } from "./discoverResearch";

// ============================================================
// BATCH RESEARCH SEED HANDLER
// Generates multiple research studies across all topic categories
// to ensure at least 3 studies per topic.
// ============================================================

const ALL_TOPICS = [
  "insulin resistance",
  "metabolic health",
  "gut health",
  "weight loss",
  "sleep quality",
  "inflammation",
  "nutrition",
  "mental health",
  "longevity",
  "diabetes",
  "microbiome",
  "women's health",
  "polyphenols",
  "fiber supplementation",
  "yerba mate",
  "intermittent fasting",
  "metabolic syndrome",
  "fatty liver",
  "gut-brain axis",
  "healthy aging",
  "stress management",
  "obesity",
  "chronic fatigue",
  "probiotics",
];

/**
 * This handler is designed to be called multiple times (via heartbeat or manually).
 * Each call processes ONE topic and generates 1 study for it.
 * The heartbeat runs every 2 hours, cycling through topics that need more studies.
 */
export async function batchResearchSeedHandler(req: Request, res: Response) {
  try {
    console.log("[BatchResearchSeed] Starting batch research seeding...");

    // Import DB helpers
    const { getExistingResearchDOIs, getPublishedResearch } = await import("../db");
    const { invokeLLM } = await import("../_core/llm");
    const { generateImage } = await import("../_core/imageGeneration");
    const { createResearchStudy } = await import("../db");

    // Get current topic distribution
    const allStudies = await getPublishedResearch(1000, 0);
    const topicCounts: Record<string, number> = {};
    
    for (const study of allStudies) {
      const topic = (study.primaryTopic || "").toLowerCase();
      // Map to our category system
      for (const t of ALL_TOPICS) {
        if (topic.includes(t) || t.includes(topic.split(" ")[0])) {
          topicCounts[t] = (topicCounts[t] || 0) + 1;
        }
      }
      // Also count exact matches
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }

    console.log(`[BatchResearchSeed] Current distribution:`, JSON.stringify(topicCounts));

    // Find topics with fewer than 3 studies
    const underservedTopics = ALL_TOPICS.filter(t => (topicCounts[t] || 0) < 3);
    
    if (underservedTopics.length === 0) {
      console.log("[BatchResearchSeed] All topics have 3+ studies. Picking random topic for growth.");
      // Pick a random topic for continued growth
      const randomTopic = ALL_TOPICS[Math.floor(Math.random() * ALL_TOPICS.length)];
      underservedTopics.push(randomTopic);
    }

    // Pick the topic with the fewest studies
    const targetTopic = underservedTopics.sort((a, b) => 
      (topicCounts[a] || 0) - (topicCounts[b] || 0)
    )[0];

    console.log(`[BatchResearchSeed] Target topic: "${targetTopic}" (current count: ${topicCounts[targetTopic] || 0})`);

    // Search PubMed for this specific topic
    const existingDOIs = await getExistingResearchDOIs();
    
    // Build search query optimized for this topic
    const searchQueries: Record<string, string> = {
      "insulin resistance": "insulin resistance metabolic syndrome 2024",
      "metabolic health": "metabolic health biomarkers lifestyle intervention",
      "gut health": "gut health intestinal barrier function 2024",
      "weight loss": "weight management obesity intervention clinical trial",
      "sleep quality": "sleep quality circadian rhythm health outcomes",
      "inflammation": "chronic inflammation anti-inflammatory nutrition",
      "nutrition": "nutritional intervention health outcomes randomized",
      "mental health": "mental health nutrition gut-brain axis",
      "longevity": "longevity healthy aging caloric restriction",
      "diabetes": "type 2 diabetes prevention lifestyle modification",
      "microbiome": "gut microbiome diversity health outcomes",
      "women's health": "women health hormonal balance nutrition",
      "polyphenols": "polyphenols antioxidant health benefits clinical",
      "fiber supplementation": "dietary fiber supplementation metabolic health",
      "yerba mate": "yerba mate ilex paraguariensis health benefits",
      "intermittent fasting": "intermittent fasting time-restricted eating health",
      "metabolic syndrome": "metabolic syndrome prevention treatment lifestyle",
      "fatty liver": "non-alcoholic fatty liver disease NAFLD nutrition",
      "gut-brain axis": "gut-brain axis mental health microbiome",
      "healthy aging": "healthy aging anti-aging nutrition exercise",
      "stress management": "stress management cortisol reduction techniques",
      "obesity": "obesity treatment prevention behavioral intervention",
      "chronic fatigue": "chronic fatigue syndrome energy metabolism",
      "probiotics": "probiotics gut health clinical trial outcomes",
    };

    const query = searchQueries[targetTopic] || targetTopic;
    
    // Search PubMed
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=10&sort=date&retmode=json&datetype=pdat&reldate=365`;
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(15000) });
    const searchData = await searchRes.json();
    
    const ids = searchData?.esearchresult?.idlist;
    if (!ids || ids.length === 0) {
      res.json({ ok: true, message: `No PubMed results for "${targetTopic}"`, topic: targetTopic });
      return;
    }

    // Fetch article details
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`;
    const fetchRes = await fetch(fetchUrl, { signal: AbortSignal.timeout(20000) });
    const xmlText = await fetchRes.text();

    // Parse articles
    const articleBlocks = xmlText.split("<PubmedArticle>");
    const articles: any[] = [];

    for (let i = 1; i < articleBlocks.length && i <= 10; i++) {
      const block = articleBlocks[i];
      const pmid = block.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1] || "";
      const title = block.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, "") || "";
      const abstractText = block.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)
        ?.map(t => t.replace(/<[^>]+>/g, ""))
        .join(" ") || "";
      const journal = block.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || "";
      const doi = block.match(/<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/)?.[1] || "";
      const authorMatches = block.match(/<LastName>([\s\S]*?)<\/LastName>/g) || [];
      const authors = authorMatches.slice(0, 5).map(a => a.replace(/<[^>]+>/g, "")).join(", ");
      const year = block.match(/<Year>(\d{4})<\/Year>/)?.[1] || new Date().getFullYear().toString();
      const month = block.match(/<Month>(\w+)<\/Month>/)?.[1] || "01";
      const day = block.match(/<Day>(\d+)<\/Day>/)?.[1] || "01";
      const monthNum = isNaN(Number(month)) ? 
        (["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(month.toLowerCase().slice(0,3)) + 1).toString().padStart(2, "0") : 
        month.padStart(2, "0");
      const publishDate = `${year}-${monthNum}-${day.padStart(2, "0")}`;

      if (title && abstractText.length > 100 && doi && !existingDOIs.includes(doi)) {
        articles.push({ pmid, title, abstract: abstractText, authors, journal, publishDate, doi, source: "PubMed" });
      }
    }

    if (articles.length === 0) {
      res.json({ ok: true, message: `All found studies for "${targetTopic}" already exist`, topic: targetTopic });
      return;
    }

    // Process the first new article
    const study = articles[0];
    console.log(`[BatchResearchSeed] Processing: "${study.title}"`);

    // AI Summarization - Phase 1
    const phase1Response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a scientific health communicator. Classify and summarize research studies. NEVER make therapeutic claims. Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: `Classify this study:

Title: ${study.title}
Journal: ${study.journal}
Authors: ${study.authors}
Published: ${study.publishDate}
Abstract: ${study.abstract.slice(0, 800)}

IMPORTANT: Map primaryTopic to one of these exact values: insulin resistance, metabolic health, gut health, weight loss, sleep, inflammation, nutrition, mental health, longevity, diabetes, microbiome, women's health

Return JSON:
{"titleEn":"short engaging title","titleAr":"عنوان عربي قصير","studyType":"meta-analysis|RCT|cohort|case-control|cross-sectional|animal|in-vitro|review","evidenceLevel":"high|moderate|low|preliminary","isPreliminary":false,"isHumanStudy":true,"participantCount":null,"university":"institution","primaryTopic":"${targetTopic}","topics":["${targetTopic}","t2"],"summary30sEn":"2 sentences","summary30sAr":"جملتان","summary1minEn":"4 sentences","summary1minAr":"4 جمل","keyFindings":[{"findingEn":"f1","findingAr":"ن1"},{"findingEn":"f2","findingAr":"ن2"}],"impactScore":7,"heroImagePrompt":"scientific illustration prompt","sourceInstitution":"PubMed"}`,
        },
      ],
    });

    const phase1Raw = phase1Response.choices?.[0]?.message?.content;
    if (!phase1Raw) throw new Error("Empty LLM response (phase 1)");
    
    let phase1: any;
    try {
      let cleaned = (typeof phase1Raw === "string" ? phase1Raw : JSON.stringify(phase1Raw))
        .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      phase1 = JSON.parse(cleaned);
    } catch (e) {
      throw new Error(`Failed to parse phase 1 JSON: ${(e as Error).message}`);
    }

    // AI Summarization - Phase 2
    const phase2Response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a scientific health communicator writing detailed analysis. NEVER make therapeutic claims. Use "may support", "suggests" language. Return ONLY valid JSON.`,
        },
        {
          role: "user",
          content: `Write detailed summaries for this ${phase1.studyType} study:

Title: ${study.title}
Journal: ${study.journal}
Abstract: ${study.abstract.slice(0, 800)}
Key findings: ${phase1.keyFindings?.map((f: any) => f.findingEn).join("; ")}

Return JSON:
{"summary3minEn":"200 word summary","summary3minAr":"ملخص 200 كلمة","fullAnalysisEn":"300 word analysis","fullAnalysisAr":"تحليل 300 كلمة","healthImplicationsEn":"100 words on daily habits","healthImplicationsAr":"100 كلمة عن الآثار الصحية","strengthsWeaknesses":{"strengths":["s1","s2"],"weaknesses":["w1","w2"]},"feelGreatConnection":"subtle connection to fiber/polyphenols/gut health if relevant","feelGreatConnectionAr":"ربط ذكي","metaTitleEn":"SEO title 60 chars","metaTitleAr":"عنوان 60 حرف","metaDescriptionEn":"SEO desc 155 chars","metaDescriptionAr":"وصف 155 حرف"}`,
        },
      ],
    });

    const phase2Raw = phase2Response.choices?.[0]?.message?.content;
    if (!phase2Raw) throw new Error("Empty LLM response (phase 2)");
    
    let phase2: any;
    try {
      let cleaned = (typeof phase2Raw === "string" ? phase2Raw : JSON.stringify(phase2Raw))
        .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
      phase2 = JSON.parse(cleaned);
    } catch (e) {
      throw new Error(`Failed to parse phase 2 JSON: ${(e as Error).message}`);
    }

    // Generate hero image
    let heroImageUrl: string | undefined;
    try {
      const { url } = await generateImage({
        prompt: `Scientific research illustration: ${phase1.heroImagePrompt}. Clean, modern, professional medical/science style. Abstract scientific visualization with soft blue and green tones. No text.`,
      });
      heroImageUrl = url;
    } catch (imgErr) {
      console.warn(`[BatchResearchSeed] Image generation failed, continuing without image`);
    }

    // Translate to additional languages
    let translations: any = {};
    try {
      const transResponse = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Translate research content to French (fr), Spanish (es), German (de), Turkish (tr). Keep brand names untranslated. Return ONLY valid JSON.`,
          },
          {
            role: "user",
            content: `Translate:
Title: ${phase1.titleEn}
30s summary: ${phase1.summary30sEn}
1min summary: ${phase1.summary1minEn}
3min summary: ${phase2.summary3minEn?.slice(0, 2000)}
Full analysis: ${phase2.fullAnalysisEn?.slice(0, 3000)}
Health implications: ${phase2.healthImplicationsEn}

Return JSON with keys: titleFr, titleEs, titleDe, titleTr, summary30sFr, summary30sEs, summary30sDe, summary30sTr, summary1minFr, summary1minEs, summary1minDe, summary1minTr, summary3minFr, summary3minEs, summary3minDe, summary3minTr, fullAnalysisFr, fullAnalysisEs, fullAnalysisDe, fullAnalysisTr, healthImplicationsFr, healthImplicationsEs, healthImplicationsDe, healthImplicationsTr`,
          },
        ],
      });
      const transRaw = transResponse.choices?.[0]?.message?.content;
      if (transRaw) {
        let cleaned = (typeof transRaw === "string" ? transRaw : JSON.stringify(transRaw))
          .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          cleaned = cleaned.slice(firstBrace, lastBrace + 1);
        }
        translations = JSON.parse(cleaned);
      }
    } catch (transErr) {
      console.warn(`[BatchResearchSeed] Translation failed (non-blocking)`);
    }

    // Create slug
    const slug = phase1.titleEn
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .slice(0, 120);

    // Save to database
    await createResearchStudy({
      slug,
      originalTitle: study.title,
      doi: study.doi,
      pubmedId: study.pmid,
      sourceUrl: study.doi ? `https://doi.org/${study.doi}` : `https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`,
      journal: study.journal,
      university: phase1.university || phase1.sourceInstitution || "PubMed",
      authors: study.authors,
      publishDate: study.publishDate as unknown as Date,
      studyType: phase1.studyType,
      evidenceLevel: phase1.evidenceLevel,
      participantCount: phase1.participantCount,
      isPreliminary: phase1.isPreliminary || false,
      isHumanStudy: phase1.isHumanStudy !== false,
      primaryTopic: phase1.primaryTopic || targetTopic,
      topics: phase1.topics || [targetTopic],
      titleAr: phase1.titleAr,
      titleEn: phase1.titleEn,
      summary30sAr: phase1.summary30sAr,
      summary30sEn: phase1.summary30sEn,
      summary1minAr: phase1.summary1minAr,
      summary1minEn: phase1.summary1minEn,
      summary3minAr: phase2.summary3minAr,
      summary3minEn: phase2.summary3minEn,
      fullAnalysisAr: phase2.fullAnalysisAr,
      fullAnalysisEn: phase2.fullAnalysisEn,
      healthImplicationsAr: phase2.healthImplicationsAr,
      healthImplicationsEn: phase2.healthImplicationsEn,
      keyFindings: phase1.keyFindings,
      strengthsWeaknesses: phase2.strengthsWeaknesses,
      feelGreatConnection: phase2.feelGreatConnection || null,
      feelGreatConnectionAr: phase2.feelGreatConnectionAr || null,
      metaTitleEn: phase2.metaTitleEn,
      metaTitleAr: phase2.metaTitleAr,
      metaDescriptionEn: phase2.metaDescriptionEn,
      metaDescriptionAr: phase2.metaDescriptionAr,
      heroImageUrl: heroImageUrl || null,
      impactScore: phase1.impactScore || 5,
      titleFr: translations.titleFr || null,
      titleEs: translations.titleEs || null,
      titleDe: translations.titleDe || null,
      titleTr: translations.titleTr || null,
      summary30sFr: translations.summary30sFr || null,
      summary30sEs: translations.summary30sEs || null,
      summary30sDe: translations.summary30sDe || null,
      summary30sTr: translations.summary30sTr || null,
      summary1minFr: translations.summary1minFr || null,
      summary1minEs: translations.summary1minEs || null,
      summary1minDe: translations.summary1minDe || null,
      summary1minTr: translations.summary1minTr || null,
      summary3minFr: translations.summary3minFr || null,
      summary3minEs: translations.summary3minEs || null,
      summary3minDe: translations.summary3minDe || null,
      summary3minTr: translations.summary3minTr || null,
      fullAnalysisFr: translations.fullAnalysisFr || null,
      fullAnalysisEs: translations.fullAnalysisEs || null,
      fullAnalysisDe: translations.fullAnalysisDe || null,
      fullAnalysisTr: translations.fullAnalysisTr || null,
      healthImplicationsFr: translations.healthImplicationsFr || null,
      healthImplicationsEs: translations.healthImplicationsEs || null,
      healthImplicationsDe: translations.healthImplicationsDe || null,
      healthImplicationsTr: translations.healthImplicationsTr || null,
      isPublished: true,
    });

    console.log(`[BatchResearchSeed] ✅ Study saved: ${slug} (topic: ${phase1.primaryTopic || targetTopic})`);

    // Ping IndexNow
    try {
      const { notifyNewResearch } = await import("../seo/indexing");
      await notifyNewResearch(slug);
    } catch (e) {
      console.warn("[BatchResearchSeed] IndexNow ping failed (non-blocking)");
    }

    // Notify owner
    try {
      const { notifyOwner } = await import("../_core/notification");
      await notifyOwner({
        title: "🔬 دراسة جديدة: " + (phase1.titleAr || phase1.titleEn),
        content: `تم توليد دراسة جديدة في موضوع "${targetTopic}".\n\nالعنوان: ${phase1.titleEn}\nالمجلة: ${study.journal}\nمستوى الدليل: ${phase1.evidenceLevel}\n\nالرابط: /research/${slug}`,
      });
    } catch (e) {
      console.warn("[BatchResearchSeed] Notification failed (non-blocking)");
    }

    res.json({
      ok: true,
      slug,
      titleEn: phase1.titleEn,
      titleAr: phase1.titleAr,
      topic: phase1.primaryTopic || targetTopic,
      evidenceLevel: phase1.evidenceLevel,
      studyType: phase1.studyType,
      journal: study.journal,
      remainingUnderserved: underservedTopics.length - 1,
    });
  } catch (error: any) {
    console.error("[BatchResearchSeed] Error:", error?.message || error);
    res.status(500).json({ ok: false, error: error?.message || "Unknown error" });
  }
}
