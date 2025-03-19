import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RatingStars } from "@/components/ratings/rating-stars";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GigDetailsPage() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  
  // Fetch gig details
  const { data: gig, isLoading } = useQuery({
    queryKey: [`/api/gigs/${id}`],
    enabled: !!id,
  });
  
  // Fetch service providers for admin allocation
  const { data: providers } = useQuery({
    queryKey: ["/api/admin/service-providers"],
    enabled: user?.role === 'admin' && gig?.status === 'open',
  });
  
  // Get approved providers
  const approvedProviders = providers?.filter(
    provider => provider.serviceProviderProfile?.verificationStatus === 'approved'
  ) || [];
  
  // Fetch ratings for this gig
  const { data: ratings } = useQuery({
    queryKey: [`/api/gigs/${id}/ratings`],
    enabled: !!id && gig?.status === 'completed',
  });
  
  // Allocate provider mutation
  const allocateProviderMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/gigs/${id}/allocate`, {
        providerId: parseInt(selectedProviderId),
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Provider allocated",
        description: "The service provider has been allocated to this gig.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/gigs/${id}`] });
      setSelectedProviderId("");
    },
    onError: (error: Error) => {
      toast({
        title: "Allocation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update gig status mutation
  const updateGigStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const res = await apiRequest("PUT", `/api/gigs/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The gig status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/gigs/${id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/gigs/${id}/rate`, {
        rating: ratingValue,
        review: reviewText,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Rating submitted",
        description: "Thank you for rating this service provider.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/gigs/${id}/ratings`] });
      setReviewText("");
    },
    onError: (error: Error) => {
      toast({
        title: "Rating failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'allocated':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'allocated':
        return <User className="h-4 w-4" />;
      case 'in_progress':
        return <User className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const handleStartGig = () => {
    updateGigStatusMutation.mutate('in_progress');
  };
  
  const handleCompleteGig = () => {
    updateGigStatusMutation.mutate('completed');
  };
  
  const handleCancelGig = () => {
    updateGigStatusMutation.mutate('cancelled');
  };
  
  const handleSubmitRating = () => {
    submitRatingMutation.mutate();
  };
  
  const handleAllocateProvider = () => {
    if (!selectedProviderId) {
      toast({
        title: "Provider required",
        description: "Please select a service provider to allocate.",
        variant: "destructive",
      });
      return;
    }
    allocateProviderMutation.mutate();
  };
  
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
  
  if (!gig) {
    return (
      <AppShell>
        <div className="container max-w-5xl mx-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle>Gig Not Found</CardTitle>
              <CardDescription>
                The gig you're looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate("/gigs")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Gigs
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }
  
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client' && gig.clientId === user.id;
  const isProvider = user?.role === 'service_provider' && gig.providerId === user.id;
  const hasRated = ratings?.some(r => r.clientId === user?.id && r.gigId === gig.id);
  
  const clientName = gig.client.clientProfile?.companyName || 
                    gig.client.clientProfile?.contactName || 
                    gig.client.username;
                    
  const providerName = gig.provider?.serviceProviderProfile?.fullName || 
                     gig.provider?.username || "Not assigned";
  
  return (
    <AppShell>
      <div className="container max-w-5xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => navigate("/gigs")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gigs
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl">{gig.title}</CardTitle>
                  <CardDescription>
                    Posted by {clientName} on {formatDate(gig.createdAt)}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(gig.status)}>
                  <span className="flex items-center">
                    {getStatusIcon(gig.status)}
                    <span className="ml-1 capitalize">{gig.status.replace('_', ' ')}</span>
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="whitespace-pre-line">{gig.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <span className="block font-medium">Category</span>
                        <span>{gig.category.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <span className="block font-medium">Location</span>
                        <span>{gig.location.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <span className="block font-medium">Time Frame</span>
                        <span>{formatDate(gig.startDate)} to {formatDate(gig.endDate)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-5 w-5 mr-3 text-primary" />
                      <div>
                        <span className="block font-medium">Service Provider</span>
                        <span>{providerName}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Actions</h3>
                  <div className="space-y-3">
                    {isAdmin && gig.status === 'open' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full">Allocate Provider</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Allocate Service Provider</DialogTitle>
                            <DialogDescription>
                              Select a verified service provider to allocate to this gig.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Select
                              value={selectedProviderId}
                              onValueChange={setSelectedProviderId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a provider" />
                              </SelectTrigger>
                              <SelectContent>
                                {approvedProviders.map((provider) => (
                                  <SelectItem 
                                    key={provider.id} 
                                    value={provider.id.toString()}
                                  >
                                    {provider.serviceProviderProfile?.fullName || provider.username}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button 
                              onClick={handleAllocateProvider}
                              disabled={allocateProviderMutation.isPending}
                            >
                              {allocateProviderMutation.isPending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Allocating...
                                </>
                              ) : "Allocate Provider"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    {isProvider && gig.status === 'allocated' && (
                      <Button 
                        className="w-full"
                        onClick={handleStartGig}
                        disabled={updateGigStatusMutation.isPending}
                      >
                        {updateGigStatusMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Starting...
                          </>
                        ) : "Start Gig"}
                      </Button>
                    )}
                    
                    {isProvider && gig.status === 'in_progress' && (
                      <Button 
                        className="w-full"
                        onClick={handleCompleteGig}
                        disabled={updateGigStatusMutation.isPending}
                      >
                        {updateGigStatusMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Completing...
                          </>
                        ) : "Mark as Completed"}
                      </Button>
                    )}
                    
                    {isClient && ['open', 'allocated'].includes(gig.status) && (
                      <Button 
                        variant="destructive"
                        className="w-full"
                        onClick={handleCancelGig}
                        disabled={updateGigStatusMutation.isPending}
                      >
                        {updateGigStatusMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Cancelling...
                          </>
                        ) : "Cancel Gig"}
                      </Button>
                    )}
                    
                    {isClient && gig.status === 'completed' && !hasRated && (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <h4 className="font-medium flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          Rate Service Provider
                        </h4>
                        <div className="space-y-2">
                          <RatingStars
                            value={ratingValue}
                            onChange={setRatingValue}
                          />
                          <Textarea
                            placeholder="Share your experience with this service provider..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="h-24"
                          />
                          <Button 
                            onClick={handleSubmitRating}
                            disabled={submitRatingMutation.isPending}
                            className="w-full"
                          >
                            {submitRatingMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : "Submit Rating"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {gig.status === 'completed' && ratings && ratings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ratings & Reviews</h3>
                  <Separator className="mb-4" />
                  
                  {ratings.map((rating) => (
                    <div key={rating.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <RatingStars value={rating.rating} readOnly />
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(rating.createdAt)}
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
        </div>
      </div>
    </AppShell>
  );
}
