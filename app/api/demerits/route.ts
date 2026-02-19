import type { NextRequest } from 'next/server';
import {
  addDemerit,
  getUserDemerits,
  getUserTotalPoints,
  getDemeritStats,
  DEFAULT_DEMERIT_REASONS,
  setDemeritSystemEnabled,
  getDemeritSettings,
} from '@/lib/demeritSystem';

// Helper to create JSON response
function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

// GET /api/demerits - Get demerits for a user or stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const calendarId = searchParams.get('calendarId');
    const stats = searchParams.get('stats') === 'true';

    if (stats) {
      const statistics = getDemeritStats(calendarId || undefined);
      return jsonResponse({
        success: true,
        data: statistics,
      });
    }

    if (userId) {
      const demerits = getUserDemerits(userId);
      const totalPoints = getUserTotalPoints(userId);

      return jsonResponse({
        success: true,
        data: {
          demerits,
          totalPoints,
        },
      });
    }

    if (calendarId) {
      const settings = getDemeritSettings(calendarId);
      return jsonResponse({
        success: true,
        data: {
          settings,
          reasons: DEFAULT_DEMERIT_REASONS,
        },
      });
    }

    // Get demerit reasons
    return jsonResponse({
      success: true,
      data: {
        reasons: DEFAULT_DEMERIT_REASONS,
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to get demerits',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}

// POST /api/demerits - Add a demerit or configure settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'add') {
      const { userId, reason, points, eventId, description, createdBy } = body;

      if (!userId || !reason || !points) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required fields: userId, reason, points',
          },
          400
        );
      }

      const demerit = addDemerit(userId, reason, points, eventId, description, createdBy);

      return jsonResponse({
        success: true,
        data: demerit,
        message: 'Demerit added successfully',
      });
    }

    if (action === 'configure') {
      const { calendarId, enabled, pointsThreshold } = body;

      if (!calendarId) {
        return jsonResponse(
          {
            success: false,
            message: 'Missing required field: calendarId',
          },
          400
        );
      }

      setDemeritSystemEnabled(calendarId, enabled ?? false, pointsThreshold ?? 50);
      const settings = getDemeritSettings(calendarId);

      return jsonResponse({
        success: true,
        data: settings,
        message: 'Demerit system configured successfully',
      });
    }

    return jsonResponse(
      {
        success: false,
        message: 'Invalid action. Use "add" or "configure"',
      },
      400
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        message: 'Failed to process demerit request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
}
