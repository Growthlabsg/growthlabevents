import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { mockEvents } from '@/lib/mockData';
import { getWaitlist } from '@/lib/waitlist';

// GET /api/events/[id]/analytics - Get event analytics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
      return jsonResponse(
        {
          success: false,
          message: 'Event not found',
        },
        404
      );
    }

    // Get waitlist count
    const waitlist = getWaitlist(id);

    // Calculate registration rate
    const registrationRate = event.totalCapacity
      ? (event.registeredCount / event.totalCapacity) * 100
      : 0;

    // Calculate revenue (if paid tickets)
    const revenue = event.ticketTypes.reduce((sum, ticket) => {
      return sum + ticket.price * ticket.sold;
    }, 0);

    // Calculate average ticket price
    const totalTickets = event.ticketTypes.reduce((sum, ticket) => sum + ticket.sold, 0);
    const avgTicketPrice = totalTickets > 0 ? revenue / totalTickets : 0;

    return jsonResponse({
      success: true,
      data: {
        eventId: id,
        eventTitle: event.title,
        registeredCount: event.registeredCount,
        totalCapacity: event.totalCapacity,
        registrationRate: Math.round(registrationRate * 100) / 100,
        waitlistCount: waitlist.length,
        revenue,
        avgTicketPrice: Math.round(avgTicketPrice * 100) / 100,
        ticketTypes: event.ticketTypes.map((ticket) => ({
          id: ticket.id,
          name: ticket.name,
          price: ticket.price,
          sold: ticket.sold,
          revenue: ticket.price * ticket.sold,
        })),
        status: event.status,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get analytics',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
