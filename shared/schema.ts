import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'service_provider', 'client', 'super_admin']);
export const verificationStatusEnum = pgEnum('verification_status', ['pending', 'approved', 'rejected']);
export const gigStatusEnum = pgEnum('gig_status', ['open', 'allocated', 'in_progress', 'completed', 'cancelled']);

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default('client'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Service Provider Profiles
export const serviceProviderProfiles = pgTable("service_provider_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text("full_name").notNull(),
  location: text("location").notNull(),
  skills: text("skills").array(),
  experience: text("experience"),
  availability: text("availability"),
  bio: text("bio"),
  phone: text("phone"),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default('pending'),
  avgRating: integer("avg_rating"),
});

// Client Profiles
export const clientProfiles = pgTable("client_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  companyName: text("company_name"),
  contactName: text("contact_name").notNull(),
  location: text("location").notNull(),
  phone: text("phone"),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default('pending'),
});

// Gig Categories
export const gigCategories = pgTable("gig_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

// Locations
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// Gigs
export const gigs = pgTable("gigs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  clientId: integer("client_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => gigCategories.id),
  locationId: integer("location_id").notNull().references(() => locations.id),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: gigStatusEnum("status").notNull().default('open'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  providerId: integer("provider_id").references(() => users.id),
});

// Ratings
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  gigId: integer("gig_id").notNull().references(() => gigs.id, { onDelete: 'cascade' }),
  clientId: integer("client_id").notNull().references(() => users.id),
  providerId: integer("provider_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true });

export const insertServiceProviderProfileSchema = createInsertSchema(serviceProviderProfiles)
  .omit({ id: true, avgRating: true, verificationStatus: true });

export const insertClientProfileSchema = createInsertSchema(clientProfiles)
  .omit({ id: true, verificationStatus: true });

export const insertGigCategorySchema = createInsertSchema(gigCategories)
  .omit({ id: true });

export const insertLocationSchema = createInsertSchema(locations)
  .omit({ id: true });

export const insertGigSchema = createInsertSchema(gigs)
  .omit({ id: true, createdAt: true, providerId: true, status: true });

export const insertRatingSchema = createInsertSchema(ratings)
  .omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertServiceProviderProfile = z.infer<typeof insertServiceProviderProfileSchema>;
export type ServiceProviderProfile = typeof serviceProviderProfiles.$inferSelect;

export type InsertClientProfile = z.infer<typeof insertClientProfileSchema>;
export type ClientProfile = typeof clientProfiles.$inferSelect;

export type InsertGigCategory = z.infer<typeof insertGigCategorySchema>;
export type GigCategory = typeof gigCategories.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type InsertGig = z.infer<typeof insertGigSchema>;
export type Gig = typeof gigs.$inferSelect;

export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;

// Combined types for API
export type UserWithProfile = User & {
  serviceProviderProfile?: ServiceProviderProfile;
  clientProfile?: ClientProfile;
};

export type GigWithDetails = Gig & {
  category: GigCategory;
  location: Location;
  client: User & { clientProfile?: ClientProfile };
  provider?: User & { serviceProviderProfile?: ServiceProviderProfile };
};