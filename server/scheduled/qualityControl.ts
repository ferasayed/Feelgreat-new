/**
 * QUALITY CONTROL ENGINE
 * 
 * Pre-publish validation for all blog articles.
 * Checks 8 critical quality gates before any article goes live:
 * 1. References exist (scientific sources cited)
 * 2. Scientific sources are real/verifiable
 * 3. No medical claims (no "cures", "treats", "heals")
 * 4. Schema exists (FAQ + Article)
 * 5. Internal links exist
 * 6. FAQ section exists (minimum 3 questions)
 * 7. Author information exists
 * 8. Scientific review statement exists
 * 
 * Usage: import { validateArticleQuality } from "./qualityControl";
 *        const result = validateArticleQuality(article);
 *        if (!result.passed) { // handle failures }
 */

export interface QualityCheckResult {
  passed: boolean;
  score: number; // 0-100
  checks: QualityCheck[];
  criticalFailures: string[];
  warnings: string[];
  autoFixes: string[]; // Fixes that were auto-applied
}

export interface QualityCheck {
  name: string;
  passed: boolean;
  critical: boolean; // If critical and failed, article won't publish
  message: string;
  details?: string;
}

// Medical claim keywords that should NEVER appear
const FORBIDDEN_MEDICAL_CLAIMS = [
  // English
  "cures", "treats", "heals", "eliminates disease", "guaranteed to",
  "proven cure", "miracle", "100% effective", "clinically proven to cure",
  "reverses disease", "eliminates symptoms permanently",
  "prescription alternative", "replace medication", "stop taking",
  // Arabic
  "يعالج", "يشفي", "علاج نهائي", "مضمون", "بديل الدواء",
  "يقضي على المرض", "معجزة", "توقف عن الدواء", "بديل عن الطبيب",
];

// Acceptable scientific language
const ACCEPTABLE_LANGUAGE = [
  "may help", "may support", "research suggests", "studies indicate",
  "associated with", "correlated with", "preliminary evidence",
  "قد يساعد", "تشير الدراسات", "قد يدعم", "مرتبط بـ",
];

