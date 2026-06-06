import type { Express } from "express";
import { ENV } from "./env";

/**
 * In-memory cache for presigned URLs to avoid repeated Forge API calls.
 * Presigned URLs typically last 1 hour, so we cache for 50 minutes.
 */
const urlCache = new Map<string, { url: string; expires: number }>();
const CACHE_TTL_MS = 50 * 60 * 1000; // 50 minutes

function getCachedUrl(key: string): string | null {
  const entry = urlCache.get(key);
  if (entry && Date.now() < entry.expires) {
    return entry.url;
  }
  if (entry) {
    urlCache.delete(key);
  }
  return null;
}

function setCachedUrl(key: string, url: string) {
  urlCache.set(key, { url, expires: Date.now() + CACHE_TTL_MS });
  // Evict old entries if cache grows too large
  if (urlCache.size > 500) {
    const now = Date.now();
    const keysToDelete: string[] = [];
    urlCache.forEach((v, k) => {
      if (now >= v.expires) keysToDelete.push(k);
    });
    keysToDelete.forEach(k => urlCache.delete(k));
  }
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }

    try {
      // Check in-memory cache first
      let signedUrl = getCachedUrl(key);

      if (!signedUrl) {
        const forgeUrl = new URL(
          "v1/storage/presign/get",
          ENV.forgeApiUrl.replace(/\/+$/, "") + "/",
        );
        forgeUrl.searchParams.set("path", key);

        const forgeResp = await fetch(forgeUrl, {
          headers: { Authorization: `Bearer ${ENV.forgeApiKey}` },
        });

        if (!forgeResp.ok) {
          const body = await forgeResp.text().catch(() => "");
          console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
          res.status(502).send("Storage backend error");
          return;
        }

        const { url } = (await forgeResp.json()) as { url: string };
        if (!url) {
          res.status(502).send("Empty signed URL from backend");
          return;
        }

        signedUrl = url;
        setCachedUrl(key, signedUrl);
      }

      // Set aggressive browser caching - images/assets rarely change
      // Browser will cache the redirect target for 30 days
      res.set("Cache-Control", "public, max-age=2592000, stale-while-revalidate=86400");
      res.set("Vary", "Accept-Encoding");
      res.redirect(307, signedUrl);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
