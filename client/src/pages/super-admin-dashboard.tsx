import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AppShell from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Settings,
  Tag,
  MapPin,
  BarChart4,
  Filter,
  Search,
  Plus,
  Edit,
  Trash,
  MoreVertical,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  Clock,
  AlertCircle,
  CheckSquare,
  User,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ServiceProviderProfile,
  ClientProfile,
  User as UserType,
  Gig,
  GigCategory,
  Location,
} from "@shared/schema";

// Define types for API responses
interface ServiceProviderResponse extends Omit<UserType, "createdAt"> {
  serviceProviderProfile?: ServiceProviderProfile;
  verification_status: string;
  createdAt: Date;
}

interface ClientResponse extends Omit<UserType, "createdAt"> {
  clientProfile?: ClientProfile;
  verification_status: string;
  createdAt: Date;
}

interface GigResponse extends Gig {
  category: GigCategory;
  client: {
    username: string;
    email: string;
    clientProfile?: ClientProfile;
  };
  provider?: {
    username: string;
    email: string;
    serviceProviderProfile?: ServiceProviderProfile;
  };
  location: Location;
  budget: number;
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("service-providers");

  // State for forms
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newLocation, setNewLocation] = useState({ name: "" });
  const [newSkill, setNewSkill] = useState({ name: "", category: "" });
  const [editItem, setEditItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedGig, setSelectedGig] = useState<GigResponse | null>(null);
  const [selectedProvider, setSelectedProvider] =
    useState<ServiceProviderResponse | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    providerAllocation: true,
    gigCompletion: true,
    newRegistration: true,
  });
  const [editingLocationId, setEditingLocationId] = useState<number | null>(
    null,
  );

  // Check if user is super_admin, redirect if not
  useEffect(() => {
    if (user && user.role !== "super_admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);

  // Queries
  const { data: serviceProviders = [], isLoading: providersLoading } = useQuery<
    ServiceProviderResponse[]
  >({
    queryKey: ["/api/admin/service-providers"],
    enabled: !!user && user.role === "super_admin",
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<
    ClientResponse[]
  >({
    queryKey: ["/api/admin/clients"],
    enabled: !!user && user.role === "super_admin",
  });

  const { data: allGigs = [], isLoading: gigsLoading } = useQuery<
    GigResponse[]
  >({
    queryKey: ["/api/admin/gigs"],
    enabled: !!user && user.role === "super_admin",
  });

  const { data: postedGigs = [], isLoading: postedGigsLoading } = useQuery<
    GigResponse[]
  >({
    queryKey: ["/api/admin/gigs/posted"],
    enabled: !!user && user.role === "super_admin",
  });

  const { data: allocatedGigs = [], isLoading: allocatedGigsLoading } =
    useQuery<GigResponse[]>({
      queryKey: ["/api/admin/gigs/allocated"],
      enabled: !!user && user.role === "super_admin",
    });

  const { data: ongoingGigs = [], isLoading: ongoingGigsLoading } = useQuery<
    GigResponse[]
  >({
    queryKey: ["/api/admin/gigs/ongoing"],
    enabled: !!user && user.role === "super_admin",
  });

  const { data: completedGigs = [], isLoading: completedGigsLoading } =
    useQuery<GigResponse[]>({
      queryKey: ["/api/admin/gigs/completed"],
      enabled: !!user && user.role === "super_admin",
    });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    GigCategory[]
  >({
    queryKey: ["/api/categories"],
    enabled: !!user && user.role === "super_admin",
  });

  const { data: locations = [], isLoading: locationsLoading } = useQuery<
    Location[]
  >({
    queryKey: ["/api/locations"],
    enabled: !!user && user.role === "super_admin",
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery<any[]>({
    queryKey: ["/api/skills"],
    enabled: !!user && user.role === "super_admin",
  });

  // Mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const res = await apiRequest("POST", "/api/categories", categoryData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setNewCategory({ name: "", description: "" });
      toast({
        title: "Category Created",
        description: "The category has been created successfully.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category.",
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: any) => {
      const res = await apiRequest(
        "PUT",
        `/api/categories/${categoryData.id}`,
        {
          name: categoryData.name,
          description: categoryData.description,
        },
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setEditItem(null);
      toast({
        title: "Category Updated",
        description: "The category has been updated successfully.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category.",
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Category Deleted",
        description: "The category has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category.",
        variant: "destructive",
      });
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: async (locationData: any) => {
      const res = await apiRequest("POST", "/api/locations", locationData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setNewLocation({ name: "" });
      toast({
        title: "Location Created",
        description: "The location has been created successfully.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create location.",
        variant: "destructive",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (locationData: any) => {
      const res = await apiRequest("PUT", `/api/locations/${locationData.id}`, {
        name: locationData.name,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setEditItem(null);
      toast({
        title: "Location Updated",
        description: "The location has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingLocationId(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update location.",
        variant: "destructive",
      });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      toast({
        title: "Location Deleted",
        description: "The location has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete location.",
        variant: "destructive",
      });
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (skillData: any) => {
      const res = await apiRequest("POST", "/api/skills", skillData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setNewSkill({ name: "", category: "" });
      toast({
        title: "Skill Created",
        description: "The skill has been created successfully.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create skill.",
        variant: "destructive",
      });
    },
  });

  const updateSkillMutation = useMutation({
    mutationFn: async (skillData: any) => {
      const res = await apiRequest("PUT", `/api/skills/${skillData.id}`, {
        name: skillData.name,
        category: skillData.category,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      setEditItem(null);
      toast({
        title: "Skill Updated",
        description: "The skill has been updated successfully.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update skill.",
        variant: "destructive",
      });
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/skills/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
      toast({
        title: "Skill Deleted",
        description: "The skill has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete skill.",
        variant: "destructive",
      });
    },
  });

  const allocateProviderMutation = useMutation({
    mutationFn: async ({
      gigId,
      providerId,
    }: {
      gigId: number;
      providerId: number;
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/admin/gigs/${gigId}/allocate`,
        {
          providerId,
          sendEmail: notificationSettings.providerAllocation,
        },
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gigs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/gigs/posted"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/gigs/allocated"],
      });
      setSelectedGig(null);
      setSelectedProvider(null);
      toast({
        title: "Provider Allocated",
        description: notificationSettings.providerAllocation
          ? "Provider has been allocated and notifications sent."
          : "Provider has been allocated.",
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to allocate provider.",
        variant: "destructive",
      });
    },
  });

  const verifyProviderMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: number;
      status: string;
    }) => {
      const res = await apiRequest(
        "PUT",
        `/api/admin/service-providers/${userId}/verify`,
        { status },
      );
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/service-providers"],
      });
      toast({
        title: "Provider Status Updated",
        description:
          "The service provider's verification status has been updated.",
      });

      // Update the provider's status in the local state for immediate UI update
      const updatedProviders = serviceProviders.map((provider) => {
        if (provider.id === data.user.id) {
          return {
            ...provider,
            verification_status: data.status,
          };
        }
        return provider;
      });

      queryClient.setQueryData(
        ["/api/admin/service-providers"],
        updatedProviders,
      );
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update provider status.",
        variant: "destructive",
      });
    },
  });

  const verifyClientMutation = useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: number;
      status: string;
    }) => {
      const res = await apiRequest(
        "PUT",
        `/api/admin/clients/${userId}/verify`,
        { status },
      );
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      toast({
        title: "Client Status Updated",
        description: "The client's verification status has been updated.",
      });

      // Update the client's status in the local state for immediate UI update
      const updatedClients = clients.map((client) => {
        if (client.id === data.user.id) {
          return {
            ...client,
            verification_status: data.status,
          };
        }
        return client;
      });

      queryClient.setQueryData(["/api/admin/clients"], updatedClients);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update client status.",
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const handleOpenDialog = (type: string, item?: any) => {
    setDialogType(type);
    if (item) setEditItem(item);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogType("");
    setEditItem(null);
    setSelectedGig(null);
    setSelectedProvider(null);
    setIsDialogOpen(false);
    setEditingLocationId(null);
  };

  // Service Providers Tab
  const renderServiceProvidersTab = () => (
    <TabsContent value="service-providers" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Service Providers</CardTitle>
              <CardDescription>
                Manage and verify all service providers on the platform.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search providers..."
                  className="w-[200px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {providersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !serviceProviders || serviceProviders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No service providers found.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceProviders
                  .filter(
                    (provider) =>
                      (statusFilter === "all" ||
                        provider.serviceProviderProfile?.verificationStatus ===
                          statusFilter ||
                        provider.verification_status === statusFilter) &&
                      (searchTerm === "" ||
                        provider.username
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        provider.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        (provider.serviceProviderProfile?.fullName &&
                          provider.serviceProviderProfile.fullName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))),
                  )
                  .map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">
                        {provider.serviceProviderProfile?.fullName ||
                          provider.username}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{provider.email}</p>
                          {provider.serviceProviderProfile?.phone && (
                            <p className="text-xs text-muted-foreground">
                              {provider.serviceProviderProfile.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {provider.serviceProviderProfile?.skills && (
                          <div className="flex flex-wrap gap-1">
                            {provider.serviceProviderProfile.skills
                              .slice(0, 3)
                              .map((skill, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {provider.serviceProviderProfile.skills.length >
                              3 && (
                              <Badge variant="outline" className="text-xs">
                                +
                                {provider.serviceProviderProfile.skills.length -
                                  3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {provider.serviceProviderProfile?.location}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          provider.serviceProviderProfile?.verificationStatus ||
                            provider.verification_status ||
                            "pending",
                        )}
                      </TableCell>
                      <TableCell>{formatDate(provider.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                verifyProviderMutation.mutate({
                                  userId: provider.id,
                                  status: "approved",
                                })
                              }
                              disabled={
                                provider.serviceProviderProfile
                                  ?.verificationStatus === "approved" ||
                                provider.verification_status === "approved" ||
                                verifyProviderMutation.isPending
                              }
                            >
                              {verifyProviderMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              )}
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                verifyProviderMutation.mutate({
                                  userId: provider.id,
                                  status: "rejected",
                                })
                              }
                              disabled={
                                provider.serviceProviderProfile
                                  ?.verificationStatus === "rejected" ||
                                provider.verification_status === "rejected" ||
                                verifyProviderMutation.isPending
                              }
                            >
                              {verifyProviderMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                verifyProviderMutation.mutate({
                                  userId: provider.id,
                                  status: "pending",
                                })
                              }
                              disabled={
                                provider.serviceProviderProfile
                                  ?.verificationStatus === "pending" ||
                                provider.verification_status === "pending" ||
                                verifyProviderMutation.isPending
                              }
                            >
                              {verifyProviderMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                              )}
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/providers/${provider.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );

  // Clients Tab
  const renderClientsTab = () => (
    <TabsContent value="clients" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>Clients</CardTitle>
              <CardDescription>
                Manage and verify all clients on the platform.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients..."
                  className="w-[200px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clientsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !clients || clients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No clients found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients
                  .filter(
                    (client) =>
                      (statusFilter === "all" ||
                        client.clientProfile?.verificationStatus ===
                          statusFilter ||
                        client.verification_status === statusFilter) &&
                      (searchTerm === "" ||
                        client.username
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        client.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        (client.clientProfile?.contactName &&
                          client.clientProfile.contactName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))),
                  )
                  .map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.clientProfile?.contactName || client.username}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{client.email}</p>
                          {client.clientProfile?.phone && (
                            <p className="text-xs text-muted-foreground">
                              {client.clientProfile.phone}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {client.clientProfile?.companyName || "-"}
                      </TableCell>
                      <TableCell>
                        {client.clientProfile?.location || "-"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(
                          client.clientProfile?.verificationStatus ||
                            client.verification_status ||
                            "pending",
                        )}
                      </TableCell>
                      <TableCell>{formatDate(client.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                verifyClientMutation.mutate({
                                  userId: client.id,
                                  status: "approved",
                                })
                              }
                              disabled={
                                client.clientProfile?.verificationStatus ===
                                  "approved" ||
                                client.verification_status === "approved" ||
                                verifyClientMutation.isPending
                              }
                            >
                              {verifyClientMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              )}
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                verifyClientMutation.mutate({
                                  userId: client.id,
                                  status: "rejected",
                                })
                              }
                              disabled={
                                client.clientProfile?.verificationStatus ===
                                  "rejected" ||
                                client.verification_status === "rejected" ||
                                verifyClientMutation.isPending
                              }
                            >
                              {verifyClientMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                              )}
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                verifyClientMutation.mutate({
                                  userId: client.id,
                                  status: "pending",
                                })
                              }
                              disabled={
                                client.clientProfile?.verificationStatus ===
                                  "pending" ||
                                client.verification_status === "pending" ||
                                verifyClientMutation.isPending
                              }
                            >
                              {verifyClientMutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                              )}
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/clients/${client.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );

  const handleSubmit = () => {
    switch (dialogType) {
      case "add-category":
        createCategoryMutation.mutate(newCategory);
        break;
      case "edit-category":
        updateCategoryMutation.mutate(editItem);
        break;
      case "add-location":
        createLocationMutation.mutate(newLocation);
        break;
      case "edit-location":
        updateLocationMutation.mutate(editItem);
        break;
      case "add-skill":
        createSkillMutation.mutate(newSkill);
        break;
      case "edit-skill":
        updateSkillMutation.mutate(editItem);
        break;
      case "allocate-provider":
        if (selectedGig && selectedProvider) {
          allocateProviderMutation.mutate({
            gigId: selectedGig.id,
            providerId: selectedProvider.id,
          });
        }
        break;
      default:
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGigStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            Open
          </Badge>
        );
      case "allocated":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-600 border-purple-200"
          >
            Allocated
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  // Filter data based on search term
  const filterData = (data: any[], keys: string[]) => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      keys.some((key) => {
        const value = key.includes(".")
          ? key.split(".").reduce((obj, k) => obj && obj[k], item)
          : item[key];
        return (
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
    );
  };

  // All Gigs Tab
  const renderGigsTab = () => (
    <TabsContent value="gigs" className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>All Gigs</CardTitle>
              <CardDescription>
                Overview of all gigs across the platform.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search gigs..."
                  className="w-[200px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="allocated">Allocated</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Tag className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {gigsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !allGigs || allGigs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No gigs found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allGigs
                  .filter(
                    (gig) =>
                      (statusFilter === "all" || gig.status === statusFilter) &&
                      (categoryFilter === "all" ||
                        gig.categoryId.toString() === categoryFilter) &&
                      (searchTerm === "" ||
                        gig.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        gig.description
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        gig.client.username
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        (gig.provider?.username &&
                          gig.provider.username
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))),
                  )
                  .map((gig) => (
                    <TableRow key={gig.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {gig.title}
                      </TableCell>
                      <TableCell>{gig.category.name}</TableCell>
                      <TableCell>
                        <Link href={`/clients/${gig.clientId}`}>
                          <span className="text-primary hover:underline cursor-pointer">
                            {gig.client.username}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{getGigStatusBadge(gig.status)}</TableCell>
                      <TableCell>${gig.budget}</TableCell>
                      <TableCell>
                        {gig.provider ? (
                          <Link href={`/providers/${gig.providerId}`}>
                            <span className="text-primary hover:underline cursor-pointer">
                              {gig.provider.username}
                            </span>
                          </Link>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-600 border-amber-200"
                          >
                            Unassigned
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{gig.location?.name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {gig.status === "open" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setSelectedGig(gig);
                                handleOpenDialog("allocate-provider");
                              }}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Assign Provider
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/gigs/${gig.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );

  if (user?.role !== "super_admin") {
    return (
      <AppShell>
        <div className="container max-w-7xl mx-auto py-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Access Denied
              </h1>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Provider Allocation Dialog
  const renderProviderAllocationDialog = () => (
    <Dialog
      open={isDialogOpen && dialogType === "allocate-provider"}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Assign Service Provider to Gig</DialogTitle>
          <DialogDescription>
            Allocate a service provider to handle this gig request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {selectedGig && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Gig Details</h3>
                <p className="text-sm font-medium">
                  Title: {selectedGig.title}
                </p>
                <p className="text-sm">Category: {selectedGig.category.name}</p>
                <p className="text-sm">Budget: ${selectedGig.budget}</p>
                <p className="text-sm">Location: {selectedGig.location.name}</p>
                <p className="text-sm">Client: {selectedGig.client.username}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Select a Service Provider</h3>
                <Select
                  onValueChange={(value) => {
                    const found = serviceProviders.find(
                      (p) => p.id.toString() === value,
                    );
                    if (found) {
                      setSelectedProvider(found);
                    } else {
                      setSelectedProvider(null);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceProviders
                      .filter(
                        (provider) =>
                          provider.verification_status === "approved" ||
                          provider.serviceProviderProfile
                            ?.verificationStatus === "approved",
                      )
                      .map((provider) => (
                        <SelectItem
                          key={provider.id}
                          value={provider.id.toString()}
                        >
                          {provider.serviceProviderProfile?.fullName ||
                            provider.username}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProvider && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Provider Details</h3>
                  <p className="text-sm font-medium">
                    {selectedProvider.serviceProviderProfile?.fullName ||
                      selectedProvider.username}
                  </p>
                  <p className="text-sm">{selectedProvider.email}</p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Skills:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedProvider.serviceProviderProfile?.skills?.map(
                        (skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="notification-switch"
                  checked={notificationSettings.providerAllocation}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      providerAllocation: checked,
                    })
                  }
                />
                <Label htmlFor="notification-switch">
                  Send email notification to provider
                </Label>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedGig ||
              !selectedProvider ||
              allocateProviderMutation.isPending
            }
          >
            {allocateProviderMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Provider"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <AppShell>
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Super Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage providers, clients, gigs, and platform settings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Card className="p-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold">Super Admin Portal</p>
                    <p className="text-muted-foreground">CloudSec Tech</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Dashboard Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Service Providers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {serviceProviders.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {serviceProviders.filter(
                    (p) => p.verification_status === "pending",
                  ).length || 0}{" "}
                  pending verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {clients.filter((c) => c.verification_status === "pending")
                    .length || 0}{" "}
                  pending verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Open Gigs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {postedGigs.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Waiting for provider allocation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Ongoing Gigs
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ongoingGigs.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in progress
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="bg-muted">
              <TabsTrigger
                value="service-providers"
                onClick={() => setActiveTab("service-providers")}
              >
                <Users className="mr-2 h-4 w-4" />
                Providers
              </TabsTrigger>
              <TabsTrigger
                value="clients"
                onClick={() => setActiveTab("clients")}
              >
                <Users className="mr-2 h-4 w-4" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="gigs" onClick={() => setActiveTab("gigs")}>
                <Briefcase className="mr-2 h-4 w-4" />
                All Gigs
              </TabsTrigger>
              <TabsTrigger
                value="posted"
                onClick={() => setActiveTab("posted")}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Posted Gigs
              </TabsTrigger>
              <TabsTrigger
                value="ongoing"
                onClick={() => setActiveTab("ongoing")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Ongoing
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                onClick={() => setActiveTab("completed")}
              >
                <CheckSquare className="mr-2 h-4 w-4" />
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                onClick={() => setActiveTab("categories")}
              >
                <Tag className="mr-2 h-4 w-4" />
                Categories
              </TabsTrigger>
            </TabsList>

            {/* All Gigs Tab */}
            {renderGigsTab()}

            {/* Provider Allocation Dialog */}
            {renderProviderAllocationDialog()}

            {/* Service Providers Tab */}
            {renderServiceProvidersTab()}

            {/* Clients Tab */}
            {renderClientsTab()}

            {/* All Gigs Tab */}
            <TabsContent value="gigs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>All Gigs</CardTitle>
                      <CardDescription>
                        Manage all gigs on the platform.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search gigs..."
                          className="w-[200px] pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="allocated">Allocated</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Tag className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {gigsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : !allGigs || allGigs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No gigs found.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allGigs
                          .filter(
                            (gig) =>
                              statusFilter === "all" ||
                              gig.status === statusFilter,
                          )
                          .filter(
                            (gig) =>
                              categoryFilter === "all" ||
                              gig.categoryId.toString() === categoryFilter,
                          )
                          .filter(
                            (gig) =>
                              searchTerm === "" ||
                              gig.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              gig.description
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                          )
                          .map((gig) => (
                            <TableRow key={gig.id}>
                              <TableCell className="font-medium">
                                {gig.title}
                              </TableCell>
                              <TableCell>
                                {gig.category?.name || "Unknown"}
                              </TableCell>
                              <TableCell>
                                {gig.client?.username || "Unknown"}
                              </TableCell>
                              <TableCell>
                                {gig.provider ? (
                                  gig.provider.username
                                ) : gig.status === "open" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedGig(gig);
                                      handleOpenDialog("allocate-provider");
                                    }}
                                  >
                                    Allocate
                                  </Button>
                                ) : (
                                  "Not Allocated"
                                )}
                              </TableCell>
                              <TableCell>
                                {getGigStatusBadge(gig.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-xs">
                                    Start: {formatDate(gig.startDate)}
                                  </span>
                                  <span className="text-xs">
                                    End: {formatDate(gig.endDate)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                      View Details
                                    </DropdownMenuItem>
                                    {gig.status === "open" && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedGig(gig);
                                          setSelectedProvider(null);
                                          handleOpenDialog("allocate-provider");
                                        }}
                                      >
                                        Allocate Provider
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                  {/* Allocate Provider Dialog */}
                  <Dialog
                    open={isDialogOpen && dialogType === "allocate-provider"}
                    onOpenChange={handleCloseDialog}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Allocate Provider to Gig</DialogTitle>
                        <DialogDescription>
                          Assign a service provider to complete this gig.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        {selectedGig && (
                          <div className="mb-4 p-4 bg-gray-50 rounded-md">
                            <h3 className="font-medium">{selectedGig.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {selectedGig.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">
                                {selectedGig.category?.name}
                              </Badge>
                              <Badge variant="outline">
                                {selectedGig.location?.name}
                              </Badge>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Select Service Provider</Label>
                          <Select
                            onValueChange={(value) => {
                              const provider = serviceProviders.find(
                                (p) => p.id.toString() === value,
                              );
                              if (provider) {
                                setSelectedProvider(provider);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                              {serviceProviders
                                .filter(
                                  (provider) =>
                                    provider.serviceProviderProfile
                                      ?.verificationStatus === "approved" ||
                                    provider.verification_status === "approved",
                                )
                                .filter((provider) => {
                                  // Filter providers who have skills matching the gig category
                                  const categoryName =
                                    selectedGig?.category?.name?.toLowerCase();
                                  if (!categoryName) return true;
                                  return provider.serviceProviderProfile?.skills?.some(
                                    (skill: string) =>
                                      skill
                                        .toLowerCase()
                                        .includes(categoryName),
                                  );
                                })
                                .map((provider) => (
                                  <SelectItem
                                    key={provider.id}
                                    value={provider.id.toString()}
                                  >
                                    {provider.serviceProviderProfile
                                      ?.fullName || provider.username}{" "}
                                    {provider.serviceProviderProfile?.skills
                                      ?.length
                                      ? `- ${provider.serviceProviderProfile.skills.join(", ")}`
                                      : ""}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="send-notification"
                            checked={notificationSettings.providerAllocation}
                            onCheckedChange={(checked) =>
                              setNotificationSettings({
                                ...notificationSettings,
                                providerAllocation: checked,
                              })
                            }
                          />
                          <Label htmlFor="send-notification">
                            Send email notifications
                          </Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={
                            !selectedProvider ||
                            allocateProviderMutation.isPending
                          }
                        >
                          {allocateProviderMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          Allocate Provider
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Posted Gigs Tab */}
            <TabsContent value="posted-gigs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Posted Gigs</CardTitle>
                      <CardDescription>
                        Manage and allocate newly posted gigs.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search gigs..."
                          className="w-[200px] pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="w-[130px]">
                          <Tag className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Filter by category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {postedGigsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : !postedGigs || postedGigs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No posted gigs found.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {postedGigs
                          .filter(
                            (gig) =>
                              categoryFilter === "all" ||
                              gig.categoryId.toString() === categoryFilter,
                          )
                          .filter(
                            (gig) =>
                              searchTerm === "" ||
                              gig.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              gig.description
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                          )
                          .map((gig) => (
                            <TableRow key={gig.id}>
                              <TableCell className="font-medium">
                                {gig.title}
                              </TableCell>
                              <TableCell>
                                {gig.category?.name || "Unknown"}
                              </TableCell>
                              <TableCell>
                                {gig.client?.username || "Unknown"}
                              </TableCell>
                              <TableCell>
                                {gig.location?.name || "Unknown"}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-xs">
                                    Start: {formatDate(gig.startDate)}
                                  </span>
                                  <span className="text-xs">
                                    End: {formatDate(gig.endDate)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedGig(gig);
                                    handleOpenDialog("allocate-provider");
                                  }}
                                >
                                  Allocate Provider
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ongoing Gigs Tab */}
            <TabsContent value="ongoing-gigs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Ongoing Gigs</CardTitle>
                      <CardDescription>
                        Track all gigs currently in progress.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search gigs..."
                          className="w-[200px] pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {ongoingGigsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : !ongoingGigs || ongoingGigs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No ongoing gigs found.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ongoingGigs.map((gig) => (
                          <TableRow key={gig.id}>
                            <TableCell className="font-medium">
                              {gig.title}
                            </TableCell>
                            <TableCell>
                              {gig.category?.name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {gig.client?.username || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {gig.provider?.username || "Not Allocated"}
                            </TableCell>
                            <TableCell>
                              {gig.location?.name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-xs">
                                  Start: {formatDate(gig.startDate)}
                                </span>
                                <span className="text-xs">
                                  End: {formatDate(gig.endDate)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Completed Gigs Tab */}
            <TabsContent value="completed-gigs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Completed Gigs</CardTitle>
                      <CardDescription>
                        View all completed gigs and their details.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search gigs..."
                          className="w-[200px] pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {completedGigsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : !completedGigs || completedGigs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No completed gigs found.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Completed Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedGigs.map((gig) => (
                          <TableRow key={gig.id}>
                            <TableCell className="font-medium">
                              {gig.title}
                            </TableCell>
                            <TableCell>
                              {gig.category?.name || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {gig.client?.username || "Unknown"}
                            </TableCell>
                            <TableCell>
                              {gig.provider?.username || "Not Allocated"}
                            </TableCell>
                            <TableCell>
                              {gig.location?.name || "Unknown"}
                            </TableCell>
                            <TableCell>{formatDate(gig.endDate)}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Categories & Locations</CardTitle>
                      <CardDescription>
                        Manage service categories, locations, and skills for the
                        platform.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4">
                          Service Categories
                        </h3>
                        <div className="flex items-center space-x-2 mb-4">
                          <Input
                            placeholder="Category name"
                            value={newCategory.name}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                name: e.target.value,
                              })
                            }
                            className="max-w-xs"
                          />
                          <Input
                            placeholder="Category description"
                            value={newCategory.description}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                description: e.target.value,
                              })
                            }
                            className="max-w-xs"
                          />
                          <Button
                            onClick={() => handleOpenDialog("add-category")}
                            disabled={
                              !newCategory.name.trim() ||
                              createCategoryMutation.isPending
                            }
                          >
                            {createCategoryMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            <span className="ml-1">Add</span>
                          </Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categories.map((category) => (
                              <TableRow key={category.id}>
                                <TableCell className="font-medium">
                                  {category.name}
                                </TableCell>
                                <TableCell>
                                  {category.description || "-"}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setEditItem(category);
                                        handleOpenDialog("edit-category");
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500"
                                      onClick={() =>
                                        deleteCategoryMutation.mutate(
                                          category.id,
                                        )
                                      }
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Edit Category Dialog */}
                      <Dialog
                        open={isDialogOpen && dialogType === "edit-category"}
                        onOpenChange={handleCloseDialog}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                            <DialogDescription>
                              Update the category details below.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label>Category Name</Label>
                              <Input
                                value={editItem?.name || ""}
                                onChange={(e) =>
                                  setEditItem({
                                    ...editItem,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={editItem?.description || ""}
                                onChange={(e) =>
                                  setEditItem({
                                    ...editItem,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={handleCloseDialog}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              disabled={
                                !editItem?.name.trim() ||
                                updateCategoryMutation.isPending
                              }
                            >
                              {updateCategoryMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : null}
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      {/* Add Category Dialog */}
                      <Dialog
                        open={isDialogOpen && dialogType === "add-category"}
                        onOpenChange={handleCloseDialog}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Category</DialogTitle>
                            <DialogDescription>
                              Enter the details for the new service category.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-2">
                            <div className="space-y-2">
                              <Label>Category Name</Label>
                              <Input
                                value={newCategory.name}
                                onChange={(e) =>
                                  setNewCategory({
                                    ...newCategory,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={newCategory.description}
                                onChange={(e) =>
                                  setNewCategory({
                                    ...newCategory,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={handleCloseDialog}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSubmit}
                              disabled={
                                !newCategory.name.trim() ||
                                createCategoryMutation.isPending
                              }
                            >
                              {createCategoryMutation.isPending ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : null}
                              Add Category
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Locations</h3>
                        <div className="flex items-center space-x-2 mb-4">
                          <Input
                            placeholder="Add new location..."
                            value={newLocation.name}
                            onChange={(e) =>
                              setNewLocation({
                                ...newLocation,
                                name: e.target.value,
                              })
                            }
                            className="max-w-xs"
                          />
                          <Button
                            onClick={() => handleOpenDialog("add-location")}
                            disabled={
                              !newLocation.name.trim() ||
                              createLocationMutation.isPending
                            }
                          >
                            {createLocationMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            <span className="ml-1">Add</span>
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {locations.map((location) => (
                            <div
                              key={location.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              {editingLocationId === location.id ? (
                                <Input
                                  value={location.name}
                                  onChange={(e) => {
                                    const updatedLocations = locations.map(
                                      (l) =>
                                        l.id === location.id
                                          ? { ...l, name: e.target.value }
                                          : l,
                                    );
                                    queryClient.setQueryData(
                                      ["/api/locations"],
                                      updatedLocations,
                                    );
                                  }}
                                  className="w-2/3"
                                />
                              ) : (
                                <span>{location.name}</span>
                              )}

                              {editingLocationId === location.id ? (
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      updateLocationMutation.mutate({
                                        id: location.id,
                                        name: location.name,
                                      })
                                    }
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingLocationId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setEditingLocationId(location.id)
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500"
                                    onClick={() =>
                                      deleteLocationMutation.mutate(location.id)
                                    }
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Location Dialog */}
                        <Dialog
                          open={isDialogOpen && dialogType === "add-location"}
                          onOpenChange={handleCloseDialog}
                        >
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Location</DialogTitle>
                              <DialogDescription>
                                Enter the name of the new service location.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-2">
                              <div className="space-y-2">
                                <Label>Location Name</Label>
                                <Input
                                  value={newLocation.name}
                                  onChange={(e) =>
                                    setNewLocation({
                                      ...newLocation,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={handleCloseDialog}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSubmit}
                                disabled={
                                  !newLocation.name.trim() ||
                                  createLocationMutation.isPending
                                }
                              >
                                {createLocationMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : null}
                                Add Location
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "add-category" && "Add New Category"}
              {dialogType === "edit-category" && "Edit Category"}
              {dialogType === "add-location" && "Add New Location"}
              {dialogType === "edit-location" && "Edit Location"}
              {dialogType === "add-skill" && "Add New Skill"}
              {dialogType === "edit-skill" && "Edit Skill"}
              {dialogType === "allocate-provider" && "Allocate Provider to Gig"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "add-category" &&
                "Create a new category for gigs."}
              {dialogType === "edit-category" && "Update the category details."}
              {dialogType === "add-location" && "Add a new service location."}
              {dialogType === "edit-location" && "Update the location name."}
              {dialogType === "add-skill" && "Add a new provider skill."}
              {dialogType === "edit-skill" && "Update the skill details."}
              {dialogType === "allocate-provider" &&
                "Assign a service provider to this gig."}
            </DialogDescription>
          </DialogHeader>

          {/* Category Form */}
          {(dialogType === "add-category" ||
            dialogType === "edit-category") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={
                    dialogType === "add-category"
                      ? newCategory.name
                      : editItem?.name
                  }
                  onChange={(e) =>
                    dialogType === "add-category"
                      ? setNewCategory({ ...newCategory, name: e.target.value })
                      : setEditItem({ ...editItem, name: e.target.value })
                  }
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={
                    dialogType === "add-category"
                      ? newCategory.description
                      : editItem?.description
                  }
                  onChange={(e) =>
                    dialogType === "add-category"
                      ? setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      : setEditItem({
                          ...editItem,
                          description: e.target.value,
                        })
                  }
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Location Form */}
          {(dialogType === "add-location" ||
            dialogType === "edit-location") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  value={
                    dialogType === "add-location"
                      ? newLocation.name
                      : editItem?.name
                  }
                  onChange={(e) =>
                    dialogType === "add-location"
                      ? setNewLocation({ ...newLocation, name: e.target.value })
                      : setEditItem({ ...editItem, name: e.target.value })
                  }
                  placeholder="Enter location name"
                />
              </div>
            </div>
          )}

          {/* Skill Form */}
          {(dialogType === "add-skill" || dialogType === "edit-skill") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={
                    dialogType === "add-skill" ? newSkill.name : editItem?.name
                  }
                  onChange={(e) =>
                    dialogType === "add-skill"
                      ? setNewSkill({ ...newSkill, name: e.target.value })
                      : setEditItem({ ...editItem, name: e.target.value })
                  }
                  placeholder="Enter skill name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skillCategory">Category</Label>
                <Select
                  value={
                    dialogType === "add-skill"
                      ? newSkill.category
                      : editItem?.category
                  }
                  onValueChange={(value) =>
                    dialogType === "add-skill"
                      ? setNewSkill({ ...newSkill, category: value })
                      : setEditItem({ ...editItem, category: value })
                  }
                >
                  <SelectTrigger id="skillCategory">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="cloud">Cloud</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Allocate Provider Form */}
          {dialogType === "allocate-provider" && (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium mb-2">{selectedGig?.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedGig?.description}
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline">{selectedGig?.category?.name}</Badge>
                  <Badge variant="outline">{selectedGig?.location?.name}</Badge>
                  <Badge variant="outline">${selectedGig?.budget}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="provider">Select Provider</Label>
                <Select
                  value={selectedProvider?.id?.toString()}
                  onValueChange={(value) => {
                    const provider = serviceProviders?.find(
                      (p) => p.id.toString() === value,
                    );
                    setSelectedProvider(provider);
                  }}
                >
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceProviders
                      ?.filter(
                        (provider) =>
                          provider.serviceProviderProfile
                            ?.verificationStatus === "approved",
                      )
                      .map((provider) => (
                        <SelectItem
                          key={provider.id}
                          value={provider.id.toString()}
                        >
                          {provider.serviceProviderProfile?.fullName ||
                            provider.username}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sendEmail"
                  checked={notificationSettings.providerAllocation}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      providerAllocation: checked,
                    })
                  }
                />
                <Label htmlFor="sendEmail">
                  Send email notification to provider and client
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                (dialogType === "add-category" &&
                  (!newCategory.name || !newCategory.description)) ||
                (dialogType === "edit-category" &&
                  (!editItem?.name || !editItem?.description)) ||
                (dialogType === "add-location" && !newLocation.name) ||
                (dialogType === "edit-location" && !editItem?.name) ||
                (dialogType === "add-skill" &&
                  (!newSkill.name || !newSkill.category)) ||
                (dialogType === "edit-skill" &&
                  (!editItem?.name || !editItem?.category)) ||
                (dialogType === "allocate-provider" &&
                  (!selectedGig || !selectedProvider))
              }
            >
              {createCategoryMutation.isPending ||
              updateCategoryMutation.isPending ||
              createLocationMutation.isPending ||
              updateLocationMutation.isPending ||
              createSkillMutation.isPending ||
              updateSkillMutation.isPending ||
              allocateProviderMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {dialogType.startsWith("add")
                ? "Add"
                : dialogType.startsWith("edit")
                  ? "Save"
                  : "Allocate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
