/**
 * Prerender Middleware for Search Engine Crawlers
 * 
 * Detects bot user agents and serves pre-rendered HTML with complete meta tags,
 * JSON-LD structured data, and critical content visible in the initial HTML.
 * This ensures search engines see fully-formed pages without needing JavaScript execution.
 * 
 * For human visitors, the page loads normally as a SPA with client-side hydration.
 */
import { Request, Response, NextFunction } from "express";
import { getArticleBySlug, getResearchBySlug, getPublishedArticles, getPublishedResearch, getAllGlossaryTerms, getGlossaryTermBySlug } from "../db";

const BASE_URL = "https://feelgreat.us.com";

// Known bot user agents
const BOT_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "yandexbot",
  "duckduckbot",
  "slurp",
  "baiduspider",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "applebot",
  "semrushbot",
  "ahrefsbot",
  "mj12bot",
  "dotbot",
  "petalbot",
  "bytespider",
];

/**
 * Check if the request is from a search engine bot
 */
function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

/**
 * Strip HTML tags from content for plain text extraction
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Generate a minimal but SEO-complete HTML page for bots
 * Contains all meta tags, JSON-LD, and visible text content
 */
function generateBotHtml(options: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  content: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  lang?: string;
  dir?: string;
}): string {
  const { title, description, canonicalUrl, ogImage, ogType, jsonLd, content, breadcrumbs, lang = "en", dir = "ltr" } = options;
  const image = ogImage || `${BASE_URL}/manus-storage/feel-great-complete_44bb8752.png`;

  const jsonLdScripts = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd])
        .map(ld => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
        .join("\n    ")
    : "";

  const breadcrumbHtml = breadcrumbs
    ? `<nav aria-label="Breadcrumb"><ol>${breadcrumbs.map((b, i) => 
        `<li><a href="${b.url}">${b.name}</a>${i < breadcrumbs.length - 1 ? " > " : ""}</li>`
      ).join("")}</ol></nav>`
    : "";

  const breadcrumbJsonLd = breadcrumbs ? `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": b.name,
      "item": b.url,
    })),
  })}</script>` : "";

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="${ogType || "website"}">
    <meta property="og:site_name" content="Feel Great">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(title)}">
    <meta name="twitter:description" content="${escapeAttr(description)}">
    <meta name="twitter:image" content="${image}">
    
    <!-- Structured Data -->
    ${jsonLdScripts}
    ${breadcrumbJsonLd}
    
    <!-- Verification -->
    <meta name="google-site-verification" content="OA7Hg2lFps2RQmdHqx147R0cRUynsSUiTrpSkPd_QCU">
    <meta name="msvalidate.01" content="5E567979B487559079B7854DA701CE33">
</head>
<body>
    ${breadcrumbHtml}
    <main>
        ${content}
    </main>
    <footer>
        <p>&copy; 2024-2026 Feel Great by Feras Alayed. All rights reserved.</p>
        <nav>
            <a href="${BASE_URL}/">Home</a> |
            <a href="${BASE_URL}/blog">Blog</a> |
            <a href="${BASE_URL}/research">Research</a> |
            <a href="${BASE_URL}/about">About</a> |
            <a href="${BASE_URL}/partner">Partner</a>
        </nav>
    </footer>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Generate prerendered HTML for a blog article
 */
