import { describe, it, expect } from "vitest";
import { resolveMetaForPath, injectMetaIntoHtml } from "./metaInjector";

describe("SEO Meta Injector", () => {
  describe("resolveMetaForPath", () => {
    it("should resolve meta for homepage", async () => {
      const meta = await resolveMetaForPath("/");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Feel Great");
      expect(meta!.canonicalUrl).toBe("https://feelgreat.us.com/");
    });

    it("should resolve meta for /blog", async () => {
      const meta = await resolveMetaForPath("/blog");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Blog");
      expect(meta!.canonicalUrl).toBe("https://feelgreat.us.com/blog");
    });

    it("should resolve meta for /research", async () => {
      const meta = await resolveMetaForPath("/research");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Research");
      expect(meta!.canonicalUrl).toBe("https://feelgreat.us.com/research");
    });

    it("should resolve meta for /about", async () => {
      const meta = await resolveMetaForPath("/about");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Feras Alayed");
    });

    it("should resolve meta for /author/feras-alayed", async () => {
      const meta = await resolveMetaForPath("/author/feras-alayed");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Feras Alayed");
      expect(meta!.ogType).toBe("profile");
    });

    it("should resolve Arabic meta for /ar/blog", async () => {
      const meta = await resolveMetaForPath("/ar/blog");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("مقالات صحية");
      expect(meta!.lang).toBe("ar");
      expect(meta!.dir).toBe("rtl");
      expect(meta!.hreflangPath).toBe("/blog");
    });

    it("should resolve French meta for /fr/blog", async () => {
      const meta = await resolveMetaForPath("/fr/blog");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Blog Santé");
      expect(meta!.lang).toBe("fr");
      expect(meta!.dir).toBe("ltr");
    });

    it("should include hreflangPath for static pages", async () => {
      const meta = await resolveMetaForPath("/faq");
      expect(meta).not.toBeNull();
      expect(meta!.hreflangPath).toBe("/faq");
    });

    it("should set canonical URL with language prefix for non-English", async () => {
      const meta = await resolveMetaForPath("/es/research");
      expect(meta).not.toBeNull();
      expect(meta!.canonicalUrl).toBe("https://feelgreat.us.com/es/research");
    });

    it("should strip trailing slash before resolving", async () => {
      const meta = await resolveMetaForPath("/research/");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Research");
    });

    it("should return null for unknown paths", async () => {
      const meta = await resolveMetaForPath("/unknown-page-xyz");
      expect(meta).toBeNull();
    });

    it("should resolve meta for /today-in-health-science", async () => {
      const meta = await resolveMetaForPath("/today-in-health-science");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("Health Science");
    });

    it("should resolve meta for /faq", async () => {
      const meta = await resolveMetaForPath("/faq");
      expect(meta).not.toBeNull();
      expect(meta!.title).toContain("FAQ");
    });
  });

  describe("injectMetaIntoHtml", () => {
    const baseHtml = `<!doctype html>
<html lang="en">
<head>
    <title>{{project_title}}</title>
    <meta name="description" content="default description" />
    <meta property="og:title" content="default og title" />
    <meta property="og:description" content="default og desc" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/default.png" />
    <meta name="twitter:title" content="default twitter" />
    <meta name="twitter:description" content="default twitter desc" />
</head>
<body><div id="root"></div></body>
</html>`;

    it("should inject title", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test Page | Feel Great",
        description: "Test description",
      });
      expect(result).toContain("<title>Test Page | Feel Great</title>");
      expect(result).not.toContain("{{project_title}}");
    });

    it("should inject description", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "New description here",
      });
      expect(result).toContain('content="New description here"');
      expect(result).not.toContain("default description");
    });

    it("should inject Open Graph tags", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "Desc",
        ogTitle: "OG Title",
        ogDescription: "OG Desc",
        ogImage: "https://example.com/image.png",
        ogType: "article",
      });
      expect(result).toContain('og:title" content="OG Title"');
      expect(result).toContain('og:description" content="OG Desc"');
      expect(result).toContain('og:image" content="https://example.com/image.png"');
      expect(result).toContain('og:type" content="article"');
    });

    it("should inject canonical URL", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "Desc",
        canonicalUrl: "https://feelgreat.us.com/blog/test",
      });
      expect(result).toContain('rel="canonical" href="https://feelgreat.us.com/blog/test"');
    });

    it("should inject hreflang tags when hreflangPath is provided", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "Desc",
        hreflangPath: "/blog",
      });
      expect(result).toContain('hreflang="ar" href="https://feelgreat.us.com/ar/blog"');
      expect(result).toContain('hreflang="en" href="https://feelgreat.us.com/blog"');
      expect(result).toContain('hreflang="fr" href="https://feelgreat.us.com/fr/blog"');
      expect(result).toContain('hreflang="x-default" href="https://feelgreat.us.com/blog"');
    });

    it("should update html lang and dir attributes for Arabic", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "Desc",
        lang: "ar",
        dir: "rtl",
      });
      expect(result).toContain('<html lang="ar" dir="rtl">');
    });

    it("should inject og:locale for the detected language", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "Desc",
        lang: "fr",
      });
      expect(result).toContain('og:locale" content="fr_FR"');
    });

    it("should inject JSON-LD structured data", () => {
      const jsonLd = { "@context": "https://schema.org", "@type": "Article", "headline": "Test" };
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "Desc",
        jsonLd,
      });
      expect(result).toContain('application/ld+json');
      expect(result).toContain('"@type":"Article"');
    });

    it("should inject article timestamps", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test",
        description: "Desc",
        articlePublishedTime: "2026-01-01T00:00:00Z",
        articleModifiedTime: "2026-06-01T00:00:00Z",
      });
      expect(result).toContain('article:published_time" content="2026-01-01T00:00:00Z"');
      expect(result).toContain('article:modified_time" content="2026-06-01T00:00:00Z"');
    });

    it("should escape HTML entities in title", () => {
      const result = injectMetaIntoHtml(baseHtml, {
        title: "Test & <script>alert('xss')</script>",
        description: "Safe",
      });
      expect(result).toContain("&amp;");
      expect(result).toContain("&lt;script&gt;");
      expect(result).not.toContain("<script>alert");
    });
  });
});
