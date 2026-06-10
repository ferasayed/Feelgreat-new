/**
 * Framer Public API
 * 
 * Public REST endpoints for Framer CMS integration.
 * Provides articles, research studies, and content data via JSON.
 * Protected by API key authentication.
 * 
 * Base path: /api/framer/v1
 * 
 * Endpoints:
 *   GET /api/framer/v1/articles          - List published articles (paginated)
 *   GET /api/framer/v1/articles/:slug    - Get single article by slug
 *   GET /api/framer/v1/research          - List published research studies (paginated)
 *   GET /api/framer/v1/research/:slug    - Get single research study by slug
 *   GET /api/framer/v1/stats             - Get content stats (counts)
 */

import { Router, Request, Response, NextFunction } from "express";
import {
  getPublishedArticles,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesCount,
  getPublishedResearch,
  getResearchBySlug,
  getResearchByTopic,
  getResearchCount,
} from "./db";

// The Framer API key - stored in environment
const FRAMER_API_KEY = process.env.FRAMER_API_KEY || "";

/**
 * CORS middleware for Framer domains
 */
function framerCors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin || "";
  
  // Allow Framer domains and the partner site
  const allowedOrigins = [
    "https://framer.com",
    "https://app.framer.com",
    "https://feelgreatap-h8jahypk.manus.space",
    "https://feelgreat.us.com",
    "https://www.feelgreat.us.com",
  ];
  
  // Also allow any *.framer.app and *.framercanvas.com subdomains
  const isFramerDomain = origin.endsWith(".framer.app") || 
                          origin.endsWith(".framercanvas.com") ||
                          origin.endsWith(".framer.website") ||
                          origin.endsWith(".manus.space");
  
  if (allowedOrigins.includes(origin) || isFramerDomain || !origin) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
  
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  
  next();
}

/**
 * API Key authentication middleware
 */
function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;
  
  if (!FRAMER_API_KEY) {
    // If no API key is configured, allow access (development mode)
    return next();
  }
  
  if (!apiKey || apiKey !== FRAMER_API_KEY) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or missing API key. Include X-API-Key header or api_key query parameter.",
    });
  }
  
  next();
}

/**
 * Create the Framer API router
 */
