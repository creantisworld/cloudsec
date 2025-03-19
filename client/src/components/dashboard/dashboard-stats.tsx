import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Briefcase, CheckCircle, Clock, AlertTriangle, Clock8 } from "lucide-react";

export function DashboardStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Stats</CardTitle>
          <CardDescription>Unable to load dashboard statistics.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Service Providers</CardDescription>
          <CardTitle className="text-2xl">
            {stats.serviceProviders.total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                Pending
              </span>
              <span>{stats.serviceProviders.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Approved
              </span>
              <span>{stats.serviceProviders.approved}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                Rejected
              </span>
              <span>{stats.serviceProviders.rejected}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Clients</CardDescription>
          <CardTitle className="text-2xl">
            {stats.clients.total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                Pending
              </span>
              <span>{stats.clients.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Approved
              </span>
              <span>{stats.clients.approved}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                Rejected
              </span>
              <span>{stats.clients.rejected}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Gigs</CardDescription>
          <CardTitle className="text-2xl">
            {stats.gigs.total}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                Open
              </span>
              <span>{stats.gigs.open}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-yellow-500" />
                Allocated
              </span>
              <span>{stats.gigs.allocated}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Gig Status</CardDescription>
          <CardTitle className="text-2xl">
            Active {stats.gigs.inProgress + stats.gigs.allocated}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <div className="flex justify-between">
              <span className="flex items-center">
                <Clock8 className="h-4 w-4 mr-1 text-indigo-500" />
                In Progress
              </span>
              <span>{stats.gigs.inProgress}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                Completed
              </span>
              <span>{stats.gigs.completed}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
