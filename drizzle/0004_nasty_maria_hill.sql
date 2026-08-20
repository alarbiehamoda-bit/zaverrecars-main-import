CREATE TABLE `vehicleBrands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandName` varchar(120) NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`logoUrl` varchar(1024),
	`logoKey` varchar(1024),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isVisible` boolean NOT NULL DEFAULT true,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleBrands_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicleBrands_brandName_unique` UNIQUE(`brandName`)
);
--> statement-breakpoint
ALTER TABLE `vehicleContent` ADD `publicBrand` varchar(120);--> statement-breakpoint
ALTER TABLE `vehicleContent` ADD `publicCardImageFit` enum('contain','cover','fill');--> statement-breakpoint
ALTER TABLE `vehicleContent` ADD `publicGalleryImageFit` enum('contain','cover','fill');