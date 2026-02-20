# Extending the Incident Management Dashboard

Guide for adding new features and customizing the enterprise dashboard.

## Adding a New Feature

### Example: Add "Incident Resolution" Feature

#### Step 1: Update Data Layer

Add to `/lib/services/incident-service.ts`:

```tsx
export async function resolveIncident(
  incidentId: string,
  resolutionSummary: string
): Promise<Incident> {
  const { data, error } = await supabase
    .from('incidents')
    .update({
      status: 'resolved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', incidentId)
    .select()
    .single();

  if (error) throw error;

  // Log the activity
  await supabase.from('incident_activities').insert({
    incident_id: incidentId,
    action_type: 'status_change',
    description: `Incident resolved: ${resolutionSummary}`,
  });

  return data;
}
```

#### Step 2: Create UI Component

Create `/components/resolve-incident-dialog.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { resolveIncident } from '@/lib/services/incident-service';
import { useAuth } from '@/lib/context/auth-context';
import { CheckCircle, Loader2 } from 'lucide-react';

interface ResolveIncidentDialogProps {
  incidentId: string;
  onResolveComplete?: () => void;
}

export function ResolveIncidentDialog({
  incidentId,
  onResolveComplete,
}: ResolveIncidentDialogProps) {
  const { canResolve } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canResolve()) return null;

  const handleResolve = async () => {
    if (!summary.trim()) {
      setError('Please provide a resolution summary');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await resolveIncident(incidentId, summary);
      setIsOpen(false);
      setSummary('');
      onResolveComplete?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to resolve incident'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 
                   border border-green-500/30 rounded-lg hover:bg-green-500/30 
                   transition-colors"
      >
        <CheckCircle className="w-4 h-4" />
        Mark as Resolved
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-bold mb-4">Resolve Incident</h2>

            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What was the resolution?"
              className="w-full px-3 py-2 rounded-lg bg-input border border-border 
                         text-foreground focus:outline-none focus:ring-2 
                         focus:ring-primary/50 resize-none"
              rows={4}
              disabled={loading}
            />

            {error && (
              <p className="text-red-300 text-sm mt-2">{error}</p>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-border rounded-lg 
                           hover:bg-card transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleResolve}
                disabled={loading || !summary.trim()}
                className="flex-1 px-4 py-2 bg-green-500/20 text-green-300 
                           rounded-lg hover:bg-green-500/30 transition-colors 
                           disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Resolving...' : 'Mark Resolved'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

#### Step 3: Use in Detail Page

Update `/app/incidents/[id]/page.tsx`:

```tsx
import { ResolveIncidentDialog } from '@/components/resolve-incident-dialog';

// In the incident detail page:
<ResolveIncidentDialog 
  incidentId={incident.id}
  onResolveComplete={() => {
    // Refresh incident data
  }}
/>
```

---

## Adding Role-Based Views

### Create Admin-Only Settings Page

```tsx
'use client';

import { useRoleGuard } from '@/lib/hooks/use-role-guard';
import { Navigation } from '@/components/navigation';

