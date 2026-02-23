'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { AIAnalysis } from '@/lib/services/incident-service';

interface AIAnalysisPanelProps {
  incidentId: string;
  existingAnalysis?: AIAnalysis;
  onAnalysisComplete?: (analysis: AIAnalysis) => void;
}

export function AIAnalysisPanel({
  incidentId,
  existingAnalysis,
  onAnalysisComplete,
}: AIAnalysisPanelProps) {
  const [logsInput, setLogsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | undefined>(
    existingAnalysis
  );
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!logsInput.trim()) {
      setError('Please paste logs to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockAnalysis: AIAnalysis = {
        id: Math.random().toString(36).substr(2, 9),
        incident_id: incidentId,
        logs_input: logsInput,
        summary:
          'Database connection pool exhaustion detected. The application attempted to establish more connections than the configured maximum of 100. This caused cascading failures in the API layer.',
        root_cause:
          'Inefficient connection handling in the ORM layer combined with a spike in concurrent requests. The idle timeout for connections was set too high (30 minutes), preventing connection reuse.',
        suggested_actions: [
          'Reduce idle timeout to 5 minutes in the database configuration',
          'Implement connection pooling middleware at the application level',
          'Add monitoring and alerting for connection pool utilization above 80%',
          'Review and optimize database query patterns to reduce connection time',
          'Scale database read replicas to handle increased load',
        ],
        created_at: new Date().toISOString(),
      };

      setAnalysis(mockAnalysis);
      onAnalysisComplete?.(mockAnalysis);
      setLogsInput('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to analyze logs'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI-Powered Log Analysis</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Paste application logs to get AI-powered analysis of potential root
          causes and recommended solutions.
        </p>

        <textarea
          value={logsInput}
          onChange={(e) => setLogsInput(e.target.value)}
          placeholder="Paste application logs here... (JSON, plaintext, or structured logs)"
          className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm"
          rows={8}
          disabled={loading}
        />

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !logsInput.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze Logs
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4 bounce-in">
          {/* Summary */}
          <div className="rounded-lg border border-border bg-card/50 p-6 space-y-2">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Summary
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Root Cause */}
          <div className="rounded-lg border border-border bg-card/50 p-6 space-y-2">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Root Cause
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.root_cause}
            </p>
          </div>

          {/* Suggested Actions */}
          <div className="rounded-lg border border-border bg-card/50 p-6 space-y-3">
            <h4 className="font-semibold text-sm text-foreground">
              Suggested Actions
            </h4>
            <ol className="space-y-2">
              {analysis.suggested_actions.map((action, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="font-semibold text-primary flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-muted-foreground">{action}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Analysis Metadata */}
          <div className="text-xs text-muted-foreground text-center py-2">
            Analysis completed at{' '}
            {new Date(analysis.created_at).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
