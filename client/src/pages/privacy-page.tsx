import AppShell from "@/components/layout/app-shell";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <AppShell>
      <PageContainer title="Privacy Policy" description="">
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Last Updated: March 1, 2025
          </p>

          <p className="mb-4">
            CloudSec Tech, Inc. ("CloudSec Tech", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by CloudSec Tech when you use our website and platform (the "Service").
          </p>

          <p className="mb-8">
            By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Information You Provide to Us</h3>

          <p className="mb-4">
            We collect information you provide directly to us when you:
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li>Create an account or user profile</li>
            <li>Fill out forms or fields on the Service</li>
            <li>Participate in surveys</li>
            <li>Post gigs or apply for gigs</li>
            <li>Communicate with us or other users through the platform</li>
            <li>Provide verification documents</li>
            <li>Make payments or receive payments through the Service</li>
          </ul>

          <p className="mb-4">
            The types of information we may collect include:
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li>Personal identifiers (name, email address, phone number, postal address)</li>
            <li>Professional or employment-related information</li>
            <li>Education information</li>
            <li>Financial information (payment details, bank account information)</li>
            <li>Government-issued identification (for verification purposes)</li>
            <li>Profile information (skills, experience, profile photos)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Information We Collect Automatically</h3>

          <p className="mb-4">
            When you access or use our Service, we automatically collect certain information, including:
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li>Log Information: Information about your interactions with our Service, including the pages or content you view, the dates and times of your visits, and the time spent on each page.</li>
            <li>Device Information: Information about the computer or mobile device you use to access our Service, including hardware model, operating system and version, unique device identifiers, and mobile network information.</li>
            <li>Location Information: With your consent, we may collect information about your precise location using methods that include GPS, wireless networks, cell towers, and Wi-Fi access points.</li>
            <li>Cookies and Similar Technologies: We use cookies and similar technologies to collect information about your browsing behavior and preferences.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>

          <p className="mb-4">
            We use the information we collect to:
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li>Provide, maintain, and improve our Service</li>
            <li>Process and complete transactions, and send related information including confirmations and invoices</li>
            <li>Verify the identity of service providers and clients</li>
            <li>Match clients with appropriate service providers through our allocation system</li>
            <li>Send technical notices, updates, security alerts, and support and administrative messages</li>
            <li>Respond to user comments, questions, and requests, and provide customer service</li>
            <li>Communicate with you about products, services, offers, promotions, and events offered by CloudSec Tech and others</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of CloudSec Tech and others</li>
            <li>Personalize and improve the Service and provide content or features that match user profiles or interests</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Sharing of Information</h2>

          <p className="mb-4">
            We may share personal information as follows:
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li>With other users of the Service in accordance with the functionality of the Service (e.g., when clients and service providers are matched for gigs)</li>
            <li>With third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
            <li>If we believe your actions are inconsistent with the spirit or language of our user agreements or policies, or to protect the rights, property, and safety of CloudSec Tech or others</li>
            <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company</li>
            <li>With your consent or at your direction, including if we notify you through our Service that the information you provide will be shared in a particular manner and you provide such information</li>
          </ul>

          <p className="mb-4">
            We may also share aggregated or de-identified information, which cannot reasonably be used to identify you.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Retention</h2>

          <p className="mb-4">
            We store the information we collect about you for as long as is necessary for the purpose(s) for which we originally collected it. We may retain certain information for legitimate business purposes or as required by law.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Security</h2>

          <p className="mb-4">
            CloudSec Tech takes reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Choices</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">Account Information</h3>

          <p className="mb-4">
            You may update, correct or delete information about you at any time by logging into your online account or emailing us at privacy@cloudsectech.com. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Cookies</h3>

          <p className="mb-4">
            Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Service.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Promotional Communications</h3>

          <p className="mb-4">
            You may opt out of receiving promotional emails from CloudSec Tech by following the instructions in those emails. If you opt out, we may still send you non-promotional emails, such as those about your account or our ongoing business relations.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Children's Privacy</h2>

          <p className="mb-4">
            CloudSec Tech does not knowingly collect or solicit any information from anyone under the age of 13. In the event that we learn that we have collected personal information from a child under age 13, we will delete that information as quickly as possible. If you believe that we might have any information from or about a child under 13, please contact us at privacy@cloudsectech.com.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to This Privacy Policy</h2>

          <p className="mb-4">
            CloudSec Tech may modify or update this Privacy Policy from time to time, so you should review this page periodically. When we change the policy in a material manner, we will update the 'last updated' date at the top of this page and notify you that material changes have been made to the Privacy Policy.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Us</h2>

          <p className="mb-8">
            If you have any questions about this Privacy Policy, please contact us at privacy@cloudsectech.com.
          </p>

          <div className="flex justify-center mt-12">
            <Button asChild variant="outline">
              <Link href="/terms">
                <a>View Terms of Service</a>
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}