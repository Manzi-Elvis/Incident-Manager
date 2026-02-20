'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { IncidentTimeline } from '@/components/incident-timeline';
import { LogsViewer } from '@/components/logs-viewer';
import {
  getIncidentById,
  getIncidentActivities,
  getIncidentComments,
  getIncidentLogs,
  type IncidentWithDetails,
  type Activity,
  type Comment,
} from '@/lib/services/incident-service';
import { ArrowLeft, AlertTriangle, User, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<IncidentWithDetails | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function loadIncidentDetails() {
      try {
        const [incidentData, activitiesData, commentsData, logsData] =
          await Promise.all([
            getIncidentById(incidentId),
            getIncidentActivities(incidentId),
            getIncidentComments(incidentId),
            getIncidentLogs(incidentId),
          ]);

        setIncident(incidentData);
        setActivities(activitiesData);
        setComments(commentsData);
        setLogs(logsData);
      } catch (error) {
        console.error('Failed to load incident details:', error);
      } finally {
        setLoading(false);
      }
    }

    loadIncidentDetails();
  }, [incidentId]);

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center py-12">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-primary/40" />
                </div>
                <p className="text-muted-foreground">Loading incident...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!incident) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-dashed border-border">
              <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mb-3" />
              <h3 className="font-semibold text-foreground">Incident not found</h3>
              <Link href="/" className="text-primary hover:underline text-sm mt-2">
                Back to incidents
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const severityColors = {
    critical: 'severity-critical',
    high: 'severity-high',
    medium: 'severity-medium',
    low: 'severity-low',
  };

  const statusColors = {
    open: 'status-open',
    in_progress: 'status-in_progress',
    resolved: 'status-resolved',
    closed: 'status-closed',
  };

  const ageInHours = Math.floor(
    (new Date().getTime() - new Date(incident.created_at).getTime()) / 3600000
  );

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to incidents
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-balance">
                      {incident.title}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      {incident.description}
                    </p>
                  </div>
                  <div className={`status-badge ${severityColors[incident.severity]}`}>
                    {incident.severity.charAt(0).toUpperCase() +
                      incident.severity.slice(1)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className={`status-badge ${statusColors[incident.status]}`}>
                    {incident.status.replace('_', ' ').charAt(0).toUpperCase() +
                      incident.status.replace('_', ' ').slice(1)}
                  </div>
                  {incident.sla_breached && (
                    <div className="status-badge bg-red-500/20 text-red-300 border border-red-500/30">
                      SLA Breached
                    </div>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    ID
                  </p>
                  <p className="font-mono text-sm">{incident.id}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Created
                  </p>
                  <p className="text-sm">
                    {new Date(incident.created_at).toLocaleString()}
                  </p>
                </div>

                {incident.team && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Team
                    </p>
                    <p className="text-sm">{incident.team.name}</p>
                  </div>
                )}

                {incident.assignee && (
                  <div className="rounded-lg border border-border bg-card p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Assigned To
                    </p>
                    <div className="flex items-center gap-2">
                      {incident.assignee.avatar_url && (
                        <img
                          src={incident.assignee.avatar_url}
                          alt={incident.assignee.name}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <p className="text-sm">{incident.assignee.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="space-y-4">
                {/* Timeline Tab */}
                <div>
                  <h2 className="text-lg font-bold mb-4">Activity Timeline</h2>
                  <IncidentTimeline activities={activities} comments={comments} />
                </div>

                {/* Logs Tab */}
                <div>
                  <h2 className="text-lg font-bold mb-4">Logs</h2>
                  <LogsViewer logs={logs} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Quick Stats</h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Age</p>
                    <p className="text-2xl font-bold">{ageInHours}h</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      SLA Threshold
                    </p>
                    <p className="text-2xl font-bold">
                      {incident.sla_threshold}h
                    </p>
                    <div className="w-full h-2 rounded-full bg-card-foreground/10 mt-2 overflow-hidden">
                      <div
                        className={`h-full ${
                          incident.sla_breached
                            ? 'bg-red-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            (ageInHours / incident.sla_threshold) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment Section */}
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <h3 className="font-semibold">Add Comment</h3>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={4}
                />
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
                  Post Comment
                </button>
              </div>

              {/* Metadata */}
              <div className="rounded-lg border border-border bg-card/50 p-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Last updated{' '}
                    {new Date(incident.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
