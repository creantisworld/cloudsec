import { GigWithDetails, UserWithProfile } from "@shared/schema";

// Mock email service since we can't actually send emails in this environment
export async function sendAllocationEmail(
  gig: GigWithDetails,
  client: UserWithProfile,
  provider: UserWithProfile
): Promise<void> {
  // In a real application, you would use nodemailer or another email service
  console.log(`[EMAIL SERVICE] Sending allocation notification for gig: ${gig.title}`);
  
  // Provider email
  console.log(`[EMAIL SERVICE] To: ${provider.email}`);
  console.log(`[EMAIL SERVICE] Subject: You've been allocated to a new gig`);
  console.log(`[EMAIL SERVICE] Body: 
    Hello ${provider.serviceProviderProfile?.fullName || provider.username},
    
    You have been allocated to a new gig: "${gig.title}"
    
    Gig Details:
    - Description: ${gig.description}
    - Location: ${gig.location.name}
    - Start Date: ${gig.startDate.toLocaleDateString()}
    - End Date: ${gig.endDate.toLocaleDateString()}
    - Client: ${client.clientProfile?.companyName || client.clientProfile?.contactName || client.username}
    
    Please log in to your account to accept this gig and contact the client.
    
    Best regards,
    CloudSec Tech Gig Platform
  `);
  
  // Client email
  console.log(`[EMAIL SERVICE] To: ${client.email}`);
  console.log(`[EMAIL SERVICE] Subject: Service Provider Allocated to Your Gig`);
  console.log(`[EMAIL SERVICE] Body: 
    Hello ${client.clientProfile?.contactName || client.username},
    
    A service provider has been allocated to your gig: "${gig.title}"
    
    Service Provider:
    - Name: ${provider.serviceProviderProfile?.fullName || provider.username}
    - Skills: ${provider.serviceProviderProfile?.skills?.join(', ')}
    
    Gig Details:
    - Description: ${gig.description}
    - Location: ${gig.location.name}
    - Start Date: ${gig.startDate.toLocaleDateString()}
    - End Date: ${gig.endDate.toLocaleDateString()}
    
    Please log in to your account to view the service provider's details and contact them.
    
    Best regards,
    CloudSec Tech Gig Platform
  `);
  
  // In a real application, you would return a promise that resolves when the email is sent
  return Promise.resolve();
}
