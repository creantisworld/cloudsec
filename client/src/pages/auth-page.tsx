import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AuthForms } from "@/components/auth/auth-forms";
import Logo from "@/components/logo";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col lg:flex-row">
      {/* Hero Section */}
      <div className="lg:w-1/2 bg-primary text-white p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <Logo showText={true} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">
            On-Demand Tech Services Platform
          </h1>
          <p className="text-lg mb-8 opacity-90">
            CloudSec Tech connects skilled IT professionals with businesses and individuals seeking technical services. Find the right experts for your tech needs or offer your services to clients.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start">
              <div className="rounded-full bg-white/10 p-2 mr-3 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Verified Technicians</h3>
                <p className="text-sm opacity-80">All service providers are verified by our admin team</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-white/10 p-2 mr-3 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Transparent Ratings</h3>
                <p className="text-sm opacity-80">Real client reviews and ratings for all providers</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-white/10 p-2 mr-3 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Custom Gigs</h3>
                <p className="text-sm opacity-80">Post customized tech service requests</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-full bg-white/10 p-2 mr-3 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Real-time Updates</h3>
                <p className="text-sm opacity-80">Get notifications on gig progress</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <p className="italic text-sm">
              "CloudSec Tech has revolutionized how we find IT professionals. The verification process ensures we only work with qualified technicians."
            </p>
            <p className="text-sm font-medium mt-2">— Sarah Johnson, CTO at TechStart</p>
          </div>
        </div>
      </div>
      
      {/* Auth Forms Section */}
      <div className="lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <AuthForms />
        </div>
      </div>
    </div>
  );
}
