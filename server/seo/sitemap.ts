/**
 * Dynamic Sitemap Generator
 * 
 * Generates XML sitemaps for all published content:
 * - Blog articles
 * - Research studies
 * - Static pages
 * - Pillar/topic pages
 * - Health condition pages
 */
import { getPublishedArticles, getPublishedResearch } from "../db";
import type { BlogArticle, ResearchStudy } from "../../drizzle/schema";

const BASE_URL = "https://feelgreat.us.com";

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

/**
 * Generate the main sitemap index
 */
export function generateSitemapIndex(): string {
  const sitemaps = [
    `${BASE_URL}/sitemap-static.xml`,
    `${BASE_URL}/sitemap-blog.xml`,
    `${BASE_URL}/sitemap-research.xml`,
    `${BASE_URL}/sitemap-topics.xml`,
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const sitemap of sitemaps) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${sitemap}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }
  
  xml += '</sitemapindex>';
  return xml;
}

/**
 * Generate sitemap for static pages
 */
export function generateStaticSitemap(): string {
  const staticPages: SitemapEntry[] = [
    { loc: "/", changefreq: "daily", priority: 1.0 },
    { loc: "/blog", changefreq: "daily", priority: 0.9 },
    { loc: "/research", changefreq: "daily", priority: 0.9 },
    { loc: "/about", changefreq: "monthly", priority: 0.7 },
    { loc: "/author/feras-alayed", changefreq: "monthly", priority: 0.8 },
    { loc: "/partner", changefreq: "monthly", priority: 0.7 },
    { loc: "/faq", changefreq: "weekly", priority: 0.6 },
    { loc: "/health-assessment", changefreq: "monthly", priority: 0.7 },
    { loc: "/today-in-health-science", changefreq: "daily", priority: 0.8 },
  ];

  return buildSitemapXml(staticPages);
}

/**
 * Generate sitemap for blog articles
 */
export async function generateBlogSitemap(): Promise<string> {
  try {
    const articles = await getPublishedArticles(500, 0);
    const entries: SitemapEntry[] = articles.map((article: BlogArticle) => ({
      loc: `/blog/${article.slug}`,
      lastmod: article.updatedAt 
        ? new Date(article.updatedAt).toISOString().split("T")[0]
        : article.publishedAt 
          ? new Date(article.publishedAt).toISOString().split("T")[0]
          : undefined,
      changefreq: "weekly" as const,
      priority: 0.8,
    }));

    return buildSitemapXml(entries);
  } catch (error) {
    console.error("[Sitemap] Error generating blog sitemap:", error);
    return buildSitemapXml([]);
  }
}

/**
 * Generate sitemap for research studies
 */
export async function generateResearchSitemap(): Promise<string> {
  try {
    const studies = await getPublishedResearch(500, 0);
    const entries: SitemapEntry[] = studies.map((study: ResearchStudy) => ({
      loc: `/research/${study.slug}`,
      lastmod: study.createdAt 
        ? new Date(study.createdAt).toISOString().split("T")[0]
        : undefined,
      changefreq: "monthly" as const,
      priority: 0.7,
    }));

    return buildSitemapXml(entries);
  } catch (error) {
    console.error("[Sitemap] Error generating research sitemap:", error);
    return buildSitemapXml([]);
  }
}

/**
 * Generate sitemap for topic/pillar pages
 */
export function generateTopicsSitemap(): string {
  const topics: SitemapEntry[] = [
    { loc: "/topics/insulin-resistance", changefreq: "weekly", priority: 0.8 },
    { loc: "/topics/gut-health", changefreq: "weekly", priority: 0.8 },
    { loc: "/topics/intermittent-fasting", changefreq: "weekly", priority: 0.8 },
    { loc: "/topics/weight-management", changefreq: "weekly", priority: 0.8 },
    { loc: "/topics/metabolic-health", changefreq: "weekly", priority: 0.8 },
    { loc: "/health/insulin-resistance", changefreq: "weekly", priority: 0.7 },
    { loc: "/health/type-2-diabetes", changefreq: "weekly", priority: 0.7 },
    { loc: "/health/metabolic-syndrome", changefreq: "weekly", priority: 0.7 },
    { loc: "/health/fatty-liver", changefreq: "weekly", priority: 0.7 },
    { loc: "/health/chronic-fatigue", changefreq: "weekly", priority: 0.7 },
  ];

  return buildSitemapXml(topics);
}

/**
 * Build XML sitemap from entries
 */
function buildSitemapXml(entries: SitemapEntry[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';

  for (const entry of entries) {
    xml += '  <url>\n';
    xml += `    <loc>${BASE_URL}${entry.loc}</loc>\n`;
    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';
  return xml;
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(): string {
  return `# Robots.txt for feelgreat.us.com
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-static.xml
Sitemap: ${BASE_URL}/sitemap-blog.xml
Sitemap: ${BASE_URL}/sitemap-research.xml
Sitemap: ${BASE_URL}/sitemap-topics.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin/API paths
Disallow: /api/
Disallow: /admin/
Disallow: /__manus__/

# Allow specific API paths for structured data
Allow: /api/trpc/blog.getBySlug
Allow: /api/trpc/research.getBySlug
`;
}
