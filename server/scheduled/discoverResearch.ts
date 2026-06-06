import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
import { createResearchStudy, getExistingResearchDOIs } from "../db";
import type { Request, Response } from "express";

// ============================================================
// RESEARCH TOPICS TO MONITOR
// ============================================================
const RESEARCH_TOPICS = [
  "insulin resistance", "prediabetes", "type 2 diabetes",
  "gut health", "microbiome", "inflammation",
  "weight loss", "obesity", "sleep quality",
  "longevity", "metabolic health", "behavior change",
  "healthy aging", "nutrition", "mental health",
  "stress management", "women's health", "fiber supplementation",
  "polyphenols", "yerba mate", "intermittent fasting",
  "metabolic syndrome", "fatty liver", "NAFLD",
  "chronic fatigue", "gut-brain axis", "probiotics",
];

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 120);
}

function robustJsonParse(raw: string): any {
  try { return JSON.parse(raw); } catch (e) { /* continue */ }
  
  let cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
  try { return JSON.parse(cleaned); } catch (e) { /* continue */ }
  
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace === -1) {
    const firstBracket = cleaned.indexOf("[");
    if (firstBracket !== -1) {
      const lastBracket = cleaned.lastIndexOf("]");
      if (lastBracket > firstBracket) {
        try { return JSON.parse(cleaned.slice(firstBracket, lastBracket + 1)); } catch (e) { /* continue */ }
      }
    }
    throw new Error(`No JSON found (length: ${raw.length})`);
  }
  
  const lastBrace = cleaned.lastIndexOf("}");
  if (lastBrace > firstBrace) {
    const extracted = cleaned.slice(firstBrace, lastBrace + 1);
    try { return JSON.parse(extracted); } catch (e) { /* continue */ }
  }
  
  // Truncated JSON recovery
  let truncated = cleaned.slice(firstBrace);
  const lastQuote = truncated.lastIndexOf('"');
  if (lastQuote > 0) {
    let candidate = truncated.slice(0, lastQuote + 1);
    const ob = (candidate.match(/\[/g) || []).length - (candidate.match(/\]/g) || []).length;
    const oc = (candidate.match(/\{/g) || []).length - (candidate.match(/\}/g) || []).length;
    for (let i = 0; i < ob; i++) candidate += "]";
    for (let i = 0; i < oc; i++) candidate += "}";
    try { return JSON.parse(candidate); } catch (e) { /* continue */ }
  }
  
  throw new Error(`Failed to parse JSON (length: ${raw.length})`);
}

// ============================================================
// PUBMED API INTEGRATION
// ============================================================

async function searchPubMed(query: string, maxResults = 5): Promise<Array<{
  pmid: string;
  title: string;
  abstract: string;
  authors: string;
  journal: string;
  publishDate: string;
  doi: string;
}>> {
  try {
    // Search PubMed for recent articles
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&sort=date&retmode=json&datetype=pdat&reldate=90`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    const ids = searchData?.esearchresult?.idlist;
    if (!ids || ids.length === 0) return [];
    
    // Fetch details for found articles
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`;
    const fetchRes = await fetch(fetchUrl);
    const xmlText = await fetchRes.text();
    
    // Parse XML to extract key fields
    const articles: Array<{
      pmid: string;
      title: string;
      abstract: string;
      authors: string;
      journal: string;
      publishDate: string;
      doi: string;
    }> = [];
    
    // Simple XML parsing for PubMed articles
    const articleBlocks = xmlText.split("<PubmedArticle>");
    for (let i = 1; i < articleBlocks.length && i <= maxResults; i++) {
      const block = articleBlocks[i];
      
      const pmid = block.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1] || "";
      const title = block.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/)?.[1]?.replace(/<[^>]+>/g, "") || "";
      const abstractText = block.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g)
        ?.map(t => t.replace(/<[^>]+>/g, ""))
        .join(" ") || "";
      const journal = block.match(/<Title>([\s\S]*?)<\/Title>/)?.[1] || "";
      const doi = block.match(/<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/)?.[1] || "";
      
      // Extract authors
      const authorMatches = block.match(/<LastName>([\s\S]*?)<\/LastName>/g) || [];
      const authors = authorMatches.slice(0, 5).map(a => a.replace(/<[^>]+>/g, "")).join(", ");
      
      // Extract date
      const year = block.match(/<Year>(\d{4})<\/Year>/)?.[1] || new Date().getFullYear().toString();
      const month = block.match(/<Month>(\w+)<\/Month>/)?.[1] || "01";
      const day = block.match(/<Day>(\d+)<\/Day>/)?.[1] || "01";
      const monthNum = isNaN(Number(month)) ? 
        (["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(month.toLowerCase().slice(0,3)) + 1).toString().padStart(2, "0") : 
        month.padStart(2, "0");
      const publishDate = `${year}-${monthNum}-${day.padStart(2, "0")}`;
      
      if (title && (abstractText.length > 100 || title.length > 20)) {
        articles.push({ pmid, title, abstract: abstractText, authors, journal, publishDate, doi });
      }
    }
    
    return articles;
  } catch (error) {
    console.error(`[ResearchDiscovery] PubMed search error for "${query}":`, error);
    return [];
  }
}

