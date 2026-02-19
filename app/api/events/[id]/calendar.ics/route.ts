import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { mockEvents } from '@/lib/mockData';
import { generateICal } from '@/lib/calendarExport';

// GET /api/events/[id]/calendar.ics - Generate iCal file for event subscription
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = mockEvents.find((e) => e.id === id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const eventDate = new Date(event.date);
    const [hours, minutes] = event.time.split(':');
    eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Default to 2 hours duration if no end time
    const endDate = new Date(eventDate);
    endDate.setHours(endDate.getHours() + 2);

    const calendarEvent = {
      title: event.title,
      description: event.description,
      startDate: eventDate,
      endDate: endDate,
      location: event.location,
      url: `${request.nextUrl.origin}/events/${event.id}`,
    };

    const icalContent = generateICal(calendarEvent);

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_')}.ics"`,
      },
    });
  } catch (error) {
    return NextResponse.json('Failed to generate calendar file', { status: 500 });
  }
}
