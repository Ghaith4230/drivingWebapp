CREATE TABLE `contacts` (
	`from` integer NOT NULL,
	`to` integer NOT NULL,
	FOREIGN KEY (`from`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`from` integer NOT NULL,
	`to` integer NOT NULL,
	`message` text NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`from`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `timeslots` ADD `endTime` text NOT NULL;--> statement-breakpoint
ALTER TABLE `timeslots` ADD `location` text NOT NULL;--> statement-breakpoint
ALTER TABLE `timeslots` ADD `booked_by` integer;