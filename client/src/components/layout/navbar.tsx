import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Menu, User, Shield } from "lucide-react";
import Logo from "@/components/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user?.username || "User";
  };

  return (
    <header className="border-b bg-background sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:w-72">
              <div className="flex flex-col gap-6 py-4">
                <Logo showText={true} />
                <nav className="flex flex-col gap-1">
                  <Link href="/">
                    <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Home</a>
                  </Link>
                  <Link href="/how-it-works">
                    <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">How It Works</a>
                  </Link>
                  <Link href="/about">
                    <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">About Us</a>
                  </Link>
                  <Link href="/contact">
                    <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Contact</a>
                  </Link>
                  {user?.role === 'super_admin' && (
                    <Link href="/super-admin">
                      <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                        <Shield className="h-4 w-4" />
                        Super Admin
                      </a>
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link href="/dashboard">
                      <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Dashboard</a>
                    </Link>
                  )}
                  {(user?.role === 'client' || user?.role === 'service_provider') && (
                    <Link href="/profile">
                      <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Profile</a>
                    </Link>
                  )}
                  {user && (
                    <Link href="/gigs">
                      <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Gigs</a>
                    </Link>
                  )}
                  {user && (
                    <Link href="/providers">
                      <a className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Providers</a>
                    </Link>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/">
            <a className="flex items-center gap-2">
              <Logo />
              <span className="hidden md:inline font-semibold text-lg">CloudSec Tech</span>
            </a>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/how-it-works">
              <a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">How It Works</a>
            </Link>
            <Link href="/about">
              <a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">About Us</a>
            </Link>
            <Link href="/contact">
              <a className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent">Contact</a>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(getUserDisplayName())}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{getUserDisplayName()}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-muted-foreground">{user.role}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === 'super_admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/super-admin">
                      <a className="flex w-full cursor-pointer items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Super Admin Dashboard
                      </a>
                    </Link>
                  </DropdownMenuItem>
                )}
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <a className="flex w-full cursor-pointer items-center">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </a>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <a className="flex w-full cursor-pointer items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default">
              <Link href="/auth">
                <a>Login / Register</a>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}