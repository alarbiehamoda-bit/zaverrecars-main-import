ALTER TABLE `bookingEnquiries` MODIFY COLUMN `phone` varchar(80);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` MODIFY COLUMN `status` enum('new','contacted','qualified','converted','closed','lost') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `source` varchar(64) DEFAULT 'website' NOT NULL;--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `trackingId` varchar(64);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `landingPath` varchar(512);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `utmSource` varchar(160);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `utmMedium` varchar(160);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `utmCampaign` varchar(160);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `utmTerm` varchar(160);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD `utmContent` varchar(160);--> statement-breakpoint
ALTER TABLE `bookingEnquiries` ADD CONSTRAINT `bookingEnquiries_trackingId_unique` UNIQUE(`trackingId`);--> statement-breakpoint
CREATE INDEX `bookingEnquiries_status_created_idx` ON `bookingEnquiries` (`status`,`createdAt`);--> statement-breakpoint
CREATE INDEX `bookingEnquiries_vehicle_idx` ON `bookingEnquiries` (`vehicleKey`);