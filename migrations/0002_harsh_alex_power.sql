PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_Profile` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`Address` text NOT NULL,
	`Country` text NOT NULL,
	`ZipCode` text NOT NULL,
	`Gender` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_Profile`("user_id", "firstName", "lastName", "phoneNumber", "Address", "Country", "ZipCode", "Gender") SELECT "user_id", "firstName", "lastName", "phoneNumber", "Address", "Country", "ZipCode", "Gender" FROM `Profile`;--> statement-breakpoint
DROP TABLE `Profile`;--> statement-breakpoint
ALTER TABLE `__new_Profile` RENAME TO `Profile`;--> statement-breakpoint
PRAGMA foreign_keys=ON;