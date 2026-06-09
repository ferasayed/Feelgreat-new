import { describe, it, expect, vi } from "vitest";

describe("Social Media Auto-Publishing", () => {
  describe("Twitter/X Module", () => {
    it("should export postTweet and postThread functions", async () => {
      const twitter = await import("./twitter");
      expect(twitter.postTweet).toBeDefined();
      expect(typeof twitter.postTweet).toBe("function");
      expect(twitter.postThread).toBeDefined();
      expect(typeof twitter.postThread).toBe("function");
    });

    it("should fail gracefully when credentials are missing", async () => {
      // Clear env vars for test
      const originalToken = process.env.TWITTER_ACCESS_TOKEN;
      const originalRefresh = process.env.TWITTER_REFRESH_TOKEN;
      const originalClient = process.env.TWITTER_CLIENT_ID;
      delete process.env.TWITTER_ACCESS_TOKEN;
      delete process.env.TWITTER_REFRESH_TOKEN;
      delete process.env.TWITTER_CLIENT_ID;

      const { postTweet } = await import("./twitter");
      const result = await postTweet("Test tweet");
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();

      // Restore
      if (originalToken) process.env.TWITTER_ACCESS_TOKEN = originalToken;
      if (originalRefresh) process.env.TWITTER_REFRESH_TOKEN = originalRefresh;
      if (originalClient) process.env.TWITTER_CLIENT_ID = originalClient;
    });
  });

  describe("LinkedIn Module", () => {
    it("should export postToLinkedIn function", async () => {
      const linkedin = await import("./linkedin");
      expect(linkedin.postToLinkedIn).toBeDefined();
      expect(typeof linkedin.postToLinkedIn).toBe("function");
    });

    it("should fail gracefully when credentials are missing", async () => {
      const originalToken = process.env.LINKEDIN_ACCESS_TOKEN;
      delete process.env.LINKEDIN_ACCESS_TOKEN;

      const { postToLinkedIn } = await import("./linkedin");
      const result = await postToLinkedIn({ text: "Test post" });
      expect(result.success).toBe(false);
      expect(result.error).toContain("LINKEDIN_ACCESS_TOKEN");

      if (originalToken) process.env.LINKEDIN_ACCESS_TOKEN = originalToken;
    });
  });

  describe("Threads Module", () => {
    it("should export postToThreads and postTextToThreads functions", async () => {
      const threads = await import("./threads");
      expect(threads.postToThreads).toBeDefined();
      expect(typeof threads.postToThreads).toBe("function");
      expect(threads.postTextToThreads).toBeDefined();
      expect(typeof threads.postTextToThreads).toBe("function");
    });

    it("should fail gracefully when credentials are missing", async () => {
      const originalUserId = process.env.THREADS_USER_ID;
      const originalToken = process.env.THREADS_ACCESS_TOKEN;
      delete process.env.THREADS_USER_ID;
      delete process.env.THREADS_ACCESS_TOKEN;

      const { postToThreads } = await import("./threads");
      const result = await postToThreads({ text: "Test thread" });
      expect(result.success).toBe(false);
      expect(result.error).toContain("THREADS");

      if (originalUserId) process.env.THREADS_USER_ID = originalUserId;
      if (originalToken) process.env.THREADS_ACCESS_TOKEN = originalToken;
    });
  });

  describe("Social Orchestrator", () => {
    it("should export publishToSocialMedia function", async () => {
      const social = await import("./index");
      expect(social.publishToSocialMedia).toBeDefined();
      expect(typeof social.publishToSocialMedia).toBe("function");
    });

    it("should handle all platforms failing gracefully", async () => {
      // Clear all credentials
      const envBackup = { ...process.env };
      delete process.env.TWITTER_ACCESS_TOKEN;
      delete process.env.TWITTER_REFRESH_TOKEN;
      delete process.env.LINKEDIN_ACCESS_TOKEN;
      delete process.env.THREADS_USER_ID;
      delete process.env.THREADS_ACCESS_TOKEN;

      const { publishToSocialMedia } = await import("./index");
      const results = await publishToSocialMedia({
        title: "Test Article",
        slug: "test-article",
        excerpt: "This is a test article excerpt",
        category: "sustainable-health",
        articleUrl: "https://feelgreat.us.com/blog/test-article",
      });

      expect(results.twitter.success).toBe(false);
      expect(results.linkedin.success).toBe(false);
      expect(results.threads.success).toBe(false);

      // Restore env
      Object.assign(process.env, envBackup);
    });
  });
});
