import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
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
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GigCard } from "@/components/gigs/gig-card";

interface ClientProfileResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  clientProfile?: {
    fullName: string;
    bio: string | null;
    location: string | null;
    phone: string | null;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    userId: number;
  };
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
}

export default function ClientDetailsPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();

  // Fetch client details
  const { data: client, isLoading: clientLoading } = useQuery<ClientProfileResponse>({
    queryKey: [`/api/admin/clients/${id}`],
    enabled: !!id,
  });

  // Fetch client's posted gigs
  const { data: postedGigs, isLoading: gigsLoading } = useQuery<GigResponse[]>({
    queryKey: [`/api/clients/${id}/gigs`],
    enabled: !!id,
  });

  const isLoading = clientLoading || gigsLoading;

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

  if (!client || !client.clientProfile) {
    return (
      <AppShell>
        <div className="container max-w-5xl mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Not Found</CardTitle>
              <CardDescription>
                The client you're looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  const { clientProfile } = client;
  const fullName = clientProfile.fullName || client.username;

  // Use the posted gigs data from the API
  const clientGigs = postedGigs || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified Client
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="mt-2 bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Verification Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <div className="container max-w-5xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
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
                  <CardDescription>
                    {getVerificationBadge(clientProfile.verificationStatus || 'pending')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{client.email}</span>
                    </div>

                    {clientProfile.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{clientProfile.location}</span>
                      </div>
                    )}

                    {clientProfile.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{clientProfile.phone}</span>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Member Since</h3>
                      <p className="text-sm">
                        {new Date(client.createdAt).toLocaleDateString()}
                      </p>
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
                  {clientProfile.bio ? (
                    <p>{clientProfile.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio provided.</p>
                  )}
                </CardContent>
              </Card>

              {/* Posted Gigs */}
              {clientGigs.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Posted Gigs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientGigs.map((gig) => (
                        <GigCard key={gig.id} gig={gig} showActions={false} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Posted Gigs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 italic">This client hasn't posted any gigs yet.</p>
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