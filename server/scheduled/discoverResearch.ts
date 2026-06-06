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
// MULTI-SOURCE CONFIGURATION
// ============================================================
interface ResearchSource {
  name: string;
  type: "pubmed" | "rss" | "api";
  baseUrl: string;
  journalFilter?: string;
}

const RESEARCH_SOURCES: ResearchSource[] = [
  // PubMed/NCBI (primary - covers NIH, NCBI, and most journals)
  { name: "PubMed", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils" },
  // Nature journals via PubMed filter
  { name: "Nature", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Nature[Journal]" },
  // The Lancet via PubMed filter
  { name: "The Lancet", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Lancet[Journal]" },
  // JAMA via PubMed filter
  { name: "JAMA", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "JAMA[Journal]" },
  // BMJ via PubMed filter
  { name: "BMJ", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "BMJ[Journal]" },
  // Science via PubMed filter
  { name: "Science", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Science[Journal]" },
  // Cell via PubMed filter
  { name: "Cell", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Cell[Journal]" },
  // Harvard Health via PubMed affiliation filter
  { name: "Harvard", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Harvard[Affiliation]" },
  // Mayo Clinic via PubMed affiliation filter
  { name: "Mayo Clinic", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Mayo Clinic[Affiliation]" },
  // Cleveland Clinic via PubMed affiliation filter
  { name: "Cleveland Clinic", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Cleveland Clinic[Affiliation]" },
  // Stanford via PubMed affiliation filter
  { name: "Stanford", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Stanford[Affiliation]" },
  // Johns Hopkins via PubMed affiliation filter
  { name: "Johns Hopkins", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Johns Hopkins[Affiliation]" },
  // Oxford via PubMed affiliation filter
  { name: "Oxford", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Oxford[Affiliation]" },
  // American Diabetes Association
  { name: "ADA", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Diabetes Care[Journal]" },
  // American Heart Association
  { name: "AHA", type: "pubmed", baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils", journalFilter: "Circulation[Journal]" },
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
// MULTI-SOURCE PUBMED SEARCH
// ============================================================

interface PubMedResult {
  pmid: string;
  title: string;
  abstract: string;
  authors: string;
  journal: string;
  publishDate: string;
  doi: string;
  source: string; // Which source found this
}

async function searchPubMedWithSource(
  query: string,
  source: ResearchSource,
  maxResults = 5
): Promise<PubMedResult[]> {
  try {
    // Build search query with optional journal/affiliation filter
    let searchQuery = query;
    if (source.journalFilter) {
      searchQuery = `(${query}) AND ${source.journalFilter}`;
    }

    const searchUrl = `${source.baseUrl}/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchQuery)}&retmax=${maxResults}&sort=date&retmode=json&datetype=pdat&reldate=90`;
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(15000) });
    const searchData = await searchRes.json();
    
    const ids = searchData?.esearchresult?.idlist;
    if (!ids || ids.length === 0) return [];
    
    // Fetch details for found articles
    const fetchUrl = `${source.baseUrl}/efetch.fcgi?db=pubmed&id=${ids.join(",")}&retmode=xml`;
    const fetchRes = await fetch(fetchUrl, { signal: AbortSignal.timeout(20000) });
    const xmlText = await fetchRes.text();
    
    // Parse XML to extract key fields
    const articles: PubMedResult[] = [];
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
        articles.push({ pmid, title, abstract: abstractText, authors, journal, publishDate, doi, source: source.name });
      }
    }
    
    return articles;
  } catch (error) {
    console.error(`[ResearchDiscovery] ${source.name} search error for "${query}":`, error);
    return [];
  }
}

/**
 * Search across multiple sources for a given topic.
 * Rotates through sources to ensure diversity.
 */
async function searchMultipleSources(topic: string): Promise<PubMedResult[]> {
  // Pick 3-4 random sources to query (to avoid rate limiting)
  const shuffled = [...RESEARCH_SOURCES].sort(() => Math.random() - 0.5);
  const selectedSources = shuffled.slice(0, 4);
  
  console.log(`[ResearchDiscovery] Searching ${selectedSources.length} sources: ${selectedSources.map(s => s.name).join(", ")}`);
  
  const allResults: PubMedResult[] = [];
  
  for (const source of selectedSources) {
    try {
      const results = await searchPubMedWithSource(topic, source, 3);
      allResults.push(...results);
      console.log(`[ResearchDiscovery] ${source.name}: found ${results.length} results`);
      // Small delay between requests to be polite to NCBI
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.warn(`[ResearchDiscovery] ${source.name} failed, continuing...`);
    }
  }
  
  // Deduplicate by DOI
  const seen = new Set<string>();
  const unique = allResults.filter(r => {
    if (!r.doi || seen.has(r.doi)) return false;
    seen.add(r.doi);
    return true;
  });
  
  return unique;
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
  source: string;
}): Promise<any> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a scientific health communicator. Classify and briefly summarize research studies. NEVER make therapeutic claims. If the study is a press release, animal study, or in-vitro study only, you MUST flag it clearly. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Classify and create short summaries for this study:

Title: ${study.title}
Journal: ${study.journal}
Authors: ${study.authors}
Published: ${study.publishDate}
Source: ${study.source}
Abstract: ${study.abstract.slice(0, 800)}

IMPORTANT RULES:
- If this is an animal study or cell/in-vitro study, set isPreliminary=true and isHumanStudy=false
- If this is a press release without peer review, set evidenceLevel="preliminary"
- NEVER present preliminary findings as proven facts on humans

Return JSON:
{"titleEn":"short engaging title","titleAr":"عنوان عربي قصير","studyType":"meta-analysis|RCT|cohort|case-control|cross-sectional|animal|in-vitro|review|press-release","evidenceLevel":"high|moderate|low|preliminary","isPreliminary":false,"isHumanStudy":true,"participantCount":null,"university":"institution or null","primaryTopic":"main topic","topics":["t1","t2"],"summary30sEn":"2 sentences","summary30sAr":"جملتان","summary1minEn":"4 sentences","summary1minAr":"4 جمل","keyFindings":[{"findingEn":"f1","findingAr":"ن1"}],"impactScore":5,"heroImagePrompt":"scientific illustration prompt","sourceInstitution":"${study.source}"}`,
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
  source: string;
}, phase1: any): Promise<any> {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: `You are a scientific health communicator writing detailed analysis. NEVER make therapeutic claims. Use "may support", "suggests" language. If animal/cell study, state it clearly. If press release or preliminary, explicitly warn the reader. Return ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Write detailed summaries for this ${phase1.studyType} study:

Title: ${study.title}
Journal: ${study.journal}
Source: ${study.source}
Abstract: ${study.abstract.slice(0, 800)}
Key findings: ${phase1.keyFindings?.map((f: any) => f.findingEn).join("; ")}
Is Preliminary: ${phase1.isPreliminary}
Is Human Study: ${phase1.isHumanStudy}

IMPORTANT: If isPreliminary=true or isHumanStudy=false, you MUST include a clear disclaimer in the summaries stating this is NOT proven in humans yet.

Return JSON:
{"summary3minEn":"200 word summary with context","summary3minAr":"ملخص 200 كلمة مع السياق","fullAnalysisEn":"300 word analysis: discovery, importance, application, limitations","fullAnalysisAr":"تحليل 300 كلمة","healthImplicationsEn":"100 words connecting to daily habits","healthImplicationsAr":"100 كلمة عن الآثار الصحية اليومية","strengthsWeaknesses":{"strengths":["s1","s2"],"weaknesses":["w1","w2"]},"feelGreatConnection":"subtle connection to fiber/polyphenols/gut health if relevant, else empty","feelGreatConnectionAr":"ربط ذكي بالألياف/البوليفينولات/صحة الأمعاء إن كان مناسباً","metaTitleEn":"SEO title 60 chars","metaTitleAr":"عنوان 60 حرف","metaDescriptionEn":"SEO desc 155 chars","metaDescriptionAr":"وصف 155 حرف","preliminaryDisclaimer":"${phase1.isPreliminary || !phase1.isHumanStudy ? 'This study was conducted on animals/cells and has not been replicated in humans. Results should be interpreted with caution.' : ''}","preliminaryDisclaimerAr":"${phase1.isPreliminary || !phase1.isHumanStudy ? 'هذه الدراسة أُجريت على حيوانات/خلايا ولم تُكرر على البشر. يجب تفسير النتائج بحذر.' : ''}"}`,
      },
    ],
  });
  const raw = response.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Empty LLM response (phase 2)");
  return robustJsonParse(typeof raw === "string" ? raw : JSON.stringify(raw));
}

async function summarizeStudy(study: PubMedResult): Promise<any> {
  // Phase 1: Classification + short summaries
  const phase1 = await summarizeStudyPhase1(study);
  console.log(`[ResearchDiscovery] Phase 1 complete: "${phase1.titleEn}" [${phase1.studyType}] [${phase1.evidenceLevel}]`);
  
  // Phase 2: Detailed analysis
  const phase2 = await summarizeStudyPhase2(study, phase1);
  console.log(`[ResearchDiscovery] Phase 2 complete`);
  
  // Merge results
  return { ...phase1, ...phase2 };
}

// ============================================================
// INDEXNOW PING FOR RESEARCH ARTICLES
// ============================================================
async function pingIndexNowResearch(slug: string): Promise<void> {
  const baseUrl = "https://feelgreat.us.com";
  const articleUrl = `${baseUrl}/research/${slug}`;
  const key = "feelgreat-indexnow-2026";

  try {
    await fetch(`https://api.indexnow.org/indexnow?url=${encodeURIComponent(articleUrl)}&key=${key}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
    console.log(`[IndexNow] Research pinged: ${articleUrl}`);
  } catch (e) {
    console.error("[IndexNow] Research ping failed:", e);
  }

  // Google sitemap ping
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${baseUrl}/sitemap.xml`)}`, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    // silent
  }
}

// ============================================================
// MAIN DISCOVERY HANDLER
// ============================================================

export async function discoverResearchHandler(req: Request, res: Response) {
  try {
    console.log("[ResearchDiscovery] Starting multi-source research discovery...");
    
    // Get existing DOIs to avoid duplicates
    const existingDOIs = await getExistingResearchDOIs();
    console.log(`[ResearchDiscovery] ${existingDOIs.length} existing studies in database`);
    
    // Pick a random topic to search
    const topic = RESEARCH_TOPICS[Math.floor(Math.random() * RESEARCH_TOPICS.length)];
    console.log(`[ResearchDiscovery] Searching for: "${topic}"`);
    
    // Search across multiple sources
    const results = await searchMultipleSources(topic);
    console.log(`[ResearchDiscovery] Found ${results.length} unique results across sources`);
    
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
    
    // Process the first new study (to avoid timeout)
    const study = newStudies[0];
    console.log(`[ResearchDiscovery] Processing: "${study.title}" from ${study.source}`);
    
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
      university: summary.university || summary.sourceInstitution || study.source,
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
    
    console.log(`[ResearchDiscovery] ✅ Study saved: ${slug} (source: ${study.source})`);
    
    // Ping IndexNow for the new research article
    pingIndexNowResearch(slug).catch(e => console.error("[IndexNow] Research ping error:", e));
    
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
      source: study.source,
      sourcesSearched: 4,
    });
  } catch (error: any) {
    console.error("[ResearchDiscovery] Handler error:", error?.message || error);
    res.status(500).json({ ok: false, error: error?.message || "Unknown error" });
  }
}
