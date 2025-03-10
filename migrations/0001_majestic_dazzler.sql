DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` integer DEFAULT 0 NOT NULL;