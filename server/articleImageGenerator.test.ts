import { describe, it, expect, vi } from "vitest";
import { injectImagesIntoContent } from "./articleImageGenerator";
import type { ArticleImageSet } from "./articleImageGenerator";

describe("articleImageGenerator", () => {
  describe("injectImagesIntoContent", () => {
    const mockImageSet: ArticleImageSet = {
      hero: {
        type: "hero",
        url: "https://example.com/hero.png",
        prompt: "test prompt",
        altText: "Hero image",
        caption: "",
      },
      infographic: {
        type: "infographic",
        url: "https://example.com/infographic.png",
        prompt: "test prompt",
        altText: "Infographic about health",
        caption: "Health benefits overview",
      },
      product: {
        type: "product",
        url: "https://example.com/product.png",
        prompt: "test prompt",
        altText: "Feel Great products",
        caption: "",
      },
    };

    it("should inject infographic after second H2 tag", () => {
      const content = `<h2>Introduction</h2><p>First section content.</p><h2>Benefits</h2><p>Second section content.</p><h2>Conclusion</h2><p>Final content.</p>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      expect(result).toContain("article-infographic");
      expect(result).toContain("https://example.com/infographic.png");
      // Infographic should be before the second H2
      const infographicPos = result.indexOf("article-infographic");
      const secondH2Pos = result.indexOf("<h2>Benefits</h2>");
      expect(infographicPos).toBeLessThan(secondH2Pos);
    });

    it("should inject product image before CTA section", () => {
      const content = `<h2>Section</h2><p>Content here.</p><div class="article-cta"><h2>CTA Title</h2></div>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      expect(result).toContain("article-product-image");
      expect(result).toContain("https://example.com/product.png");
      // Product image should be before CTA
      const productPos = result.indexOf("article-product-image");
      const ctaPos = result.indexOf('article-cta');
      expect(productPos).toBeLessThan(ctaPos);
    });

    it("should handle content with no H2 tags gracefully", () => {
      const content = `<p>Simple paragraph one.</p><p>Simple paragraph two.</p><p>Simple paragraph three.</p>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      // Should still inject infographic somewhere (fallback at ~40%)
      expect(result).toContain("article-infographic");
      expect(result).toContain("https://example.com/infographic.png");
    });

    it("should handle content with only one H2 tag", () => {
      const content = `<h2>Only Section</h2><p>Content here.</p><p>More content.</p>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      // Should still inject infographic (fallback position)
      expect(result).toContain("article-infographic");
    });

    it("should not inject images when URLs are null", () => {
      const emptyImageSet: ArticleImageSet = {
        hero: null,
        infographic: { type: "infographic", url: null, prompt: "", altText: "", caption: "" },
        product: { type: "product", url: null, prompt: "", altText: "", caption: "" },
      };
      const content = `<h2>Section</h2><p>Content.</p>`;
      const result = injectImagesIntoContent(content, emptyImageSet, false);

      expect(result).not.toContain("article-infographic");
      expect(result).not.toContain("article-product-image");
    });

    it("should include caption when infographic has one", () => {
      const content = `<h2>First</h2><p>Content.</p><h2>Second</h2><p>More content.</p>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      expect(result).toContain("Health benefits overview");
      expect(result).toContain("<figcaption");
    });

    it("should inject product image at ~75% when no CTA div exists", () => {
      const content = `<p>Paragraph 1.</p><p>Paragraph 2.</p><p>Paragraph 3.</p><p>Paragraph 4.</p><p>Paragraph 5.</p>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      expect(result).toContain("article-product-image");
      // Product image should be in the latter half of content
      const productPos = result.indexOf("article-product-image");
      expect(productPos).toBeGreaterThan(result.length * 0.3);
    });

    it("should work with Arabic content", () => {
      const content = `<h2>مقدمة</h2><p>محتوى عربي.</p><h2>الفوائد</h2><p>محتوى آخر.</p>`;
      const result = injectImagesIntoContent(content, mockImageSet, true);

      expect(result).toContain("article-infographic");
      expect(result).toContain("https://example.com/infographic.png");
    });

    it("should use lazy loading for injected images", () => {
      const content = `<h2>First</h2><p>Content.</p><h2>Second</h2><p>More.</p><div class="article-cta"></div>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      // Both injected images should have loading="lazy"
      const imgTags = result.match(/<img[^>]*>/g) || [];
      imgTags.forEach((tag) => {
        expect(tag).toContain('loading="lazy"');
      });
    });

    it("should apply border-radius styling to images", () => {
      const content = `<h2>First</h2><p>Content.</p><h2>Second</h2><p>More.</p>`;
      const result = injectImagesIntoContent(content, mockImageSet, false);

      expect(result).toContain("border-radius: 12px");
    });
  });
});
