PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_messages_table` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text,
	`reaction` text,
	`attachments` text,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`createdBy` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_messages_table`("id", "content", "reaction", "attachments", "createdAt", "createdBy") SELECT "id", "content", "reaction", "attachments", "createdAt", "createdBy" FROM `messages_table`;--> statement-breakpoint
DROP TABLE `messages_table`;--> statement-breakpoint
ALTER TABLE `__new_messages_table` RENAME TO `messages_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;