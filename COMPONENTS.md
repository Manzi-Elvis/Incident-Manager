# Component API Documentation

Comprehensive documentation of all React components in the Enterprise Incident Management Dashboard.

## Navigation Component

**Location**: `/components/navigation.tsx`

### Description
Primary navigation bar with responsive mobile menu. Filters nav items based on user role.

### Props
None - uses `useAuth()` hook internally

### Features
- Desktop and mobile navigation
- Role-based nav item filtering
- User profile display
- Responsive breakpoints (hidden on mobile, visible on md+)

### Usage
```tsx
import { Navigation } from '@/components/navigation';

export default function Page() {
  return (
    <>
      <Navigation />
      <main>{/* content */}</main>
    </>
  );
}
```

---

## Incident Card Component

**Location**: `/components/incident-card.tsx`

### Description
Individual incident card displayed in the list view. Shows summary and key metrics.

### Props
```tsx
interface IncidentCardProps {
  incident: IncidentWithDetails;
}
```

### Features
- Severity badge with color coding
- Status indicator
- SLA timer with breach detection
- Age calculation (hours since created)
- Assignee avatar and name
- Hover effects and animations

### Usage
```tsx
import { IncidentCard } from '@/components/incident-card';

{incidents.map(incident => (
  <IncidentCard key={incident.id} incident={incident} />
))}
```

---

## Incident Timeline Component

**Location**: `/components/incident-timeline.tsx`

### Description
Vertical timeline showing all activities and comments on an incident.

### Props
```tsx
interface IncidentTimelineProps {
  activities: Activity[];
  comments: Comment[];
}
```

### Features
- Combined activities and comments timeline
- Color-coded event types
- Icons for different action types
- Comment expansion with content preview
- Chronological sorting
- Responsive design

### Action Types
- `status_change`: Green (checkmark icon)
- `assignment`: Blue (user icon)
- `comment`: Purple (message icon)
- `severity_change`: Orange (alert icon)
- Default: Gray (clock icon)

### Usage
```tsx
import { IncidentTimeline } from '@/components/incident-timeline';

<IncidentTimeline activities={activities} comments={comments} />
```

---

## Logs Viewer Component

**Location**: `/components/logs-viewer.tsx`

### Description
Expandable log entries viewer with syntax highlighting and copy functionality.

### Props
```tsx
interface LogsViewerProps {
  logs: any[];
}
```

### Features
- Collapsible log entries
- Copy to clipboard functionality
- JSON formatting with indentation
- Log level badges (ERROR, WARNING, INFO)
- Timestamp display
- Max height with scrolling on details

### Log Level Colors
- ERROR: Red background
- WARNING: Orange background
- INFO/DEFAULT: Blue background

### Usage
```tsx
import { LogsViewer } from '@/components/logs-viewer';

<LogsViewer logs={logEntries} />
```

---

## AI Analysis Panel Component

**Location**: `/components/ai-analysis-panel.tsx`

### Description
Interface for analyzing application logs with AI-powered insights.

### Props
```tsx
interface AIAnalysisPanelProps {
  incidentId: string;
  existingAnalysis?: AIAnalysis;
  onAnalysisComplete?: (analysis: AIAnalysis) => void;
}
```

### Features
- Textarea for log input
- Loading state with spinner
- Error handling and display
- Summary section with checkmark
- Root cause identification
- Numbered suggested actions list
- Analysis timestamp

### Analysis Output Structure
```tsx
{
  summary: string;           // High-level overview
  root_cause: string;        // Detailed root cause
  suggested_actions: string[]; // Array of remediation steps
}
```

### Usage
```tsx
import { AIAnalysisPanel } from '@/components/ai-analysis-panel';

<AIAnalysisPanel 
  incidentId={incidentId}
  onAnalysisComplete={(analysis) => console.log(analysis)}
/>
```

---

## Analytics Charts Component

**Location**: `/components/analytics-charts.tsx`

### Description
Collection of Recharts-based visualizations for incident analytics.

### Props
```tsx
interface AnalyticsChartsProps {
  severityDistribution: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  incidentTrends: Array<{
    date: string;
    count: number;
  }>;
}
```

### Charts Included

#### 1. Severity Distribution (Pie Chart)
- Shows breakdown by severity level
- Color-coded: Red (Critical), Orange (High), Yellow (Medium), Blue (Low)
- Interactive legend

#### 2. Incident Trends (Line Chart)
- 30-day incident count history
- Smooth line with hover tooltips
- Date-based x-axis
- Count-based y-axis

#### 3. Response Time by Severity (Bar Chart)
- Average response times in hours
- Bars for each severity level
- Predefined values: Critical (0.5h), High (2h), Medium (4h), Low (8h)

