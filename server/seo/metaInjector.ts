/**
 * Server-Side SEO Meta Tags Injector
 * 
 * Intercepts HTML responses and injects dynamic meta tags based on the requested URL.
 * This enables search engines to see proper title, description, Open Graph, and JSON-LD
 * without requiring full SSR - the page still hydrates client-side but crawlers get
 * complete meta information from the initial HTML response.
 */
import { Request, Response, NextFunction } from "express";
import { getArticleBySlug } from "../db";
import { getResearchBySlug } from "../db";

const BASE_URL = "https://feelgreat.us.com";
const SITE_NAME = "Feel Great";
const DEFAULT_IMAGE = "/manus-storage/feel-great-complete_44bb8752.png";
const AUTHOR_NAME = "Feras Alayed";
const AUTHOR_NAME_AR = "فراس العايد";

interface MetaData {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  jsonLd?: object;
  lang?: string;
  dir?: string;
}

// Static page meta data
const STATIC_META: Record<string, MetaData> = {
  "/": {
    title: "Feel Great - استثمر في صحتك وابنِ مستقبلك | Feras Alayed",
    description: "نظام صحي متكامل مدعوم بالدراسات العلمية. برنامج Feel Great من يونيسيتي يجمع بين Unimate و Balance لصحة مستدامة.",
    ogType: "website",
  },
  "/blog": {
    title: "Health Blog - مقالات صحية علمية | Feel Great",
    description: "مقالات صحية موثوقة مبنية على أحدث الدراسات العلمية. مقاومة الإنسولين، صحة الأمعاء، إدارة الوزن، التغذية السلوكية.",
    ogType: "website",
  },
  "/research": {
    title: "Scientific Research Hub - مركز الأبحاث العلمية | Feel Great",
    description: "أحدث الدراسات العلمية من PubMed و Nature و JAMA ملخصة ومبسطة. اكتشف العلم وراء الصحة المستدامة.",
    ogType: "website",
  },
  "/today-in-health-science": {
    title: "Today In Health Science - اليوم في علم الصحة | Feel Great",
    description: "أحدث الاكتشافات العلمية من أفضل الجامعات والمجلات الطبية العالمية، ملخصة ومبسطة يومياً.",
    ogType: "website",
  },
  "/about": {
    title: "About Feras Alayed - عن فراس العايد | Feel Great",
    description: "فراس العايد - أخصائي التغذية العلاجية والسلوكية. مدرب عالمي في الصحة المستدامة وريادة الأعمال الصحية.",
    ogType: "profile",
  },
  "/partner": {
    title: "Partner With Us - انضم كشريك | Feel Great",
    description: "اكتشف فرصة الشراكة مع Feel Great. ابنِ دخلاً إضافياً وأنت تساعد الآخرين على تحسين صحتهم.",
    ogType: "website",
  },
  "/faq": {
    title: "FAQ - الأسئلة الشائعة | Feel Great",
    description: "إجابات على أكثر الأسئلة شيوعاً حول برنامج Feel Great ومنتجات Unimate و Balance.",
    ogType: "website",
  },
  "/health-assessment": {
    title: "Health Assessment - تقييم صحتك | Feel Great",
    description: "اكتشف مستوى صحتك مع تقييمنا المجاني. احصل على توصيات مخصصة بناءً على حالتك الصحية.",
    ogType: "website",
  },
  "/success-stories": {
    title: "Success Stories - قصص النجاح | Feel Great",
    description: "قصص حقيقية لأشخاص غيّروا حياتهم مع برنامج Feel Great. تحولات صحية ملهمة.",
    ogType: "website",
  },
  "/reviews": {
    title: "Reviews - تقييمات العملاء | Feel Great",
    description: "تقييمات وآراء حقيقية من مستخدمي برنامج Feel Great حول تجربتهم مع المنتجات.",
    ogType: "website",
  },
  "/author/feras-alayed": {
    title: "Feras Alayed - Therapeutic & Behavioral Nutrition Specialist",
    description: "فراس العايد - أخصائي التغذية العلاجية والسلوكية، Presidential Sapphire في يونيسيتي. خبير في مقاومة الإنسولين والصحة الأيضية.",
    ogType: "profile",
  },
};

