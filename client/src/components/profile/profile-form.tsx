import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const serviceProviderSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  phone: z.string().optional(),
  skills: z.string().min(2, "Skills are required"),
  experience: z.string().optional(),
  availability: z.string().optional(),
  bio: z.string().optional(),
});

const clientSchema = z.object({
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  companyName: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  phone: z.string().optional(),
});

type ServiceProviderFormValues = z.infer<typeof serviceProviderSchema>;
type ClientFormValues = z.infer<typeof clientSchema>;

export function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formLoaded, setFormLoaded] = useState(false);
  
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!user,
  });
  
  const createServiceProviderMutation = useMutation({
    mutationFn: async (data: ServiceProviderFormValues) => {
      // Convert skills from comma-separated string to array
      const skillsArray = data.skills.split(',').map(s => s.trim());
      const formData = { ...data, skills: skillsArray };
      
      const res = await apiRequest("POST", "/api/profile/service-provider", formData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile created",
        description: "Your service provider profile has been created successfully. It will be reviewed by an admin.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateServiceProviderMutation = useMutation({
    mutationFn: async (data: ServiceProviderFormValues) => {
      // Convert skills from comma-separated string to array if it's a string
      let formData = { ...data };
      if (typeof data.skills === 'string') {
        const skillsArray = data.skills.split(',').map(s => s.trim());
        formData = { ...data, skills: skillsArray };
      }
      
      const res = await apiRequest("PUT", "/api/profile/service-provider", formData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your service provider profile has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const res = await apiRequest("POST", "/api/profile/client", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile created",
        description: "Your client profile has been created successfully. It will be reviewed by an admin.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const updateClientMutation = useMutation({
    mutationFn: async (data: ClientFormValues) => {
      const res = await apiRequest("PUT", "/api/profile/client", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your client profile has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Create forms for each role
  const serviceProviderForm = useForm<ServiceProviderFormValues>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      fullName: "",
      location: "",
      phone: "",
      skills: "",
      experience: "",
      availability: "",
      bio: "",
    },
  });
  
  const clientForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      contactName: "",
      companyName: "",
      location: "",
      phone: "",
    },
  });
  
  // Populate form with existing data
  useEffect(() => {
    if (profileData && !formLoaded) {
      if (user?.role === 'service_provider' && profileData.profile) {
        // Convert skills array to comma-separated string for the form
        const skillsString = Array.isArray(profileData.profile.skills) 
          ? profileData.profile.skills.join(', ')
          : '';
          
        serviceProviderForm.reset({
          fullName: profileData.profile.fullName || "",
          location: profileData.profile.location || "",
          phone: profileData.profile.phone || "",
          skills: skillsString,
          experience: profileData.profile.experience || "",
          availability: profileData.profile.availability || "",
          bio: profileData.profile.bio || "",
        });
        setFormLoaded(true);
      } else if (user?.role === 'client' && profileData.profile) {
        clientForm.reset({
          contactName: profileData.profile.contactName || "",
          companyName: profileData.profile.companyName || "",
          location: profileData.profile.location || "",
          phone: profileData.profile.phone || "",
        });
        setFormLoaded(true);
      }
    }
  }, [profileData, formLoaded, user?.role, serviceProviderForm, clientForm]);
  
  const onServiceProviderSubmit = (data: ServiceProviderFormValues) => {
    if (profileData?.profile) {
      updateServiceProviderMutation.mutate(data);
    } else {
      createServiceProviderMutation.mutate(data);
    }
  };
  
  const onClientSubmit = (data: ClientFormValues) => {
    if (profileData?.profile) {
      updateClientMutation.mutate(data);
    } else {
      createClientMutation.mutate(data);
    }
  };
  
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Show appropriate form based on user role
  if (user?.role === 'service_provider') {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service Provider Profile</CardTitle>
              <CardDescription>
                Add your details to help clients find you
              </CardDescription>
            </div>
            {profileData?.profile && (
              <div>
                <Badge variant={
                  profileData.profile.verificationStatus === 'approved' ? 'success' :
                  profileData.profile.verificationStatus === 'rejected' ? 'destructive' :
                  'outline'
                }>
                  {profileData.profile.verificationStatus === 'approved' && <Check className="h-3 w-3 mr-1" />}
                  {profileData.profile.verificationStatus.charAt(0).toUpperCase() + profileData.profile.verificationStatus.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...serviceProviderForm}>
            <form
              onSubmit={serviceProviderForm.handleSubmit(onServiceProviderSubmit)}
              className="space-y-4"
            >
              <FormField
                control={serviceProviderForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={serviceProviderForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={serviceProviderForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={serviceProviderForm.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Network installation, CCTV repair, Computer troubleshooting" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your skills separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={serviceProviderForm.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="5 years experience in network installation..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={serviceProviderForm.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Weekdays 9am-5pm, Weekends on request" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={serviceProviderForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell clients about yourself and your expertise..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={
                  createServiceProviderMutation.isPending || 
                  updateServiceProviderMutation.isPending
                }
              >
                {(createServiceProviderMutation.isPending || updateServiceProviderMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : profileData?.profile ? "Update Profile" : "Create Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
        {profileData?.profile?.verificationStatus === 'pending' && (
          <CardFooter className="bg-yellow-50 border-t border-yellow-100 text-yellow-800 px-6 py-4">
            <p className="text-sm">
              Your profile is pending verification by an admin. You'll be notified once it's approved.
            </p>
          </CardFooter>
        )}
        {profileData?.profile?.verificationStatus === 'rejected' && (
          <CardFooter className="bg-red-50 border-t border-red-100 text-red-800 px-6 py-4">
            <p className="text-sm">
              Your profile was rejected. Please update your information and resubmit.
            </p>
          </CardFooter>
        )}
      </Card>
    );
  }
  
  if (user?.role === 'client') {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Profile</CardTitle>
              <CardDescription>
                Complete your profile to start posting gigs
              </CardDescription>
            </div>
            {profileData?.profile && (
              <div>
                <Badge variant={
                  profileData.profile.verificationStatus === 'approved' ? 'success' :
                  profileData.profile.verificationStatus === 'rejected' ? 'destructive' :
                  'outline'
                }>
                  {profileData.profile.verificationStatus === 'approved' && <Check className="h-3 w-3 mr-1" />}
                  {profileData.profile.verificationStatus.charAt(0).toUpperCase() + profileData.profile.verificationStatus.slice(1)}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...clientForm}>
            <form
              onSubmit={clientForm.handleSubmit(onClientSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={clientForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={clientForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={clientForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={
                  createClientMutation.isPending || 
                  updateClientMutation.isPending
                }
              >
                {(createClientMutation.isPending || updateClientMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : profileData?.profile ? "Update Profile" : "Create Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
        {profileData?.profile?.verificationStatus === 'pending' && (
          <CardFooter className="bg-yellow-50 border-t border-yellow-100 text-yellow-800 px-6 py-4">
            <p className="text-sm">
              Your profile is pending verification by an admin. You'll be notified once it's approved.
            </p>
          </CardFooter>
        )}
        {profileData?.profile?.verificationStatus === 'rejected' && (
          <CardFooter className="bg-red-50 border-t border-red-100 text-red-800 px-6 py-4">
            <p className="text-sm">
              Your profile was rejected. Please update your information and resubmit.
            </p>
          </CardFooter>
        )}
      </Card>
    );
  }
  
  // Admin doesn't need a profile
  if (user?.role === 'admin') {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Account</CardTitle>
          <CardDescription>
            As an admin, you have access to the dashboard to manage users and gigs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Account Information</h3>
              <Separator className="my-2" />
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Username</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
}
