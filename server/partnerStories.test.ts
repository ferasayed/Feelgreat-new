import { describe, it, expect } from "vitest";
import { PARTNER_STORIES, PARTNER_STORY_CATEGORIES } from "@/data/partnerStories";

describe("Partner Stories Data", () => {
  it("should have 142 total stories", () => {
    expect(PARTNER_STORIES.length).toBe(142);
  });

  it("should have 7 categories including 'all'", () => {
    expect(PARTNER_STORY_CATEGORIES.length).toBe(7);
    expect(PARTNER_STORY_CATEGORIES[0].id).toBe("all");
    expect(PARTNER_STORY_CATEGORIES[0].count).toBe(142);
  });

  it("should have correct category counts matching actual data", () => {
    const categoryCounts: Record<string, number> = {};
    PARTNER_STORIES.forEach((s) => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });

    const weightLossCat = PARTNER_STORY_CATEGORIES.find((c) => c.id === "weight-loss");
    expect(weightLossCat).toBeDefined();
    expect(weightLossCat!.count).toBe(categoryCounts["weight-loss"]);

    const diabetesCat = PARTNER_STORY_CATEGORIES.find((c) => c.id === "diabetes-insulin");
    expect(diabetesCat).toBeDefined();
    expect(diabetesCat!.count).toBe(categoryCounts["diabetes-insulin"]);

    const gutCat = PARTNER_STORY_CATEGORIES.find((c) => c.id === "gut-health");
    expect(gutCat).toBeDefined();
    expect(gutCat!.count).toBe(categoryCounts["gut-health"]);

    const generalCat = PARTNER_STORY_CATEGORIES.find((c) => c.id === "general-wellness");
    expect(generalCat).toBeDefined();
    expect(generalCat!.count).toBe(categoryCounts["general-wellness"]);

    const womensCat = PARTNER_STORY_CATEGORIES.find((c) => c.id === "womens-health");
    expect(womensCat).toBeDefined();
    expect(womensCat!.count).toBe(categoryCounts["womens-health"]);

    const thyroidCat = PARTNER_STORY_CATEGORIES.find((c) => c.id === "thyroid");
    expect(thyroidCat).toBeDefined();
    expect(thyroidCat!.count).toBe(categoryCounts["thyroid"]);
  });

  it("every story should have required fields", () => {
    PARTNER_STORIES.forEach((story) => {
      expect(story.id).toBeTruthy();
      expect(story.category).toBeTruthy();
      expect(["before-after", "video"]).toContain(story.type);
      expect(story.thumbnailUrl).toMatch(/^https:\/\/feelgreatap-h8jahypk\.manus\.space\/manus-storage\/feelgreat\//);
      expect(story.altAr).toBeTruthy();
      expect(story.altEn).toBeTruthy();
      expect(typeof story.sortOrder).toBe("number");
    });
  });

  it("video stories should have videoUrl", () => {
    const videoStories = PARTNER_STORIES.filter((s) => s.type === "video");
    expect(videoStories.length).toBeGreaterThan(0);
    videoStories.forEach((story) => {
      expect(story.videoUrl).toBeTruthy();
      expect(story.videoUrl).toMatch(/\.mp4$/);
    });
  });

  it("before-after stories should NOT have videoUrl", () => {
    const imageStories = PARTNER_STORIES.filter((s) => s.type === "before-after");
    expect(imageStories.length).toBeGreaterThan(0);
    imageStories.forEach((story) => {
      expect(story.videoUrl).toBeUndefined();
    });
  });

  it("all stories should have unique IDs", () => {
    const ids = PARTNER_STORIES.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("should have stories distributed across 6 categories", () => {
    const categoriesInData = [...new Set(PARTNER_STORIES.map((s) => s.category))];
    expect(categoriesInData.length).toBe(6);
    expect(categoriesInData).toContain("weight-loss");
    expect(categoriesInData).toContain("diabetes-insulin");
    expect(categoriesInData).toContain("gut-health");
    expect(categoriesInData).toContain("general-wellness");
    expect(categoriesInData).toContain("womens-health");
    expect(categoriesInData).toContain("thyroid");
  });

  it("all categories in stories should be valid", () => {
    const validCategories = PARTNER_STORY_CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id);
    PARTNER_STORIES.forEach((story) => {
      expect(validCategories).toContain(story.category);
    });
  });
});
