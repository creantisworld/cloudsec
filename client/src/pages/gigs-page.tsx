import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { GigCard } from "@/components/gigs/gig-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, PlusCircle, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function GigsPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Get all gigs or user-specific gigs
  const { data: allGigs, isLoading: allGigsLoading } = useQuery({
    queryKey: ["/api/gigs"],
    enabled: user?.role === "admin",
  });

  const { data: clientGigs, isLoading: clientGigsLoading } = useQuery({
    queryKey: ["/api/client/gigs"],
    enabled: user?.role === "client",
  });

  const { data: providerGigs, isLoading: providerGigsLoading } = useQuery({
    queryKey: ["/api/provider/gigs"],
    enabled: user?.role === "service_provider",
  });

  // Get categories and locations for filters
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: locations } = useQuery({
    queryKey: ["/api/locations"],
  });

  let gigs = [];
  let isLoading = false;

  if (user?.role === "admin") {
    gigs = allGigs || [];
    isLoading = allGigsLoading;
  } else if (user?.role === "client") {
    gigs = clientGigs || [];
    isLoading = clientGigsLoading;
  } else if (user?.role === "service_provider") {
    gigs = providerGigs || [];
    isLoading = providerGigsLoading;
  }

  // Filter gigs by search term, category, and location
  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      searchTerm === "" ||
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || gig.category.id.toString() === categoryFilter;
    const matchesLocation =
      locationFilter === "all" || gig.location.id.toString() === locationFilter;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const isAdmin = user?.role === "admin";
  const isClient = user?.role === "client";
  const isServiceProvider = user?.role === "service_provider";

  return (
    <AppShell>
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Gigs</h1>
              <p className="text-muted-foreground">
                {isAdmin && "Manage and view all gigs on the platform."}
                {isClient && "Your posted gigs and their current status."}
                {isServiceProvider && "Gigs assigned to you by the admin."}
              </p>
            </div>

            {isClient && (
              <Button asChild>
                <Link href="client/gigs/new">
                  <a className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Post New Gig
                  </a>
                </Link>
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search gigs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-1 md:flex-none gap-2">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations?.map((location) => (
                        <SelectItem
                          key={location.id}
                          value={location.id.toString()}
                        >
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : filteredGigs.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No gigs found</h2>
              <p className="text-muted-foreground">
                {isClient ? (
                  <>
                    You haven't posted any gigs yet.{" "}
                    <Link href="/gigs/new">
                      <a className="text-primary font-medium hover:underline">
                        Post your first gig
                      </a>
                    </Link>
                  </>
                ) : (
                  "No gigs match your current filters. Try adjusting your search criteria."
                )}
              </p>
            </div>
          ) : (
            <>
              {isAdmin && (
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All Gigs</TabsTrigger>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="allocated">Allocated</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGigs.map((gig) => (
                        <GigCard key={gig.id} gig={gig} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="open">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGigs
                        .filter((gig) => gig.status === "open")
                        .map((gig) => (
                          <GigCard key={gig.id} gig={gig} />
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="allocated">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGigs
                        .filter((gig) => gig.status === "allocated")
                        .map((gig) => (
                          <GigCard key={gig.id} gig={gig} />
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="in_progress">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGigs
                        .filter((gig) => gig.status === "in_progress")
                        .map((gig) => (
                          <GigCard key={gig.id} gig={gig} />
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="completed">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredGigs
                        .filter((gig) => gig.status === "completed")
                        .map((gig) => (
                          <GigCard key={gig.id} gig={gig} />
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {!isAdmin && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGigs.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
