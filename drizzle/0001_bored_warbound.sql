CREATE INDEX `idx_consultations_status_created` ON `consultation_requests` (`status`,`created_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_programs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`university_id` integer NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`degree_type` text NOT NULL,
	`language` text NOT NULL,
	`duration` text NOT NULL,
	`tuition_fee` text NOT NULL,
	`description` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_programs`("id", "university_id", "slug", "name", "degree_type", "language", "duration", "tuition_fee", "description", "active", "updated_at") SELECT "id", "university_id", "slug", "name", "degree_type", "language", "duration", "tuition_fee", "description", "active", "updated_at" FROM `programs`;--> statement-breakpoint
DROP TABLE `programs`;--> statement-breakpoint
ALTER TABLE `__new_programs` RENAME TO `programs`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `programs_slug_unique` ON `programs` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_programs_university_id` ON `programs` (`university_id`);--> statement-breakpoint
CREATE INDEX `idx_services_active_order` ON `services` (`active`,`sort_order`);