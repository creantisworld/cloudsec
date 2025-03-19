import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <AppShell>
      <PageContainer title="How CloudSec Tech Works" description="We connect businesses and individuals with skilled IT professionals through a simple and secure process.">
        {/* Main process steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Create Your Account</h3>
            <p className="text-gray-600 mb-4">
              Sign up as a client seeking IT services or as a service provider offering your expertise. Complete your profile with all necessary details.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Quick registration process</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Profile verification for security</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Detailed profile customization</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Post or Find Gigs</h3>
            <p className="text-gray-600 mb-4">
              Clients can post detailed gig requirements, while service providers can browse available opportunities that match their skills.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Detailed gig descriptions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Budget and timeline specifications</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Smart matching based on skills and location</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Complete the Project</h3>
            <p className="text-gray-600 mb-4">
              After the admin allocates a service provider, the work begins. Communication, progress tracking, and payment are all managed securely through the platform.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Admin-verified allocations</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Status updates and milestone tracking</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">Ratings and feedback after completion</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed workflow diagram */}
        <div className="bg-gray-50 p-8 rounded-xl mb-16">
          <h2 className="text-2xl font-bold mb-12 text-center">The Complete Process Flow</h2>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line connecting all points - adjusted position and style */}
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-primary/20 hidden md:block"></div>

            {/* Step items with improved spacing and alignment */}
            <div className="space-y-16">
              {/* Each step with consistent structure and improved spacing */}
              <div className="relative flex items-start">
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hidden md:flex">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <div className="md:ml-24 flex-1">
                  <h3 className="text-xl font-semibold mb-3">Registration & Profile Setup</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Create an account and complete your profile with all necessary details including skills, experience, and location preferences. All profiles are verified by our administrative team for security.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hidden md:flex">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <div className="md:ml-24 flex-1">
                  <h3 className="text-xl font-semibold mb-3">Posting or Finding Gigs</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Clients can post detailed tech service requirements with specific needs, budgets, and timelines. Service providers can browse available gigs that match their expertise and location preferences.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hidden md:flex">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <div className="md:ml-24 flex-1">
                  <h3 className="text-xl font-semibold mb-3">Admin Allocation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our admin team matches the right service provider to each job based on skills, ratings, and availability. This ensures quality control and the best possible match for each project.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hidden md:flex">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <div className="md:ml-24 flex-1">
                  <h3 className="text-xl font-semibold mb-3">Project Execution</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The service provider completes the specified work, updating the status as they progress through different stages: allocated, in-progress, and completed.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="absolute left-0 top-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hidden md:flex">
                  <span className="text-2xl font-bold text-primary">5</span>
                </div>
                <div className="md:ml-24 flex-1">
                  <h3 className="text-xl font-semibold mb-3">Project Completion & Feedback</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Once work is complete, clients can rate and review the service provider. This helps maintain high quality standards and helps other clients make informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Why Choose CloudSec Tech?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">For Clients</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Access to verified, skilled IT professionals</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Quality assurance through admin allocation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Transparent pricing with no hidden fees</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Secure payment processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Detailed service provider profiles and ratings</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">For Service Providers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Steady stream of qualified gig opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Platform handles client acquisition and billing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Build a reputation with ratings and reviews</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Focus on your expertise while we handle the business side</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Opportunities to work with a variety of clients</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white p-8 md:p-12 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join our growing community of tech professionals and businesses seeking IT services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth">
                <a>Create an Account</a>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10">
              <Link href="/gigs">
                <a>Browse Services <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}