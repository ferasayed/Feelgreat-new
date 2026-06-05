ALTER TABLE `blog_articles` ADD `meta_title_ar` varchar(255);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `meta_title_en` varchar(255);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `meta_description_ar` text;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `meta_description_en` text;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `hero_image_url` varchar(500);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `og_image_url` varchar(500);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `social_image_url` varchar(500);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `social_facebook` text;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `social_linkedin` text;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `social_instagram` text;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `social_reels_script` text;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `social_tiktok_script` text;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `pillar_id` varchar(100);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `cluster_id` varchar(100);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `target_keyword` varchar(255);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `keyword_volume` int;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `keyword_difficulty` varchar(20);--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `word_count` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `status` varchar(20) DEFAULT 'published';--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `language` varchar(10) DEFAULT 'both';--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `faq_schema` json;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `internal_links` json;--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `published_at` timestamp;