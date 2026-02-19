import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { mockEvents } from '@/lib/mockData';

const GROWTHLAB_API_URL =
  process.env.GROWTHLAB_API_URL ||
  process.env.NEXT_PUBLIC_GROWTHLAB_API_URL ||
  'https://api.growthlab.sg';

// Helper to get auth token from request
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// Proxy request to GrowthLab API
async function proxyToGrowthLab(
  endpoint: string,
  request: NextRequest,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken(request);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Platform': 'growthlab-events',
    'X-Platform-Version': '1.0.0',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const url = `${GROWTHLAB_API_URL}${endpoint}`;
    const body =
      options.body ||
      (request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined);

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    const data = await response.json().catch(() => ({}));

    return jsonResponse(data, response.status);
  } catch (error) {
    console.error('GrowthLab API proxy error:', error);
    return jsonResponse(
      {
        success: false,
        message: 'Failed to connect to GrowthLab API',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// GET /api/events/[id] - Get event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if we should use GrowthLab API
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';

    if (useGrowthLabApi) {
      return proxyToGrowthLab(`/api/events/${id}`, request);
    }

    // Fallback to mock data for development
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

    return jsonResponse({
      success: true,
      data: event,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if we should use GrowthLab API
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';

    if (useGrowthLabApi) {
      return proxyToGrowthLab(`/api/events/${id}`, request, {
        body: await request.text(),
      });
    }

    // Fallback to mock update for development
    const body = await request.json();
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

    const updatedEvent = {
      ...event,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return jsonResponse({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if we should use GrowthLab API
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';

    if (useGrowthLabApi) {
      return proxyToGrowthLab(`/api/events/${id}`, request);
    }

    // Fallback to mock delete for development
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

    return jsonResponse({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to delete event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
