import type { NextRequest } from 'next/server';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const GROWTHLAB_API_URL = process.env.GROWTHLAB_API_URL || process.env.NEXT_PUBLIC_GROWTHLAB_API_URL || 'https://api.growthlab.sg';

// Helper to get auth token from request
function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

// POST /api/users/me/logo - Upload user logo
export async function POST(request: NextRequest) {
  try {
    // Check if we should use GrowthLab API
    const useGrowthLabApi = process.env.USE_GROWTHLAB_API === 'true';
    
    if (useGrowthLabApi) {
      const token = getAuthToken(request);
      const formData = await request.formData();
      
      const headers: Record<string, string> = {
        'X-Platform': 'growthlab-events',
        'X-Platform-Version': '1.0.0',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await fetch(`${GROWTHLAB_API_URL}/api/users/me/logo`, {
          method: 'POST',
          headers,
          body: formData,
        });

        const data = await response.json();
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

    // Fallback to mock upload for development
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

    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return jsonResponse(
        {
          success: false,
          message: 'No file provided',
        },
        400
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return jsonResponse(
        {
          success: false,
          message: 'File size must be less than 5MB',
        },
        400
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return jsonResponse(
        {
          success: false,
          message: 'File must be an image',
        },
        400
      );
    }

    // Mock upload response (in production, upload to GrowthLab storage)
    const mockLogoUrl = `/uploads/logos/${Date.now()}-${file.name}`;

    return jsonResponse({
      success: true,
      data: {
        logoUrl: mockLogoUrl,
      },
      message: 'Logo uploaded successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to upload logo',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

