import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  createLead: vi.fn(),
  getAllLeads: vi.fn(),
  getLeadsCount: vi.fn(),
  createOrUpdateConversation: vi.fn(),
  getConversation: vi.fn(),
  getAllConversations: vi.fn(),
  getConversationStats: vi.fn(),
  markConversationNotified: vi.fn(),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

// Mock notification
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import { createLead, getAllLeads, getLeadsCount, getConversationStats, getAllConversations } from "./db";
import { invokeLLM } from "./_core/llm";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "user-open-id",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("leads.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully registers a lead when DB insert succeeds", async () => {
    const mockLead = {
      id: 1,
      fullName: "Test User",
      email: "test@example.com",
      phone: "+966501234567",
      country: "sa",
      source: "form",
      notes: null,
      createdAt: new Date(),
    };
    (createLead as ReturnType<typeof vi.fn>).mockResolvedValue(mockLead);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.leads.register({
      fullName: "Test User",
      email: "test@example.com",
      phone: "+966501234567",
      country: "sa",
    });

    expect(result.success).toBe(true);
    expect(result.lead).toEqual(mockLead);
    expect(createLead).toHaveBeenCalledWith({
      fullName: "Test User",
      email: "test@example.com",
      phone: "+966501234567",
      country: "sa",
      source: "form",
      interestPath: "undecided",
      language: "ar",
    });
  });

  it("throws error when DB insert fails (returns null)", async () => {
    (createLead as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.leads.register({
        fullName: "Test User",
        email: "test@example.com",
        phone: "+966501234567",
        country: "sa",
      })
    ).rejects.toThrow();
  });

  it("validates email format", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.leads.register({
        fullName: "Test User",
        email: "invalid-email",
        phone: "+966501234567",
        country: "sa",
      })
    ).rejects.toThrow();
  });
});

describe("leads.list (admin only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns leads for admin users", async () => {
    const mockLeads = [
      { id: 1, fullName: "Lead 1", email: "l1@test.com", phone: "123", country: "sa", source: "form", notes: null, createdAt: new Date() },
    ];
    (getAllLeads as ReturnType<typeof vi.fn>).mockResolvedValue(mockLeads);
    (getLeadsCount as ReturnType<typeof vi.fn>).mockResolvedValue(1);

    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.leads.list();

    expect(result.leads).toEqual(mockLeads);
    expect(result.total).toBe(1);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.leads.list()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.leads.list()).rejects.toThrow();
  });
});

describe("dashboard.stats (admin only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns stats for admin users", async () => {
    (getLeadsCount as ReturnType<typeof vi.fn>).mockResolvedValue(10);
    (getConversationStats as ReturnType<typeof vi.fn>).mockResolvedValue({
      total: 20,
      highInterest: 5,
      medium: 8,
      low: 7,
    });

    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.dashboard.stats();

    expect(result.totalLeads).toBe(10);
    expect(result.totalConversations).toBe(20);
    expect(result.highInterestConversations).toBe(5);
  });

  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.dashboard.stats()).rejects.toThrow();
  });
});

describe("chat.send", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns AI response on success", async () => {
    (invokeLLM as ReturnType<typeof vi.fn>).mockResolvedValue({
      choices: [{ message: { content: "Hello! I'm your Feel Great assistant." } }],
    });
    const { createOrUpdateConversation } = await import("./db");
    (createOrUpdateConversation as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1,
      visitorId: "test-visitor",
      ownerNotified: false,
    });

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.chat.send({
      visitorId: "test-visitor",
      message: "Tell me about Feel Great",
      language: "en",
    });

    expect(result.message).toBe("Hello! I'm your Feel Great assistant.");
    expect(result.interestLevel).toBeDefined();
  });

  it("returns localized fallback when LLM fails", async () => {
    (invokeLLM as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("LLM unavailable"));
    const { createOrUpdateConversation } = await import("./db");
    (createOrUpdateConversation as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 1,
      visitorId: "test-visitor",
      ownerNotified: false,
    });

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.chat.send({
      visitorId: "test-visitor",
      message: "Hello",
      language: "ar",
    });

    expect(result.message).toContain("ufeelgreat.com/c/GBP556");
  });
});