export function createFramerApiRouter(): Router {
  const router = Router();
  
  // Apply CORS and auth to all routes
  router.use(framerCors);
  router.use(authenticateApiKey);
  
  // Cache control - 5 minutes for lists, 10 minutes for details
  const cacheList = (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300");
    next();
  };
  const cacheDetail = (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cache-Control", "public, max-age=600, s-maxage=600");
    next();
  };

  // ==================== ARTICLES ====================

  /**
   * GET /articles
   * List published articles with pagination and optional category filter
   * 
   * Query params:
   *   limit    - Number of articles (default: 20, max: 100)
   *   offset   - Pagination offset (default: 0)
   *   category - Filter by category (optional)
   */
  router.get("/articles", cacheList, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;

      let articles;
      if (category) {
        articles = await getArticlesByCategory(category, limit);
      } else {
        articles = await getPublishedArticles(limit, offset);
      }

      const total = await getArticlesCount();

      // Transform to Framer-friendly format
      const items = articles.map(formatArticleForFramer);

      res.json({
        data: items,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching articles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /articles/:slug
   * Get a single article by slug
   */
  router.get("/articles/:slug", cacheDetail, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const article = await getArticleBySlug(slug);

      if (!article || !article.isPublished) {
        return res.status(404).json({ error: "Article not found" });
      }

      res.json({ data: formatArticleDetailForFramer(article) });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching article:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ==================== RESEARCH ====================

  /**
   * GET /research
   * List published research studies with pagination and optional topic filter
   * 
   * Query params:
   *   limit  - Number of studies (default: 20, max: 100)
   *   offset - Pagination offset (default: 0)
   *   topic  - Filter by topic (optional)
   */
  router.get("/research", cacheList, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = parseInt(req.query.offset as string) || 0;
      const topic = req.query.topic as string;

      let studies;
      if (topic) {
        studies = await getResearchByTopic(topic, limit);
      } else {
        studies = await getPublishedResearch(limit, offset);
      }

      const total = await getResearchCount();

      const items = studies.map(formatResearchForFramer);

      res.json({
        data: items,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching research:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /research/:slug
   * Get a single research study by slug
   */
  router.get("/research/:slug", cacheDetail, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const study = await getResearchBySlug(slug);

      if (!study || !study.isPublished) {
        return res.status(404).json({ error: "Research study not found" });
      }

      res.json({ data: formatResearchDetailForFramer(study) });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching research study:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ==================== STATS ====================

  /**
   * GET /stats
   * Get content statistics
   */
  router.get("/stats", cacheList, async (_req: Request, res: Response) => {
    try {
      const [articlesCount, researchCount] = await Promise.all([
        getArticlesCount(),
        getResearchCount(),
      ]);

      res.json({
        data: {
          articles: articlesCount,
          research: researchCount,
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
}

// ==================== FORMATTERS ====================

/**
 * Format article for list view (lighter payload)
 */
function formatArticleForFramer(article: any) {
  return {
    id: article.id,
    slug: article.slug,
    title: {
      en: article.titleEn || article.title || "",
      ar: article.titleAr || "",
    },
    excerpt: {
      en: article.excerptEn || article.excerpt || "",
      ar: article.excerptAr || "",
    },
    category: article.category || "",
    cluster: article.clusterId || "",
    heroImage: article.heroImage || null,
    author: article.authorName || "Feras Alayed",
    publishedAt: article.publishedAt || article.createdAt,
    updatedAt: article.updatedAt || article.createdAt,
    wordCount: article.wordCount || 0,
    url: `https://feelgreat.us.com/blog/${article.slug}`,
  };
}

/**
 * Format article for detail view (full content)
 */
function formatArticleDetailForFramer(article: any) {
  return {
    ...formatArticleForFramer(article),
    content: {
      en: article.contentEn || article.content || "",
      ar: article.contentAr || "",
    },
    metaTitle: {
      en: article.metaTitleEn || article.titleEn || "",
      ar: article.metaTitleAr || article.titleAr || "",
    },
    metaDescription: {
      en: article.metaDescriptionEn || article.excerptEn || "",
      ar: article.metaDescriptionAr || article.excerptAr || "",
    },
    faq: article.faqSchema ? (typeof article.faqSchema === "string" ? JSON.parse(article.faqSchema) : article.faqSchema) : null,
    internalLinks: article.internalLinks ? (typeof article.internalLinks === "string" ? JSON.parse(article.internalLinks) : article.internalLinks) : [],
    tags: article.tags || "",
    pillarId: article.pillarId || null,
  };
}

/**
 * Format research study for list view
 */
function formatResearchForFramer(study: any) {
  return {
    id: study.id,
    slug: study.slug,
    title: {
      en: study.titleEn || study.title || "",
      ar: study.titleAr || "",
    },
    summary: {
      en: study.summaryEn || study.summary || "",
      ar: study.summaryAr || "",
    },
    journal: study.journal || "",
    studyType: study.studyType || "",
    evidenceLevel: study.evidenceLevel || "",
    impactScore: study.impactScore || 0,
    publishDate: study.publishDate || study.createdAt,
    topics: study.topics ? (typeof study.topics === "string" ? JSON.parse(study.topics) : study.topics) : [],
    heroImage: study.heroImage || null,
    url: `https://feelgreat.us.com/research/${study.slug}`,
  };
}

/**
 * Format research study for detail view (full content)
 */
function formatResearchDetailForFramer(study: any) {
  return {
    ...formatResearchForFramer(study),
    content: {
      en: study.contentEn || study.content || "",
      ar: study.contentAr || "",
    },
    keyFindings: study.keyFindings ? (typeof study.keyFindings === "string" ? JSON.parse(study.keyFindings) : study.keyFindings) : [],
    methodology: study.methodology || "",
    sampleSize: study.sampleSize || "",
    duration: study.duration || "",
    authors: study.authors || "",
    doi: study.doi || "",
    feelGreatConnection: {
      en: study.feelGreatConnectionEn || study.feelGreatConnection || "",
      ar: study.feelGreatConnectionAr || "",
    },
    productRelevance: study.productRelevance || "",
  };
}
