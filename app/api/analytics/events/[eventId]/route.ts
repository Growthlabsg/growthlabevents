import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { getEventAnalytics } from '@/lib/analytics';
import { mockEvents } from '@/lib/mockData';

// GET /api/analytics/events/[eventId] - Get event analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
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

    // Calculate revenue
    const totalRevenue = event.ticketTypes.reduce(
      (sum, ticket) => sum + ticket.price * ticket.sold,
      0
    );

    // Get check-in data (would come from check-in API in production)
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

    return jsonResponse({
      success: true,
      data: analytics,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get event analytics',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
