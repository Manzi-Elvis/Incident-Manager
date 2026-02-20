'use client';

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

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

export function AnalyticsCharts({
  severityDistribution,
  incidentTrends,
}: AnalyticsChartsProps) {
  // Prepare severity data
  const severityData = [
    { name: 'Critical', value: severityDistribution.critical },
    { name: 'High', value: severityDistribution.high },
    { name: 'Medium', value: severityDistribution.medium },
    { name: 'Low', value: severityDistribution.low },
  ];

  // Filter out empty data points for trends
  const filteredTrends = incidentTrends.filter((d) => d.count > 0);

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Severity Distribution Pie Chart */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4 slide-in">
        <div>
          <h3 className="font-semibold mb-1">Incident Severity Distribution</h3>
          <p className="text-xs text-muted-foreground">
            Breakdown of incidents by severity level
          </p>
        </div>

        {severityData.every((d) => d.value === 0) ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name}: ${value}`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(20, 20, 20)',
                  border: '1px solid rgb(55, 65, 81)',
                  borderRadius: '0.5rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {severityData.map((item, idx) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <span className="text-muted-foreground">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Trends Line Chart */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4 slide-in">
        <div>
          <h3 className="font-semibold mb-1">Incident Trends (30 days)</h3>
          <p className="text-xs text-muted-foreground">
            Daily incident count over the last month
          </p>
        </div>

        {filteredTrends.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={incidentTrends}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgb(55, 65, 81)"
              />
              <XAxis
                dataKey="date"
                stroke="rgb(107, 114, 128)"
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => date.split('-').slice(1).join('/')}
              />
              <YAxis stroke="rgb(107, 114, 128)" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(20, 20, 20)',
                  border: '1px solid rgb(55, 65, 81)',
                  borderRadius: '0.5rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="rgb(82, 82, 255)"
                dot={false}
                strokeWidth={2}
                name="Incidents"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Status Distribution Bar Chart */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4 slide-in">
        <div>
          <h3 className="font-semibold mb-1">Response Time by Severity</h3>
          <p className="text-xs text-muted-foreground">
            Average response time in hours
          </p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={[
              { severity: 'Critical', time: 0.5 },
              { severity: 'High', time: 2.0 },
              { severity: 'Medium', time: 4.0 },
              { severity: 'Low', time: 8.0 },
            ]}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(55, 65, 81)"
            />
            <XAxis
              dataKey="severity"
              stroke="rgb(107, 114, 128)"
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="rgb(107, 114, 128)" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(20, 20, 20)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="time" fill="rgb(82, 82, 255)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SLA Performance */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4 slide-in">
        <div>
          <h3 className="font-semibold mb-1">SLA Compliance</h3>
          <p className="text-xs text-muted-foreground">
            SLA adherence metrics over time
          </p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={[
              { week: 'Week 1', compliance: 95 },
              { week: 'Week 2', compliance: 92 },
              { week: 'Week 3', compliance: 88 },
              { week: 'Week 4', compliance: 91 },
            ]}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(55, 65, 81)"
            />
            <XAxis
              dataKey="week"
              stroke="rgb(107, 114, 128)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(20, 20, 20)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar
              dataKey="compliance"
              fill="rgb(34, 197, 94)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
