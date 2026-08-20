CREATE TABLE `firstBookingCoupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`phone` varchar(80) NOT NULL,
	`phoneNormalized` varchar(32) NOT NULL,
	`email` varchar(320),
	`couponCode` varchar(48) NOT NULL,
	`discountPercent` int NOT NULL DEFAULT 10,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `firstBookingCoupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `firstBookingCoupons_phoneNormalized_unique` UNIQUE(`phoneNormalized`),
	CONSTRAINT `firstBookingCoupons_couponCode_unique` UNIQUE(`couponCode`)
);
