import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <AppShell>
      <PageContainer title="Terms of Service" description="">
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Last Updated: March 1, 2025
          </p>

          <p className="mb-4">
            Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the CloudSec Tech website and platform (the "Service") operated by CloudSec Tech, Inc. ("us", "we", or "our").
          </p>

          <p className="mb-4">
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <p className="mb-8">
            By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Accounts</h2>

          <p className="mb-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>

          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
          </p>

          <p className="mb-4">
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Service Provider Verification</h2>

          <p className="mb-4">
            All service providers on the CloudSec Tech platform must undergo a verification process. This may include background checks, skill verification, and identity verification. By using our Service as a service provider, you consent to these verification procedures.
          </p>

          <p className="mb-4">
            CloudSec Tech reserves the right to deny or revoke verification status at any time if we determine that a service provider has provided false information or has violated our Terms of Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Gig Allocation</h2>

          <p className="mb-4">
            CloudSec Tech uses an admin-based allocation system to match service providers with client gigs. By using our Service, you agree to accept the allocations made by our administrative team.
          </p>

          <p className="mb-4">
            Service providers agree to accept or decline gig allocations within the timeframe specified in the allocation notification. Repeated declination of allocations may affect a service provider's status on the platform.
          </p>

          <p className="mb-4">
            Clients agree to provide accurate and complete information about their gig requirements to facilitate proper allocation.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Payment Terms</h2>

          <p className="mb-4">
            CloudSec Tech facilitates payment processing between clients and service providers. Service providers agree to the fee structure outlined during registration, which may include platform fees deducted from gig payments.
          </p>

          <p className="mb-4">
            Clients agree to make payments for completed gigs within the timeframe specified in the gig agreement. Late payments may result in additional fees.
          </p>

          <p className="mb-4">
            All payment disputes must be submitted to CloudSec Tech within 14 days of the gig completion date.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Content</h2>

          <p className="mb-4">
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>

          <p className="mb-4">
            By posting Content on or through the Service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Termination</h2>

          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <p className="mb-4">
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Limitation of Liability</h2>

          <p className="mb-4">
            In no event shall CloudSec Tech, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes</h2>

          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <p className="mb-4">
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Us</h2>

          <p className="mb-8">
            If you have any questions about these Terms, please contact us at legal@cloudsectech.com.
          </p>

          <div className="flex justify-center mt-12">
            <Button asChild variant="outline">
              <Link href="/privacy">
                <a>View Privacy Policy</a>
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}