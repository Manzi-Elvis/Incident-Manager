# Setup Checklist: Authentication & Theme Features

## Prerequisites
- [ ] Node.js 18+ installed
- [ ] npm or pnpm package manager
- [ ] Supabase account created (https://supabase.com)

## Step 1: Supabase Configuration

### Create Supabase Project
- [ ] Sign up at supabase.com
- [ ] Create new project
- [ ] Note your Project URL and Anon Key
- [ ] Wait for database to be ready

### Enable Authentication
- [ ] Go to Authentication → Providers
- [ ] Enable "Email" provider
- [ ] Configure email settings (SMTP or Supabase built-in)
- [ ] Set "Auto confirm users" to false (for email confirmation flow)

### Configure Auth Redirect URLs
- [ ] Go to Authentication → URL Configuration
- [ ] Add redirect URL: `http://localhost:3000/auth/callback`
- [ ] Add redirect URL: `http://localhost:3000/`
- [ ] Add production URL when deploying

## Step 2: Environment Variables

### Create .env.local file
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

### Location
- [ ] Create `.env.local` in project root
- [ ] Add Supabase credentials
- [ ] Save file
- [ ] Add to `.gitignore` (don't commit secrets!)

## Step 3: Install Dependencies

### Run Installation
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

- [ ] All dependencies installed
- [ ] No installation errors

## Step 4: Database Initialization

### Create Tables and Setup RLS
- [ ] Run migration: `scripts/01_init_incident_db.sql`
- [ ] Seed demo data: `scripts/02_seed_demo_data.sql`
- [ ] Verify tables created in Supabase dashboard
- [ ] Check RLS policies enabled

### How to Run Migrations
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Create new query
4. Copy and paste migration SQL
5. Click "Run"

## Step 5: Test Authentication

### Start Development Server
```bash
pnpm dev
```

- [ ] Dev server running on http://localhost:3000
- [ ] No errors in console

### Test Signup
- [ ] Navigate to http://localhost:3000
- [ ] Click "Get Started"
- [ ] Signup with test email
- [ ] Verify account created in Supabase
- [ ] Logged into dashboard

### Test Login
- [ ] Logout via navigation button
- [ ] Go to http://localhost:3000/auth/login
- [ ] Login with created account
- [ ] Should see dashboard

### Test Demo Account
- [ ] Logout
- [ ] Go to http://localhost:3000/auth/login
- [ ] Use demo credentials:
  - Email: `demo@example.com`
  - Password: `demo123456`
- [ ] Should successfully login

### Test Forgot Password
- [ ] Logout
- [ ] Go to http://localhost:3000/auth/forgot-password
- [ ] Enter email address
- [ ] Check that email sent confirmation appears
- [ ] (Optional: Check email inbox)

## Step 6: Test Theme System

### Test Dark Mode
- [ ] Logged into dashboard
- [ ] Click sun/moon icon in navigation
- [ ] Theme should switch to light mode
- [ ] All colors should adjust

### Test Light Mode
- [ ] Click sun/moon icon again
- [ ] Theme should switch back to dark mode
- [ ] All colors should adjust

### Test Persistence
- [ ] Change to light mode
- [ ] Reload page (F5 or Cmd+R)
- [ ] Theme should still be light
- [ ] Check localStorage in DevTools

### Test System Preference
- [ ] Open browser DevTools
- [ ] Go to Rendering tab
- [ ] Change "Emulate CSS media feature prefers-color-scheme"
- [ ] Reload page
- [ ] Should match system preference (if no saved preference)

## Step 7: Test Route Protection

### Test Protected Route
- [ ] Logout
- [ ] Try to access http://localhost:3000/incidents/[any-id]
- [ ] Should redirect to login

### Test Landing Page
- [ ] Logout
- [ ] Go to http://localhost:3000
- [ ] Should see landing page with signup/login CTAs
- [ ] Login with credentials
- [ ] Should see incidents dashboard

### Test Admin Route
- [ ] Login as user
- [ ] Try to access http://localhost:3000/settings
- [ ] Should show access denied (if not admin role)

## Step 8: Test Responsive Design

### Desktop Testing
- [ ] Open on desktop browser
- [ ] All elements visible
- [ ] Theme toggle works
- [ ] Navigation displays correctly

### Mobile Testing
- [ ] Open DevTools (F12)
- [ ] Toggle device toolbar
- [ ] Test on iPhone/Android sizes
- [ ] Touch navigation menu
- [ ] Theme toggle accessible
- [ ] Forms are usable

### Tablet Testing
- [ ] Test on tablet size (iPad)
- [ ] Layout responds properly
- [ ] Touch targets large enough

## Step 9: Production Setup

### Environment Variables
- [ ] Add Supabase credentials to Vercel environment
- [ ] Update auth redirect URLs for production domain
- [ ] Set NEXT_PUBLIC_ variables in Vercel

### Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variables
- [ ] Deploy main branch
- [ ] Test in production

### Post-Deployment
- [ ] Test signup in production
- [ ] Test login in production
- [ ] Test theme switching in production
- [ ] Verify email sending works
- [ ] Check error logging

## Troubleshooting

### Issue: "Supabase credentials not found"
- **Solution**: Check `.env.local` file exists with correct keys
- Check NEXT_PUBLIC_ prefix for public variables

### Issue: "Authentication failed"
- **Solution**: Verify Supabase project is active
- Check email/password provider is enabled
- Verify credentials in .env.local

### Issue: "Theme not persisting"
- **Solution**: Check localStorage is enabled
- Clear browser cache
- Check for errors in DevTools console

### Issue: "Email not sending"
- **Solution**: Configure SMTP in Supabase
- Check spam/junk folder
- Verify sender address is configured

### Issue: "Protected route not working"
- **Solution**: Ensure ProtectedRoute wraps component
- Check useAuth() is available in context
- Verify user role is set correctly

## Testing Accounts

### Demo Account
```
Email: demo@example.com
Password: demo123456
Role: Engineer
```

### Creating Test Accounts
1. Signup with new email: test@example.com
2. Use any password (minimum 8 characters)
3. Account created and auto-logged in

## Quick Start Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type check
pnpm type-check

# Format code
pnpm format
```

## File Locations

| Component | Location |
|-----------|----------|
| Theme Provider | `lib/context/theme-context.tsx` |
| Auth Provider | `lib/context/auth-context.tsx` |
| Auth Service | `lib/services/auth-service.ts` |
| Login Page | `app/auth/login/page.tsx` |
| Signup Page | `app/auth/signup/page.tsx` |
| Password Reset | `app/auth/forgot-password/page.tsx` |
| Protected Route | `components/protected-route.tsx` |
| Navigation | `components/navigation.tsx` |
| Global Styles | `app/globals.css` |
| Root Layout | `app/layout.tsx` |

## Support & Resources

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com

## Completion Checklist

- [ ] All dependencies installed
- [ ] Supabase project created and configured
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Authentication tested (signup, login, reset)
- [ ] Theme system tested (light, dark, persistence)
- [ ] Route protection tested
- [ ] Responsive design verified
- [ ] Production deployment configured
- [ ] All tests passing

## Next: Advanced Configuration

Once setup is complete, see these guides for customization:
- `AUTH_GUIDE.md` - Detailed auth configuration
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `COMPONENTS.md` - Component API reference
- `EXTENDING.md` - Adding custom features
