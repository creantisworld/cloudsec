import { 
  users, type User, type InsertUser,
  serviceProviderProfiles, type ServiceProviderProfile, type InsertServiceProviderProfile,
  clientProfiles, type ClientProfile, type InsertClientProfile,
  gigCategories, type GigCategory, type InsertGigCategory,
  locations, type Location, type InsertLocation,
  gigs, type Gig, type InsertGig,
  ratings, type Rating, type InsertRating,
  type UserWithProfile, type GigWithDetails
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db, pool } from "./db";
import { eq, and, or, desc, asc } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);
const PgSessionStore = connectPgSimple(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersWithRole(role: string): Promise<User[]>;

  // Service Provider Profiles
  getServiceProviderProfile(userId: number): Promise<ServiceProviderProfile | undefined>;
  createServiceProviderProfile(profile: InsertServiceProviderProfile): Promise<ServiceProviderProfile>;
  updateServiceProviderProfile(userId: number, profile: Partial<ServiceProviderProfile>): Promise<ServiceProviderProfile | undefined>;
  getAllServiceProviders(): Promise<UserWithProfile[]>;
  updateServiceProviderVerification(userId: number, status: string): Promise<ServiceProviderProfile | undefined>;
  getServiceProviderWithProfile(userId: number): Promise<UserWithProfile | undefined>;

  // Client Profiles
  getClientProfile(userId: number): Promise<ClientProfile | undefined>;
  createClientProfile(profile: InsertClientProfile): Promise<ClientProfile>;
  updateClientProfile(userId: number, profile: Partial<ClientProfile>): Promise<ClientProfile | undefined>;
  getAllClients(): Promise<UserWithProfile[]>;
  updateClientVerification(userId: number, status: string): Promise<ClientProfile | undefined>;
  getClientWithProfile(userId: number): Promise<UserWithProfile | undefined>;

  // GigCategories
  createGigCategory(category: InsertGigCategory): Promise<GigCategory>;
  updateGigCategory(id: number, category: Partial<GigCategory>): Promise<GigCategory | undefined>;
  deleteGigCategory(id: number): Promise<boolean>;
  getGigCategories(): Promise<GigCategory[]>;
  getGigCategoryById(id: number): Promise<GigCategory | undefined>;

  // Locations
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: number, location: Partial<Location>): Promise<Location | undefined>;
  deleteLocation(id: number): Promise<boolean>;
  getLocations(): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;

  // Gigs
  createGig(gig: InsertGig): Promise<Gig>;
  updateGig(id: number, gig: Partial<Gig>): Promise<Gig | undefined>;
  deleteGig(id: number): Promise<boolean>;
  getGigById(id: number): Promise<GigWithDetails | undefined>;
  getGigsByClientId(clientId: number): Promise<GigWithDetails[]>;
  getGigsByProviderId(providerId: number): Promise<GigWithDetails[]>;
  getAllGigs(): Promise<GigWithDetails[]>;
  getGigsByStatus(status: string): Promise<GigWithDetails[]>;
  allocateGigToProvider(gigId: number, providerId: number): Promise<Gig | undefined>;
  getAllGigsWithDetails(): Promise<GigWithDetails[]>;
  getGigsByStatusWithDetails(status: string): Promise<GigWithDetails[]>;
  getCompletedGigsByProviderId(providerId: number): Promise<GigWithDetails[]>;

  // Ratings
  createRating(rating: InsertRating): Promise<Rating>;
  getRatingsByProviderId(providerId: number): Promise<Rating[]>;
  getRatingsByGigId(gigId: number): Promise<Rating[]>;
  updateProviderAverageRating(providerId: number): Promise<void>;

  // Session store
  sessionStore: session.Store;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Set up postgres session store
    this.sessionStore = new PgSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUsersWithRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role as any));
  }

  // Service Provider Profiles
  async getServiceProviderProfile(userId: number): Promise<ServiceProviderProfile | undefined> {
    const [profile] = await db
      .select()
      .from(serviceProviderProfiles)
      .where(eq(serviceProviderProfiles.userId, userId));
    return profile;
  }

  async createServiceProviderProfile(profile: InsertServiceProviderProfile): Promise<ServiceProviderProfile> {
    const [newProfile] = await db
      .insert(serviceProviderProfiles)
      .values({
        ...profile,
        verificationStatus: 'pending',
        avgRating: null
      })
      .returning();
    return newProfile;
  }

  async updateServiceProviderProfile(userId: number, profileUpdate: Partial<ServiceProviderProfile>): Promise<ServiceProviderProfile | undefined> {
    const [profile] = await db
      .select()
      .from(serviceProviderProfiles)
      .where(eq(serviceProviderProfiles.userId, userId));

    if (!profile) return undefined;

    const [updatedProfile] = await db
      .update(serviceProviderProfiles)
      .set(profileUpdate)
      .where(eq(serviceProviderProfiles.userId, userId))
      .returning();

    return updatedProfile;
  }

  async getAllServiceProviders(): Promise<UserWithProfile[]> {
    const providers = await this.getUsersWithRole('service_provider');

    return await Promise.all(providers.map(async (user) => {
      const profile = await this.getServiceProviderProfile(user.id);
      return {
        ...user,
        serviceProviderProfile: profile
      };
    }));
  }

  async getServiceProviderWithProfile(userId: number): Promise<UserWithProfile | undefined> {
    const user = await this.getUser(userId);
    if (!user || user.role !== 'service_provider') return undefined;

    const profile = await this.getServiceProviderProfile(userId);
    return {
      ...user,
      serviceProviderProfile: profile
    };
  }

  async updateServiceProviderVerification(userId: number, status: string): Promise<ServiceProviderProfile | undefined> {
    // Check if profile exists
    let profile = await this.getServiceProviderProfile(userId);

    if (!profile) {
      // First create a basic profile without specifying verificationStatus
      // (will default to 'pending')
      profile = await this.createServiceProviderProfile({
        userId,
        fullName: "Service Provider",  // Use a default name for required field
        location: "Not specified",     // Use a default for required field
        skills: [],                    // Empty array for skills
        bio: null,
        experience: null,
        availability: null,
        phone: null
      });
    }

    // Now update the profile's verification status
    return this.updateServiceProviderProfile(userId, { 
      verificationStatus: status as 'pending' | 'approved' | 'rejected' 
    });
  }

  // Client Profiles
  async getClientProfile(userId: number): Promise<ClientProfile | undefined> {
    const [profile] = await db
      .select()
      .from(clientProfiles)
      .where(eq(clientProfiles.userId, userId));
    return profile;
  }

  async createClientProfile(profile: InsertClientProfile): Promise<ClientProfile> {
    const [newProfile] = await db
      .insert(clientProfiles)
      .values({
        ...profile,
        verificationStatus: 'pending'
      })
      .returning();
    return newProfile;
  }

  async updateClientProfile(userId: number, profileUpdate: Partial<ClientProfile>): Promise<ClientProfile | undefined> {
    const [profile] = await db
      .select()
      .from(clientProfiles)
      .where(eq(clientProfiles.userId, userId));

    if (!profile) return undefined;

    const [updatedProfile] = await db
      .update(clientProfiles)
      .set(profileUpdate)
      .where(eq(clientProfiles.userId, userId))
      .returning();

    return updatedProfile;
  }

  async getAllClients(): Promise<UserWithProfile[]> {
    const clients = await this.getUsersWithRole('client');

    return await Promise.all(clients.map(async (user) => {
      const profile = await this.getClientProfile(user.id);
      return {
        ...user,
        clientProfile: profile
      };
    }));
  }

  async getClientWithProfile(userId: number): Promise<UserWithProfile | undefined> {
    const user = await this.getUser(userId);
    if (!user || user.role !== 'client') return undefined;

    const profile = await this.getClientProfile(userId);
    return {
      ...user,
      clientProfile: profile
    };
  }

  async updateClientVerification(userId: number, status: string): Promise<ClientProfile | undefined> {
    // Check if profile exists
    let profile = await this.getClientProfile(userId);

    if (!profile) {
      // First create a basic profile without specifying verificationStatus
      // (will default to 'pending')
      profile = await this.createClientProfile({
        userId,
        contactName: "Client",        // Use a default name for required field
        location: "Not specified",    // Use a default for required field
        companyName: null,
        phone: null
      });
    }

    // Now update the profile's verification status
    return this.updateClientProfile(userId, { 
      verificationStatus: status as 'pending' | 'approved' | 'rejected' 
    });
  }

  // GigCategories
  async createGigCategory(category: InsertGigCategory): Promise<GigCategory> {
    const [newCategory] = await db
      .insert(gigCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateGigCategory(id: number, categoryUpdate: Partial<GigCategory>): Promise<GigCategory | undefined> {
    const [category] = await db
      .select()
      .from(gigCategories)
      .where(eq(gigCategories.id, id));

    if (!category) return undefined;

    const [updatedCategory] = await db
      .update(gigCategories)
      .set(categoryUpdate)
      .where(eq(gigCategories.id, id))
      .returning();

    return updatedCategory;
  }

  async deleteGigCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(gigCategories)
      .where(eq(gigCategories.id, id));

    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getGigCategories(): Promise<GigCategory[]> {
    return await db.select().from(gigCategories);
  }

  async getGigCategoryById(id: number): Promise<GigCategory | undefined> {
    const [category] = await db
      .select()
      .from(gigCategories)
      .where(eq(gigCategories.id, id));
    return category;
  }

  // Locations
  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db
      .insert(locations)
      .values(location)
      .returning();
    return newLocation;
  }

  async updateLocation(id: number, locationUpdate: Partial<Location>): Promise<Location | undefined> {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id));

    if (!location) return undefined;

    const [updatedLocation] = await db
      .update(locations)
      .set(locationUpdate)
      .where(eq(locations.id, id))
      .returning();

    return updatedLocation;
  }

  async deleteLocation(id: number): Promise<boolean> {
    const result = await db
      .delete(locations)
      .where(eq(locations.id, id));

    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations);
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const [location] = await db
      .select()
      .from(locations)
      .where(eq(locations.id, id));
    return location;
  }

  // Gigs
  async createGig(gig: InsertGig): Promise<Gig> {
    const [newGig] = await db
      .insert(gigs)
      .values({
        ...gig,
        status: 'open',
        providerId: null
      })
      .returning();
    return newGig;
  }

  async updateGig(id: number, gigUpdate: Partial<Gig>): Promise<Gig | undefined> {
    const [gig] = await db
      .select()
      .from(gigs)
      .where(eq(gigs.id, id));

    if (!gig) return undefined;

    const [updatedGig] = await db
      .update(gigs)
      .set(gigUpdate)
      .where(eq(gigs.id, id))
      .returning();

    return updatedGig;
  }

  async deleteGig(id: number): Promise<boolean> {
    const result = await db
      .delete(gigs)
      .where(eq(gigs.id, id));

    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getGigById(id: number): Promise<GigWithDetails | undefined> {
    const [gig] = await db
      .select()
      .from(gigs)
      .where(eq(gigs.id, id));

    if (!gig) return undefined;

    const category = await this.getGigCategoryById(gig.categoryId);
    const location = await this.getLocationById(gig.locationId);
    const client = await this.getUser(gig.clientId);

    if (!category || !location || !client) return undefined;

    const clientProfile = await this.getClientProfile(client.id);

    let provider;
    let providerProfile;

    if (gig.providerId) {
      provider = await this.getUser(gig.providerId);
      if (provider) {
        providerProfile = await this.getServiceProviderProfile(provider.id);
      }
    }

    return {
      ...gig,
      category,
      location,
      client: {
        ...client,
        clientProfile
      },
      provider: provider ? {
        ...provider,
        serviceProviderProfile: providerProfile
      } : undefined
    };
  }

  async getGigsByClientId(clientId: number): Promise<GigWithDetails[]> {
    const clientGigs = await db
      .select()
      .from(gigs)
      .where(eq(gigs.clientId, clientId));

    const gigDetails = await Promise.all(
      clientGigs.map(async (gig) => await this.getGigById(gig.id))
    );

    return gigDetails.filter((gig): gig is GigWithDetails => gig !== undefined);
  }

  async getGigsByProviderId(providerId: number): Promise<GigWithDetails[]> {
    const providerGigs = await db
      .select()
      .from(gigs)
      .where(eq(gigs.providerId, providerId));

    const gigDetails = await Promise.all(
      providerGigs.map(async (gig) => await this.getGigById(gig.id))
    );

    return gigDetails.filter((gig): gig is GigWithDetails => gig !== undefined);
  }

  async getAllGigs(): Promise<GigWithDetails[]> {
    const allGigs = await db.select().from(gigs);

    const gigDetails = await Promise.all(
      allGigs.map(async (gig) => await this.getGigById(gig.id))
    );

    return gigDetails.filter((gig): gig is GigWithDetails => gig !== undefined);
  }

  async getAllGigsWithDetails(): Promise<GigWithDetails[]> {
    return this.getAllGigs();
  }

  async getGigsByStatus(status: string): Promise<GigWithDetails[]> {
    const statusGigs = await db
      .select()
      .from(gigs)
      .where(eq(gigs.status, status as any));

    const gigDetails = await Promise.all(
      statusGigs.map(async (gig) => await this.getGigById(gig.id))
    );

    return gigDetails.filter((gig): gig is GigWithDetails => gig !== undefined);
  }

  async getGigsByStatusWithDetails(status: string): Promise<GigWithDetails[]> {
    return this.getGigsByStatus(status);
  }

  async getCompletedGigsByProviderId(providerId: number): Promise<GigWithDetails[]> {
    const completedGigs = await db
      .select()
      .from(gigs)
      .where(and(
        eq(gigs.providerId, providerId),
        eq(gigs.status, 'completed' as any)
      ));

    const gigDetails = await Promise.all(
      completedGigs.map(async (gig) => await this.getGigById(gig.id))
    );

    return gigDetails.filter((gig): gig is GigWithDetails => gig !== undefined);
  }

  async allocateGigToProvider(gigId: number, providerId: number): Promise<Gig | undefined> {
    const [gig] = await db
      .select()
      .from(gigs)
      .where(and(eq(gigs.id, gigId), eq(gigs.status, 'open' as any)));

    if (!gig) return undefined;

    const [provider] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, providerId), eq(users.role, 'service_provider' as any)));

    if (!provider) return undefined;

    const [updatedGig] = await db
      .update(gigs)
      .set({ 
        providerId, 
        status: 'allocated' as any
      })
      .where(eq(gigs.id, gigId))
      .returning();

    return updatedGig;
  }

  // Ratings
  async createRating(rating: InsertRating): Promise<Rating> {
    const [newRating] = await db
      .insert(ratings)
      .values(rating)
      .returning();

    // Update provider's average rating
    await this.updateProviderAverageRating(rating.providerId);

    return newRating;
  }

  async getRatingsByProviderId(providerId: number): Promise<Rating[]> {
    return await db
      .select()
      .from(ratings)
      .where(eq(ratings.providerId, providerId));
  }

  async getRatingsByGigId(gigId: number): Promise<Rating[]> {
    return await db
      .select()
      .from(ratings)
      .where(eq(ratings.gigId, gigId));
  }

  async updateProviderAverageRating(providerId: number): Promise<void> {
    const providerRatings = await this.getRatingsByProviderId(providerId);
    if (providerRatings.length === 0) return;

    const avgRating = Math.round(
      providerRatings.reduce((sum, rating) => sum + rating.rating, 0) / providerRatings.length
    );

    await db
      .update(serviceProviderProfiles)
      .set({ avgRating })
      .where(eq(serviceProviderProfiles.userId, providerId));
  }
}

// Use the database implementation instead of in-memory storage
export const storage = new DatabaseStorage();