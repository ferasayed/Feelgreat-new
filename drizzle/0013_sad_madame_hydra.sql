CREATE TABLE `share_counts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content_type` enum('article','research') NOT NULL,
	`content_slug` varchar(255) NOT NULL,
	`platform` enum('copy','whatsapp','telegram','twitter','facebook') NOT NULL,
	`count` int NOT NULL DEFAULT 0,
	`last_shared_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `share_counts_id` PRIMARY KEY(`id`),
	CONSTRAINT `idx_share_unique` UNIQUE(`content_type`,`content_slug`,`platform`)
);
--> statement-breakpoint
CREATE INDEX `idx_share_slug` ON `share_counts` (`content_slug`);