import { db } from "./db";
import { 
  users, 
  gigCategories, 
  locations
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedInitialData() {
  try {
    console.log("Checking if seed data already exists...");

    // Check if we already have categories
    const existingCategories = await db.select().from(gigCategories);
    if (existingCategories.length === 0) {
      console.log("Seeding gig categories...");
      await db.insert(gigCategories).values([
        { name: 'CCTV Repair', description: 'Installation and repair of CCTV systems' },
        { name: 'Network Installation', description: 'Setting up and configuring computer networks' },
        { name: 'Network Troubleshooting', description: 'Diagnosing and fixing network issues' },
        { name: 'Computer Repair', description: 'Hardware and software repair for computers' }
      ]);
    }

    // Check if we already have locations
    const existingLocations = await db.select().from(locations);
    if (existingLocations.length === 0) {
      console.log("Seeding locations...");
      await db.insert(locations).values([
        { name: 'New York' },
        { name: 'Los Angeles' },
        { name: 'Chicago' },
        { name: 'Houston' },
        { name: 'Phoenix' }
      ]);
    }

    // Check if admin user exists
    const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));
    if (existingAdmin.length === 0) {
      console.log("Creating admin user...");
      // Create admin user with hashed password
      await db.insert(users).values({
        username: 'admin',
        email: 'admin@cloudsec.com',
        password: await hashPassword('admin123'),
        role: 'admin'
      });
    }

    console.log("Seed data check complete");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }
}