// Pillar pages meta data
const PILLAR_META: Record<string, MetaData> = {
  "sustainable-health": {
    title: "Sustainable Health Guide - دليل الصحة المستدامة | Feel Great",
    description: "دليلك الشامل للصحة المستدامة. تعلم كيف تبني عادات صحية تدوم مدى الحياة مع نهج علمي متكامل.",
  },
  "insulin-resistance": {
    title: "Insulin Resistance Guide - دليل مقاومة الإنسولين | Feel Great",
    description: "كل ما تحتاج معرفته عن مقاومة الإنسولين: الأسباب، الأعراض، التشخيص، والحلول الطبيعية المدعومة بالعلم.",
  },
  "prediabetes": {
    title: "Prediabetes Prevention - الوقاية من مقدمات السكري | Feel Great",
    description: "دليل علمي شامل للوقاية من مقدمات السكري وعكسها. استراتيجيات غذائية وسلوكية مثبتة علمياً.",
  },
  "weight-loss-after-40": {
    title: "Weight Loss After 40 - إنقاص الوزن بعد الأربعين | Feel Great",
    description: "استراتيجيات علمية لإنقاص الوزن بعد سن الأربعين. تعامل مع التغيرات الهرمونية والأيضية بذكاء.",
  },
  "metabolic-health": {
    title: "Metabolic Health Guide - دليل الصحة الأيضية | Feel Great",
    description: "فهم صحتك الأيضية وتحسينها. دليل شامل يغطي السكر، الدهون، ضغط الدم، ومحيط الخصر.",
  },
  "gut-health": {
    title: "Gut Health Guide - دليل صحة الأمعاء | Feel Great",
    description: "دليلك لصحة أمعاء مثالية. الميكروبيوم، الألياف، البروبيوتيك، وعلاقة الأمعاء بالصحة العامة.",
  },
  "healthy-aging": {
    title: "Healthy Aging Guide - دليل الشيخوخة الصحية | Feel Great",
    description: "كيف تتقدم في العمر بصحة ونشاط. استراتيجيات علمية للحفاظ على الحيوية والوقاية من أمراض الشيخوخة.",
  },
  "energy-fatigue": {
    title: "Energy & Fatigue Guide - دليل الطاقة والإرهاق | Feel Great",
    description: "تغلب على الإرهاق المزمن واستعد طاقتك. حلول علمية لتحسين مستويات الطاقة طوال اليوم.",
  },
  "behavioral-nutrition": {
    title: "Behavioral Nutrition Guide - دليل التغذية السلوكية | Feel Great",
    description: "فهم العلاقة بين السلوك والتغذية. كيف تبني عادات غذائية صحية مستدامة بدون حرمان.",
  },
};

// Health condition pages meta
const HEALTH_META: Record<string, MetaData> = {
  "insulin-resistance": {
    title: "Insulin Resistance - مقاومة الإنسولين | Feel Great",
    description: "دليل شامل عن مقاومة الإنسولين: الأعراض، الأسباب، التشخيص، وخطة العلاج الطبيعية.",
  },
  "type-2-diabetes": {
    title: "Type 2 Diabetes - السكري النوع الثاني | Feel Great",
    description: "معلومات علمية عن السكري النوع الثاني وكيفية إدارته بالتغذية والنشاط البدني.",
  },
  "fatty-liver": {
    title: "Fatty Liver - الكبد الدهني | Feel Great",
    description: "دليل الكبد الدهني: الأسباب، المراحل، والحلول الغذائية المثبتة علمياً.",
  },
  "ibs-digestive": {
    title: "IBS & Digestive Health - القولون العصبي | Feel Great",
    description: "دليل القولون العصبي والصحة الهضمية. حلول غذائية وسلوكية لتحسين الهضم.",
  },
  "obesity": {
    title: "Obesity Management - إدارة السمنة | Feel Great",
    description: "نهج علمي شامل لإدارة السمنة. فهم الأسباب الأيضية والسلوكية وخطة العلاج.",
  },
  "pcos": {
    title: "PCOS - متلازمة تكيس المبايض | Feel Great",
    description: "دليل متلازمة تكيس المبايض: العلاقة بمقاومة الإنسولين والحلول الغذائية.",
  },
  "cholesterol": {
    title: "Cholesterol Management - إدارة الكوليسترول | Feel Great",
    description: "فهم الكوليسترول وإدارته بشكل طبيعي. الفرق بين HDL و LDL والحلول الغذائية.",
  },
  "hypertension": {
    title: "Hypertension - ارتفاع ضغط الدم | Feel Great",
    description: "دليل ارتفاع ضغط الدم: الأسباب، المخاطر، والحلول الطبيعية المدعومة بالعلم.",
  },
};

/**
 * Get meta data for a blog article from database
 */
