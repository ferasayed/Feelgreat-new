import { describe, it, expect } from "vitest";
import { verifyConnection } from "./googleSearchConsole";

describe("Google Search Console Integration", () => {
  it("should authenticate with service account and list sites", async () => {
    const result = await verifyConnection();
    // The service account should be able to authenticate
    // Even if no sites are listed, the connection should succeed
    expect(result.success).toBe(true);
    console.log("[GSC] Sites accessible:", result.sites);
  }, 15000); // Allow 15s for API call
});
