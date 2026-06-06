/**
 * Automatic Indexing System
 * 
 * Notifies search engines of new/updated content via:
 * 1. IndexNow API (Bing, Yandex, Naver, Seznam)
 * 2. Google Ping (sitemap update notification)
 * 3. Bing Webmaster Ping
 * 
 * No Search Console user access required - works with public APIs only.
 */

const BASE_URL = "https://feelgreat.us.com";
const INDEXNOW_KEY = "feelgreat-indexnow-2026";

// IndexNow endpoints - submitting to one notifies all participating engines
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

/**
 * Submit a single URL to IndexNow
 */
export async function submitToIndexNow(url: string): Promise<{
  success: boolean;
  responses: Array<{ endpoint: string; status: number; ok: boolean }>;
}> {
  const responses: Array<{ endpoint: string; status: number; ok: boolean }> = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const params = new URLSearchParams({
        url,
        key: INDEXNOW_KEY,
      });

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      responses.push({
        endpoint,
        status: response.status,
        ok: response.status >= 200 && response.status < 300,
      });

      // If one succeeds, all IndexNow partners get notified
      if (response.ok) break;
    } catch (error) {
      responses.push({ endpoint, status: 0, ok: false });
    }
  }

  return {
    success: responses.some(r => r.ok),
    responses,
  };
}

/**
 * Submit multiple URLs to IndexNow in batch
 */
export async function batchSubmitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  submitted: number;
  failed: number;
  error?: string;
}> {
  if (urls.length === 0) {
    return { success: true, submitted: 0, failed: 0 };
  }

  try {
    // IndexNow batch API
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "feelgreat.us.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/indexnow-key.txt`,
        urlList: urls,
      }),
    });

    if (response.ok || response.status === 202) {
      return { success: true, submitted: urls.length, failed: 0 };
    }

    // Fallback: submit individually
    let submitted = 0;
    let failed = 0;
    for (const url of urls.slice(0, 100)) { // Max 100 per batch
      const result = await submitToIndexNow(url);
      if (result.success) submitted++;
      else failed++;
      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return { success: submitted > 0, submitted, failed };
  } catch (error: any) {
    return { success: false, submitted: 0, failed: urls.length, error: error.message };
  }
}

/**
 * Ping Google about sitemap update
 * Google deprecated the ping endpoint in 2023, but sitemap submission via Search Console
 * or sitemap index in robots.txt is the recommended approach.
 * We still ping as a courtesy - Google will crawl based on robots.txt sitemap reference.
 */
export async function pingGoogle(): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
    const response = await fetch(
      `https://www.google.com/ping?sitemap=${sitemapUrl}`,
      { method: "GET" }
    );
    return { success: response.ok, status: response.status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Ping Bing about sitemap update
 */
export async function pingBing(): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const sitemapUrl = encodeURIComponent(`${BASE_URL}/sitemap.xml`);
    const response = await fetch(
      `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
      { method: "GET" }
    );
    return { success: response.ok, status: response.status };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Notify all search engines about new content
 * This is the main function to call when new content is published
 */
export async function notifySearchEngines(urls: string[]): Promise<{
  indexNow: { success: boolean; submitted: number; failed: number };
  googlePing: { success: boolean };
  bingPing: { success: boolean };
}> {
  // Full URLs
  const fullUrls = urls.map(url => url.startsWith("http") ? url : `${BASE_URL}${url}`);

  // Submit to IndexNow (notifies Bing, Yandex, Naver, Seznam)
  const indexNow = await batchSubmitToIndexNow(fullUrls);

  // Ping Google and Bing about sitemap update
  const googlePing = await pingGoogle();
  const bingPing = await pingBing();

  console.log(`[Indexing] Notified search engines: IndexNow=${indexNow.submitted}/${fullUrls.length}, Google=${googlePing.success}, Bing=${bingPing.success}`);

  return { indexNow, googlePing, bingPing };
}

/**
 * Notify search engines about a single new article
 */
export async function notifyNewArticle(slug: string): Promise<void> {
  const urls = [
    `${BASE_URL}/blog/${slug}`,
    `${BASE_URL}/sitemap.xml`, // Also notify about sitemap change
  ];

  await notifySearchEngines(urls);
}

/**
 * Notify search engines about a single new research study
 */
export async function notifyNewResearch(slug: string): Promise<void> {
  const urls = [
    `${BASE_URL}/research/${slug}`,
    `${BASE_URL}/sitemap.xml`,
  ];

  await notifySearchEngines(urls);
}

/**
 * Get IndexNow verification status
 */
export function getIndexNowConfig() {
  return {
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/indexnow-key.txt`,
    host: "feelgreat.us.com",
    endpoints: INDEXNOW_ENDPOINTS,
  };
}
