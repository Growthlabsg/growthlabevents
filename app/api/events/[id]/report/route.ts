import type { NextRequest } from 'next/server';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// In-memory storage for reports (in production, use database)
const reports: Array<{
  eventId: string;
  reason: string;
  description: string;
  reportedAt: string;
  reportedBy?: string;
}> = [];

// POST /api/events/[id]/report - Report an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason, description, reportedBy } = body;

    if (!reason) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required field: reason',
        },
        400
      );
    }

    const validReasons = [
      'spam',
      'inappropriate',
      'misleading',
      'duplicate',
      'other'
    ];

    if (!validReasons.includes(reason)) {
      return jsonResponse(
        {
          success: false,
          message: `Invalid reason. Must be one of: ${validReasons.join(', ')}`,
        },
        400
      );
    }

    reports.push({
      eventId: id,
      reason,
      description: description || '',
      reportedAt: new Date().toISOString(),
      reportedBy: reportedBy || 'anonymous',
    });

    return jsonResponse({
      success: true,
      data: {
        eventId: id,
        reportId: `report-${Date.now()}`,
      },
      message: 'Event reported successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to report event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// GET /api/events/[id]/report - Get reports for an event (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventReports = reports.filter(r => r.eventId === id);

    return jsonResponse({
      success: true,
      data: {
        eventId: id,
        reports: eventReports,
        count: eventReports.length,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get reports',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

