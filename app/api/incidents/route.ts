import { getIncidents } from '@/lib/services/incident-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const severity = searchParams.get('severity') || undefined;
    const status = searchParams.get('status') || undefined;
    const team_id = searchParams.get('team_id') || undefined;
    const assigned_to = searchParams.get('assigned_to') || undefined;

    const incidents = await getIncidents({
      severity: severity as any,
      status: status as any,
      team_id,
      assigned_to,
    });

    return NextResponse.json(incidents);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}
