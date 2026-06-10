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

  it("should return landing page data with articles and research", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/landing`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.latestArticles).toBeDefined();
    expect(body.latestResearch).toBeDefined();
    expect(body.stats).toBeDefined();
    expect(body.links).toBeDefined();
    expect(Array.isArray(body.latestArticles)).toBe(true);
    expect(Array.isArray(body.latestResearch)).toBe(true);
    expect(body.latestArticles.length).toBeLessThanOrEqual(3);
    expect(body.latestResearch.length).toBeLessThanOrEqual(3);
    expect(body.links.mainSite).toBe("https://feelgreat.us.com");
    expect(body.links.partnerSite).toContain("manus.space");
  });

  it("should return CMS schema with collections definition", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/cms/schema`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.collections).toBeDefined();
    expect(body.collections.articles).toBeDefined();
    expect(body.collections.research).toBeDefined();
    expect(body.collections.articles.fields.length).toBeGreaterThan(5);
    expect(body.collections.research.fields.length).toBeGreaterThan(5);
    expect(body.syncEndpoints).toBeDefined();
  });

  it("should return CMS articles in Framer Collection item format", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/cms/articles?limit=2`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toBeDefined();
    expect(Array.isArray(body.items)).toBe(true);
    if (body.items.length > 0) {
      const item = body.items[0];
      expect(item.id).toBeDefined();
      expect(item.slug).toBeDefined();
      expect(item.fieldData).toBeDefined();
      expect(item.fieldData.title_en).toBeDefined();
      expect(item.fieldData.content_en).toBeDefined();
      expect(item.fieldData.url).toContain("feelgreat.us.com");
    }
  });

  it("should return CMS research in Framer Collection item format", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/cms/research?limit=2`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toBeDefined();
    expect(Array.isArray(body.items)).toBe(true);
    if (body.items.length > 0) {
      const item = body.items[0];
      expect(item.id).toBeDefined();
      expect(item.slug).toBeDefined();
      expect(item.fieldData).toBeDefined();
      expect(item.fieldData.title_en).toBeDefined();
      expect(item.fieldData.journal).toBeDefined();
    }
  });

  it("should register and list webhooks", async () => {
    if (!API_KEY) return;
    // Register a webhook
    const registerRes = await fetch(`${BASE_URL}/webhooks/register`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: "https://test.example.com/webhook",
        events: ["article.published"],
      }),
    });
    expect(registerRes.status).toBe(201);
    const registerBody = await registerRes.json();
    expect(registerBody.data.id).toBeDefined();
    expect(registerBody.data.url).toBe("https://test.example.com/webhook");

    // List webhooks
    const listRes = await fetch(`${BASE_URL}/webhooks`, {
      headers: { "X-API-Key": API_KEY },
    });
    expect(listRes.status).toBe(200);
    const listBody = await listRes.json();
    expect(Array.isArray(listBody.data)).toBe(true);
    expect(listBody.data.length).toBeGreaterThan(0);

    // Delete the webhook
    const webhookId = registerBody.data.id;
    const deleteRes = await fetch(`${BASE_URL}/webhooks/${webhookId}`, {
      method: "DELETE",
      headers: { "X-API-Key": API_KEY },
    });
    expect(deleteRes.status).toBe(200);
  });

  it("should reject webhook registration with invalid data", async () => {
    if (!API_KEY) return;
    const res = await fetch(`${BASE_URL}/webhooks/register`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: "not-a-url" }),
    });
    expect(res.status).toBe(400);
  });
});
