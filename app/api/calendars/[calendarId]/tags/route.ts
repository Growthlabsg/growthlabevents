import type { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api-response';
import { createEventTag, getEventTags } from '@/lib/eventTags';

// GET /api/calendars/[calendarId]/tags - Get tags for a calendar
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  try {
    const { calendarId } = await params;
    const tags = getEventTags(calendarId);

    return jsonResponse({
      success: true,
      data: {
        calendarId,
        tags,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get tags',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/calendars/[calendarId]/tags - Create a new tag
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ calendarId: string }> }
) {
  try {
    const { calendarId } = await params;
    const body = await request.json();
    const { name, color } = body;

    if (!name || typeof name !== 'string') {
      return jsonResponse(
        {
          success: false,
          message: 'Missing or invalid "name" field',
        },
        400
      );
    }

    const tag = createEventTag(name, color || '#ef4444', calendarId);

    return jsonResponse({
      success: true,
      data: tag,
      message: 'Tag created successfully',
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to create tag',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
