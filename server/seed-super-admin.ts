import { db } from "./db";
import { users, userRoleEnum } from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * This script creates a super admin user with the specified credentials
 * Run with: npx tsx server/seed-super-admin.ts
 */
async function createSuperAdmin() {
  console.log("Creating super admin user...");
  
  const username = "superadmin";
  const email = "superadmin@cloudsec.tech";
  const password = "Admin@123"; // This would be replaced with a secure password in production
  
  try {
    // Check if super admin already exists
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    
    if (existingUser.length > 0) {
      // Update the existing user to have the super_admin role
      console.log("Super admin user already exists. Updating role to super_admin...");
      await db.update(users)
        .set({ role: 'super_admin' })
        .where(eq(users.username, username));
    } else {
      // Create a new super admin user
      console.log("Creating new super admin user...");
      await db.insert(users).values({
        username,
        email,
        password: await hashPassword(password),
        role: 'super_admin',
      });
    }
    
    console.log("✅ Super admin user created/updated successfully.");
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Email:", email);
  } catch (error) {
    console.error("Error creating super admin user:", error);
  } finally {
    process.exit(0);
  }
}

createSuperAdmin();
