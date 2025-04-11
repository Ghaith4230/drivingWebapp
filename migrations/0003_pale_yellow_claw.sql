ALTER TABLE `timeslots` ADD `endTime` text NOT NULL;--> statement-breakpoint
ALTER TABLE `timeslots` ADD `location` text NOT NULL;--> statement-breakpoint
ALTER TABLE `timeslots` ADD `booked_by` integer;