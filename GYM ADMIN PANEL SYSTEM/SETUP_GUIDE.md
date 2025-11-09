# Elite Fitness Admin Panel - Setup Guide

## Overview

This is a premium, world-class admin panel for elite gym management. Built with Next.js, Supabase, and Tailwind CSS, featuring a stunning UI with smooth animations, comprehensive security, and production-ready functionality.

## Features

### 1. Dashboard (Home Base)
- **KPI Cards**: Total Members, Monthly Revenue, New Members, Expiring Subscriptions
- **Visual Charts**: Revenue trends and analytics (ready for integration)
- **Quick Actions**: Fast access to common tasks
- **Activity Feed**: Real-time member check-ins and updates

### 2. Member Management (CRM)
- **Master Table**: Searchable, filterable member database
- **Add/Edit Members**: Beautiful multi-step forms
- **Member Profiles**: Detailed view with subscription status, payment history, and check-ins
- **Status Tracking**: Active, Frozen, Expired, Cancelled

### 3. Billing & Subscriptions
- **Subscription Plan Creator**: Create unlimited, class pack, and PT plans
- **Payment Tracking**: Complete payment history with status indicators
- **Revenue Analytics**: Real-time revenue calculations
- **Payment Status**: Successful, Pending, Failed tracking

### 4. Class & Schedule Management
- Calendar view framework (ready for implementation)
- Class creation and roster management structure

### 5. Staff Management
- Staff directory framework
- Role-based access control ready

### 6. System Settings
- Club information management
- Payment gateway configuration (Stripe-ready)
- Notification templates

## Security Architecture

### Admin-Only Access
This entire panel is restricted to users with the `admin` role through:

1. **Row Level Security (RLS)**: All database tables have RLS policies that check for admin role
2. **Frontend Route Guards**: Client and server-side checks redirect non-admins
3. **Supabase Auth Integration**: Secure authentication flow with role verification

## Setup Instructions

### Step 1: Supabase Configuration

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be provisioned

2. **Apply Database Migration**
   - Go to SQL Editor in your Supabase dashboard
   - The migration file has already been applied via the MCP tools
   - Verify tables exist: `profiles`, `members`, `subscription_plans`, etc.

3. **Create the First Admin User**
   ```sql
   -- In Supabase SQL Editor:

   -- First, create the auth user (do this via Supabase Auth UI or API)
   -- Email: karim.office2023@gmail.com
   -- Password: KA19@RI04@M07@

   -- Then, insert the profile with admin role
   -- Replace 'USER_ID_HERE' with the actual UUID from auth.users
   INSERT INTO profiles (id, email, full_name, role)
   VALUES (
     'USER_ID_HERE',
     'karim.office2023@gmail.com',
     'Admin User',
     'admin'
   );
   ```

4. **Get Your Supabase Credentials**
   - Go to Project Settings > API
   - Copy `Project URL`
   - Copy `anon/public` key

### Step 2: Environment Configuration

1. **Update `.env.local`**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 3: Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Step 4: First Login

1. Navigate to `http://localhost:3000`
2. You'll be redirected to `/login`
3. Enter the admin credentials:
   - Email: `karim.office2023@gmail.com`
   - Password: `KA19@RI04@M07@`
4. You'll be redirected to the dashboard

## Design Philosophy

### The "Wow Factor"
- **Clean & Modern**: Premium SaaS dashboard aesthetic
- **Smooth Animations**: Page transitions, micro-interactions, skeleton loaders
- **Responsive**: Perfect on desktop, tablet, and mobile
- **Dark Mode Ready**: Design system supports theme switching (toggle can be added)

### UI Components
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Lucide React** for icons
- **Sonner** for toast notifications

### Color Palette
- Primary: Blue (gradient from blue-600 to blue-500)
- Success: Emerald
- Warning: Amber/Orange
- Error: Red
- Neutral: Slate

## Database Schema

### Core Tables
1. **profiles** - User authentication and role management
2. **members** - Complete member database
3. **subscription_plans** - Membership plan definitions
4. **member_subscriptions** - Active subscriptions
5. **payments** - Payment history and invoicing
6. **classes** - Class definitions
7. **class_schedules** - Scheduled class instances
8. **class_bookings** - Member class bookings
9. **check_ins** - Facility access logs
10. **staff** - Team member management
11. **system_settings** - Application configuration

### Security
- All tables have RLS enabled
- Only admin role can perform CRUD operations
- Foreign key constraints ensure data integrity

## Adding Sample Data

To test the system, you can add sample data:

```sql
-- Add a sample member
INSERT INTO members (member_number, full_name, email, phone, status)
VALUES ('EF123456789', 'John Doe', 'john@example.com', '+1234567890', 'active');

-- Add a subscription plan
INSERT INTO subscription_plans (name, plan_type, price, billing_cycle)
VALUES ('Monthly Gold', 'unlimited', 99.00, 'monthly');

-- Add a sample payment
INSERT INTO payments (member_id, amount, status, payment_method)
VALUES (
  (SELECT id FROM members WHERE email = 'john@example.com'),
  99.00,
  'successful',
  'card'
);
```

## Customization

### Change Club Information
1. Navigate to Settings > Club Information
2. Update club name, address, contact details
3. Click "Save Changes"

### Add More Subscription Plans
1. Go to Billing & Subscriptions
2. Click "Create Plan"
3. Fill in plan details
4. Plans will appear in the pricing cards

### Theme Customization
- Edit `app/globals.css` for color variables
- Modify `tailwind.config.ts` for theme extensions
- Update gradient colors in components

## Production Deployment

### Recommended: Vercel
```bash
# Deploy to Vercel
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

### Other Platforms
The project uses `output: 'export'` for static builds, making it deployable to:
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

### Important Production Notes
1. Set environment variables in your hosting platform
2. Enable HTTPS (required for Supabase)
3. Configure proper CORS settings in Supabase
4. Set up custom domain with SSL certificate

## Future Enhancements

### Ready for Implementation
1. **Full Calendar Integration**: Add react-big-calendar or similar
2. **Stripe Integration**: Payment processing with webhooks
3. **Email Notifications**: SendGrid or similar integration
4. **Photo Uploads**: Member photos and club logo
5. **Reports & Analytics**: Advanced charts with recharts
6. **Member Portal**: Separate front-end for members
7. **Mobile App**: React Native version
8. **QR Code Check-ins**: Fast member access
9. **Attendance Tracking**: Detailed analytics
10. **Coach Dashboard**: Limited access for trainers

## Support

For questions or issues:
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Review the database migration file for schema details

## License

Private/Proprietary - Elite Fitness Club Admin System

---

**Built with care for elite fitness clubs. Every pixel matters.**
