PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feedback` (
	`date` text NOT NULL,
	`time` text NOT NULL,
	`feedback` text NOT NULL,
	PRIMARY KEY(`date`, `time`)
);
--> statement-breakpoint
INSERT INTO `__new_feedback`("date", "time", "feedback") SELECT "date", "time", "feedback" FROM `feedback`;--> statement-breakpoint
DROP TABLE `feedback`;--> statement-breakpoint
ALTER TABLE `__new_feedback` RENAME TO `feedback`;--> statement-breakpoint
PRAGMA foreign_keys=ON;