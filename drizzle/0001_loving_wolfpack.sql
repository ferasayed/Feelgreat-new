CREATE TABLE `chat_conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`visitorId` varchar(64) NOT NULL,
	`messages` json NOT NULL,
	`interestLevel` enum('low','medium','high') NOT NULL DEFAULT 'low',
	`isHighInterest` boolean NOT NULL DEFAULT false,
	`ownerNotified` boolean NOT NULL DEFAULT false,
	`visitorName` varchar(255),
	`visitorEmail` varchar(320),
	`messageCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`country` varchar(100) NOT NULL,
	`source` varchar(50) NOT NULL DEFAULT 'form',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
