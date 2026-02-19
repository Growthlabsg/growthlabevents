import type { NextRequest } from 'next/server';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST /api/events/[id]/register - Register for an event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.ticketTypeId) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required field: ticketTypeId',
        },
        400
      );
    }

    // TODO: Replace with actual GrowthLab API call
    // const response = await fetch(`${process.env.GROWTHLAB_API_URL}/events/${id}/register`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${request.headers.get('authorization')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ticketTypeId: body.ticketTypeId,
    //     answers: body.answers || {},
    //   }),
    // });

    return jsonResponse({
      success: true,
      data: {
        registrationId: `reg-${Date.now()}`,
      },
      message: 'Successfully registered for event',
    },201);
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to register for event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

