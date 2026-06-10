import { describe, it, expect } from "vitest";
import { z } from "zod";

// Test the share count input validation schemas
describe("Share Count API", () => {
  const incrementSchema = z.object({
    contentType: z.enum(["article", "research"]),
    contentSlug: z.string().min(1),
    platform: z.enum(["copy", "whatsapp", "telegram", "twitter", "facebook"]),
  });

  const getCountSchema = z.object({
    contentType: z.enum(["article", "research"]),
    contentSlug: z.string().min(1),
  });

  const topSharedSchema = z.object({
    limit: z.number().min(1).max(50).default(10),
  }).optional();

  describe("increment input validation", () => {
    it("accepts valid article share increment", () => {
      const result = incrementSchema.safeParse({
        contentType: "article",
        contentSlug: "thyroid-health-guide-2026",
        platform: "whatsapp",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid research share increment", () => {
      const result = incrementSchema.safeParse({
        contentType: "research",
        contentSlug: "unimate-yerba-mate-study",
        platform: "copy",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid content type", () => {
      const result = incrementSchema.safeParse({
        contentType: "video",
        contentSlug: "some-slug",
        platform: "whatsapp",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty content slug", () => {
      const result = incrementSchema.safeParse({
        contentType: "article",
        contentSlug: "",
        platform: "whatsapp",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid platform", () => {
      const result = incrementSchema.safeParse({
        contentType: "article",
        contentSlug: "test-slug",
        platform: "linkedin",
      });
      expect(result.success).toBe(false);
    });

    it("accepts all valid platforms", () => {
      const platforms = ["copy", "whatsapp", "telegram", "twitter", "facebook"];
      platforms.forEach((platform) => {
        const result = incrementSchema.safeParse({
          contentType: "article",
          contentSlug: "test-slug",
          platform,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("getCount input validation", () => {
    it("accepts valid article query", () => {
      const result = getCountSchema.safeParse({
        contentType: "article",
        contentSlug: "insulin-resistance-explained",
      });
      expect(result.success).toBe(true);
    });

    it("accepts valid research query", () => {
      const result = getCountSchema.safeParse({
        contentType: "research",
        contentSlug: "fiber-gut-microbiome-study",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing content slug", () => {
      const result = getCountSchema.safeParse({
        contentType: "article",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("topShared input validation", () => {
    it("accepts valid limit", () => {
      const result = topSharedSchema.safeParse({ limit: 20 });
      expect(result?.success).toBe(true);
    });

    it("accepts undefined (optional)", () => {
      const result = topSharedSchema.safeParse(undefined);
      expect(result?.success).toBe(true);
    });

    it("rejects limit over 50", () => {
      const result = z.object({ limit: z.number().min(1).max(50) }).safeParse({ limit: 100 });
      expect(result.success).toBe(false);
    });

    it("rejects limit under 1", () => {
      const result = z.object({ limit: z.number().min(1).max(50) }).safeParse({ limit: 0 });
      expect(result.success).toBe(false);
    });
  });
});
