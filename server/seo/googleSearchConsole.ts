/**
 * Google Search Console API Integration
 * 
 * Uses service account authentication to:
 * - Submit sitemaps
 * - Request URL indexing
 * - Query search analytics
 * - Check URL inspection status
 */
import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

const SITE_URL = "https://feelgreat.us.com";
// GSC uses the "sc-domain:" prefix for domain properties or the full URL for URL-prefix properties
const GSC_SITE_URL = "sc-domain:feelgreat.us.com";

let authClient: GoogleAuth | null = null;

/**
 * Get authenticated Google Auth client using service account
 */
function getAuthClient(): GoogleAuth {
  if (authClient) return authClient;

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON environment variable is not set");
  }

  const credentials = JSON.parse(serviceAccountJson);

  authClient = new GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/webmasters",
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/indexing",
    ],
  });

  return authClient;
}

/**
 * Get Search Console API client
 */
function getSearchConsole() {
  const auth = getAuthClient();
  return google.searchconsole({ version: "v1", auth: auth as any });
}

/**
 * Get Indexing API client
 */
function getIndexingApi() {
  const auth = getAuthClient();
  return google.indexing({ version: "v3", auth: auth as any });
}

/**
 * Verify the service account connection by listing sites
 */
export async function verifyConnection(): Promise<{
  success: boolean;
  sites?: string[];
  error?: string;
}> {
  try {
    const webmasters = google.webmasters({ version: "v3", auth: getAuthClient() as any });
    const response = await webmasters.sites.list();
    const sites = response.data.siteEntry?.map(s => s.siteUrl || "") || [];
    return { success: true, sites };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * Submit a sitemap to Google Search Console
 */
export async function submitSitemap(sitemapUrl: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const webmasters = google.webmasters({ version: "v3", auth: getAuthClient() as any });
    await webmasters.sitemaps.submit({
      siteUrl: GSC_SITE_URL,
      feedpath: sitemapUrl,
    });
    return { success: true };
  } catch (error: any) {
    // Try with URL-prefix property
    try {
      const webmasters = google.webmasters({ version: "v3", auth: getAuthClient() as any });
      await webmasters.sitemaps.submit({
        siteUrl: SITE_URL + "/",
        feedpath: sitemapUrl,
      });
      return { success: true };
    } catch (innerError: any) {
      return { success: false, error: innerError.message || String(innerError) };
    }
  }
}

/**
 * Get sitemap status from GSC
 */
export async function getSitemapStatus(): Promise<{
  success: boolean;
  sitemaps?: Array<{ path: string; lastSubmitted?: string; isPending?: boolean; errors?: number; warnings?: number }>;
  error?: string;
}> {
  try {
    const webmasters = google.webmasters({ version: "v3", auth: getAuthClient() as any });
    const response = await webmasters.sitemaps.list({
      siteUrl: GSC_SITE_URL,
    });
    const sitemaps = response.data.sitemap?.map(s => ({
      path: s.path || "",
      lastSubmitted: s.lastSubmitted || undefined,
      isPending: s.isPending || false,
      errors: s.errors ? Number(s.errors) : 0,
      warnings: s.warnings ? Number(s.warnings) : 0,
    })) || [];
    return { success: true, sitemaps };
  } catch (error: any) {
    // Try URL-prefix property
    try {
      const webmasters = google.webmasters({ version: "v3", auth: getAuthClient() as any });
      const response = await webmasters.sitemaps.list({
        siteUrl: SITE_URL + "/",
      });
      const sitemaps = response.data.sitemap?.map(s => ({
        path: s.path || "",
        lastSubmitted: s.lastSubmitted || undefined,
        isPending: s.isPending || false,
        errors: s.errors ? Number(s.errors) : 0,
        warnings: s.warnings ? Number(s.warnings) : 0,
      })) || [];
      return { success: true, sitemaps };
    } catch (innerError: any) {
      return { success: false, error: innerError.message || String(innerError) };
    }
  }
}

/**
 * Request URL indexing via Google Indexing API
 * Note: Indexing API is primarily for JobPosting and BroadcastEvent pages
 * For other pages, use URL Inspection API
 */
export async function requestIndexing(url: string, type: "URL_UPDATED" | "URL_DELETED" = "URL_UPDATED"): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const indexing = getIndexingApi();
    await indexing.urlNotifications.publish({
      requestBody: {
        url,
        type,
      },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * Batch request indexing for multiple URLs
 */
export async function batchRequestIndexing(urls: string[]): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const url of urls) {
    const result = await requestIndexing(url);
    if (result.success) {
      success++;
    } else {
      failed++;
      errors.push(`${url}: ${result.error}`);
    }
    // Rate limiting - 200 requests per day, space them out
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return { success, failed, errors };
}

/**
 * Get search analytics data from GSC
 */
export async function getSearchAnalytics(options: {
  startDate: string; // YYYY-MM-DD
  endDate: string;
  dimensions?: string[];
  rowLimit?: number;
}): Promise<{
  success: boolean;
  data?: Array<{ keys: string[]; clicks: number; impressions: number; ctr: number; position: number }>;
  error?: string;
}> {
  try {
    const searchconsole = getSearchConsole();
    const response = await searchconsole.searchanalytics.query({
      siteUrl: GSC_SITE_URL,
      requestBody: {
        startDate: options.startDate,
        endDate: options.endDate,
        dimensions: options.dimensions || ["page"],
        rowLimit: options.rowLimit || 100,
      },
    });

    const data = response.data.rows?.map(row => ({
      keys: row.keys || [],
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    })) || [];

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * URL Inspection API - check if a URL is indexed
 */
export async function inspectUrl(url: string): Promise<{
  success: boolean;
  inspectionResult?: {
    indexStatusResult?: {
      coverageState?: string;
      indexingState?: string;
      lastCrawlTime?: string;
    };
  };
  error?: string;
}> {
  try {
    const searchconsole = getSearchConsole();
    const response = await (searchconsole as any).urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: url,
        siteUrl: GSC_SITE_URL,
      },
    });
    return { success: true, inspectionResult: response.data.inspectionResult };
  } catch (error: any) {
    return { success: false, error: error.message || String(error) };
  }
}

export { SITE_URL, GSC_SITE_URL };
