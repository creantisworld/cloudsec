import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import DashboardPage from "@/pages/dashboard-page";
import GigsPage from "@/pages/gigs-page";
import ProvidersPage from "@/pages/providers-page";
import GigDetailsPage from "@/pages/gig-details-page";
import ProviderDetailsPage from "@/pages/provider-details-page";
import MainLandingPage from "@/pages/main-landing-page";
import HowItWorksPage from "@/pages/how-it-works-page";
import AboutPage from "@/pages/about-page";
import ContactPage from "@/pages/contact-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import SuperAdminDashboard from "@/pages/super-admin-dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import ClientDashboard from "@/pages/client-dashboard";
import CreateGigPage from "@/pages/create-gig-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainLandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <ProtectedRoute path="/home" component={HomePage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/client/dashboard" component={ClientDashboard} />
      <ProtectedRoute path="/client/gigs/new" component={CreateGigPage} />
      <ProtectedRoute path="/super-admin" component={SuperAdminDashboard} />
      <ProtectedRoute path="/gigs" component={GigsPage} />
      <ProtectedRoute path="/providers" component={ProvidersPage} />
      <ProtectedRoute path="/gigs/:id" component={GigDetailsPage} />
      <ProtectedRoute path="/providers/:id" component={ProviderDetailsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;