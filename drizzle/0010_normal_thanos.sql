CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`language` varchar(10) NOT NULL DEFAULT 'ar',
	`interests` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`subscribed_at` timestamp NOT NULL DEFAULT (now()),
	`unsubscribed_at` timestamp,
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_subscribers_email_unique` UNIQUE(`email`)
);
