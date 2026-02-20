'use client';

import { Navigation } from '@/components/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { Settings, Users, Shield, Bell } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function SettingsPage() {
  const { role } = useAuth();

  // Redirect non-admin users
  if (role !== 'admin') {
    redirect('/');
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>
              <h1 className="text-3xl font-bold text-balance">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your incident management system configuration
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Team Settings */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Team Management</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Manage team members and their roles
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
                Manage Teams
              </button>
            </div>

            {/* Security Settings */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Security</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure API keys, webhooks, and integrations
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
                Manage Integrations
              </button>
            </div>

            {/* Notifications */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Notifications</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure alerts and notification preferences
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
                Notification Settings
              </button>
            </div>

            {/* System Settings */}
            <div className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">System Configuration</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Configure SLA thresholds, incident categories, and retention policies
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
                System Settings
              </button>
            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6 space-y-4">
              <h2 className="font-semibold text-red-300">Danger Zone</h2>
              <p className="text-sm text-muted-foreground">
                Irreversible actions. Proceed with caution.
              </p>
              <button className="px-4 py-2 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/10 transition-colors font-medium text-sm">
                Export Data
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
