import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { mockAttendees } from '@/lib/mockData';

// GET /api/events/[id]/attendees - Get event attendees directory
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const attendees = mockAttendees[id] || [];

    return jsonResponse({
      success: true,
      data: {
        eventId: id,
        attendees: attendees.map((attendee) => ({
          id: attendee.id,
          name: attendee.name,
          avatar: attendee.avatar,
          email: (attendee as { email?: string }).email,
        })),
        total: attendees.length,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get attendees',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