// ============================================================
// AI SUMMARIZATION (Two-phase approach to avoid token limits)
// ============================================================

async function summarizeStudyPhase1(study: {
  title: string;
  abstract: string;
  journal: string;
  authors: string;
  doi: string;
  publishDate: string;
}): Promise<any> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a scientific health communicator. Classify and briefly summarize research studies. NEVER make therapeutic claims. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Classify and create short summaries for this study:

Title: ${study.title}
Journal: ${study.journal}
Authors: ${study.authors}
Published: ${study.publishDate}
Abstract: ${study.abstract.slice(0, 800)}

Return JSON:
{"titleEn":"short engaging title","titleAr":"عنوان عربي قصير","studyType":"meta-analysis|RCT|cohort|case-control|cross-sectional|animal|in-vitro|review","evidenceLevel":"high|moderate|low|preliminary","isPreliminary":false,"isHumanStudy":true,"participantCount":null,"university":"institution or null","primaryTopic":"main topic","topics":["t1","t2"],"summary30sEn":"2 sentences","summary30sAr":"جملتان","summary1minEn":"4 sentences","summary1minAr":"4 جمل","keyFindings":[{"findingEn":"f1","findingAr":"ن1"}],"impactScore":5,"heroImagePrompt":"scientific illustration prompt"}`,
      },
    ],
  });
  const raw = response.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty LLM response (phase 1)");
  return robustJsonParse(typeof raw === "string" ? raw : JSON.stringify(raw));
}

async function summarizeStudyPhase2(study: {
  title: string;
  abstract: string;
  journal: string;
}, phase1: any): Promise<any> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a scientific health communicator writing detailed analysis. NEVER make therapeutic claims. Use "may support", "suggests" language. If animal/cell study, state it clearly. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Write detailed summaries for this ${phase1.studyType} study:

Title: ${study.title}
Journal: ${study.journal}
Abstract: ${study.abstract.slice(0, 800)}
Key findings: ${phase1.keyFindings?.map((f: any) => f.findingEn).join("; ")}

Return JSON:
{"summary3minEn":"200 word summary with context","summary3minAr":"ملخص 200 كلمة مع السياق","fullAnalysisEn":"300 word analysis: discovery, importance, application, limitations","fullAnalysisAr":"تحليل 300 كلمة","healthImplicationsEn":"100 words connecting to daily habits","healthImplicationsAr":"100 كلمة عن الآثار الصحية اليومية","strengthsWeaknesses":{"strengths":["s1","s2"],"weaknesses":["w1","w2"]},"feelGreatConnection":"subtle connection to fiber/polyphenols/gut health if relevant, else empty","feelGreatConnectionAr":"ربط ذكي بالألياف/البوليفينولات/صحة الأمعاء إن كان مناسباً","metaTitleEn":"SEO title 60 chars","metaTitleAr":"عنوان 60 حرف","metaDescriptionEn":"SEO desc 155 chars","metaDescriptionAr":"وصف 155 حرف"}`,
      },
    ],
  });
  const raw = response.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty LLM response (phase 2)");
  return robustJsonParse(typeof raw === "string" ? raw : JSON.stringify(raw));
}

async function summarizeStudy(study: {
  title: string;
  abstract: string;
  journal: string;
  authors: string;
  doi: string;
  publishDate: string;
}): Promise<any> {
  // Phase 1: Classification + short summaries
  const phase1 = await summarizeStudyPhase1(study);
  console.log(`[ResearchDiscovery] Phase 1 complete: "${phase1.titleEn}"`);
  
  // Phase 2: Detailed analysis
  const phase2 = await summarizeStudyPhase2(study, phase1);
  console.log(`[ResearchDiscovery] Phase 2 complete`);
  
  // Merge results
  return { ...phase1, ...phase2 };
}

// ============================================================
// MAIN DISCOVERY HANDLER
// ============================================================

