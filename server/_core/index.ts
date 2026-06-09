import "dotenv/config";
import express from "express";
import compression from "compression";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { followUpHandler } from "../scheduled/followUp";
import { followUpSequenceHandler } from "../scheduled/followUpSequence";
import { generateArticleHandler } from "../scheduled/generateArticle";
import { autoIndexHandler, manualIndexHandler } from "../scheduled/autoIndex";
import { healthMonitorHandler } from "../scheduled/healthMonitor";
import { handleTranslateContent } from "../scheduled/translateContent";
import { weeklyNewsletterHandler } from "../scheduled/weeklyNewsletter";
import { weeklyReportHandler } from "../scheduled/weeklyReport";
import { resendWebhookHandler } from "../emailAnalytics";
import { batchImageRegenHandler } from "../scheduled/batchImageRegen";
import { createHeartbeatJob, listHeartbeatJobs, updateHeartbeatJob } from "./heartbeat";
import { performanceMiddleware } from "../seo/performance";
import { prerenderMiddleware } from "../seo/prerender";

// XML escape utility for RSS feeds
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Compression - gzip/brotli for all responses
  app.use(compression());

  // Performance middleware - cache headers, preload hints, security headers
  app.use(performanceMiddleware());

  // Prerender middleware - serves pre-rendered HTML to search engine bots
  app.use(prerenderMiddleware());

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // Scheduled task handlers
  app.post("/api/scheduled/followUp", followUpHandler);
  app.post("/api/scheduled/followUpSequence", followUpSequenceHandler);
  app.post("/api/scheduled/generateArticle", generateArticleHandler);
  app.post("/api/scheduled/autoIndex", autoIndexHandler);
  app.post("/api/scheduled/healthMonitor", healthMonitorHandler);
  app.post("/api/scheduled/translateContent", handleTranslateContent);
  app.post("/api/scheduled/weeklyNewsletter", weeklyNewsletterHandler);
  app.post("/api/scheduled/weeklyReport", weeklyReportHandler);
  app.post("/api/scheduled/batchImageRegen", batchImageRegenHandler);
  app.post("/api/manual-index", manualIndexHandler);
  // Resend webhook for email analytics (opens, clicks, bounces)
  app.post("/api/webhooks/resend", resendWebhookHandler);

  // Seed article endpoint - bypasses cron auth for initial blog population
  app.post("/api/seed-article", async (req, res) => {
    try {
      const { seedArticleHandler } = await import("../scheduled/seedArticle");
      return seedArticleHandler(req, res);
    } catch (error: any) {
      console.error("[SeedArticle] Error:", error);
      return res.status(500).json({ error: error.message || "Unknown error" });
    }
  });

  // Research discovery endpoint - discovers and summarizes new PubMed studies
  app.post("/api/scheduled/discoverResearch", async (req, res) => {
    try {
      const { discoverResearchHandler } = await import("../scheduled/discoverResearch");
      return discoverResearchHandler(req, res);
    } catch (error: any) {
      console.error("[ResearchDiscovery] Error:", error);
      return res.status(500).json({ error: error.message || "Unknown error" });
    }
  });

  // Seed research endpoint - same as above but without cron auth
  app.post("/api/seed-research", async (req, res) => {
    try {
      const { discoverResearchHandler } = await import("../scheduled/discoverResearch");
      return discoverResearchHandler(req, res);
    } catch (error: any) {
      console.error("[ResearchDiscovery] Error:", error);
      return res.status(500).json({ error: error.message || "Unknown error" });
    }
  });

  // Batch research seed endpoint - generates studies for underserved topics
  app.post("/api/scheduled/batchResearchSeed", async (req, res) => {
    try {
      const { batchResearchSeedHandler } = await import("../scheduled/batchResearchSeed");
      return batchResearchSeedHandler(req, res);
    } catch (error: any) {
      console.error("[BatchResearchSeed] Error:", error);
      return res.status(500).json({ error: error.message || "Unknown error" });
    }
  });

  // Dynamic sitemap.xml - auto-includes all published blog articles AND research studies
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { getPublishedArticles, getPublishedResearch } = await import("../db");
      const articles = await getPublishedArticles(1000, 0);
      const researchStudies = await getPublishedResearch(1000, 0);
      const baseUrl = "https://feelgreat.us.com";
      const languages = ["ar", "en", "fr", "es", "de", "tr"];

      // Static pages with their priorities
      const staticPages = [
        { path: "/", changefreq: "weekly", priority: "1.0" },
        { path: "/partner", changefreq: "monthly", priority: "0.9" },
        { path: "/founder", changefreq: "monthly", priority: "0.8" },
        { path: "/blog", changefreq: "daily", priority: "0.9" },
        { path: "/research", changefreq: "daily", priority: "0.9" },
        { path: "/today-in-health-science", changefreq: "daily", priority: "0.9" },
        { path: "/faq", changefreq: "monthly", priority: "0.8" },
        { path: "/health", changefreq: "weekly", priority: "0.9" },
        { path: "/about", changefreq: "monthly", priority: "0.8" },
        { path: "/health-assessment", changefreq: "monthly", priority: "0.8" },
        { path: "/business-opportunity", changefreq: "monthly", priority: "0.8" },
        { path: "/reviews", changefreq: "weekly", priority: "0.7" },
        { path: "/success-stories", changefreq: "weekly", priority: "0.7" },
        { path: "/90-day-journey", changefreq: "monthly", priority: "0.7" },
        { path: "/topics", changefreq: "weekly", priority: "0.8" },
        { path: "/health/insulin-resistance", changefreq: "monthly", priority: "0.8" },
        { path: "/health/type-2-diabetes", changefreq: "monthly", priority: "0.8" },
        { path: "/health/fatty-liver", changefreq: "monthly", priority: "0.8" },
        { path: "/health/ibs-digestive", changefreq: "monthly", priority: "0.8" },
        { path: "/health/obesity", changefreq: "monthly", priority: "0.8" },
        { path: "/health/pcos", changefreq: "monthly", priority: "0.8" },
        { path: "/health/cholesterol", changefreq: "monthly", priority: "0.8" },
        { path: "/health/hypertension", changefreq: "monthly", priority: "0.8" },
        // Health Library Pillar Pages (high priority - independent ranking pages)
        { path: "/health-library", changefreq: "weekly", priority: "0.9" },
        { path: "/health-library/sustainable-health", changefreq: "weekly", priority: "0.95" },
        { path: "/health-library/insulin-resistance", changefreq: "weekly", priority: "0.9" },
        { path: "/health-library/gut-health", changefreq: "weekly", priority: "0.9" },
        { path: "/health-library/weight-loss", changefreq: "weekly", priority: "0.9" },
        { path: "/health-library/sleep", changefreq: "weekly", priority: "0.9" },
        { path: "/health-library/womens-health", changefreq: "weekly", priority: "0.9" },
        { path: "/health-library/metabolic-health", changefreq: "weekly", priority: "0.9" },
        { path: "/feras-alayed", changefreq: "weekly", priority: "1.0" },
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

      // Static pages with hreflang alternates
      for (const page of staticPages) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        // Add hreflang alternates for each language
        for (const lang of languages) {
          const langPath = lang === "en" ? page.path : `/${lang}${page.path}`;
          xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}${langPath}" />\n`;
        }
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${page.path}" />\n`;
        xml += `  </url>\n`;
      }

      // Dynamic blog articles (use updatedAt for accurate lastmod)
      for (const article of articles) {
        const lastmod = article.updatedAt || article.publishedAt || article.createdAt;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/blog/${article.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      // Dynamic research studies
      for (const study of researchStudies) {
        const lastmod = study.createdAt;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/research/${study.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;

      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=3600"); // Cache 1 hour
      res.send(xml);
    } catch (error) {
      console.error("[Sitemap] Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Google News Sitemap
  app.get("/news-sitemap.xml", async (req, res) => {
    try {
      const { getPublishedArticles } = await import("../db");
      const articles = await getPublishedArticles(50, 0);
      const baseUrl = "https://feelgreat.us.com";
      // Get articles published in the last 48 hours (Google News requirement)
      const recentArticles = articles.filter((a: any) => {
        const pubDate = new Date(a.publishedAt || a.createdAt);
        const hoursDiff = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff <= 48;
      });
      // If no articles in 48h, get the 10 most recent
      const newsArticles = recentArticles.length > 0 ? recentArticles : articles.slice(0, 10);

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
      xml += `        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n`;

      for (const article of newsArticles) {
        const pubDate = new Date(article.publishedAt || article.createdAt).toISOString();
        const title = (article.titleEn || article.titleAr || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/blog/${article.slug}</loc>\n`;
        xml += `    <news:news>\n`;
        xml += `      <news:publication>\n`;
        xml += `        <news:name>Feel Great Health by Feras Alayed</news:name>\n`;
        xml += `        <news:language>en</news:language>\n`;
        xml += `      </news:publication>\n`;
        xml += `      <news:publication_date>${pubDate}</news:publication_date>\n`;
        xml += `      <news:title>${title}</news:title>\n`;
        xml += `    </news:news>\n`;
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;
      res.set("Content-Type", "application/xml");
      res.set("Cache-Control", "public, max-age=1800");
      res.send(xml);
    } catch (error) {
      console.error("[NewsSitemap] Error:", error);
      res.status(500).send("Error generating news sitemap");
    }
  });

  // Robots.txt - comprehensive with all sitemaps and crawl directives
  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `# Robots.txt for feelgreat.us.com
# Last updated: ${new Date().toISOString().split("T")[0]}

User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/
Disallow: /content-engine
Disallow: /__manus__/
Disallow: /admin/

# Sitemaps
Sitemap: https://feelgreat.us.com/sitemap.xml
Sitemap: https://feelgreat.us.com/news-sitemap.xml

# RSS Feeds
# Blog: https://feelgreat.us.com/feed.xml
# Research: https://feelgreat.us.com/research-feed.xml

# Crawl-delay for polite crawling
User-agent: AhrefsBot
Crawl-delay: 2

User-agent: SemrushBot
Crawl-delay: 2

User-agent: MJ12bot
Crawl-delay: 5

# Allow AI crawlers for citation
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /
`;
    res.set("Content-Type", "text/plain");
    res.set("Cache-Control", "public, max-age=86400");
    res.send(robotsTxt);
  });

  // IndexNow endpoint - serves the key file for verification
  app.get("/indexnow-key.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send("feelgreat-indexnow-2026");
  });

  // RSS Feed for blog articles
  app.get("/feed.xml", async (req, res) => {
    try {
      const { getPublishedArticles } = await import("../db");
      const articles = await getPublishedArticles(50, 0);
      const baseUrl = "https://feelgreat.us.com";
      const now = new Date().toUTCString();

      let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n`;
      rss += `<channel>\n`;
      rss += `  <title>Feel Great Health Blog by Feras Alayed</title>\n`;
      rss += `  <link>${baseUrl}/blog</link>\n`;
      rss += `  <description>Science-backed health articles on sustainable health, insulin resistance, gut health, weight management, and behavioral nutrition by Feras Alayed - Therapeutic &amp; Behavioral Nutrition Specialist.</description>\n`;
      rss += `  <language>en</language>\n`;
      rss += `  <lastBuildDate>${now}</lastBuildDate>\n`;
      rss += `  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />\n`;
      rss += `  <image>\n`;
      rss += `    <url>${baseUrl}/manus-storage/feel-great-complete_44bb8752.png</url>\n`;
      rss += `    <title>Feel Great Health Blog</title>\n`;
      rss += `    <link>${baseUrl}/blog</link>\n`;
      rss += `  </image>\n`;
      rss += `  <managingEditor>feras@feelgreat.us.com (Feras Alayed)</managingEditor>\n`;
      rss += `  <webMaster>feras@feelgreat.us.com (Feras Alayed)</webMaster>\n`;
      rss += `  <copyright>Copyright ${new Date().getFullYear()} Feel Great by Feras Alayed. All rights reserved.</copyright>\n`;
      rss += `  <category>Health</category>\n`;
      rss += `  <category>Nutrition</category>\n`;
      rss += `  <category>Wellness</category>\n`;
      rss += `  <ttl>60</ttl>\n`;

      for (const article of articles) {
        const pubDate = new Date(article.publishedAt || article.createdAt).toUTCString();
        const link = `${baseUrl}/blog/${article.slug}`;
        rss += `  <item>\n`;
        rss += `    <title>${escapeXml(article.titleEn || article.titleAr || "")}</title>\n`;
        rss += `    <link>${link}</link>\n`;
        rss += `    <guid isPermaLink="true">${link}</guid>\n`;
        rss += `    <pubDate>${pubDate}</pubDate>\n`;
        rss += `    <dc:creator>Feras Alayed</dc:creator>\n`;
        if (article.metaDescriptionEn) {
          rss += `    <description>${escapeXml(article.metaDescriptionEn)}</description>\n`;
        }
        if (article.category) {
          rss += `    <category>${escapeXml(article.category)}</category>\n`;
        }
        if (article.heroImageUrl) {
          rss += `    <enclosure url="${baseUrl}${article.heroImageUrl}" type="image/png" length="0" />\n`;
        }
        rss += `  </item>\n`;
      }

      rss += `</channel>\n</rss>`;

      res.set("Content-Type", "application/rss+xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600");
      res.send(rss);
    } catch (error) {
      console.error("[RSS] Error generating feed:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });

  // RSS Feed for research studies
  app.get("/research-feed.xml", async (req, res) => {
    try {
      const { getPublishedResearch } = await import("../db");
      const studies = await getPublishedResearch(50, 0);
      const baseUrl = "https://feelgreat.us.com";
      const now = new Date().toUTCString();

      let rss = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      rss += `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">\n`;
      rss += `<channel>\n`;
      rss += `  <title>Feel Great Research Hub - Latest Health Science</title>\n`;
      rss += `  <link>${baseUrl}/research</link>\n`;
      rss += `  <description>Latest peer-reviewed health research summaries from PubMed, Nature, JAMA, Lancet, and top universities. Curated by Feras Alayed.</description>\n`;
      rss += `  <language>en</language>\n`;
      rss += `  <lastBuildDate>${now}</lastBuildDate>\n`;
      rss += `  <atom:link href="${baseUrl}/research-feed.xml" rel="self" type="application/rss+xml" />\n`;
      rss += `  <managingEditor>feras@feelgreat.us.com (Feras Alayed)</managingEditor>\n`;
      rss += `  <copyright>Copyright ${new Date().getFullYear()} Feel Great Research Hub. All rights reserved.</copyright>\n`;
      rss += `  <category>Health Science</category>\n`;
      rss += `  <category>Medical Research</category>\n`;
      rss += `  <ttl>120</ttl>\n`;

      for (const study of studies) {
        const pubDate = new Date(study.createdAt).toUTCString();
        const link = `${baseUrl}/research/${study.slug}`;
        rss += `  <item>\n`;
        rss += `    <title>${escapeXml(study.titleEn || study.titleAr || "")}</title>\n`;
        rss += `    <link>${link}</link>\n`;
        rss += `    <guid isPermaLink="true">${link}</guid>\n`;
        rss += `    <pubDate>${pubDate}</pubDate>\n`;
        rss += `    <dc:creator>Feras Alayed</dc:creator>\n`;
        if (study.summary30sEn) {
          rss += `    <description>${escapeXml(study.summary30sEn)}</description>\n`;
        }
        if (study.journal) {
          rss += `    <category>${escapeXml(study.journal)}</category>\n`;
        }
        if (study.topics) {
          const topics = typeof study.topics === "string" ? JSON.parse(study.topics) : study.topics;
          if (Array.isArray(topics)) {
            for (const t of topics.slice(0, 3)) {
              rss += `    <category>${escapeXml(t)}</category>\n`;
            }
          }
        }
        rss += `  </item>\n`;
      }

      rss += `</channel>\n</rss>`;

      res.set("Content-Type", "application/rss+xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=7200");
      res.send(rss);
    } catch (error) {
      console.error("[RSS] Error generating research feed:", error);
      res.status(500).send("Error generating research RSS feed");
    }
  });

  // Google Search Console verification - HTML meta tag approach
  app.get("/google-site-verification.html", (req, res) => {
    res.set("Content-Type", "text/html");
    res.send(`<html><head><meta name="google-site-verification" content="numeric-habitat-277102" /></head><body>Google Search Console Verification</body></html>`);
  });

  // IndexNow batch submission endpoint - submits multiple URLs at once
  app.post("/api/indexnow/batch", async (req, res) => {
    try {
      const { getPublishedArticles, getPublishedResearch } = await import("../db");
      const baseUrl = "https://feelgreat.us.com";
      const key = "feelgreat-indexnow-2026";

      // Collect all publishable URLs
      const articles = await getPublishedArticles(100, 0);
      const research = await getPublishedResearch(100, 0);

      const urlList = [
        ...articles.map(a => `${baseUrl}/blog/${a.slug}`),
        ...research.map(r => `${baseUrl}/research/${r.slug}`),
        `${baseUrl}/`,
        `${baseUrl}/blog`,
        `${baseUrl}/research`,
        `${baseUrl}/today-in-health-science`,
      ];

      // IndexNow batch API
      const batchPayload = {
        host: "feelgreat.us.com",
        key,
        keyLocation: `${baseUrl}/indexnow-key.txt`,
        urlList: urlList.slice(0, 10000), // IndexNow max 10k per batch
      };

      const indexNowRes = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batchPayload),
        signal: AbortSignal.timeout(15000),
      });

      // Also ping Google sitemap
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(`${baseUrl}/sitemap.xml`)}`, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
      }).catch(() => {});

      console.log(`[IndexNow] Batch submitted ${urlList.length} URLs, status: ${indexNowRes.status}`);
      res.json({ ok: true, urlsSubmitted: urlList.length, indexNowStatus: indexNowRes.status });
    } catch (error: any) {
      console.error("[IndexNow] Batch error:", error);
      res.status(500).json({ ok: false, error: error.message });
    }
  });

  // IP-based geolocation endpoint for auto language detection
  app.get("/api/geo", async (req, res) => {
    try {
      // Try to get real IP from headers (behind proxy)
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
        || (req.headers["x-real-ip"] as string)
        || req.socket.remoteAddress
        || "";
      
      // Skip for localhost/private IPs
      const isPrivate = ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.");
      if (isPrivate) {
        return res.json({ countryCode: null, detected: false });
      }

      // Use ip-api.com (free, no key needed, 45 req/min limit)
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
        signal: AbortSignal.timeout(3000),
      });
      const data = await response.json();
      
      if (data.status === "success") {
        res.json({ countryCode: data.countryCode, detected: true });
      } else {
        res.json({ countryCode: null, detected: false });
      }
    } catch {
      // Fail silently - browser language will be used as fallback
      res.json({ countryCode: null, detected: false });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });

  // Auto-initialize article generation cron jobs on production startup
  if (process.env.NODE_ENV !== "development") {
    initArticleGenJobs().catch((e) => console.error("[Heartbeat] Failed to init article gen jobs:", e));
  }
}

async function initArticleGenJobs() {
  try {
    // Check if jobs already exist
    const existing = await listHeartbeatJobs("");
    const existingNames = existing.jobs.map((j) => j.name);

    // Disable old jobs that were replaced by the new reduced schedule
    const obsoleteJobs = [
      "article-gen-morning",
      "article-gen-afternoon",
      "article-gen-evening",
      "research-seed-morning",
      "research-seed-afternoon",
      "research-seed-evening",
    ];
    for (const oldName of obsoleteJobs) {
      const oldJob = existing.jobs.find((j) => j.name === oldName);
      if (oldJob && oldJob.isEnable) {
        try {
          await updateHeartbeatJob(oldJob.taskUid, { enable: false }, "");
          console.log(`[Heartbeat] Disabled obsolete job: ${oldName}`);
        } catch (e) {
          console.warn(`[Heartbeat] Could not disable ${oldName}:`, e);
        }
      }
    }

    const schedules = [
      // 1 article per day at 8:00 UTC (reduced from 3x daily to conserve LLM credits)
      { name: "article-gen-daily", cron: "0 0 8 * * *", description: "Daily SEO article generation (8:00 UTC) - 1 article/day", path: "/api/scheduled/generateArticle" },
      { name: "auto-index-daily", cron: "0 30 9 * * *", description: "Daily auto-indexing: submit all URLs to IndexNow + ping Google/Bing (9:30 UTC)", path: "/api/scheduled/autoIndex" },
      { name: "auto-index-evening", cron: "0 30 19 * * *", description: "Evening auto-indexing: submit new content to search engines (19:30 UTC)", path: "/api/scheduled/autoIndex" },
      { name: "batch-image-regen", cron: "0 0 3 * * *", description: "Batch image regeneration: generate images for all content without images (3:00 UTC daily)", path: "/api/scheduled/batchImageRegen" },
      // 1 research study per day at 20:00 UTC (reduced from 3x daily to conserve LLM credits)
      { name: "research-seed-daily", cron: "0 0 20 * * *", description: "Daily research study generation (20:00 UTC) - 1 study/day", path: "/api/scheduled/batchResearchSeed" },
    ];

    for (const schedule of schedules) {
      if (!existingNames.includes(schedule.name)) {
        const result = await createHeartbeatJob(
          {
            name: schedule.name,
            cron: schedule.cron,
            path: schedule.path,
            method: "POST",
            description: schedule.description,
          },
          "" // empty = project owner
        );
        console.log(`[Heartbeat] Created job: ${schedule.name} (next: ${result.nextExecutionAt})`);
      } else {
        console.log(`[Heartbeat] Job already exists: ${schedule.name}`);
      }
    }
    console.log("[Heartbeat] Article generation jobs initialized successfully");
  } catch (e) {
    console.error("[Heartbeat] Init error (will retry on next deploy):", e);
  }
}

startServer().catch(console.error);
