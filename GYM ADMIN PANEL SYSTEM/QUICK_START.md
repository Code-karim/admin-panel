# Elite Fitness Admin Panel - Quick Start

## What You Have

A **production-ready, premium gym management admin panel** with:

✅ Secure authentication with admin-only access
✅ Complete database schema with Row Level Security
✅ Stunning UI with smooth animations and transitions
✅ Dashboard with KPIs and activity feed
✅ Member management system
✅ Billing and subscription plans
✅ Class scheduling framework
✅ Staff management
✅ System settings

## Immediate Next Steps

### 1. Configure Supabase (5 minutes)

The database has already been set up! Now you just need to connect it:

1. **Get your Supabase credentials** from your project dashboard:
   - Project URL (looks like: `https://xxxxx.supabase.co`)
   - Anon Key (starts with `eyJhbG...`)

2. **Update `.env.local`** in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 2. Create Your Admin User (2 minutes)

#### Option A: Via Supabase Dashboard (Easiest)
1. Go to Authentication > Users in Supabase
2. Click "Add User"
3. Email: `karim.office2023@gmail.com`
4. Password: `KA19@RI04@M07@`
5. Click "Create User"
6. Copy the new user's ID (UUID)

7. Go to SQL Editor and run:
   ```sql
   INSERT INTO profiles (id, email, full_name, role)
   VALUES (
     'paste-the-user-id-here',
     'karim.office2023@gmail.com',
     'Admin User',
     'admin'
   );
   ```

#### Option B: Via SQL Only
1. Go to SQL Editor in Supabase
2. Run this (replace the UUID and password):
   ```sql
   -- Note: This method may not work in all Supabase setups
   -- Prefer using the Auth UI method above

   INSERT INTO profiles (id, email, full_name, role)
   SELECT id, 'karim.office2023@gmail.com', 'Admin User', 'admin'
   FROM auth.users
   WHERE email = 'karim.office2023@gmail.com';
   ```

### 3. Run the Application

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000` and log in!

## Testing the System

### Add Sample Data (Optional)

Run this in Supabase SQL Editor:

```sql
-- Add a test member
INSERT INTO members (member_number, full_name, email, phone, status)
VALUES ('EF' || floor(random() * 1000000000)::text, 'John Doe', 'john.doe@example.com', '+1234567890', 'active');

-- Add a subscription plan
INSERT INTO subscription_plans (name, description, plan_type, price, billing_cycle, is_active)
VALUES
  ('Monthly Gold', 'Full gym access with all amenities', 'unlimited', 99.00, 'monthly', true),
  ('Annual Platinum', 'Best value - 12 months unlimited access', 'unlimited', 999.00, 'annual', true),
  ('10 Class Pack', 'Perfect for flexible schedules', 'class_pack', 150.00, 'one_time', true);

-- Add a test payment
INSERT INTO payments (
  member_id,
  amount,
  status,
  payment_method,
  invoice_number
)
SELECT
  id,
  99.00,
  'successful',
  'card',
  'INV-' || floor(random() * 1000000)::text
FROM members
WHERE email = 'john.doe@example.com'
LIMIT 1;
```

## What Each Module Does

### 📊 Dashboard
- View key metrics at a glance
- Quick access to common actions
- See recent check-ins and activity

### 👥 Members
- Add new members with detailed profiles
- Search and filter member list
- Track membership status
- View member details (ready to implement)

### 💳 Billing
- Create subscription plans (Monthly, Annual, Class Packs)
- Track all payments
- View revenue metrics
- Payment status indicators

### 📅 Schedule
- Framework ready for calendar integration
- Class scheduling structure in place

### 👔 Staff
- Staff directory framework
- Role management ready

### ⚙️ Settings
- Update club information
- Configure payment gateway (Stripe ready)
- Manage notification templates

## Common Issues

### "Invalid Supabase URL" Error
- Make sure `.env.local` has correct credentials
- Restart dev server after changing env vars: `npm run dev`

### Can't Log In
- Verify admin user was created in `profiles` table with `role = 'admin'`
- Check email/password in Supabase Auth dashboard

### "Access Denied" After Login
- User must have `role = 'admin'` in the `profiles` table
- Check SQL: `SELECT * FROM profiles WHERE email = 'karim.office2023@gmail.com';`

## Customization Ideas

### Immediate Wins
1. **Change colors**: Edit `app/globals.css` - search for `blue-` and replace with your brand colors
2. **Update club info**: Settings > Club Information
3. **Add logo**: Upload to Supabase Storage, update settings
4. **Create plans**: Billing > Create Plan

### Next Level
1. Add member photos (Supabase Storage)
2. Implement calendar view for scheduling
3. Add email notifications
4. Create member portal
5. Integrate Stripe for payments

## Need Help?

Check `SETUP_GUIDE.md` for detailed documentation!

---

**You're ready to manage an elite fitness club! 💪**