export async function discoverResearchHandler(req: Request, res: Response) {
  try {
    console.log("[ResearchDiscovery] Starting research discovery...");
    
    // Get existing DOIs to avoid duplicates
    const existingDOIs = await getExistingResearchDOIs();
    console.log(`[ResearchDiscovery] ${existingDOIs.length} existing studies in database`);
    
    // Pick a random topic to search
    const topic = RESEARCH_TOPICS[Math.floor(Math.random() * RESEARCH_TOPICS.length)];
    console.log(`[ResearchDiscovery] Searching PubMed for: "${topic}"`);
    
    // Search PubMed
    const results = await searchPubMed(topic, 5);
    console.log(`[ResearchDiscovery] Found ${results.length} results from PubMed`);
    
    if (results.length === 0) {
      res.json({ ok: true, message: "No new studies found", topic });
      return;
    }
    
    // Filter out already-processed studies
    const newStudies = results.filter(r => !existingDOIs.includes(r.doi) && r.doi);
    console.log(`[ResearchDiscovery] ${newStudies.length} new studies to process`);
    
    if (newStudies.length === 0) {
      res.json({ ok: true, message: "All found studies already processed", topic });
      return;
    }
    
    // Process the first new study
    const study = newStudies[0];
    console.log(`[ResearchDiscovery] Processing: "${study.title}"`);
    
    // AI Summarization with retry
    let summary: any;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        summary = await summarizeStudy(study);
        console.log(`[ResearchDiscovery] Summary generated: "${summary.titleEn}"`);
        break;
      } catch (err: any) {
        console.warn(`[ResearchDiscovery] Summarization attempt ${attempt}/3 failed: ${err.message}`);
        if (attempt === 3) throw err;
        await new Promise(r => setTimeout(r, 2000 * attempt));
      }
    }
    
    // Generate hero image
    let heroImageUrl: string | undefined;
    try {
      const { url } = await generateImage({
        prompt: `Scientific research illustration: ${summary.heroImagePrompt}. Clean, modern, professional medical/science style. Abstract scientific visualization with soft blue and green tones. No text.`,
      });
      heroImageUrl = url;
      console.log(`[ResearchDiscovery] Hero image generated`);
    } catch (imgErr) {
      console.warn(`[ResearchDiscovery] Image generation failed, continuing without image`);
    }
    
    // Create slug
    const slug = slugify(summary.titleEn);
    
    // Save to database
    await createResearchStudy({
      slug,
      originalTitle: study.title,
      doi: study.doi,
      pubmedId: study.pmid,
      sourceUrl: study.doi ? `https://doi.org/${study.doi}` : `https://pubmed.ncbi.nlm.nih.gov/${study.pmid}/`,
      journal: study.journal,
      university: summary.university || null,
      authors: study.authors,
      publishDate: study.publishDate as unknown as Date,
      studyType: summary.studyType,
      evidenceLevel: summary.evidenceLevel,
      participantCount: summary.participantCount,
      isPreliminary: summary.isPreliminary,
      isHumanStudy: summary.isHumanStudy,
      primaryTopic: summary.primaryTopic,
      topics: summary.topics,
      titleAr: summary.titleAr,
      titleEn: summary.titleEn,
      summary30sAr: summary.summary30sAr,
      summary30sEn: summary.summary30sEn,
      summary1minAr: summary.summary1minAr,
      summary1minEn: summary.summary1minEn,
      summary3minAr: summary.summary3minAr,
      summary3minEn: summary.summary3minEn,
      fullAnalysisAr: summary.fullAnalysisAr,
      fullAnalysisEn: summary.fullAnalysisEn,
      healthImplicationsAr: summary.healthImplicationsAr,
      healthImplicationsEn: summary.healthImplicationsEn,
      keyFindings: summary.keyFindings,
      strengthsWeaknesses: summary.strengthsWeaknesses,
      feelGreatConnection: summary.feelGreatConnection || null,
      feelGreatConnectionAr: summary.feelGreatConnectionAr || null,
      metaTitleEn: summary.metaTitleEn,
      metaTitleAr: summary.metaTitleAr,
      metaDescriptionEn: summary.metaDescriptionEn,
      metaDescriptionAr: summary.metaDescriptionAr,
      heroImageUrl: heroImageUrl || null,
      impactScore: summary.impactScore || 5,
      isPublished: true,
    });
    
    console.log(`[ResearchDiscovery] ✅ Study saved: ${slug}`);
    
    res.json({
      ok: true,
      slug,
      titleEn: summary.titleEn,
      titleAr: summary.titleAr,
      topic: summary.primaryTopic,
      evidenceLevel: summary.evidenceLevel,
      studyType: summary.studyType,
      isPreliminary: summary.isPreliminary,
      journal: study.journal,
    });
  } catch (error: any) {
    console.error("[ResearchDiscovery] Handler error:", error?.message || error);
    res.status(500).json({ ok: false, error: error?.message || "Unknown error" });
  }
}
