CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`detail` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `consultation_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`whatsapp` text NOT NULL,
	`email` text NOT NULL,
	`service` text NOT NULL,
	`university` text,
	`program` text,
	`message` text NOT NULL,
	`preferred_contact` text NOT NULL,
	`kvkk_accepted_at` text NOT NULL,
	`status` text NOT NULL,
	`admin_note` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `programs` (
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
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `programs_slug_unique` ON `programs` (`slug`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`reset_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`detail` text NOT NULL,
	`icon` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`site_name` text NOT NULL,
	`hero_title` text NOT NULL,
	`hero_description` text NOT NULL,
	`cta_text` text NOT NULL,
	`phone` text NOT NULL,
	`whatsapp` text NOT NULL,
	`email` text NOT NULL,
	`heading_font` text NOT NULL,
	`body_font` text NOT NULL,
	`primary_color` text NOT NULL,
	`accent_color` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `universities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`country` text NOT NULL,
	`description` text NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `universities_slug_unique` ON `universities` (`slug`);