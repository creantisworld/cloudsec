import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ratings/rating-stars";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Star,
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GigCard } from "@/components/gigs/gig-card";

interface ServiceProviderResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  serviceProviderProfile?: {
    fullName: string;
    bio: string | null;
    location: string | null;
    skills: string[] | null;
    experience: string | null;
    availability: string | null;
    phone: string | null;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    userId: number;
    avgRating: number | null;
  };
}

interface RatingResponse {
  id: number;
  gigId: number;
  clientId: number;
  providerId: number;
  rating: number;
  review: string | null;
  createdAt: string;
}

interface GigResponse {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  categoryId: number;
  locationId: number;
  clientId: number;
  providerId: number | null;
  category: {
    id: number;
    name: string;
    description: string;
  };
  location: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    username: string;
  };
  createdAt: string;
  updatedAt: string | null;
}

export default function ProviderDetailsPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();

  // Fetch provider details
  const { data: provider, isLoading: providerLoading } = useQuery<ServiceProviderResponse>({
    queryKey: [`/api/admin/service-providers/${id}`],
    enabled: !!id,
  });

  // Fetch provider ratings
  const { data: ratings, isLoading: ratingsLoading } = useQuery<RatingResponse[]>({
    queryKey: [`/api/providers/${id}/ratings`],
    enabled: !!id,
  });

  // Fetch provider's completed gigs
  const { data: completedGigs, isLoading: gigsLoading } = useQuery<GigResponse[]>({
    queryKey: [`/api/providers/${id}/gigs/completed`],
    enabled: !!id,
  });

  const isLoading = providerLoading || ratingsLoading || gigsLoading;

  if (isLoading) {
    return (
      <AppShell>
        <div className="container max-w-5xl mx-auto py-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!provider || !provider.serviceProviderProfile) {
    return (
      <AppShell>
        <div className="container max-w-5xl mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Not Found</CardTitle>
              <CardDescription>
                The service provider you're looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate("/providers")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Providers
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const { serviceProviderProfile } = provider;
  const fullName = serviceProviderProfile.fullName || provider.username;

  // Use real data from API
  const recentGigs = completedGigs || [];
  const providerRatings = ratings || [];
  const avgRating = serviceProviderProfile.avgRating || 0;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <AppShell>
      <div className="container max-w-5xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => navigate("/providers")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Providers
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-2">
                    <AvatarFallback className="text-xl">
                      {getInitials(fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{fullName}</CardTitle>
                  <div className="flex justify-center">
                    <RatingStars value={avgRating} readOnly />
                    <span className="ml-1 text-sm text-gray-600">{avgRating}/5</span>
                  </div>
                  <CardDescription>
                    {serviceProviderProfile.verificationStatus === 'approved' && (
                      <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Provider
                      </Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceProviderProfile.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{serviceProviderProfile.location}</span>
                      </div>
                    )}

                    {serviceProviderProfile.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{serviceProviderProfile.phone}</span>
                      </div>
                    )}

                    {serviceProviderProfile.availability && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{serviceProviderProfile.availability}</span>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-500" />
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {serviceProviderProfile.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="mr-1 mb-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Section */}
            <div className="md:col-span-2 space-y-6">
              {/* Bio Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceProviderProfile.bio ? (
                    <p>{serviceProviderProfile.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio provided.</p>
                  )}

                  {serviceProviderProfile.experience && (
                    <>
                      <h3 className="font-medium mt-4 mb-2">Experience</h3>
                      <p>{serviceProviderProfile.experience}</p>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Ratings & Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Ratings & Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {providerRatings.length === 0 ? (
                    <p className="text-gray-500 italic">
                      This provider hasn't received any ratings yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {providerRatings.map((rating, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <RatingStars value={rating.rating} readOnly />
                            <span className="text-sm text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {rating.review && (
                            <p className="text-gray-700">{rating.review}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Completed Gigs */}
              {recentGigs && recentGigs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Gigs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recentGigs.slice(0, 4).map((gig) => (
                        <div key={gig.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{gig.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{gig.category.name}</p>
                          <div className="flex justify-between items-center mt-2">
                            <Badge variant="outline">{gig.status}</Badge>
                            <span className="text-sm">${gig.budget}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}