import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { resolveMetaForPath, injectMetaIntoHtml } from "../seo/metaInjector";

/**
 * Critical CSS to inline in the HTML head for faster First Contentful Paint.
 * Contains above-the-fold styles that prevent layout shift.
 */
const CRITICAL_CSS = `
<style id="critical-css">
  /* Prevent FOUC and layout shift */
  html { scroll-behavior: smooth; }
  body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
  #root { min-height: 100vh; }
  /* Loading skeleton */
  .min-h-screen { min-height: 100vh; }
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  /* Prevent CLS from font loading */
  @font-face { font-family: 'Inter'; font-display: swap; src: local('Inter'); }
  /* Dark theme base */
  :root { --background: oklch(0.98 0 0); --foreground: oklch(0.15 0 0); }
  .dark { --background: oklch(0.15 0.02 250); --foreground: oklch(0.95 0 0); }
  body { background: var(--background); color: var(--foreground); }
</style>
`;

/**
 * Resource hints to add to the HTML head for faster loading
 */
const RESOURCE_HINTS = `
    <!-- DNS Prefetch & Preconnect for critical third-party resources -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- Preload critical font -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>
`;

/**
 * Inject performance optimizations into HTML template
 */
function injectPerformanceOptimizations(html: string): string {
  // Add critical CSS right after <head> opening
  html = html.replace("<head>", `<head>\n${CRITICAL_CSS}`);

  // Add resource hints before existing preconnect (replace the existing ones to avoid duplicates)
  html = html.replace(
    `<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`,
    RESOURCE_HINTS
  );

  return html;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      // Inject dynamic SEO meta tags based on the requested URL
      // Use originalUrl since express catch-all (*) may modify req.path
      const urlPath = new URL(req.originalUrl, 'http://localhost').pathname;
      const meta = await resolveMetaForPath(urlPath);
      if (meta) {
        template = injectMetaIntoHtml(template, meta);
      }

      // Inject performance optimizations
      template = injectPerformanceOptimizations(template);

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Serve static files with aggressive caching for hashed assets
  app.use(express.static(distPath, {
    maxAge: "1y",
    immutable: true,
    setHeaders(res, filePath) {
      // Only cache hashed files aggressively
      if (filePath.match(/[.-][a-f0-9]{8,}\.(js|css)$/)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=3600");
      }
    },
  }));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", async (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = await fs.promises.readFile(indexPath, "utf-8");

    // Inject dynamic meta tags for production
    const meta = await resolveMetaForPath(_req.path);
    if (meta) {
      html = injectMetaIntoHtml(html, meta);
    }

    res.set("Content-Type", "text/html");
    res.set("Cache-Control", "public, max-age=300, s-maxage=600, stale-while-revalidate=3600");
    res.send(html);
  });
}
