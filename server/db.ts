import { eq, desc, count, and, or, isNull, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import { InsertUser, users, leads, InsertLead, Lead, chatConversations, InsertChatConversation, ChatConversation, blogArticles, BlogArticle, InsertBlogArticle, reviews, Review, InsertReview, articleViews, InsertArticleView, pillarPerformance, PillarPerformance, newsletterSubscribers, InsertNewsletterSubscriber, NewsletterSubscriber, articleComments, ArticleComment, InsertArticleComment, glossaryTerms, GlossaryTerm, InsertGlossaryTerm, shareCounts, ShareCount } from "../drizzle/schema";
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

export async function getPublishedReviewsByCategory(category: string, limit = 5): Promise<Review[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(and(eq(reviews.isApproved, true), eq(reviews.isPublished, true), eq(reviews.category, category))).orderBy(desc(reviews.createdAt)).limit(limit);
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


// ========== Enhanced Blog Article Helpers ==========

export async function getAllArticles(limit = 100, offset = 0): Promise<BlogArticle[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogArticles)
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getArticleById(id: number): Promise<BlogArticle | null> {
  const db = await getDb();
  if (!db) return null;
  const [article] = await db.select().from(blogArticles).where(eq(blogArticles.id, id)).limit(1);
  return article || null;
}

export async function updateArticle(id: number, data: Partial<InsertBlogArticle>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(blogArticles).set(data).where(eq(blogArticles.id, id));
}

export async function getArticlesByCluster(clusterId: string, limit = 20): Promise<BlogArticle[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogArticles)
    .where(and(eq(blogArticles.clusterId, clusterId), eq(blogArticles.isPublished, true)))
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit);
}

export async function getArticlesByPillar(pillarId: string, limit = 20): Promise<BlogArticle[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogArticles)
    .where(and(eq(blogArticles.pillarId, pillarId), eq(blogArticles.isPublished, true)))
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit);
}

export async function getRecentArticleKeywords(limit = 50): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select({ keyword: blogArticles.targetKeyword })
    .from(blogArticles)
    .where(sql`${blogArticles.targetKeyword} IS NOT NULL`)
    .orderBy(desc(blogArticles.createdAt))
    .limit(limit);
  return results.map(r => r.keyword).filter(Boolean) as string[];
}

export async function getArticleStats(): Promise<{
  total: number;
  published: number;
  drafts: number;
  byCluster: Record<string, number>;
  byLanguage: Record<string, number>;
  totalWords: number;
}> {
  const db = await getDb();
  if (!db) return { total: 0, published: 0, drafts: 0, byCluster: {}, byLanguage: {}, totalWords: 0 };
  
  const all = await db.select().from(blogArticles);
  const published = all.filter(a => a.isPublished);
  const drafts = all.filter(a => !a.isPublished);
  
  const byCluster: Record<string, number> = {};
  const byLanguage: Record<string, number> = {};
  let totalWords = 0;
  
  for (const article of all) {
    const cluster = article.clusterId || article.category || "uncategorized";
    byCluster[cluster] = (byCluster[cluster] || 0) + 1;
    const lang = article.language || "both";
    byLanguage[lang] = (byLanguage[lang] || 0) + 1;
    totalWords += article.wordCount || 0;
  }
  
  return { total: all.length, published: published.length, drafts: drafts.length, byCluster, byLanguage, totalWords };
}


// ===== Article View Tracking =====

export async function recordArticleView(data: { articleId: number; visitorId?: string; referrer?: string; country?: string }) {
  const db = await getDb();
  if (!db) return;
  
  // Record the view
  await db.insert(articleViews).values({
    articleId: data.articleId,
    visitorId: data.visitorId || null,
    referrer: data.referrer || null,
    country: data.country || null,
  });
  
  // Increment view count on the article
  await db.update(blogArticles)
    .set({ viewCount: sql`${blogArticles.viewCount} + 1` })
    .where(eq(blogArticles.id, data.articleId));
}

