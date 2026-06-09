CREATE TABLE `glossary_terms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(255) NOT NULL,
	`term_ar` varchar(255) NOT NULL,
	`term_en` varchar(255) NOT NULL,
	`definition_ar` text NOT NULL,
	`definition_en` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`related_terms` json,
	`related_articles` json,
	`sources` json,
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `glossary_terms_id` PRIMARY KEY(`id`),
	CONSTRAINT `glossary_terms_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
ALTER TABLE `leads` ADD `interest_path` enum('consumer','investor','undecided') DEFAULT 'undecided' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `language` varchar(10) DEFAULT 'ar' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_glossary_category` ON `glossary_terms` (`category`);--> statement-breakpoint
CREATE INDEX `idx_glossary_published` ON `glossary_terms` (`is_published`);