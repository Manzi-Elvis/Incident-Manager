'use client';

import { useState } from 'react';
import { Copy, ChevronDown } from 'lucide-react';

interface LogsViewerProps {
  logs: any[];
}

export function LogsViewer({ logs }: LogsViewerProps) {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const handleCopy = (log: any) => {
    const logText = JSON.stringify(log, null, 2);
    navigator.clipboard.writeText(logText);
  };

  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 rounded-lg border border-dashed border-border">
        <p className="text-muted-foreground">No logs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {logs.map((log, index) => (
        <div
          key={log.id || index}
          className="rounded-lg border border-border bg-card hover:border-primary/50 transition-colors overflow-hidden"
        >
          <button
            onClick={() =>
              setExpandedLogId(
                expandedLogId === (log.id || index) ? null : (log.id || index)
              )
            }
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-card/80 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 text-left">
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  expandedLogId === (log.id || index) ? 'rotate-180' : ''
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {log.message || log.level || 'Log Entry'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
              {log.level && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    log.level === 'error'
                      ? 'bg-red-500/20 text-red-300'
                      : log.level === 'warning'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {log.level.toUpperCase()}
                </span>
              )}
            </div>
          </button>

          {expandedLogId === (log.id || index) && (
            <div className="border-t border-border px-4 py-3 bg-card/50">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Details
                </p>
                <button
                  onClick={() => handleCopy(log)}
                  className="p-1 rounded hover:bg-card transition-colors"
                  title="Copy log"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <pre className="text-xs text-muted-foreground bg-background rounded p-3 overflow-auto max-h-48">
                {JSON.stringify(log, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
