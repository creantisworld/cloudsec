import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import AppShell from "@/components/layout/app-shell";
import { ProfileForm } from "@/components/profile/profile-form";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // If user is admin, redirect to dashboard
  useEffect(() => {
    if (user?.role === 'admin') {
      toast({
        title: "Admin Profile",
        description: "Admins don't need to set up profiles. Redirecting to dashboard.",
      });
      navigate("/dashboard");
    }
  }, [user, navigate, toast]);
  
  return (
    <AppShell>
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              {user?.role === 'service_provider' && "Set up your service provider profile to be visible to clients."}
              {user?.role === 'client' && "Complete your client profile to start posting gigs."}
            </p>
          </div>
          
          <ProfileForm />
        </div>
      </div>
    </AppShell>
  );
}
