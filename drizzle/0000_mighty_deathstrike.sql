CREATE TABLE `attachments_table` (
	`id` text PRIMARY KEY NOT NULL,
	`messageId` text NOT NULL,
	`fileName` text NOT NULL,
	`fileType` text NOT NULL,
	`fileSize` integer NOT NULL,
	`filePath` text NOT NULL,
	`mimeType` text NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`messageId`) REFERENCES `messages_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `messages_table` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`reaction` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`createdBy` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users_table` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
