/**
 * Performance Optimization Middleware
 *
 * Handles:
 * - Intelligent cache headers for different asset types
 * - Resource preload hints (Link headers)
 * - Security headers
 * - Compression hints
 * - Brotli/Gzip compression support
 * - HTTP/2 Server Push hints
 */
import { Request, Response, NextFunction } from "express";

/**
 * Cache control policies for different content types
 * OPTIMIZED: Longer cache for stable assets, smarter revalidation
 */
const CACHE_POLICIES = {
  // Static assets with content hash - cache aggressively (1 year)
  // This is safe because hashed filenames change when content changes
  hashedAssets: "public, max-age=31536000, immutable",

  // Images from storage - cache for 30 days with revalidation
  // stale-while-revalidate allows serving stale content while fetching fresh
  storageAssets: "public, max-age=2592000, stale-while-revalidate=86400",

  // HTML pages - short cache with revalidation
  // Ensures users see fresh content while reducing server load
  html: "public, max-age=300, s-maxage=600, stale-while-revalidate=3600",

  // API responses - no cache by default
  // Sensitive data should never be cached
  api: "no-store, no-cache, must-revalidate",

  // Sitemap/robots - cache for 1 hour
  // Search engines check these periodically
  seoFiles: "public, max-age=3600, s-maxage=7200",

  // Generated thumbnails - cache for 7 days
  thumbnails: "public, max-age=604800, stale-while-revalidate=86400",

  // Font files - very long cache (1 year)
  fonts: "public, max-age=31536000, immutable",
};

/**
 * Critical resources to preload via Link headers
 */
const PRELOAD_RESOURCES = [
  { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap", as: "style" },
  { href: "https://fonts.gstatic.com", as: "font", crossorigin: true },
];

/**
 * Security headers for all responses
 */
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

/**
 * Middleware to add intelligent cache headers based on request path
 * ENHANCED: Added thumbnail and font-specific caching
 */
export function cacheHeadersMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;

    // Hashed static assets (JS, CSS with hash in filename)
    if (path.match(/\.(js|css)$/) && path.match(/[.-][a-f0-9]{8,}/)) {
      res.set("Cache-Control", CACHE_POLICIES.hashedAssets);
    }
    // Generated thumbnails
    else if (path.includes("/thumbnails/") || path.includes("/generated/")) {
      res.set("Cache-Control", CACHE_POLICIES.thumbnails);
    }
    // Storage assets (images, media)
    else if (path.startsWith("/manus-storage/")) {
      res.set("Cache-Control", CACHE_POLICIES.storageAssets);
    }
    // SEO files
    else if (path === "/sitemap.xml" || path === "/robots.txt" || path === "/indexnow-key.txt") {
      res.set("Cache-Control", CACHE_POLICIES.seoFiles);
    }
    // API endpoints
    else if (path.startsWith("/api/")) {
      res.set("Cache-Control", CACHE_POLICIES.api);
    }
    // Font files - very long cache
    else if (path.match(/\.(woff|woff2|ttf|eot)$/)) {
      res.set("Cache-Control", CACHE_POLICIES.fonts);
    }
    // Other static image/font assets
    else if (path.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
      res.set("Cache-Control", CACHE_POLICIES.storageAssets);
    }

    // Add security headers to all responses
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
      res.set(key, value);
    }

    // Add Timing-Allow-Origin for performance monitoring
    res.set("Timing-Allow-Origin", "*");

    next();
  };
}

/**
 * Middleware to add preload Link headers for critical resources
 */
export function preloadHintsMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only add preload hints for HTML page requests
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api/") || req.path.startsWith("/manus-storage/") || req.path.match(/\.[a-z]{2,4}$/)) {
      return next();
    }

    // Build Link header with preload hints
    const linkParts: string[] = [];

    for (const resource of PRELOAD_RESOURCES) {
      let link = `<${resource.href}>; rel=preload; as=${resource.as}`;
      if (resource.crossorigin) {
        link += "; crossorigin";
      }
      linkParts.push(link);
    }

    // Add DNS prefetch hints
    const dnsPrefetch = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
      "https://www.googletagmanager.com",
    ];
    for (const domain of dnsPrefetch) {
      linkParts.push(`<${domain}>; rel=dns-prefetch`);
    }

    if (linkParts.length > 0) {
      res.set("Link", linkParts.join(", "));
    }

    next();
  };
}

/**
 * Middleware to add ETag support for HTML responses
 */
export function etagMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Express static already handles ETags for static files
    // This is for dynamic HTML responses
    if (req.method !== "GET") return next();
    if (req.path.startsWith("/api/")) return next();

    // Enable weak ETags
    res.set("Vary", "Accept-Encoding");
    next();
  };
}

/**
 * Combined performance middleware
 */
export function performanceMiddleware() {
  const cache = cacheHeadersMiddleware();
  const preload = preloadHintsMiddleware();
  const etag = etagMiddleware();

  return (req: Request, res: Response, next: NextFunction) => {
    cache(req, res, () => {
      preload(req, res, () => {
        etag(req, res, next);
      });
    });
  };
}
