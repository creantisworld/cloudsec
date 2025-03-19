import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, CheckCircle } from "lucide-react";
import { RatingStars } from "@/components/ratings/rating-stars";

interface ProviderCardProps {
  provider: {
    id: number;
    username: string;
    serviceProviderProfile: {
      fullName: string;
      location: string;
      skills: string[];
      avgRating?: number;
      verificationStatus: string;
    };
  };
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const { serviceProviderProfile } = provider;
  const name = serviceProviderProfile.fullName || provider.username;
  const rating = serviceProviderProfile.avgRating || 0;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 text-center">
        <Avatar className="w-20 h-20 mx-auto mb-2">
          <AvatarFallback className="text-lg">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="flex justify-center items-center">
          <RatingStars value={rating} readOnly size="sm" />
          <span className="ml-1 text-sm text-gray-600">{rating}/5</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <div className="mb-3 flex justify-center">
          {serviceProviderProfile.verificationStatus === 'approved' && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3 justify-center">
          <MapPin className="h-4 w-4 mr-1" />
          {serviceProviderProfile.location}
        </div>
        
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {serviceProviderProfile.skills?.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {serviceProviderProfile.skills?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{serviceProviderProfile.skills.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Button asChild className="w-full">
          <Link href={`/providers/${provider.id}`}>
            <a>View Profile</a>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
