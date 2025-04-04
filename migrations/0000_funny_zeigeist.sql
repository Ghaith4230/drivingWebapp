CREATE TABLE `Profile` (
	`user_id` integer PRIMARY KEY NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`phoneNumber` text NOT NULL,
	`Address` text NOT NULL,
	`Country` text NOT NULL,
	`ZipCode` text NOT NULL,
	`Gender` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Profile_firstName_unique` ON `Profile` (`firstName`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profile_lastName_unique` ON `Profile` (`lastName`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profile_phoneNumber_unique` ON `Profile` (`phoneNumber`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profile_Address_unique` ON `Profile` (`Address`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profile_Country_unique` ON `Profile` (`Country`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profile_ZipCode_unique` ON `Profile` (`ZipCode`);--> statement-breakpoint
CREATE UNIQUE INDEX `Profile_Gender_unique` ON `Profile` (`Gender`);--> statement-breakpoint
CREATE TABLE `timeslots` (
	`date` text NOT NULL,
	`time` text NOT NULL,
	`user_id` integer NOT NULL,
	`content` text NOT NULL,
	PRIMARY KEY(`date`, `time`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`verification_token` text,
	`is_verified` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);