async function getArticleMeta(slug: string): Promise<MetaData | null> {
  try {
    const article = await getArticleBySlug(slug);
    if (!article) return null;

    const title = article.metaTitleEn || article.titleEn || article.titleAr;
    const description = article.metaDescriptionEn || article.excerptEn || article.excerptAr;
    const image = article.heroImageUrl || article.ogImageUrl || DEFAULT_IMAGE;
    const publishedAt = article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined;
    const updatedAt = article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined;

    // Build Article JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": image.startsWith("/") ? `${BASE_URL}${image}` : image,
      "author": {
        "@type": "Person",
        "@id": `${BASE_URL}/#feras-alayed`,
        "name": AUTHOR_NAME,
        "url": `${BASE_URL}/author/feras-alayed`,
      },
      "publisher": {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        "name": SITE_NAME,
        "logo": { "@type": "ImageObject", "url": `${BASE_URL}${DEFAULT_IMAGE}` },
      },
      "datePublished": publishedAt,
      "dateModified": updatedAt || publishedAt,
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/blog/${slug}` },
      "wordCount": article.wordCount || undefined,
      "articleSection": article.category,
    };

    return {
      title: `${title} | ${SITE_NAME}`,
      description: description?.substring(0, 160) || "",
      ogTitle: title,
      ogDescription: description?.substring(0, 200) || "",
      ogImage: image.startsWith("/") ? `${BASE_URL}${image}` : image,
      ogType: "article",
      ogUrl: `${BASE_URL}/blog/${slug}`,
      twitterTitle: title,
      twitterDescription: description?.substring(0, 200) || "",
      twitterImage: image.startsWith("/") ? `${BASE_URL}${image}` : image,
      canonicalUrl: `${BASE_URL}/blog/${slug}`,
      articlePublishedTime: publishedAt,
      articleModifiedTime: updatedAt || publishedAt,
      articleAuthor: AUTHOR_NAME,
      articleSection: article.category,
      jsonLd,
    };
  } catch (error) {
    console.error("[MetaInjector] Error fetching article meta:", error);
    return null;
  }
}

/**
 * Get meta data for a research study from database
 */
async function getResearchMeta(slug: string): Promise<MetaData | null> {
  try {
    const study = await getResearchBySlug(slug);
    if (!study) return null;

    const title = study.metaTitleEn || study.titleEn || study.originalTitle;
    const description = study.metaDescriptionEn || study.summary30sEn || study.summary30sAr;
    const image = study.heroImageUrl || DEFAULT_IMAGE;

    // Build ScholarlyArticle JSON-LD
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      "headline": title,
      "description": description,
      "image": image.startsWith("/") ? `${BASE_URL}${image}` : image,
      "author": study.authors ? study.authors.split(",").map(a => ({
        "@type": "Person",
        "name": a.trim(),
      })) : undefined,
      "publisher": {
        "@type": "Organization",
        "name": study.journal,
      },
      "datePublished": study.publishDate,
      "about": study.topics,
      "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE_URL}/research/${slug}` },
    };

    return {
      title: `${title} | Research | ${SITE_NAME}`,
      description: description?.substring(0, 160) || "",
      ogTitle: title,
      ogDescription: description?.substring(0, 200) || "",
      ogImage: image.startsWith("/") ? `${BASE_URL}${image}` : image,
      ogType: "article",
      ogUrl: `${BASE_URL}/research/${slug}`,
      twitterTitle: title,
      twitterDescription: description?.substring(0, 200) || "",
      canonicalUrl: `${BASE_URL}/research/${slug}`,
      jsonLd,
    };
  } catch (error) {
    console.error("[MetaInjector] Error fetching research meta:", error);
    return null;
  }
}

/**
 * Resolve meta data for any given URL path
 */
async function resolveMetaForPath(path: string): Promise<MetaData | null> {
  // Strip language prefix
  const cleanPath = path.replace(/^\/(ar|en|fr|es|de|tr)(\/|$)/, "/").replace(/\/$/, "") || "/";

  // Check static pages
  if (STATIC_META[cleanPath]) {
    const staticMeta = STATIC_META[cleanPath];
    return {
      ...staticMeta,
      ogTitle: staticMeta.ogTitle || staticMeta.title,
      ogDescription: staticMeta.ogDescription || staticMeta.description,
      twitterTitle: staticMeta.twitterTitle || staticMeta.title,
      twitterDescription: staticMeta.twitterDescription || staticMeta.description,
      canonicalUrl: `${BASE_URL}${cleanPath}`,
      ogUrl: `${BASE_URL}${cleanPath}`,
    };
  }

  // Blog article: /blog/:slug
  const blogMatch = cleanPath.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    return getArticleMeta(blogMatch[1]);
  }

  // Research study: /research/:slug
  const researchMatch = cleanPath.match(/^\/research\/([^/]+)$/);
  if (researchMatch) {
    return getResearchMeta(researchMatch[1]);
  }

  // Pillar pages: /topics/:slug
  const topicMatch = cleanPath.match(/^\/topics\/([^/]+)$/);
  if (topicMatch && PILLAR_META[topicMatch[1]]) {
    const meta = PILLAR_META[topicMatch[1]];
    return { ...meta, canonicalUrl: `${BASE_URL}${cleanPath}`, ogUrl: `${BASE_URL}${cleanPath}`, ogType: "article" };
  }

  // Health condition pages: /health/:slug
  const healthMatch = cleanPath.match(/^\/health\/([^/]+)$/);
  if (healthMatch && HEALTH_META[healthMatch[1]]) {
    const meta = HEALTH_META[healthMatch[1]];
    return { ...meta, canonicalUrl: `${BASE_URL}${cleanPath}`, ogUrl: `${BASE_URL}${cleanPath}`, ogType: "article" };
  }

  return null;
}

