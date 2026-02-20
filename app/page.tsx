'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Navigation } from '@/components/navigation';
import { IncidentCard } from '@/components/incident-card';
import { getIncidents } from '@/lib/services/incident-service';
import type { IncidentWithDetails } from '@/lib/services/incident-service';
import { Search, Filter, Plus, ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/protected-route';

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Incident Manager</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 text-balance">
            Enterprise Incident Management Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Real-time incident tracking, AI-powered root cause analysis, and intelligent SLA management for modern enterprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Real-Time Tracking</h3>
              <p className="text-muted-foreground">
                Monitor incidents as they happen with real-time updates and instant notifications.
              </p>
            </div>
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Get intelligent root cause suggestions and automated incident insights.
              </p>
            </div>
            <div className="p-8 border border-border rounded-lg hover:border-primary/50 transition-colors">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">SLA Management</h3>
              <p className="text-muted-foreground">
                Intelligent SLA tracking with breach probability prediction and alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-muted-foreground">Enterprise Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">99.9%</p>
              <p className="text-muted-foreground">Platform Uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">50K+</p>
              <p className="text-muted-foreground">Incidents Managed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/10 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to streamline incident management?</h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of enterprises using Incident Manager to reduce MTTR and improve reliability.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Incident Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-primary/40" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <ProtectedRoute>
      <IncidentsPageContent />
    </ProtectedRoute>
  );
}

function IncidentsPageContent() {
  const [incidents, setIncidents] = useState<IncidentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    async function loadIncidents() {
      try {
        const data = await getIncidents({
          severity: severityFilter || undefined,
          status: statusFilter || undefined,
        });
        setIncidents(data);
      } catch (error) {
        console.error('Failed to load incidents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, [severityFilter, statusFilter]);

  const filteredIncidents = incidents.filter((incident) => {
    const query = searchQuery.toLowerCase();
    return (
      incident.title.toLowerCase().includes(query) ||
      incident.description.toLowerCase().includes(query) ||
      incident.id.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Navigation />
      <main className="flex-1">
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-balance">
                      Incident Management
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Monitor and manage critical incidents across your infrastructure
                    </p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" />
                    New Incident
                  </button>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search incidents by title, description, or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">All Statuses</option>
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incidents Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="space-y-4 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-primary/40" />
                  </div>
                  <p className="text-muted-foreground">Loading incidents...</p>
                </div>
              </div>
            ) : filteredIncidents.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredIncidents.map((incident) => (
                  <div key={incident.id} className="fade-in">
                    <IncidentCard incident={incident} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 rounded-lg border border-dashed border-border">
                <div className="text-center">
                  <Filter className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground">No incidents found</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Try adjusting your filters or search query
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
