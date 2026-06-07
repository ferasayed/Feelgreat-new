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
  interestPath: mysqlEnum("interest_path", ["consumer", "investor", "undecided"]).default("undecided").notNull(),
  language: varchar("language", { length: 10 }).default("ar").notNull(),
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
  // Additional languages (fr, es, de, tr)
  titleFr: text("title_fr"),
  titleEs: text("title_es"),
  titleDe: text("title_de"),
  titleTr: text("title_tr"),
  excerptFr: text("excerpt_fr"),
  excerptEs: text("excerpt_es"),
  excerptDe: text("excerpt_de"),
  excerptTr: text("excerpt_tr"),
  contentFr: text("content_fr"),
  contentEs: text("content_es"),
  contentDe: text("content_de"),
  contentTr: text("content_tr"),
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

/**
 * Research studies table - stores scientific research summaries from PubMed, NIH, etc.
 * Part of the Scientific Discovery Hub (Health Science Hub)
 */
export const researchStudies = mysqlTable("research_studies", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  // Original study metadata
  originalTitle: text("original_title").notNull(),
  doi: varchar("doi", { length: 255 }),
  pubmedId: varchar("pubmed_id", { length: 50 }),
  sourceUrl: varchar("source_url", { length: 500 }).notNull(),
  journal: varchar("journal", { length: 255 }).notNull(),
  university: varchar("university", { length: 255 }),
  authors: text("authors"),
  publishDate: date("publish_date").notNull(),
  // Study classification
  studyType: varchar("study_type", { length: 100 }).notNull(), // RCT, meta-analysis, cohort, case-control, animal, in-vitro, review
  evidenceLevel: varchar("evidence_level", { length: 50 }).notNull(), // high, moderate, low, very-low, preliminary
  participantCount: int("participant_count"),
  isPreliminary: boolean("is_preliminary").default(false).notNull(), // animal/cell study flag
  isHumanStudy: boolean("is_human_study").default(true).notNull(),
  // Topics/categories
  primaryTopic: varchar("primary_topic", { length: 100 }).notNull(),
  topics: json("topics").$type<string[]>().notNull(),
  // AI-generated summaries at different reading levels
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en").notNull(),
  titleFr: text("title_fr"),
  titleEs: text("title_es"),
  titleDe: text("title_de"),
  titleTr: text("title_tr"),
  // 30-second summary
  summary30sAr: text("summary_30s_ar").notNull(),
  summary30sEn: text("summary_30s_en").notNull(),
  summary30sFr: text("summary_30s_fr"),
  summary30sEs: text("summary_30s_es"),
  summary30sDe: text("summary_30s_de"),
  summary30sTr: text("summary_30s_tr"),
  // 1-minute summary
  summary1minAr: text("summary_1min_ar").notNull(),
  summary1minEn: text("summary_1min_en").notNull(),
  summary1minFr: text("summary_1min_fr"),
  summary1minEs: text("summary_1min_es"),
  summary1minDe: text("summary_1min_de"),
  summary1minTr: text("summary_1min_tr"),
  // 3-minute summary
  summary3minAr: text("summary_3min_ar").notNull(),
  summary3minEn: text("summary_3min_en").notNull(),
  summary3minFr: text("summary_3min_fr"),
  summary3minEs: text("summary_3min_es"),
  summary3minDe: text("summary_3min_de"),
  summary3minTr: text("summary_3min_tr"),
  // Full analysis
  fullAnalysisAr: text("full_analysis_ar").notNull(),
  fullAnalysisEn: text("full_analysis_en").notNull(),
  fullAnalysisFr: text("full_analysis_fr"),
  fullAnalysisEs: text("full_analysis_es"),
  fullAnalysisDe: text("full_analysis_de"),
  fullAnalysisTr: text("full_analysis_tr"),
  // "What does this mean for your health?" section
  healthImplicationsAr: text("health_implications_ar").notNull(),
  healthImplicationsEn: text("health_implications_en").notNull(),
  healthImplicationsFr: text("health_implications_fr"),
  healthImplicationsEs: text("health_implications_es"),
  healthImplicationsDe: text("health_implications_de"),
  healthImplicationsTr: text("health_implications_tr"),
  // Key findings structured
  keyFindings: json("key_findings").$type<Array<{ findingEn: string; findingAr: string }>>().notNull(),
  strengthsWeaknesses: json("strengths_weaknesses").$type<{ strengths: string[]; weaknesses: string[] }>(),
  // Smart linking to Feel Great
  feelGreatConnection: text("feel_great_connection"),
  feelGreatConnectionAr: text("feel_great_connection_ar"),
  // SEO
  metaTitleEn: varchar("meta_title_en", { length: 255 }),
  metaTitleAr: varchar("meta_title_ar", { length: 255 }),
  metaDescriptionEn: text("meta_description_en"),
  metaDescriptionAr: text("meta_description_ar"),
  // Media
  heroImageUrl: varchar("hero_image_url", { length: 500 }),
  // Engagement metrics
  viewCount: int("view_count").default(0).notNull(),
  impactScore: int("impact_score").default(0).notNull(), // calculated based on journal, citations, relevance
  // Status
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ([
  index("idx_research_topic").on(table.primaryTopic),
  index("idx_research_published").on(table.isPublished),
  index("idx_research_date").on(table.publishDate),
  index("idx_research_evidence").on(table.evidenceLevel),
]));

export type ResearchStudy = typeof researchStudies.$inferSelect;
export type InsertResearchStudy = typeof researchStudies.$inferInsert;


/**
 * Newsletter subscribers table
 */
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  language: varchar("language", { length: 10 }).default("ar").notNull(),
  interests: text("interests"), // JSON array of interests: health, research, nutrition, leadership
  isActive: boolean("is_active").default(true).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

/**
 * Article comments table - stores user comments on blog articles
 * Supports nested replies, moderation, and multilingual display
 */
export const articleComments = mysqlTable("article_comments", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("article_id").notNull(),
  parentId: int("parent_id"), // null = top-level, non-null = reply
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 320 }),
  content: text("content").notNull(),
  language: varchar("language", { length: 10 }).default("ar").notNull(),
  isApproved: boolean("is_approved").default(true).notNull(), // auto-approve by default
  isSpam: boolean("is_spam").default(false).notNull(),
  likes: int("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ([
  index("idx_comments_article").on(table.articleId),
  index("idx_comments_parent").on(table.parentId),
]));

export type ArticleComment = typeof articleComments.$inferSelect;
export type InsertArticleComment = typeof articleComments.$inferInsert;