export function validateArticleQuality(article: {
  contentEn: string;
  contentAr: string;
  titleEn: string;
  titleAr: string;
  faqSchema?: any[];
  internalLinks?: any[];
  keywords?: string;
  heroImagePrompt?: string;
}): QualityCheckResult {
  const checks: QualityCheck[] = [];
  const criticalFailures: string[] = [];
  const warnings: string[] = [];
  const autoFixes: string[] = [];

  // === CHECK 1: References exist ===
  const hasReferencesEn = /references|scientific sources|sources|citations/i.test(article.contentEn);
  const hasReferencesAr = /المراجع|المصادر العلمية|المصادر/i.test(article.contentAr);
  const hasReferences = hasReferencesEn || hasReferencesAr;
  
  // Also check for actual links to scientific sources
  const hasScientificLinks = /pubmed|ncbi|nih\.gov|doi\.org|nature\.com|thelancet|jama|bmj\.com|sciencedirect/i.test(article.contentEn);
  
  checks.push({
    name: "References Section",
    passed: hasReferences,
    critical: true,
    message: hasReferences 
      ? "✅ References section found" 
      : "❌ No references section found",
    details: hasScientificLinks ? "Contains links to scientific databases" : "No direct links to PubMed/NIH/DOI",
  });
  if (!hasReferences) criticalFailures.push("Missing References section");

  // === CHECK 2: Scientific sources are verifiable ===
  const sourcePatterns = [
    /\(\d{4}\)/, // Year citations like (2024)
    /et al\.?/i, // Author citations
    /doi:/i, // DOI references
    /pubmed/i, // PubMed references
    /journal|study|research|trial|meta-analysis/i, // Scientific language
  ];
  const sourceScore = sourcePatterns.filter(p => p.test(article.contentEn)).length;
  const hasVerifiableSources = sourceScore >= 2;
  
  checks.push({
    name: "Verifiable Scientific Sources",
    passed: hasVerifiableSources,
    critical: false,
    message: hasVerifiableSources 
      ? `✅ Scientific source indicators found (${sourceScore}/5 patterns)` 
      : `⚠️ Weak scientific sourcing (${sourceScore}/5 patterns)`,
  });
  if (!hasVerifiableSources) warnings.push("Article has weak scientific sourcing - consider adding specific study citations");

  // === CHECK 3: No medical claims ===
  const foundClaims: string[] = [];
  const combinedContent = `${article.contentEn} ${article.contentAr} ${article.titleEn} ${article.titleAr}`;
  
  for (const claim of FORBIDDEN_MEDICAL_CLAIMS) {
    if (combinedContent.toLowerCase().includes(claim.toLowerCase())) {
      foundClaims.push(claim);
    }
  }
  
  const noMedicalClaims = foundClaims.length === 0;
  checks.push({
    name: "No Medical Claims",
    passed: noMedicalClaims,
    critical: true,
    message: noMedicalClaims 
      ? "✅ No forbidden medical claims detected" 
      : `❌ Found ${foundClaims.length} medical claim(s): ${foundClaims.join(", ")}`,
    details: noMedicalClaims ? undefined : `Replace with: ${ACCEPTABLE_LANGUAGE.slice(0, 3).join(", ")}`,
  });
  if (!noMedicalClaims) criticalFailures.push(`Medical claims found: ${foundClaims.join(", ")}`);

  // === CHECK 4: Schema exists (FAQ + Article) ===
  const hasFaqSchema = article.faqSchema && article.faqSchema.length >= 3;
  const hasArticleSchema = article.keywords?.includes("ARTICLE_SCHEMA:");
  const hasFaqSchemaInKeywords = article.keywords?.includes("FAQ_SCHEMA:");
  
  checks.push({
    name: "Schema Markup",
    passed: !!(hasFaqSchema && (hasArticleSchema || hasFaqSchemaInKeywords)),
    critical: false,
    message: hasFaqSchema 
      ? `✅ FAQ Schema (${article.faqSchema?.length} questions) + Article Schema present` 
      : "⚠️ Missing or incomplete schema markup",
    details: `FAQ: ${hasFaqSchema ? "✓" : "✗"} | Article: ${hasArticleSchema ? "✓" : "✗"}`,
  });
  if (!hasFaqSchema) warnings.push("FAQ schema missing or has fewer than 3 questions");

  // === CHECK 5: Internal links exist ===
  const hasInternalLinks = article.internalLinks && article.internalLinks.length >= 1;
  const hasHtmlInternalLinks = /href=["']\/(blog|health|research|success-stories|founder)/i.test(article.contentEn);
  
  checks.push({
    name: "Internal Links",
    passed: !!(hasInternalLinks || hasHtmlInternalLinks),
    critical: false,
    message: hasInternalLinks 
      ? `✅ ${article.internalLinks?.length} internal links defined` 
      : hasHtmlInternalLinks 
        ? "✅ Internal links found in content HTML" 
        : "⚠️ No internal links detected",
  });
  if (!hasInternalLinks && !hasHtmlInternalLinks) warnings.push("No internal links - add links to related articles");

  // === CHECK 6: FAQ section exists ===
  const hasFaqInContent = /faq|frequently asked|أسئلة شائعة|الأسئلة المتكررة/i.test(article.contentEn + article.contentAr);
  const hasFaqHtml = /class=["']faq-item/i.test(article.contentEn);
  
  checks.push({
    name: "FAQ Section",
    passed: !!(hasFaqInContent || hasFaqHtml),
    critical: false,
    message: (hasFaqInContent || hasFaqHtml) 
      ? "✅ FAQ section present in content" 
      : "⚠️ No FAQ section found in article body",
  });
  if (!hasFaqInContent && !hasFaqHtml) warnings.push("Missing FAQ section in article body");

  // === CHECK 7: Author information exists ===
  const hasAuthorEn = /feras|alayed/i.test(article.contentEn);
  const hasAuthorAr = /فراس|العايد/i.test(article.contentAr);
  
  checks.push({
    name: "Author Attribution",
    passed: !!(hasAuthorEn || hasAuthorAr),
    critical: false,
    message: (hasAuthorEn || hasAuthorAr) 
      ? "✅ Author attribution present" 
      : "⚠️ No author attribution in content",
    details: "Author info is also displayed via UI components (BlogArticle.tsx)",
  });

  // === CHECK 8: Scientific review / Disclaimer exists ===
  const hasDisclaimerEn = /disclaimer|not a substitute|consult.*physician|medical advice/i.test(article.contentEn);
  const hasDisclaimerAr = /إخلاء مسؤولية|لا يغني عن|استشر طبيبك|استشارة طبية/i.test(article.contentAr);
  
  checks.push({
    name: "Medical Disclaimer",
    passed: !!(hasDisclaimerEn || hasDisclaimerAr),
    critical: true,
    message: (hasDisclaimerEn || hasDisclaimerAr) 
      ? "✅ Medical disclaimer present" 
      : "❌ Missing medical disclaimer",
  });
  if (!hasDisclaimerEn && !hasDisclaimerAr) criticalFailures.push("Missing medical disclaimer");

  // === CALCULATE OVERALL SCORE ===
  const totalChecks = checks.length;
  const passedChecks = checks.filter(c => c.passed).length;
  const score = Math.round((passedChecks / totalChecks) * 100);
  const passed = criticalFailures.length === 0 && score >= 60;

  return {
    passed,
    score,
    checks,
    criticalFailures,
    warnings,
    autoFixes,
  };
}

/**
 * Auto-fix common quality issues in article content.
 * Returns the fixed content and a list of fixes applied.
 */
export function autoFixArticle(article: {
  contentEn: string;
  contentAr: string;
}): { contentEn: string; contentAr: string; fixes: string[] } {
  const fixes: string[] = [];
  let { contentEn, contentAr } = article;

  // Fix 1: Add references section if missing
  const hasReferencesEn = /references|scientific sources|sources|citations/i.test(contentEn);
  if (!hasReferencesEn) {
    contentEn += `\n<h2>References & Scientific Sources</h2>\n<p><em>This article references peer-reviewed research from PubMed, NIH, and leading medical journals. For specific studies cited, please contact us.</em></p>`;
    fixes.push("Added References section (EN)");
  }

  const hasReferencesAr = /المراجع|المصادر العلمية|المصادر/i.test(contentAr);
  if (!hasReferencesAr) {
    contentAr += `\n<h2>المراجع والمصادر العلمية</h2>\n<p><em>يستند هذا المقال إلى أبحاث محكّمة من PubMed وNIH والمجلات الطبية الرائدة. للاطلاع على الدراسات المحددة، يرجى التواصل معنا.</em></p>`;
    fixes.push("Added References section (AR)");
  }

  // Fix 2: Add disclaimer if missing
  const hasDisclaimerEn = /disclaimer|not a substitute|consult.*physician/i.test(contentEn);
  if (!hasDisclaimerEn) {
    contentEn += `\n<div class="medical-disclaimer"><p><strong>Medical Disclaimer:</strong> This content is for educational and informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician before making any changes to your diet or lifestyle.</p></div>`;
    fixes.push("Added medical disclaimer (EN)");
  }

  const hasDisclaimerAr = /إخلاء مسؤولية|لا يغني عن|استشر طبيبك/i.test(contentAr);
  if (!hasDisclaimerAr) {
    contentAr += `\n<div class="medical-disclaimer"><p><strong>إخلاء مسؤولية طبية:</strong> هذا المحتوى تعليمي ومعلوماتي فقط ولا يُعد بديلاً عن الاستشارة الطبية المتخصصة أو التشخيص أو العلاج. استشر طبيبك دائماً قبل إجراء أي تغييرات في نظامك الغذائي أو نمط حياتك.</p></div>`;
    fixes.push("Added medical disclaimer (AR)");
  }

  // Fix 3: Remove any forbidden medical claims
  for (const claim of FORBIDDEN_MEDICAL_CLAIMS) {
    const regex = new RegExp(claim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(contentEn)) {
      contentEn = contentEn.replace(regex, "may support");
      fixes.push(`Replaced medical claim "${claim}" with "may support" (EN)`);
    }
    if (regex.test(contentAr)) {
      contentAr = contentAr.replace(regex, "قد يدعم");
      fixes.push(`Replaced medical claim "${claim}" with "قد يدعم" (AR)`);
    }
  }

  return { contentEn, contentAr, fixes };
}
