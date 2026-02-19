import type { NextRequest } from 'next/server';
import {
  createOrUpdateNameCard,
  getNameCard,
} from '@/lib/networking';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GET /api/networking/namecard - Get name card
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing userId parameter',
        },
        400
      );
    }

    const nameCard = getNameCard(userId);

    if (!nameCard) {
      return jsonResponse(
        {
          success: false,
          message: 'Name card not found',
        },
        404
      );
    }

    return jsonResponse({
      success: true,
      data: nameCard,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get name card',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/networking/namecard - Create or update name card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, title, company, email, phone, bio, avatar, socialLinks } = body;

    if (!userId || !name || !email) {
      return jsonResponse(
        {
          success: false,
          message: 'Missing required fields: userId, name, email',
        },
        400
      );
    }

    const nameCard = createOrUpdateNameCard({
      userId,
      name,
      title,
      company,
      email,
      phone,
      bio,
      avatar,
      socialLinks: socialLinks || {},
    });

    return jsonResponse({
      success: true,
      data: nameCard,
      message: 'Name card saved successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to save name card',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
