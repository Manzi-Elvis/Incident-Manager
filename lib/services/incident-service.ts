import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Incident = {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  team_id: string;
  sla_threshold: number;
  sla_breached: boolean;
};

export type IncidentWithDetails = Incident & {
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  team?: {
    id: string;
    name: string;
  };
};

export type Activity = {
  id: string;
  incident_id: string;
  user_id: string;
  action_type: string;
  description: string;
  created_at: string;
};

export type Comment = {
  id: string;
  incident_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type AIAnalysis = {
  id: string;
  incident_id: string;
  logs_input: string;
  summary: string;
  root_cause: string;
  suggested_actions: string[];
  created_at: string;
};

export async function getIncidents(filter?: {
  status?: string;
  severity?: string;
  team_id?: string;
  assigned_to?: string;
}): Promise<IncidentWithDetails[]> {
  let query = supabase
    .from('incidents')
    .select(`
      *,
      assignee:users!assigned_to(id, name, email, avatar_url),
      team:teams(id, name)
    `);

  if (filter?.status) {
    query = query.eq('status', filter.status);
  }
  if (filter?.severity) {
    query = query.eq('severity', filter.severity);
  }
  if (filter?.team_id) {
    query = query.eq('team_id', filter.team_id);
  }
  if (filter?.assigned_to) {
    query = query.eq('assigned_to', filter.assigned_to);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getIncidentById(id: string): Promise<IncidentWithDetails | null> {
  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      assignee:users!assigned_to(id, name, email, avatar_url),
      team:teams(id, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function getIncidentActivities(incidentId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('incident_activities')
    .select('*')
    .eq('incident_id', incidentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getIncidentComments(incidentId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('incident_comments')
    .select('*')
    .eq('incident_id', incidentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getIncidentLogs(incidentId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('incident_logs')
    .select('*')
    .eq('incident_id', incidentId)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAIAnalysis(incidentId: string): Promise<AIAnalysis | null> {
  const { data, error } = await supabase
    .from('ai_analyses')
    .select('*')
    .eq('incident_id', incidentId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createAIAnalysis(
  incidentId: string,
  logsInput: string,
  summary: string,
  rootCause: string,
  suggestedActions: string[]
): Promise<AIAnalysis> {
  const { data, error } = await supabase
    .from('ai_analyses')
    .insert({
      incident_id: incidentId,
      logs_input: logsInput,
      summary,
      root_cause: rootCause,
      suggested_actions: suggestedActions,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAnalytics(teamId?: string) {
  let query = supabase.from('incidents').select('*');
  if (teamId) {
    query = query.eq('team_id', teamId);
  }

  const { data: incidents, error } = await query;
  if (error) throw error;

  const total = incidents?.length || 0;
  const resolved = incidents?.filter((i) => i.status === 'resolved').length || 0;
  const critical = incidents?.filter((i) => i.severity === 'critical').length || 0;
  const breached = incidents?.filter((i) => i.sla_breached).length || 0;

  // Calculate MTTR (simplified - average time to resolve)
  const resolvedIncidents = incidents?.filter((i) => i.status === 'resolved') || [];
  const mttr =
    resolvedIncidents.length > 0
      ? resolvedIncidents.reduce((sum, i) => {
          const created = new Date(i.created_at).getTime();
          const updated = new Date(i.updated_at).getTime();
          return sum + (updated - created);
        }, 0) / resolvedIncidents.length / 3600000 // Convert to hours
      : 0;

  return {
    total,
    resolved,
    critical,
    breached,
    mttr: Math.round(mttr),
  };
}

export async function getSeverityDistribution(teamId?: string) {
  let query = supabase.from('incidents').select('severity');
  if (teamId) {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const distribution = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  (data || []).forEach((incident: any) => {
    if (incident.severity in distribution) {
      distribution[incident.severity as keyof typeof distribution]++;
    }
  });

  return distribution;
}

export async function getIncidentTrends(teamId?: string, days: number = 30) {
  let query = supabase.from('incidents').select('created_at');
  if (teamId) {
    query = query.eq('team_id', teamId);
  }

  const { data, error } = await query;
  if (error) throw error;

  const now = new Date();
  const trends: { date: string; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const count = (data || []).filter((incident: any) => {
      return incident.created_at.split('T')[0] === dateStr;
    }).length;

    trends.push({ date: dateStr, count });
  }

  return trends;
}
