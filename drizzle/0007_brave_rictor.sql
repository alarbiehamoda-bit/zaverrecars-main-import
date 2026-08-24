CREATE TABLE `adminRoles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roleKey` varchar(64) NOT NULL,
	`displayName` varchar(120) NOT NULL,
	`description` varchar(512),
	`capabilitiesJson` text NOT NULL,
	`isSystem` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `adminRoles_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminRoles_roleKey_unique` UNIQUE(`roleKey`)
);
--> statement-breakpoint
CREATE TABLE `adminUserRoleAssignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`roleId` int NOT NULL,
	`assignedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminUserRoleAssignments_id` PRIMARY KEY(`id`),
	CONSTRAINT `adminUserRoleAssignments_user_role_unique` UNIQUE(`userId`,`roleId`)
);
--> statement-breakpoint
CREATE TABLE `rentalDepositPolicies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scopeType` enum('default','category','vehicle') NOT NULL,
	`scopeKey` varchar(120) NOT NULL,
	`depositAed` int NOT NULL,
	`refundWindowDays` int NOT NULL DEFAULT 25,
	`note` varchar(512),
	`isActive` boolean NOT NULL DEFAULT true,
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rentalDepositPolicies_id` PRIMARY KEY(`id`),
	CONSTRAINT `rentalDepositPolicies_scope_unique` UNIQUE(`scopeType`,`scopeKey`)
);
--> statement-breakpoint
CREATE TABLE `vehicleOperationStatusHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleKey` varchar(64) NOT NULL,
	`previousStatus` enum('available','reserved','rented','maintenance','hidden'),
	`nextStatus` enum('available','reserved','rented','maintenance','hidden') NOT NULL,
	`note` varchar(512),
	`changedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicleOperationStatusHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicleOperations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleKey` varchar(64) NOT NULL,
	`status` enum('available','reserved','rented','maintenance','hidden') NOT NULL DEFAULT 'available',
	`depositOverrideAed` int,
	`operationalNote` varchar(512),
	`updatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicleOperations_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicleOperations_vehicleKey_unique` UNIQUE(`vehicleKey`)
);
--> statement-breakpoint
CREATE INDEX `adminUserRoleAssignments_user_idx` ON `adminUserRoleAssignments` (`userId`);--> statement-breakpoint
CREATE INDEX `vehicleOperationStatusHistory_vehicle_idx` ON `vehicleOperationStatusHistory` (`vehicleKey`,`createdAt`);