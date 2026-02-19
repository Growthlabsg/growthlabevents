import type { NextRequest } from 'next/server';
import { mockEvents } from '@/lib/mockData';

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'https://api.growthlab.sg';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

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
    const body = options.body || (request.method !== 'GET' && request.method !== 'HEAD' 
      ? await request.text() 
      : undefined);

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

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    // Check if we should use GrowthLab API or mock data
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';
    
    if (useGrowthLabApi) {
      const { searchParams } = new URL(request.url);
      const query = searchParams.toString();
      return proxyToGrowthLab(`/api/events${query ? `?${query}` : ''}`, request);
    }

    // Fallback to mock data for development
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'upcoming' | 'past' | null;
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const organizerId = searchParams.get('organizerId');

    let filteredEvents = [...mockEvents];

    if (status) {
      filteredEvents = filteredEvents.filter(event => {
        if (status === 'upcoming') {
          return event.status === 'upcoming' || event.status === 'live';
        }
        return event.status === 'past' || event.status === 'cancelled';
      });
    }

    if (location) {
      filteredEvents = filteredEvents.filter(event =>
        event.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (category) {
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(category.toLowerCase()) ||
        event.description.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (organizerId) {
      // Filter by organizer - in production, this would check event.organizer.id
      // For now, we'll check if organizer name matches (mock data)
      filteredEvents = filteredEvents.filter(event =>
        event.organizer.name.toLowerCase().includes('growthlab') ||
        event.organizer.name.toLowerCase().includes(organizerId.toLowerCase())
      );
    }

    return jsonResponse({
      success: true,
      data: filteredEvents,
      pagination: {
        page: 1,
        limit: filteredEvents.length,
        total: filteredEvents.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get events',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    // Check if we should use GrowthLab API
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';
    
    if (useGrowthLabApi) {
      return proxyToGrowthLab('/api/events', request, {
        body: await request.text(),
      });
    }

    // Fallback to mock creation for development
    const body = await request.json();
    const { title, description, startDate, startTime, location, locationType, visibility } = body;

    if (!title || !startDate || !startTime) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required fields: title, startDate, startTime',
        },
        400
      );
    }

    const newEvent = {
      id: `event-${Date.now()}`,
      title,
      description: description || '',
      date: startDate,
      time: startTime,
      location: location || '',
      locationType: locationType || 'physical',
      organizer: {
        id: 'current-user',
        name: 'Current User',
      },
      ticketTypes: [{
        id: '1',
        name: 'General Admission',
        price: 0,
        sold: 0,
      }],
      registeredCount: 0,
      status: 'upcoming' as const,
      visibility: visibility || 'public',
      createdAt: new Date().toISOString(),
    };

    return jsonResponse({
      success: true,
      data: newEvent,
      message: 'Event created successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to create event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
