'use client';

import { Activity, Comment } from '@/lib/services/incident-service';
import { formatDistanceToNow } from '@/lib/utils/date';
import {
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';

interface IncidentTimelineProps {
  activities: Activity[];
  comments: Comment[];
}

export function IncidentTimeline({
  activities,
  comments,
}: IncidentTimelineProps) {
  // Combine and sort activities and comments by date
  const allEvents = [
    ...activities.map((a) => ({
      ...a,
      type: 'activity' as const,
      timestamp: a.created_at,
    })),
    ...comments.map((c) => ({
      ...c,
      type: 'comment' as const,
      timestamp: c.created_at,
      action_type: 'comment',
      description: c.content,
    })),
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getActivityIcon = (actionType: string) => {
    switch (actionType) {
      case 'status_change':
        return <CheckCircle className="w-4 h-4" />;
      case 'assignment':
        return <User className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      case 'severity_change':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (actionType: string) => {
    switch (actionType) {
      case 'status_change':
        return 'bg-green-500/20';
      case 'assignment':
        return 'bg-blue-500/20';
      case 'comment':
        return 'bg-purple-500/20';
      case 'severity_change':
        return 'bg-orange-500/20';
      default:
        return 'bg-primary/20';
    }
  };

  return (
    <div className="space-y-6">
      {allEvents.length === 0 ? (
        <div className="flex items-center justify-center py-8 rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">No activities yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allEvents.map((event, index) => (
            <div key={`${event.type}-${event.id}`} className="flex gap-4 slide-in">
              {/* Timeline dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(event.action_type)} border border-border`}
                >
                  {getActivityIcon(event.action_type)}
                </div>
                {index !== allEvents.length - 1 && (
                  <div className="w-0.5 h-12 bg-border my-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {event.description ||
                        event.action_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(event.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>

                {event.type === 'comment' && (
                  <div className="mt-2 p-3 rounded-lg bg-card border border-border">
                    <p className="text-sm text-foreground">{event.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