export async function getTopPerformingPillars(days = 30): Promise<Array<{ pillarId: string; totalViews: number; articleCount: number; avgViews: number }>> {
  const db = await getDb();
  if (!db) return [];
  
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  // Get articles with their views from the last N days
  const articles = await db.select({
    pillarId: blogArticles.pillarId,
    viewCount: blogArticles.viewCount,
  })
    .from(blogArticles)
    .where(and(
      sql`${blogArticles.pillarId} IS NOT NULL`,
      sql`${blogArticles.publishedAt} >= ${cutoff}`
    ));
  
  // Aggregate by pillar
  const pillarMap: Record<string, { totalViews: number; articleCount: number }> = {};
  for (const article of articles) {
    const pid = article.pillarId || "unknown";
    if (!pillarMap[pid]) pillarMap[pid] = { totalViews: 0, articleCount: 0 };
    pillarMap[pid].totalViews += article.viewCount || 0;
    pillarMap[pid].articleCount += 1;
  }
  
  return Object.entries(pillarMap)
    .map(([pillarId, data]) => ({
      pillarId,
      totalViews: data.totalViews,
      articleCount: data.articleCount,
      avgViews: data.articleCount > 0 ? Math.round(data.totalViews / data.articleCount) : 0,
    }))
    .sort((a, b) => b.avgViews - a.avgViews);
}

export async function getTopPerformingArticles(limit = 10): Promise<BlogArticle[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(blogArticles)
    .where(eq(blogArticles.isPublished, true))
    .orderBy(desc(blogArticles.viewCount))
    .limit(limit);
}

export async function getPillarWeights(): Promise<Record<string, number>> {
  const db = await getDb();
  if (!db) return {};
  
  // Get all published articles with their views grouped by pillar
  const articles = await db.select({
    pillarId: blogArticles.pillarId,
    viewCount: blogArticles.viewCount,
    createdAt: blogArticles.createdAt,
  })
    .from(blogArticles)
    .where(and(
      eq(blogArticles.isPublished, true),
      sql`${blogArticles.pillarId} IS NOT NULL`
    ));
  
  if (articles.length === 0) return {};
  
  // Calculate performance score per pillar
  // Score = (total views / article count) * recency_boost
  const pillarData: Record<string, { totalViews: number; count: number; recentViews: number }> = {};
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  
  for (const article of articles) {
    const pid = article.pillarId || "unknown";
    if (!pillarData[pid]) pillarData[pid] = { totalViews: 0, count: 0, recentViews: 0 };
    pillarData[pid].totalViews += article.viewCount || 0;
    pillarData[pid].count += 1;
    // Recent articles get extra weight
    if (article.createdAt && article.createdAt.getTime() > thirtyDaysAgo) {
      pillarData[pid].recentViews += article.viewCount || 0;
    }
  }
  
  // Calculate weights: combine avg views with recency
  const weights: Record<string, number> = {};
  let maxScore = 0;
  
  for (const [pid, data] of Object.entries(pillarData)) {
    const avgViews = data.count > 0 ? data.totalViews / data.count : 0;
    const recencyBoost = data.recentViews > 0 ? 1.5 : 1.0;
    const score = avgViews * recencyBoost;
    weights[pid] = score;
    if (score > maxScore) maxScore = score;
  }
  
  // Normalize weights to 0.5 - 3.0 range (minimum 0.5 so no pillar is completely ignored)
  if (maxScore > 0) {
    for (const pid of Object.keys(weights)) {
      weights[pid] = 0.5 + (weights[pid] / maxScore) * 2.5;
    }
  }
  
  return weights;
}

export async function getArticleViewsByPillar(days = 7): Promise<Array<{ pillarId: string; views: number; articles: number }>> {
  const db = await getDb();
  if (!db) return [];
  
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const results = await db.select({
    pillarId: blogArticles.pillarId,
    viewCount: blogArticles.viewCount,
  })
    .from(blogArticles)
    .where(and(
      eq(blogArticles.isPublished, true),
      sql`${blogArticles.pillarId} IS NOT NULL`
    ));
  
  const pillarMap: Record<string, { views: number; articles: number }> = {};
  for (const r of results) {
    const pid = r.pillarId || "unknown";
    if (!pillarMap[pid]) pillarMap[pid] = { views: 0, articles: 0 };
    pillarMap[pid].views += r.viewCount || 0;
    pillarMap[pid].articles += 1;
  }
  
  return Object.entries(pillarMap)
    .map(([pillarId, data]) => ({ pillarId, ...data }))
    .sort((a, b) => b.views - a.views);
}


// ===== RESEARCH STUDIES (Health Science Hub) =====

import { researchStudies, ResearchStudy, InsertResearchStudy } from "../drizzle/schema";

