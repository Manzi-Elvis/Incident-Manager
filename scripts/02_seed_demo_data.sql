-- Insert demo users
INSERT INTO users (id, email, full_name, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'admin@example.com', 'Sarah Chen', 'admin'),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'engineer1@example.com', 'Marcus Johnson', 'engineer'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'engineer2@example.com', 'Priya Patel', 'engineer'),
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'client@example.com', 'Alex Rivera', 'client'),
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'ops@example.com', 'Jordan Williams', 'engineer');

-- Insert demo team
INSERT INTO teams (id, name, created_by) VALUES
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, 'Platform Engineering', '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- Insert team members
INSERT INTO team_members (team_id, user_id) VALUES
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid),
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid),
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid),
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid),
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid);

-- Insert demo incidents
INSERT INTO incidents (id, title, description, status, severity, team_id, assigned_to, created_by, created_at, resolved_at, sla_minutes, breach_at) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, 'Production Database Connection Pool Exhausted', 'Database connection pool reaching capacity. Multiple microservices unable to establish connections. Affecting API response times and user transactions.', 'investigating', 'critical', '650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, NOW() - INTERVAL '45 minutes', NULL, 120, NOW() + INTERVAL '75 minutes'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, 'API Gateway Rate Limiting Issues', 'Rate limiter misconfigured allowing DDoS-like traffic patterns. Customer API calls being rejected. Auto-scaling triggered.', 'open', 'critical', '650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, NOW() - INTERVAL '120 minutes', NULL, 120, NOW() - INTERVAL '60 minutes'),
  ('750e8400-e29b-41d4-a716-446655440003'::uuid, 'Cache Layer Invalidation Failure', 'Redis cluster becoming unresponsive. Causing cache miss storms. Database receiving 10x normal query load.', 'investigating', 'high', '650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, NOW() - INTERVAL '90 minutes', NULL, 240, NULL),
  ('750e8400-e29b-41d4-a716-446655440004'::uuid, 'Memory Leak in Payment Service', 'Payment processing service memory usage steadily increasing. Eventual OOM kill expected in 2-3 hours.', 'resolved', 'high', '650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, NOW() - INTERVAL '8 hours', NOW() - INTERVAL '2 hours', 240, NULL),
  ('750e8400-e29b-41d4-a716-446655440005'::uuid, 'Disk Space Warning on Storage Node', 'Storage node 4 reaching 85% capacity. Backup job running and consuming additional space.', 'closed', 'medium', '650e8400-e29b-41d4-a716-446655440001'::uuid, NULL, '550e8400-e29b-41d4-a716-446655440005'::uuid, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', 480, NULL),
  ('750e8400-e29b-41d4-a716-446655440006'::uuid, 'SSL Certificate Expiration Warning', 'Primary domain SSL certificate expiring in 14 days. Renewal process needs to be initiated.', 'open', 'low', '650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, NOW() - INTERVAL '5 days', NULL, 1440, NULL),
  ('750e8400-e29b-41d4-a716-446655440007'::uuid, 'Kubernetes Node Unschedulable', 'K8s node becoming unschedulable due to memory pressure. Pods unable to schedule new workloads.', 'investigating', 'high', '650e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, NOW() - INTERVAL '30 minutes', NULL, 240, NULL);

-- Insert activities/timeline
INSERT INTO incident_activities (incident_id, user_id, activity_type, content) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'status_change', 'Incident created and assigned to Marcus'),
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'assignment', 'Assigned to Marcus Johnson'),
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'comment', 'Started investigation. Checking database logs and connection metrics.'),
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'ai_analysis', 'AI analysis completed. Likely cause identified as connection timeout spike.'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, 'status_change', 'Incident created and marked as critical'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'comment', 'Identified anomalous traffic patterns. Implementing rate limiting adjustments.'),
  ('750e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'status_change', 'Escalated to high priority'),
  ('750e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'comment', 'Memory profiling identified leak in transaction handler'),
  ('750e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'comment', 'Applied patch and deployed to production'),
  ('750e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'status_change', 'Resolved');

-- Insert comments
INSERT INTO incident_comments (incident_id, user_id, content) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'I''ve checked the connection pool configurations and found that the max_connections parameter is set too low for peak load. Increasing to 500.'),
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Good find. Let''s also check the query performance on tables with large datasets.'),
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, 'Monitoring shows improvement after connection pool adjustment. Still investigating secondary issues.'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, 'Traffic analysis complete. Traffic spike originated from a buggy mobile app version making duplicate requests.'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, 'Coordinating with mobile team to push app update to users. In the meantime, tightening rate limits per IP.'),
  ('750e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, 'Redis cluster health check shows nodes 2 and 4 are lagging. Rebalancing cluster.');

-- Insert logs
INSERT INTO incident_logs (incident_id, user_id, log_content, log_type) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '[2024-02-20 14:32:15.412] ERROR: connection timeout after 30s attempting to acquire connection from pool (timeout expired). Available connections: 0/500. Active queries: 485. Queue length: 2341. Connections waiting: 156. Error rate: 45.2%', 'application'),
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440001'::uuid, '[2024-02-20 14:35:22.891] WARN: Connection pool exhaustion detected. Recommend increasing max_connections parameter from current value. Current load: 98% of capacity. Response time SLA: 450ms (exceeding target of 200ms).', 'database'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid, '[2024-02-20 14:12:45.123] ALERT: Rate limiter hit for 45,231 requests in last 5min. Top source IP: 203.0.113.42 (18,234 req/5min). Requests from mobile app v2.3.1: 92% of total traffic. Blocking suspected bot traffic detected on endpoints.', 'api'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, '[2024-02-20 14:25:10.456] CRITICAL: Gateway latency spike. p99 latency: 8200ms (normal: 45ms). p95 latency: 3400ms. Processing capacity at 104% of limit. Auto-scaling triggered: spawning 12 new instances.', 'infrastructure'),
  ('750e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid, '[2024-02-20 14:18:33.789] ERROR: Redis READONLY error on node redis-cluster-2.prod. Node response time: 850ms (normal: 2ms). Memory usage: 94.2%. Eviction policy triggered. Cache hit rate dropped from 87% to 23%.', 'cache');

-- Insert AI analyses
INSERT INTO ai_analyses (incident_id, log_id, summary, root_cause, recommendations, confidence_score) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, (SELECT id FROM incident_logs WHERE incident_id = '750e8400-e29b-41d4-a716-446655440001'::uuid LIMIT 1), 
   'Database connection pool exhaustion causing cascading failures across API endpoints. Queue buildup indicates sustained high load exceeding configured capacity.',
   'Connection pool max_connections parameter (500) insufficient for current peak load (485 active + 2341 queued). Long-running queries holding connections. Missing connection timeout strategy.',
   '1. Increase max_connections to 750-1000 based on workload analysis. 2. Implement connection pooling at application layer. 3. Optimize slow queries causing connection holds. 4. Add connection timeout monitoring.',
   0.92),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, (SELECT id FROM incident_logs WHERE incident_id = '750e8400-e29b-41d4-a716-446655440002'::uuid LIMIT 1),
   'Abnormal traffic spike from mobile clients causing rate limiter activation. Source IP concentration indicates coordinated retry pattern.',
   'Mobile app v2.3.1 bug causing duplicate request retry logic on network timeouts. Single source IP generating 40% of total traffic (18k req/5min vs normal 500 req/5min).',
   '1. Push critical app update v2.3.2 with retry backoff fix. 2. Whitelist known good traffic patterns. 3. Implement circuit breaker in mobile app. 4. Alert on IP concentration metrics.',
   0.88);

-- Insert SLA metrics
INSERT INTO sla_metrics (incident_id, response_time_minutes, resolution_time_minutes, breach) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, 3, NULL, FALSE),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, 5, NULL, TRUE),
  ('750e8400-e29b-41d4-a716-446655440003'::uuid, 8, NULL, FALSE),
  ('750e8400-e29b-41d4-a716-446655440004'::uuid, 12, 360, FALSE),
  ('750e8400-e29b-41d4-a716-446655440005'::uuid, 45, 1440, FALSE),
  ('750e8400-e29b-41d4-a716-446655440006'::uuid, 240, NULL, FALSE),
  ('750e8400-e29b-41d4-a716-446655440007'::uuid, 6, NULL, FALSE);
