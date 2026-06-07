import { describe, it, expect, vi } from "vitest";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          subjectA: "🌿 هل تعرف هذه الأسرار الصحية الجديدة؟",
          subjectB: "📰 مقالات جديدة لتحسين صحتك اليوم"
        })
      }
    }]
  })
}));

// Mock the db module
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    execute: vi.fn().mockResolvedValue([{ insertId: 1 }])
  })
}));

describe("A/B Testing Module", () => {
  describe("generateSubjectVariants", () => {
    it("should generate two subject variants via LLM", async () => {
      const { generateSubjectVariants } = await import("./abTesting");
      const result = await generateSubjectVariants(
        ["مقال عن الصحة", "فوائد الرياضة"],
        "ar"
      );
      expect(result).toHaveProperty("subjectA");
      expect(result).toHaveProperty("subjectB");
      expect(result.subjectA.length).toBeGreaterThan(0);
      expect(result.subjectB.length).toBeGreaterThan(0);
    });

    it("should return fallback subjects when LLM fails", async () => {
      const { invokeLLM } = await import("./_core/llm");
      (invokeLLM as any).mockRejectedValueOnce(new Error("LLM error"));

      const { generateSubjectVariants } = await import("./abTesting");
      const result = await generateSubjectVariants(["test"], "en");
      expect(result.subjectA).toContain("health");
      expect(result.subjectB).toContain("health");
    });
  });

  describe("getABTestHistory", () => {
    it("should return empty array when no tests exist", async () => {
      const { getDb } = await import("./db");
      (getDb as any).mockResolvedValueOnce({
        execute: vi.fn().mockResolvedValue([[]])
      });

      const { getABTestHistory } = await import("./abTesting");
      const result = await getABTestHistory();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("A/B Test Flow", () => {
    it("should not create A/B test with fewer than 20 subscribers", async () => {
      const { createABTest } = await import("./abTesting");
      const result = await createABTest({
        subscribers: Array.from({ length: 10 }, (_, i) => ({
          email: `user${i}@test.com`,
          language: "ar",
        })),
        articles: [{ titleAr: "مقال", titleEn: "Article", slug: "test" }],
        research: [],
        baseUrl: "https://feelgreat.us.com",
      });
      expect(result).toBeNull();
    });

    it("should create A/B test with 20+ subscribers", async () => {
      const { getDb } = await import("./db");
      (getDb as any).mockResolvedValueOnce({
        execute: vi.fn().mockResolvedValue([{ insertId: 42 }])
      });

      const { createABTest } = await import("./abTesting");
      const result = await createABTest({
        subscribers: Array.from({ length: 50 }, (_, i) => ({
          email: `user${i}@test.com`,
          language: "ar",
        })),
        articles: [
          { titleAr: "مقال صحي", titleEn: "Health Article", slug: "health-1" },
          { titleAr: "فوائد الرياضة", titleEn: "Exercise Benefits", slug: "exercise-1" },
        ],
        research: [],
        baseUrl: "https://feelgreat.us.com",
      });

      expect(result).not.toBeNull();
      if (result) {
        expect(result.testId).toBe(42);
        expect(result.subjectA.length).toBeGreaterThan(0);
        expect(result.subjectB.length).toBeGreaterThan(0);
        expect(result.groupACount).toBeGreaterThanOrEqual(5);
        expect(result.groupBCount).toBeGreaterThanOrEqual(5);
        expect(result.remainingCount).toBeGreaterThan(0);
        expect(result.groupACount + result.groupBCount + result.remainingCount).toBe(50);
      }
    });
  });
});