export async function createResearchStudy(data: InsertResearchStudy): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(researchStudies).values(data);
}

export async function getPublishedResearch(limit = 20, offset = 0): Promise<ResearchStudy[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(researchStudies)
    .where(eq(researchStudies.isPublished, true))
    .orderBy(desc(researchStudies.publishDate))
    .limit(limit)
    .offset(offset);
}

export async function getResearchByTopic(topic: string, limit = 20): Promise<ResearchStudy[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(researchStudies)
    .where(and(
      eq(researchStudies.isPublished, true),
      or(
        eq(researchStudies.primaryTopic, topic),
        sql`JSON_CONTAINS(${researchStudies.topics}, JSON_QUOTE(${topic}))`
      )
    ))
    .orderBy(desc(researchStudies.publishDate))
    .limit(limit);
}

export async function getResearchBySlug(slug: string): Promise<ResearchStudy | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(researchStudies)
    .where(eq(researchStudies.slug, slug))
    .limit(1);
  return result[0] ?? null;
}

export async function getResearchCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(researchStudies)
    .where(eq(researchStudies.isPublished, true));
  return result[0]?.count ?? 0;
}

export async function getMostReadResearch(limit = 10): Promise<ResearchStudy[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(researchStudies)
    .where(eq(researchStudies.isPublished, true))
    .orderBy(desc(researchStudies.viewCount))
    .limit(limit);
}

export async function getMostImpactfulResearch(limit = 10): Promise<ResearchStudy[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(researchStudies)
    .where(eq(researchStudies.isPublished, true))
    .orderBy(desc(researchStudies.impactScore))
    .limit(limit);
}

export async function getRecentResearchByPeriod(period: "today" | "week" | "month"): Promise<ResearchStudy[]> {
  const db = await getDb();
  if (!db) return [];
  const days = period === "today" ? 1 : period === "week" ? 7 : 30;
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return db.select().from(researchStudies)
    .where(and(
      eq(researchStudies.isPublished, true),
      sql`${researchStudies.publishDate} >= ${cutoff.toISOString().split('T')[0]}`
    ))
    .orderBy(desc(researchStudies.publishDate));
}

export async function recordResearchView(slug: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(researchStudies)
    .set({ viewCount: sql`${researchStudies.viewCount} + 1` })
    .where(eq(researchStudies.slug, slug));
}

export async function getResearchByEvidenceLevel(level: string, limit = 20): Promise<ResearchStudy[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(researchStudies)
    .where(and(
      eq(researchStudies.isPublished, true),
      eq(researchStudies.evidenceLevel, level)
    ))
    .orderBy(desc(researchStudies.publishDate))
    .limit(limit);
}

export async function getExistingResearchDOIs(): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select({ doi: researchStudies.doi })
    .from(researchStudies)
    .where(sql`${researchStudies.doi} IS NOT NULL`);
  return results.map(r => r.doi).filter(Boolean) as string[];
}

export async function getResearchTopics(): Promise<Array<{ topic: string; count: number }>> {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select({
    topic: researchStudies.primaryTopic,
    count: count(),
  })
    .from(researchStudies)
    .where(eq(researchStudies.isPublished, true))
    .groupBy(researchStudies.primaryTopic)
    .orderBy(desc(count()));
  return results.map(r => ({ topic: r.topic, count: r.count }));
}


// ============ Newsletter ============
export async function subscribeToNewsletter(data: { email: string; name?: string; language: string; interests?: string[] }): Promise<{ success: boolean; alreadySubscribed?: boolean }> {
  const db = await getDb();
  if (!db) return { success: false };
  
  // Check if already subscribed
  const existing = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, data.email)).limit(1);
  if (existing.length > 0) {
    // Reactivate if previously unsubscribed
    if (!existing[0].isActive) {
      await db.update(newsletterSubscribers)
        .set({ isActive: true, unsubscribedAt: null, language: data.language })
        .where(eq(newsletterSubscribers.email, data.email));
      return { success: true };
    }
    return { success: true, alreadySubscribed: true };
  }
  
  await db.insert(newsletterSubscribers).values({
    email: data.email,
    name: data.name || null,
    language: data.language,
    interests: data.interests ? JSON.stringify(data.interests) : null,
  });
  return { success: true };
}

export async function unsubscribeFromNewsletter(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.update(newsletterSubscribers)
    .set({ isActive: false, unsubscribedAt: new Date() })
    .where(eq(newsletterSubscribers.email, email));
  return true;
}