async function prerenderBlogArticle(slug: string): Promise<string | null> {
  const article = await getArticleBySlug(slug);
  if (!article) return null;

  const title = article.metaTitleEn || article.titleEn;
  const description = article.metaDescriptionEn || article.excerptEn;
  const publishedAt = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date(article.createdAt).toISOString();
  const updatedAt = article.updatedAt ? new Date(article.updatedAt).toISOString() : publishedAt;

  // Build article content for bots (includes both languages)
  const content = `
    <article>
      <header>
        <h1>${escapeHtml(article.titleEn)}</h1>
        <h2 dir="rtl" lang="ar">${escapeHtml(article.titleAr)}</h2>
        <p><strong>Author:</strong> Feras Alayed - Therapeutic & Behavioral Nutrition Specialist</p>
        <p><strong>Published:</strong> <time datetime="${publishedAt}">${new Date(publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></p>
        ${updatedAt !== publishedAt ? `<p><strong>Updated:</strong> <time datetime="${updatedAt}">${new Date(updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time></p>` : ""}
        <p><strong>Category:</strong> ${article.category}</p>
        <p><strong>Reading Time:</strong> ${article.readTimeMinutes} minutes</p>
      </header>
      <section lang="en">
        ${article.contentEn}
      </section>
      <section lang="ar" dir="rtl">
        ${article.contentAr}
      </section>
      ${article.faqSchema ? `<section><h2>Frequently Asked Questions</h2>${article.faqSchema.map(faq => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join("")}</section>` : ""}
    </article>`;

  // Build JSON-LD
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": article.heroImageUrl ? (article.heroImageUrl.startsWith("/") ? `${BASE_URL}${article.heroImageUrl}` : article.heroImageUrl) : `${BASE_URL}/manus-storage/feel-great-complete_44bb8752.png`,
      "author": {
        "@type": "Person",
        "@id": `${BASE_URL}/#feras-alayed`,
        "name": "Feras Alayed",
        "url": `${BASE_URL}/author/feras-alayed`,
      },
      "publisher": {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": "Feel Great",
        "logo": { "@type": "ImageObject", "url": `${BASE_URL}/manus-storage/feel-great-complete_44bb8752.png` },
      },
      "datePublished": publishedAt,
      "dateModified": updatedAt,
      "mainEntityOfPage": `${BASE_URL}/blog/${slug}`,
      "wordCount": article.wordCount,
      "articleSection": article.category,
    },
  ];

  // Add FAQ schema if present
  if (article.faqSchema && article.faqSchema.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.faqSchema.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
      })),
    } as any);
  }

  return generateBotHtml({
    title: `${title} | Feel Great`,
    description: description || "",
    canonicalUrl: `${BASE_URL}/blog/${slug}`,
    ogImage: article.heroImageUrl ? (article.heroImageUrl.startsWith("/") ? `${BASE_URL}${article.heroImageUrl}` : article.heroImageUrl) : undefined,
    ogType: "article",
    jsonLd,
    content,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Blog", url: `${BASE_URL}/blog` },
      { name: title || article.titleEn, url: `${BASE_URL}/blog/${slug}` },
    ],
  });
}

/**
 * Generate prerendered HTML for a research study
 */
