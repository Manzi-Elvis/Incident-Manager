'use client';

import Link from 'next/link';
import { IncidentWithDetails } from '@/lib/services/incident-service';
import { Clock, AlertCircle } from 'lucide-react';

interface IncidentCardProps {
  incident: IncidentWithDetails;
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const now = new Date().getTime();
  const created = new Date(incident.created_at).getTime();
  const ageInHours = Math.floor((now - created) / 3600000);

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

  const slaBreach = incident.sla_breached ? (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
      <AlertCircle className="w-3.5 h-3.5" />
      SLA Breached
    </div>
  ) : (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
      <Clock className="w-3.5 h-3.5" />
      {incident.sla_threshold - ageInHours > 0
        ? `${incident.sla_threshold - ageInHours}h left`
        : 'Breached'}
    </div>
  );

  return (
    <Link href={`/incidents/${incident.id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-card/90">
        {/* Gradient border accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:via-primary/10 transition-all duration-300 pointer-events-none" />

        <div className="relative space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {incident.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate mt-1">
                {incident.description}
              </p>
            </div>
            <div className={`status-badge ${severityColors[incident.severity]}`}>
              {incident.severity.charAt(0).toUpperCase() +
                incident.severity.slice(1)}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-mono">#{incident.id.slice(0, 8)}</span>
              <span>•</span>
              <span>{ageInHours}h ago</span>
            </div>
            {incident.team && (
              <span className="px-2 py-1 bg-card-foreground/5 rounded text-muted-foreground">
                {incident.team.name}
              </span>
            )}
          </div>

          {/* Status and SLA */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className={`status-badge ${statusColors[incident.status]}`}>
              {incident.status.replace('_', ' ').charAt(0).toUpperCase() +
                incident.status.replace('_', ' ').slice(1)}
            </div>
            {slaBreach}
          </div>

          {/* Assignee */}
          {incident.assignee && (
            <div className="flex items-center gap-2 pt-2">
              {incident.assignee.avatar_url && (
                <img
                  src={incident.assignee.avatar_url}
                  alt={incident.assignee.name}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="text-xs text-muted-foreground">
                Assigned to {incident.assignee.name.split(' ')[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
