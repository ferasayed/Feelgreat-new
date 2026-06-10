import { describe, it, expect } from "vitest";

const BASE_URL = "http://localhost:3000/api/framer/v1";
const API_KEY = process.env.FRAMER_API_KEY || "";

describe("Framer Public API", () => {
  it("should reject requests without API key", async () => {
    const res = await fetch(`${BASE_URL}/stats`);
    // If FRAMER_API_KEY is set, should return 401
    if (API_KEY) {
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body.error).toBe("Unauthorized");
    } else {
      // If no key configured, should allow access
      expect(res.status).toBe(200);
    }
  });

  it("should accept requests with valid API key in header", async () => {
    if (!API_KEY) return; // Skip if no key configured
    const res = await fetch(`${BASE_URL}/stats`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(typeof body.data.articles).toBe("number");
    expect(typeof body.data.research).toBe("number");
  });

  it("should accept requests with valid API key in query param", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/stats?api_key=${API_KEY}`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  it("should return articles list with pagination", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/articles?limit=5`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.pagination).toBeDefined();
    expect(body.pagination.limit).toBe(5);
    
    // Check article format
    if (body.data.length > 0) {
      const article = body.data[0];
      expect(article.slug).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.title.en).toBeDefined();
      expect(article.url).toContain("feelgreat.us.com/blog/");
    }
  });

  it("should return research list with pagination", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/research?limit=5`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.pagination).toBeDefined();
    
    // Check research format
    if (body.data.length > 0) {
      const study = body.data[0];
      expect(study.slug).toBeDefined();
      expect(study.title).toBeDefined();
      expect(study.url).toContain("feelgreat.us.com/research/");
    }
  });

  it("should return 404 for non-existent article slug", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/articles/non-existent-slug-12345`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(404);
  });

  it("should return CORS headers", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/stats`, {
      headers: {
        "X-API-Key": API_KEY,
        "Origin": "https://test.framer.app",
      },
    });
    expect(res.status).toBe(200);
    const corsHeader = res.headers.get("access-control-allow-origin");
    expect(corsHeader).toBe("https://test.framer.app");
  });
});
