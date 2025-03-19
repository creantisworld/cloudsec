import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AppShell from "@/components/layout/app-shell";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Gig {
  id: number;
  title: string;
  budget: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  category?: {
    name: string;
  };
  provider?: {
    username: string;
  };
}

export default function ClientDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: myGigs = [], isLoading } = useQuery<Gig[]>({
    queryKey: ["/api/client/gigs"],
    enabled: !!user && user.role === 'client',
  });

  if (!user) {
    return (
      <AppShell>
        <div className="container mx-auto p-6">
          <Card>
            <CardContent>
              <p>Please log in to access your dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">Manage your gigs and requests</p>
          </div>
          <Button
            variant="default"
            onClick={() => navigate("/client/gigs/new")}
          >
            Post New Gig
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Gigs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading your gigs...</div>
            ) : myGigs.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">You haven't posted any gigs yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Provider</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myGigs.map((gig) => (
                    <TableRow key={gig.id}>
                      <TableCell className="font-medium">{gig.title}</TableCell>
                      <TableCell>{gig.category?.name}</TableCell>
                      <TableCell>${gig.budget}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          gig.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                          gig.status === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }>
                          {gig.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(gig.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        {gig.provider ? gig.provider.username : 'Not assigned'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}