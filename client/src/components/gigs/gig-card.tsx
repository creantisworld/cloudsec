import { Link } from "wouter";
import { Calendar, MapPin, CheckCircle, Clock, AlertCircle, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface GigCardProps {
  gig: {
    id: number;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    category: { name: string };
    location: { name: string };
    client: { 
      username: string;
      clientProfile?: { contactName: string; companyName?: string; };
    };
    provider?: { 
      username: string;
      serviceProviderProfile?: { fullName: string; };
    };
  };
  showActions?: boolean;
}

export function GigCard({ gig, showActions = true }: GigCardProps) {
  const { user } = useAuth();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const truncateDescription = (description: string, maxLength = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
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
  
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isServiceProvider = user?.role === 'service_provider';
  
  const clientName = gig.client.clientProfile?.companyName || 
                    gig.client.clientProfile?.contactName || 
                    gig.client.username;
                    
  const providerName = gig.provider?.serviceProviderProfile?.fullName || 
                      gig.provider?.username;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{gig.title}</CardTitle>
          <Badge className={getStatusColor(gig.status)}>
            <span className="flex items-center">
              {getStatusIcon(gig.status)}
              <span className="ml-1 capitalize">{gig.status.replace('_', ' ')}</span>
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <p className="text-sm text-gray-600 mb-3">
          {truncateDescription(gig.description)}
        </p>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Tag className="h-4 w-4 mr-2" />
            {gig.category.name}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2" />
            {gig.location.name}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(gig.startDate)} - {formatDate(gig.endDate)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-2" />
            Posted by: {clientName}
          </div>
          {gig.provider && (
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-2" />
              Assigned to: {providerName}
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="pt-2 border-t">
          <Button asChild className="w-full">
            <Link href={`/gigs/${gig.id}`}>
              <a>View Details</a>
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
