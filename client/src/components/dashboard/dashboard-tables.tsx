import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ratings/rating-stars";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical, Check, X, Plus, Edit, Trash } from "lucide-react";
import { Link } from "wouter";

interface ServiceProvider {
  id: number;
  username: string;
  email: string;
  serviceProviderProfile?: {
    fullName: string;
    location: string;
    skills: string[];
    verificationStatus: string;
    avgRating: number;
  };
}

interface Client {
  id: number;
  username: string;
  email: string;
  clientProfile?: {
    contactName: string;
    companyName: string;
    location: string;
    verificationStatus: string;
  };
}

interface Gig {
  id: number;
  title: string;
  description: string;
  category: {
    name: string;
  };
  location: {
    name: string;
  };
  client: Client;
  provider?: ServiceProvider;
  startDate: string;
  endDate: string;
  status: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface Location {
  id: number;
  name: string;
}

interface DashboardTablesProps {
  type: 'providers' | 'clients' | 'gigs' | 'categories' | 'locations';
}

export function DashboardTables({ type }: DashboardTablesProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newLocationName, setNewLocationName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);

  // Fetch data based on type
  const { data: serviceProviders, isLoading: providersLoading } = useQuery({
    queryKey: ["/api/admin/service-providers"],
    enabled: type === 'providers',
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["/api/admin/clients"],
    enabled: type === 'clients',
  });

  const { data: gigs, isLoading: gigsLoading } = useQuery({
    queryKey: ["/api/gigs"],
    enabled: type === 'gigs',
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
    enabled: type === 'categories',
  });

  const { data: locations, isLoading: locationsLoading } = useQuery({
    queryKey: ["/api/locations"],
    enabled: type === 'locations' || type === 'categories',
  });

