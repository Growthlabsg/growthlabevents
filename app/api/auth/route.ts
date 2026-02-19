import type { NextRequest } from 'next/server';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email || !body.password) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required fields: email, password',
        },
        400
      );
    }

    // TODO: Replace with actual GrowthLab API call
    // const response = await fetch(`${process.env.GROWTHLAB_API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: body.email,
    //     password: body.password,
    //   }),
    // });

    // Mock response
    return jsonResponse({
      success: true,
      data: {
        token: `mock-token-${Date.now()}`,
        user: {
          id: 'user-1',
          name: 'GrowthLab User',
          email: body.email,
        },
      },
      message: 'Login successful',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      401
    );
  }
}
