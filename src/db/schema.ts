import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  photoUrl: text('photo_url'),
  role: text('role').default('client'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Consultation requests
export const consultationRequests = pgTable('consultation_requests', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  projectType: text('project_type'),
  budget: text('budget'),
  timeline: text('timeline'),
  description: text('description'),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Founding members & strategic partners
export const foundingMembers = pgTable('founding_members', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  fullName: text('full_name').notNull(),
  brandName: text('brand_name'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  category: text('category'),
  status: text('status').default('under_review'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Diagnostic 99 audit & counter-intelligence logs
export const diagnosticLogs = pgTable('diagnostic_logs', {
  id: serial('id').primaryKey(),
  score: integer('score'),
  classification: text('classification'),
  answers: text('answers'),
  flaggedCompetitor: text('flagged_competitor'),
  createdAt: timestamp('created_at').defaultNow(),
});
