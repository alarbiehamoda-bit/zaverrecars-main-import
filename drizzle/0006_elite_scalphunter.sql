CREATE TABLE `adminActivityLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`actorUserId` int,
	`action` varchar(128) NOT NULL,
	`subjectType` varchar(64) NOT NULL,
	`subjectKey` varchar(180),
	`detailsJson` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adminActivityLog_id` PRIMARY KEY(`id`)
);