export default function AdminSettingsPage() {
  const { isAuthorized, loading } = useRoleGuard(['admin']);

  if (loading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>Access Denied</div>;

  return (
    <>
      <Navigation />
      <main>
        {/* Admin-only content */}
      </main>
    </>
  );
}
```

---

## Integrating Real Authentication

Replace the mock auth context with Auth.js (formerly NextAuth.js):

### Step 1: Install Auth.js

```bash
npm install @auth/core @auth/next
```

### Step 2: Create Auth Configuration

Create `/lib/auth.ts`:

```tsx
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const { handlers, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Verify credentials against database
        // Return user object if valid
        // Return null if invalid
        return {
          id: '1',
          name: 'User Name',
          email: credentials.email as string,
          role: 'engineer', // Fetch from database
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
});
```

### Step 3: Update Auth Context

Update `/lib/context/auth-context.tsx`:

```tsx
'use client';

import { useSession } from 'next-auth/react';
// ... rest of context using useSession()
```

---

## Adding Real-Time Updates

### Enable Supabase Subscriptions

Update `/lib/services/incident-service.ts`:

```tsx
export function subscribeToIncidents(
  callback: (incident: Incident) => void
) {
  return supabase
    .from('incidents')
    .on('*', (payload) => {
      callback(payload.new as Incident);
    })
    .subscribe();
}
```

### Use in Component

```tsx
'use client';

import { useEffect } from 'react';
import { subscribeToIncidents } from '@/lib/services/incident-service';

export function IncidentList() {
  useEffect(() => {
    const subscription = subscribeToIncidents((incident) => {
      // Update UI with new incident
      console.log('Incident updated:', incident);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ... component code
}
```

---

## Connecting to Real AI Services

### Using OpenAI API

Update `/lib/services/ai-service.ts`:

```tsx
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeLogsWithAI(logs: string): Promise<{
  summary: string;
  rootCause: string;
  suggestedActions: string[];
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert DevOps engineer analyzing application logs. 
                 Provide a brief summary, identify root causes, and suggest fixes.
                 Respond in JSON format with: summary, rootCause, suggestedActions (array)`,
      },
      {
        role: 'user',
        content: `Analyze these logs:\n${logs}`,
      },
    ],
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content || '{}');
}
```

### Use in Component

```tsx
import { analyzeLogsWithAI } from '@/lib/services/ai-service';

const handleAnalyze = async () => {
  setLoading(true);
  const result = await analyzeLogsWithAI(logsInput);
  setAnalysis(result);
  setLoading(false);
};
```

---

## Adding Slack Notifications

### Create Webhook Handler

Create `/app/api/webhooks/incident-created.ts`:

```tsx
import { NextRequest, NextResponse } from 'next/server';

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  const incident = await request.json();

  await fetch(SLACK_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `New ${incident.severity} incident: ${incident.title}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 ${incident.severity.toUpperCase()} Incident`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${incident.title}*\n${incident.description}`,
          },
        },
      ],
    }),
  });

  return NextResponse.json({ ok: true });
}
```

---

## Adding Custom Reporting

### Create Report Generator

Create `/lib/services/report-service.ts`:

```tsx
import { getAnalytics } from './incident-service';
import { jsPDF } from 'jspdf';

export async function generateIncidentReport(
  teamId: string,
  dateRange: { start: Date; end: Date }
) {
  const analytics = await getAnalytics(teamId);

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('Incident Report', 20, 20);

  doc.setFontSize(12);
  doc.text(`Total Incidents: ${analytics.total}`, 20, 40);
  doc.text(`Resolved: ${analytics.resolved}`, 20, 50);
  doc.text(`MTTR: ${analytics.mttr}h`, 20, 60);

  return doc.output('blob');
}
```

---

## Performance Optimizations

### Add Data Caching

Use SWR for client-side caching:

```tsx
import useSWR from 'swr';

export function IncidentList() {
  const { data: incidents, error } = useSWR(
    '/api/incidents',
    async (url) => {
      const res = await fetch(url);
      return res.json();
    },
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  return incidents ? <div>{/* render */}</div> : <div>Loading...</div>;
}
```

### Add Database Indexes

Add to `/scripts/03_add_indexes.sql`:

```sql
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_team ON incidents(team_id);
CREATE INDEX idx_incidents_created ON incidents(created_at);
CREATE INDEX idx_activities_incident ON incident_activities(incident_id);
```

---

## Testing

### Unit Tests

Create `/lib/services/__tests__/incident-service.test.ts`:

```tsx
import { getIncidents } from '../incident-service';

describe('Incident Service', () => {
  it('should fetch incidents with filters', async () => {
    const incidents = await getIncidents({ severity: 'critical' });
    expect(incidents).toBeDefined();
    expect(incidents.every(i => i.severity === 'critical')).toBe(true);
  });
});
```

### E2E Tests

Use Playwright:

```bash
npm install -D @playwright/test
npx playwright test
```

---

## Deployment Considerations

### Environment Variables for Extensions

Add to `.env.local`:

```env
# OpenAI
OPENAI_API_KEY=sk_...

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/...

# SendGrid (Email)
SENDGRID_API_KEY=SG....

# Sentry (Monitoring)
SENTRY_DSN=https://....
```

### Database Migrations in Production

```bash
# Before deploying
npm run migrate

# Deploy
vercel deploy
```

---

## Common Extensions

1. **Email Notifications**: SendGrid integration
2. **Slack Alerts**: Webhook posting to Slack channels
3. **PagerDuty Integration**: Incident escalation
4. **Datadog Integration**: Metrics and monitoring
5. **GitHub Issues**: Create issues from incidents
6. **JIRA Integration**: Sync with project management
7. **Custom Authentication**: Auth0, Okta, Azure AD
8. **Team Permissions**: Fine-grained access control
9. **Audit Logging**: Complete change history
10. **Custom Workflows**: Incident automation

---

## Support

For questions on extending the dashboard:
1. Check existing components in `/components`
2. Review service layer in `/lib/services`
3. Look at similar features already implemented
4. Test changes locally before deploying
5. Use TypeScript for type safety