export async function getNewsletterSubscriberCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true));
  return result[0]?.count || 0;
}

export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true));
}

export async function getRecentArticles(days: number = 7): Promise<BlogArticle[]> {
  const db = await getDb();
  if (!db) return [];
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return db.select().from(blogArticles)
    .where(and(eq(blogArticles.status, 'published'), lte(blogArticles.publishedAt, new Date())))
    .orderBy(desc(blogArticles.publishedAt))
    .limit(10);
}

// ============================================================
// ARTICLE COMMENTS
// ============================================================

export async function getCommentsByArticle(articleId: number): Promise<ArticleComment[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(articleComments)
    .where(and(eq(articleComments.articleId, articleId), eq(articleComments.isApproved, true), eq(articleComments.isSpam, false)))
    .orderBy(desc(articleComments.createdAt));
}

export async function getCommentsCount(articleId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ count: count() })
    .from(articleComments)
    .where(and(eq(articleComments.articleId, articleId), eq(articleComments.isApproved, true), eq(articleComments.isSpam, false)));
  return result[0]?.count || 0;
}

export async function createComment(comment: InsertArticleComment): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(articleComments).values(comment);
}

export async function likeComment(commentId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(articleComments)
    .set({ likes: sql`likes + 1` })
    .where(eq(articleComments.id, commentId));
}

export async function deleteComment(commentId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(articleComments)
    .set({ isApproved: false })
    .where(eq(articleComments.id, commentId));
}

// ============================================================
// GLOSSARY TERMS
// ============================================================

export async function getAllGlossaryTerms(): Promise<GlossaryTerm[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(glossaryTerms).where(eq(glossaryTerms.isPublished, true)).orderBy(glossaryTerms.termEn);
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTerm | null> {
  const db = await getDb();
  if (!db) return null;
  const [term] = await db.select().from(glossaryTerms).where(eq(glossaryTerms.slug, slug)).limit(1);
  return term || null;
}

export async function getGlossaryTermsByCategory(category: string): Promise<GlossaryTerm[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(glossaryTerms).where(and(eq(glossaryTerms.category, category), eq(glossaryTerms.isPublished, true))).orderBy(glossaryTerms.termEn);
}

export async function createGlossaryTerm(term: InsertGlossaryTerm): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(glossaryTerms).values(term);
}

export async function bulkCreateGlossaryTerms(terms: InsertGlossaryTerm[]): Promise<void> {
  const db = await getDb();
  if (!db) return;
  if (terms.length === 0) return;
  await db.insert(glossaryTerms).values(terms);
}

// ============ Share Counts ============

export async function incrementShareCount(
  contentType: "article" | "research",
  contentSlug: string,
  platform: "copy" | "whatsapp" | "telegram" | "twitter" | "facebook"
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.execute(sql`
    INSERT INTO share_counts (content_type, content_slug, platform, count, last_shared_at)
    VALUES (${contentType}, ${contentSlug}, ${platform}, 1, NOW())
    ON DUPLICATE KEY UPDATE count = count + 1, last_shared_at = NOW()
  `);
}

export async function getShareCounts(
  contentType: "article" | "research",
  contentSlug: string
): Promise<{ platform: string; count: number }[]> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db
    .select({ platform: shareCounts.platform, count: shareCounts.count })
    .from(shareCounts)
    .where(and(
      eq(shareCounts.contentType, contentType),
      eq(shareCounts.contentSlug, contentSlug)
    ));
  
  return results;
}

export async function getTotalShareCount(
  contentType: "article" | "research",
  contentSlug: string
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${shareCounts.count}), 0)` })
    .from(shareCounts)
    .where(and(
      eq(shareCounts.contentType, contentType),
      eq(shareCounts.contentSlug, contentSlug)
    ));
  
  return Number(result[0]?.total) || 0;
}

export async function getTopSharedContent(limit: number = 10): Promise<{
  contentType: string;
  contentSlug: string;
  totalShares: number;
}[]> {
  const db = await getDb();
  if (!db) return [];
  
  const results = await db.execute(sql`
    SELECT content_type as contentType, content_slug as contentSlug, SUM(count) as totalShares
    FROM share_counts
    GROUP BY content_type, content_slug
    ORDER BY totalShares DESC
    LIMIT ${limit}
  `);
  
  return (results as any)[0] || [];
}
