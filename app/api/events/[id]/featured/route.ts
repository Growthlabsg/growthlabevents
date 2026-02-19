import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { setFeaturedEvent, isFeaturedEvent } from '@/lib/featuredEvents';

// POST /api/events/[id]/featured - Set featured status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { featured } = body;

    if (typeof featured !== 'boolean') {
      return jsonResponse(
        {
          success: false,
          message: 'Missing or invalid field: featured (boolean)',
        },
        400
      );
    }

    setFeaturedEvent(id, featured);

    return jsonResponse({
      success: true,
      data: {
        eventId: id,
        featured,
      },
      message: `Event ${featured ? 'marked as' : 'removed from'} featured`,
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to update featured status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// GET /api/events/[id]/featured - Get featured status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const featured = isFeaturedEvent(id);

    return jsonResponse({
      success: true,
      data: {
        eventId: id,
        featured,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get featured status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
