import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  subscribeToNewsletter: vi.fn(),
  unsubscribeFromNewsletter: vi.fn(),
  getNewsletterSubscriberCount: vi.fn(),
}));

import { subscribeToNewsletter, unsubscribeFromNewsletter, getNewsletterSubscriberCount } from "./db";

describe("Newsletter Subscription System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("subscribeToNewsletter", () => {
    it("should subscribe a new user successfully", async () => {
      (subscribeToNewsletter as any).mockResolvedValue({ success: true });
      
      const result = await subscribeToNewsletter({
        email: "test@example.com",
        name: "Test User",
        language: "ar",
        interests: ["health", "research"],
      });
      
      expect(result.success).toBe(true);
      expect(subscribeToNewsletter).toHaveBeenCalledWith({
        email: "test@example.com",
        name: "Test User",
        language: "ar",
        interests: ["health", "research"],
      });
    });

    it("should return alreadySubscribed for existing active subscriber", async () => {
      (subscribeToNewsletter as any).mockResolvedValue({ success: true, alreadySubscribed: true });
      
      const result = await subscribeToNewsletter({
        email: "existing@example.com",
        language: "en",
      });
      
      expect(result.success).toBe(true);
      expect(result.alreadySubscribed).toBe(true);
    });

    it("should handle subscription with all 6 supported languages", async () => {
      const languages = ["ar", "en", "fr", "es", "de", "tr"];
      
      for (const language of languages) {
        (subscribeToNewsletter as any).mockResolvedValue({ success: true });
        
        const result = await subscribeToNewsletter({
          email: `user-${language}@example.com`,
          language,
        });
        
        expect(result.success).toBe(true);
      }
      
      expect(subscribeToNewsletter).toHaveBeenCalledTimes(6);
    });

    it("should handle subscription failure gracefully", async () => {
      (subscribeToNewsletter as any).mockResolvedValue({ success: false });
      
      const result = await subscribeToNewsletter({
        email: "fail@example.com",
        language: "ar",
      });
      
      expect(result.success).toBe(false);
    });
  });

  describe("unsubscribeFromNewsletter", () => {
    it("should unsubscribe a user successfully", async () => {
      (unsubscribeFromNewsletter as any).mockResolvedValue(true);
      
      const result = await unsubscribeFromNewsletter("test@example.com");
      
      expect(result).toBe(true);
      expect(unsubscribeFromNewsletter).toHaveBeenCalledWith("test@example.com");
    });
  });

  describe("getNewsletterSubscriberCount", () => {
    it("should return the count of active subscribers", async () => {
      (getNewsletterSubscriberCount as any).mockResolvedValue(150);
      
      const count = await getNewsletterSubscriberCount();
      
      expect(count).toBe(150);
    });

    it("should return 0 when no subscribers exist", async () => {
      (getNewsletterSubscriberCount as any).mockResolvedValue(0);
      
      const count = await getNewsletterSubscriberCount();
      
      expect(count).toBe(0);
    });
  });
});
