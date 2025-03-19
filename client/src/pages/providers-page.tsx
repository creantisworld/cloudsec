import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { ProviderCard } from "@/components/providers/provider-card";
import { Loader2, Filter, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  
  // Fetch service providers
  const { data: providers, isLoading } = useQuery({
    queryKey: ["/api/admin/service-providers"],
  });
  
  // Fetch locations for filter
  const { data: locations } = useQuery({
    queryKey: ["/api/locations"],
  });
  
  // Generate a list of unique skills from all providers
  const allSkills = providers
    ? [...new Set(
        providers
          .filter(p => p.serviceProviderProfile?.skills)
          .flatMap(p => p.serviceProviderProfile.skills || [])
      )]
    : [];
  
  // Filter providers based on search and filters
  const filteredProviders = providers
    ? providers
        .filter(provider => 
          // Only show approved providers
          provider.serviceProviderProfile?.verificationStatus === 'approved'
        )
        .filter(provider => {
          // Search term filter
          const searchLower = searchTerm.toLowerCase();
          return (
            searchTerm === "" ||
            provider.username.toLowerCase().includes(searchLower) ||
            provider.serviceProviderProfile?.fullName?.toLowerCase().includes(searchLower) ||
            provider.serviceProviderProfile?.skills?.some(skill => 
              skill.toLowerCase().includes(searchLower)
            )
          );
        })
        .filter(provider => {
          // Location filter
          return (
            locationFilter === "all" ||
            provider.serviceProviderProfile?.location.toLowerCase() === locationFilter.toLowerCase()
          );
        })
        .filter(provider => {
          // Skill filter
          return (
            skillFilter === "all" ||
            provider.serviceProviderProfile?.skills?.includes(skillFilter)
          );
        })
        .filter(provider => {
          // Rating filter
          const rating = provider.serviceProviderProfile?.avgRating || 0;
          
          switch (ratingFilter) {
            case "4plus":
              return rating >= 4;
            case "3plus":
              return rating >= 3;
            case "all":
            default:
              return true;
          }
        })
    : [];
  
  return (
    <AppShell>
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service Providers</h1>
            <p className="text-muted-foreground">
              Find skilled tech professionals for your needs.
            </p>
          </div>
          
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations?.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={skillFilter}
                    onValueChange={setSkillFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {allSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={ratingFilter}
                    onValueChange={setRatingFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="4plus">4+ Stars</SelectItem>
                      <SelectItem value="3plus">3+ Stars</SelectItem>
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
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No providers found</h2>
              <p className="text-muted-foreground">
                Try adjusting your filters or search for different skills.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
