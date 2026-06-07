CREATE TABLE `article_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`article_id` int NOT NULL,
	`parent_id` int,
	`author_name` varchar(255) NOT NULL,
	`author_email` varchar(320),
	`content` text NOT NULL,
	`language` varchar(10) NOT NULL DEFAULT 'ar',
	`is_approved` boolean NOT NULL DEFAULT true,
	`is_spam` boolean NOT NULL DEFAULT false,
	`likes` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_comments_article` ON `article_comments` (`article_id`);--> statement-breakpoint
CREATE INDEX `idx_comments_parent` ON `article_comments` (`parent_id`);