'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { AIAnalysisPanel } from '@/components/ai-analysis-panel';
import { AlertCircle } from 'lucide-react';

export default function LogsPage() {
  const [selectedIncidentId] = useState('demo-incident-001');

  return (
    <>
      <Navigation />
      <main className="flex-1 min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-balance">Log Analysis</h1>
              <p className="text-muted-foreground">
                Paste application logs and get AI-powered insights about potential
                issues and root causes
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Info Alert */}
            <div className="flex gap-3 p-4 rounded-lg border border-border bg-card/50">
              <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  How it works
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Our AI analysis engine can process various log formats including
                  JSON, plaintext, and structured logs. It will identify error
                  patterns, performance bottlenecks, and suggest remediation steps.
                </p>
              </div>
            </div>

            {/* AI Analysis Panel */}
            <AIAnalysisPanel incidentId={selectedIncidentId} />
          </div>
        </div>
      </main>
    </>
  );
}
