import { mysqlTable, int, varchar, text, boolean, timestamp, json, mysqlEnum, decimal, date, index, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table - stores potential partner registrations
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  source: varchar("source", { length: 50 }).default("form").notNull(),
  notes: text("notes"),
  followUpStatus: mysqlEnum("followUpStatus", ["pending", "contacted", "converted", "lost"]).default("pending").notNull(),
  followUpCount: int("followUpCount").default(0).notNull(),
  lastFollowUpAt: timestamp("lastFollowUpAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Chat conversations table - stores chatbot interactions
 */
export const chatConversations = mysqlTable("chat_conversations", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 64 }).notNull(),
  messages: json("messages").notNull(),
  interestLevel: mysqlEnum("interestLevel", ["low", "medium", "high"]).default("low").notNull(),
  isHighInterest: boolean("isHighInterest").default(false).notNull(),
  ownerNotified: boolean("ownerNotified").default(false).notNull(),
  visitorName: varchar("visitorName", { length: 255 }),
  visitorEmail: varchar("visitorEmail", { length: 320 }),
  messageCount: int("messageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = typeof chatConversations.$inferInsert;

/**
 * Blog articles table - stores auto-generated and manual articles
 * Enhanced with SEO metadata, images, social content, and clustering
 */
export const blogArticles = mysqlTable("blog_articles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  excerptAr: text("excerpt_ar").notNull(),
  excerptEn: text("excerpt_en").notNull(),
  contentAr: text("content_ar").notNull(),
  contentEn: text("content_en").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: json("tags").$type<string[]>().notNull(),
  keywords: text("keywords"),
  // SEO metadata
  metaTitleAr: varchar("meta_title_ar", { length: 255 }),
  metaTitleEn: varchar("meta_title_en", { length: 255 }),
  metaDescriptionAr: text("meta_description_ar"),
  metaDescriptionEn: text("meta_description_en"),
  // Generated images
  heroImageUrl: varchar("hero_image_url", { length: 500 }),
  ogImageUrl: varchar("og_image_url", { length: 500 }),
  socialImageUrl: varchar("social_image_url", { length: 500 }),
  // Social media repurposed content
  socialFacebook: text("social_facebook"),
  socialLinkedin: text("social_linkedin"),
  socialInstagram: text("social_instagram"),
  socialReelsScript: text("social_reels_script"),
  socialTiktokScript: text("social_tiktok_script"),
  // Content clustering & SEO strategy
  pillarId: varchar("pillar_id", { length: 100 }),
  clusterId: varchar("cluster_id", { length: 100 }),
  targetKeyword: varchar("target_keyword", { length: 255 }),
  keywordVolume: int("keyword_volume"),
  keywordDifficulty: varchar("keyword_difficulty", { length: 20 }),
  wordCount: int("word_count").default(0),
  viewCount: int("view_count").default(0).notNull(),
  // Article status and metadata
  status: varchar("status", { length: 20 }).default("published"),
  language: varchar("language", { length: 10 }).default("both"),
  faqSchema: json("faq_schema").$type<Array<{ question: string; answer: string }>>(),
  internalLinks: json("internal_links").$type<Array<{ slug: string; title: string }>>(),
  publishedAt: timestamp("published_at"),
  // Legacy fields
  readTimeMinutes: int("read_time_minutes").default(5).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  scheduleCronTaskUid: varchar("schedule_cron_task_uid", { length: 65 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BlogArticle = typeof blogArticles.$inferSelect;
export type InsertBlogArticle = typeof blogArticles.$inferInsert;

/**
 * Article views tracking table - records each page view for performance analysis
 */
export const articleViews = mysqlTable("article_views", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("article_id").notNull(),
  visitorId: varchar("visitor_id", { length: 64 }),
  referrer: varchar("referrer", { length: 500 }),
  country: varchar("country", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ArticleView = typeof articleViews.$inferSelect;
export type InsertArticleView = typeof articleViews.$inferInsert;

/**
 * Pillar performance tracking - weekly aggregated performance data per health pillar
 */
export const pillarPerformance = mysqlTable("pillar_performance", {
  id: int("id").autoincrement().primaryKey(),
  pillarId: varchar("pillar_id", { length: 100 }).notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  totalViews: int("total_views").default(0).notNull(),
  totalArticles: int("total_articles").default(0).notNull(),
  avgViewsPerArticle: decimal("avg_views_per_article", { precision: 10, scale: 2 }).default("0"),
  topKeyword: varchar("top_keyword", { length: 255 }),
  weightScore: decimal("weight_score", { precision: 5, scale: 2 }).default("1.0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PillarPerformance = typeof pillarPerformance.$inferSelect;
export type InsertPillarPerformance = typeof pillarPerformance.$inferInsert;

/**
 * Customer reviews/testimonials table
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  rating: int("rating").notNull(), // 1-5
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).default("general").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;