/**
 * Inject meta tags into the HTML template
 */
function injectMetaIntoHtml(html: string, meta: MetaData): string {
  const metaTags: string[] = [];

  // Title - handle both regular titles and {{project_title}} placeholder
  if (meta.title) {
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
    html = html.replace(/<title>\{\{project_title\}\}<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  }

  // Description
  if (meta.description) {
    // Replace existing description meta
    html = html.replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escapeAttr(meta.description)}" />`
    );
  }

  // Open Graph
  if (meta.ogTitle) {
    html = html.replace(
      /<meta property="og:title" content="[^"]*"\s*\/?>/,
      `<meta property="og:title" content="${escapeAttr(meta.ogTitle)}" />`
    );
  }
  if (meta.ogDescription) {
    html = html.replace(
      /<meta property="og:description" content="[^"]*"\s*\/?>/,
      `<meta property="og:description" content="${escapeAttr(meta.ogDescription)}" />`
    );
  }
  if (meta.ogImage) {
    html = html.replace(
      /<meta property="og:image" content="[^"]*"\s*\/?>/,
      `<meta property="og:image" content="${escapeAttr(meta.ogImage)}" />`
    );
  }
  if (meta.ogType) {
    html = html.replace(
      /<meta property="og:type" content="[^"]*"\s*\/?>/,
      `<meta property="og:type" content="${escapeAttr(meta.ogType)}" />`
    );
  }

  // Twitter
  if (meta.twitterTitle) {
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeAttr(meta.twitterTitle)}" />`
    );
  }
  if (meta.twitterDescription) {
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeAttr(meta.twitterDescription)}" />`
    );
  }

  // Add additional meta tags before </head>
  const additionalMeta: string[] = [];

  // OG URL
  if (meta.ogUrl) {
    additionalMeta.push(`<meta property="og:url" content="${escapeAttr(meta.ogUrl)}" />`);
  }

  // OG site name
  additionalMeta.push(`<meta property="og:site_name" content="${SITE_NAME}" />`);

  // Article-specific meta
  if (meta.articlePublishedTime) {
    additionalMeta.push(`<meta property="article:published_time" content="${meta.articlePublishedTime}" />`);
  }
  if (meta.articleModifiedTime) {
    additionalMeta.push(`<meta property="article:modified_time" content="${meta.articleModifiedTime}" />`);
  }
  if (meta.articleAuthor) {
    additionalMeta.push(`<meta property="article:author" content="${escapeAttr(meta.articleAuthor)}" />`);
  }
  if (meta.articleSection) {
    additionalMeta.push(`<meta property="article:section" content="${escapeAttr(meta.articleSection)}" />`);
  }

  // Canonical URL
  if (meta.canonicalUrl) {
    additionalMeta.push(`<link rel="canonical" href="${escapeAttr(meta.canonicalUrl)}" />`);
  }

  // JSON-LD structured data
  if (meta.jsonLd) {
    additionalMeta.push(`<script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`);
  }

  // Inject before </head>
  if (additionalMeta.length > 0) {
    html = html.replace("</head>", `    ${additionalMeta.join("\n    ")}\n  </head>`);
  }

  return html;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Express middleware that intercepts HTML responses and injects SEO meta tags
 */
export function createMetaInjectorMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only process GET requests for HTML pages (not API, assets, etc.)
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api/") || req.path.startsWith("/manus-storage/") || req.path.includes(".")) {
      return next();
    }

    // Resolve meta for this path
    const meta = await resolveMetaForPath(req.path);
    if (!meta) return next();

    // Store meta in request for downstream use
    (req as any).__seoMeta = meta;
    next();
  };
}

/**
 * Get the resolved meta from request (set by middleware)
 */
export function getResolvedMeta(req: Request): MetaData | null {
  return (req as any).__seoMeta || null;
}

export { MetaData, resolveMetaForPath, injectMetaIntoHtml };
