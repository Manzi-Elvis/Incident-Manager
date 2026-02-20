-- Create ENUM types
CREATE TYPE user_role AS ENUM ('admin', 'engineer', 'client');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved', 'closed');
CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE activity_type AS ENUM ('comment', 'status_change', 'assignment', 'ai_analysis', 'log_upload');

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'engineer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Create incidents table
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status incident_status NOT NULL DEFAULT 'open',
  severity incident_severity NOT NULL DEFAULT 'medium',
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  sla_minutes INTEGER DEFAULT 240,
  breach_at TIMESTAMP WITH TIME ZONE
);

-- Create activity/timeline table
CREATE TABLE incident_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  activity_type activity_type NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE incident_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logs table for storing uploaded/pasted logs
CREATE TABLE incident_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  log_content TEXT NOT NULL,
  log_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI analysis results table
CREATE TABLE ai_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  log_id UUID REFERENCES incident_logs(id) ON DELETE SET NULL,
  summary TEXT,
  root_cause TEXT,
  recommendations TEXT,
  confidence_score DECIMAL(3, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create SLA metrics table
CREATE TABLE sla_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  response_time_minutes INTEGER,
  resolution_time_minutes INTEGER,
  breach BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_incidents_team_id ON incidents(team_id);
CREATE INDEX idx_incidents_assigned_to ON incidents(assigned_to);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX idx_incident_activities_incident_id ON incident_activities(incident_id);
CREATE INDEX idx_incident_comments_incident_id ON incident_comments(incident_id);
CREATE INDEX idx_incident_logs_incident_id ON incident_logs(incident_id);
CREATE INDEX idx_ai_analyses_incident_id ON ai_analyses(incident_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users (can see their own and team members)
CREATE POLICY "users_select_policy" ON users
  FOR SELECT USING (
    auth.uid() = users.id OR 
    EXISTS (
      SELECT 1 FROM team_members tm1
      JOIN team_members tm2 ON tm1.team_id = tm2.team_id
      WHERE tm1.user_id = auth.uid() AND tm2.user_id = users.id
    )
  );

-- RLS Policies for incidents (can see team incidents)
CREATE POLICY "incidents_select_policy" ON incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = incidents.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "incidents_insert_policy" ON incidents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = incidents.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "incidents_update_policy" ON incidents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = incidents.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- RLS Policies for incident_activities
CREATE POLICY "incident_activities_select_policy" ON incident_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = incident_activities.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "incident_activities_insert_policy" ON incident_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = incident_activities.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for incident_comments
CREATE POLICY "incident_comments_select_policy" ON incident_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = incident_comments.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "incident_comments_insert_policy" ON incident_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = incident_comments.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for incident_logs
CREATE POLICY "incident_logs_select_policy" ON incident_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = incident_logs.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "incident_logs_insert_policy" ON incident_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = incident_logs.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for ai_analyses
CREATE POLICY "ai_analyses_select_policy" ON ai_analyses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = ai_analyses.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "ai_analyses_insert_policy" ON ai_analyses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = ai_analyses.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for sla_metrics
CREATE POLICY "sla_metrics_select_policy" ON sla_metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = sla_metrics.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "sla_metrics_insert_policy" ON sla_metrics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM incidents
      WHERE incidents.id = sla_metrics.incident_id
      AND EXISTS (
        SELECT 1 FROM team_members
        WHERE team_members.team_id = incidents.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- RLS Policies for teams and team_members
CREATE POLICY "teams_select_policy" ON teams
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "team_members_select_policy" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm2
      WHERE tm2.team_id = team_members.team_id
      AND tm2.user_id = auth.uid()
    )
  );
