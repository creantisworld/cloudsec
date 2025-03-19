import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Filter, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem = ({ children, isActive, onClick }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm font-medium transition-colors",
      isActive 
        ? "text-primary border-b-2 border-primary" 
        : "text-gray-600 hover:text-gray-900"
    )}
  >
    {children}
  </button>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("jobs");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch completed gigs
  const { data: completedGigs = [], isLoading } = useQuery({
    queryKey: [`/api/providers/${user?.id}/gigs/completed`],
    enabled: !!user && user.role === 'service_provider',
  });

  // Calculate statistics
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyGigs = completedGigs.filter(gig => {
    const gigDate = new Date(gig.createdAt);
    return gigDate.getMonth() === thisMonth && gigDate.getFullYear() === thisYear;
  });

  const monthlyStats = {
    earnings: monthlyGigs.reduce((sum, gig) => sum + (gig.budget || 0), 0),
    hoursCommit: monthlyGigs.length * 20, // Assuming 20 hours per gig
    clients: new Set(monthlyGigs.map(gig => gig.client?.username)).size,
    earningsGoalAchieved: "108%"
  };

  // Chart data
  const chartData = [
    { month: "Jul", earnings: 3500, hours: 95 },
    { month: "Aug", earnings: 4200, hours: 105 },
    { month: "Sep", earnings: 3800, hours: 90 },
    { month: "Oct", earnings: 4100, hours: 100 },
    { month: "Nov", earnings: 4800, hours: 120 },
    { month: "Dec", earnings: 3600, hours: 85 },
    { month: "Jan", earnings: 3200, hours: 80 },
    { month: "Feb", earnings: 4500, hours: 110 },
    { month: "Mar", earnings: 4300, hours: 105 },
    { month: "Apr", earnings: 3900, hours: 95 }
  ];

  if (!user) {
    return (
      <AppShell>
        <div className="container mx-auto p-6">
          <Card className="p-6">
            <p>Please log in to access your dashboard.</p>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex gap-2">
              <NavItem 
                isActive={activeTab === "jobs"} 
                onClick={() => setActiveTab("jobs")}
              >
                Jobs
              </NavItem>
              <NavItem 
                isActive={activeTab === "income"} 
                onClick={() => setActiveTab("income")}
              >
                Income
              </NavItem>
              <NavItem 
                isActive={activeTab === "calendar"} 
                onClick={() => setActiveTab("calendar")}
              >
                Calendar
              </NavItem>
            </div>
            <Button variant="outline">
              Upgrade Now
            </Button>
          </div>
        </div>

        <div className="container mx-auto p-8">
          {/* Stats Card */}
          <Card className="bg-white mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-6">This Month</h2>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Earnings</p>
                  <p className="text-2xl font-bold">$ {monthlyStats.earnings.toFixed(2)}</p>
                  <p className="text-gray-600 text-sm mt-1">Earnings goal achieved</p>
                  <p className="text-sm font-medium">{monthlyStats.earningsGoalAchieved}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Hours commit</p>
                  <p className="text-2xl font-bold">{monthlyStats.hoursCommit}</p>
                  <p className="text-gray-600 text-sm mt-1">112 hrs goal</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Clients</p>
                  <p className="text-2xl font-bold">{monthlyStats.clients}</p>
                  <p className="text-gray-600 text-sm mt-1">Active this month</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Chart */}
          <Card className="bg-white mb-8">
            <div className="p-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#0ea5e9" />
                    <YAxis yAxisId="right" orientation="right" stroke="#22c55e" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="earnings" 
                      fill="#0ea5e9" 
                      name="Earnings" 
                      radius={[4, 4, 0, 0]} 
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="hours" 
                      fill="#22c55e" 
                      name="Hours commit" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Tasks History */}
          <Card className="bg-white">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Tasks History</h2>
                <div className="flex gap-2">
                  <Input
                    type="search"
                    placeholder="Type to search..."
                    className="w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Finished</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!isLoading && completedGigs
                    .filter(gig => 
                      searchTerm === "" || 
                      gig.client?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      gig.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((gig) => (
                      <TableRow key={gig.id}>
                        <TableCell>{gig.client?.username}</TableCell>
                        <TableCell>{gig.category?.name}</TableCell>
                        <TableCell>20</TableCell>
                        <TableCell>${gig.budget}</TableCell>
                        <TableCell>{format(new Date(gig.createdAt), 'MMM d yyyy')}</TableCell>
                        <TableCell>
                          {format(new Date(gig.updatedAt || gig.createdAt), 'MMM d yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}