async function prerenderResearchStudy(slug: string): Promise<string | null> {
  const study = await getResearchBySlug(slug);
  if (!study) return null;

  const title = study.metaTitleEn || study.titleEn;
  const description = study.metaDescriptionEn || study.summary30sEn;

  const content = `
    <article>
      <header>
        <h1>${escapeHtml(study.titleEn)}</h1>
        <h2 dir="rtl" lang="ar">${escapeHtml(study.titleAr)}</h2>
        <p><strong>Journal:</strong> ${escapeHtml(study.journal)}</p>
        ${study.university ? `<p><strong>University:</strong> ${escapeHtml(study.university)}</p>` : ""}
        <p><strong>Study Type:</strong> ${study.studyType}</p>
        <p><strong>Evidence Level:</strong> ${study.evidenceLevel}</p>
        ${study.participantCount ? `<p><strong>Participants:</strong> ${study.participantCount}</p>` : ""}
        <p><strong>Published:</strong> ${study.publishDate}</p>
        ${study.isPreliminary ? `<p><strong>⚠️ Warning:</strong> This is a preliminary study (animal/cell) and has not been proven in humans.</p>` : ""}
      </header>
      <section>
        <h2>30-Second Summary</h2>
        <p>${escapeHtml(study.summary30sEn)}</p>
      </section>
      <section>
        <h2>1-Minute Summary</h2>
        <p>${escapeHtml(study.summary1minEn)}</p>
      </section>
      <section>
        <h2>3-Minute Summary</h2>
        <p>${escapeHtml(study.summary3minEn)}</p>
      </section>
      <section>
        <h2>Full Analysis</h2>
        ${study.fullAnalysisEn}
      </section>
      <section>
        <h2>Health Implications</h2>
        <p>${escapeHtml(study.healthImplicationsEn)}</p>
      </section>
      ${study.keyFindings ? `<section><h2>Key Findings</h2><ul>${study.keyFindings.map(f => `<li>${escapeHtml(f.findingEn)}</li>`).join("")}</ul></section>` : ""}
      ${study.doi ? `<p><strong>DOI:</strong> <a href="https://doi.org/${study.doi}">${study.doi}</a></p>` : ""}
      <p><a href="${study.sourceUrl}">View Original Study</a></p>
    </article>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": title,
    "description": description,
    "author": study.authors ? study.authors.split(",").map(a => ({ "@type": "Person", "name": a.trim() })) : undefined,
    "publisher": { "@type": "Organization", "name": study.journal },
    "datePublished": study.publishDate,
    "about": study.topics,
    "mainEntityOfPage": `${BASE_URL}/research/${slug}`,
  };

  return generateBotHtml({
    title: `${title} | Research | Feel Great`,
    description: description || "",
    canonicalUrl: `${BASE_URL}/research/${slug}`,
    ogImage: study.heroImageUrl ? (study.heroImageUrl.startsWith("/") ? `${BASE_URL}${study.heroImageUrl}` : study.heroImageUrl) : undefined,
    ogType: "article",
    jsonLd,
    content,
    breadcrumbs: [
      { name: "Home", url: BASE_URL },
      { name: "Research", url: `${BASE_URL}/research` },
      { name: title || study.titleEn, url: `${BASE_URL}/research/${slug}` },
    ],
  });
}

/**
 * Generate prerendered blog listing page
 */
async function prerenderBlogListing(): Promise<string | null> {
  try {
    const articles = await getPublishedArticles(50, 0);
    if (!articles.length) return null;

    const content = `
      <h1>Health Blog - مقالات صحية علمية</h1>
      <p>Evidence-based health articles by Feras Alayed, Therapeutic & Behavioral Nutrition Specialist.</p>
      <ul>
        ${articles.map(a => `<li><a href="${BASE_URL}/blog/${a.slug}">${escapeHtml(a.titleEn)}</a> - ${escapeHtml(a.excerptEn?.substring(0, 100) || "")}</li>`).join("\n        ")}
      </ul>`;

    return generateBotHtml({
      title: "Health Blog - مقالات صحية علمية | Feel Great",
      description: "Evidence-based health articles covering insulin resistance, gut health, weight management, behavioral nutrition, and sustainable health.",
      canonicalUrl: `${BASE_URL}/blog`,
      ogType: "website",
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "Blog", url: `${BASE_URL}/blog` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered research listing page
 */
async function prerenderResearchListing(): Promise<string | null> {
  try {
    const studies = await getPublishedResearch(50, 0);
    if (!studies.length) return null;

    const content = `
      <h1>Scientific Research Hub - مركز الأبحاث العلمية</h1>
      <p>Latest scientific studies from PubMed, Nature, JAMA, The Lancet, BMJ, and more - summarized and simplified.</p>
      <ul>
        ${studies.map(s => `<li><a href="${BASE_URL}/research/${s.slug}">${escapeHtml(s.titleEn)}</a> - ${s.journal} (${s.evidenceLevel})</li>`).join("\n        ")}
      </ul>`;

    return generateBotHtml({
      title: "Scientific Research Hub - مركز الأبحاث العلمية | Feel Great",
      description: "Latest scientific studies from top journals summarized and simplified. Discover the science behind sustainable health.",
      canonicalUrl: `${BASE_URL}/research`,
      ogType: "website",
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "Research", url: `${BASE_URL}/research` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered homepage
 */
async function prerenderHomepage(): Promise<string | null> {
  try {
    const articles = await getPublishedArticles(5, 0);
    const studies = await getPublishedResearch(5, 0);
    const content = `
      <h1>Feel Great - Your Science-Based Health Partner</h1>
      <p>Evidence-based health guidance by Feras Alayed, Therapeutic & Behavioral Nutrition Specialist. Discover scientifically-proven approaches to insulin resistance, gut health, weight management, and metabolic wellness.</p>
      <section>
        <h2>Latest Articles</h2>
        <ul>
          ${articles.map(a => `<li><a href="${BASE_URL}/blog/${a.slug}">${escapeHtml(a.titleEn)}</a> - ${escapeHtml(a.excerptEn?.substring(0, 100) || "")}</li>`).join("\n          ")}
        </ul>
        <a href="${BASE_URL}/blog">View All Articles</a>
      </section>
      <section>
        <h2>Latest Research</h2>
        <ul>
          ${studies.map(s => `<li><a href="${BASE_URL}/research/${s.slug}">${escapeHtml(s.titleEn)}</a> - ${s.journal}</li>`).join("\n          ")}
        </ul>
        <a href="${BASE_URL}/research">View All Research</a>
      </section>
      <section>
        <h2>Key Topics</h2>
        <ul>
          <li><a href="${BASE_URL}/health/insulin-resistance">Insulin Resistance</a></li>
          <li><a href="${BASE_URL}/health/gut-health">Gut Health</a></li>
          <li><a href="${BASE_URL}/health/weight-management">Weight Management</a></li>
          <li><a href="${BASE_URL}/health/metabolic-health">Metabolic Health</a></li>
          <li><a href="${BASE_URL}/health/thyroid-health">Thyroid Health</a></li>
        </ul>
      </section>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Feel Great",
      "url": BASE_URL,
      "description": "Evidence-based health guidance by Feras Alayed. Science-backed approaches to insulin resistance, gut health, and metabolic wellness.",
      "author": { "@type": "Person", "name": "Feras Alayed" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${BASE_URL}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    };

    return generateBotHtml({
      title: "Feel Great - Evidence-Based Health & Nutrition | Feras Alayed",
      description: "Science-based health guidance by Feras Alayed, Therapeutic & Behavioral Nutrition Specialist. Articles, research, and tools for insulin resistance, gut health, and metabolic wellness.",
      canonicalUrl: BASE_URL,
      ogType: "website",
      jsonLd,
      content,
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered glossary listing page
 */
async function prerenderGlossaryListing(): Promise<string | null> {
  try {
    const terms = await getAllGlossaryTerms();
    if (!terms.length) return null;

    const content = `
      <h1>Health & Nutrition Glossary - قاموس الصحة والتغذية</h1>
      <p>Comprehensive glossary of health, nutrition, and medical terms explained in simple language.</p>
      <ul>
        ${terms.map(t => `<li><a href="${BASE_URL}/glossary/${t.slug}">${escapeHtml(t.termEn)}</a> - ${escapeHtml((t.definitionEn || "").substring(0, 100))}</li>`).join("\n        ")}
      </ul>`;

    return generateBotHtml({
      title: "Health & Nutrition Glossary | Feel Great",
      description: "Comprehensive glossary of health, nutrition, and medical terms. Understand complex health concepts in simple language.",
      canonicalUrl: `${BASE_URL}/glossary`,
      ogType: "website",
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "Glossary", url: `${BASE_URL}/glossary` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered glossary term detail page
 */
async function prerenderGlossaryTerm(slug: string): Promise<string | null> {
  try {
    const term = await getGlossaryTermBySlug(slug);
    if (!term) return null;

    const content = `
      <article>
        <h1>${escapeHtml(term.termEn)}</h1>
        <h2 dir="rtl" lang="ar">${escapeHtml(term.termAr || "")}</h2>
        <p><strong>Category:</strong> ${escapeHtml(term.category || "")}</p>
        <section>
          <h2>Definition</h2>
          <p>${escapeHtml(term.definitionEn || "")}</p>
        </section>
        <section dir="rtl" lang="ar">
          <h2>التعريف</h2>
          <p>${escapeHtml(term.definitionAr || "")}</p>
        </section>
      </article>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": term.termEn,
      "description": term.definitionEn,
      "inDefinedTermSet": `${BASE_URL}/glossary`,
    };

    return generateBotHtml({
      title: `${term.termEn} - Health Glossary | Feel Great`,
      description: (term.definitionEn || "").substring(0, 160),
      canonicalUrl: `${BASE_URL}/glossary/${slug}`,
      ogType: "article",
      jsonLd,
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "Glossary", url: `${BASE_URL}/glossary` },
        { name: term.termEn, url: `${BASE_URL}/glossary/${slug}` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered success stories page
 */
async function prerenderSuccessStories(): Promise<string | null> {
  try {
    const content = `
      <h1>Success Stories - قصص النجاح</h1>
      <p>Real transformations from real people. 142+ documented before and after results from Feel Great members across 6 health categories.</p>
      <section>
        <h2>Categories</h2>
        <ul>
          <li><strong>Weight Loss</strong> - Sustainable weight management results</li>
          <li><strong>Diabetes & Insulin</strong> - Blood sugar control improvements</li>
          <li><strong>Gut Health</strong> - Digestive wellness transformations</li>
          <li><strong>General Wellness</strong> - Overall health improvements</li>
          <li><strong>Women's Health</strong> - Hormonal balance and vitality</li>
          <li><strong>Thyroid</strong> - Thyroid function optimization</li>
        </ul>
      </section>
      <p>Join thousands who have transformed their health with evidence-based nutrition guidance.</p>`;

    return generateBotHtml({
      title: "Success Stories - Real Health Transformations | Feel Great",
      description: "142+ documented before and after results. Real transformations in weight loss, diabetes management, gut health, and more.",
      canonicalUrl: `${BASE_URL}/success-stories`,
      ogType: "website",
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "Success Stories", url: `${BASE_URL}/success-stories` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered FAQ page
 */
async function prerenderFAQ(): Promise<string | null> {
  try {
    const content = `
      <h1>Frequently Asked Questions - الأسئلة الشائعة</h1>
      <section>
        <h2>About Feel Great</h2>
        <details><summary>What is Feel Great?</summary><p>Feel Great is an evidence-based health platform by Feras Alayed, providing scientific nutrition guidance, research summaries, and personalized health tools.</p></details>
        <details><summary>Who is Feras Alayed?</summary><p>Feras Alayed is a Therapeutic & Behavioral Nutrition Specialist dedicated to making scientific health information accessible to everyone.</p></details>
        <details><summary>Is the content scientifically backed?</summary><p>Yes, all articles and recommendations are based on peer-reviewed research from journals like PubMed, Nature, JAMA, The Lancet, and BMJ.</p></details>
      </section>
      <section>
        <h2>About the Program</h2>
        <details><summary>How does the 90-day journey work?</summary><p>The 90-day journey is a structured program that builds sustainable health habits through compound daily improvements, guided by scientific principles.</p></details>
        <details><summary>Can I get personalized guidance?</summary><p>Yes, you can book a free consultation to discuss your specific health goals and get a personalized plan.</p></details>
      </section>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "What is Feel Great?", "acceptedAnswer": { "@type": "Answer", "text": "Feel Great is an evidence-based health platform by Feras Alayed, providing scientific nutrition guidance, research summaries, and personalized health tools." } },
        { "@type": "Question", "name": "Who is Feras Alayed?", "acceptedAnswer": { "@type": "Answer", "text": "Feras Alayed is a Therapeutic & Behavioral Nutrition Specialist dedicated to making scientific health information accessible to everyone." } },
        { "@type": "Question", "name": "Is the content scientifically backed?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, all articles and recommendations are based on peer-reviewed research from journals like PubMed, Nature, JAMA, The Lancet, and BMJ." } },
      ],
    };

    return generateBotHtml({
      title: "FAQ - Frequently Asked Questions | Feel Great",
      description: "Answers to common questions about Feel Great, our evidence-based health approach, programs, and how to get personalized guidance.",
      canonicalUrl: `${BASE_URL}/faq`,
      ogType: "website",
      jsonLd,
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "FAQ", url: `${BASE_URL}/faq` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered about page
 */
async function prerenderAbout(): Promise<string | null> {
  try {
    const content = `
      <h1>About Feel Great</h1>
      <section>
        <h2>Our Mission</h2>
        <p>Feel Great is dedicated to making evidence-based health information accessible to everyone. We bridge the gap between complex scientific research and practical daily health decisions.</p>
      </section>
      <section>
        <h2>What We Offer</h2>
        <ul>
          <li><strong>Scientific Articles</strong> - In-depth health articles based on peer-reviewed research</li>
          <li><strong>Research Summaries</strong> - Complex studies simplified in 30 seconds, 1 minute, and 3 minutes</li>
          <li><strong>Health Tools</strong> - Calculators, assessments, and trackers for your health journey</li>
          <li><strong>Personalized Guidance</strong> - One-on-one consultations with Feras Alayed</li>
        </ul>
      </section>
      <section>
        <h2>Our Approach</h2>
        <p>We focus on sustainable, science-backed health improvements rather than quick fixes. Our content covers insulin resistance, gut health, metabolic wellness, behavioral nutrition, and more.</p>
      </section>`;

    return generateBotHtml({
      title: "About Feel Great - Evidence-Based Health Platform",
      description: "Feel Great bridges the gap between complex scientific research and practical health decisions. Founded by Feras Alayed, Therapeutic & Behavioral Nutrition Specialist.",
      canonicalUrl: `${BASE_URL}/about`,
      ogType: "website",
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "About", url: `${BASE_URL}/about` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Generate prerendered author page
 */
async function prerenderAuthor(): Promise<string | null> {
  try {
    const content = `
      <h1>Feras Alayed - Therapeutic & Behavioral Nutrition Specialist</h1>
      <section>
        <h2>About Feras</h2>
        <p>Feras Alayed is a Therapeutic & Behavioral Nutrition Specialist with expertise in insulin resistance, metabolic health, gut microbiome, and behavioral nutrition. He founded Feel Great to make scientific health information accessible to Arabic and English-speaking audiences worldwide.</p>
      </section>
      <section>
        <h2>Expertise</h2>
        <ul>
          <li>Therapeutic Nutrition</li>
          <li>Behavioral Nutrition & Food Psychology</li>
          <li>Insulin Resistance & Metabolic Health</li>
          <li>Gut Microbiome & Digestive Wellness</li>
          <li>Weight Management & Body Composition</li>
          <li>Women's Hormonal Health</li>
        </ul>
      </section>
      <section>
        <h2>Content</h2>
        <p>Feras has authored numerous evidence-based articles and simplified complex research studies from top medical journals including PubMed, Nature, JAMA, The Lancet, and BMJ.</p>
        <ul>
          <li><a href="${BASE_URL}/blog">Health Articles</a></li>
          <li><a href="${BASE_URL}/research">Research Summaries</a></li>
        </ul>
      </section>`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${BASE_URL}/#feras-alayed`,
      "name": "Feras Alayed",
      "jobTitle": "Therapeutic & Behavioral Nutrition Specialist",
      "url": `${BASE_URL}/author/feras-alayed`,
      "sameAs": [],
      "knowsAbout": ["Therapeutic Nutrition", "Behavioral Nutrition", "Insulin Resistance", "Metabolic Health", "Gut Microbiome"],
    };

    return generateBotHtml({
      title: "Feras Alayed - Therapeutic & Behavioral Nutrition Specialist | Feel Great",
      description: "Feras Alayed is a Therapeutic & Behavioral Nutrition Specialist. Expert in insulin resistance, metabolic health, gut microbiome, and behavioral nutrition.",
      canonicalUrl: `${BASE_URL}/author/feras-alayed`,
      ogType: "profile",
      jsonLd,
      content,
      breadcrumbs: [
        { name: "Home", url: BASE_URL },
        { name: "Feras Alayed", url: `${BASE_URL}/author/feras-alayed` },
      ],
    });
  } catch {
    return null;
  }
}

/**
 * Main prerender middleware
 * Intercepts requests from bots and serves pre-rendered HTML
 */
export function prerenderMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only handle GET requests
    if (req.method !== "GET") return next();

    // Check if it's a bot
    const userAgent = req.headers["user-agent"] || "";
    if (!isBot(userAgent)) return next();

    // Skip non-page requests
    if (req.path.startsWith("/api/") || req.path.startsWith("/manus-storage/") || req.path.match(/\.[a-z]{2,4}$/)) {
      return next();
    }

    // Strip language prefix for route matching
    const cleanPath = req.path.replace(/^\/(ar|en|fr|es|de|tr)(\/|$)/, "/").replace(/\/$/, "") || "/";

    try {
      let html: string | null = null;

      // Blog article
      const blogMatch = cleanPath.match(/^\/blog\/([^/]+)$/);
      if (blogMatch) {
        html = await prerenderBlogArticle(blogMatch[1]);
      }

      // Research study
      const researchMatch = cleanPath.match(/^\/research\/([^/]+)$/);
      if (researchMatch) {
        html = await prerenderResearchStudy(researchMatch[1]);
      }

      // Blog listing
      if (cleanPath === "/blog") {
        html = await prerenderBlogListing();
      }

      // Research listing
      if (cleanPath === "/research") {
        html = await prerenderResearchListing();
      }

      // Homepage
      if (cleanPath === "/" || cleanPath === "") {
        html = await prerenderHomepage();
      }

      // Glossary listing
      if (cleanPath === "/glossary") {
        html = await prerenderGlossaryListing();
      }

      // Glossary term detail
      const glossaryMatch = cleanPath.match(/^\/glossary\/([^/]+)$/);
      if (glossaryMatch) {
        html = await prerenderGlossaryTerm(glossaryMatch[1]);
      }

      // Success stories
      if (cleanPath === "/success-stories") {
        html = await prerenderSuccessStories();
      }

      // FAQ page
      if (cleanPath === "/faq") {
        html = await prerenderFAQ();
      }

      // About page
      if (cleanPath === "/about") {
        html = await prerenderAbout();
      }

      // Author page
      if (cleanPath === "/author/feras-alayed" || cleanPath === "/founder") {
        html = await prerenderAuthor();
      }

      if (html) {
        res.set("Content-Type", "text/html; charset=utf-8");
        res.set("X-Prerendered", "true");
        res.set("Cache-Control", "public, max-age=3600, s-maxage=7200");
        return res.send(html);
      }
    } catch (error) {
      console.error("[Prerender] Error:", error);
    }

    // Fall through to normal SPA rendering
    next();
  };
}
