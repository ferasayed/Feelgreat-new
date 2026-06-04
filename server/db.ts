import { eq, desc, count, and, or, isNull, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, Lead, chatConversations, InsertChatConversation, ChatConversation, blogArticles, BlogArticle, InsertBlogArticle, reviews, Review, InsertReview } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== LEADS =====

export async function createLead(lead: InsertLead): Promise<Lead | null> {
  const db = await getDb();
  if (!db) return null;

  await db.insert(leads).values(lead);
  const result = await db.select().from(leads).where(eq(leads.email, lead.email)).orderBy(desc(leads.createdAt)).limit(1);
  return result[0] ?? null;
}

export async function getAllLeads(limit = 100, offset = 0): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(leads).orderBy(desc(leads.createdAt)).limit(limit).offset(offset);
}

export async function getLeadsCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({ count: count() }).from(leads);
  return result[0]?.count ?? 0;
}

// ===== CHAT CONVERSATIONS =====

export async function createOrUpdateConversation(data: {
  visitorId: string;
  messages: unknown[];
  interestLevel?: "low" | "medium" | "high";
  isHighInterest?: boolean;
  visitorName?: string;
  visitorEmail?: string;
  messageCount?: number;
}): Promise<ChatConversation | null> {
  const db = await getDb();
  if (!db) return null;

  // Check if conversation exists
  const existing = await db.select().from(chatConversations).where(eq(chatConversations.visitorId, data.visitorId)).limit(1);

  if (existing.length > 0) {
    await db.update(chatConversations)
      .set({
        messages: data.messages,
        interestLevel: data.interestLevel ?? existing[0].interestLevel,
        isHighInterest: data.isHighInterest ?? existing[0].isHighInterest,
        visitorName: data.visitorName ?? existing[0].visitorName,
        visitorEmail: data.visitorEmail ?? existing[0].visitorEmail,
        messageCount: data.messageCount ?? existing[0].messageCount,
      })
      .where(eq(chatConversations.visitorId, data.visitorId));

    const updated = await db.select().from(chatConversations).where(eq(chatConversations.visitorId, data.visitorId)).limit(1);
    return updated[0] ?? null;
  } else {
    await db.insert(chatConversations).values({
      visitorId: data.visitorId,
      messages: data.messages,
      interestLevel: data.interestLevel ?? "low",
      isHighInterest: data.isHighInterest ?? false,
      visitorName: data.visitorName ?? null,
      visitorEmail: data.visitorEmail ?? null,
      messageCount: data.messageCount ?? 0,
    });

    const created = await db.select().from(chatConversations).where(eq(chatConversations.visitorId, data.visitorId)).limit(1);
    return created[0] ?? null;
  }
}

export async function getConversation(visitorId: string): Promise<ChatConversation | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(chatConversations).where(eq(chatConversations.visitorId, visitorId)).limit(1);
  return result[0] ?? null;
}

export async function getAllConversations(limit = 100, offset = 0): Promise<ChatConversation[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(chatConversations).orderBy(desc(chatConversations.updatedAt)).limit(limit).offset(offset);
}

export async function getConversationStats(): Promise<{
  total: number;
  highInterest: number;
  medium: number;
  low: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, highInterest: 0, medium: 0, low: 0 };

  const totalResult = await db.select({ count: count() }).from(chatConversations);
  const highResult = await db.select({ count: count() }).from(chatConversations).where(eq(chatConversations.isHighInterest, true));
  const mediumResult = await db.select({ count: count() }).from(chatConversations).where(eq(chatConversations.interestLevel, "medium"));
  const lowResult = await db.select({ count: count() }).from(chatConversations).where(eq(chatConversations.interestLevel, "low"));

  return {
    total: totalResult[0]?.count ?? 0,
    highInterest: highResult[0]?.count ?? 0,
    medium: mediumResult[0]?.count ?? 0,
    low: lowResult[0]?.count ?? 0,
  };
}

export async function markConversationNotified(visitorId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(chatConversations)
    .set({ ownerNotified: true })
    .where(eq(chatConversations.visitorId, visitorId));
}

// ===== FOLLOW-UP SYSTEM =====

export async function getPendingFollowUpLeads(): Promise<Lead[]> {
  const db = await getDb();
  if (!db) return [];

  // Get leads that are pending and either never followed up or last follow-up was > 24h ago
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const result = await db.select().from(leads)
    .where(
      and(
        eq(leads.followUpStatus, "pending"),
        or(
          isNull(leads.lastFollowUpAt),
          lte(leads.lastFollowUpAt, oneDayAgo)
        )
      )
    )
    .orderBy(desc(leads.createdAt))
    .limit(50);

  return result;
}

export async function markLeadFollowedUp(leadId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (existing.length === 0) return;

  await db.update(leads)
    .set({
      followUpCount: (existing[0].followUpCount ?? 0) + 1,
      lastFollowUpAt: new Date(),
      followUpStatus: (existing[0].followUpCount ?? 0) >= 2 ? "lost" : "contacted",
    })
    .where(eq(leads.id, leadId));
}

export async function updateLeadStatus(leadId: number, status: "pending" | "contacted" | "converted" | "lost"): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.update(leads)
    .set({ followUpStatus: status })
    .where(eq(leads.id, leadId));
}

// ===== BLOG ARTICLES =====

export async function createBlogArticle(article: InsertBlogArticle): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db.insert(blogArticles).values(article);
}

export async function getPublishedArticles(limit = 20, offset = 0): Promise<BlogArticle[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(blogArticles)
    .where(eq(blogArticles.isPublished, true))
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getArticleBySlug(slug: string): Promise<BlogArticle | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(blogArticles)
    .where(eq(blogArticles.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getArticlesByCategory(category: string, limit = 10): Promise<BlogArticle[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(blogArticles)
    .where(and(eq(blogArticles.category, category), eq(blogArticles.isPublished, true)))
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit);
}

export async function getArticlesCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db.select({ count: count() }).from(blogArticles)
    .where(eq(blogArticles.isPublished, true));
  return result[0]?.count ?? 0;
}

export async function getRecentArticleSlugs(limit = 30): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select({ slug: blogArticles.slug }).from(blogArticles)
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit);
  return result.map(r => r.slug);
}

// ========== Reviews ==========

export async function createReview(data: InsertReview): Promise<Review | null> {
  const db = await getDb();
  if (!db) return null;
  await db.insert(reviews).values(data);
  const [review] = await db.select().from(reviews).where(eq(reviews.name, data.name)).orderBy(desc(reviews.createdAt)).limit(1);
  return review || null;
}

export async function getPublishedReviews(limit = 20): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(and(eq(reviews.isApproved, true), eq(reviews.isPublished, true))).orderBy(desc(reviews.createdAt)).limit(limit);
}

export async function getAllReviews(): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

export async function approveReview(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(reviews).set({ isApproved: true, isPublished: true }).where(eq(reviews.id, id));
}

export async function getReviewStats(): Promise<{ total: number; avgRating: number; published: number }> {
  const db = await getDb();
  if (!db) return { total: 0, avgRating: 0, published: 0 };
  const all = await db.select().from(reviews);
  const published = all.filter(r => r.isPublished);
  const avgRating = all.length > 0 ? all.reduce((sum, r) => sum + r.rating, 0) / all.length : 0;
  return { total: all.length, avgRating: Math.round(avgRating * 10) / 10, published: published.length };
}
