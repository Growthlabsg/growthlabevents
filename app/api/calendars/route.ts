import type { NextRequest } from 'next/server';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GET /api/calendars - Get user's calendars
export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with actual GrowthLab API call
    // const response = await fetch(`${process.env.GROWTHLAB_API_URL}/calendars`, {
    //   headers: {
    //     'Authorization': `Bearer ${request.headers.get('authorization')}`,
    //     'Content-Type': 'application/json',
    //   },
    // });

    return jsonResponse({
      success: true,
      data: [],
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to fetch calendars',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/calendars - Create a new calendar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required field: name',
        },
        400
      );
    }

    // TODO: Replace with actual GrowthLab API call
    // const response = await fetch(`${process.env.GROWTHLAB_API_URL}/calendars`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${request.headers.get('authorization')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body),
    // });

    return jsonResponse({
      success: true,
      data: {
        id: `calendar-${Date.now()}`,
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date().toISOString(),
      },
      message: 'Calendar created successfully',
    }, 201);
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to create calendar',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