#### 4. SLA Compliance (Bar Chart)
- Weekly compliance percentages
- Values: Week 1-4 (95%, 92%, 88%, 91%)
- 0-100 scale

### Styling
- Dark theme compatible
- Responsive containers
- Hover tooltips
- Legend for reference

### Usage
```tsx
import { AnalyticsCharts } from '@/components/analytics-charts';

<AnalyticsCharts
  severityDistribution={severity}
  incidentTrends={trends}
/>
```

---

## Role Switcher Component

**Location**: `/components/role-switcher.tsx`

### Description
Demo component for switching between user roles. Only visible in development.

### Props
None - uses `useAuth()` hook internally

### Features
- Bottom-right corner fixed positioning
- Dropdown menu with role options
- User info display (name, email)
- Visual indicator of current role
- Automatic redirect on role change

### Available Roles
1. **Admin**: Sarah Chen (sarah.chen@enterprise.com)
2. **Engineer**: Alex Rodriguez (alex.rodriguez@enterprise.com)
3. **Client**: Morgan Blake (morgan.blake@client.com)

### Usage
```tsx
// Automatically included in root layout
// No manual integration needed
```

---

## Shared Patterns

### Severity Badges
All components use consistent severity styling:

```tsx
const severityColors = {
  critical: 'severity-critical',  // Red
  high: 'severity-high',          // Orange
  medium: 'severity-medium',      // Yellow
  low: 'severity-low',            // Blue
};

<div className={`status-badge ${severityColors[severity]}`}>
  {severity}
</div>
```

### Status Badges
Status indicators use consistent styling:

```tsx
const statusColors = {
  open: 'status-open',                      // Red
  in_progress: 'status-in_progress',        // Blue
  resolved: 'status-resolved',              // Green
  closed: 'status-closed',                  // Gray
};

<div className={`status-badge ${statusColors[status]}`}>
  {status}
</div>
```

### Animation Classes
Components use these custom animations:

- `fade-in`: 0.3s opacity transition
- `slide-in`: 0.3s slide from left
- `bounce-in`: 0.4s bounce effect
- `glow-pulse`: 2s pulsing glow effect

### Error Handling
Standard error display pattern:

```tsx
{error && (
  <div className="flex items-center gap-2 px-4 py-3 rounded-lg 
                  bg-red-500/10 border border-red-500/30 
                  text-red-300 text-sm">
    <AlertTriangle className="w-4 h-4" />
    {error}
  </div>
)}
```

---

## Hooks Used

### useAuth()
Provides authentication context:
```tsx
const { user, role, loading, canView, canAssign, canResolve, canDelete } = useAuth();
```

### useRouter()
Navigation in App Router:
```tsx
const router = useRouter();
router.push('/incidents');
```

### usePathname()
Get current route:
```tsx
const pathname = usePathname();
const isActive = (path: string) => pathname === path;
```

### useParams()
Get dynamic route parameters:
```tsx
const params = useParams();
const id = params.id as string;
```

---

## Utility Functions

### formatDistanceToNow()
Custom date formatter (replaces date-fns):

```tsx
import { formatDistanceToNow } from '@/lib/utils/date';

formatDistanceToNow(new Date(), { addSuffix: true })
// Output: "2 hours ago"
```

---

## Service Layer Integration

All components consume data through `/lib/services/incident-service.ts`:

```tsx
export async function getIncidents(filter?: {
  status?: string;
  severity?: string;
  team_id?: string;
  assigned_to?: string;
}): Promise<IncidentWithDetails[]>

export async function getIncidentById(id: string): Promise<IncidentWithDetails | null>

export async function getIncidentActivities(incidentId: string): Promise<Activity[]>

export async function getIncidentComments(incidentId: string): Promise<Comment[]>

export async function getIncidentLogs(incidentId: string): Promise<any[]>

export async function getAnalytics(teamId?: string)

export async function getSeverityDistribution(teamId?: string)

export async function getIncidentTrends(teamId?: string, days?: number)
```

---

## Performance Considerations

- All components are lazy-rendered with split bundles
- Charts use ResponsiveContainer for responsive sizing
- Timeline and logs use virtualization for large datasets
- Image components lazy load avatars
- CSS-in-JS is minimized with Tailwind

---

## Accessibility Features

- Semantic HTML elements throughout
- ARIA labels on interactive elements
- High contrast dark theme
- Keyboard navigation support
- Screen reader friendly navigation
- Focus indicators on interactive elements

---

## Future Component Ideas

- IncidentForm: Create/edit incidents
- CommentInput: Add new comments
- SLAThresholdDisplay: Visual SLA progression
- IncidentFilter: Advanced filtering UI
- BulkActions: Select and manage multiple incidents
- NotificationCenter: Alert management
- CustomReport: Report builder
- ExportDialog: Data export interface
