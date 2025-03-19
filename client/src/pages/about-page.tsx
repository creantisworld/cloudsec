import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Users, Globe, Award, ChevronRight } from "lucide-react";

export default function AboutPage() {
  return (
    <AppShell>
      <PageContainer title="About CloudSec Tech" description="We're on a mission to connect the world with trusted IT service professionals.">
        {/* Main content with image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              CloudSec Tech was founded in 2023 with a simple yet powerful idea: make it easier for businesses and individuals to find reliable IT professionals for their technology needs.
            </p>
            <p className="text-gray-700 mb-4">
              Born out of frustration with the existing IT service marketplace, our founders set out to create a platform that prioritizes security, verification, and seamless experiences. We recognized that technology problems require specialized expertise, and finding the right professional shouldn't be a challenge.
            </p>
            <p className="text-gray-700 mb-6">
              Today, CloudSec Tech has grown into a thriving community of skilled service providers and satisfied clients, with thousands of successfully completed gigs across various IT specialties.
            </p>
            <Button asChild>
              <Link href="/contact">
                <a>Get in Touch <ChevronRight className="ml-1 h-4 w-4" /></a>
              </Link>
            </Button>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
              alt="Team meeting" 
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-primary/5 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              To create a trusted ecosystem where businesses and individuals can easily connect with verified IT professionals, ensuring secure, efficient, and high-quality technology services for everyone.
            </p>
          </div>
          <div className="bg-primary/5 p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To become the world's leading platform for IT service connections, setting the global standard for trust, quality, and innovation in the technology service marketplace.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Security</h3>
              <p className="text-gray-600">
                We put security and privacy first in everything we do, from verifying identities to protecting sensitive information.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                We foster a supportive community where professionals can grow and clients can find trusted expertise.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We maintain high standards for service providers and constantly seek to improve the platform experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We embrace technological innovation to create better ways for people to connect and solve IT challenges.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Meet Our Leadership Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                  alt="CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
                <p className="text-primary font-medium mb-2">Chief Executive Officer</p>
                <p className="text-gray-600 text-sm">
                  Former CTO of a Fortune 500 tech company with 15+ years of experience in cybersecurity and IT infrastructure.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                  alt="CTO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
                <p className="text-primary font-medium mb-2">Chief Technology Officer</p>
                <p className="text-gray-600 text-sm">
                  Cloud architecture specialist with a background in developing secure fintech platforms and marketplace solutions.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-64 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="COO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">David Rodriguez</h3>
                <p className="text-primary font-medium mb-2">Chief Operations Officer</p>
                <p className="text-gray-600 text-sm">
                  Former operations leader at a major tech consultancy with expertise in scaling marketplace businesses globally.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">CloudSec Tech By the Numbers</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">1,200+</p>
              <p className="text-gray-600">Verified Providers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">5,000+</p>
              <p className="text-gray-600">Completed Gigs</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">15+</p>
              <p className="text-gray-600">Service Categories</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">98%</p>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white p-8 md:p-12 rounded-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the CloudSec Tech Community</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Whether you're looking for IT services or want to offer your expertise, CloudSec Tech is the platform for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth">
                <a>Get Started Today</a>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10">
              <Link href="/contact">
                <a>Contact Our Team</a>
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}