CREATE TABLE `contentSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`settingKey` varchar(128) NOT NULL,
	`valueJson` text NOT NULL,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `contentSettings_settingKey_unique` UNIQUE(`settingKey`)
);
--> statement-breakpoint
CREATE TABLE `journalEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`eyebrow` varchar(180) NOT NULL,
	`title` varchar(512) NOT NULL,
	`summary` text NOT NULL,
	`imageUrl` varchar(1024) NOT NULL,
	`imageAlt` varchar(512) NOT NULL,
	`paragraphsJson` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journalEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `journalEntries_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `siteFaqEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` varchar(512) NOT NULL,
	`answer` text NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT true,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `siteFaqEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `status` enum('new','contacted','closed') DEFAULT 'new' NOT NULL;