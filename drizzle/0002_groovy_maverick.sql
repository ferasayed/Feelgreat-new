ALTER TABLE `leads` ADD `followUpStatus` enum('pending','contacted','converted','lost') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `followUpCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `leads` ADD `lastFollowUpAt` timestamp;