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
 *   GET /api/framer/v1/landing           - Landing page data (latest 3 articles + 3 research)
 *   GET /api/framer/v1/cms/schema        - CMS Collection schema definition for Framer plugins
 *   POST /api/framer/v1/webhooks/register - Register a webhook URL for content updates
 *   GET /api/framer/v1/webhooks          - List registered webhooks
 *   DELETE /api/framer/v1/webhooks/:id   - Remove a webhook
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

  // ==================== LANDING PAGE ====================

  /**
   * GET /landing
   * Get landing page data: latest 3 articles + latest 3 research studies
   * Optimized for Framer Fetch - single request for hero section
   */
  router.get("/landing", cacheList, async (_req: Request, res: Response) => {
    try {
      const [articles, research, articlesCount, researchCount] = await Promise.all([
        getPublishedArticles(3, 0),
        getPublishedResearch(3, 0),
        getArticlesCount(),
        getResearchCount(),
      ]);

      res.json({
        latestArticles: articles.map(formatArticleForFramer),
        latestResearch: research.map(formatResearchForFramer),
        stats: {
          totalArticles: articlesCount,
          totalResearch: researchCount,
          lastUpdated: new Date().toISOString(),
        },
        links: {
          allArticles: "https://feelgreat.us.com/blog",
          allResearch: "https://feelgreat.us.com/research",
          mainSite: "https://feelgreat.us.com",
          partnerSite: "https://feelgreatap-h8jahypk.manus.space",
        },
      });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching landing data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ==================== CMS COLLECTION SCHEMA ====================

  /**
   * GET /cms/schema
   * Returns the CMS Collection schema definition for Framer plugins.
   * Use this to configure a Managed Collection in Framer.
   */
  router.get("/cms/schema", cacheDetail, async (_req: Request, res: Response) => {
    try {
      res.json({
        collections: {
          articles: {
            name: "Feel Great Articles",
            fields: [
              { id: "title_en", name: "Title (EN)", type: "string" },
              { id: "title_ar", name: "Title (AR)", type: "string" },
              { id: "excerpt_en", name: "Excerpt (EN)", type: "string" },
              { id: "excerpt_ar", name: "Excerpt (AR)", type: "string" },
              { id: "content_en", name: "Content (EN)", type: "formattedText" },
              { id: "content_ar", name: "Content (AR)", type: "formattedText" },
              { id: "category", name: "Category", type: "string" },
              { id: "hero_image", name: "Hero Image", type: "image" },
              { id: "author", name: "Author", type: "string" },
              { id: "published_at", name: "Published Date", type: "date" },
              { id: "word_count", name: "Word Count", type: "number" },
              { id: "url", name: "Article URL", type: "link" },
              { id: "meta_title_en", name: "Meta Title (EN)", type: "string" },
              { id: "meta_description_en", name: "Meta Description (EN)", type: "string" },
            ],
          },
          research: {
            name: "Feel Great Research",
            fields: [
              { id: "title_en", name: "Title (EN)", type: "string" },
              { id: "title_ar", name: "Title (AR)", type: "string" },
              { id: "summary_en", name: "Summary (EN)", type: "string" },
              { id: "summary_ar", name: "Summary (AR)", type: "string" },
              { id: "content_en", name: "Content (EN)", type: "formattedText" },
              { id: "content_ar", name: "Content (AR)", type: "formattedText" },
              { id: "journal", name: "Journal", type: "string" },
              { id: "study_type", name: "Study Type", type: "string" },
              { id: "evidence_level", name: "Evidence Level", type: "string" },
              { id: "impact_score", name: "Impact Score", type: "number" },
              { id: "hero_image", name: "Hero Image", type: "image" },
              { id: "publish_date", name: "Publish Date", type: "date" },
              { id: "url", name: "Research URL", type: "link" },
              { id: "product_relevance", name: "Product Relevance", type: "string" },
            ],
          },
        },
        syncEndpoints: {
          articles: "/api/framer/v1/cms/articles",
          research: "/api/framer/v1/cms/research",
        },
      });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching CMS schema:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /cms/articles
   * Returns all articles in Framer CMS Collection item format
   * Ready for direct import into a Framer Managed Collection
   */
  router.get("/cms/articles", cacheList, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const articles = await getPublishedArticles(limit, 0);

      const items = articles.map((article: any) => ({
        id: String(article.id),
        slug: article.slug,
        draft: false,
        fieldData: {
          title_en: article.titleEn || article.title || "",
          title_ar: article.titleAr || "",
          excerpt_en: article.excerptEn || article.excerpt || "",
          excerpt_ar: article.excerptAr || "",
          content_en: article.contentEn || article.content || "",
          content_ar: article.contentAr || "",
          category: article.category || "",
          hero_image: article.heroImage || "",
          author: article.authorName || "Feras Alayed",
          published_at: article.publishedAt || article.createdAt || new Date().toISOString(),
          word_count: article.wordCount || 0,
          url: `https://feelgreat.us.com/blog/${article.slug}`,
          meta_title_en: article.metaTitleEn || article.titleEn || "",
          meta_description_en: article.metaDescriptionEn || article.excerptEn || "",
        },
      }));

      res.json({ items, total: items.length });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching CMS articles:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /cms/research
   * Returns all research studies in Framer CMS Collection item format
   */
  router.get("/cms/research", cacheList, async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
      const studies = await getPublishedResearch(limit, 0);

      const items = studies.map((study: any) => ({
        id: String(study.id),
        slug: study.slug,
        draft: false,
        fieldData: {
          title_en: study.titleEn || study.title || "",
          title_ar: study.titleAr || "",
          summary_en: study.summaryEn || study.summary || "",
          summary_ar: study.summaryAr || "",
          content_en: study.contentEn || study.content || "",
          content_ar: study.contentAr || "",
          journal: study.journal || "",
          study_type: study.studyType || "",
          evidence_level: study.evidenceLevel || "",
          impact_score: study.impactScore || 0,
          hero_image: study.heroImage || "",
          publish_date: study.publishDate || study.createdAt || new Date().toISOString(),
          url: `https://feelgreat.us.com/research/${study.slug}`,
          product_relevance: study.productRelevance || "",
        },
      }));

      res.json({ items, total: items.length });
    } catch (error: any) {
      console.error("[FramerAPI] Error fetching CMS research:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ==================== WEBHOOKS ====================

  /**
   * POST /webhooks/register
   * Register a webhook URL to receive notifications when new content is published.
   * Body: { url: string, events: string[], secret?: string }
   * Events: "article.published", "research.published", "content.updated"
   */
  router.post("/webhooks/register", async (req: Request, res: Response) => {
    try {
      const { url, events, secret } = req.body || {};

      if (!url || !events || !Array.isArray(events)) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Required: url (string), events (array of event types)",
          availableEvents: ["article.published", "research.published", "content.updated"],
        });
      }

      // Validate URL
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: "Invalid URL format" });
      }

      // Store webhook in memory (in production, store in DB)
      const webhookId = `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const webhook = {
        id: webhookId,
        url,
        events,
        secret: secret || null,
        createdAt: new Date().toISOString(),
        active: true,
      };

      // Add to in-memory store
      webhookStore.push(webhook);

      res.status(201).json({
        data: webhook,
        message: "Webhook registered successfully. You will receive POST notifications at the specified URL.",
      });
    } catch (error: any) {
      console.error("[FramerAPI] Error registering webhook:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /webhooks
   * List all registered webhooks
   */
  router.get("/webhooks", async (_req: Request, res: Response) => {
    res.json({ data: webhookStore });
  });

  /**
   * DELETE /webhooks/:id
   * Remove a registered webhook
   */
  router.delete("/webhooks/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const index = webhookStore.findIndex((wh) => wh.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Webhook not found" });
    }
    webhookStore.splice(index, 1);
    res.json({ message: "Webhook removed successfully" });
  });

  return router;
}

// ==================== WEBHOOK STORE & DISPATCHER ====================

interface Webhook {
  id: string;
  url: string;
  events: string[];
  secret: string | null;
  createdAt: string;
  active: boolean;
}

// In-memory webhook store (persists across requests but not restarts)
// For production, move to database
const webhookStore: Webhook[] = [];

/**
 * Dispatch webhook notifications to all registered URLs
 * Call this from article/research generation handlers when content is published
 */
export async function dispatchWebhook(event: string, payload: Record<string, any>) {
  const relevantWebhooks = webhookStore.filter(
    (wh) => wh.active && wh.events.includes(event)
  );

  for (const webhook of relevantWebhooks) {
    try {
      const body = JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data: payload,
      });

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Webhook-Event": event,
      };

      if (webhook.secret) {
        // Simple HMAC signature for verification
        const crypto = await import("crypto");
        const signature = crypto
          .createHmac("sha256", webhook.secret)
          .update(body)
          .digest("hex");
        headers["X-Webhook-Signature"] = signature;
      }

      await fetch(webhook.url, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(10000),
      });

      console.log(`[Webhook] Dispatched ${event} to ${webhook.url}`);
    } catch (error: any) {
      console.error(`[Webhook] Failed to dispatch to ${webhook.url}:`, error.message);
    }
  }
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
