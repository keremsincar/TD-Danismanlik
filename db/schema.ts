import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey(),
  siteName: text("site_name").notNull(),
  heroTitle: text("hero_title").notNull(),
  heroDescription: text("hero_description").notNull(),
  ctaText: text("cta_text").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  address: text("address").notNull().default(""),
  hours: text("hours").notNull().default(""),
  email: text("email").notNull(),
  headingFont: text("heading_font").notNull(),
  bodyFont: text("body_font").notNull(),
  primaryColor: text("primary_color").notNull(),
  accentColor: text("accent_color").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }), slug: text("slug").notNull().unique(),
  title: text("title").notNull(), summary: text("summary").notNull(), detail: text("detail").notNull(),
  icon: text("icon").notNull(), active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0), updatedAt: text("updated_at").notNull(),
}, table => [index("idx_services_active_order").on(table.active, table.sortOrder)]);

export const universities = sqliteTable("universities", {
  id: integer("id").primaryKey({ autoIncrement: true }), slug: text("slug").notNull().unique(),
  name: text("name").notNull(), city: text("city").notNull(), country: text("country").notNull(),
  description: text("description").notNull(), featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  active: integer("active", { mode: "boolean" }).notNull().default(true), updatedAt: text("updated_at").notNull(),
});

export const programs = sqliteTable("programs", {
  id: integer("id").primaryKey({ autoIncrement: true }), universityId: integer("university_id").notNull().references(()=>universities.id),
  slug: text("slug").notNull().unique(), name: text("name").notNull(), degreeType: text("degree_type").notNull(),
  language: text("language").notNull(), duration: text("duration").notNull(), tuitionFee: text("tuition_fee").notNull(),
  description: text("description").notNull(), active: integer("active", { mode: "boolean" }).notNull().default(true),
  updatedAt: text("updated_at").notNull(),
}, table => [index("idx_programs_university_id").on(table.universityId)]);

export const consultationRequests = sqliteTable("consultation_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(), email: text("email").notNull(), service: text("service").notNull(),
  university: text("university"), program: text("program"), message: text("message").notNull(),
  preferredContact: text("preferred_contact").notNull(), kvkkAcceptedAt: text("kvkk_accepted_at").notNull(),
  status: text("status").notNull(), adminNote: text("admin_note").notNull(), createdAt: text("created_at").notNull(),
}, table => [index("idx_consultations_status_created").on(table.status, table.createdAt)]);

export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }), question: text("question").notNull(), answer: text("answer").notNull(),
  category: text("category").notNull(), active: integer("active", { mode: "boolean" }).notNull().default(true), sortOrder: integer("sort_order").notNull(),
});

export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }), actor: text("actor").notNull(), action: text("action").notNull(),
  detail: text("detail").notNull(), createdAt: text("created_at").notNull(),
});

export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(), count: integer("count").notNull(), resetAt: integer("reset_at").notNull(),
});

export const homeContent = sqliteTable("home_content", {
  key: text("key").primaryKey(), value: text("value").notNull(), updatedAt: text("updated_at").notNull(),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  author: text("author").notNull(), context: text("context").notNull(), quote: text("quote").notNull(),
  isExample: integer("is_example", { mode: "boolean" }).notNull().default(true),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0), updatedAt: text("updated_at").notNull(),
}, table => [index("idx_reviews_active_order").on(table.active, table.sortOrder)]);
