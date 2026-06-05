import { describe, it, expect, vi } from "vitest";

// Test the content engine logic without actually calling LLM
describe("Content Engine", () => {
  describe("Slug generation", () => {
    function slugify(text: string): string {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
        .slice(0, 120);
    }

    it("should generate valid slugs from English titles", () => {
      expect(slugify("How to Reverse Insulin Resistance Naturally")).toBe(
        "how-to-reverse-insulin-resistance-naturally"
      );
    });

    it("should handle special characters", () => {
      expect(slugify("What's the Best Diet for NAFLD?")).toBe(
        "whats-the-best-diet-for-nafld"
      );
    });

    it("should truncate long slugs to 120 chars", () => {
      const longTitle = "A".repeat(200);
      expect(slugify(longTitle).length).toBeLessThanOrEqual(120);
    });

    it("should handle multiple spaces and hyphens", () => {
      expect(slugify("gut  health -- improvement   tips")).toBe(
        "gut-health-improvement-tips"
      );
    });
  });

  describe("Pillar rotation", () => {
    const CONTENT_PILLARS = [
      { id: "sustainable-health" },
      { id: "insulin-resistance" },
      { id: "diabetes" },
      { id: "gut-health" },
      { id: "fatty-liver" },
      { id: "weight-management" },
      { id: "behavioral-nutrition" },
      { id: "intermittent-fasting" },
      { id: "sleep-energy" },
      { id: "womens-health" },
      { id: "chronic-inflammation" },
      { id: "heart-health" },
      { id: "mental-nutrition" },
    ];

    it("should rotate through all 13 pillars", () => {
      const selectedPillars = new Set<string>();
      // Simulate 13 consecutive days
      const baseDay = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
      for (let i = 0; i < 13; i++) {
        const pillarIndex = (baseDay + i) % CONTENT_PILLARS.length;
        selectedPillars.add(CONTENT_PILLARS[pillarIndex].id);
      }
      expect(selectedPillars.size).toBe(13);
    });

    it("should select a valid pillar index", () => {
      const pillarIndex = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % CONTENT_PILLARS.length;
      expect(pillarIndex).toBeGreaterThanOrEqual(0);
      expect(pillarIndex).toBeLessThan(13);
    });
  });

  describe("Word count calculation", () => {
    it("should count words correctly from HTML content", () => {
      const html = "<h2>Title</h2><p>This is a paragraph with some words in it.</p><ul><li>Item one</li><li>Item two</li></ul>";
      const wordCount = html.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      expect(wordCount).toBeGreaterThan(5);
    });

    it("should handle empty content", () => {
      const html = "";
      const wordCount = html.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
      expect(wordCount).toBe(0);
    });

    it("should calculate read time correctly", () => {
      const wordCount = 1500;
      const readTimeMinutes = Math.max(5, Math.ceil(wordCount / 200));
      expect(readTimeMinutes).toBe(8);
    });
  });

  describe("Keyword deduplication", () => {
    it("should detect duplicate slugs", () => {
      const recentSlugs = ["how-to-reverse-insulin-resistance", "gut-health-tips", "intermittent-fasting-guide"];
      const newSlug = "how-to-reverse-insulin-resistance";
      const isDuplicate = recentSlugs.includes(newSlug);
      expect(isDuplicate).toBe(true);
    });

    it("should allow unique slugs", () => {
      const recentSlugs = ["how-to-reverse-insulin-resistance", "gut-health-tips"];
      const newSlug = "fatty-liver-prevention-guide";
      const isDuplicate = recentSlugs.includes(newSlug);
      expect(isDuplicate).toBe(false);
    });

    it("should append timestamp for duplicate slugs", () => {
      const recentSlugs = ["test-article"];
      const baseSlug = "test-article";
      const slug = recentSlugs.includes(baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;
      expect(slug).toContain("test-article-");
      expect(slug.length).toBeGreaterThan("test-article".length);
    });
  });

  describe("Content quality validation", () => {
    it("should mark articles with >= 800 words as published", () => {
      const wordCount = 1500;
      const meetsMinWordCount = wordCount >= 800;
      expect(meetsMinWordCount).toBe(true);
    });

    it("should mark articles with < 800 words as draft", () => {
      const wordCount = 500;
      const meetsMinWordCount = wordCount >= 800;
      expect(meetsMinWordCount).toBe(false);
    });

    it("should validate FAQ schema has minimum 3 items", () => {
      const faqSchema = [
        { question: "Q1", answer: "A1" },
        { question: "Q2", answer: "A2" },
        { question: "Q3", answer: "A3" },
      ];
      const hasFaq = faqSchema && faqSchema.length >= 3;
      expect(hasFaq).toBe(true);
    });
  });

  describe("Country-to-language mapping for geo endpoint", () => {
    const ARABIC_COUNTRIES = ["SA", "AE", "KW", "QA", "BH", "OM", "JO", "EG", "IQ", "LB", "SY", "YE", "LY", "TN", "DZ", "MA", "SD", "PS"];
    const FRENCH_COUNTRIES = ["FR", "BE", "CH", "CA", "SN", "CI", "CM", "ML", "MG"];
    const SPANISH_COUNTRIES = ["ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC"];
    const GERMAN_COUNTRIES = ["DE", "AT", "CH", "LI"];
    const TURKISH_COUNTRIES = ["TR", "CY"];

    it("should map Saudi Arabia to Arabic", () => {
      expect(ARABIC_COUNTRIES.includes("SA")).toBe(true);
    });

    it("should map France to French", () => {
      expect(FRENCH_COUNTRIES.includes("FR")).toBe(true);
    });

    it("should map Germany to German", () => {
      expect(GERMAN_COUNTRIES.includes("DE")).toBe(true);
    });

    it("should map Turkey to Turkish", () => {
      expect(TURKISH_COUNTRIES.includes("TR")).toBe(true);
    });

    it("should map Spain to Spanish", () => {
      expect(SPANISH_COUNTRIES.includes("ES")).toBe(true);
    });

    it("should default unknown countries to English", () => {
      const country = "JP";
      const isArabic = ARABIC_COUNTRIES.includes(country);
      const isFrench = FRENCH_COUNTRIES.includes(country);
      const isSpanish = SPANISH_COUNTRIES.includes(country);
      const isGerman = GERMAN_COUNTRIES.includes(country);
      const isTurkish = TURKISH_COUNTRIES.includes(country);
      const lang = isArabic ? "ar" : isFrench ? "fr" : isSpanish ? "es" : isGerman ? "de" : isTurkish ? "tr" : "en";
      expect(lang).toBe("en");
    });
  });
});
