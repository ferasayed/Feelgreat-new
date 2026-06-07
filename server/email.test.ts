import { describe, it, expect } from "vitest";

describe("Resend Email Configuration", () => {
  it("should have RESEND_API_KEY configured", () => {
    expect(process.env.RESEND_API_KEY).toBeDefined();
    expect(process.env.RESEND_API_KEY).toMatch(/^re_/);
  });

  it("should have RESEND_FROM_EMAIL configured", () => {
    expect(process.env.RESEND_FROM_EMAIL).toBeDefined();
    expect(process.env.RESEND_FROM_EMAIL!.length).toBeGreaterThan(0);
  });

  it("should be able to authenticate with Resend API", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY not set");
    }

    const response = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // 200 = valid key with access, 401 = invalid key
    expect(response.status).not.toBe(401);
    expect(response.status).toBe(200);
  });
});
