'use client';

import { useEffect, useState } from 'react';
import { Navigation } from '@/components/navigation';
import { AnalyticsCharts } from '@/components/analytics-charts';
import {
  getAnalytics,
  getSeverityDistribution,
  getIncidentTrends,
} from '@/lib/services/incident-service';
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AnalyticsData {
  total: number;
  resolved: number;
  critical: number;
  breached: number;
  mttr: number;
}

interface SeverityDistribution {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface TrendData {
  date: string;
  count: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [severity, setSeverity] = useState<SeverityDistribution | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [analyticsData, severityData, trendsData] = await Promise.all([
          getAnalytics(),
          getSeverityDistribution(),
          getIncidentTrends(),
        ]);

        setAnalytics(analyticsData);
        setSeverity(severityData);
        setTrends(trendsData);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const resolutionRate =
    analytics && analytics.total > 0
      ? Math.round((analytics.resolved / analytics.total) * 100)
      : 0;

  return (
    <>
      <Navigation />
      <main className="flex-1 min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                Incident Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time metrics and trends across your incident management
                system
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-primary/40" />
                </div>
                <p className="text-muted-foreground">Loading analytics...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="rounded-lg border border-border bg-card p-6 space-y-2 slide-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Total Incidents
                    </p>
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{analytics?.total || 0}</p>
                    {analytics && (
                      <p className="text-xs text-muted-foreground">
                        {analytics.critical} critical
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 space-y-2 slide-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Resolution Rate
                    </p>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{resolutionRate}%</p>
                    {analytics && (
                      <p className="text-xs text-muted-foreground">
                        {analytics.resolved} resolved
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 space-y-2 slide-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      MTTR
                    </p>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">
                      {analytics?.mttr || 0}h
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mean Time to Resolve
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 space-y-2 slide-in">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      SLA Breached
                    </p>
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{analytics?.breached || 0}</p>
                    {analytics && (
                      <p className="text-xs text-muted-foreground">
                        {analytics.total > 0
                          ? Math.round((analytics.breached / analytics.total) * 100)
                          : 0}
                        % rate
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Charts */}
              {severity && (
                <AnalyticsCharts
                  severityDistribution={severity}
                  incidentTrends={trends}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
