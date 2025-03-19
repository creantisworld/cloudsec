import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { seedInitialData } from "./seed";
import {
  insertServiceProviderProfileSchema,
  insertClientProfileSchema,
  insertGigCategorySchema,
  insertLocationSchema,
  insertGigSchema,
  insertRatingSchema
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

// Helper middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  next();
};

// Helper middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized: Login required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Seed initial data
  try {
    await seedInitialData();
    console.log("Initial data seeded successfully!");
  } catch (error) {
    console.error("Error seeding initial data:", error);
  }

  // ======== Profile routes ========

  // Get current user profile
  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      if (req.user.role === 'service_provider') {
        const profile = await storage.getServiceProviderProfile(req.user.id);
        return res.json({ user: req.user, profile });
      }
      else if (req.user.role === 'client') {
        const profile = await storage.getClientProfile(req.user.id);
        return res.json({ user: req.user, profile });
      }
      else if (req.user.role === 'admin' || req.user.role === 'super_admin') {
        return res.json({ user: req.user });
      }

      res.status(400).json({ message: "Invalid user role" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Create service provider profile
  app.post("/api/profile/service-provider", isAuthenticated, async (req, res) => {
    try {
      // Validate user role
      if (req.user.role !== 'service_provider') {
        return res.status(403).json({ message: "Only service providers can create this profile type" });
      }

      // Check if profile already exists
      const existingProfile = await storage.getServiceProviderProfile(req.user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      // Validate input
      const validData = insertServiceProviderProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      // Create profile
      const profile = await storage.createServiceProviderProfile(validData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Update service provider profile
  app.put("/api/profile/service-provider", isAuthenticated, async (req, res) => {
    try {
      // Validate user role
      if (req.user.role !== 'service_provider') {
        return res.status(403).json({ message: "Only service providers can update this profile type" });
      }

      // Update profile
      const profile = await storage.updateServiceProviderProfile(req.user.id, req.body);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Create client profile
  app.post("/api/profile/client", isAuthenticated, async (req, res) => {
    try {
      // Validate user role
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can create this profile type" });
      }

      // Check if profile already exists
      const existingProfile = await storage.getClientProfile(req.user.id);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      // Validate input
      const validData = insertClientProfileSchema.parse({
        ...req.body,
        userId: req.user.id
      });

      // Create profile
      const profile = await storage.createClientProfile(validData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Update client profile
  app.put("/api/profile/client", isAuthenticated, async (req, res) => {
    try {
      // Validate user role
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can update this profile type" });
      }

      // Update profile
      const profile = await storage.updateClientProfile(req.user.id, req.body);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // ======== Admin routes ========

  // Get all service providers
  app.get("/api/admin/service-providers", isAdmin, async (req, res) => {
    try {
      const providers = await storage.getAllServiceProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service providers" });
    }
  });

  // Get service provider by ID
  app.get("/api/admin/service-providers/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const provider = await storage.getServiceProviderWithProfile(userId);

      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }

      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service provider" });
    }
  });

  // Get all clients
  app.get("/api/admin/clients", isAdmin, async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  // Get client by ID
  app.get("/api/admin/clients/:id", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const client = await storage.getClientWithProfile(userId);

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  // Get client's gigs
  app.get("/api/clients/:id/gigs", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const gigs = await storage.getGigsByClientId(userId);
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client gigs" });
    }
  });

  // Update service provider verification status
  app.put("/api/admin/service-providers/:id/verify", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'service_provider') {
        return res.status(404).json({ message: "Service provider not found" });
      }

      const profile = await storage.updateServiceProviderVerification(userId, status);
      if (!profile) {
        return res.status(404).json({ message: "Service provider profile not found" });
      }

      res.json({ user, profile, message: "Verification status updated" });
    } catch (error) {
      console.error("Error updating service provider verification:", error);
      res.status(500).json({ message: "Failed to update verification status" });
    }
  });

  // Update client verification status
  app.put("/api/admin/clients/:id/verify", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== 'client') {
        return res.status(404).json({ message: "Client not found" });
      }

      const profile = await storage.updateClientVerification(userId, status);
      if (!profile) {
        return res.status(404).json({ message: "Client profile not found" });
      }

      res.json({ user, profile, message: "Verification status updated" });
    } catch (error) {
      console.error("Error updating client verification:", error);
      res.status(500).json({ message: "Failed to update verification status" });
    }
  });

  // ======== Gig Category routes ========

  // Create gig category (admin only)
  app.post("/api/categories", isAdmin, async (req, res) => {
    try {
      const validData = insertGigCategorySchema.parse(req.body);
      const category = await storage.createGigCategory(validData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Get all gig categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getGigCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Update gig category (admin only)
  app.put("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateGigCategory(id, req.body);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete gig category (admin only)
  app.delete("/api/categories/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteGigCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // ======== Location routes ========

  // Create location (admin only)
  app.post("/api/locations", isAdmin, async (req, res) => {
    try {
      const validData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(validData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid location data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create location" });
    }
  });

  // Get all locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locations" });
    }
  });

  // Update location (admin only)
  app.put("/api/locations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const location = await storage.updateLocation(id, req.body);
      if (!location) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  // Delete location (admin only)
  app.delete("/api/locations/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLocation(id);
      if (!success) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete location" });
    }
  });

  // ======== Gig routes ========

  // Create gig (client only)
  app.post("/api/client/gigs", isAuthenticated, async (req, res) => {
    try {
      // Validate user role
      if (req.user?.role !== 'client') {
        return res.status(403).json({ message: "Only clients can create gigs" });
      }

      // Validate profile exists and is verified
      const clientProfile = await storage.getClientProfile(req.user.id);
      if (!clientProfile) {
        return res.status(400).json({ message: "Client profile must be created first" });
      }

      if (clientProfile.verificationStatus !== 'approved') {
        return res.status(403).json({ message: "Your profile must be verified before posting gigs" });
      }

      // Validate input using insertGigSchema
      const validData = insertGigSchema.parse({
        ...req.body,
        clientId: req.user.id,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      });

      // Create gig
      const gig = await storage.createGig(validData);
      res.status(201).json(gig);
    } catch (error) {
      console.error('Error creating gig:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Invalid gig data",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create gig" });
    }
  });

  // Get all gigs
  app.get("/api/gigs", async (req, res) => {
    try {
      const gigs = await storage.getAllGigs();
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gigs" });
    }
  });

  // Get all gigs (admin)
  app.get("/api/admin/gigs", isAdmin, async (req, res) => {
    try {
      const gigs = await storage.getAllGigsWithDetails();
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gigs" });
    }
  });

  // Get all posted gigs (admin)
  app.get("/api/admin/gigs/posted", isAdmin, async (req, res) => {
    try {
      const gigs = await storage.getGigsByStatusWithDetails('open');
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posted gigs" });
    }
  });

  // Get all allocated gigs (admin)
  app.get("/api/admin/gigs/allocated", isAdmin, async (req, res) => {
    try {
      const gigs = await storage.getGigsByStatusWithDetails('allocated');
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch allocated gigs" });
    }
  });

  // Get all ongoing gigs (admin)
  app.get("/api/admin/gigs/ongoing", isAdmin, async (req, res) => {
    try {
      const gigs = await storage.getGigsByStatusWithDetails('in_progress');
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ongoing gigs" });
    }
  });

  // Get all completed gigs (admin)
  app.get("/api/admin/gigs/completed", isAdmin, async (req, res) => {
    try {
      const gigs = await storage.getGigsByStatusWithDetails('completed');
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completed gigs" });
    }
  });

  // Get gig by ID
  app.get("/api/gigs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const gig = await storage.getGigById(id);
      if (!gig) {
        return res.status(404).json({ message: "Gig not found" });
      }
      res.json(gig);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gig" });
    }
  });

  // Get gigs by client ID
  app.get("/api/client/gigs", isAuthenticated, async (req, res) => {
    try {
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can access their gigs" });
      }

      const gigs = await storage.getGigsByClientId(req.user.id);
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client gigs" });
    }
  });

  // Get gigs by provider ID
  app.get("/api/provider/gigs", isAuthenticated, async (req, res) => {
    try {
      if (req.user.role !== 'service_provider') {
        return res.status(403).json({ message: "Only service providers can access their gigs" });
      }

      const gigs = await storage.getGigsByProviderId(req.user.id);
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch provider gigs" });
    }
  });

  // Get gigs by status
  app.get("/api/gigs/status/:status", isAuthenticated, async (req, res) => {
    try {
      const status = req.params.status;
      if (!['open', 'allocated', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Only admin can see all gigs by status
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Only admins can view all gigs by status" });
      }

      const gigs = await storage.getGigsByStatus(status);
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gigs by status" });
    }
  });

  // Allocate gig to provider (admin only)
  app.post("/api/admin/gigs/:id/allocate", isAdmin, async (req, res) => {
    try {
      const gigId = parseInt(req.params.id);
      const { providerId, sendEmail } = req.body;

      if (!providerId) {
        return res.status(400).json({ message: "Provider ID is required" });
      }

      // Check if the provider exists and is verified
      const provider = await storage.getUser(providerId);
      if (!provider || provider.role !== 'service_provider') {
        return res.status(400).json({ message: "Invalid service provider" });
      }

      const providerProfile = await storage.getServiceProviderProfile(providerId);
      if (!providerProfile || providerProfile.verificationStatus !== 'approved') {
        return res.status(400).json({ message: "Service provider not verified" });
      }

      // Allocate gig
      const gig = await storage.allocateGigToProvider(gigId, providerId);
      if (!gig) {
        return res.status(404).json({ message: "Gig not found or cannot be allocated" });
      }

      // Get the gig details for notifications (future email implementation)
      const gigDetails = await storage.getGigById(gigId);

      res.json(gig);
    } catch (error) {
      res.status(500).json({ message: "Failed to allocate gig" });
    }
  });

  // Update gig status (service provider for in_progress/completed, client for cancelled)
  app.put("/api/gigs/:id/status", isAuthenticated, async (req, res) => {
    try {
      const gigId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !['in_progress', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Get the gig
      const gig = await storage.getGigById(gigId);
      if (!gig) {
        return res.status(404).json({ message: "Gig not found" });
      }

      // Check permissions based on role and status
      if (req.user.role === 'service_provider') {
        if (gig.providerId !== req.user.id) {
          return res.status(403).json({ message: "You are not assigned to this gig" });
        }

        if ((gig.status === 'allocated' && status === 'in_progress') ||
          (gig.status === 'in_progress' && status === 'completed')) {
          // Allow status change
        } else {
          return res.status(400).json({ message: "Invalid status transition" });
        }
      }
      else if (req.user.role === 'client') {
        if (gig.clientId !== req.user.id) {
          return res.status(403).json({ message: "You don't own this gig" });
        }

        if (status === 'cancelled' && ['open', 'allocated'].includes(gig.status)) {
          // Allow cancellation
        } else {
          return res.status(400).json({ message: "Invalid status transition" });
        }
      }
      else if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Unauthorized to change gig status" });
      }

      // Update status
      const updatedGig = await storage.updateGig(gigId, { status });
      res.json(updatedGig);
    } catch (error) {
      res.status(500).json({ message: "Failed to update gig status" });
    }
  });

  // ======== Rating routes ========

  // Create rating (client only, for completed gigs)
  app.post("/api/gigs/:id/rate", isAuthenticated, async (req, res) => {
    try {
      // Validate user role
      if (req.user.role !== 'client') {
        return res.status(403).json({ message: "Only clients can rate service providers" });
      }

      const gigId = parseInt(req.params.id);

      // Get the gig
      const gig = await storage.getGigById(gigId);
      if (!gig) {
        return res.status(404).json({ message: "Gig not found" });
      }

      // Check if the gig belongs to the client
      if (gig.clientId !== req.user.id) {
        return res.status(403).json({ message: "You don't own this gig" });
      }

      // Check if the gig is completed
      if (gig.status !== 'completed') {
        return res.status(400).json({ message: "Only completed gigs can be rated" });
      }

      // Check if the gig has a provider assigned
      if (!gig.providerId) {
        return res.status(400).json({ message: "No service provider assigned to this gig" });
      }

      // Check if the gig has already been rated
      const existingRatings = await storage.getRatingsByGigId(gigId);
      if (existingRatings.length > 0) {
        return res.status(400).json({ message: "This gig has already been rated" });
      }

      // Validate input
      const validData = insertRatingSchema.parse({
        ...req.body,
        gigId,
        clientId: req.user.id,
        providerId: gig.providerId
      });

      // Create rating
      const rating = await storage.createRating(validData);
      res.status(201).json(rating);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rating data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create rating" });
    }
  });

  // Get ratings for a provider
  app.get("/api/providers/:id/ratings", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const ratings = await storage.getRatingsByProviderId(providerId);
      res.json(ratings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ratings" });
    }
  });

  // Get completed gigs for a provider
  app.get("/api/providers/:id/gigs/completed", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      const gigs = await storage.getCompletedGigsByProviderId(providerId);
      res.json(gigs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch completed gigs" });
    }
  });

  // ======== Dashboard Stats for Admin ========

  app.get("/api/admin/stats", isAdmin, async (req, res) => {
    try {
      const [
        serviceProviders,
        clients,
        openGigs,
        allocatedGigs,
        inProgressGigs,
        completedGigs
      ] = await Promise.all([
        storage.getAllServiceProviders(),
        storage.getAllClients(),
        storage.getGigsByStatus('open'),
        storage.getGigsByStatus('allocated'),
        storage.getGigsByStatus('in_progress'),
        storage.getGigsByStatus('completed')
      ]);

      res.json({
        serviceProviders: {
          total: serviceProviders.length,
          pending: serviceProviders.filter(p => p.serviceProviderProfile?.verificationStatus === 'pending').length,
          approved: serviceProviders.filter(p => p.serviceProviderProfile?.verificationStatus === 'approved').length,
          rejected: serviceProviders.filter(p => p.serviceProviderProfile?.verificationStatus === 'rejected').length,
        },
        clients: {
          total: clients.length,
          pending: clients.filter(c => c.clientProfile?.verificationStatus === 'pending').length,
          approved: clients.filter(c => c.clientProfile?.verificationStatus === 'approved').length,
          rejected: clients.filter(c => c.clientProfile?.verificationStatus === 'rejected').length,
        },
        gigs: {
          open: openGigs.length,
          allocated: allocatedGigs.length,
          inProgress: inProgressGigs.length,
          completed: completedGigs.length,
          total: openGigs.length + allocatedGigs.length + inProgressGigs.length + completedGigs.length
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}