CREATE TABLE `feedback` (
	`date` text NOT NULL,
	`time` text NOT NULL,
	`feedback` text NOT NULL,
	PRIMARY KEY(`date`, `time`),
	FOREIGN KEY (`date`) REFERENCES `timeslots`(`date`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`time`) REFERENCES `timeslots`(`time`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `timeslots` DROP COLUMN `endTime`;--> statement-breakpoint
ALTER TABLE `timeslots` DROP COLUMN `location`;--> statement-breakpoint
ALTER TABLE `timeslots` DROP COLUMN `booked_by`;