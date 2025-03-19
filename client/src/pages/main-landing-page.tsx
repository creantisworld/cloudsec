import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/logo";
import {
  Search,
  Network,
  Server,
  Shield,
  Cpu,
  Phone,
  Cloud,
  Database,
  Wifi,
  ArrowRight,
  Star,
  CheckCircle,
  ChevronRight,
  Mail,
  MapPin,
  Users
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Footer from "@/components/layout/footer";  // Ensure Footer is imported

export default function MainLandingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-4 px-4 lg:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Logo showText={true} />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="/how-it-works">
                <a className="text-gray-600 hover:text-primary text-sm font-medium">How It Works</a>
              </Link>
              <Link href="/gigs">
                <a className="text-gray-600 hover:text-primary text-sm font-medium">Find Services</a>
              </Link>
              <Link href="/providers">
                <a className="text-gray-600 hover:text-primary text-sm font-medium">Service Providers</a>
              </Link>
              <Link href="/about">
                <a className="text-gray-600 hover:text-primary text-sm font-medium">About Us</a>
              </Link>
            </nav>

            <div className="flex items-center space-x-3">
              {user ? (
                <Button asChild size="sm">
                  <Link href="/home">
                    <a>Dashboard</a>
                  </Link>
                </Button>
              ) : (
                <>
                  <Button variant="outline" asChild size="sm">
                    <Link href="/auth">
                      <a>Log In</a>
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/auth">
                      <a>Sign Up</a>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button - would add a mobile menu implementation */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with updated background image and overlay */}
        <section className="relative pt-16 pb-32 md:py-24 lg:py-32">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg"
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/60"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Discover
                <br />
                <span className="text-primary-100">your amazing tech solution</span>
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Find expert service for all your IT needs, online or on-site from trusted tech experts
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-5">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center">
                        <Search className="h-5 w-5 text-gray-400" />
                      </span>
                      <Input
                        type="text"
                        placeholder="What service do you need?"
                        className="pl-10 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-5">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-3 flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </span>
                      <Input
                        type="text"
                        placeholder="Your location"
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full">
                      Search
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {/* Service Categories */}
            <div className="pt-12">
              <div className="text-center mb-8">
                <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                  Browse Categories
                </h3>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2 md:gap-3 max-w-4xl mx-auto">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Network className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white">Networking</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Server className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white">Servers</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Shield className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white">Security</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-full shadow-sm flex items-center justify-center mb-2 hover:bg-primary-dark transition-colors cursor-pointer">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white">Hardware</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Cloud className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white">Cloud</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Database className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white">Data</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Wifi className="h-6 w-6" />
                  </div>
                  <span className="text-xs text-white">Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">
              See How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="relative mb-6 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-primary font-semibold">1</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Choose What To Fix</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Tell us what tech issue you need help with. From network problems to hardware repairs,
                  CloudSec has expert services for all your needs.
                </p>
              </div>
              <div className="text-center">
                <div className="relative mb-6 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-primary font-semibold">2</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Find What You Need</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Browse trusted tech professionals with verified skills and excellent reviews. Filter by location,
                  service type, and availability to find the perfect match.
                </p>
              </div>
              <div className="text-center">
                <div className="relative mb-6 flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-primary font-semibold">3</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Explore Amazing Places</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Get reliable service right when you need it. Our platform connects you with experts who can visit your
                  location or provide remote technical support promptly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured <span className="text-gray-500">Services</span></h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Service Cards */}
              <Card className="overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
                    alt="Networking services"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Network Installation</h3>
                    <div className="flex items-center text-yellow-500 text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1">4.9</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Professional network setup for businesses of all sizes.
                  </p>
                  <div className="text-xs text-gray-400">Starting from $299</div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Security services"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Security Assessment</h3>
                    <div className="flex items-center text-yellow-500 text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Comprehensive security evaluation and recommendations.
                  </p>
                  <div className="text-xs text-gray-400">Starting from $499</div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Cloud services"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Cloud Migration</h3>
                    <div className="flex items-center text-yellow-500 text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1">4.7</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    Seamless migration to cloud infrastructure solutions.
                  </p>
                  <div className="text-xs text-gray-400">Starting from $899</div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80"
                    alt="IT support"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Remote IT Support</h3>
                    <div className="flex items-center text-yellow-500 text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="ml-1">4.9</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    24/7 IT support and troubleshooting for businesses.
                  </p>
                  <div className="text-xs text-gray-400">Starting from $199/mo</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Directory Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Our <span className="text-gray-500">Directory</span></h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex overflow-x-auto pb-4 mb-6 gap-4">
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">All Categories</Button>
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Network Security</Button>
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Cloud Services</Button>
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Hardware Repair</Button>
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">Software Dev</Button>
              <Button variant="outline" size="sm" className="rounded-full whitespace-nowrap">IT Consulting</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Service Provider Cards */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200 relative">
                    <img
                      src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      alt="Network Solutions"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Network Solutions Pro</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Enterprise networking and security solutions for businesses of all sizes.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-gray-600">5.0</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>108 clients</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200 relative">
                    <img
                      src="https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      alt="Cloud Tech"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2">
                      <Cloud className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Cloud Tech Solutions</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Expert cloud migration, management, and optimization services.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current opacity-30" />
                        <span className="ml-1 text-gray-600">4.8</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>92 clients</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-32 bg-gray-200 relative">
                    <img
                      src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                      alt="Hardware Specialists"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white rounded-full p-2">
                      <Cpu className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Tech Repair Masters</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      On-site and remote hardware diagnostics, repair, and installation.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-500 text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-gray-600">5.0</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>76 clients</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/providers">
                  <a>View All Service Providers</a>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Client Reviews Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Clients <span className="text-gray-500">Review</span></h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex mb-4">
                  <div className="rounded-full bg-gray-200 w-12 h-12 overflow-hidden mr-4">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      alt="Kevin Miller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Kevin Miller</h3>
                    <p className="text-xs text-gray-500">CTO at TechCorp</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 mb-4">
                  <span className="text-4xl text-primary leading-none">"</span>
                  <p className="inline">CloudSec Tech has been instrumental in upgrading our company's security infrastructure. Their team provided expertise that was beyond our expectations, implementing solutions that address our unique needs.</p>
                </blockquote>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex mb-4">
                  <div className="rounded-full bg-gray-200 w-12 h-12 overflow-hidden mr-4">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Isabella Turner</h3>
                    <p className="text-xs text-gray-500">Small Business Owner</p>
                  </div>
                </div>
                <blockquote className="text-gray-600 mb-4">
                  <span className="text-4xl text-primary leading-none">"</span>
                  <p className="inline">Finding reliable IT support was challenging until I discovered CloudSec Tech. Their service providers are professional, punctual, and solved our network issues that had been plaguing our business for months.</p>
                </blockquote>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Tips & Articles Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Some <span className="text-gray-500">Tips & Articles</span></h2>              <Button variant="link" size="sm" className="text-primary">
                See All Articles <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Cybersecurity article"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Top 5 Cybersecurity Tips for Small Businesses</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Essential security practices every small business should implement to protect their data.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>June 15, 2025</span>
                    <span>5 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1115&q=80"
                    alt="Cloud migration article"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Cloud Migration: What You Need to Know Before You Start</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Key considerations and best practices for a successful cloud migration strategy.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>May 28, 2025</span>
                    <span>7 min read</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                    alt="Remote work article"
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">How to Set Up a Secure Remote Work Environment</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Security tips and best practices for companies embracing remote work policies.
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>May 12, 2025</span>
                    <span>6 min read</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Join Our Newsletter</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Stay updated with the latest tech security trends, gig opportunities, and platform features.
              </p>
              <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder="Enter your email" type="email" />
                <Button type="submit">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} CloudSec Tech. All rights reserved.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}