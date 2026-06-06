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
import { createHeartbeatJob, listHeartbeatJobs } from "./heartbeat";
import { performanceMiddleware } from "../seo/performance";
import { prerenderMiddleware } from "../seo/prerender";

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

      // Dynamic blog articles
      for (const article of articles) {
        const lastmod = article.publishedAt || article.createdAt;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/blog/${article.slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString().split("T")[0]}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
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

  // Robots.txt - dynamic to include sitemap URL
  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /api/
Disallow: /content-engine

Sitemap: https://feelgreat.us.com/sitemap.xml
`;
    res.set("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // IndexNow endpoint - serves the key file for verification
  app.get("/indexnow-key.txt", (req, res) => {
    res.set("Content-Type", "text/plain");
    res.send("feelgreat-indexnow-2026");
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

    const schedules = [
      { name: "article-gen-morning", cron: "0 0 6 * * *", description: "Morning SEO article generation (6:00 UTC)" },
      { name: "article-gen-afternoon", cron: "0 0 12 * * *", description: "Afternoon SEO article generation (12:00 UTC)" },
      { name: "article-gen-evening", cron: "0 0 18 * * *", description: "Evening SEO article generation (18:00 UTC)" },
    ];

    for (const schedule of schedules) {
      if (!existingNames.includes(schedule.name)) {
        const result = await createHeartbeatJob(
          {
            name: schedule.name,
            cron: schedule.cron,
            path: "/api/scheduled/generateArticle",
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
