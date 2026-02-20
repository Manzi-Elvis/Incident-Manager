# Enterprise Incident Management Dashboard - Setup Guide

This guide will walk you through setting up and deploying the Enterprise AI Incident Management Dashboard.

## Prerequisites

- Node.js 18+ and pnpm
- A Supabase project (create at [supabase.com](https://supabase.com))
- Vercel account (optional, for deployment)

## 1. Environment Setup

### Step 1: Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project settings, find:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Step 2: Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 2. Database Setup

### Step 1: Create Database Schema

The database schema is in `/scripts/01_init_incident_db.sql`. To set it up:

**Option A: Using Supabase Console (Easiest)**
1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy the entire contents of `/scripts/01_init_incident_db.sql`
4. Paste and run the query
5. You should see success messages for each table and policy

**Option B: Using CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Run migration
supabase db push
```

### Step 2: Seed Demo Data

Run `/scripts/02_seed_demo_data.sql` the same way:

**Using Supabase Console:**
1. SQL Editor → New Query
2. Copy contents of `/scripts/02_seed_demo_data.sql`
3. Paste and run

This inserts realistic demo data including:
- 3 teams with members
- 12 incidents with various statuses and severities
- Activity logs and comments
- Sample logs for AI analysis

## 3. Local Development

### Step 1: Install Dependencies

```bash
pnpm install
```

This installs:
- Next.js 16
- Tailwind CSS v4
- Supabase JS client
- Recharts for visualizations
- Lucide React icons
- And all shadcn/ui components

### Step 2: Start Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Step 3: Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the incident list with demo data
3. Use the role switcher (bottom-right) to test different user roles:
   - **Admin**: Full access including settings
   - **Engineer**: Incident management
   - **Client**: Read-only access
4. Click on any incident to see the detail view
5. Try the Analytics page to see charts
6. Go to Logs page to test AI analysis (paste sample logs)

## 4. Features to Explore

### Incident Management
- **Home Page**: View all incidents with filters and search
- **Incident Detail**: Click any incident to see full details, timeline, and logs
- **Status & Severity**: Filter by status (Open, In Progress, Resolved, Closed) and severity (Critical, High, Medium, Low)
- **SLA Tracking**: Visual SLA breach indicators show remaining hours before breach

### AI Analysis
- **Logs Page**: Paste application logs for AI-powered analysis
- **Analysis Output**: Get summary, root cause, and suggested actions
- **Log Formats**: Supports JSON, plaintext, and structured logs

### Analytics
- **Key Metrics**: Total incidents, resolution rate, MTTR, SLA breaches
- **Charts**: Severity distribution, incident trends, response times, SLA compliance
- **30-Day History**: Visualize incident patterns over time

### Role-Based Access Control
- **Admin**: Access to everything including Settings page
- **Engineer**: Can manage incidents and view analytics
- **Client**: Can only view their incidents
- Use the role switcher to test different views

## 5. Project Structure

```
incident-dashboard/
├── app/                          # Next.js app router
│   ├── page.tsx                 # Home - incident list
│   ├── layout.tsx               # Root layout with providers
│   ├── incidents/[id]/page.tsx  # Incident detail page
│   ├── analytics/page.tsx       # Analytics dashboard
│   ├── logs/page.tsx            # Log analysis
│   ├── settings/page.tsx        # Admin settings (RBAC protected)
│   └── api/incidents/route.ts   # API endpoint
│
├── components/                   # React components
│   ├── navigation.tsx           # Header/nav bar
│   ├── incident-card.tsx        # Incident list card
│   ├── incident-timeline.tsx    # Activity timeline
│   ├── logs-viewer.tsx          # Log explorer
│   ├── ai-analysis-panel.tsx    # AI analysis interface
│   ├── analytics-charts.tsx     # Recharts visualizations
│   └── role-switcher.tsx        # Demo role switcher
│
├── lib/
│   ├── services/
│   │   └── incident-service.ts  # Supabase queries
│   ├── context/
│   │   └── auth-context.tsx     # Auth & role management
│   ├── hooks/
│   │   └── use-role-guard.ts    # Route protection
│   └── utils/
│       └── date.ts              # Date utilities
│
└── scripts/                      # Database migrations
    ├── 01_init_incident_db.sql  # Schema setup
    └── 02_seed_demo_data.sql    # Sample data
```

## 6. Database Schema Overview

### Core Tables

**incidents**
- id, title, description
- severity (critical, high, medium, low)
- status (open, in_progress, resolved, closed)
- assigned_to (user_id)
- team_id
- sla_threshold, sla_breached
- created_at, updated_at

**users**
- id, name, email
- role (admin, engineer, client)
- team_id
- avatar_url

**incident_activities**
- Track all changes to incidents
- action_type (status_change, assignment, severity_change, etc.)

**incident_comments**
- Comments and notes on incidents
- user_id, content, timestamps

**incident_logs**
- Raw application logs
- timestamp, message, level, metadata

**ai_analyses**
- AI analysis results
- summary, root_cause, suggested_actions

See `/scripts/01_init_incident_db.sql` for complete schema definition.

## 7. Customization Guide

### Change Team Name
1. Update seed data: `/scripts/02_seed_demo_data.sql`
2. Re-run the seed script

### Modify Color Scheme
1. Edit `/app/globals.css` CSS custom properties:
   - `--primary`: Main brand color
   - `--destructive`: Error/critical color
   - `--chart-1` through `--chart-5`: Chart colors

### Add Custom Incidents
1. Use Supabase Dashboard's Table Editor
2. Or write SQL INSERT statements
3. Or create an admin UI form using the service layer

### Extend Navigation
1. Edit `/components/navigation.tsx`
2. Add new nav items with role checks
3. Create corresponding pages

## 8. Deployment to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Click "Deploy"

### Step 3: Configure Supabase
1. In Supabase, go to Authentication → Providers
2. Add your Vercel domain to allowed origins
3. Configure CORS headers if needed

## 9. Testing the AI Analysis

The AI analysis panel simulates real analysis. To test:

1. Go to Logs page (/logs)
2. Paste sample log content:

```json
{
  "timestamp": "2024-02-20T14:32:15Z",
  "level": "ERROR",
  "service": "api-gateway",
  "message": "Database connection pool exhausted",
  "pool_size": 100,
  "active_connections": 102,
  "waiting_requests": 45
}
```

3. Click "Analyze Logs"
4. Wait 2 seconds for simulated AI analysis
5. Review summary, root cause, and suggested actions

## 10. Performance Tips

- **Database**: Ensure Supabase indexes are on severity, status, created_at
- **Images**: Use Next.js Image component for avatars
- **Caching**: Implement SWR for client-side data caching
- **Charts**: Consider virtualization for large datasets
- **Bundle Size**: Already optimized with code splitting

## 11. Security Checklist

- [ ] Row Level Security (RLS) policies are active
- [ ] Environment variables are set in production
- [ ] Supabase auth is configured
- [ ] CORS is properly configured
- [ ] API routes validate user roles
- [ ] Database backups are enabled
- [ ] SSL/TLS is enforced

## 12. Troubleshooting

### Issue: "NEXT_PUBLIC_SUPABASE_URL is missing"
**Solution**: Make sure `.env.local` file exists with correct variables

### Issue: Database tables don't exist
**Solution**: Run the SQL migration script in Supabase console

### Issue: No data showing in incident list
**Solution**: Run the seed data script to populate demo data

### Issue: Role switcher not working
**Solution**: This is a demo feature. In production, integrate with Auth.js

### Issue: Charts not rendering
**Solution**: Check browser console for errors. Ensure Recharts is installed.

## 13. Next Steps

1. **Authentication**: Integrate Auth.js for real authentication
2. **Real-time Updates**: Add Supabase subscriptions for live updates
3. **Advanced AI**: Integrate with OpenAI or Claude API
4. **Email Notifications**: Set up SendGrid or similar
5. **Slack Integration**: Add incident notifications to Slack
6. **Custom Branding**: Update colors, logo, and company name
7. **Mobile App**: Extend with React Native

## 14. Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Database backups enabled
- [ ] Monitoring set up (Sentry/LogRocket)
- [ ] CDN configured
- [ ] Security headers set
- [ ] SSL certificate validated
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Database connection pooling enabled
- [ ] Incident escalation paths defined

## Support

For issues:
1. Check `/scripts` for database setup
2. Review `/lib/services` for data fetching
3. Check browser DevTools console for errors
4. Verify Supabase credentials
5. Check Vercel logs for deployment issues

Happy building! 🚀
