CREATE TABLE `bookingEnquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleKey` varchar(64) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`phone` varchar(80) NOT NULL,
	`email` varchar(320),
	`pickupDate` varchar(32),
	`returnDate` varchar(32),
	`pickupLocation` varchar(255),
	`deliveryRequired` boolean NOT NULL DEFAULT false,
	`driverAge` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookingEnquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `vehicleContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleKey` varchar(64) NOT NULL,
	`publicYear` int,
	`publicDescription` text,
	`publicSpecificationsJson` text,
	`publicRentalDetailsJson` text,
	`publicFeaturesJson` text,
	`publicFaqJson` text,
	`publicAdditionalInfoJson` text,
	`publicCustomerPriceAed` int,
	`visibility` enum('listed','hidden') NOT NULL DEFAULT 'listed',
	`featured` boolean NOT NULL DEFAULT false,
	`internalB2bPriceAed` int,
	`internalMarkupAed` int,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleContent_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicleContent_vehicleKey_unique` UNIQUE(`vehicleKey`)
);
--> statement-breakpoint
CREATE TABLE `vehicleImages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleKey` varchar(64) NOT NULL,
	`imageUrl` varchar(1024) NOT NULL,
	`altText` varchar(512),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleImages_id` PRIMARY KEY(`id`)
);
