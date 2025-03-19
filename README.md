# CloudSec Tech Platform

A comprehensive tech service marketplace platform that connects service providers, clients, and administrators through an intuitive and feature-rich web application.

## Features

- Service Provider Verification and Management
- Admin Dashboard for managing the platform
- Super Admin Dashboard for advanced controls
- Gig posting and allocation system
- Client and service provider profiles
- Responsive design for all devices

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the application:
```bash
npm run dev
```

## Super Admin Access

To access the Super Admin dashboard, you need to create a super admin account first:

1. Run the super admin seeding script:
```bash
npx tsx server/seed-super-admin.ts
```

2. This will create a super admin account with the following credentials:
   - Username: `superadmin`
   - Password: `Admin@123`
   - Email: `superadmin@cloudsec.tech`

3. Log in with these credentials at the login page
4. Once logged in, you'll see a "Super Admin" link in the navigation menu
5. Click on it to access the Super Admin dashboard at `/super-admin`

## Super Admin Dashboard Features

The Super Admin dashboard allows you to:

- Manage service providers and clients
- Add, edit, and delete gig categories
- Add, edit, and delete locations and skill categories
- List and manage all gigs in different states (open, allocated, in progress, completed)
- Allocate service providers to gigs
- Verify service providers and clients
- Configure notification settings for gig allocations

## Tech Stack

- Frontend: React with Tanstack React Query
- Backend: Express.js
- Database: Drizzle ORM
- Authentication: Passport.js
- UI Components: Lucide React, React Icons
- Form Handling: React Hook Form

## License

© 2025 CloudSec Tech. All Rights Reserved.
Site Created by [Creantis World](https://creantisworld.com)
