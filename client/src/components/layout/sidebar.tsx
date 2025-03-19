import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Settings, 
  User,
  Home,
  Wrench
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const isActive = (path: string) => {
    return location === path;
  };

  const isAdmin = user.role === 'admin';
  const isClient = user.role === 'client';
  const isServiceProvider = user.role === 'service_provider';

  return (
    <div className="hidden md:flex h-full w-64 flex-col border-r bg-sidebar pt-5">
      <div className="flex flex-col gap-1 px-2">
        <div className="pl-4 mb-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            {isAdmin ? 'Admin' : (isClient ? 'Client' : 'Service Provider')}
          </h2>
          <p className="text-sm text-sidebar-foreground opacity-70">
            {user.email}
          </p>
        </div>

        <Link href="/">
          <a className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive("/") 
              ? "bg-sidebar-accent text-sidebar-accent-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}>
            <Home className="h-4 w-4" />
            Home
          </a>
        </Link>

        {isAdmin && (
          <Link href="/dashboard">
            <a className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/dashboard") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </a>
          </Link>
        )}

        {(isClient || isServiceProvider) && (
          <Link href="/profile">
            <a className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/profile") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}>
              <User className="h-4 w-4" />
              Profile
            </a>
          </Link>
        )}

        <Link href="/gigs">
          <a className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive("/gigs") || location.startsWith("/gigs/") 
              ? "bg-sidebar-accent text-sidebar-accent-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}>
            <Briefcase className="h-4 w-4" />
            Gigs
          </a>
        </Link>

        <Link href="/providers">
          <a className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive("/providers") || location.startsWith("/providers/")
              ? "bg-sidebar-accent text-sidebar-accent-foreground" 
              : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
          )}>
            <Users className="h-4 w-4" />
            Service Providers
          </a>
        </Link>

        {isAdmin && (
          <Link href="/settings">
            <a className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/settings") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}>
              <Settings className="h-4 w-4" />
              Settings
            </a>
          </Link>
        )}
      </div>

      {isServiceProvider && (
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="rounded-md bg-sidebar-accent/20 p-3">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-sidebar-foreground" />
              <div>
                <h4 className="text-sm font-medium text-sidebar-foreground">Available for Gigs</h4>
                <p className="text-xs text-sidebar-foreground opacity-70">Check your assigned gigs</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}