import { describe, it, expect } from "vitest";

describe("Push Notification VAPID Keys", () => {
  it("should have VAPID_PUBLIC_KEY set", () => {
    const key = process.env.VAPID_PUBLIC_KEY;
    expect(key).toBeDefined();
    expect(key!.length).toBeGreaterThan(40);
    // VAPID public keys are base64url encoded
    expect(key).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("should have VAPID_PRIVATE_KEY set", () => {
    const key = process.env.VAPID_PRIVATE_KEY;
    expect(key).toBeDefined();
    expect(key!.length).toBeGreaterThan(20);
    expect(key).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("should have VITE_VAPID_PUBLIC_KEY matching VAPID_PUBLIC_KEY", () => {
    const pub = process.env.VAPID_PUBLIC_KEY;
    const vitePub = process.env.VITE_VAPID_PUBLIC_KEY;
    expect(vitePub).toBeDefined();
    expect(vitePub).toBe(pub);
  });

  it("should be able to set VAPID details with web-push", async () => {
    const webPush = await import("web-push");
    const publicKey = process.env.VAPID_PUBLIC_KEY!;
    const privateKey = process.env.VAPID_PRIVATE_KEY!;
    
    // This will throw if keys are invalid
    expect(() => {
      webPush.default.setVapidDetails(
        "mailto:info@feelgreat.us.com",
        publicKey,
        privateKey
      );
    }).not.toThrow();
  });
});
