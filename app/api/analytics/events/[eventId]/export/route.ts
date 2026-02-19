import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import {
  exportAttendanceToCSV,
  exportEventAnalyticsToCSV,
  getEventAnalytics,
} from '@/lib/analytics';
import { mockEvents } from '@/lib/mockData';

// GET /api/analytics/events/[eventId]/export - Export event data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'attendance' or 'analytics'
    const { eventId } = await params;

    if (type === 'attendance') {
      // Get attendance data
      const checkInResponse = await fetch(`${request.nextUrl.origin}/api/events/${eventId}/checkin`);
      const checkInData = await checkInResponse.json();

      if (!checkInData.success) {
        return jsonResponse(
          {
            success: false,
            message: 'Failed to get attendance data',
          },
          500
        );
      }

      const attendees = [
        ...(checkInData.data.checkedIn || []).map((a: any) => ({
          id: a.attendeeId,
          name: a.attendeeName,
          email: a.attendeeEmail,
          checkedInAt: a.checkedInAt,
          checkedOutAt: a.checkedOutAt,
        })),
      ];

      const csvContent = exportAttendanceToCSV(eventId, attendees);

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="attendance-${eventId}-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    if (type === 'analytics') {
      const event = mockEvents.find((e) => e.id === eventId);
      if (!event) {
        return jsonResponse(
          {
            success: false,
            message: 'Event not found',
          },
          404
        );
      }

      const totalRevenue = event.ticketTypes.reduce(
        (sum, ticket) => sum + ticket.price * ticket.sold,
        0
      );

      const checkInResponse = await fetch(`${request.nextUrl.origin}/api/events/${eventId}/checkin`);
      const checkInData = await checkInResponse.json();
      const checkIns = checkInData.success ? checkInData.data.totalCheckedIn : 0;
      const checkOuts = checkInData.success ? checkInData.data.totalCheckedOut : 0;

      const analytics = getEventAnalytics(eventId, {
        registeredCount: event.registeredCount,
        totalCapacity: event.totalCapacity || 0,
        revenue: totalRevenue,
        checkIns,
        checkOuts,
      });

      const csvContent = exportEventAnalyticsToCSV(analytics);

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-${eventId}-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid type. Use "attendance" or "analytics"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to export data',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
