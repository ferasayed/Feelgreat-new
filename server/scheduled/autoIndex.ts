/**
 * Automatic Indexing Scheduled Handler
 * 
 * Runs daily to:
 * 1. Collect all published URLs (articles, research, static pages)
 * 2. Submit them to IndexNow for rapid indexing
 * 3. Ping Google and Bing about sitemap updates
 * 4. Log results for monitoring
 */
import type { Request, Response } from "express";
import { sdk } from "../_core/sdk";
import { getPublishedArticles, getPublishedResearch } from "../db";
import { notifySearchEngines, getIndexNowConfig } from "../seo/indexing";

const BASE_URL = "https://feelgreat.us.com";

/**
 * Static pages that should always be submitted
 */
const STATIC_URLS = [
  "/",
  "/blog",
  "/research",
  "/today-in-health-science",
  "/about",
  "/author/feras-alayed",
  "/partner",
  "/faq",
  "/health-assessment",
  "/topics/insulin-resistance",
  "/topics/gut-health",
  "/topics/intermittent-fasting",
  "/topics/weight-management",
  "/topics/metabolic-health",
  "/health/insulin-resistance",
  "/health/type-2-diabetes",
  "/health/metabolic-syndrome",
  "/health/fatty-liver",
  "/health/chronic-fatigue",
];

export async function autoIndexHandler(req: Request, res: Response) {
  try {
    // Authenticate cron request
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron) {
      return res.status(403).json({ error: "cron-only" });
    }

    console.log("[AutoIndex] Starting daily indexing submission...");

    // Collect all published content URLs
    const articles = await getPublishedArticles(500, 0);
    const research = await getPublishedResearch(500, 0);

    const allUrls = [
      ...STATIC_URLS.map(path => `${BASE_URL}${path}`),
      ...articles.map(a => `${BASE_URL}/blog/${a.slug}`),
      ...research.map(r => `${BASE_URL}/research/${r.slug}`),
    ];

    // Submit to all search engines
    const result = await notifySearchEngines(allUrls);

    const summary = {
      ok: true,
      timestamp: new Date().toISOString(),
      totalUrls: allUrls.length,
      articles: articles.length,
      research: research.length,
      staticPages: STATIC_URLS.length,
      indexNow: result.indexNow,
      googlePing: result.googlePing,
      bingPing: result.bingPing,
    };

    console.log("[AutoIndex] Daily indexing complete:", JSON.stringify(summary));
    return res.json(summary);
  } catch (error: any) {
    console.error("[AutoIndex] Error:", error);
    return res.status(500).json({
      error: error.message || "Unknown error",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      context: { url: req.url, taskUid: (req as any).taskUid },
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Manual trigger endpoint (for admin use without cron auth)
 */
export async function manualIndexHandler(req: Request, res: Response) {
  try {
    console.log("[AutoIndex] Manual indexing triggered...");

    const articles = await getPublishedArticles(500, 0);
    const research = await getPublishedResearch(500, 0);

    const allUrls = [
      ...STATIC_URLS.map(path => `${BASE_URL}${path}`),
      ...articles.map(a => `${BASE_URL}/blog/${a.slug}`),
      ...research.map(r => `${BASE_URL}/research/${r.slug}`),
    ];

    const result = await notifySearchEngines(allUrls);

    return res.json({
      ok: true,
      totalUrls: allUrls.length,
      indexNow: result.indexNow,
      googlePing: result.googlePing,
      bingPing: result.bingPing,
      config: getIndexNowConfig(),
    });
  } catch (error: any) {
    console.error("[AutoIndex] Manual trigger error:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
