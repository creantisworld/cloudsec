import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import AppShell from "@/components/layout/app-shell";
import { Briefcase, Cpu, Users, Shield, CheckCircle } from "lucide-react";
import Logo from "@/components/logo";

export default function HomePage() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isServiceProvider = user?.role === 'service_provider';

  return (
    <AppShell>
      <div className="container max-w-7xl mx-auto py-6">
        <div className="flex flex-col gap-8">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Welcome to CloudSec Tech Platform
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  {isAdmin && "Manage service providers, clients, and gigs from your admin dashboard."}
                  {isClient && "Find skilled tech professionals for your technology needs."}
                  {isServiceProvider && "Connect with clients looking for your technical expertise."}
                  {!user && "Connect with trusted technology service providers for all your IT needs."}
                </p>
                <div className="flex flex-wrap gap-3">
                  {isAdmin && (
                    <Button asChild size="lg">
                      <Link href="/dashboard">
                        <a>Go to Dashboard</a>
                      </Link>
                    </Button>
                  )}
                  {isClient && (
                    <>
                      <Button asChild size="lg">
                        <Link href="/gigs">
                          <a>View Gigs</a>
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/providers">
                          <a>Find Providers</a>
                        </Link>
                      </Button>
                    </>
                  )}
                  {isServiceProvider && (
                    <Button asChild size="lg">
                      <Link href="/gigs">
                        <a>View Available Gigs</a>
                      </Link>
                    </Button>
                  )}
                  {!user && (
                    <Button asChild size="lg">
                      <Link href="/auth">
                        <a>Get Started</a>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-72 h-72">
                  <div className="absolute inset-0 bg-blue-100 rounded-full opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                    <img 
                      src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                      alt="IT professional working" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Trending Gigs Section */}
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">Trending Gigs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="h-40 bg-blue-50 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1563770557317-60435e78b6d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
                    alt="Network setup" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Popular
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Network Installation</h3>
                    <span className="text-sm text-primary font-medium">$500</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Complete office network setup with high-speed connectivity for a small business in Chicago.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Posted 2 days ago</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="h-40 bg-blue-50 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573148195900-7845dcb9b127?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Security camera installation" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">CCTV System Repair</h3>
                    <span className="text-sm text-primary font-medium">$300</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Fix existing security camera system for a retail store in New York. Need immediate assistance.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Posted 3 days ago</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="h-40 bg-blue-50 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="IT consulting" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    New
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Network Troubleshooting</h3>
                    <span className="text-sm text-primary font-medium">$400</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Diagnose and fix network connectivity issues at a law firm in Los Angeles. Urgent requirement.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Posted 1 day ago</span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <Link href="/gigs">
                  <a>View All Gigs</a>
                </Link>
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-center mb-10">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Tech Services</h3>
                <p className="text-gray-600">Access a wide range of technical services from qualified professionals.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Verified Providers</h3>
                <p className="text-gray-600">All service providers are vetted and verified for quality assurance.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Flexible Gigs</h3>
                <p className="text-gray-600">Post gigs with custom requirements, schedules, and locations.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
                <p className="text-gray-600">Your data is always secure with our enterprise-grade security protocols.</p>
              </div>
            </div>
          </section>

          {/* About Platform Section */}
          <section className="py-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">About CloudSec Tech Platform</h2>
                  <p className="text-gray-700 mb-4">
                    CloudSec Tech is an innovative platform connecting skilled IT professionals with businesses and individuals in need of technical services. Our mission is to simplify the process of finding and hiring quality tech experts for your specific needs.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Whether you're looking for network installation, computer repairs, cybersecurity consultations, or any other IT service, our platform helps you find the right expert quickly and efficiently.
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Trusted by 500+ clients nationwide</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Over 1,000 verified service providers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>95% satisfaction rate from completed gigs</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Tech professionals meeting" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-blue-50 border-2 border-primary w-12 h-12 flex items-center justify-center text-xl font-bold text-primary">1</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Create Your Profile</h3>
                <p className="text-gray-600">Sign up and complete your profile with your skills or requirements.</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-blue-50 border-2 border-primary w-12 h-12 flex items-center justify-center text-xl font-bold text-primary">2</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Post or Find Gigs</h3>
                <p className="text-gray-600">Clients post gigs, and admins allocate service providers to fulfill them.</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-blue-50 border-2 border-primary w-12 h-12 flex items-center justify-center text-xl font-bold text-primary">3</div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Complete & Rate</h3>
                <p className="text-gray-600">After completion, clients can rate the service quality to help others.</p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-8">
            <h2 className="text-2xl font-bold mb-6">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold">JD</div>
                  <div className="ml-3">
                    <h3 className="font-semibold">John Davis</h3>
                    <p className="text-xs text-gray-500">CEO, TechStart</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "CloudSec Tech has revolutionized how we find IT professionals. The verification process ensures we only work with qualified technicians."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 15.585L3.626 19.19l1.218-7.113L.344 7.629l7.126-1.035L10 0l2.53 6.594 7.126 1.035-4.5 4.448 1.218 7.113z" clipRule="evenodd"></path>
                    </svg>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold">AR</div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Amanda Rodriguez</h3>
                    <p className="text-xs text-gray-500">Small Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "I found a fantastic network specialist through CloudSec Tech who fixed our connectivity issues in hours. The platform is intuitive and the service providers are top-notch."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 15.585L3.626 19.19l1.218-7.113L.344 7.629l7.126-1.035L10 0l2.53 6.594 7.126 1.035-4.5 4.448 1.218 7.113z" clipRule="evenodd"></path>
                    </svg>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold">MT</div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Mike Thompson</h3>
                    <p className="text-xs text-gray-500">IT Consultant</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "As a service provider, CloudSec Tech has been a reliable source of clients. The platform handles all the administrative work so I can focus on what I do best - solving tech problems."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star, idx) => (
                    <svg key={star} className={`w-4 h-4 ${idx < 4 ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 15.585L3.626 19.19l1.218-7.113L.344 7.629l7.126-1.035L10 0l2.53 6.594 7.126 1.035-4.5 4.448 1.218 7.113z" clipRule="evenodd"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-white rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Join our growing community of tech professionals and businesses seeking IT services.
            </p>
            {user ? (
              <Button asChild size="lg" variant="secondary">
                <Link href={isClient ? "/gigs/new" : (isServiceProvider ? "/profile" : "/dashboard")}>
                  <a>
                    {isClient && "Post a Gig"}
                    {isServiceProvider && "Complete Your Profile"}
                    {isAdmin && "View Dashboard"}
                  </a>
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth">
                  <a>
                    Create an Account
                  </a>
                </Link>
              </Button>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}