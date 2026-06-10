import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("PWA Configuration", () => {
  const publicDir = join(__dirname, "../client/public");

  describe("manifest.json", () => {
    const manifest = JSON.parse(readFileSync(join(publicDir, "manifest.json"), "utf-8"));

    it("has required PWA fields", () => {
      expect(manifest.name).toBeDefined();
      expect(manifest.short_name).toBeDefined();
      expect(manifest.start_url).toBe("/");
      expect(manifest.display).toBe("standalone");
      expect(manifest.background_color).toBeDefined();
      expect(manifest.theme_color).toBeDefined();
    });

    it("has correct app name", () => {
      expect(manifest.short_name).toBe("Feel Great");
      expect(manifest.name).toContain("Feel Great");
    });

    it("has icons with required sizes", () => {
      expect(manifest.icons).toBeDefined();
      expect(manifest.icons.length).toBeGreaterThanOrEqual(4);

      const sizes = manifest.icons.map((i: any) => i.sizes);
      expect(sizes).toContain("192x192");
      expect(sizes).toContain("512x512");
    });

    it("has maskable icons for Android", () => {
      const maskable = manifest.icons.filter((i: any) => i.purpose?.includes("maskable"));
      expect(maskable.length).toBeGreaterThanOrEqual(1);
    });

    it("has shortcuts for quick access", () => {
      expect(manifest.shortcuts).toBeDefined();
      expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(2);
      const urls = manifest.shortcuts.map((s: any) => s.url);
      expect(urls).toContain("/blog");
      expect(urls).toContain("/research");
    });

    it("icons point to manus-storage", () => {
      for (const icon of manifest.icons) {
        expect(icon.src).toMatch(/^\/manus-storage\//);
      }
    });
  });

  describe("Service Worker (sw.js)", () => {
    const swContent = readFileSync(join(publicDir, "sw.js"), "utf-8");

    it("exists and has content", () => {
      expect(swContent.length).toBeGreaterThan(100);
    });

    it("handles install event", () => {
      expect(swContent).toContain('addEventListener("install"');
    });

    it("handles activate event", () => {
      expect(swContent).toContain('addEventListener("activate"');
    });

    it("handles fetch event for offline support", () => {
      expect(swContent).toContain('addEventListener("fetch"');
    });

    it("handles push notification events", () => {
      expect(swContent).toContain('addEventListener("push"');
    });

    it("handles notification click", () => {
      expect(swContent).toContain('addEventListener("notificationclick"');
    });

    it("caches manus-storage assets", () => {
      expect(swContent).toContain("/manus-storage/");
    });

    it("skips API requests from caching", () => {
      expect(swContent).toContain("/api/");
    });

    it("has offline fallback", () => {
      expect(swContent).toContain("/offline.html");
    });

    it("supports cache versioning", () => {
      expect(swContent).toMatch(/STATIC_CACHE|DYNAMIC_CACHE/);
    });
  });

  describe("Offline page", () => {
    const offlinePage = readFileSync(join(publicDir, "offline.html"), "utf-8");

    it("exists and is valid HTML", () => {
      expect(offlinePage).toContain("<!DOCTYPE html>");
      expect(offlinePage).toContain("</html>");
    });

    it("has Arabic content for RTL users", () => {
      expect(offlinePage).toContain('dir="rtl"');
      expect(offlinePage).toContain("غير متصل");
    });

    it("has a retry button", () => {
      expect(offlinePage).toContain("reload()");
    });
  });

  describe("index.html PWA tags", () => {
    const indexHtml = readFileSync(join(__dirname, "../client/index.html"), "utf-8");

    it("links to manifest.json", () => {
      expect(indexHtml).toContain('rel="manifest"');
      expect(indexHtml).toContain("manifest.json");
    });

    it("has apple-touch-icon", () => {
      expect(indexHtml).toContain("apple-touch-icon");
    });

    it("has apple-mobile-web-app-capable", () => {
      expect(indexHtml).toContain("apple-mobile-web-app-capable");
    });

    it("has theme-color meta tag", () => {
      expect(indexHtml).toContain('name="theme-color"');
    });
  });
});
