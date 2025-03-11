ALTER TABLE `posts` RENAME TO `timeslots`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_timeslots` (
	`date` text,
	`timeslot` integer,
	`user_id` integer NOT NULL,
	`content` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_timeslots`("date", "timeslot", "user_id", "content") SELECT "date", "timeslot", "user_id", "content" FROM `timeslots`;--> statement-breakpoint
DROP TABLE `timeslots`;--> statement-breakpoint
ALTER TABLE `__new_timeslots` RENAME TO `timeslots`;--> statement-breakpoint
PRAGMA foreign_keys=ON;