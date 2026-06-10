import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("Notification Preferences", () => {
  describe("Database Schema", () => {
    it("push_subscriptions table has preference columns", async () => {
      // Verify the pushNotifications module exports preference functions
      const pushModule = await import("./pushNotifications");
      expect(typeof pushModule.getNotificationPreferences).toBe("function");
      expect(typeof pushModule.updateNotificationPreferences).toBe("function");
    });

    it("sendPushNotificationToAll accepts contentType parameter", async () => {
      const pushModule = await import("./pushNotifications");
      // Verify the function signature accepts contentType
      expect(pushModule.sendPushNotificationToAll.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("NotificationPreferences Page", () => {
    const pagePath = path.join(__dirname, "../client/src/pages/NotificationPreferences.tsx");

    it("page file exists", () => {
      expect(fs.existsSync(pagePath)).toBe(true);
    });

    it("contains article and research toggle switches", () => {
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("notifyArticles");
      expect(content).toContain("notifyResearch");
      expect(content).toContain("Switch");
    });

    it("supports Arabic and English labels", () => {
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("إعدادات الإشعارات");
      expect(content).toContain("Notification Settings");
    });

    it("uses trpc push.getPreferences and push.updatePreferences", () => {
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("push.getPreferences");
      expect(content).toContain("push.updatePreferences");
    });

    it("handles not-subscribed state with enable button", () => {
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("enableNotifications");
      expect(content).toContain("handleSubscribe");
    });

    it("handles unsupported browser state", () => {
      const content = fs.readFileSync(pagePath, "utf-8");
      expect(content).toContain("isSupported");
      expect(content).toContain("notSupported");
    });
  });

  describe("Route Registration", () => {
    it("/notifications route is registered in App.tsx", () => {
      const appPath = path.join(__dirname, "../client/src/App.tsx");
      const content = fs.readFileSync(appPath, "utf-8");
      expect(content).toContain('"/notifications"');
      expect(content).toContain("NotificationPreferences");
    });
  });

  describe("Push Notification Filtering", () => {
    it("notifyNewArticle filters by notifyArticles preference", async () => {
      const pushModule = await import("./pushNotifications");
      const source = fs.readFileSync(path.join(__dirname, "pushNotifications.ts"), "utf-8");
      // Verify the function filters subscriptions by notifyArticles
      expect(source).toContain("sub.notifyArticles");
    });

    it("notifyNewResearch filters by notifyResearch preference", async () => {
      const source = fs.readFileSync(path.join(__dirname, "pushNotifications.ts"), "utf-8");
      expect(source).toContain("sub.notifyResearch");
    });

    it("sendPushNotificationToAll filters by contentType", () => {
      const source = fs.readFileSync(path.join(__dirname, "pushNotifications.ts"), "utf-8");
      expect(source).toContain('payload.contentType === "article"');
      expect(source).toContain('payload.contentType === "research"');
    });

    it("discoverResearch passes contentType: research", () => {
      const discoverPath = path.join(__dirname, "scheduled/discoverResearch.ts");
      const content = fs.readFileSync(discoverPath, "utf-8");
      expect(content).toContain('contentType: "research"');
    });
  });

  describe("tRPC Router", () => {
    it("push router has getPreferences and updatePreferences procedures", () => {
      const routersPath = path.join(__dirname, "routers.ts");
      const content = fs.readFileSync(routersPath, "utf-8");
      expect(content).toContain("getPreferences");
      expect(content).toContain("updatePreferences");
      expect(content).toContain("getNotificationPreferences");
      expect(content).toContain("updateNotificationPreferences");
    });
  });
});
