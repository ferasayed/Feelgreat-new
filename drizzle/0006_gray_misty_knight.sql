CREATE TABLE `article_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_id` int NOT NULL,
	`visitor_id` varchar(64),
	`referrer` varchar(500),
	`country` varchar(10),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pillar_performance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pillar_id` varchar(100) NOT NULL,
	`period_start` date NOT NULL,
	`period_end` date NOT NULL,
	`total_views` int NOT NULL DEFAULT 0,
	`total_articles` int NOT NULL DEFAULT 0,
	`avg_views_per_article` decimal(10,2) DEFAULT '0',
	`top_keyword` varchar(255),
	`weight_score` decimal(5,2) DEFAULT '1.0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pillar_performance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `blog_articles` ADD `view_count` int DEFAULT 0 NOT NULL;