  // Mutations
  const updateProviderVerificationMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number, status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/service-providers/${userId}/verify`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Service provider verification status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/service-providers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateClientVerificationMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number, status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/clients/${userId}/verify`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Client verification status has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/clients"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/categories", {
        name: newCategoryName,
        description: newCategoryDescription,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "The category has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setNewCategoryName("");
      setNewCategoryDescription("");
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name, description }: { id: number, name: string, description: string }) => {
      const res = await apiRequest("PUT", `/api/categories/${id}`, {
        name,
        description,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category updated",
        description: "The category has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setEditingCategoryId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "The category has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/locations", {
        name: newLocationName,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Location created",
        description: "The location has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setNewLocationName("");
    },
    onError: (error: Error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number, name: string }) => {
      const res = await apiRequest("PUT", `/api/locations/${id}`, { name });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Location updated",
        description: "The location has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
      setEditingLocationId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteLocationMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/locations/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Location deleted",
        description: "The location has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/locations"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const approveProvider = (userId: number) => {
    updateProviderVerificationMutation.mutate({ userId, status: 'approved' });
  };

  const rejectProvider = (userId: number) => {
    updateProviderVerificationMutation.mutate({ userId, status: 'rejected' });
  };

  const approveClient = (userId: number) => {
    updateClientVerificationMutation.mutate({ userId, status: 'approved' });
  };

  const rejectClient = (userId: number) => {
    updateClientVerificationMutation.mutate({ userId, status: 'rejected' });
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }
    createCategoryMutation.mutate();
  };

  const handleUpdateCategory = (id: number, name: string, description: string) => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }
    updateCategoryMutation.mutate({ id, name, description });
  };

  const handleDeleteCategory = (id: number) => {
    deleteCategoryMutation.mutate(id);
  };

  const handleCreateLocation = () => {
    if (!newLocationName.trim()) {
      toast({
        title: "Validation Error",
        description: "Location name is required.",
        variant: "destructive",
      });
      return;
    }
    createLocationMutation.mutate();
  };

  const handleUpdateLocation = (id: number, name: string) => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Location name is required.",
        variant: "destructive",
      });
      return;
    }
    updateLocationMutation.mutate({ id, name });
  };

  const handleDeleteLocation = (id: number) => {
    deleteLocationMutation.mutate(id);
  };

  // Filter data based on search term
  const filterData = (data: any[], keys: string[]) => {
    if (!searchTerm) return data;
    return data.filter(item =>
      keys.some(key => {
        const value = key.includes('.')
          ? key.split('.').reduce((obj, k) => obj?.[k], item)
          : item[key];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  };

  let filteredData: any[] = [];
  let isLoading = false;

  if (type === 'providers') {
    filteredData = filterData(serviceProviders || [] as ServiceProvider[], ['username', 'email', 'serviceProviderProfile.fullName', 'serviceProviderProfile.location']);
    isLoading = providersLoading;
  } else if (type === 'clients') {
    filteredData = filterData(clients || [] as Client[], ['username', 'email', 'clientProfile.contactName', 'clientProfile.companyName']);
    isLoading = clientsLoading;
  } else if (type === 'gigs') {
    filteredData = filterData(gigs || [] as Gig[], ['title', 'description', 'category.name', 'location.name']);
    isLoading = gigsLoading;
  } else if (type === 'categories') {
    filteredData = filterData(categories || [] as Category[], ['name', 'description']);
    isLoading = categoriesLoading;
  } else if (type === 'locations') {
    filteredData = filterData(locations || [] as Location[], ['name']);
    isLoading = locationsLoading;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGigStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">Open</Badge>;
      case 'allocated':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">Allocated</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render table based on type
  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (filteredData.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No data found.</p>
        </div>
      );
    }

    if (type === 'providers') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((provider: ServiceProvider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">
                  {provider.serviceProviderProfile?.fullName || provider.username}
                </TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>{provider.serviceProviderProfile?.location || 'N/A'}</TableCell>
                <TableCell>
                  {provider.serviceProviderProfile?.skills?.slice(0, 2).join(', ') || 'N/A'}
                  {provider.serviceProviderProfile?.skills?.length > 2 && '...'}
                </TableCell>
                <TableCell>
                  {provider.serviceProviderProfile?.verificationStatus
                    ? getStatusBadge(provider.serviceProviderProfile.verificationStatus)
                    : 'No Profile'}
                </TableCell>
                <TableCell>
                  {provider.serviceProviderProfile?.avgRating ? (
                    <div className="flex items-center">
                      <RatingStars value={provider.serviceProviderProfile.avgRating} readOnly size="sm" />
                      <span className="ml-1 text-sm">
                        {provider.serviceProviderProfile.avgRating}
                      </span>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell>
                  {provider.serviceProviderProfile?.verificationStatus === 'pending' ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => approveProvider(provider.id)}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => rejectProvider(provider.id)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link href={`/providers/${provider.id}`}>
                        <a>View</a>
                      </Link>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (type === 'clients') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((client: Client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.clientProfile?.contactName || client.username}
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.clientProfile?.companyName || 'N/A'}</TableCell>
                <TableCell>{client.clientProfile?.location || 'N/A'}</TableCell>
                <TableCell>
                  {client.clientProfile?.verificationStatus
                    ? getStatusBadge(client.clientProfile.verificationStatus)
                    : 'No Profile'}
                </TableCell>
                <TableCell>
                  {client.clientProfile?.verificationStatus === 'pending' ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => approveClient(client.id)}
                      >
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => rejectClient(client.id)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (type === 'gigs') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((gig: Gig) => (
              <TableRow key={gig.id}>
                <TableCell className="font-medium">{gig.title}</TableCell>
                <TableCell>{gig.category.name}</TableCell>
                <TableCell>{gig.location.name}</TableCell>
                <TableCell>
                  {gig.client.clientProfile?.contactName || gig.client.username}
                </TableCell>
                <TableCell>
                  {gig.provider
                    ? (gig.provider.serviceProviderProfile?.fullName || gig.provider.username)
                    : 'Unassigned'}
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div>Start: {formatDate(gig.startDate)}</div>
                    <div>End: {formatDate(gig.endDate)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {getGigStatusBadge(gig.status)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/gigs/${gig.id}`}>
                      <a>View</a>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (type === 'categories') {
      return (
        <>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Gig Categories</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Create a new service category for the platform.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Category Name
                    </label>
                    <Input
                      id="name"
                      placeholder="e.g. Network Installation"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description (Optional)
                    </label>
                    <Input
                      id="description"
                      placeholder="Brief description of the category"
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleCreateCategory} disabled={createCategoryMutation.isPending}>
                    {createCategoryMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : "Create Category"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
              {filteredData.map((category: Category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {editingCategoryId === category.id ? (
                      <Input
                        value={category.name}
                        onChange={(e) => {
                          const updatedCategories = categories?.map((c: Category) =>
                            c.id === category.id ? { ...c, name: e.target.value } : c
                          );
                          queryClient.setQueryData(["/api/categories"], updatedCategories);
                        }}
                        className="max-w-[200px]"
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCategoryId === category.id ? (
                      <Input
                        value={category.description || ''}
                        onChange={(e) => {
                          const updatedCategories = categories?.map((c: Category) =>
                            c.id === category.id ? { ...c, description: e.target.value } : c
                          );
                          queryClient.setQueryData(["/api/categories"], updatedCategories);
                        }}
                      />
                    ) : (
                      category.description || 'No description'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCategoryId === category.id ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateCategory(category.id, category.name, category.description || '')}
                          disabled={updateCategoryMutation.isPending}
                        >
                          {updateCategoryMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : "Save"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCategoryId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditingCategoryId(category.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Locations</h3>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="Add new location..."
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                className="max-w-xs"
              />
              <Button
                onClick={handleCreateLocation}
                disabled={createLocationMutation.isPending || !newLocationName.trim()}
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
              {locations?.map((location: Location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between border rounded p-2"
                >
                  {editingLocationId === location.id ? (
                    <Input
                      value={location.name}
                      onChange={(e) => {
                        const updatedLocations = locations?.map((l: Location) =>
                          l.id === location.id ? { ...l, name: e.target.value } : l
                        );
                        queryClient.setQueryData(["/api/locations"], updatedLocations);
                      }}
                      className="mr-2"
                    />
                  ) : (
                    <span>{location.name}</span>
                  )}

                  {editingLocationId === location.id ? (
                    <div className="flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => handleUpdateLocation(location.id, location.name)}
                        disabled={updateLocationMutation.isPending}
                      >
                        {updateLocationMutation.isPending ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2"
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
                        className="h-7 w-7 p-0"
                        onClick={() => setEditingLocationId(location.id)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteLocation(location.id)}
                      >
                        <Trash className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (type === 'locations') {
      return (
        <>
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium">Service Locations</h3>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Add new location..."
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                className="max-w-xs"
              />
              <Button
                onClick={handleCreateLocation}
                disabled={createLocationMutation.isPending || !newLocationName.trim()}
              >
                {createLocationMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span className="ml-1">Add</span>
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((location: Location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">
                    {editingLocationId === location.id ? (
                      <Input
                        value={location.name}
                        onChange={(e) => {
                          const updatedLocations = locations?.map((l: Location) =>
                            l.id === location.id ? { ...l, name: e.target.value } : l
                          );
                          queryClient.setQueryData(["/api/locations"], updatedLocations);
                        }}
                      />
                    ) : (
                      location.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingLocationId === location.id ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateLocation(location.id, location.name)}
                          disabled={updateLocationMutation.isPending}
                        >
                          {updateLocationMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : "Save"}
                                                </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingLocationId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditingLocationId(location.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteLocation(location.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
    }

    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>
          {type === 'providers' && 'Service Providers'}
          {type === 'clients' && 'Clients'}
          {type === 'gigs' && 'All Gigs'}
          {type === 'categories' && 'Categories & Locations'}
          {type === 'locations' && 'Service Locations'}
        </CardTitle>
        <CardDescription>
          {type === 'providers' && 'Manage and verify service provider profiles.'}
          {type === 'clients' && 'Manage and verify client profiles.'}
          {type === 'gigs' && 'View and manage all gigs on the platform.'}
          {type === 'categories' && 'Manage gig categories and service locations.'}
          {type === 'locations' && 'Manage available service locations.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {type !== 'categories' && (
          <div className="mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        )}

        {renderTable()}
      </CardContent>
    </Card>
  );
}