import { describe, it, expect } from "vitest";

describe("Resend Webhook Secret", () => {
  it("should have RESEND_WEBHOOK_SECRET set in environment", () => {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    expect(secret).toBeDefined();
    expect(secret).not.toBe("");
  });

  it("should have valid webhook secret format (whsec_ prefix)", () => {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    expect(secret).toMatch(/^whsec_[A-Za-z0-9]+$/);
  });
});
