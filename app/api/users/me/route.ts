import type { NextRequest } from 'next/server';

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

// GET /api/users/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    // Check if we should use GrowthLab API
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';
    
    if (useGrowthLabApi) {
      return proxyToGrowthLab('/api/users/me', request);
    }

    // Fallback to mock data for development
    const token = getAuthToken(request);
    
    // In development mode, allow requests without token to return mock data
    // In production, this would require authentication
    if (!token && process.env.NODE_ENV === 'production') {
      return jsonResponse(
        {
          success: false,
          message: 'Authentication required',
        },
        401
      );
    }

    // Mock user data (in production, this comes from GrowthLab API)
    return jsonResponse({
      success: true,
      data: {
        id: 'current-user',
        name: 'GrowthLab',
        username: 'growthlabsg',
        email: 'growthlab.sg@gmail.com',
        bio: '↑ Building the "Linkedin for Startups"\nFounder & startup community\nWeekly events • Workshops • Networking',
        instagram: 'growthlab.sg',
        website: 'https://www.growthlab.sg',
        twitter: 'Growthlabsg',
        youtube: 'growthlabsg',
        tiktok: 'growthlab.sg',
        linkedin: '/in/arul-murugar',
        phone: '+65 8123 4567',
        createdAt: '2025-03-01T00:00:00.000Z', // March 2025
        updatedAt: new Date().toISOString(),
        logoUrl: null, // Will use gradient fallback
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get user profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// PUT /api/users/me - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Check if we should use GrowthLab API
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';
    
    if (useGrowthLabApi) {
      return proxyToGrowthLab('/api/users/me', request, {
        body: await request.text(),
      });
    }

    // Fallback to mock update for development
    const token = getAuthToken(request);
    
    if (!token) {
      return jsonResponse(
        {
          success: false,
          message: 'Authentication required',
        },
        401
      );
    }

    const body = await request.json();

    // Mock update response
    return jsonResponse({
      success: true,
      data: {
        id: 'current-user',
        ...body,
        updatedAt: new Date().toISOString(),
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
